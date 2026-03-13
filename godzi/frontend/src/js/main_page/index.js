import Swiper from "swiper";
import { Navigation, Pagination } from "swiper/modules";
import { API_URL, asyncRequest, debounce } from "../main";
import { attachFlashlightEffect } from "../flash_light";

let current_page = 1;
let page_items_limit = 8;
let total_items_count = 0;
let current_items_on_page_count = 0;
let is_loading = false;

let pagination_next_btn_cb;
let pagination_prev_btn_cb;
let selected_main_category;
let mainCategoryData = [];

document.addEventListener("DOMContentLoaded", () => {
  // Обновлённые селекторы для нового компонента категорий
  const categoryButtons = document.querySelectorAll(".categories__main-tag");
  const headerPlaces = document.querySelector("#header_places");
  const headerEvents = document.querySelector("#header_events");
  const marqueeItems = document.querySelectorAll(".groups_link"); // если такой блок используется
  const searchInput = document.getElementById("search_input");
  const searchBtn = document.getElementById("search__btn");

  // Привязываем обработчики к главным тегам категорий
  categoryButtons.forEach((btn) => {
    btn.addEventListener("click", () => selectCategory(btn));
  });

  headerPlaces?.addEventListener("click", () => {
    if (categoryButtons[0]) selectCategory(categoryButtons[0]);
  });
  headerEvents?.addEventListener("click", () => {
    if (categoryButtons[1]) selectCategory(categoryButtons[1]);
  });
  marqueeItems.forEach((item) => {
    item.addEventListener("click", () => onMarqueeItemClick(item));
  });

  // // Обработчик для нажатия Enter в поле ввода
  // searchInput.addEventListener("keydown", (event) => {
  //   if (event.key === "Enter") {
  //     redirectToSearch();
  //   }
  // });
  // searchInput.style.border = "none";

  // Обработчик для клика по кнопке поиска
  searchBtn.addEventListener("click", () => {
    // redirectToSearch();
    onSearchBtnClick();
  });

  // function redirectToSearch() {
  //   const query = searchInput.value.trim();
  //   if (query.length > 0) {
  //     // Перенаправление на страницу поиска (укажите нужный URL)
  //     window.location.href = `/search?query=${encodeURIComponent(query)}`;
  //   }
  // }

  loadRecommendations();
});

function selectCategory(btn) {
  // Если выбранный тег уже активен, ничего не делаем
  if (btn.classList.contains("active")) return;
  // Снимаем активный класс со всех главных тегов
  document.querySelectorAll(".categories__main-tag.active").forEach((el) => {
    el.classList.remove("active");
  });
  // Добавляем активный класс к выбранному тегу
  btn.classList.add("active");

  // Показываем блок с дочерними категориями
  const childrenContainer = document.querySelector(".categories__children");
  if (childrenContainer) {
    childrenContainer.classList.remove("inactive");
  }

  // Сохраняем выбранное значение и загружаем данные для главной категории
  selected_main_category = btn.dataset.value;
  loadMainCategoryData(selected_main_category);
}

async function loadMainCategoryData(name) {
  const findedItems = document.querySelector(".categories__finded");
  findedItems?.classList.remove("active");
  findedItems?.classList.add("inactive");
  const backBtn = document.querySelector(".categories__back");
  backBtn?.classList.add("inactive");
  current_page = 1;
  try {
    const items = await asyncRequest(
      `${API_URL}/categories/child_categories?category_name=${name}`,
    );
    total_items_count = Math.ceil(items.total / page_items_limit);
    current_items_on_page_count = items.total;
    if (items) {
      mainCategoryData = items.categories;
      renderCategoryData(mainCategoryData);
      const elements = document.querySelectorAll(".categories__item");
      elements.forEach((item) => {
        item.addEventListener("click", () => {
          current_page = 1;
          loadSecondaryCategoryData(item.innerHTML, 0);
          onPaginationNext(() => {
            if (is_loading) return;
            if (current_items_on_page_count === page_items_limit) {
              loadSecondaryCategoryData(
                item.innerHTML,
                page_items_limit * current_page,
              );
              current_page++;
            }
          });
          onPaginationPrev(() => {
            if (is_loading) return;
            if (current_page !== 1) {
              loadSecondaryCategoryData(
                item.innerHTML,
                page_items_limit * (current_page - 2),
              );
              current_page--;
            }
          });
        });
      });
    }
  } catch (e) {
    console.error(e);
  }
}

