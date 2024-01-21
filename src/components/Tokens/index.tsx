import React, { useContext, useMemo } from 'react'
import Image from 'next/image'
import { TokenContext } from '@/contexts'

interface IconProps {
  address?: string
  size: number
  symbol?: string
  className?: string
}

export const Icon = ({ address, className, size, symbol }: IconProps) => {
  const { tokens } = useContext(TokenContext)

  const token = useMemo(() => tokens.find(({ l2_token_address }) => l2_token_address === address), [address, tokens])
  const icon = useMemo(() => {
    return `/assets/tokens/${token?.symbol?.toLowerCase() || symbol?.toLowerCase()}.svg`
  }, [symbol, token])

  return (
    <Image
      alt={token?.symbol || ''}
      src={icon}
      width={size}
      height={size}
      className={`rounded-3xl border-2 border-gray-900 bg-white ${className}`}
    />
  )
}
