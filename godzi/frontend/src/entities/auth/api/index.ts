import { rtkApi } from '@/shared/api'
import type { AuthResponse, AuthUser } from '@/shared/types'

interface LoginPayload {
  email: string
  password: string
}

interface RegisterPayload {
  email: string
  password: string
  full_name: string
  phone_number?: string
  city?: string
  about?: string
  categories?: string[]
  tags?: string[]
}

export const authApi = rtkApi.injectEndpoints({
  endpoints: (build) => ({
    login: build.mutation<AuthResponse, LoginPayload>({
      query: (body) => ({
        url: '/auth/login',
        method: 'POST',
        body,
      }),
    }),
    register: build.mutation<AuthResponse, RegisterPayload>({
      query: (body) => ({
        url: '/auth/register',
        method: 'POST',
        body,
      }),
    }),
    getMe: build.query<AuthUser, void>({
      query: () => ({
        url: '/users/me',
      }),
      transformResponse: (response: AuthUser) => response,
    }),
    updateMe: build.mutation<AuthUser, Partial<AuthUser> & { categories?: string[]; tags?: string[] }>({
      query: (body) => ({
        url: '/users/me',
        method: 'PUT',
        body,
      }),
      transformResponse: (response: AuthUser) => response,
    }),
  }),
})

export const { useLoginMutation, useRegisterMutation, useGetMeQuery, useUpdateMeMutation } = authApi
