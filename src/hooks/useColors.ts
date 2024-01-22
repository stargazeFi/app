import { useMemo } from 'react'
import { Protocol } from '@/types'

export const useColors = (protocol: Protocol) => {
  return useMemo(() => {
    switch (protocol) {
      case 'ekubo':
        return {
          border: 'hover:border-violet-500',
          header: 'from-violet-950/20 to-violet-800/20',
          info: 'bg-ekubo',
          main: 'bg-ekubo',
          shadow: 'hover:drop-shadow-range'
        }
      case 'sithswap':
        return {
          border: 'hover:border-blue-500',
          header: 'from-blue-950/20 to-blue-800/20',
          info: 'bg-blue-800',
          main: 'bg-sithswap',
          shadow: 'hover:drop-shadow-lp'
        }
      default:
        return {
          border: 'hover:border-blue-500',
          header: 'from-blue-950/20 to-blue-800/20',
          info: 'bg-blue-800',
          main: 'bg-jediswap',
          shadow: 'hover:drop-shadow-lp'
        }
    }
  }, [protocol])
}
