import { Link } from 'react-router-dom'
import styles from './auth-required-modal.module.scss'

type AuthRequiredModalProps = {
  open: boolean
  onClose: () => void
}

export const AuthRequiredModal = ({ open, onClose }: AuthRequiredModalProps) => {
  if (!open) {
    return null
  }

  return (
    <div className={styles.modalOverlay} role="dialog" aria-modal="true">
      <div className={styles.modal}>
        <h2>Сохраните это в избранное</h2>
        <p>Чтобы добавлять места и мероприятия в избранное, нужно войти в аккаунт или зарегистрироваться.</p>
        <div className={styles.actions}>
          <Link to="/login" className={styles.primaryButton} onClick={onClose}>
            Войти
          </Link>
          <Link to="/register" className={styles.secondaryButton} onClick={onClose}>
            Зарегистрироваться
          </Link>
        </div>
        <button type="button" className={styles.closeButton} onClick={onClose}>
          Закрыть
        </button>
      </div>
    </div>
  )
}
