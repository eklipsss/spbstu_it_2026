import { useGetMeQuery, useUpdateMeMutation } from '@/entities/auth/api'
import { useGetCategoriesQuery } from '@/entities/categories/api'
import { useGetTagsQuery } from '@/entities/tags/api'
import { buildStoredProfileFromUser, getStoredProfile, isAuthenticated, saveStoredProfile } from '@/shared/utils/session'
import { Layout } from '@/shared/components'
import { FormEvent, useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import styles from './edit-profile-page.module.scss'

const normalizePhoneNumber = (value: string) => {
  const digits = value.replace(/\D/g, '')
  if (!digits) return ''

  if (digits.startsWith('8') && digits.length === 11) {
    return `+7${digits.slice(1)}`
  }

  if (digits.startsWith('7') && digits.length === 11) {
    return `+${digits}`
  }

  return value.trim()
}

export const EditProfilePage = () => {
  const navigate = useNavigate()
  const [form, setForm] = useState(getStoredProfile())
  const { data: me } = useGetMeQuery(undefined, { skip: !isAuthenticated() })
  const [updateMe] = useUpdateMeMutation()
  const { data: categoryOptions = [] } = useGetCategoriesQuery({ skip: 0, limit: 200 })
  const { data: tagOptions = [] } = useGetTagsQuery({ skip: 0, limit: 200 })

  const availableCategories = useMemo(
    () => categoryOptions.filter((item) => item.parent_id !== null),
    [categoryOptions],
  )

  useEffect(() => {
    if (!me) return

    setForm(
      buildStoredProfileFromUser(me, {
        city: me.city ?? '',
        about: me.about ?? '',
        categories: me.categories,
        tags: me.tags,
      }),
    )
  }, [me])

  const toggleSelection = (value: string, key: 'categories' | 'tags') => {
    const current = form[key]
    setForm({
      ...form,
      [key]: current.includes(value) ? current.filter((item) => item !== value) : [...current, value],
    })
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    const updatedUser = await updateMe({
      full_name: form.fullName,
      email: form.email,
      phone_number: normalizePhoneNumber(form.phone),
      city: form.city,
      about: form.about,
      categories: form.categories,
      tags: form.tags,
    }).unwrap()

    saveStoredProfile(
      buildStoredProfileFromUser(updatedUser, {
        city: updatedUser.city ?? '',
        about: updatedUser.about ?? '',
        categories: updatedUser.categories,
        tags: updatedUser.tags,
      }),
    )
    navigate('/profile')
  }

  return (
    <>
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
                  {availableCategories.map((item) => (
                    <button
                      key={item.category_id}
                      type="button"
                      className={`${styles.tagButton} ${form.categories.includes(item.name) ? styles.tagButton_active : ''}`}
                      onClick={() => toggleSelection(item.name, 'categories')}
                    >
                      {item.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className={styles.preferences__block}>
                <span className={styles.preferences__title}>Теги</span>
                <div className={styles.preferences__chips}>
                  {tagOptions.map((item) => (
                    <button
                      key={item.tag_id}
                      type="button"
                      className={`${styles.tagButton} ${form.tags.includes(item.name) ? styles.tagButton_active : ''}`}
                      onClick={() => toggleSelection(item.name, 'tags')}
                    >
                      {item.name}
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
