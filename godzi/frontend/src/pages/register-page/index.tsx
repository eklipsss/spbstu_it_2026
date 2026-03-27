import { categoryOptions, tagOptions } from '@/shared/mocks/preferences'
import { Layout } from '@/shared/components'
import { saveStoredProfile, signIn } from '@/shared/utils/session'
import { Helmet } from 'react-helmet-async'
import { FormEvent, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import styles from './register-page.module.scss'

type RegistrationResult = 'success' | 'error' | null

const initialForm = {
  fullName: '',
  email: '',
  phone: '',
  password: '',
  repeatPassword: '',
  agreed: false,
}

export const RegisterPage = () => {
  const navigate = useNavigate()
  const [step, setStep] = useState<1 | 2>(1)
  const [result, setResult] = useState<RegistrationResult>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [form, setForm] = useState(initialForm)
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedTags, setSelectedTags] = useState<string[]>([])

  const isFirstStepValid = useMemo(() => {
    return Boolean(
      form.fullName.trim() &&
      form.email.trim() &&
      form.phone.trim() &&
      form.password &&
      form.repeatPassword &&
      form.password === form.repeatPassword &&
      form.agreed,
    )
  }, [form])

  const toggleSelection = (value: string, current: string[], setter: (items: string[]) => void) => {
    if (current.includes(value)) {
      setter(current.filter((item) => item !== value))
      return
    }

    setter([...current, value])
  }

  const handleFirstStepSubmit = (event: FormEvent) => {
    event.preventDefault()
    if (!isFirstStepValid) return
    setStep(2)
  }

  const handleFinalSubmit = async (event: FormEvent) => {
    event.preventDefault()

    setIsSubmitting(true)
    await new Promise((resolve) => setTimeout(resolve, 500))

    const isSuccess =
      isFirstStepValid &&
      selectedCategories.length > 0 &&
      selectedTags.length > 0 &&
      !form.email.toLowerCase().includes('error')

    if (isSuccess) {
      const profile = {
        fullName: form.fullName.trim(),
        email: form.email.trim().toLowerCase(),
        phone: form.phone.trim(),
        city: 'Санкт-Петербург',
        about: 'Расскажите о своих любимых городских сценариях в профиле.',
        categories: selectedCategories,
        tags: selectedTags,
      }
      saveStoredProfile(profile)
      signIn(profile)
    }

    setResult(isSuccess ? 'success' : 'error')
    setIsSubmitting(false)
  }

  const handleCloseModal = () => {
    if (result === 'success') {
      navigate('/profile')
      return
    }

    setStep(1)
    setSelectedCategories([])
    setSelectedTags([])
    setResult(null)
  }

  return (
    <>
      <Helmet>
        <title>Регистрация — GOdzi</title>
      </Helmet>

      <Layout>
        <section className={`container ${styles.register}`}>
          <div className={styles.register__panel}>
            {step === 1 ? (
              <form className={styles.formCard} onSubmit={handleFirstStepSubmit}>
                <h1>Нет аккаунта? Скорее регистрируйся!</h1>

                <div className={styles.formGrid}>
                  <label className={styles.field}>
                    <span>Имя и фамилия</span>
                    <input
                      type="text"
                      placeholder="Имя"
                      value={form.fullName}
                      onChange={(event) => setForm({ ...form, fullName: event.target.value })}
                    />
                  </label>

                  <label className={styles.field}>
                    <span>Электронная почта</span>
                    <input
                      type="email"
                      placeholder="name@mail.ru"
                      value={form.email}
                      onChange={(event) => setForm({ ...form, email: event.target.value })}
                    />
                  </label>

                  <label className={styles.field}>
                    <span>Номер телефона</span>
                    <input
                      type="tel"
                      placeholder="+7 (999) 000-00-00"
                      value={form.phone}
                      onChange={(event) => setForm({ ...form, phone: event.target.value })}
                    />
                  </label>

                  <label className={styles.field}>
                    <span>Придумайте пароль</span>
                    <input
                      type="password"
                      value={form.password}
                      onChange={(event) => setForm({ ...form, password: event.target.value })}
                    />
                  </label>

                  <label className={styles.field}>
                    <span>Повторите пароль</span>
                    <input
                      type="password"
                      value={form.repeatPassword}
                      onChange={(event) => setForm({ ...form, repeatPassword: event.target.value })}
                    />
                  </label>

                  <label className={styles.checkbox}>
                    <input
                      type="checkbox"
                      checked={form.agreed}
                      onChange={(event) => setForm({ ...form, agreed: event.target.checked })}
                    />
                    <span>
                      Я даю согласие на <em>обработку персональных данных</em> и соглашаюсь с <em>правилами сервиса</em>
                    </span>
                  </label>
                </div>

                <button type="submit" className={styles.primaryButton} disabled={!isFirstStepValid}>
                  Продолжить
                </button>

                <div className={styles.formLinks}>
                  <Link to="/login">Вход</Link>
                  <span>|</span>
                  <span className={styles.formLinks__active}>Регистрация</span>
                </div>
              </form>
            ) : (
              <form className={styles.formCard} onSubmit={handleFinalSubmit}>
                <h1>Укажите свои предпочтения</h1>

                <div className={styles.preferenceGroup}>
                  <span>Выберите категории</span>
                  <div className={styles.tagsGrid}>
                    {categoryOptions.map((item) => (
                      <button
                        key={item}
                        type="button"
                        className={`${styles.tagButton} ${selectedCategories.includes(item) ? styles.tagButton_active : ''}`}
                        onClick={() => toggleSelection(item, selectedCategories, setSelectedCategories)}
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>

                <div className={styles.preferenceGroup}>
                  <span>Выберите теги</span>
                  <div className={styles.tagsGrid}>
                    {tagOptions.map((item) => (
                      <button
                        key={item}
                        type="button"
                        className={`${styles.tagButton} ${selectedTags.includes(item) ? styles.tagButton_active : ''}`}
                        onClick={() => toggleSelection(item, selectedTags, setSelectedTags)}
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>

                <button type="submit" className={styles.primaryButton} disabled={isSubmitting}>
                  {isSubmitting ? 'Сохраняем...' : 'Сохранить'}
                </button>
              </form>
            )}

            {result ? (
              <div className={styles.modalOverlay} role="dialog" aria-modal="true">
                <div className={styles.modal}>
                  <h2>{result === 'success' ? 'Регистрация прошла успешно' : 'Ошибка регистрации'}</h2>
                  <div className={`${styles.modal__icon} ${result === 'error' ? styles.modal__icon_error : ''}`} />
                  <button type="button" className={styles.primaryButton} onClick={handleCloseModal}>
                    Закрыть
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        </section>
      </Layout>
    </>
  )
}
