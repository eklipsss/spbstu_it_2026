import { FC } from 'react'
import styles from './info.module.scss'
import { Link } from 'react-router-dom'

interface GuidePageInfoProps {
  id: string
  image: string
  price: string
  name: string
  quote: {
    text: string
    author: string
  }
  description: string
  inside: {
    info: string
    text: string
  }[]
}

export const GuidePageInfo: FC<GuidePageInfoProps> = (guideData) => {
  return (
    <section id="guide" className="container">
      <div className={styles.guide_topbar}>
        <Link to="/" className={styles.guide_back}>
          ← Назад на главную
        </Link>
      </div>

      <div className={styles.guide_container}>
        <div className={styles.guide_left}>
          <img src={guideData.image} alt={guideData.name} />

          <div className={styles.guide_purchaseCard}>
            <div className={styles.guide_price}>{guideData.price}</div>
            <button className={styles.guide_buy}>Купить гайд</button>
            <p>Кнопка оставлена как UI-элемент и готова к подключению реальной оплаты.</p>
          </div>
        </div>

        <div className={styles.guide_info}>
          <span className={styles.guide_badge}>Авторский маршрут</span>
          <div className={styles.guide_info_title}>{guideData.name}</div>

          <div className={styles.guide_info_quoteWrapper}>
            <blockquote className={styles.guide_info_quote}>{guideData.quote.text}</blockquote>
            <p className={styles.guide_info_author}>— {guideData.quote.author}</p>
          </div>

          <div className={styles.guide_info_text} dangerouslySetInnerHTML={{ __html: guideData.description ?? '' }} />

          <div className={styles.guide_info_inside}>
            <div className={styles.guide_info_inside_title}>Что внутри</div>

            <ul className={styles.guide_info_list}>
              {guideData.inside.map(({ info, text }, ind) => (
                <li key={ind + text} className={styles.guide_info_list_item}>
                  <span>{info}</span>
                  {text}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
