import { demoProfile } from '@/shared/mocks/profile'

export type StoredProfile = typeof demoProfile

const AUTH_KEY = 'godzi-auth'
const PROFILE_KEY = 'godzi-profile'
const AUTH_EVENT = 'godzi-auth-changed'
const PROFILE_EVENT = 'godzi-profile-changed'

const canUseStorage = () => typeof window !== 'undefined' && typeof window.localStorage !== 'undefined'

const dispatchAppEvent = (eventName: string) => {
  if (typeof window === 'undefined') return
  window.dispatchEvent(new Event(eventName))
}

export const getStoredProfile = (): StoredProfile => {
  if (!canUseStorage()) return demoProfile

  const raw = window.localStorage.getItem(PROFILE_KEY)
  if (!raw) return demoProfile

  try {
    return { ...demoProfile, ...JSON.parse(raw) }
  } catch {
    return demoProfile
  }
}

export const saveStoredProfile = (profile: StoredProfile) => {
  if (!canUseStorage()) return
  window.localStorage.setItem(PROFILE_KEY, JSON.stringify(profile))
  dispatchAppEvent(PROFILE_EVENT)
}

export const isAuthenticated = () => {
  if (!canUseStorage()) return false
  return window.localStorage.getItem(AUTH_KEY) === 'true'
}

export const signIn = (profile?: StoredProfile) => {
  if (!canUseStorage()) return
  window.localStorage.setItem(AUTH_KEY, 'true')
  if (profile) {
    saveStoredProfile(profile)
  }
  dispatchAppEvent(AUTH_EVENT)
}

export const signOut = () => {
  if (!canUseStorage()) return
  window.localStorage.removeItem(AUTH_KEY)
  dispatchAppEvent(AUTH_EVENT)
}

export const authEventName = AUTH_EVENT
export const profileEventName = PROFILE_EVENT
