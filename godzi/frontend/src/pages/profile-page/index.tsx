import { Layout } from '@/shared/components'
import styles from './profile-page.module.scss'

export const ProfilePage = () => {
  return (
    <Layout>
      <section className={`container ${styles.profile}`}>
        <div className={styles.profile__card}>
          {/* <span className={styles.profile__eyebrow}>Личный кабинет</span> */}
          <h1>Страница регистрации и авторизации появится здесь позже.</h1>
        </div>
      </section>
    </Layout>
  )
}
