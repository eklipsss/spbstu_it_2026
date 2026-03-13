import { rtkApi } from '@/shared/api'
import { Entity } from '@/shared/types'
import { getEntityById, getEntitiesByCategoryId, searchEntitiesByPhrase } from '@/shared/mocks/data'

const wait = (ms = 220) => new Promise((resolve) => setTimeout(resolve, ms))

export const entityApi = rtkApi.injectEndpoints({
  endpoints: (build) => ({
    getEntityData: build.query<Entity | undefined, { id: string | undefined }>({
      async queryFn({ id }) {
        await wait()
        return { data: getEntityById(id) }
      },
    }),
    getEntities: build.query<{ entities: Entity[]; total: number }, number | undefined>({
      async queryFn(id) {
        await wait()
        const entities = getEntitiesByCategoryId(id)
        return { data: { entities, total: entities.length } }
      },
    }),
    searchEntities: build.query<{ entities: Entity[]; total: number }, string>({
      async queryFn(name) {
        await wait(160)
        const entities = searchEntitiesByPhrase(name)
        return { data: { entities, total: entities.length } }
      },
    }),
  }),
})

export const { useGetEntityDataQuery, useGetEntitiesQuery, useLazySearchEntitiesQuery } = entityApi
