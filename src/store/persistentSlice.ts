import { createSlice } from '@reduxjs/toolkit'
import { RootState } from '@/store'
import { Strategy, Transaction } from '@/types'

interface AddTransactionHistoryPayload {
  payload: {
    address: string
    chainId: string
    transaction: Transaction
  }
}

interface ClearTransactionHistoryPayload {
  payload: {
    address: string
    chainId: string
  }
}

interface StoreFetchedStrategiesPayload {
  payload: {
    chainId: string
    strategies: Strategy[]
  }
}

interface PersistentState {
  strategies: {
    [key: string]: Strategy[]
  }
  transactionHistory: {
    [key: string]: Transaction[]
  }
}

const initialState: PersistentState = {
  strategies: {},
  transactionHistory: {}
}

export const PersistentSlice = createSlice({
  name: 'Persistent',
  initialState,
  reducers: {
    addTransactionHistory(state, { payload }: AddTransactionHistoryPayload) {
      state.transactionHistory = state.transactionHistory ?? {}
      const key = `${payload.chainId}-${payload.address}`
      state.transactionHistory[key] = state.transactionHistory[key] || []
      state.transactionHistory[key].unshift(payload.transaction)
    },
    clearTransactionHistory(state, { payload }: ClearTransactionHistoryPayload) {
      state.transactionHistory = state.transactionHistory ?? {}
      const key = `${payload.chainId}-${payload.address}`
      state.transactionHistory[key] = []
    },
    storeFetchedStrategies(state, { payload }: StoreFetchedStrategiesPayload) {
      state.strategies = state.strategies ?? {}
      const key = payload.chainId
      state.strategies[key] = payload.strategies
    }
  }
})

export const { addTransactionHistory, clearTransactionHistory, storeFetchedStrategies } = PersistentSlice.actions
export const selectStrategies = (state: RootState) => state.persistent.strategies
export const selectTransactionHistory = (state: RootState) => state.persistent.transactionHistory
export default PersistentSlice.reducer
