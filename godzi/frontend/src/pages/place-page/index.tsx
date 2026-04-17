import { useGetEntityDataQuery } from '@/entities/entity/api'
import { useAddFavoriteMutation, useGetFavoriteIdsQuery, useRemoveFavoriteMutation } from '@/entities/favorites/api'
import { PlacePageGallery, PlacePageInfo } from '@/features/place-page'
import YandexMap from '@/features/place-page/map/map'
import { AuthRequiredModal, Layout } from '@/shared/components'
import { authEventName, isAuthenticated } from '@/shared/utils/session'
import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'

export const PlacePage = () => {
  const { id } = useParams()
  const { data } = useGetEntityDataQuery({ id })
  const [loggedIn, setLoggedIn] = useState(() => isAuthenticated())
  const [authPromptOpen, setAuthPromptOpen] = useState(false)
  const [favoritePending, setFavoritePending] = useState(false)
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

  const isFavorite = useMemo(
    () => (data?.entity_id ? favoriteIds.includes(data.entity_id) : false),
    [data?.entity_id, favoriteIds],
  )

  const handleFavoriteToggle = async () => {
    if (!data?.entity_id) return

    if (!loggedIn) {
      setAuthPromptOpen(true)
      return
    }

    setFavoritePending(true)
    try {
      if (isFavorite) {
        await removeFavorite(data.entity_id).unwrap()
      } else {
        await addFavorite(data.entity_id).unwrap()
      }
    } finally {
      setFavoritePending(false)
    }
  }

  return (
    <>
      <Helmet>
        <title>{data?.name ?? 'Карточка места'}</title>
        <meta name="description" content={data?.description ?? 'Подробная карточка выбранной локации'} />
        <meta property="og:title" content={data?.name ?? 'Карточка места'} />
        <meta property="og:description" content={data?.description ?? 'Подробная карточка выбранной локации'} />
      </Helmet>
      <Layout>
        <PlacePageInfo
          data={data}
          isFavorite={isFavorite}
          isFavoriteUpdating={favoritePending}
          onFavoriteToggle={() => void handleFavoriteToggle()}
        />
        <PlacePageGallery />

        <section className="container">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1.5rem' }}>
            <div>
              <h2 style={{ margin: 0, fontSize: '1.6rem' }}>На карте</h2>
              <p style={{ margin: '0.5rem 0 0', color: '#6f6778', lineHeight: 1.6 }}>
                {data?.address ?? 'Адрес'}
              </p>
            </div>
            <YandexMap address={data?.address ?? ''} />
          </div>
        </section>
        <AuthRequiredModal open={authPromptOpen} onClose={() => setAuthPromptOpen(false)} />
      </Layout>
    </>
  )
}
