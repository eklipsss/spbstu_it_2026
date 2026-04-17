import type { MouseEvent } from 'react'
import styles from './favorite-icon-button.module.scss'

type FavoriteIconButtonProps = {
  active: boolean
  onClick: (event: MouseEvent<HTMLButtonElement>) => void
  disabled?: boolean
  className?: string
  ariaLabel?: string
}

export const FavoriteIconButton = ({
  active,
  onClick,
  disabled = false,
  className = '',
  ariaLabel = 'Добавить в избранное',
}: FavoriteIconButtonProps) => {
  return (
    <button
      type="button"
      className={`${styles.favoriteButton} ${active ? styles.favoriteButton_active : ''} ${className}`.trim()}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      aria-pressed={active}
    >
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path d="M12 20.25C12 20.25 4.5 15.75 4.5 9.75C4.5 7.26472 6.51472 5.25 9 5.25C10.5405 5.25 11.9003 6.02193 12.75 7.20006C13.5997 6.02193 14.9595 5.25 16.5 5.25C18.9853 5.25 21 7.26472 21 9.75C21 15.75 13.5 20.25 13.5 20.25H12Z" fill="currentColor" />
      </svg>
    </button>
  )
}
