import { rtkApi } from '@/shared/api'
import { Entity } from '@/shared/types'

export const favoritesApi = rtkApi.injectEndpoints({
  endpoints: (build) => ({
    getFavorites: build.query<Entity[], void>({
      query: () => '/favorites',
      providesTags: ['Favorites'],
    }),
    getFavoriteIds: build.query<number[], void>({
      query: () => '/favorites/ids',
      providesTags: ['Favorites'],
    }),
    addFavorite: build.mutation<{ entity_id: number; is_favorite: boolean }, number>({
      query: (entityId) => ({
        url: `/favorites/${entityId}`,
        method: 'POST',
      }),
      invalidatesTags: ['Favorites'],
    }),
    removeFavorite: build.mutation<{ entity_id: number; is_favorite: boolean }, number>({
      query: (entityId) => ({
        url: `/favorites/${entityId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Favorites'],
    }),
  }),
})

export const {
  useAddFavoriteMutation,
  useGetFavoriteIdsQuery,
  useGetFavoritesQuery,
  useRemoveFavoriteMutation,
} = favoritesApi
