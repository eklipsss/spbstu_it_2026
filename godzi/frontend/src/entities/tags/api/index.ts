import { rtkApi } from '@/shared/api'

export interface TagOption {
  tag_id: number
  name: string
}

export const tagsApi = rtkApi.injectEndpoints({
  endpoints: (build) => ({
    getTags: build.query<TagOption[], { skip: number; limit: number }>({
      query: ({ skip, limit }) => ({
        url: '/tags',
        params: { skip, limit },
      }),
    }),
  }),
})

export const { useGetTagsQuery } = tagsApi
