import { useEffect, useRef } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Analytics, PendingTransaction, Price, Strategy, TokenInfo } from '@/types'
import { num, Uint256 } from 'starknet'

export function useApiBaseUrl() {
  if (process.env.NEXT_PUBLIC___DEV_ENV) {
    return 'http://localhost:8888'
  }

  return 'https://api-dev.stargaze.finance'

  /*
  switch (chain.id) {
    case mainnet.id:
      return 'https://api.stargaze.finance'
    case goerli.id:
      return 'https://api-dev.stargaze.finance'
  }
  */
}

const useDataApi = <TQueryFnData = unknown>({
  path,
  refetchInterval,
  retry = true,
  handleErrorResponse,
  staleTime = 0
}: {
  path?: string | null
  refetchInterval?: number
  handleErrorResponse?: (response: Response) => TQueryFnData
  retry?: boolean | number
  staleTime?: number
}) => {
  const baseUrl = useApiBaseUrl()
  const url = `${baseUrl}${path}`

  const ref = useRef(url)

  useEffect(() => {
    ref.current = url
  }, [url])

  return useQuery<TQueryFnData>({
    async queryFn() {
      if (ref.current !== url) throw new Error('Canceled request')

      const response = await fetch(url)
      if (!response.ok) {
        if (handleErrorResponse) {
          return handleErrorResponse(response)
        }
        throw new Error(`Failed to fetch from API: ${response.status}`)
      }
      return response.json()
    },
    retry,
    queryKey: [url],
    refetchInterval: refetchInterval ?? false,
    refetchOnWindowFocus: 'always',
    refetchIntervalInBackground: false,
    refetchOnMount: 'always',
    staleTime,
    enabled: Boolean(baseUrl && path)
  })
}

export const useAnalytics = (address: string | undefined) => {
  return useDataApi<Analytics>({
    path: `/analytics?address=${num.toStorageKey(address || 0n)}`,
    staleTime: 1000
  })
}

export const useBalances = (address: string | undefined) => {
  return useDataApi<Record<string, { balance: Uint256; decimals: number }>>({
    path: `/balances?address=${num.toStorageKey(address || 0n)}`,
    staleTime: 1000
  })
}

export const useDeposits = (address: string | undefined) => {
  return useDataApi<Record<string, Uint256>>({
    path: `/deposits?address=${num.toStorageKey(address || 0n)}`,
    staleTime: 1000
  })
}

export const usePendingTransaction = (hash: string) => {
  return useDataApi<PendingTransaction>({
    path: `/pending-transaction?hash=${hash}`,
    refetchInterval: 2 * 1000,
    staleTime: 2 * 1000
  })
}

export const usePendingTransactions = () => {
  return useDataApi<PendingTransaction[]>({
    path: '/pending-transactions',
    refetchInterval: 2 * 1000,
    staleTime: 2 * 1000
  })
}

export const usePrices = () => {
  return useDataApi<Price[]>({
    path: '/prices',
    refetchInterval: 30 * 1000
  })
}

export const useStrategies = () => {
  return useDataApi<Strategy[]>({
    path: '/strategies'
  })
}

export const useTokens = () => {
  return useDataApi<TokenInfo[]>({
    path: '/tokens'
  })
}
