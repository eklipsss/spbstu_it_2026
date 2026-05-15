import { rtkApi } from '@/shared/api'
import { Entity } from '@/shared/types'

export const entityApi = rtkApi.injectEndpoints({
  endpoints: (build) => ({
    getEntityData: build.query<Entity | undefined, { id: string | undefined }>({
      query: ({ id }) => `/entities/${id}`,
    }),
    getEntities: build.query<{ entities: Entity[]; total: number }, number | undefined>({
      async queryFn(categoryId, _api, _extraOptions, fetchWithBQ) {
        if (!categoryId) {
          return { data: { entities: [], total: 0 } }
        }

        let categoryIds = [categoryId]

        const childCategoriesResponse = await fetchWithBQ(
          `/categories/all_children_categories?category_id=${categoryId}`,
        )

        if (!childCategoriesResponse.error) {
          const childCategories = (childCategoriesResponse.data as { category_id: number }[]) ?? []
          categoryIds = [categoryId, ...childCategories.map(({ category_id }) => category_id)]
        }

        const responses = await Promise.all(
          categoryIds.map((id) =>
            fetchWithBQ(`/entities/get_entities?categories_ids=${id}&skip=0&limit=30`),
          ),
        )

        const entitiesMap = new Map<number, Entity>()

        responses.forEach((response) => {
          if (response.error) return

          const entities = (response.data as Entity[]) ?? []
          entities.forEach((entity) => {
            entitiesMap.set(entity.entity_id, entity)
          })
        })

        const entities = Array.from(entitiesMap.values())
        return { data: { entities, total: entities.length } }
      },
    }),
  }),
})

export const { useGetEntityDataQuery, useGetEntitiesQuery } = entityApi
