import { rtkApi } from '@/shared/api'
import { resolveEntityPhoto } from '@/shared/utils'

export const categoriesApi = rtkApi.injectEndpoints({
  endpoints: (build) => ({
    getPlaceImages: build.query<{ links: string[] }, string | undefined>({
      query: (id) => `/entities/${id}`,
      transformResponse: (entity: { photo?: string | null }) => ({
        links: entity.photo ? [resolveEntityPhoto(entity.photo)] : [],
      }),
    }),
  }),
})

export const { useGetPlaceImagesQuery } = categoriesApi
