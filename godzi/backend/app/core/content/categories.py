from app.models.category import CategoryCreate

categories_to_init = (
    CategoryCreate(name="Места", parent_id=None),  # 1
    CategoryCreate(name="Мероприятия", parent_id=None),  # 2
)

categories_to_create = (
    # ____________________ parent_id = 1 ________________________
    CategoryCreate(name="Кафе & Рестораны", parent_id=1),  # 3
    CategoryCreate(name="Клубы & Бары", parent_id=1),  # 4
    CategoryCreate(name="Музеи", parent_id=1),  # 5
    CategoryCreate(name="Парки", parent_id=1),  # 6
    CategoryCreate(name="Развлечения", parent_id=1),  # 7
    CategoryCreate(name="Кино", parent_id=1),  # 8
    CategoryCreate(name="Театры", parent_id=1),  # 9

    # ____________________ parent_id = 2 ________________________
    CategoryCreate(name="Выставки", parent_id=2),  # 10
    CategoryCreate(name="Концерты", parent_id=2),  # 11
    CategoryCreate(name="Фестивали", parent_id=2),  # 12

    # ____________________ parent_id = 3 (кафе/рестораны) ________________________
    CategoryCreate(name="Пирожковая", parent_id=3),  # 13
    CategoryCreate(name="Пышечная", parent_id=3),  # 14
    CategoryCreate(name="Грузинская кухня", parent_id=3),  # 15
    CategoryCreate(name="Итальянская кухня", parent_id=3),  # 16
    CategoryCreate(name="Паназиатская кухня", parent_id=3),  # 17
    CategoryCreate(name="Французская кухня", parent_id=3),  # 18
    CategoryCreate(name="Тематическое", parent_id=3),  # 19
    CategoryCreate(name="Фуд-корт", parent_id=3),  # 20
    CategoryCreate(name="Корейская кухня", parent_id=3),  # 21
    CategoryCreate(name="Китайская кухня", parent_id=3),  # 22
    CategoryCreate(name="Японская кухня", parent_id=3),  # 23
    CategoryCreate(name="Вьетнамская кухня", parent_id=3),  # 24
    CategoryCreate(name="Детское", parent_id=3),  # 25
    CategoryCreate(name="Столовая", parent_id=3),  # 26
    CategoryCreate(name="Мясной ресторан", parent_id=3),  # 27

    # ____________________ parent_id = 4 (клубы/бары) ________________________
    CategoryCreate(name="Клуб", parent_id=4),  # 28
    CategoryCreate(name="Бар", parent_id=4),  # 29

    # ____________________ parent_id = 5 (музеи) ________________________
    CategoryCreate(name="Исторический", parent_id=5),  # 30
    CategoryCreate(name="Музей-заповедник", parent_id=5),  # 31
    CategoryCreate(name="Интерактивный", parent_id=5),  # 32
    CategoryCreate(name="Художественный", parent_id=5),  # 33
    CategoryCreate(name="Музей-квартира", parent_id=5),  # 34
    CategoryCreate(name="Тематический", parent_id=5),  # 35

    # ____________________ parent_id = 6 (парки) ________________________
    CategoryCreate(name="Сквер", parent_id=6),  # 36
    CategoryCreate(name="Сад", parent_id=6),  # 37

    # ____________________ parent_id = 7 (развлечения) ________________________
    CategoryCreate(name="Зоопарк", parent_id=7),  # 38
    CategoryCreate(name="Парк аттракционов", parent_id=7),  # 39
    CategoryCreate(name="Аквапарк", parent_id=7),  # 40
    CategoryCreate(name="Океанариум", parent_id=7),  # 41
    CategoryCreate(name="Цирк", parent_id=7),  # 42

    # ____________________ parent_id = 8 (кино) ________________________
    CategoryCreate(name="Автокинотеатр", parent_id=8),  # 43
    CategoryCreate(name="Под открытым небом", parent_id=8),  # 44

    # ____________________ parent_id = 9 (театры) ________________________
    CategoryCreate(name="Театр оперы и балета", parent_id=9),  # 45
    CategoryCreate(name="Театр кукол", parent_id=9),  # 46
    CategoryCreate(name="Авторский театр", parent_id=9),  # 47
    CategoryCreate(name="Драматический театр", parent_id=9),  # 48
    CategoryCreate(name="Театр комедии", parent_id=9),  # 49
    CategoryCreate(name="Иммерсивный театр", parent_id=9),  # 50
    CategoryCreate(name="Театр сатиры", parent_id=9),  # 51
    CategoryCreate(name="Музыкальный театр", parent_id=9),  # 52

    # ____________________ parent_id = 10 (выставки) ________________________
    CategoryCreate(name="Промышленные и отраслевые выставки", parent_id=10),  # 53
    CategoryCreate(name="Экспозиции", parent_id=10),  # 54
    CategoryCreate(name="Тематические выставки", parent_id=10),  # 55
    CategoryCreate(name="Выставки домашних животных", parent_id=10),  # 56

    # ____________________ parent_id = 16 (кафе/рестораны -> итальянское) ________________________
    CategoryCreate(name="Джелатерия", parent_id=16),  # 57
    CategoryCreate(name="Пиццерия", parent_id=16),  # 58

    # ____________________ parent_id = 19 (кафе/рестораны -> тематическое) ________________________
    CategoryCreate(name="Аниме-кафе", parent_id=19),  # 59
    CategoryCreate(name="Литературное", parent_id=19),  # 60
    CategoryCreate(name="Чёрно-белое", parent_id=19),  # 61
    CategoryCreate(name="С животными", parent_id=19),  # 62

    # ____________________ parent_id = 62 (кафе/рестораны -> тематическое -> c животными) _________
    CategoryCreate(name="С котиками", parent_id=62),  # 63
    CategoryCreate(name="С капибарами", parent_id=62),  # 64
    CategoryCreate(name="С енотами", parent_id=62),  # 65
    CategoryCreate(name="С собачками", parent_id=62),  # 66

    # ____________________ parent_id = 29 (бары) ________________________
    CategoryCreate(name="Рамен-бар", parent_id=29),  # 67
    CategoryCreate(name="Суши-бар", parent_id=29),  # 68
    CategoryCreate(name="Гриль-бар", parent_id=29),  # 69
    CategoryCreate(name="Паб", parent_id=29),  # 70
    CategoryCreate(name="Винный бар", parent_id=29),  # 71
    CategoryCreate(name="Коктейль/смузи бар", parent_id=29),  # 72

    # ____________________ parent_id = 55 (выставки -> тематические выставки) ________________________
    CategoryCreate(name="Научные выставки", parent_id=55),  # 73
    CategoryCreate(name="Художественные выставки", parent_id=55),  # 74
    CategoryCreate(name="Образовательные выставки", parent_id=55),  # 75
    CategoryCreate(name="Литературные выставки", parent_id=55),  # 76
    CategoryCreate(name="Фандомные выставки", parent_id=55),  # 77
    CategoryCreate(name="Фотовыставки выставки", parent_id=55),  # 78
    CategoryCreate(name="Арт-маркеты выставки", parent_id=55),  # 79

    # ____________________ parent_id = 3 (кафе) ________________________
    CategoryCreate(name="Европейская кухня", parent_id=3),  # 80
    CategoryCreate(name="Кофейня", parent_id=3),  # 81
    CategoryCreate(name="Украинская кухня", parent_id=3),  # 81

    # ____________________ parent_id = 10 (фестивали) ________________________

    # ____________________ parent_id = 12 (концерты) ________________________

    # ...
)
