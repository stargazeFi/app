import { useAppSelector, useDispatch } from '@/hooks'
import { usePendingTransaction } from '@/hooks/api'
import { toast } from '@/misc'
import { PendingTransaction, removePendingTransaction, selectPendingTransactions } from '@/store/appSlice'
import { useNetwork } from '@starknet-react/core'
import { createContext, Dispatch, ReactNode, SetStateAction, useEffect, useState } from 'react'

interface PendingTransactionOnSuccess {
  hash: string
  refetch: () => Promise<unknown>
}

type PendingTransactionsContextState = {
  pendingTransactionsRefetch: Array<PendingTransactionOnSuccess>
  setPendingTransactionsRefetch: Dispatch<SetStateAction<PendingTransactionOnSuccess[]>>
}

export const PendingTransactionsContext = createContext<PendingTransactionsContextState>({
  pendingTransactionsRefetch: [],
  setPendingTransactionsRefetch: () => {}
})

const PendingTransaction = ({
  pendingTransaction,
  pendingTransactionsRefetch,
  setPendingTransactionsRefetch
}: {
  pendingTransaction: PendingTransaction
  pendingTransactionsRefetch: Array<PendingTransactionOnSuccess>
  setPendingTransactionsRefetch: Dispatch<SetStateAction<PendingTransactionOnSuccess[]>>
}) => {
  const { data } = usePendingTransaction(pendingTransaction.hash)
  const dispatch = useDispatch()
  const { chain } = useNetwork()

  useEffect(() => {
    if (data?.hash) {
      pendingTransactionsRefetch
        .find(({ hash }) => hash === pendingTransaction.hash)
        ?.refetch()
        .then(() => {
          toast({ action: pendingTransaction.action, chain, transactionHash: pendingTransaction.hash, type: 'success' })
          setPendingTransactionsRefetch((state) =>
            state.splice(
              pendingTransactionsRefetch.findIndex(({ hash }) => hash === pendingTransaction.hash),
              1
            )
          )
          dispatch(removePendingTransaction({ hash: pendingTransaction.hash }))
        })
    }
  }, [chain, data, dispatch, pendingTransaction, pendingTransactionsRefetch])

  return <div className='hidden' />
}

export const PendingTransactionsProvider = ({ children }: { children: ReactNode }) => {
  const [pendingTransactionsRefetch, setPendingTransactionsRefetch] = useState<PendingTransactionOnSuccess[]>([])
  const pendingTransactions = useAppSelector(selectPendingTransactions)

  return (
    <PendingTransactionsContext.Provider value={{ pendingTransactionsRefetch, setPendingTransactionsRefetch }}>
      {pendingTransactions.map((pendingTransaction, index) => (
        <PendingTransaction
          key={index}
          pendingTransactionsRefetch={pendingTransactionsRefetch}
          pendingTransaction={pendingTransaction}
          setPendingTransactionsRefetch={setPendingTransactionsRefetch}
        />
      ))}
      {children}
    </PendingTransactionsContext.Provider>
  )
}
