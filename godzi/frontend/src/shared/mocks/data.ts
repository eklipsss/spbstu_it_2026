import placesImage from '@assets/images/main_places.png'
import eventsImage from '@assets/images/main_events.png'
import type { Category, Entity } from '@/shared/types'

export interface Guide {
  id: string
  image: string
  price: string
  name: string
  quote: {
    text: string
    author: string
  }
  description: string
  inside: {
    info: string
    text: string
  }[]
}

const today = 'Ежедневно · 12:00–23:00'

export const mockEntities: Entity[] = [
  {
    entity_id: 101,
    name: 'Тихий бар с камерной атмосферой',
    photo: placesImage,
    address: 'Санкт-Петербург, наб. канала Грибоедова, 18',
    age_gap: '18+',
    average_cost: '1500 руб',
    categories_ids: ['2'],
    contacts: '+7 (999) 000-00-01',
    contributors: 'Редакция GOdzi',
    cost: '1500 руб',
    date: 'Ежедневно · 18:00–02:00',
    description:
      'Небольшой бар для спокойных разговоров, вина по бокалам и длинных вечеров без суеты. Подойдёт для свидания, встречи с друзьями или одиночного отдыха после работы.',
    links: 'https://example.com',
    metro: 'Невский проспект',
    source_link: '',
    tags_ids: ['cocktails', 'date'],
  },
  {
    entity_id: 102,
    name: 'Городская выставка в старом особняке',
    photo: placesImage,
    address: 'Санкт-Петербург, Литейный проспект, 34',
    age_gap: '12+',
    average_cost: 'Бесплатно',
    categories_ids: ['5'],
    contacts: '+7 (999) 000-00-00',
    contributors: 'Редакция GOdzi',
    cost: '0 руб',
    date: 'Вт–Вс · 11:00–21:00',
    description:
      'Описание',
    links: 'https://example.com',
    metro: 'Маяковская',
    source_link: '',
    tags_ids: ['art', 'weekend'],
  },
  {
    entity_id: 103,
    name: 'Стильный ресторан',
    photo: eventsImage,
    address: 'Санкт-Петербург, м. Чернышевская',
    age_gap: '0+',
    average_cost: 'Бесплатно',
    categories_ids: ['4'],
    contacts: '',
    contributors: 'Редакция GOdzi',
    cost: '0',
    date: 'В любое удобное время',
    description:
      'Описание',
    links: 'https://example.com/walk',
    metro: 'Чернышевская',
    source_link: '',
    tags_ids: ['walk', 'photo'],
  },
  {
    entity_id: 104,
    name: 'Светлая кофейня для неспешного утра',
    photo: placesImage,
    address: 'Санкт-Петербург, улица Белинского, 12',
    age_gap: '0+',
    average_cost: '700 руб',
    categories_ids: ['1'],
    contacts: '+7 (999) 000-00-03',
    contributors: 'Редакция GOdzi',
    cost: '700 руб',
    date: today,
    description:
      'Описание',
    links: 'https://example.com',
    metro: 'Гостиный двор',
    source_link: '',
    tags_ids: ['coffee', 'breakfast'],
  },
  {
    entity_id: 105,
    name: 'Мастер класс по вышиванию',
    photo: eventsImage,
    address: 'Санкт-Петербург, Севкабель Порт',
    age_gap: '0+',
    average_cost: 'Бесплатно',
    categories_ids: ['6'],
    contacts: '',
    contributors: 'Редакция GOdzi',
    cost: '0 руб',
    date: 'Сб–Вс · 12:00–20:00',
    description:
      'Описание',
    links: 'https://example.com',
    metro: 'Приморская',
    source_link: '',
    tags_ids: ['market', 'weekend'],
  },
  {
    entity_id: 106,
    name: 'Камерный концерт в историческом зале',
    photo: placesImage,
    address: 'Санкт-Петербург, Невский проспект, 30',
    age_gap: '6+',
    average_cost: '2200 руб',
    categories_ids: ['8'],
    contacts: '+7 (999) 000-00-00',
    contributors: 'Редакция GOdzi',
    cost: '2200 руб',
    date: 'Пт · 20:00',
    description:
      'Вечерняя программа для тех, кто хочет красивый выход в город: небольшой зал, хороший звук и ощущение отдельного события.',
    links: 'https://example.com',
    metro: 'Адмиралтейская',
    source_link: '',
    tags_ids: ['music', 'date'],
  },
]

