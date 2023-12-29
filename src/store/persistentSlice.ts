import { createSlice } from '@reduxjs/toolkit'
import { RootState } from '@/store'
import { Transaction } from '@/types'

interface PersistentState {
  transactionHistory: {
    [key: string]: Transaction[]
  }
}

const initialState: PersistentState = {
  transactionHistory: {}
}

export const PersistentSlice = createSlice({
  name: 'Persistent',
  initialState,
  reducers: {
    addTransactionHistory(
      state,
      {
        payload
      }: {
        payload: {
          chainId: string
          address: string
          transaction: Transaction
        }
      }
    ) {
      state.transactionHistory = state.transactionHistory ?? {}
      const key = `${payload.chainId}-${payload.address}`
      state.transactionHistory[key] = state.transactionHistory[key] || []
      state.transactionHistory[key].unshift(payload.transaction)
    },
    clearTransactionHistory(state, { payload }: { payload: { chainId: string; address: string } }) {
      state.transactionHistory = state.transactionHistory ?? {}
      const key = `${payload.chainId}-${payload.address}`
      state.transactionHistory[key] = []
    }
  }
})

export const { addTransactionHistory, clearTransactionHistory } = PersistentSlice.actions
export const selectTransactionHistory = (state: RootState) => state.persistent.transactionHistory
export default PersistentSlice.reducer