async function loadSecondaryCategoryData(name, skip) {
  try {
    const items = await asyncRequest(
      `${API_URL}/categories/all_children_categories?category_name=${name}&skip=${skip}&limit=${page_items_limit}`,
    );
    total_items_count = Math.ceil(items.total / page_items_limit);
    current_items_on_page_count = items.categories.length;
    renderCategoryData(items.categories);
    const backBtn = document.querySelector(".categories__back");
    if (backBtn) {
      backBtn.classList.remove("inactive");
      backBtn.addEventListener("click", () => {
        loadMainCategoryData(selected_main_category);
        backBtn.classList.add("inactive");
        const finded = document.querySelector(".categories__finded");
        finded?.classList.add("inactive");
      });
    }
    const elements = document.querySelectorAll(".categories__item");
    elements.forEach((item) => {
      item.addEventListener("click", () =>
        loadEntities(item.dataset.category_id),
      );
    });
  } catch (e) {
    console.error(e);
  }
}

async function loadEntities(id) {
  const watchAllBtn = document.querySelector(".categories__finded-all");
  if (watchAllBtn) watchAllBtn.style.display = "block";
  const items = await asyncRequest(
    `${API_URL}/entities/get_entities?categories_ids=${id}`,
  );
  if (items.entities.length <= 4 && watchAllBtn) {
    watchAllBtn.style.display = "none";
  }
  if (items && items.entities.length) {
    const wrapper = document.querySelector(".categories__finded");
    console.log("WRAPPER");
    console.log(wrapper);
    if (wrapper) {
      wrapper.classList.remove("inactive");
      wrapper.classList.add("active");

      renderEntities(items.entities, false);
      watchAllBtn?.addEventListener("click", () => {
        renderEntities(items.entities, true);
        watchAllBtn.style.display = "none";
      });
    }
  }
}

function renderEntities(data, all) {
  const itemsWrapper = document.querySelector(".categories__finded__items");
  if (itemsWrapper) {
    itemsWrapper.innerHTML = "";
    if (data?.length) {
      data
        .slice(0, all ? data.length : 4)
        .forEach(({ name, photo, entity_id }) => {
          const item = document.createElement("a");
          item.classList.add("categories__finded__item");
          item.style.backgroundImage = `url(${photo})`;
          item.href = `/place?id=${entity_id}`;
          const nameDiv = document.createElement("div");
          nameDiv.classList.add("categories__finded__item-name");
          nameDiv.innerHTML = name;
          item.appendChild(nameDiv);
          itemsWrapper.appendChild(item);
        });
    } else {
      const div = document.createElement("div");
      div.innerHTML = "По вашему запросу ничего не найдено...";
      div.classList.add("categories__not__founded");

      itemsWrapper.appendChild(div);
    }
  }
}

async function renderCategoryData(data) {
  const subWrapper = document.querySelector(".categories__children");
  const itemsWrapper = document.querySelector(".categories__items");
  subWrapper?.classList.add("active");
  if (!data.length) {
    if (itemsWrapper) itemsWrapper.innerHTML = "Тут пусто";
    return;
  }
  if (total_items_count > page_items_limit) {
    renderPaggination();
  } else {
    hidePagination();
  }
  if (itemsWrapper) {
    itemsWrapper.innerHTML = "";
    data.forEach(({ name, category_id, parent_id, photo }) => {
      const elem = document.createElement("div");
      elem.classList.add("categories__item");
      elem.innerHTML = name;
      elem.dataset.category_id = category_id;
      elem.dataset.parent_id = parent_id;
      // if (photo) {
      //   elem.style.backgroundImage = `url(${photo})`;
      // }
      itemsWrapper.appendChild(elem);
    });
  }
}

function renderPaggination() {
  const pagination = document.querySelector(".categories__pagination");
  if (pagination) {
    pagination.classList.remove("inactive");
    const numbers = document.querySelector(".categories__pagination-numbers");
    if (numbers) {
      numbers.innerHTML = "";
      const num = document.createElement("li");
      num.innerHTML = current_page;
      numbers.appendChild(num);
    }
  }
}

function onPaginationNext(cb) {
  const next = document.querySelector(".categories__pagination-next");
  if (next) {
    if (pagination_next_btn_cb) {
      next.removeEventListener("click", pagination_next_btn_cb);
    }
    next.addEventListener("click", cb);
    pagination_next_btn_cb = cb;
  }
}

