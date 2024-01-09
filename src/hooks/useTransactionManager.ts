import { useDispatch, useAppSelector } from '@/hooks'
import { toast } from '@/misc'
import { Transaction } from '@/types'
import { useMemo } from 'react'
import { addTransactionHistory, clearTransactionHistory, selectTransactionHistory } from '@/store/persistentSlice'
import { useAccount, useNetwork } from '@starknet-react/core'
import { num } from 'starknet'

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
      toast({ chain, content: transaction.toastMessage, transactionHash: transaction.hash, type: 'success' })
      if (address && chain)
        dispatch(
          addTransactionHistory({
            address,
            chainId: num.toHex(chain.id),
            transaction
          })
        )
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
