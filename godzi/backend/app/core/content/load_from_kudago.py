from __future__ import annotations

import logging
import re
from datetime import datetime
from typing import Any

import requests
from sqlmodel import Session

from app.core.content.seed_utils import (
    create_or_update_entity_with_relations,
    get_entity_by_name,
    set_entity_photo_if_empty,
)
from app.models.entity import EntityCreate

logger = logging.getLogger(__name__)

compare_category_place = {
    "restaurants": [3],
    "bar": [29],
    "clubs": [28],
    "museums": [5],
    "park": [6],
    "amusement": [7],
    "cinema": [8],
    "theatre": [9],
}

compare_tags_for_category_3 = {
    "пышки": [14],
    "грузинская": [15],
    "итальянская": [16],
    "паназиатская": [17],
    "французская": [18],
    "тематический": [19],
    "корейская": [21],
    "китайская": [22],
    "японская": [23],
    "детские кафе": [25],
}

compare_tags_for_category_9 = {
    "куклы": [46],
    "сатира": [51],
}

compare_tags_for_category_29 = {
    "гриль": [69],
    "коктейли": [72],
}

compare_tags_for_category_7 = {
    "зоопарки": [38],
    "парки аттракционов": [39],
}

compare_category_event = {
    "exhibition": [10],
    "concert": [11],
    "festival": [12],
}

compare_tags_for_our_tags = {
    "18+": [3],
    "живая музыка": [6],
}

dict_months = {
    1: "Января",
    2: "Февраля",
    3: "Марта",
    4: "Апреля",
    5: "Мая",
    6: "Июня",
    7: "Июля",
    8: "Августа",
    9: "Сентября",
    10: "Октября",
    11: "Ноября",
    12: "Декабря",
}

KUDAGO_TIMEOUT = 30


def _request_json(url: str) -> dict[str, Any]:
    response = requests.get(url, timeout=KUDAGO_TIMEOUT)
    response.raise_for_status()
    return response.json()


def _normalize_text(value: Any) -> str:
    if value is None:
        return ""
    if isinstance(value, list):
        return ", ".join(str(item) for item in value if item)
    return str(value)


def _normalize_title(title: str) -> str:
    if not title:
        return ""
    return title[0].upper() + title[1:] if not title[0].isupper() else title


def parser_categories_tags_place(category_kudago: list[str], tags_kudago: list[str]) -> tuple[list[int], list[int]]:
    our_category_list: list[int] = []

    for category in category_kudago:
        if category in compare_category_place:
            our_category_list += compare_category_place[category]

    list_our_tags: list[int] = []
    list_category_from_tags: list[int] = []

    for tag in tags_kudago:
        if tag in compare_tags_for_our_tags:
            list_our_tags += compare_tags_for_our_tags[tag]
            continue

        if tag in compare_tags_for_category_3:
            list_category_from_tags += compare_tags_for_category_3[tag]
            if 3 in our_category_list:
                our_category_list.remove(3)
            continue

        if tag in compare_tags_for_category_7:
            list_category_from_tags += compare_tags_for_category_7[tag]
            if 7 in our_category_list:
                our_category_list.remove(7)
            continue

        if tag in compare_tags_for_category_9:
            list_category_from_tags += compare_tags_for_category_9[tag]
            if 9 in our_category_list:
                our_category_list.remove(9)
            continue

        if tag in compare_tags_for_category_29:
            list_category_from_tags += compare_tags_for_category_29[tag]
            if 29 in our_category_list:
                our_category_list.remove(29)

    our_category_list += list_category_from_tags
    our_category_list.sort()
    return our_category_list, list_our_tags


def parser_categories_tags_event(category_kudago: list[str], tags_kudago: list[str]) -> tuple[list[int], list[int]]:
    our_category_list: list[int] = []

    for category in category_kudago:
        if category in compare_category_event:
            our_category_list += compare_category_event[category]

    list_our_tags: list[int] = []
    for tag in tags_kudago:
        if tag in compare_tags_for_our_tags:
            list_our_tags += compare_tags_for_our_tags[tag]

    our_category_list.sort()
    return our_category_list, list_our_tags


def parser_text_to_find_cartoons(text: str) -> list[str]:
    result = re.findall(r'data-full="(.*?)"', text)
    return ["https:" + image_link for image_link in result]


