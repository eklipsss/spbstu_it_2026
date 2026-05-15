import { useGetFavoritesQuery, useRemoveFavoriteMutation } from '@/entities/favorites/api'
import { Layout, FavoriteIconButton } from '@/shared/components'
import { isAuthenticated } from '@/shared/utils/session'
import { resolveEntityPhoto } from '@/shared/utils'
import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import styles from './favorites-page.module.scss'

export const FavoritesPage = () => {
  const navigate = useNavigate()
  const loggedIn = isAuthenticated()
  const { data: favorites = [], isFetching } = useGetFavoritesQuery(undefined, {
    skip: !loggedIn,
    refetchOnMountOrArgChange: true,
  })
  const [removeFavorite, { isLoading: isUpdatingFavorite }] = useRemoveFavoriteMutation()

  useEffect(() => {
    if (!loggedIn) {
      navigate('/login')
    }
  }, [loggedIn, navigate])

  if (!loggedIn) {
    return null
  }

  return (
    <>
      <Layout>
        <section className={`container ${styles.favorites}`}>
          <div className={styles.head}>
            <span>Избранное</span>
            <h1>Ваши сохраненные места и мероприятия</h1>
            <p>Сюда попадают карточки, которые вы отметили сердечком.</p>
          </div>

          {isFetching ? <div className="loader" /> : null}

          {!isFetching && !favorites.length ? (
            <div className={styles.emptyState}>
              <h2>Пока здесь пусто</h2>
              <p>Сохраняйте понравившиеся места и мероприятия с главной страницы, и они появятся здесь.</p>
              <Link to="/" className={styles.primaryButton}>
                На главную
              </Link>
            </div>
          ) : null}

          {favorites.length ? (
            <div className={styles.grid}>
              {favorites.map(({ entity_id, name, photo, address, date }) => (
                <article key={entity_id} className={styles.cardShell}>
                  <FavoriteIconButton
                    active={true}
                    disabled={isUpdatingFavorite}
                    onClick={(event) => {
                      event.preventDefault()
                      void removeFavorite(entity_id)
                    }}
                    className={styles.cardFavorite}
                    ariaLabel="Убрать из избранного"
                  />

                  <Link to={`/place/${entity_id}`} className={styles.card}>
                    <img src={resolveEntityPhoto(photo)} alt={name} className={styles.card__image} />
                    <div className={styles.card__body}>
                      <span>{address || 'Городская локация'}</span>
                      <strong>{name}</strong>
                      <p>{date || 'Сегодня'}</p>
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          ) : null}
        </section>
      </Layout>
    </>
  )
}
