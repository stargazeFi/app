import { usePendingTransaction } from '@/hooks/api'
import { createContext, ReactNode, useContext, useEffect } from 'react'
import { useNetwork } from '@starknet-react/core'
import { BalancesContext, DepositsContext } from '@/contexts'
import { useAppSelector, useDispatch } from '@/hooks'
import { toast } from '@/misc'
import { PendingTransaction, removePendingTransaction, selectPendingTransactions } from '@/store/appSlice'

interface PendingTransactionsContextState {}

export const PendingTransactionsContext = createContext<PendingTransactionsContextState>({})

const PendingTransaction = ({ pendingTransaction }: { pendingTransaction: PendingTransaction }) => {
  const dispatch = useDispatch()

  const { refetchBalances } = useContext(BalancesContext)
  const { refetchDeposits } = useContext(DepositsContext)
  const { chain } = useNetwork()
  const { data } = usePendingTransaction(pendingTransaction.hash)

  useEffect(() => {
    if (data?.hash === pendingTransaction.hash) {
      refetchBalances()
      refetchDeposits()
      toast({
        action: pendingTransaction.action,
        chain,
        transactionHash: pendingTransaction.hash,
        type: 'success'
      })
      dispatch(removePendingTransaction({ hash: pendingTransaction.hash }))
    }
  }, [chain, data, dispatch, pendingTransaction, refetchBalances, refetchDeposits])

  return <div className='hidden' />
}

export const PendingTransactionsProvider = ({ children }: { children: ReactNode }) => {
  const pendingTransactions = useAppSelector(selectPendingTransactions)

  return (
    <PendingTransactionsContext.Provider value={{}}>
      {pendingTransactions.map((pendingTransaction, index) => (
        <PendingTransaction key={index} pendingTransaction={pendingTransaction} />
      ))}
      {children}
    </PendingTransactionsContext.Provider>
  )
}
