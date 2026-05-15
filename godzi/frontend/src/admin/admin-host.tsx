import { useLoginMutation, useGetMeQuery } from '@/entities/auth/api'
import { AdminPage } from '@/pages/admin-page'
import { rtkApi } from '@/shared/api'
import {
  buildStoredProfileFromUser,
  getStoredProfile,
  isAuthenticated,
  signIn,
  signOut,
} from '@/shared/utils/session'
import { useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { useDispatch } from 'react-redux'
import styles from './admin-host.module.scss'

const getErrorText = (error: unknown) => {
  if (!error || typeof error !== 'object') return 'Не удалось войти'
  if ('data' in error) {
    const data = error.data as { detail?: unknown } | string | undefined
    if (typeof data === 'string') return data
    if (typeof data?.detail === 'string') return data.detail
  }
  return 'Не удалось войти'
}

const AdminLogin = ({ onSuccess }: { onSuccess: () => void }) => {
  const dispatch = useDispatch()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorText, setErrorText] = useState('')
  const [login, { isLoading }] = useLoginMutation()
  const isFormValid = useMemo(() => Boolean(email.trim() && password), [email, password])

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!isFormValid) return
    setErrorText('')

    try {
      const response = await login({
        email: email.trim().toLowerCase(),
        password,
      }).unwrap()

      if (!response.user.is_superuser) {
        setErrorText('У этого аккаунта нет прав администратора')
        return
      }

      const existingProfile = getStoredProfile()
      const profile =
        existingProfile.email.toLowerCase() === response.user.email.toLowerCase()
          ? buildStoredProfileFromUser(response.user, existingProfile)
          : buildStoredProfileFromUser(response.user)

      signIn(response.access_token, profile)
      dispatch(rtkApi.util.resetApiState())
      onSuccess()
    } catch (error) {
      setErrorText(getErrorText(error))
    }
  }

  return (
    <main className={styles.login}>
      <form className={styles.card} onSubmit={handleSubmit}>
        <span>GOdzi admin</span>
        <h1>Вход в админ-панель</h1>
        <label>
          Email
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="admin@godzi.ru"
            required
          />
        </label>
        <label>
          Пароль
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </label>
        {errorText ? <p className={styles.error}>{errorText}</p> : null}
        <button type="submit" disabled={!isFormValid || isLoading}>
          {isLoading ? 'Входим...' : 'Войти'}
        </button>
      </form>
    </main>
  )
}

export const AdminHostApp = () => {
  const dispatch = useDispatch()
  const [loggedIn, setLoggedIn] = useState(() => isAuthenticated())
  const { data: user, isFetching, error } = useGetMeQuery(undefined, { skip: !loggedIn })

  const handleLogout = () => {
    signOut()
    dispatch(rtkApi.util.resetApiState())
    setLoggedIn(false)
  }

  if (!loggedIn || error) {
    return <AdminLogin onSuccess={() => setLoggedIn(true)} />
  }

  if (isFetching) {
    return (
      <main className={styles.login}>
        <div className={styles.card}>
          <span>GOdzi admin</span>
          <h1>Проверяем доступ</h1>
        </div>
      </main>
    )
  }

  if (user && !user.is_superuser) {
    return (
      <main className={styles.login}>
        <div className={styles.card}>
          <span>GOdzi admin</span>
          <h1>Нет доступа</h1>
          <p className={styles.error}>Для этого хоста нужны права администратора.</p>
          <button type="button" onClick={handleLogout}>
            Выйти
          </button>
        </div>
      </main>
    )
  }

  return <AdminPage onLogout={handleLogout} />
}
