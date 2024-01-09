import { useAppSelector, useDispatch } from '@/hooks'
import { toast } from '@/misc'
import { PendingTransaction, removePendingTransaction, selectPendingTransactions } from '@/store/appSlice'
import { useNetwork, useWaitForTransaction } from '@starknet-react/core'
import { createContext, Dispatch, ReactNode, SetStateAction, useEffect, useState } from 'react'
import { TransactionExecutionStatus } from 'starknet'

interface OnSuccessAction {
  hash: string
  onSuccess: () => Promise<void>
}

type PendingTransactionsContextItem = {
  setOnSuccessAction?: Dispatch<SetStateAction<Array<OnSuccessAction>>>
}

export const PendingTransactionsContext = createContext<PendingTransactionsContextItem>({})

const PendingTransaction = ({
  onSuccessActions,
  pendingTransaction,
  setOnSuccessAction
}: {
  onSuccessActions: Array<OnSuccessAction>
  pendingTransaction: PendingTransaction
  setOnSuccessAction: Dispatch<SetStateAction<Array<OnSuccessAction>>>
}) => {
  const dispatch = useDispatch()
  const { chain } = useNetwork()
  const { data } = useWaitForTransaction({ hash: pendingTransaction.hash, watch: true })

  useEffect(() => {
    if (data) {
      const { block_number, execution_status } = data as {
        block_number: number
        execution_status: TransactionExecutionStatus
      }

      if (execution_status === TransactionExecutionStatus.REJECTED) {
        toast({ action: pendingTransaction.action, chain, type: 'error' })
        dispatch(removePendingTransaction({ hash: pendingTransaction.hash }))
      } else {
        console.log(block_number)
        setTimeout(() => {
          const { onSuccess } = onSuccessActions.find(({ hash }) => hash === pendingTransaction.hash)!
          onSuccess().then(() => {
            dispatch(removePendingTransaction({ hash: pendingTransaction.hash }))
            toast({ action: pendingTransaction.action, chain, type: 'success' })
            setOnSuccessAction((state) => [...state, state.find(({ hash }) => hash === pendingTransaction.hash)!])
          })
        }, 10000)
      }
    }
  }, [chain, data, dispatch, onSuccessActions, pendingTransaction, setOnSuccessAction])

  return <div className='hidden' />
}

export const PendingTransactionsProvider = ({ children }: { children: ReactNode }) => {
  const [onSuccessActions, setOnSuccessAction] = useState<Array<OnSuccessAction>>([])
  const pendingTransactions = useAppSelector(selectPendingTransactions)

  return (
    <PendingTransactionsContext.Provider value={{ setOnSuccessAction }}>
      {pendingTransactions.map((pendingTransaction, index) => (
        <PendingTransaction
          key={index}
          onSuccessActions={onSuccessActions}
          pendingTransaction={pendingTransaction}
          setOnSuccessAction={setOnSuccessAction}
        />
      ))}
      {children}
    </PendingTransactionsContext.Provider>
  )
}
