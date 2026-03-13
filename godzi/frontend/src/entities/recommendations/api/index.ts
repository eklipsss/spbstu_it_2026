import { rtkApi } from '@/shared/api'
import { Entity } from '@/shared/types'
import { getRecommendations } from '@/shared/mocks/data'

const wait = (ms = 180) => new Promise((resolve) => setTimeout(resolve, ms))

export const recommendationsApi = rtkApi.injectEndpoints({
  endpoints: (build) => ({
    getRecommendations: build.query<Entity[], { skip: number; limit: number }>({
      async queryFn({ skip, limit }) {
        await wait()
        return { data: getRecommendations(skip, limit) }
      },
    }),
  }),
})

export const { useGetRecommendationsQuery } = recommendationsApi
