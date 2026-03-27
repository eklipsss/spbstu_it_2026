import { useGetChildGategoriesQuery } from '@/entities/categories/api'
import { useGetEntitiesQuery } from '@/entities/entity/api'
import { useGetRecommendationsQuery } from '@/entities/recommendations/api'
import { entitiesActions, entitiesSelectors } from '@/entities/entity/slice'
import type { Entity } from '@/shared/types'
import heroCharacter from '@assets/images/hero-character.png'
import eventsImage from '@assets/images/main_events.png'
import placesImage from '@assets/images/main_places.png'
import { skipToken } from '@reduxjs/toolkit/query'
import { Helmet } from 'react-helmet-async'
import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useLocation } from 'react-router-dom'
import { Layout } from '@/shared/components'
import styles from './main-page.module.scss'

const fallbackChildCategories = {
  'Места': [
    { category_id: 1, name: 'Кофейни' },
    { category_id: 2, name: 'Бары' },
    { category_id: 3, name: 'Галереи' },
    { category_id: 4, name: 'Маршруты' },
  ],
  'Мероприятия': [
    { category_id: 5, name: 'Выставки' },
    { category_id: 6, name: 'Маркеты' },
    { category_id: 7, name: 'Лекции' },
    { category_id: 8, name: 'Концерты' },
  ],
}

const fallbackEntities: Entity[] = [
  {
    entity_id: 201,
    name: 'Тихий бар с камерной атмосферой',
    photo: placesImage,
    address: 'Санкт-Петербург, наб. канала Грибоедова, 18',
    age_gap: '18+',
    average_cost: '1500 руб',
    categories_ids: [],
    contacts: '+7 (999) 000-00-00',
    contributors: '',
    cost: '1500 руб',
    date: 'Ежедневно · 18:00–02:00',
    description: 'Место для неспешного вечера и разговоров.',
    links: 'https://example.com',
    metro: 'Невский проспект',
    source_link: 'Подготовлено как демо-карточка',
    tags_ids: [],
  },
  {
    entity_id: 202,
    name: 'Городская выставка в старом особняке',
    photo: placesImage,
    address: 'Санкт-Петербург, Литейный проспект, 34',
    age_gap: '12+',
    average_cost: 'Бесплатно',
    categories_ids: [],
    contacts: '',
    contributors: '',
    cost: '0 руб',
    date: 'Вт–Вс · 11:00–21:00',
    description: 'Пространство для новых впечатлений и фото.',
    links: '',
    metro: 'Маяковская',
    source_link: 'Подготовлено как демо-карточка',
    tags_ids: [],
  },
  {
    entity_id: 203,
    name: 'Маршрут на полдня по красивым дворам',
    photo: eventsImage,
    address: 'Санкт-Петербург, старт у метро Чернышевская',
    age_gap: '0+',
    average_cost: 'Бесплатно',
    categories_ids: [],
    contacts: '',
    contributors: '',
    cost: '0 руб',
    date: 'В любое время',
    description: 'Подходит для прогулки вдвоём или соло.',
    links: '',
    metro: 'Чернышевская',
    source_link: 'Подготовлено как демо-карточка',
    tags_ids: [],
  },
]

const fallbackRecommendations = [
  { entity_id: 101, name: 'Неспешный вечер в атмосферном баре', photo: placesImage },
  { entity_id: 102, name: 'Маршрут по фотогеничным городским локациям', photo: placesImage },
  { entity_id: 103, name: 'Выходной с выставкой и ужином', photo: eventsImage },
]

const contactLinks = [
  {
    title: 'Telegram',
    description: 'быстрые ответы и связь по проекту',
    href: 'https://t.me/test',
    icon: '↗',
  },
  {
    title: 'E-mail',
    description: 'godzi.togo@mail.ru',
    href: 'mailto:godzi.togo@mail.ru',
    icon: '@',
  },
  {
    title: 'О проекте',
    description: 'подробнее о концепции GOdzi',
    href: '/about',
    icon: '•',
  },
]