export const mockCategoriesByName: Record<string, Category[]> = {
  'Места': [
    { category_id: 1, created_at: '', name: 'Кофейни', parent_id: 0, photo: placesImage, updated_at: '' },
    { category_id: 2, created_at: '', name: 'Бары', parent_id: 0, photo: placesImage, updated_at: '' },
    { category_id: 3, created_at: '', name: 'Галереи', parent_id: 0, photo: placesImage, updated_at: '' },
    { category_id: 4, created_at: '', name: 'Парки', parent_id: 0, photo: eventsImage, updated_at: '' },
  ],
  'Мероприятия': [
    { category_id: 5, created_at: '', name: 'Выставки', parent_id: 0, photo: placesImage, updated_at: '' },
    { category_id: 6, created_at: '', name: 'Мастер классы', parent_id: 0, photo: eventsImage, updated_at: '' },
    { category_id: 7, created_at: '', name: 'Лекции', parent_id: 0, photo: placesImage, updated_at: '' },
    { category_id: 8, created_at: '', name: 'Концерты', parent_id: 0, photo: placesImage, updated_at: '' },
  ],
}

export const mockRecommendations = mockEntities.slice(0, 5)

export const mockImagesByEntityId: Record<string, string[]> = {
  '101': [placesImage, placesImage, eventsImage],
  '102': [placesImage, placesImage],
  '103': [eventsImage, placesImage, placesImage],
  '104': [placesImage, eventsImage],
  '105': [eventsImage, placesImage],
  '106': [placesImage, placesImage, eventsImage],
}

export const mockGuides: Guide[] = [
  {
    id: '1',
    image: placesImage,
    price: '1000 руб',
    name: 'Маршрут по барам, который никто не пройдёт до конца',
    quote: {
      text: 'От первой рюмки я легко воздерживаюсь. А вот останавливаться не умею. Мотор хороший, да тормоза подводят…',
      author: 'Сергей Довлатов',
    },
    description:
      '<p>Ироничный маршрут по вечернему Петербургу для тех, кто любит атмосферные места, разговоры и длинные прогулки между точками.</p><p>Внутри — несколько локаций, короткие комментарии и последовательность, которую удобно пройти за один вечер или разделить на два выхода в город.</p>',
    inside: [
      { info: '12 страниц', text: 'в гайде' },
      { info: '7 локаций', text: 'на карте' },
      { info: 'от 2500 руб', text: 'примерный бюджет' },
    ],
  },
  {
    id: '2',
    image: placesImage,
    price: '790 руб',
    name: 'Тихий выходной: кофе, выставка и прогулка',
    quote: {
      text: 'Хороший маршрут — это когда ты не бежишь между точками, а постепенно входишь в городской ритм.',
      author: 'Редакция GOdzi',
    },
    description:
      '<p>Сценарий для размеренного дня в городе: начать с позднего завтрака, зайти на выставку, а потом пройтись пешком по красивым улицам.</p><p>Маршрут продуман так, чтобы между локациями было удобно перемещаться без такси и лишней суеты.</p>',
    inside: [
      { info: '9 страниц', text: 'в гайде' },
      { info: '5 локаций', text: 'на маршруте' },
      { info: 'от 1800 руб', text: 'на день' },
    ],
  },
]

const normalize = (value: string) => value.trim().toLowerCase()

export const getEntityById = (id?: string) => mockEntities.find((item) => String(item.entity_id) === String(id))

export const getEntitiesByCategoryId = (categoryId?: number) =>
  mockEntities.filter((item) => item.categories_ids.includes(String(categoryId)))

export const searchEntitiesByPhrase = (phrase: string) => {
  const needle = normalize(phrase)
  return mockEntities.filter((item) => {
    const haystacks = [item.name, item.description, item.address, item.metro, ...(item.tags_ids ?? [])]
    return haystacks.some((part) => part && normalize(part).includes(needle))
  })
}

export const getGuideById = (id?: string) => mockGuides.find((item) => item.id === String(id)) ?? mockGuides[0]

export const getChildCategories = (name?: string) => mockCategoriesByName[name ?? 'Места'] ?? mockCategoriesByName['Места']

export const getRecommendations = (skip = 0, limit = 5) => mockRecommendations.slice(skip, skip + limit)

export const getImagesByEntityId = (id?: string) => mockImagesByEntityId[String(id)] ?? []
