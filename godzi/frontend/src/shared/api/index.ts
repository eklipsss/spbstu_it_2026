import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { getAccessToken } from '@/shared/utils/session'

export const rtkApi = createApi({
  reducerPath: 'api',
  tagTypes: ['Favorites', 'AdminCategories', 'AdminEntities', 'AdminUsers', 'Recommendations'],
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_API_URL ?? 'http://localhost:8000'}`,
    prepareHeaders: (headers) => {
      const accessToken = getAccessToken()
      if (accessToken) {
        headers.set('Authorization', `Bearer ${accessToken}`)
      }
      return headers
    },
  }),
  endpoints: () => ({}),
})
