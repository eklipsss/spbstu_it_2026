import { Entity } from "@/shared/types";
import { createSlice } from "@reduxjs/toolkit";

interface State {
  entities: Entity[]
}

const initialState: State = {
  entities: []
}

const entitiesSlice = createSlice({
  name: 'entities',
  initialState,
  reducers: {
    setEntities: (state, action) => {
      return {
        ...state,
        entities: action.payload ?? []
      }
    },
    resetEntities: (state) => {
      return {
        ...state,
        entities: []
      }
    }
  },
  selectors: {
    searchedEntities: (state) => {
      return state
    }
  }
})

export const { reducer: entitiesReducer } = entitiesSlice
export const { actions: entitiesActions } = entitiesSlice
export const { selectors: entitiesSelectors } = entitiesSlice
