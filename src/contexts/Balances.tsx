import { createContext, ReactNode, useEffect, useState } from 'react'
import BigNumber from 'bignumber.js'
import { uint256 } from 'starknet'
import { useAccount } from '@starknet-react/core'
import { useBalances } from '@/hooks/api'
import { Balances } from '@/types'

type BalancesContextState = {
  balances: Balances
  balancesLoading: boolean
  refetchBalances: () => Promise<any>
}

export const BalancesContext = createContext<BalancesContextState>({
  balances: {},
  balancesLoading: true,
  refetchBalances: async () => {}
})

export const BalancesProvider = ({ children }: { children: ReactNode }) => {
  const { address } = useAccount()
  const { data, isLoading: balancesLoading, refetch: refetchBalances } = useBalances(address)

  const [balances, setBalances] = useState<Balances>({})

  useEffect(() => {
    if (data) {
      setBalances(
        Object.entries(data || {}).reduce((acc, it) => {
          const [asset, { balance, decimals }] = it
          acc[asset] = {
            decimals,
            formatted: new BigNumber(uint256.uint256ToBN(balance).toString()).dividedBy(10 ** decimals).toString()
          }

          return acc
        }, {} as Balances)
      )
    }
  }, [data])

  return (
    <BalancesContext.Provider value={{ balances, balancesLoading, refetchBalances }}>
      {children}
    </BalancesContext.Provider>
  )
}
