import { useTransactionManager } from '@/hooks'
import { Strategy, TransactionType } from '@/types'
import { ContractWriteVariables, useAccount, useConnect } from '@starknet-react/core'
import { useCallback } from 'react'
import { InvokeFunctionResponse } from 'starknet'

export const useHandleCTA = ({
  deposit,
  mode,
  refetch,
  strategy,
  withdraw
}: {
  deposit: (args?: ContractWriteVariables | undefined) => Promise<InvokeFunctionResponse>
  mode: 'deposit' | 'withdraw'
  refetch: () => Promise<unknown>
  strategy: Strategy
  withdraw: (args?: ContractWriteVariables | undefined) => Promise<InvokeFunctionResponse>
}) => {
  const { isConnected } = useAccount()
  const { connect } = useConnect()
  const { addTransaction } = useTransactionManager()

  return useCallback(async () => {
    if (!isConnected) {
      connect()
    }

    try {
      const { transaction_hash: hash } = await (mode === 'deposit' ? deposit() : withdraw())
      addTransaction(refetch, {
        action: mode === 'deposit' ? TransactionType.StrategyDeposit : TransactionType.StrategyRedeem,
        hash,
        strategyName: strategy!.name,
        timestamp: Date.now()
      })
    } catch (e) {}
  }, [addTransaction, connect, deposit, isConnected, mode, refetch, strategy, withdraw])
}
