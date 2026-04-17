import { Link } from 'react-router-dom'
import styles from './info.module.scss'
import { FC } from 'react'
import { Entity } from '@/shared/types'
import { FavoriteIconButton } from '@/shared/components'
import { resolveEntityPhoto } from '@/shared/utils'

interface PlacePageInfoProps {
  data?: Entity
  isFavorite: boolean
  isFavoriteUpdating: boolean
  onFavoriteToggle: () => void
}

const placeDetails = (data?: Entity) => [
  data?.address ? { label: 'Адрес', value: data.address } : null,
  data?.metro ? { label: 'Рядом', value: data.metro } : null,
  data?.date ? { label: 'График', value: data.date } : null,
  data?.average_cost || data?.cost ? { label: 'Средний чек', value: data.average_cost || data.cost } : null,
  data?.contacts ? { label: 'Контакты', value: data.contacts, href: `tel:${data.contacts}` } : null,
  data?.links ? { label: 'Сайт', value: data.links, href: data.links } : null,
].filter(Boolean) as { label: string; value: string; href?: string }[]

export const PlacePageInfo: FC<PlacePageInfoProps> = ({ data, isFavorite, isFavoriteUpdating, onFavoriteToggle }) => {
  const details = placeDetails(data)

  return (
    <section className="container">
      <Link className={styles.backLink} to="/">
        ← Назад
      </Link>

      <div className={styles.title__bar}>
        <div className={styles.title__bar__body}>
          {/* <span className={styles.title__bar__eyebrow}>Карточка места</span> */}
          <h1 className={styles.title__bar__name}>{data?.name ?? 'Информация скоро появится'}</h1>
          <p className={styles.title__bar__description}>
            {data?.description ?? 'Краткое описание места/мероприятия'}
          </p>
        </div>
        {data?.entity_id ? (
          <FavoriteIconButton
            active={isFavorite}
            disabled={isFavoriteUpdating}
            onClick={(event) => {
              event.preventDefault()
              onFavoriteToggle()
            }}
            className={styles.title__bar__favorite}
            ariaLabel={isFavorite ? 'Убрать из избранного' : 'Добавить в избранное'}
          />
        ) : null}
      </div>

      <div className={styles.info}>
        <div className={styles.info__imageWrapper}>
          <div className={styles.info__image} style={{ backgroundImage: `url(${resolveEntityPhoto(data?.photo)})` }} />
        </div>

        <div className={styles.info__wrapper}>
          <div className={styles.info__left}>
            <h2>О месте</h2>
            <p>{data?.description ?? 'Подробное описание места/мероприятия'}</p>
            {data?.source_link ? <span className={styles.info__source}>Источник: {data.source_link}</span> : null}
          </div>

          <aside className={styles.info__right}>
            <h3>Что важно знать</h3>
            <div className={styles.info__right__list}>
              {details.length ? (
                details.map((item) => (
                  <div className={styles.info__right__item} key={item.label + item.value}>
                    <span>{item.label}</span>
                    {item.href ? (
                      <a className={styles.info__link} target="_blank" rel="noreferrer" href={item.href}>
                        {item.value}
                      </a>
                    ) : (
                      <p>{item.value}</p>
                    )}
                  </div>
                ))
              ) : (
                <div className={styles.info__right__empty}>Важная информация</div>
              )}
            </div>
          </aside>
        </div>
      </div>
    </section>
  )
}
