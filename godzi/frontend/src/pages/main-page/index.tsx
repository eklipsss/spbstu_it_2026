import { useGetChildCategoriesByIdQuery, useGetChildGategoriesQuery } from '@/entities/categories/api'
import { useGetEntitiesQuery } from '@/entities/entity/api'
import { useAddFavoriteMutation, useGetFavoriteIdsQuery, useRemoveFavoriteMutation } from '@/entities/favorites/api'
import { useGetRecommendationsQuery } from '@/entities/recommendations/api'
import type { Category, Entity } from '@/shared/types'
import heroCharacter from '@assets/images/hero-character.png'
import eventsImage from '@assets/images/main_events.png'
import placesImage from '@assets/images/main_places.png'
import { skipToken } from '@reduxjs/toolkit/query'
import { useEffect, useMemo, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { AuthRequiredModal, FavoriteIconButton, Layout } from '@/shared/components'
import { authEventName, isAuthenticated } from '@/shared/utils/session'
import { resolveEntityPhoto } from '@/shared/utils'
import styles from './main-page.module.scss'

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

const ROOT_CATEGORY_IDS: Record<string, number> = {
  Места: 1,
  Мероприятия: 2,
}

export const MainPage = () => {
  const location = useLocation()
  const [loggedIn, setLoggedIn] = useState(() => isAuthenticated())
  const [selectedMainCategory, setSelectedMainCategory] = useState<string>('Места')
  const [selectedCategoryPath, setSelectedCategoryPath] = useState<Category[]>([])
  const [visibleResultsCount, setVisibleResultsCount] = useState(6)
  const [authPromptOpen, setAuthPromptOpen] = useState(false)
  const [pendingFavoriteIds, setPendingFavoriteIds] = useState<number[]>([])

  const selectedChildCategory = selectedCategoryPath[selectedCategoryPath.length - 1]
  const selectedChildCategoryId = selectedChildCategory?.category_id

  const {
    currentData: mainCategoryChilds,
    isFetching: isMainCategoryLoading,
  } = useGetChildGategoriesQuery(selectedMainCategory ?? skipToken)
  const {
    currentData: nestedChildCategories,
    isFetching: isNestedCategoriesLoading,
  } = useGetChildCategoriesByIdQuery(
    selectedChildCategoryId ?? skipToken,
  )
  const { data: entities } = useGetEntitiesQuery(selectedChildCategoryId ?? skipToken)
  const { data: recommendations } = useGetRecommendationsQuery({ skip: 0, limit: 10 })
  const { data: favoriteIds = [] } = useGetFavoriteIdsQuery(undefined, { skip: !loggedIn })
  const [addFavorite] = useAddFavoriteMutation()
  const [removeFavorite] = useRemoveFavoriteMutation()

  useEffect(() => {
    const syncAuth = () => setLoggedIn(isAuthenticated())

    syncAuth()
    window.addEventListener(authEventName, syncAuth)
    window.addEventListener('storage', syncAuth)

    return () => {
      window.removeEventListener(authEventName, syncAuth)
      window.removeEventListener('storage', syncAuth)
    }
  }, [])

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const type = params.get('type')

    if (type === 'places') {
      setSelectedMainCategory('Места')
      setSelectedCategoryPath([])
    }

    if (type === 'events') {
      setSelectedMainCategory('Мероприятия')
      setSelectedCategoryPath([])
    }

    if (!location.hash) return

    const scrollToTarget = () => {
      const target = document.querySelector(location.hash)
      target?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }

    window.requestAnimationFrame(scrollToTarget)
  }, [location.hash, location.search])

  const childCategories = useMemo(() => {
    if (selectedCategoryPath.length) {
      return nestedChildCategories?.categories ?? []
    }

    return mainCategoryChilds?.categories ?? []
  }, [mainCategoryChilds?.categories, nestedChildCategories?.categories, selectedCategoryPath.length])

  const shouldRenderBranch = selectedChildCategoryId
    ? isNestedCategoriesLoading || childCategories.length > 0
    : isMainCategoryLoading || childCategories.length > 0
  const branchOnNextLine = selectedCategoryPath.length >= 1

  const breadcrumbCategories = useMemo<Category[]>(
    () => [
      {
        category_id: ROOT_CATEGORY_IDS[selectedMainCategory],
        name: selectedMainCategory,
        parent_id: null,
      },
      ...selectedCategoryPath,
    ],
    [selectedMainCategory, selectedCategoryPath],
  )

  const selectionCards = useMemo(() => {
    if (!recommendations?.length) {
      return []
    }

    return [...recommendations]
      .sort(() => Math.random() - 0.5)
      .slice(0, 5)
  }, [recommendations])

  const visibleEntities = useMemo(() => {
    if (entities?.entities?.length && selectedChildCategoryId) {
      return entities.entities
    }

    if (selectedChildCategoryId) {
      return []
    }

    return []
  }, [entities?.entities, selectedChildCategoryId])

  const shouldShowResults = Boolean(selectedChildCategoryId)

  const favoriteIdsSet = useMemo(() => new Set(favoriteIds), [favoriteIds])
  const pendingFavoriteIdsSet = useMemo(() => new Set(pendingFavoriteIds), [pendingFavoriteIds])

  const paginatedVisibleEntities = useMemo(() => {
    return visibleEntities.slice(0, visibleResultsCount)
  }, [visibleEntities, visibleResultsCount])

  const hasMoreResults = visibleEntities.length > paginatedVisibleEntities.length

  const handleSelectMainCategory = (category: string) => {
    setSelectedMainCategory(category)
    setSelectedCategoryPath([])
    setVisibleResultsCount(6)
  }

  const handleLoadEntities = (category: Category) => {
    setSelectedCategoryPath((currentPath) => [...currentPath, category])
    setVisibleResultsCount(6)
  }

  const handleSelectPathLevel = (index: number) => {
    if (index === 0) {
      setSelectedCategoryPath([])
      setVisibleResultsCount(6)
      return
    }

    setSelectedCategoryPath((currentPath) => currentPath.slice(0, index))
    setVisibleResultsCount(6)
  }

  const handleFavoriteToggle = async (entityId: number) => {
    if (!loggedIn) {
      setAuthPromptOpen(true)
      return
    }

    setPendingFavoriteIds((currentIds) => [...currentIds, entityId])

    try {
      if (favoriteIdsSet.has(entityId)) {
        await removeFavorite(entityId).unwrap()
      } else {
        await addFavorite(entityId).unwrap()
      }
    } finally {
      setPendingFavoriteIds((currentIds) => currentIds.filter((currentId) => currentId !== entityId))
    }
  }

  const renderFavoriteButton = (entityId: number) => (
    <FavoriteIconButton
      active={favoriteIdsSet.has(entityId)}
      disabled={pendingFavoriteIdsSet.has(entityId)}
      onClick={(event) => {
        event.preventDefault()
        event.stopPropagation()
        void handleFavoriteToggle(entityId)
      }}
      className={styles.cardFavorite}
      ariaLabel={favoriteIdsSet.has(entityId) ? 'Убрать из избранного' : 'Добавить в избранное'}
    />
  )

  const renderResultCard = ({ entity_id, name, photo, address, date }: Entity) => (
    <article key={entity_id} className={styles.cardShell}>
      {renderFavoriteButton(entity_id)}
      <Link to={`/place/${entity_id}`} className={styles.resultCard}>
        <img src={resolveEntityPhoto(photo)} alt={name} className={styles.resultCard__image} />
        <div className={styles.resultCard__body}>
          <span>{address || 'Городская локация'}</span>
          <strong>{name}</strong>
          <p>{date || 'Сегодня'}</p>
        </div>
      </Link>
    </article>
  )

  const renderSelectionCard = ({ entity_id, name, photo }: Entity, index: number) => (
    <article key={`${entity_id}-${index}`} className={styles.cardShell}>
      {renderFavoriteButton(entity_id)}
      <Link to={`/place/${entity_id}`} className={styles.railCard}>
        <div className={styles.railCard__media}>
          <img src={resolveEntityPhoto(photo)} alt={name} />
        </div>
        <div className={styles.railCard__body}>
          <strong>{name}</strong>
        </div>
      </Link>
    </article>
  )

  return (
    <>
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

            <div className={`${styles.childCategories} ${branchOnNextLine ? styles.childCategories_stacked : ''}`}>
              <div className={styles.childCategories__path}>
                {breadcrumbCategories.map((category, index) => (
                  <div key={`${category.category_id}-${category.name}`} className={styles.childCategories__crumb}>
                    {index > 0 ? <span className={styles.childCategories__divider} /> : null}
                    <button
                      type="button"
                      className={`${styles.childCategories__item} ${styles.childCategories__item_active}`}
                      onClick={() => handleSelectPathLevel(index)}
                    >
                      {category.name}
                    </button>
                  </div>
                ))}
              </div>

              {shouldRenderBranch ? (
                <div
                  className={`${styles.childCategories__branch} ${branchOnNextLine ? styles.childCategories__branch_nextLine : ''}`}
                >
                  {isMainCategoryLoading || isNestedCategoriesLoading ? (
                    <div className="loader" />
                  ) : (
                    childCategories.map(({ category_id, name }) => (
                      <button
                        key={category_id}
                        type="button"
                        className={styles.childCategories__item}
                        onClick={() =>
                          handleLoadEntities({
                            category_id,
                            name,
                            parent_id: selectedChildCategoryId ?? ROOT_CATEGORY_IDS[selectedMainCategory],
                          })}
                      >
                        {name}
                      </button>
                    ))
                  )}
                </div>
              ) : null}
            </div>
          </div>
        </section>

        <section className={styles.selections}>
          <div className="container">
            <div className={styles.resultsHead}>
            </div>

            {shouldShowResults ? (
              <div className={styles.resultsGrid}>
                {visibleEntities.length ? (
                  paginatedVisibleEntities.map(renderResultCard)
                ) : (
                  <div className={styles.emptyState}>В этой категории пока ничего нет</div>
                )}
              </div>
            ) : null}

            {shouldShowResults && hasMoreResults ? (
              <div className={styles.resultsControls}>
                <button
                  type="button"
                  className={styles.resultsControls__button}
                  onClick={() =>
                    setVisibleResultsCount((currentCount) => Math.min(currentCount + 6, visibleEntities.length))}
                >
                  Загрузить еще
                </button>
              </div>
            ) : null}

            <div className={`${styles.sectionHeading} ${styles.sectionHeading_spaced}`} id="collections">
              <span>Подборки</span>
              <h2>Самые интересные места и мероприятия, подобранные специально для вас</h2>
            </div>

            {selectionCards.length ? (
              <div className={styles.railWrap}>
                <div className={styles.rail}>
                  {selectionCards.map(renderSelectionCard)}
                </div>
              </div>
            ) : null}
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
        <AuthRequiredModal open={authPromptOpen} onClose={() => setAuthPromptOpen(false)} />
      </Layout>
    </>
  )
}
