import { useGetPlaceImagesQuery } from '@/entities/images/api'
import { useParams } from 'react-router-dom'
import { Swiper, SwiperSlide } from 'swiper/react'
import styles from './gallery.module.scss'
import { Pagination, Navigation } from 'swiper/modules'

export const PlacePageGallery = () => {
  const { id } = useParams()
  const { data } = useGetPlaceImagesQuery(id)

  if (!data?.links?.length) return null

  return (
    <section className="container">
      <div className={styles.gallery__header}>
        <h2>Фотогалерея</h2>
        <p>Несколько кадров, чтобы заранее почувствовать атмосферу места.</p>
      </div>

      {data.links.length > 5 ? (
        <div className={styles.gallery_tiles}>
          {data.links.slice(0, 5).map((item, index) => (
            <div
              key={item}
              style={{ backgroundImage: `url(${item})` }}
              className={`${styles.gallery_tile} ${styles[`gallery_tile_item_${index + 1}`]}`}
            />
          ))}
        </div>
      ) : (
        <Swiper
          loop
          slidesPerView={1}
          className={styles.gallery_swiper}
          modules={[Pagination, Navigation]}
          pagination={{ clickable: true }}
          navigation
        >
          {data.links.map((item) => (
            <SwiperSlide className={styles.gallery_swiper_slide} key={item}>
              <img src={item} alt="Фотография места" />
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </section>
  )
}
