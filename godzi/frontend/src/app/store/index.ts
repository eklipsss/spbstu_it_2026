import { combineReducers, configureStore, Reducer } from '@reduxjs/toolkit';
import { rtkApi } from '@/shared/api';

export const combinedReducer = combineReducers({
  [rtkApi.reducerPath]: rtkApi.reducer,
})

const rootReducer: Reducer = (state, action) => {
  return combinedReducer(state, action)
}

export const store = configureStore({
  reducer: rootReducer,
  devTools: true,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(rtkApi.middleware),
})

export type AppDispatch = typeof store.dispatch;
export type AppState = ReturnType<typeof store.getState>
