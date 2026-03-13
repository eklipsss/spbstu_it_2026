import { useGetChildGategoriesQuery } from '@/entities/categories/api'
import events from '@assets/images/main_events.png'
import places from '@assets/images/main_places.png'
import { skipToken } from '@reduxjs/toolkit/query'
import { useEffect, useMemo, useState } from 'react'
import styles from './categories.module.scss'
import { classNames } from '@/shared/utils'
import { useGetEntitiesQuery } from '@/entities/entity/api'
import { Link, useLocation } from 'react-router-dom'
import { entitiesActions, entitiesSelectors } from '@/entities/entity/slice'
import { Entity } from '@/shared/types'
import { useDispatch, useSelector } from 'react-redux'

const fallbackChildCategories = {
  'Места': [
    { category_id: 1, name: 'Кофейни' },
    { category_id: 2, name: 'Бары' },
    { category_id: 3, name: 'Галереи' },
    { category_id: 4, name: 'Парки' },
  ],
  'Мероприятия': [
    { category_id: 5, name: 'Выставки' },
    { category_id: 6, name: 'Мастер классы' },
    { category_id: 7, name: 'Лекции' },
    { category_id: 8, name: 'Концерты' },
  ],
}

const fallbackEntities: Entity[] = [
  {
    entity_id: 201,
    name: 'Тихий бар с камерной атмосферой',
    photo: places,
    address: 'Набережная канала Грибоедова, 18',
    age_gap: '',
    average_cost: '1500',
    categories_ids: [],
    contacts: '+7 (999) 000-00-00',
    contributors: '',
    cost: '1500',
    date: 'Ежедневно, 18:00–02:00',
    description: 'Место для неспешного вечера и разговоров.',
    links: 'https://example.com',
    metro: 'Невский проспект',
    source_link: 'Подготовлено как демо-карточка',
    tags_ids: [],
  },
  {
    entity_id: 202,
    name: 'Городская выставка в старом особняке',
    photo: places,
    address: 'Литейный проспект, 34',
    age_gap: '',
    average_cost: '0',
    categories_ids: [],
    contacts: '',
    contributors: '',
    cost: '0',
    date: 'До 21:00',
    description: 'Пространство для новых впечатлений и фото.',
    links: '',
    metro: 'Маяковская',
    source_link: 'Подготовлено как демо-карточка',
    tags_ids: [],
  },
  {
    entity_id: 203,
    name: 'Маршрут на полдня по красивым дворам',
    photo: events,
    address: 'Старт у метро Чернышевская',
    age_gap: '',
    average_cost: '0',
    categories_ids: [],
    contacts: '',
    contributors: '',
    cost: '0',
    date: 'В любое время',
    description: 'Подходит для прогулки вдвоём или соло.',
    links: '',
    metro: 'Чернышевская',
    source_link: 'Подготовлено как демо-карточка',
    tags_ids: [],
  },
]

export const MainPageCategories = () => {
  const location = useLocation()
  const [selectedMainCategory, setSelectedMainCategory] = useState<string>('Места')
  const [selectedChildCategory, setSelectedChildCategory] = useState<number>()
  const { data: mainCategoryChilds, isLoading: isMainCategoryLoading } = useGetChildGategoriesQuery(selectedMainCategory ?? skipToken)
  const { data: entities } = useGetEntitiesQuery(selectedChildCategory ?? skipToken)

  useEffect(() => {
    if (location.hash) {
      const elem = document.querySelector(location.hash)
      elem?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [location])

  const searchedEntities = useSelector(entitiesSelectors.searchedEntities)
  const dispatch = useDispatch()

  const handleSelectMainCategory = (cat: string) => {
    setSelectedMainCategory(cat)
    setSelectedChildCategory(undefined)
    dispatch(entitiesActions.resetEntities())
  }

  const handleLoadEntities = (catId: number) => {
    setSelectedChildCategory(catId)
    dispatch(entitiesActions.resetEntities())
  }

  const getEntitiesToRender = (): Entity[] => {
    if (searchedEntities.entities.length) {
      return searchedEntities.entities
    }

    if (entities?.entities && selectedChildCategory) {
      return entities.entities
    }

    if (!entities?.entities && !selectedChildCategory && !searchedEntities.entities.length) {
      return fallbackEntities
    }

    return []
  }

  const childCategories = useMemo(() => {
    if (mainCategoryChilds?.categories?.length) {
      return mainCategoryChilds.categories
    }

    return fallbackChildCategories[selectedMainCategory as keyof typeof fallbackChildCategories] ?? []
  }, [mainCategoryChilds?.categories, selectedMainCategory])

  return (
    <section className={classNames(styles.categories, {}, ['animate', 'fadeInUp'])} id="categories">
      <div className="container">
        <div className={styles.categories__header}>
          <div>
            <span className={styles.categories__eyebrow}>Подборки</span>
            <h2 className={styles.categories__title}>Сначала формат, потом конкретное место</h2>
          </div>
          <p className={styles.categories__description}>
            Выберите сценарий — и получите список категорий. После поиска или выбора подборки карточки появятся внизу этого блока.
          </p>
        </div>

        <div className={styles.categories__component}>
          <div className={styles.categories__main}>
            <button
              type="button"
              onClick={() => handleSelectMainCategory('Места')}
              className={classNames(styles.categories__main__tag, {
                [styles.categories__main__tag_active]: selectedMainCategory === 'Места',
              })}
            >
              <img src={places} alt="Места" loading="lazy" />
              <span>Места</span>
            </button>
            <button
              type="button"
              onClick={() => handleSelectMainCategory('Мероприятия')}
              className={classNames(styles.categories__main__tag, {
                [styles.categories__main__tag_active]: selectedMainCategory === 'Мероприятия',
              })}
            >
              <img src={events} alt="Мероприятия" loading="lazy" />
              <span>Мероприятия</span>
            </button>
          </div>

          {isMainCategoryLoading ? (
            <div className="loader" />
          ) : (
            <div className={styles.categories__children}>
              <div className={styles.categories__items}>
                {childCategories.map(({ category_id, name }) => (
                  <button
                    key={category_id}
                    type="button"
                    className={classNames(styles.categories__item, {
                      [styles.categories__item_active]: selectedChildCategory === category_id,
                    })}
                    onClick={() => handleLoadEntities(category_id)}
                  >
                    {name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div
        className={classNames(styles.categories__finded, {
          [styles.categories__finded__active]: !!getEntitiesToRender().length,
        })}
      >
        <div className="container">
          <div className={styles.categories__finded__head}>
            <h3>Подходящие карточки</h3>
            <p>
              {searchedEntities.entities.length
                ? 'Результаты по вашему запросу'
                : selectedChildCategory
                  ? 'Результаты выбранной категории'
                  : 'Демо-подборка, чтобы блок не был пустым без API'}
            </p>
          </div>

          <div className={classNames(styles.categories__finded__items)}>
            {getEntitiesToRender().map(({ entity_id, name, photo, address, date }, index) => (
              <Link to={`/place/${entity_id}`} className={styles.categories__finded__item} key={entity_id + name + index}>
                <img src={photo} alt={name} className={styles.categories__finded__item__image} />
                <div className={styles.categories__finded__item__body}>
                  <div className={styles.categories__finded__item__meta}>
                    <span>{address || 'Городская локация'}</span>
                    <span>{date || 'Сегодня'}</span>
                  </div>
                  <div className={styles.categories__finded__item__name}>{name}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