function onPaginationPrev(cb) {
  const prev = document.querySelector(".categories__pagination-prev");
  if (prev) {
    if (pagination_prev_btn_cb) {
      prev.removeEventListener("click", pagination_prev_btn_cb);
    }
    prev.addEventListener("click", cb);
    pagination_prev_btn_cb = cb;
  }
}

function hidePagination() {
  const pagination = document.querySelector(".categories__pagination");
  pagination?.classList.add("inactive");
}

async function search(name) {
  if (!name) {
    const searchResults = document.querySelector(".search__results");
    if (searchResults) {
      searchResults.innerHTML = "";
      searchResults.classList.add("hidden");
    }
    return;
  }
  const url = `${API_URL}/entities/naive_search_entities?name=${name}&skip=0&limit=5`;
  const results = await asyncRequest(url);
  if (typeof results === "object") {
    const findedBlock = document.querySelector(".categories__finded");
    findedBlock?.classList.add("active");
    findedBlock?.classList.remove("inactive");
    renderEntities(results?.entities, true);
    const allBtn = document.querySelector(".categories__finded-all");
    if (allBtn) allBtn.style.display = "none";
    findedBlock?.scrollIntoView();
  } else {
    const searchResults = document.querySelector(".search__results");
    if (searchResults) searchResults.innerHTML = results;
  }
}

function renderResults(items) {
  const searchResults = document.querySelector(".search__results");
  if (searchResults) {
    searchResults.classList.remove("hidden");
    searchResults.innerHTML = "";
    if (!items.entities) {
      searchResults.innerHTML = "Ничего не найдено";
      return;
    }
    items.entities.forEach(({ name, photo, description, entity_id }) => {
      const result = document.createElement("div");
      result.classList.add("search__result");
      const image = document.createElement("img");
      image.classList.add("search__result-image");
      image.src = photo;
      result.appendChild(image);
      const text = document.createElement("div");
      text.classList.add("search__result-text");
      const titleDiv = document.createElement("div");
      titleDiv.classList.add("title");
      titleDiv.innerHTML = name;
      text.appendChild(titleDiv);
      const descriptionDiv = document.createElement("div");
      descriptionDiv.classList.add("description");
      descriptionDiv.innerHTML = description;
      text.appendChild(descriptionDiv);
      result.appendChild(text);
      const link = document.createElement("a");
      link.href = `/place?id=${entity_id}`;
      link.appendChild(result);
      searchResults.appendChild(link);
    });
  }
}

async function loadRecommendations() {
  const results = await asyncRequest(
    `${API_URL}/entities/get_recommendations?skip=3&limit=5`,
  );
  if (results) {
    renderRecommendations(results);
  }
}

function renderRecommendations(items) {
  const wrapper = document.querySelector(".recommendations__swiper-wrapper");
  if (wrapper) {
    items.forEach(({ name, photo, entity_id }) => {
      const slide = document.createElement("div");
      slide.classList.add("swiper-slide");
      slide.style.backgroundImage = `url(${photo})`;
      const span = document.createElement("span");
      const p = document.createElement("p");
      p.innerHTML = name;
      span.appendChild(p);
      const link = document.createElement("a");
      link.href = `/place?entity_id=${entity_id}`;
      link.appendChild(span);
      slide.appendChild(link);
      wrapper.appendChild(slide);
    });
    // Инициализация Swiper
    new Swiper(".recommendations__swiper", {
      modules: [Navigation, Pagination],
      centeredSlides: true,
      loop: true,
      slidesPerView: 3,
      navigation: {
        nextEl: ".recommendations__swiper-next",
        prevEl: ".recommendations__swiper-prev",
      },
    });

    // Если эффект фонарика не нужен, можно отключить
    // attachFlashlightEffect();
  }
}

function startLoading() {
  is_loading = true;
  const loader = document.querySelector(".loader-wrapper");
  if (loader) {
    loader.style.top = `${window.scrollY}px`;
    loader.classList.remove("loader_inactive");
  }
}

function endLoading() {
  is_loading = false;
  const loader = document.querySelector(".loader-wrapper");
  loader?.classList.add("loader_inactive");
}

function onMarqueeItemClick(item) {
  const input = document.querySelector("#search_input");
  if (input) {
    const text = item.innerHTML;
    input.value = text;
    search(text);
  }
}

function onSearchBtnClick() {
  const input = document.querySelector("#search_input");
  if (input) search(input.value);
}
