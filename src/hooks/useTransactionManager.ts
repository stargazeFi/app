import { PendingTransactionsContext } from '@/contexts'
import { useDispatch, useAppSelector } from '@/hooks'
import { toast } from '@/misc'
import { Transaction } from '@/types'
import { useContext, useMemo } from 'react'
import { addPendingTransaction } from '@/store/appSlice'
import { addTransactionHistory, clearTransactionHistory, selectTransactionHistory } from '@/store/persistentSlice'
import { useAccount, useNetwork } from '@starknet-react/core'
import { num } from 'starknet'

interface AddTransactionArgs {
  onSuccess: () => Promise<void>
  transaction: Transaction
}

export const useTransactionManager = (): {
  addTransaction(x: AddTransactionArgs): void
  clearTransactions(): void
  transactions: Transaction[]
} => {
  const dispatch = useDispatch()
  const { address } = useAccount()
  const { setOnSuccessAction } = useContext(PendingTransactionsContext)
  const { chain } = useNetwork()
  const txHistory = useAppSelector(selectTransactionHistory)

  return useMemo(() => {
    function addTransaction({ onSuccess, transaction }: AddTransactionArgs) {
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
        dispatch(addPendingTransaction({ action, hash }))
        if (setOnSuccessAction) {
          setOnSuccessAction((state) => [...state, { hash: transaction.hash, onSuccess }])
        }
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
