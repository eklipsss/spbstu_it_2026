import { useLoginMutation } from '@/entities/auth/api'
import { Layout } from '@/shared/components'
import { rtkApi } from '@/shared/api'
import { buildStoredProfileFromUser, getStoredProfile, signIn } from '@/shared/utils/session'
import { FormEvent, useMemo, useState } from 'react'
import { useDispatch } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import styles from './login-page.module.scss'

type LoginResult = 'success' | 'error' | null

export const LoginPage = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [result, setResult] = useState<LoginResult>(null)
  const [login, { isLoading }] = useLoginMutation()

  const isFormValid = useMemo(() => Boolean(email.trim() && password), [email, password])

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    if (!isFormValid) return

    try {
      const response = await login({
        email: email.trim().toLowerCase(),
        password,
      }).unwrap()
      const existingProfile = getStoredProfile()
      const profile =
        existingProfile.email.toLowerCase() === response.user.email.toLowerCase()
          ? buildStoredProfileFromUser(response.user, existingProfile)
          : buildStoredProfileFromUser(response.user)

      signIn(response.access_token, profile)
      dispatch(rtkApi.util.resetApiState())
      setResult('success')
    } catch {
      setResult('error')
    }
  }

  const handleCloseModal = () => {
    if (result === 'success') {
      navigate('/profile')
      return
    }

    setPassword('')
    setResult(null)
  }

  return (
    <>
      <Layout>
        <section className={`container ${styles.login}`}>
          <div className={styles.login__panel}>
            <form className={styles.formCard} onSubmit={handleSubmit}>
              <h1>
                С возвращением!
                <br />
                Войдите в аккаунт
              </h1>

              <div className={styles.formGrid}>
                <label className={styles.field}>
                  <span>Электронная почта</span>
                  <input
                    type="email"
                    placeholder="name@mail.ru"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                  />
                </label>

                <label className={styles.field}>
                  <span>Пароль</span>
                  <input
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                  />
                </label>
              </div>

              <button type="submit" className={styles.primaryButton} disabled={!isFormValid || isLoading}>
                {isLoading ? 'Входим...' : 'Войти'}
              </button>

              <div className={styles.formLinks}>
                <span className={styles.formLinks__active}>Вход</span>
                <span>|</span>
                <Link to="/register">Регистрация</Link>
              </div>
            </form>

            {result ? (
              <div className={styles.modalOverlay} role="dialog" aria-modal="true">
                <div className={styles.modal}>
                  <h2>{result === 'success' ? 'Вход выполнен успешно' : 'Ошибка входа'}</h2>
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
