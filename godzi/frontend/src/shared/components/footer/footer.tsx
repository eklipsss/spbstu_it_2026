import styles from './footer.module.scss'
import { Link } from 'react-router-dom'

const socialIcons = {
  telegram: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M21 4.5L3.75 11.25L9.75 13.5L12 19.5L21 4.5Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      <path d="M9.75 13.5L21 4.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  ),
  email: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M4 7.5L12 13.5L20 7.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5.5 5H18.5C19.3284 5 20 5.67157 20 6.5V17.5C20 18.3284 19.3284 19 18.5 19H5.5C4.67157 19 4 18.3284 4 17.5V6.5C4 5.67157 4.67157 5 5.5 5Z" stroke="currentColor" strokeWidth="1.7" />
    </svg>
  ),
  site: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.7" />
      <path d="M4 12H20" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      <path d="M12 4C14.2 6.2 15.4 9 15.4 12C15.4 15 14.2 17.8 12 20" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      <path d="M12 4C9.8 6.2 8.6 9 8.6 12C8.6 15 9.8 17.8 12 20" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  ),
}

export const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.footer__inner}`}>
        <Link to="/" className={styles.footer__logo} aria-label="GOdzi — на главную">
          <span className={styles.footer__logoMark}>GO</span>
          <span className={styles.footer__logoText}>dzi</span>
        </Link>

        <nav className={styles.footer__links} aria-label="Ссылки в подвале">
          <Link to="/#collections">Подборки</Link>
          <Link to="/#about">О нас</Link>
        </nav>

        <div className={styles.footer__socials}>
          <a href="https://t.me/test" target="_blank" rel="noreferrer" aria-label="Telegram">
            {socialIcons.telegram}
          </a>
          <a href="mailto:godzi.togo@mail.ru" aria-label="E-mail">
            {socialIcons.email}
          </a>
          <Link to="/about" aria-label="О проекте">
            {socialIcons.site}
          </Link>
        </div>

        <span className={styles.footer__copyright}>© 2025</span>
      </div>
    </footer>
  )
}
