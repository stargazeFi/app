import { Box } from '@/components/Layout'
import React, { useContext, useMemo } from 'react'
import { TokenContext } from '@/contexts'
import { Image } from '@nextui-org/react'

interface TokenIconProps {
  address: string
  size: number
  className?: string
}

export const TokenIcon = ({ address, className, size }: TokenIconProps) => {
  const tokens = useContext(TokenContext)

  const token = useMemo(() => tokens.find(({ l2_token_address }) => l2_token_address === address), [address, tokens])
  const icon = useMemo(() => (token ? `/assets/tokens/${token.symbol.toLowerCase()}.svg` : ''), [token])

  return (
    <Box className='relative'>
      <Image src={icon} width={size} height={size} className={`rounded-3xl border-2 border-gray-900 ${className}`} />
      <Box className='absolute left-0 top-0 h-full w-full rounded-3xl bg-white'>
        <div />
      </Box>
    </Box>
  )
}
