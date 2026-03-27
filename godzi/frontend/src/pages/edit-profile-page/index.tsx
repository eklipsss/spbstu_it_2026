import { categoryOptions, tagOptions } from '@/shared/mocks/preferences'
import { getStoredProfile, saveStoredProfile } from '@/shared/utils/session'
import { Layout } from '@/shared/components'
import { Helmet } from 'react-helmet-async'
import { FormEvent, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import styles from './edit-profile-page.module.scss'

export const EditProfilePage = () => {
  const navigate = useNavigate()
  const [form, setForm] = useState(getStoredProfile())

  const toggleSelection = (value: string, key: 'categories' | 'tags') => {
    const current = form[key]
    setForm({
      ...form,
      [key]: current.includes(value) ? current.filter((item) => item !== value) : [...current, value],
    })
  }

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    saveStoredProfile(form)
    navigate('/profile')
  }

  return (
    <>
      <Helmet>
        <title>Редактирование профиля — GOdzi</title>
      </Helmet>

      <Layout>
        <section className={`container ${styles.editProfile}`}>
          <div className={styles.editProfile__head}>
            <span>Редактирование профиля</span>
            <Link to="/profile">Назад</Link>
          </div>

          <form className={styles.editProfile__card} onSubmit={handleSubmit}>
            <h1>Изменить данные</h1>

            <div className={styles.editProfile__grid}>
              <label className={styles.field}>
                <span>Имя и фамилия</span>
                <input value={form.fullName} onChange={(event) => setForm({ ...form, fullName: event.target.value })} />
              </label>

              <label className={styles.field}>
                <span>Электронная почта</span>
                <input type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} />
              </label>

              <label className={styles.field}>
                <span>Номер телефона</span>
                <input value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} />
              </label>

              <label className={styles.field}>
                <span>Город</span>
                <input value={form.city} onChange={(event) => setForm({ ...form, city: event.target.value })} />
              </label>

              <label className={`${styles.field} ${styles.field_wide}`}>
                <span>О себе</span>
                <textarea value={form.about} onChange={(event) => setForm({ ...form, about: event.target.value })} />
              </label>
            </div>

            <div className={styles.preferences}>
              <div className={styles.preferences__block}>
                <span className={styles.preferences__title}>Категории</span>
                <div className={styles.preferences__chips}>
                  {categoryOptions.map((item) => (
                    <button
                      key={item}
                      type="button"
                      className={`${styles.tagButton} ${form.categories.includes(item) ? styles.tagButton_active : ''}`}
                      onClick={() => toggleSelection(item, 'categories')}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>

              <div className={styles.preferences__block}>
                <span className={styles.preferences__title}>Теги</span>
                <div className={styles.preferences__chips}>
                  {tagOptions.map((item) => (
                    <button
                      key={item}
                      type="button"
                      className={`${styles.tagButton} ${form.tags.includes(item) ? styles.tagButton_active : ''}`}
                      onClick={() => toggleSelection(item, 'tags')}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className={styles.editProfile__actions}>
              <Link to="/profile" className={styles.secondaryButton}>
                Отмена
              </Link>
              <button type="submit" className={styles.primaryButton}>
                Сохранить
              </button>
            </div>
          </form>
        </section>
      </Layout>
    </>
  )
}
