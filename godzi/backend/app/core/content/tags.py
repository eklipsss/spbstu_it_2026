from app.models.tag import TagCreate

tags_to_create = (
    TagCreate(name="Уютное место"),  # 1
    TagCreate(name="Dog friendly"),  # 2
    TagCreate(name="Возрастное ограничение 18+"),  # 3
    TagCreate(name="Возрастное ограничение 16+"),  # 4
    TagCreate(name="Тихое место"),  # 5
    TagCreate(name="Живая музыка"),  # 6
    TagCreate(name="Идеальное обслуживание"),  # 7
    TagCreate(name="Удобства для людей в инвалидных колясках"),  # 8
    TagCreate(name="Далеко от метро"),  # 9
    TagCreate(name="Близко к метро"),  # 10
    TagCreate(name="Неудобно добираться на общественном транспорте"),  # 11
    TagCreate(name="Удобно добираться на общественном транспорте"),  # 12
    TagCreate(name="Живописное место"),  # 13
    TagCreate(name="Всегда много людей"),  # 14
    TagCreate(name="Сложно достать билеты"),  # 15
    TagCreate(name="Популярное место"),  # 16
    TagCreate(name="Большие очереди"),  # 17
    TagCreate(name="Находится в торговом центре"),  # 18
    # ...
)