def load_places_from_kudago(session: Session) -> None:
    logger.info("Loading places from KudaGo")
    payload = _request_json(
        "https://kudago.com/public-api/v1.4/places/"
        "?lang=&expand=&order_by=&text_format=text&ids=&location=spb&page_size=1000"
        "&categories=&is_closed=false"
        "&fields=id,title,address,subway,timetable,description,foreign_url,phone,age_restriction,categories,tags,is_closed,site_url,images"
    )

    for res in payload.get("results", []):
        category_id, tags_id = parser_categories_tags_place(res.get("categories", []), res.get("tags", []))
        if not category_id:
            continue

        photo_list = [image.get("image", "") for image in res.get("images", []) if image.get("image")]

        place_id = res.get("id")
        if place_id:
            body_text_payload = _request_json(
                f"https://kudago.com/public-api/v1.4/places/{place_id}/?fields=body_text"
            )
            photo_list += parser_text_to_find_cartoons(body_text_payload.get("body_text", ""))

        description = _normalize_text(res.get("description"))
        site_url = _normalize_text(res.get("site_url"))
        if site_url:
            description = f"{description}\n{site_url}".strip()

        age_gap = _normalize_text(res.get("age_restriction"))
        entity = EntityCreate(
            name=_normalize_title(_normalize_text(res.get("title"))),
            contributors="",
            address=f"г. Санкт-Петербург, {_normalize_text(res.get('address'))}".strip(", "),
            metro=_normalize_text(res.get("subway")),
            date=_normalize_text(res.get("timetable")),
            description=description,
            links=_normalize_text(res.get("foreign_url")),
            contacts=_normalize_text(res.get("phone")),
            photo="",
            cost="",
            average_cost="",
            age_gap=age_gap,
            category_ids=category_id,
            tag_ids=tags_id,
        )

        current_entity = get_entity_by_name(session=session, name=entity.name)
        if not current_entity:
            current_entity = create_or_update_entity_with_relations(session=session, entity_in=entity)

        if photo_list:
            set_entity_photo_if_empty(session=session, entity=current_entity, photo_url=photo_list[0])

    logger.info("Finished loading places from KudaGo")


def load_events_from_kudago(session: Session) -> None:
    logger.info("Loading events from KudaGo")
    payload = _request_json(
        "https://kudago.com/public-api/v1.4/events/"
        "?lang=&expand=images&order_by=&text_format=text&actual_since=1729468800"
        "&location=spb&page_size=500"
        "&fields=id,description,dates,title,categories,participants,tags,age_restriction,price,place,site_url,images"
    )

    for res in payload.get("results", []):
        category_id, tags_id = parser_categories_tags_event(res.get("categories", []), res.get("tags", []))
        if not category_id:
            continue

        dates = res.get("dates", [])
        if not dates:
            continue

        date_start = int(dates[-1].get("start", 0))
        date_end = int(dates[-1].get("end", 0))

        if date_start < 0 or date_start == date_end:
            date_list = datetime.utcfromtimestamp(date_end).strftime("%d %m %Y").split(" ")
            date_list[1] = dict_months[int(date_list[1])]
            date = f"До {date_list[0]} {date_list[1]} {date_list[2]}"
        else:
            date_list_start = datetime.utcfromtimestamp(date_start).strftime("%d %m %Y").split(" ")
            date_list_start[1] = dict_months[int(date_list_start[1])]
            date = f"{date_list_start[0]} {date_list_start[1]} {date_list_start[2]}"

            date_list_end = datetime.utcfromtimestamp(date_end).strftime("%d %m %Y").split(" ")
            date_list_end[1] = dict_months[int(date_list_end[1])]
            date += f" до {date_list_end[0]} {date_list_end[1]} {date_list_end[2]}"

        participants = res.get("participants") or []
        contributors = ""
        site_url = _normalize_text(res.get("site_url"))
        if participants and "agent" in participants[0]:
            agent = participants[0]["agent"]
            contributors = _normalize_text(agent.get("title"))
            if agent.get("site_url"):
                site_url = _normalize_text(agent.get("site_url"))

        address_place = ""
        subway = ""
        place = res.get("place")
        if place and place.get("id"):
            place_payload = _request_json(
                f"https://kudago.com/public-api/v1.4/places/{place['id']}/?fields=title,address,subway,timetable"
            )
            title = _normalize_text(place_payload.get("title"))
            address = _normalize_text(place_payload.get("address"))
            address_place = f"{title}\nг. Санкт-Петербург, {address}".strip()
            subway = _normalize_text(place_payload.get("subway"))

        description = _normalize_text(res.get("description"))
        if res.get("site_url"):
            description = f"{description}\n{_normalize_text(res.get('site_url'))}".strip()

        photo_list = [image.get("image", "") for image in res.get("images", []) if image.get("image")]

        event_id = res.get("id")
        if event_id:
            body_text_payload = _request_json(
                f"https://kudago.com/public-api/v1.4/events/{event_id}/?fields=body_text"
            )
            photo_list += parser_text_to_find_cartoons(body_text_payload.get("body_text", ""))

        entity = EntityCreate(
            name=_normalize_title(_normalize_text(res.get("title"))),
            contributors=contributors,
            address=address_place,
            metro=subway,
            date=date,
            description=description,
            links=site_url,
            contacts="",
            photo="",
            cost=_normalize_text(res.get("price")),
            average_cost="",
            age_gap=_normalize_text(res.get("age_restriction")),
            category_ids=category_id,
            tag_ids=tags_id,
        )

        current_entity = get_entity_by_name(session=session, name=entity.name)
        if not current_entity:
            current_entity = create_or_update_entity_with_relations(session=session, entity_in=entity)

        if photo_list:
            set_entity_photo_if_empty(session=session, entity=current_entity, photo_url=photo_list[0])

    logger.info("Finished loading events from KudaGo")
