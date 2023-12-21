import { useEffect, useRef } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Strategy, TokenInfo } from '@/api'
import { API_BASE_URL } from '@/misc/constants'

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
  const baseUrl = API_BASE_URL
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

export const useDefaultTokens = () => {
  return useDataApi<TokenInfo[]>({
    path: '/tokens'
  })
}

export const useStrategies = () => {
  return useDataApi<Strategy[]>({
    path: '/strategies'
  })
}
