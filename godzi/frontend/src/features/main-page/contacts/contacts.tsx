import { classNames } from '@/shared/utils'
import styles from './contacts.module.scss'

export const MainPageContacts = () => {
  return (
    <section className={classNames(styles.contacts, {}, ['animate', 'fadeInUp'])}>
      <div className="container">
        <div className={styles.contacts__panel}>
          <div className={styles.contacts__info}>
            <span className={styles.contacts__eyebrow}>Связаться с нами</span>
            <h4 className={styles.contacts__title}>Нужен персональный сценарий под ваш вечер или мероприятие?</h4>
            <div className={styles.contacts__description}>
              <p>Напишите, какой формат отдыха вы ищете, сколько у вас времени и какой нужен бюджет.</p>
              <p>Подскажем подходящие места, соберём маршрут или обсудим партнёрство с GOdzi.</p>
            </div>
          </div>

          <ul className={styles.contacts__links}>
            <li className={styles.contacts__links__item}>
              <a className={styles.contacts__links__link} href="https://t.me/test" target="_blank" rel="noopener noreferrer">
                <div className={styles.contacts__links__icon}>
                  <svg width="28" height="23" viewBox="0 0 28 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" clipRule="evenodd" d="M2.31564 9.73609C9.60365 6.56082 14.4635 4.46749 16.8951 3.4561C23.8378 0.568359 25.2805 0.0667286 26.2208 0.0501644C26.4276 0.0465213 26.89 0.0977748 27.1895 0.340823C27.4425 0.546048 27.512 0.823278 27.5453 1.01785C27.5786 1.21243 27.6201 1.65568 27.5872 2.00202C27.2109 5.95511 25.583 15.5482 24.7548 19.9758C24.4043 21.8492 23.7143 22.4774 23.0463 22.5388C21.5945 22.6724 20.492 21.5794 19.0859 20.6577C16.8856 19.2153 15.6425 18.3174 13.5067 16.91C11.0384 15.2834 12.6385 14.3894 14.0452 12.9284C14.4133 12.5461 20.81 6.72781 20.9338 6.20001C20.9493 6.13399 20.9636 5.88794 20.8175 5.75801C20.6713 5.62808 20.4555 5.67251 20.2998 5.70785C20.0792 5.75793 16.5641 8.08125 9.7547 12.6778C8.75696 13.3629 7.85325 13.6967 7.04355 13.6792C6.15092 13.66 4.43386 13.1745 3.1574 12.7596C1.59177 12.2507 0.347443 11.9816 0.455796 11.1173C0.512233 10.6671 1.13218 10.2067 2.31564 9.73609Z" fill="currentColor" />
                  </svg>
                </div>
                <div>
                  <strong>Telegram</strong>
                  <p></p>
                </div>
              </a>
            </li>
            <li className={styles.contacts__links__item}>
              <a className={styles.contacts__links__link} href="mailto:godzi.togo@mail.ru">
                <div className={styles.contacts__links__icon}>@</div>
                <div>
                  <strong>E-mail</strong>
                  <p>godzi.togo@mail.ru</p>
                </div>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </section>
  )
}
