import { useStrategiesManager } from '@/hooks/useStrategiesManager'
import { computeUserBalance } from '@/misc/maths'
import BigNumber from 'bignumber.js'
import { useMemo } from 'react'
import { useBalances as fetchBalances, useDeposits as fetchDeposits } from '@/hooks/api'
import { uint256 } from 'starknet'

export const useBalance = (address: string | undefined, asset: string) => {
  const { data: balances, isLoading } = fetchBalances(address)

  return useMemo(() => {
    let data
    if (balances) {
      const { balance, decimals } = balances[asset]
      data = {
        formatted: new BigNumber(uint256.uint256ToBN(balance).toString()).dividedBy(10 ** decimals).toString(),
        decimals
      }
    }

    return {
      data,
      isLoading
    }
  }, [asset, balances, isLoading])
}

export const useBalances = (address: string | undefined) => {
  const { data: balances, isLoading } = fetchBalances(address)

  return useMemo(
    () => ({
      data: Object.entries(balances || {}).reduce(
        (acc, it) => {
          const [asset, { balance, decimals }] = it
          acc[asset] = {
            decimals,
            formatted: new BigNumber(uint256.uint256ToBN(balance).toString()).dividedBy(10 ** decimals).toString()
          }

          return acc
        },
        {} as Record<string, { decimals: number; formatted: string }>
      ),
      isLoading
    }),
    [balances, isLoading]
  )
}

export const useDeposit = (address: string | undefined, strategyAddress: string | undefined) => {
  const { data: balances, isLoading } = fetchDeposits(address)
  const { strategies } = useStrategiesManager()

  return useMemo(() => {
    let data
    const strategy = strategies.find((strategy) => strategy.address === strategyAddress)
    if (balances && strategyAddress && strategy) {
      const balance = balances[strategyAddress]
      if (balance) {
        const { reserves, TVL } = strategy
        const formatted = new BigNumber(uint256.uint256ToBN(balance).toString()).dividedBy(10 ** 18).toString()
        data = { decimals: 18, formatted, value: computeUserBalance(balance, reserves, TVL) }
      }
    }

    return {
      data,
      isLoading
    }
  }, [balances, isLoading, strategies, strategyAddress])
}

export const useDeposits = (address: string | undefined) => {
  const { data: balances, isLoading } = fetchDeposits(address)
  const { strategies } = useStrategiesManager()

  return useMemo(() => {
    const data = Object.entries(balances || {}).reduce(
      (acc, it) => {
        const strategy = strategies.find((strategy) => strategy.address === it[0])
        if (balances && strategy) {
          const balance = balances[strategy.address]
          if (balance) {
            const { reserves, TVL } = strategy
            const formatted = new BigNumber(uint256.uint256ToBN(balance).toString()).dividedBy(10 ** 18).toString()
            acc[strategy.address] = {
              decimals: 18,
              formatted,
              value: computeUserBalance(balance, reserves, TVL)
            }
          }
        }

        return acc
      },
      {} as Record<string, { decimals: number; formatted: string; value: string }>
    )

    return {
      data,
      isLoading
    }
  }, [balances, isLoading, strategies])
}
