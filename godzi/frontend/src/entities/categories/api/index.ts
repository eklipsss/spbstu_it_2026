import { rtkApi } from '@/shared/api'
import { Category } from '@/shared/types'
import { getChildCategories } from '@/shared/mocks/data'

const wait = (ms = 200) => new Promise((resolve) => setTimeout(resolve, ms))

export const categoriesApi = rtkApi.injectEndpoints({
  endpoints: (build) => ({
    getChildGategories: build.query<{ categories: Category[]; total: number }, string | undefined>({
      async queryFn(name) {
        await wait()
        const categories = getChildCategories(name)
        return { data: { categories, total: categories.length } }
      },
    }),
    getAllChildrenCategories: build.query<{ categories: Category[]; total: number }, { name: string; skip: number; limit: number } | undefined>({
      async queryFn(arg) {
        await wait()
        const all = getChildCategories(arg?.name)
        const categories = all.slice(arg?.skip ?? 0, (arg?.skip ?? 0) + (arg?.limit ?? all.length))
        return { data: { categories, total: all.length } }
      },
    }),
  }),
})

export const { useGetChildGategoriesQuery, useGetAllChildrenCategoriesQuery } = categoriesApi
