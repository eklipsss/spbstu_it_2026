import { rtkApi } from '@/shared/api'
import { Entity } from '@/shared/types'

export const recommendationsApi = rtkApi.injectEndpoints({
  endpoints: (build) => ({
    getRecommendations: build.query<Entity[], { skip: number; limit: number }>({
      query: ({ skip, limit }) => ({
        url: '/entities/get_entities',
        params: { skip, limit },
      }),
    }),
  }),
})

export const { useGetRecommendationsQuery } = recommendationsApi
