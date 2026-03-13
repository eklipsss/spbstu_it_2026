import { Layout } from '@/shared/components'
import styles from './about-page.module.scss'

const values = [
  {
    title: 'Быстрый выбор',
    text: 'Помогаем не тонуть в десятках вкладок и сразу собирать подходящий сценарий отдыха.',
  },
  {
    title: 'Человеческий ритм',
    text: 'Нам важны комфорт, настроение и контекст — от прогулки в одиночестве до встречи с друзьями.',
  },
  {
    title: 'Город как опыт',
    text: 'Мы смотрим на места не только как на точки на карте, а как на полноценные впечатления.',
  },
]

export const AboutPage = () => {
  return (
    <Layout>
      <main className={styles.mainContainer}>
        <section className={`container ${styles.heroSection}`}>
          <div className={styles.heroCard}>
            <span className={styles.eyebrow}>О проекте</span>
            <h1 className={styles.title}>GOdzi помогает находить баланс между делами и жизнью вне расписания.</h1>
            <p className={styles.missionText}>
              Мы делаем сервис, в котором можно быстро подобрать место, идею для вечера или готовый маршрут. Без перегруза, бесконечного поиска и ощущения, что отдых тоже нужно долго планировать.
            </p>
          </div>
        </section>

        <section className={`container ${styles.valuesSection}`}>
          <div className={styles.valuesHeader}>
            <h2>На чём строится GOdzi</h2>
            {/* <p>Собрали несколько принципов, которые помогают держать проект полезным и живым.</p> */}
          </div>

          <div className={styles.valuesGrid}>
            {values.map((item) => (
              <article key={item.title} className={styles.valueCard}>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
        </section>
      </main>
    </Layout>
  )
}
