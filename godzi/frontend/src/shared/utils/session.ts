import { demoProfile } from '@/shared/mocks/profile'
import type { AuthUser } from '@/shared/types'

export type StoredProfile = typeof demoProfile

const AUTH_KEY = 'godzi-auth'
const TOKEN_KEY = 'godzi-token'
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

export const buildStoredProfileFromUser = (
  user: AuthUser,
  overrides: Partial<StoredProfile> = {},
): StoredProfile => ({
  ...demoProfile,
  fullName: user.full_name?.trim() || demoProfile.fullName,
  email: user.email,
  phone: user.phone_number?.trim() || demoProfile.phone,
  city: user.city?.trim() || demoProfile.city,
  about: user.about?.trim() || demoProfile.about,
  categories: user.categories?.length ? user.categories : demoProfile.categories,
  tags: user.tags?.length ? user.tags : demoProfile.tags,
  ...overrides,
})

export const isAuthenticated = () => {
  if (!canUseStorage()) return false
  return Boolean(window.localStorage.getItem(TOKEN_KEY))
}

export const getAccessToken = () => {
  if (!canUseStorage()) return null
  return window.localStorage.getItem(TOKEN_KEY)
}

export const signIn = (token: string, profile?: StoredProfile) => {
  if (!canUseStorage()) return
  window.localStorage.setItem(AUTH_KEY, 'true')
  window.localStorage.setItem(TOKEN_KEY, token)
  if (profile) {
    saveStoredProfile(profile)
  }
  dispatchAppEvent(AUTH_EVENT)
}

export const signOut = () => {
  if (!canUseStorage()) return
  window.localStorage.removeItem(AUTH_KEY)
  window.localStorage.removeItem(TOKEN_KEY)
  dispatchAppEvent(AUTH_EVENT)
}

export const authEventName = AUTH_EVENT
export const profileEventName = PROFILE_EVENT
