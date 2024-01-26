import { createContext, ReactNode, useEffect, useState } from 'react'
import BigNumber from 'bignumber.js'
import { uint256 } from 'starknet'
import { useAccount } from '@starknet-react/core'
import { useDeposits, useStrategies } from '@/hooks/api'
import { computeUserDeposit } from '@/misc'
import { Deposits } from '@/types'

type DepositsContextState = {
  deposits: Deposits
  depositsLoading: boolean
  refetchDeposits: () => Promise<any>
}

export const DepositsContext = createContext<DepositsContextState>({
  deposits: {},
  depositsLoading: true,
  refetchDeposits: async () => {}
})

export const DepositsProvider = ({ children }: { children: ReactNode }) => {
  const { address } = useAccount()
  const { data, isLoading: depositsLoading, refetch: refetchDeposits } = useDeposits(address)
  const { data: strategies } = useStrategies()

  const [deposits, setDeposits] = useState<Deposits>({})

  useEffect(() => {
    if (data) {
      setDeposits(
        Object.entries(data || {}).reduce((acc, it) => {
          const strategy = strategies?.find((strategy) => strategy.address === it[0])
          if (data && strategy) {
            const balance = data[strategy.address]
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
      )
    }
  }, [data, strategies])

  return (
    <DepositsContext.Provider value={{ deposits, depositsLoading, refetchDeposits }}>
      {children}
    </DepositsContext.Provider>
  )
}
