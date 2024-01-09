import { useAppSelector, useDispatch } from '@/hooks'
import { toast } from '@/misc'
import { PendingTransaction, removePendingTransaction, selectPendingTransactions } from '@/store/appSlice'
import { useNetwork, useWaitForTransaction } from '@starknet-react/core'
import { ReactNode, useEffect } from 'react'
import { TransactionExecutionStatus } from 'starknet'

const PendingTransaction = ({ pendingTransaction }: { pendingTransaction: PendingTransaction }) => {
  const dispatch = useDispatch()
  const { chain } = useNetwork()
  const { data } = useWaitForTransaction({ hash: pendingTransaction.hash, watch: true })

  useEffect(() => {
    if (data) {
      const { execution_status } = data as {
        block_number: number
        execution_status: TransactionExecutionStatus
      }

      const type = execution_status === TransactionExecutionStatus.REJECTED ? 'error' : 'success'
      toast({ action: pendingTransaction.action, chain, transactionHash: pendingTransaction.hash, type })
      dispatch(removePendingTransaction({ hash: pendingTransaction.hash }))
    }
  }, [chain, data, dispatch, pendingTransaction])

  return <div className='hidden' />
}

export const PendingTransactionsProvider = ({ children }: { children: ReactNode }) => {
  const pendingTransactions = useAppSelector(selectPendingTransactions)

  return (
    <>
      {pendingTransactions.map((pendingTransaction, index) => (
        <PendingTransaction key={index} pendingTransaction={pendingTransaction} />
      ))}
      {children}
    </>
  )
}
