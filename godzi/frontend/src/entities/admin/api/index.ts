import { rtkApi } from '@/shared/api'
import type { AuthUser, Category, Entity } from '@/shared/types'

export interface AdminEntityPayload {
  name: string
  contributors: string
  address: string
  metro: string
  description: string
  links: string
  contacts: string
  photo: string
  cost?: string
  average_cost?: string
  age_gap?: string
  date?: string
  is_featured?: boolean
  category_ids: number[]
  tag_ids: number[]
}

export interface AdminUserPayload {
  email: string
  password: string
  full_name?: string
  phone_number?: string
  city?: string
  about?: string
  is_active?: boolean
  is_superuser?: boolean
  categories?: string[]
  tags?: string[]
}

export const adminApi = rtkApi.injectEndpoints({
  endpoints: (build) => ({
    getAdminCategories: build.query<Category[], void>({
      query: () => ({
        url: '/admin/categories',
        params: { skip: 0, limit: 300 },
      }),
      providesTags: ['AdminCategories'],
    }),
    createAdminCategory: build.mutation<Category, { name: string; parent_id: number | null }>({
      query: (body) => ({
        url: '/admin/categories',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['AdminCategories'],
    }),
    deleteAdminCategory: build.mutation<void, number>({
      query: (categoryId) => ({
        url: `/admin/categories/${categoryId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['AdminCategories', 'AdminEntities'],
    }),
    getAdminEntities: build.query<Entity[], void>({
      query: () => ({
        url: '/admin/entities',
        params: { skip: 0, limit: 300 },
      }),
      providesTags: ['AdminEntities'],
    }),
    createAdminEntity: build.mutation<Entity, AdminEntityPayload>({
      query: (body) => ({
        url: '/admin/entities',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['AdminEntities', 'Recommendations'],
    }),
    updateAdminEntity: build.mutation<Entity, { entityId: number; body: Partial<AdminEntityPayload> }>({
      query: ({ entityId, body }) => ({
        url: `/admin/entities/${entityId}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['AdminEntities', 'Recommendations'],
    }),
    deleteAdminEntity: build.mutation<void, number>({
      query: (entityId) => ({
        url: `/admin/entities/${entityId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['AdminEntities', 'Recommendations'],
    }),
    getAdminCollection: build.query<Entity[], void>({
      query: () => ({
        url: '/admin/collection',
        params: { skip: 0, limit: 100 },
      }),
      providesTags: ['AdminEntities'],
    }),
    getAdminUsers: build.query<AuthUser[], void>({
      query: () => ({
        url: '/admin/users',
        params: { skip: 0, limit: 300 },
      }),
      providesTags: ['AdminUsers'],
    }),
    createAdminUser: build.mutation<AuthUser, AdminUserPayload>({
      query: (body) => ({
        url: '/admin/users',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['AdminUsers'],
    }),
    deleteAdminUser: build.mutation<void, number>({
      query: (userId) => ({
        url: `/admin/users/${userId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['AdminUsers'],
    }),
  }),
})

export const {
  useCreateAdminCategoryMutation,
  useCreateAdminEntityMutation,
  useCreateAdminUserMutation,
  useDeleteAdminCategoryMutation,
  useDeleteAdminEntityMutation,
  useDeleteAdminUserMutation,
  useGetAdminCategoriesQuery,
  useGetAdminCollectionQuery,
  useGetAdminEntitiesQuery,
  useGetAdminUsersQuery,
  useUpdateAdminEntityMutation,
} = adminApi
