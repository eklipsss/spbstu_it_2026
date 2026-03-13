import { useGetRecommendationsQuery } from '@/entities/recommendations/api'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Pagination } from 'swiper/modules'
import styles from './recommendations.module.scss'
import { classNames } from '@/shared/utils'
import { Link } from 'react-router-dom'
import placesImage from '@assets/images/main_places.png'
import eventsImage from '@assets/images/main_events.png'

const fallbackRecommendations = [
  { entity_id: 101, name: 'Неспешный вечер в атмосферном баре', photo: placesImage },
  { entity_id: 102, name: 'Маршрут по фотогеничным городским локациям', photo: placesImage },
  { entity_id: 103, name: 'Выходной с выставкой и ужином', photo: eventsImage },
]

export const MainPageRecommendations = () => {
  const { data } = useGetRecommendationsQuery({ skip: 0, limit: 5 })
  const items = data?.length ? data : fallbackRecommendations

  return (
    <section className={classNames(styles.recommendations, {}, ['animate', 'fadeInUp'])}>
      <div className="container">
        <div className={styles.recommendations__heading}>
          <div>
            <span className={styles.recommendations__eyebrow}>Избранное</span>
            <h2 className={styles.recommendations__title}>Готовые идеи, с которых удобно начать</h2>
          </div>
          <p className={styles.recommendations__description}>
            Сохранили карточки мест и сценариев, которые подходят для спокойного вечера, активного выходного и спонтанной встречи.
          </p>
        </div>

        <Swiper
          className={styles.recommendations__swiper}
          modules={[Pagination]}
          pagination={{ clickable: true }}
          spaceBetween={20}
          breakpoints={{
            0: { slidesPerView: 1.05 },
            700: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
        >
          {items.map(({ name, entity_id, photo }) => (
            <SwiperSlide className={styles.recommendations__swiper__slide} key={entity_id}>
              <Link to={`/place/${entity_id}`} className={styles.recommendations__card}>
                <img src={photo} alt={name} className={styles.recommendations__image} />
                <div className={styles.recommendations__content}>
                  <span className={styles.recommendations__badge}>Рекомендуем</span>
                  <p>{name}</p>
                  <span className={styles.recommendations__link}>Открыть карточку места</span>
                </div>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  )
}
