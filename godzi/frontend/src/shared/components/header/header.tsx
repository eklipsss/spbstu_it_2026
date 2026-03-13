import { FC } from 'react'
import styles from './header.module.scss'
import { Link } from 'react-router-dom'

const actionIcons = {
  favorite: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M12 20.25C12 20.25 4.5 15.75 4.5 9.75C4.5 7.26472 6.51472 5.25 9 5.25C10.5405 5.25 11.9003 6.02193 12.75 7.20006C13.5997 6.02193 14.9595 5.25 16.5 5.25C18.9853 5.25 21 7.26472 21 9.75C21 15.75 13.5 20.25 13.5 20.25H12Z" fill="currentColor" />
    </svg>
  ),
  profile: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M12 12C14.4853 12 16.5 9.98528 16.5 7.5C16.5 5.01472 14.4853 3 12 3C9.51472 3 7.5 5.01472 7.5 7.5C7.5 9.98528 9.51472 12 12 12Z" stroke="currentColor" strokeWidth="1.8" />
      <path d="M4.5 20.25C4.5 17.3505 7.85786 15 12 15C16.1421 15 19.5 17.3505 19.5 20.25" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  ),
}

export const Header: FC = () => {
  return (
    <header className={styles.header}>
      <div className={`container ${styles.header__inner}`}>
        <Link to="/" className={styles.header__brand} aria-label="GOdzi — на главную">
          <span className={styles.header__brandMark}>GO</span>
          <span className={styles.header__brandText}>dzi</span>
        </Link>

        <nav aria-label="Основная навигация" className={styles.header__nav}>
          <ul className={styles.header__navList}>
            <li>
              <Link to="/?section=categories&type=places#categories">Места</Link>
            </li>
            <li>
              <Link to="/?section=categories&type=events#categories">Мероприятия</Link>
            </li>
            <li>
              <Link to="/#collections">Подборки</Link>
            </li>
            <li>
              <Link to="/#about">О нас</Link>
            </li>
          </ul>
        </nav>

        <div className={styles.header__actions}>
          <button type="button" className={styles.header__iconButton} aria-label="Избранное">
            {actionIcons.favorite}
          </button>
          <Link to="/profile" className={styles.header__iconButton} aria-label="Личный кабинет">
            {actionIcons.profile}
          </Link>
        </div>
      </div>
    </header>
  )
}
