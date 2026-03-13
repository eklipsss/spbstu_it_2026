import { rtkApi } from '@/shared/api'
import { getImagesByEntityId } from '@/shared/mocks/data'

const wait = (ms = 140) => new Promise((resolve) => setTimeout(resolve, ms))

export const categoriesApi = rtkApi.injectEndpoints({
  endpoints: (build) => ({
    getPlaceImages: build.query<{ links: string[] }, string | undefined>({
      async queryFn(id) {
        await wait()
        return { data: { links: getImagesByEntityId(id) } }
      },
    }),
  }),
})

export const { useGetPlaceImagesQuery } = categoriesApi
