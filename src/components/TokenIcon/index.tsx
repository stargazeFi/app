import { Box } from '@mui/system'
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

  const icon = useMemo(
    () =>
      `/assets/tokens/${tokens.find(({ l2_token_address }) => l2_token_address === address)?.symbol.toLowerCase()}.svg`,
    [address, tokens]
  )

  return (
    <Box className='relative'>
      <Image src={icon} width={size} height={size} className={`rounded-3xl border-2 border-gray-900 ${className}`} />
      <div className='absolute left-0 top-0 h-full w-full rounded-3xl bg-white' />
    </Box>
  )
}
