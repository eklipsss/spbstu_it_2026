import { useRegisterMutation } from '@/entities/auth/api'
import { useGetCategoriesQuery } from '@/entities/categories/api'
import { useGetTagsQuery } from '@/entities/tags/api'
import { Layout } from '@/shared/components'
import { rtkApi } from '@/shared/api'
import { buildStoredProfileFromUser, saveStoredProfile, signIn } from '@/shared/utils/session'
import { Helmet } from 'react-helmet-async'
import { FormEvent, useMemo, useState } from 'react'
import { useDispatch } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import styles from './register-page.module.scss'

type RegistrationResult = 'success' | 'error' | null
type FieldName = 'fullName' | 'email' | 'phone' | 'city' | 'password' | 'repeatPassword'
const duplicateEmailMessage = 'Пользователь с таким email уже существует'

const initialForm = {
  fullName: '',
  email: '',
  phone: '',
  city: '',
  password: '',
  repeatPassword: '',
  agreed: false,
}

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

const formatPhoneNumber = (value: string) => {
  const digits = value.replace(/\D/g, '').slice(0, 11)
  if (!digits) return ''

  let normalized = digits

  if (normalized.startsWith('8')) {
    normalized = `7${normalized.slice(1)}`
  }

  if (!normalized.startsWith('7')) {
    normalized = `7${normalized.slice(0, 10)}`
  }

  normalized = normalized.slice(0, 11)

  const area = normalized.slice(1, 4)
  const first = normalized.slice(4, 7)
  const second = normalized.slice(7, 9)
  const third = normalized.slice(9, 11)

  let formatted = '+7'
  if (area) formatted += ` (${area}`
  if (area.length === 3) formatted += ')'
  if (first) formatted += ` ${first}`
  if (second) formatted += `-${second}`
  if (third) formatted += `-${third}`

  return formatted
}

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const phonePattern = /^(?:\+7\d{10}|8\d{10})$/

