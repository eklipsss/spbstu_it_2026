import { rtkApi } from '@/shared/api'
import { Category } from '@/shared/types'

const ROOT_CATEGORY_IDS: Record<string, number> = {
  Места: 1,
  Мероприятия: 2,
}

export const categoriesApi = rtkApi.injectEndpoints({
  endpoints: (build) => ({
    getCategories: build.query<Category[], { skip: number; limit: number }>({
      query: ({ skip, limit }) => ({
        url: '/categories',
        params: { skip, limit },
      }),
    }),
    getChildGategories: build.query<{ categories: Category[]; total: number }, string | undefined>({
      query: (name) => ({
        url: '/categories/child_categories',
        params: {
          category_id: name ? ROOT_CATEGORY_IDS[name] : undefined,
          skip: 0,
          limit: 50,
        },
      }),
      transformResponse: (categories: Category[]) => ({
        categories,
        total: categories.length,
      }),
    }),
    getAllChildrenCategories: build.query<
      { categories: Category[]; total: number },
      { categoryId: number; skip: number; limit: number } | undefined
    >({
      query: (arg) => ({
        url: '/categories/all_children_categories',
        params: {
          category_id: arg?.categoryId,
        },
      }),
      transformResponse: (categories: Category[], _meta, arg) => {
        const skip = arg?.skip ?? 0
        const limit = arg?.limit ?? categories.length
        return {
          categories: categories.slice(skip, skip + limit),
          total: categories.length,
        }
      },
    }),
    getChildCategoriesById: build.query<{ categories: Category[]; total: number }, number | undefined>({
      query: (categoryId) => ({
        url: '/categories/child_categories',
        params: {
          category_id: categoryId,
          skip: 0,
          limit: 50,
        },
      }),
      transformResponse: (categories: Category[]) => ({
        categories,
        total: categories.length,
      }),
    }),
  }),
})

export const { useGetCategoriesQuery, useGetChildGategoriesQuery, useGetAllChildrenCategoriesQuery, useGetChildCategoriesByIdQuery } = categoriesApi
