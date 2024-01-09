import { useNetwork } from '@starknet-react/core'
import { goerli, mainnet } from '@starknet-react/chains'
import { useEffect, useRef } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Price, Strategy, TokenInfo } from '@/types'
import { num, Uint256 } from 'starknet'

export function useApiBaseUrl() {
  const { chain } = useNetwork()

  if (process.env.NEXT_PUBLIC___DEV_ENV) {
    return 'http://localhost:8888'
  }

  switch (chain.id) {
    case mainnet.id:
      return 'https://api-dev-ksdyxyhlsa-uc.a.run.app' // 'https://api.stargaze.finance'
    case goerli.id:
      return 'https://api-dev-ksdyxyhlsa-uc.a.run.app' // 'https://api-dev.stargaze.finance'
  }
}

const useDataApi = <TQueryFnData = unknown>({
  path,
  refetchInterval,
  retry = true,
  handleErrorResponse
}: {
  path?: string | null
  refetchInterval?: number
  handleErrorResponse?: (response: Response) => TQueryFnData
  retry?: boolean | number
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
    enabled: Boolean(baseUrl && path)
  })
}

export const useBalances = (address: string | undefined) => {
  return useDataApi<Record<string, Uint256>>({
    path: `/balances?address=${num.toStorageKey(address || 0n)}`,
    refetchInterval: 30000
  })
}

export const usePrices = () => {
  return useDataApi<Price[]>({
    path: '/prices',
    refetchInterval: 30000
  })
}

export const useStrategies = () => {
  return useDataApi<Strategy[]>({
    path: '/strategies',
    refetchInterval: 10000
  })
}

export const useTokens = () => {
  return useDataApi<TokenInfo[]>({
    path: '/tokens',
    refetchInterval: 30000
  })
}
