import { configureStore } from '@reduxjs/toolkit'
import { load, save } from 'redux-localstorage-simple'
import { AppSlice } from './appSlice'
import { PersistentSlice } from './persistentSlice'

const reducer = {
  app: AppSlice.reducer,
  persistent: PersistentSlice.reducer
} as const

const persistedStates = ['persistent'] as Array<keyof typeof reducer>

export const store = configureStore({
  reducer: {
    app: AppSlice.reducer,
    persistent: PersistentSlice.reducer
  },
  middleware: (getDefaultMiddleware) => {
    return [
      ...getDefaultMiddleware(),
      save({
        debounce: 250,
        states: persistedStates
      })
    ]
  },
  preloadedState: load({
    disableWarnings: true,
    states: persistedStates
  })
})

export type RootState = ReturnType<typeof store.getState>

export type StoreDispatch = typeof store.dispatch
