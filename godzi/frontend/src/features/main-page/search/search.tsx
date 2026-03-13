import { classNames } from '@/shared/utils'
import styles from './search.module.scss'
import { useLazySearchEntitiesQuery } from '@/entities/entity/api'
import { useState } from 'react'
import { entitiesActions } from '@/entities/entity/slice'
import { useDispatch } from 'react-redux'

export const MainPageSearch = () => {
  const [searchPhrase, setSearchPhrase] = useState('')
  const [search] = useLazySearchEntitiesQuery()
  const { setEntities } = entitiesActions
  const dispatch = useDispatch()

  const handleSearch = async () => {
    try {
      if (!searchPhrase.trim()) return
      const res = await search(searchPhrase)
      dispatch(setEntities(res.data?.entities))
    } catch (e) {
      console.log(e)
    }
  }

  return (
    <section className={classNames(styles.search__section, {}, ['animate', 'fadeInUp'])}>
      <div className="container">
        <div className={styles.search__section__panel}>
          <div className={styles.search__section__copy}>
            <span className={styles.search__section__eyebrow}>Умный поиск</span>
            <h3 className={styles.search__section__title}>Подберите место под настроение, бюджет или формат встречи</h3>
            <p className={styles.search__section__description}>
              Введите запрос вроде «уютная кофейня», «необычная выставка» или «куда сходить вечером», а результаты появятся ниже в блоке подборок.
            </p>
          </div>

          <div className={styles.search}>
            <div className={styles.search__icon} aria-hidden="true">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 21L16.65 16.65M18 11C18 14.866 14.866 18 11 18C7.13401 18 4 14.866 4 11C4 7.13401 7.13401 4 11 4C14.866 4 18 7.13401 18 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <input
              id="search__input"
              className={styles.search__input}
              type="text"
              placeholder="Например: винный бар, маркет, выставка, свидание"
              aria-label="Поиск мест"
              value={searchPhrase}
              onChange={(e) => setSearchPhrase(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSearch()
              }}
            />
            <button onClick={handleSearch} className={styles.search__btn} id="search__btn">
              Найти
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
