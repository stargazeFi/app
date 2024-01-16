import { useStrategiesManager } from '@/hooks/useStrategiesManager'
import { computeUserDeposit } from '@/misc'
import { Balances, Deposits } from '@/types'
import BigNumber from 'bignumber.js'
import { useMemo } from 'react'
import { useBalances as fetchBalances, useDeposits as fetchDeposits } from '@/hooks/api'
import { uint256 } from 'starknet'

export const useBalance = (address: string | undefined, asset: string | undefined) => {
  const { data: balances, isLoading, refetch } = fetchBalances(address)

  return useMemo(() => {
    let data
    if (balances && asset && balances[asset]) {
      const { balance, decimals } = balances[asset]
      data = {
        formatted: new BigNumber(uint256.uint256ToBN(balance).toString()).dividedBy(10 ** decimals).toString(),
        decimals
      }
    }

    return {
      data,
      isLoading,
      refetch
    }
  }, [asset, balances, isLoading, refetch])
}

export const useBalances = (address: string | undefined) => {
  const { data: balances, isLoading, refetch } = fetchBalances(address)

  return useMemo(
    () => ({
      data: Object.entries(balances || {}).reduce((acc, it) => {
        const [asset, { balance, decimals }] = it
        acc[asset] = {
          decimals,
          formatted: new BigNumber(uint256.uint256ToBN(balance).toString()).dividedBy(10 ** decimals).toString()
        }

        return acc
      }, {} as Balances),
      isLoading,
      refetch
    }),
    [balances, isLoading, refetch]
  )
}

export const useDeposit = (address: string | undefined, strategyAddress: string | undefined) => {
  const { data: balances, isLoading, refetch } = fetchDeposits(address)
  const { strategies } = useStrategiesManager()

  return useMemo(() => {
    let data
    const strategy = strategies.find((strategy) => strategy.address === strategyAddress)
    if (balances && strategyAddress && strategy) {
      const balance = balances[strategyAddress]
      if (balance) {
        const { totalShares, TVL } = strategy
        const formatted = new BigNumber(uint256.uint256ToBN(balance).toString()).dividedBy(10 ** 18).toString()
        data = { decimals: 18, formatted, value: computeUserDeposit(balance, totalShares, TVL) }
      }
    }

    return {
      data,
      isLoading,
      refetch
    }
  }, [balances, isLoading, refetch, strategies, strategyAddress])
}

export const useDeposits = (address: string | undefined) => {
  const { data: balances, isLoading, refetch } = fetchDeposits(address)
  const { strategies } = useStrategiesManager()

  return useMemo(() => {
    const data = Object.entries(balances || {}).reduce((acc, it) => {
      const strategy = strategies.find((strategy) => strategy.address === it[0])
      if (balances && strategy) {
        const balance = balances[strategy.address]
        if (balance) {
          const { totalShares, TVL } = strategy
          const formatted = new BigNumber(uint256.uint256ToBN(balance).toString()).dividedBy(10 ** 18).toString()
          acc[strategy.address] = {
            decimals: 18,
            formatted,
            value: computeUserDeposit(balance, totalShares, TVL)
          }
        }
      }

      return acc
    }, {} as Deposits)

    return {
      data,
      isLoading,
      refetch
    }
  }, [balances, isLoading, refetch, strategies])
}
