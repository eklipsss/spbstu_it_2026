import { Swiper, SwiperSlide } from 'swiper/react'
import styles from './guides.module.scss'
import { classNames } from '@/shared/utils'
import { Pagination } from 'swiper/modules'
import placesImage from '@assets/images/main_places.png'
import eventsImage from '@assets/images/main_events.png'
import { Link } from 'react-router-dom'

const guides = [
  { id: 1, title: 'Маршрут по барам, который никто не пройдёт до конца', subtitle: 'Ироничный вечер по мотивам городских историй', image: placesImage },
  { id: 1, title: 'Ленивый выходной: кофе, маркет и долгая прогулка', subtitle: 'Сценарий для спокойного дня без спешки', image: placesImage },
  { id: 1, title: 'Вечернее свидание: выставка, ужин и финальная точка', subtitle: 'Готовый ритм встречи, который легко повторить', image: eventsImage },
]

export const MainPageGuides = () => {
  return (
    <section className={classNames(styles.guides, {}, ['animate', 'fadeInUp'])} id="guides">
      <div className="container">
        <div className={styles.guides__heading}>
          <div>
            <span className={styles.guides__eyebrow}>Гайды</span>
            <h2 className={styles.guides__title}>Готовые сценарии, когда не хочется собирать маршрут самому</h2>
          </div>
          <p className={styles.guides__description}>
            От короткой прогулки до тематического вечера — собрали форматы, которые можно открыть и сразу повторить.
          </p>
        </div>

        <Swiper
          className={styles.guides__swiper}
          modules={[Pagination]}
          pagination={{ clickable: true }}
          spaceBetween={20}
          breakpoints={{
            0: { slidesPerView: 1.05 },
            700: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
        >
          {guides.map((guide) => (
            <SwiperSlide className={styles['swiper-slide']} key={guide.title}>
              <Link to={`/guide/${guide.id}`} className={styles.guides__card}>
                <img src={guide.image} alt={guide.title} className={styles.guides__image} />
                <div className={styles.guides__body}>
                  <span className={styles.guides__badge}>Авторский гайд</span>
                  <h3>{guide.title}</h3>
                  <p>{guide.subtitle}</p>
                </div>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  )
}
