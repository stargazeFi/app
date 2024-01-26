import { useMemo } from 'react'
import { num } from 'starknet'
import { useAccount, useNetwork } from '@starknet-react/core'
import { useDispatch, useAppSelector } from '@/hooks'
import { toast } from '@/misc'
import { Transaction } from '@/types'
import { addPendingTransaction } from '@/store/appSlice'
import { addTransactionHistory, clearTransactionHistory, selectTransactionHistory } from '@/store/persistentSlice'

export const useTransactionManager = (): {
  addTransaction(transaction: Transaction): void
  clearTransactions(): void
  transactions: Transaction[]
} => {
  const dispatch = useDispatch()
  const { address } = useAccount()
  const { chain } = useNetwork()
  const txHistory = useAppSelector(selectTransactionHistory)

  return useMemo(() => {
    function addTransaction(transaction: Transaction) {
      const { action, hash } = transaction
      toast({ action, chain, transactionHash: hash, type: 'info' })
      if (address && chain) {
        dispatch(
          addTransactionHistory({
            address,
            chainId: num.toHex(chain.id),
            transaction
          })
        )
        dispatch(addPendingTransaction({ action, hash: num.toStorageKey(hash) }))
      }
    }

    function clearTransactions() {
      if (address && chain) {
        dispatch(clearTransactionHistory({ chainId: num.toHex(chain.id), address }))
      }
    }

    return {
      addTransaction,
      clearTransactions,
      transactions: address && chain ? txHistory?.[`${num.toHex(chain.id)}-${address}`] ?? [] : []
    }
  }, [address, chain, dispatch, txHistory])
}
