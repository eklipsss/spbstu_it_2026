import { classNames } from '@/shared/utils'
import styles from './hero.module.scss'
import bgVideo from '@assets/videos/main_page_hero_bg.mp4'
import { Link } from 'react-router-dom'

const highlights = [
  'Подборки мест и событий',
  'Гайды по районам и сценариям отдыха',
  'Быстрый переход к выбранным локациям',
]

export const MainPageHero = () => {
  return (
    <section className={classNames(styles.hero, {}, [styles.hero__wow])}>
      <video className={styles.hero__video} src={bgVideo} autoPlay muted loop playsInline />
      <div className={styles.hero__overlay} />

      <div className={classNames('container', {}, [styles.hero__container])}>
        <div className={styles.hero__content}>
          <div className={styles.hero__copy}>
            <span className={styles.hero__eyebrow}>Городские маршруты без перегруза</span>
            <h1 className={styles.hero__headline}>Находите места, в которые захочется вернуться</h1>
            <p className={styles.hero__tagline}>
              GOdzi собирает локации, события и готовые идеи для прогулок, свиданий, встреч с друзьями и спонтанных выходных.
            </p>

            <div className={styles.hero__actions}>
              <Link to="/#categories" className={styles.hero__ctaPrimary}>
                Смотреть подборки
              </Link>
              <Link to="/#guides" className={styles.hero__ctaSecondary}>
                Открыть гайды
              </Link>
            </div>
          </div>

          <aside className={styles.hero__panel} aria-label="Преимущества сервиса">
            <div className={styles.hero__metricRow}>
              <div>
                <strong>50+</strong>
                <span>идей для городского отдыха</span>
              </div>
              <div>
                <strong>1 клик</strong>
                <span>до страницы нужного места</span>
              </div>
            </div>

            <ul className={styles.hero__list}>
              {highlights.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </aside>
        </div>
      </div>
    </section>
  )
}
