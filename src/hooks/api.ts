import { useEffect, useRef } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Price, Strategy, TokenInfo } from '@/types'
// import { useNetwork } from '@starknet-react/core'
// import { goerli, mainnet } from '@starknet-react/chains'

export function useApiBaseUrl() {
  // const { chain } = useNetwork() // TODO RESTORE FOR PROPER API SPLIT
  return 'http://localhost:3000/api'
  /* return chain?.id === goerli.id
    ? 'http://nyanya.stargaze.finance/api'
    : chain?.id === mainnet.id
      ? 'https://stargaze.finance/api'
      : 'http://localhost:3000/api' */
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
    staleTime: refetchInterval,
    enabled: Boolean(baseUrl && path)
  })
}

export const useDefaultTokens = () => {
  return useDataApi<TokenInfo[]>({
    path: '/tokens'
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
    path: '/strategies'
  })
}