export const RegisterPage = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [step, setStep] = useState<1 | 2>(1)
  const [result, setResult] = useState<RegistrationResult>(null)
  const [resultMessage, setResultMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [form, setForm] = useState(initialForm)
  const [touchedFields, setTouchedFields] = useState<Record<FieldName, boolean>>({
    fullName: false,
    email: false,
    phone: false,
    city: false,
    password: false,
    repeatPassword: false,
  })
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [register] = useRegisterMutation()
  const { data: categoryOptions = [] } = useGetCategoriesQuery({ skip: 0, limit: 200 })
  const { data: tagOptions = [] } = useGetTagsQuery({ skip: 0, limit: 200 })

  const availableCategories = useMemo(
    () => categoryOptions.filter((item) => item.parent_id !== null).slice(0, 10),
    [categoryOptions],
  )
  const availableTags = useMemo(() => tagOptions.slice(0, 10), [tagOptions])
  const formErrors = useMemo(() => {
    const fullName = form.fullName.trim()
    const email = form.email.trim().toLowerCase()
    const phone = normalizePhoneNumber(form.phone)
    const city = form.city.trim()
    const password = form.password
    const repeatPassword = form.repeatPassword

    return {
      fullName:
        fullName ? '' : 'Поле не может быть пустым',
      email:
        emailPattern.test(email) ? '' : 'Неверный формат почты',
      phone:
        phonePattern.test(phone) ? '' : 'Неверный формат телефона',
      city:
        city ? '' : 'Поле не может быть пустым',
      password:
        password.length >= 4 ? '' : 'Пароль должен содержать не менее 4х символов',
      repeatPassword:
        repeatPassword === password ? '' : 'Пароль не совпадает',
    }
  }, [form])

  const isFirstStepValid = useMemo(() => {
    return Object.values(formErrors).every((value) => !value) && form.agreed
  }, [form, formErrors])

  const toggleSelection = (value: string, current: string[], setter: (items: string[]) => void) => {
    if (current.includes(value)) {
      setter(current.filter((item) => item !== value))
      return
    }

    setter([...current, value])
  }

  const handleFieldChange = (field: FieldName, value: string) => {
    setTouchedFields((current) => ({ ...current, [field]: true }))
    setForm((current) => ({
      ...current,
      [field]: field === 'phone' ? formatPhoneNumber(value) : value,
    }))
  }

  const handleFirstStepSubmit = (event: FormEvent) => {
    event.preventDefault()
    if (!isFirstStepValid) return
    setStep(2)
  }

  const handleFinalSubmit = async (event: FormEvent) => {
    event.preventDefault()

    setIsSubmitting(true)
    if (!isFirstStepValid || selectedCategories.length === 0 || selectedTags.length === 0) {
      setResultMessage('')
      setResult('error')
      setIsSubmitting(false)
      return
    }

    try {
      const response = await register({
        email: form.email.trim().toLowerCase(),
        password: form.password,
        full_name: form.fullName.trim(),
        phone_number: normalizePhoneNumber(form.phone),
        city: form.city.trim(),
        about: '',
        categories: selectedCategories,
        tags: selectedTags,
      }).unwrap()

      const profile = buildStoredProfileFromUser(response.user, {
        city: response.user.city ?? form.city.trim(),
        about: response.user.about ?? '',
        categories: response.user.categories,
        tags: response.user.tags,
      })

      saveStoredProfile(profile)
      signIn(response.access_token, profile)
      dispatch(rtkApi.util.resetApiState())
      setResultMessage('')
      setResult('success')
    } catch (error) {
      const detail =
        typeof error === 'object' &&
        error !== null &&
        'data' in error &&
        typeof error.data === 'object' &&
        error.data !== null &&
        'detail' in error.data &&
        typeof error.data.detail === 'string'
          ? error.data.detail
          : ''

      setResultMessage(
        detail === 'Пользователь с такой почтой уже существует'
          ? duplicateEmailMessage
          : '',
      )
      setResult('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCloseModal = () => {
    if (result === 'success') {
      navigate('/profile')
      return
    }

    setStep(1)
    setTouchedFields({
      fullName: false,
      email: false,
      phone: false,
      city: false,
      password: false,
      repeatPassword: false,
    })
    setSelectedCategories([])
    setSelectedTags([])
    setResultMessage('')
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
                      aria-invalid={Boolean(touchedFields.fullName && formErrors.fullName)}
                      onChange={(event) => handleFieldChange('fullName', event.target.value)}
                    />
                    {touchedFields.fullName && formErrors.fullName ? <small className={styles.fieldHint}>{formErrors.fullName}</small> : null}
                  </label>

                  <label className={styles.field}>
                    <span>Электронная почта</span>
                    <input
                      type="email"
                      placeholder="name@mail.ru"
                      value={form.email}
                      aria-invalid={Boolean(touchedFields.email && formErrors.email)}
                      onChange={(event) => handleFieldChange('email', event.target.value)}
                    />
                    {touchedFields.email && formErrors.email ? <small className={styles.fieldHint}>{formErrors.email}</small> : null}
                  </label>

                  <label className={styles.field}>
                    <span>Номер телефона</span>
                    <input
                      type="tel"
                      placeholder="+7 (999) 999-99-99"
                      value={form.phone}
                      aria-invalid={Boolean(touchedFields.phone && formErrors.phone)}
                      onChange={(event) => handleFieldChange('phone', event.target.value)}
                    />
                    {touchedFields.phone && formErrors.phone ? <small className={styles.fieldHint}>{formErrors.phone}</small> : null}
                  </label>

                  <label className={styles.field}>
                    <span>Город</span>
                    <input
                      type="text"
                      placeholder="Санкт-Петербург"
                      value={form.city}
                      aria-invalid={Boolean(touchedFields.city && formErrors.city)}
                      onChange={(event) => handleFieldChange('city', event.target.value)}
                    />
                    {touchedFields.city && formErrors.city ? <small className={styles.fieldHint}>{formErrors.city}</small> : null}
                  </label>

                  <label className={styles.field}>
                    <span>Придумайте пароль</span>
                    <input
                      type="password"
                      value={form.password}
                      aria-invalid={Boolean(touchedFields.password && formErrors.password)}
                      onChange={(event) => handleFieldChange('password', event.target.value)}
                    />
                    {touchedFields.password && formErrors.password ? <small className={styles.fieldHint}>{formErrors.password}</small> : null}
                  </label>

                  <label className={styles.field}>
                    <span>Повторите пароль</span>
                    <input
                      type="password"
                      value={form.repeatPassword}
                      aria-invalid={Boolean(touchedFields.repeatPassword && formErrors.repeatPassword)}
                      onChange={(event) => handleFieldChange('repeatPassword', event.target.value)}
                    />
                    {touchedFields.repeatPassword && formErrors.repeatPassword ? <small className={styles.fieldHint}>{formErrors.repeatPassword}</small> : null}
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
                    {availableCategories.map((item) => (
                      <button
                        key={item.category_id}
                        type="button"
                        className={`${styles.tagButton} ${selectedCategories.includes(item.name) ? styles.tagButton_active : ''}`}
                        onClick={() => toggleSelection(item.name, selectedCategories, setSelectedCategories)}
                      >
                        {item.name}
                      </button>
                    ))}
                  </div>
                </div>

                <div className={styles.preferenceGroup}>
                  <span>Выберите теги</span>
                  <div className={styles.tagsGrid}>
                    {availableTags.map((item) => (
                      <button
                        key={item.tag_id}
                        type="button"
                        className={`${styles.tagButton} ${selectedTags.includes(item.name) ? styles.tagButton_active : ''}`}
                        onClick={() => toggleSelection(item.name, selectedTags, setSelectedTags)}
                      >
                        {item.name}
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
                  {result === 'error' && resultMessage ? (
                    <p className={styles.modal__message}>{resultMessage}</p>
                  ) : null}
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
