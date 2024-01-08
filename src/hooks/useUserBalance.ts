import { useStrategiesManager } from '@/hooks/useStrategiesManager'
import { computeUserBalance } from '@/misc/maths'
import { useMemo } from 'react'
import { useBalances } from '@/hooks/api'

export const useUserBalance = (address: string | undefined, strategyAddress: string | undefined) => {
  const { data: balances, isLoading } = useBalances(address)
  const { strategies } = useStrategiesManager()

  return useMemo(() => {
    let data
    const strategy = strategies.find((strategy) => strategy.address === strategyAddress)
    if (balances && strategyAddress && strategy) {
      const balance = balances[strategyAddress]
      if (balance) {
        const { reserves, TVL } = strategy
        data = computeUserBalance(balance, reserves, TVL)
      }
    }

    return {
      data,
      isLoading
    }
  }, [balances, isLoading, strategies, strategyAddress])
}

export const useUserBalances = (address: string | undefined) => {
  const { data: balances, isLoading } = useBalances(address)
  const { strategies } = useStrategiesManager()

  return useMemo(() => {
    const data = Object.entries(balances || {}).reduce(
      (acc, it) => {
        const strategy = strategies.find((strategy) => strategy.address === it[0])
        if (balances && strategy) {
          const balance = balances[strategy.address]
          if (balance) {
            const { reserves, TVL } = strategy
            acc[strategy.address] = computeUserBalance(balance, reserves, TVL)
          }
        }

        return acc
      },
      {} as Record<string, string>
    )

    return {
      data,
      isLoading
    }
  }, [balances, isLoading, strategies])
}
