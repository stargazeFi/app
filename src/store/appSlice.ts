import { createSlice } from '@reduxjs/toolkit'

interface AppState {}

const initialState: AppState = {}

export const AppSlice = createSlice({
  name: 'App',
  initialState,
  reducers: {}
})

export default AppSlice.reducer
