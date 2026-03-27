import { demoProfile } from '@/shared/mocks/profile'
import { getStoredProfile, profileEventName } from '@/shared/utils/session'
import { Layout } from '@/shared/components'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import styles from './profile-page.module.scss'

export const ProfilePage = () => {
  const [profile, setProfile] = useState(demoProfile)

  useEffect(() => {
    const syncProfile = () => setProfile(getStoredProfile())

    syncProfile()
    window.addEventListener(profileEventName, syncProfile)
    window.addEventListener('storage', syncProfile)

    return () => {
      window.removeEventListener(profileEventName, syncProfile)
      window.removeEventListener('storage', syncProfile)
    }
  }, [])

  return (
    <Layout>
      <section className={`container ${styles.profile}`}>
        <div className={styles.profile__hero}>
          <div className={styles.profile__avatar} aria-hidden="true" />

          <div className={styles.profile__card}>
            <h1>{profile.fullName}</h1>

            <div className={styles.profile__meta}>
              <span>{profile.email}</span>
              <span>{profile.phone}</span>
              <span>{profile.city}</span>
            </div>

            <p>{profile.about}</p>
          </div>
        </div>

        <div className={styles.profile__actions}>
          <span className={styles.profile__label}>Профиль</span>
          <Link to="/profile/edit" className={styles.profile__editButton}>
            Изменить
          </Link>
        </div>

        <div className={styles.profile__preferences}>
          <article className={styles.profile__preferencesCard}>
            <h2>Категории</h2>
            <div className={styles.profile__chips}>
              {profile.categories.map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>
          </article>

          <article className={styles.profile__preferencesCard}>
            <h2>Теги</h2>
            <div className={styles.profile__chips}>
              {profile.tags.map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>
          </article>
        </div>
      </section>
    </Layout>
  )
}