export const MainPage = () => {
  const location = useLocation()
  const dispatch = useDispatch()
  const searchedEntities = useSelector(entitiesSelectors.searchedEntities)
  const [selectedMainCategory, setSelectedMainCategory] = useState<string>('Места')
  const [selectedChildCategory, setSelectedChildCategory] = useState<number>()

  const { data: mainCategoryChilds, isLoading: isMainCategoryLoading } = useGetChildGategoriesQuery(selectedMainCategory ?? skipToken)
  const { data: entities } = useGetEntitiesQuery(selectedChildCategory ?? skipToken)
  const { data: recommendations } = useGetRecommendationsQuery({ skip: 0, limit: 5 })

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const type = params.get('type')

    if (type === 'places') {
      setSelectedMainCategory('Места')
      setSelectedChildCategory(undefined)
      dispatch(entitiesActions.resetEntities())
    }

    if (type === 'events') {
      setSelectedMainCategory('Мероприятия')
      setSelectedChildCategory(undefined)
      dispatch(entitiesActions.resetEntities())
    }

    if (!location.hash) return

    const scrollToTarget = () => {
      const target = document.querySelector(location.hash)
      target?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }

    window.requestAnimationFrame(scrollToTarget)
  }, [dispatch, location.hash, location.search])

  const childCategories = useMemo(() => {
    if (mainCategoryChilds?.categories?.length) {
      return mainCategoryChilds.categories
    }

    return fallbackChildCategories[selectedMainCategory as keyof typeof fallbackChildCategories] ?? []
  }, [mainCategoryChilds?.categories, selectedMainCategory])

  const selectionCards = useMemo(() => {
    const source = recommendations?.length ? recommendations : fallbackRecommendations
    const normalized = [...source]

    while (normalized.length < 5) {
      normalized.push(...source)
    }

    return normalized.slice(0, 5)
  }, [recommendations])

  const visibleEntities = useMemo(() => {
    if (searchedEntities.entities.length) {
      return searchedEntities.entities
    }

    if (entities?.entities?.length && selectedChildCategory) {
      return entities.entities
    }

    if (selectedChildCategory) {
      return []
    }

    return fallbackEntities
  }, [entities?.entities, searchedEntities.entities, selectedChildCategory])

  const handleSelectMainCategory = (category: string) => {
    setSelectedMainCategory(category)
    setSelectedChildCategory(undefined)
    dispatch(entitiesActions.resetEntities())
  }

  const handleLoadEntities = (categoryId: number) => {
    setSelectedChildCategory(categoryId)
    dispatch(entitiesActions.resetEntities())
  }

  return (
    <>
      <Helmet>
        <title>GOdzi – Лучший сервис для поиска мест, идей досуга и развлечений</title>
        <meta
          name="description"
          content="GOdzi — ваш личный помощник по поиску интересных мест, мероприятий и идей досуга в любом городе. Находите, что посмотреть и куда сходить."
        />
      </Helmet>

      <Layout>
        <section className={styles.hero}>
          <div className="container">
            <div className={styles.hero__card}>
              <div className={styles.hero__copy}>
                {/* <span className={styles.hero__kicker}>Ваш личный помощник в проведении досуга</span> */}
                <h1 className={styles.hero__title}>Найди свое<br />место в жизни!</h1>
                <p className={styles.hero__description}>
                  А GOdzi тебе в этом поможет :)
                </p>

                {/* <div className={styles.hero__chips}>
                  {heroNotes.map((note) => (
                    <span key={note}>{note}</span>
                  ))}
                </div> */}
              </div>

              <div className={styles.hero__visual} aria-hidden="true">
                <div className={styles.hero__visualGlow} />
                <img src={heroCharacter} alt="" className={styles.hero__image} />
              </div>
            </div>
          </div>
        </section>

        <section className={styles.categories} id="categories">
          <div className="container">
            <div className={styles.categories__grid}>
              <button
                type="button"
                className={`${styles.categoryCard} ${selectedMainCategory === 'Места' ? styles.categoryCard_active : ''}`}
                onClick={() => handleSelectMainCategory('Места')}
              >
                <div className={styles.categoryCard__content}>
                  {/* <span className={styles.categoryCard__eyebrow}>места</span> */}
                  <h2>Места</h2>
                  <p>Кофейни, бары, галереи и прогулочные локации.</p>
                </div>
                <img src={placesImage} alt="Места" />
              </button>

              <button
                type="button"
                id="events"
                className={`${styles.categoryCard} ${selectedMainCategory === 'Мероприятия' ? styles.categoryCard_active : ''}`}
                onClick={() => handleSelectMainCategory('Мероприятия')}
              >
                <div className={styles.categoryCard__content}>
                  {/* <span className={styles.categoryCard__eyebrow}>мероприятия</span> */}
                  <h2>Мероприятия</h2>
                  <p>Выставки, лекции, концерты и события, которые скрасят ваш досуг.</p>
                </div>
                <img src={eventsImage} alt="Мероприятия" />
              </button>
            </div>

            <div className={styles.childCategories}>
              {isMainCategoryLoading ? (
                <div className="loader" />
              ) : (
                childCategories.map(({ category_id, name }) => (
                  <button
                    key={category_id}
                    type="button"
                    className={`${styles.childCategories__item} ${selectedChildCategory === category_id ? styles.childCategories__item_active : ''}`}
                    onClick={() => handleLoadEntities(category_id)}
                  >
                    {name}
                  </button>
                ))
              )}
            </div>
          </div>
        </section>

        <section className={styles.selections}>
          <div className="container">
            <div className={styles.resultsHead}>
              {/* <div>
                <h3>Актуальные карточки</h3>
                <p>
                  {searchedEntities.entities.length
                    ? 'Результаты по поисковому запросу'
                    : selectedChildCategory
                      ? 'Карточки по выбранной категории'
                      : 'Стартовая демо-подборка, чтобы секция сразу выглядела наполненной'}
                </p>
              </div> */}
              {/* <Link to="/about" className={styles.textLink}>
                Подробнее о сервисе
              </Link> */}
            </div>

            <div className={styles.resultsGrid}>
              {visibleEntities.length ? (
                visibleEntities.slice(0, 3).map(({ entity_id, name, photo, address, date }) => (
                  <Link key={entity_id} to={`/place/${entity_id}`} className={styles.resultCard}>
                    <img src={photo} alt={name} className={styles.resultCard__image} />
                    <div className={styles.resultCard__body}>
                      <span>{address || 'Городская локация'}</span>
                      <strong>{name}</strong>
                      <p>{date || 'Сегодня'}</p>
                    </div>
                  </Link>
                ))
              ) : (
                <div className={styles.emptyState}>В этой категории пока ничего нет</div>
              )}
            </div>

            <div className={`${styles.sectionHeading} ${styles.sectionHeading_spaced}`} id="collections">
              <span>Подборки</span>
              <h2>Самые интересные места и мероприятия, подобранные специально для вас</h2>
            </div>

            <div className={styles.rail}>
              {selectionCards.map(({ entity_id, name, photo }, index) => (
                <Link key={`${entity_id}-${index}`} to={`/place/${entity_id}`} className={styles.railCard}>
                  <img src={photo} alt={name} />
                  <div className={styles.railCard__overlay}>
                    <strong>{name}</strong>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className={styles.darkBlock} id="about">
          <div className="container">
            <div className={styles.darkBlock__panel}>
              <span className={styles.panelLabel}>О нас</span>
              <h3>Блок с информацией о нас</h3>
              <p>
                GOdzi — это лёгкий по структуре городской сервис: главное действие всегда на виду, а подборки, места и события выстроены так, чтобы пользователь быстро понял, куда нажимать дальше.
              </p>

              <div className={styles.contactsInline}>
                {contactLinks.map(({ title, description, href, icon }) => (
                  href.startsWith('/') ? (
                    <Link key={title} to={href} className={styles.contactLink}>
                      <span className={styles.contactLink__icon}>{icon}</span>
                      <div>
                        <strong>{title}</strong>
                        <p>{description}</p>
                      </div>
                    </Link>
                  ) : (
                    <a key={title} href={href} className={styles.contactLink} target={href.startsWith('http') ? '_blank' : undefined} rel={href.startsWith('http') ? 'noreferrer' : undefined}>
                      <span className={styles.contactLink__icon}>{icon}</span>
                      <div>
                        <strong>{title}</strong>
                        <p>{description}</p>
                      </div>
                    </a>
                  )
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className={styles.lightBlock}>
          <div className="container">
            <div className={styles.lightBlock__panel}>
              <div>
                <span className={styles.panelLabel}>Сотрудничество</span>
                <h3>Блок с предложением сотрудничества</h3>
                <p>Открыты к партнёрствам, совместным материалам, городским проектам и спецподборкам.</p>
              </div>
              <a href="mailto:godzi.togo@mail.ru" className={styles.primaryButton}>
                Отправить заявку
              </a>
            </div>
          </div>
        </section>
      </Layout>
    </>
  )
}
