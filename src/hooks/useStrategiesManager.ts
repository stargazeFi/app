import { selectStrategies, storeFetchedStrategies } from '@/store/persistentSlice'
import { useMemo } from 'react'
import { useDispatch, useAppSelector } from '@/hooks'
import { Strategy } from '@/types'
import { useNetwork } from '@starknet-react/core'
import { num } from 'starknet'

export function useStrategiesManager(): {
  storeStrategies(strategies: Strategy[]): void
  strategies: Strategy[]
} {
  const dispatch = useDispatch()
  const { chain } = useNetwork()
  const storedStrategies = useAppSelector(selectStrategies)

  return useMemo(() => {
    function storeStrategies(strategies: Strategy[]) {
      if (chain) {
        dispatch(
          storeFetchedStrategies({
            chainId: num.toHex(chain.id),
            strategies
          })
        )
      }
    }

    return {
      storeStrategies,
      strategies: chain ? storedStrategies?.[num.toHex(chain.id)] ?? [] : []
    }
  }, [chain, dispatch, storedStrategies])
}
