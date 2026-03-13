import { useGetEntityDataQuery } from '@/entities/entity/api'
import { PlacePageGallery, PlacePageInfo } from '@/features/place-page'
import YandexMap from '@/features/place-page/map/map'
import { Layout } from '@/shared/components'
import { useParams } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'

export const PlacePage = () => {
  const { id } = useParams()
  const { data } = useGetEntityDataQuery({ id })

  return (
    <>
      <Helmet>
        <title>{data?.name ?? 'Карточка места'}</title>
        <meta name="description" content={data?.description ?? 'Подробная карточка выбранной локации'} />
        <meta property="og:title" content={data?.name ?? 'Карточка места'} />
        <meta property="og:description" content={data?.description ?? 'Подробная карточка выбранной локации'} />
      </Helmet>
      <Layout>
        <PlacePageInfo data={data} />
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
      </Layout>
    </>
  )
}
