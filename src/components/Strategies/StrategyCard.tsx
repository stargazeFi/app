import { Icon } from '@/components/Tokens'
import { useColors } from '@/hooks'
import { formatCurrency, formatToDecimal } from '@/misc'
import React from 'react'
import { Box, GrayElement, MainText } from '@/components/Layout'
import { Balance, Deposit, Strategy } from '@/types'

interface StrategyCardProps {
  balance?: Balance
  deposit: Deposit
  strategy: Strategy
}

export const StrategyCard = ({
  balance,
  deposit,
  strategy: { name, protocol, tokens, type, APY, TVL, dailyAPY }
}: StrategyCardProps) => {
  const { border, header, info, main, shadow } = useColors(protocol)

  return (
    <GrayElement
      col
      className={`cursor-pointer transition-all ${shadow} border-2 border-transparent ${border} m-3 w-[290px]`}
    >
      <Box className={`relative rounded-t-small bg-gradient-to-r ${header} p-6 pb-12`}>
        <Box center className={`rounded-sm ${info} px-2 py-1`}>
          <MainText heading className='text-sm text-white'>
            {type.toUpperCase()}
          </MainText>
        </Box>
        <Box center className={`mx-2 rounded-sm ${main} px-2 py-1`}>
          <MainText heading className='text-sm text-white'>
            {protocol.toUpperCase()}
          </MainText>
        </Box>
        <Box center className='absolute -bottom-[22px] left-4 w-[88px]'>
          <Icon address={tokens[0]} size={44} />
          <Box className='z-20 -ml-3'>
            <Icon address={tokens[1]} size={44} />
          </Box>
        </Box>
      </Box>
      <Box col className='items-start p-6 pt-12'>
        <MainText heading className='mb-2 text-2xl text-white'>
          {name.toUpperCase()}
        </MainText>
        <MainText gradient className='text-xs'>
          Total Projected Yield (APY)
        </MainText>
        <MainText heading className='mb-2 text-2xl text-white'>
          {APY}
        </MainText>
        <MainText gradient className='text-xs'>
          Daily yield
        </MainText>
        <MainText heading className='mb-2 text-white'>
          {dailyAPY}
        </MainText>
        <MainText gradient className='text-xs'>
          Total Value Locked
        </MainText>
        <MainText heading className='mb-2 text-2xl text-white'>
          {formatCurrency(TVL)}
        </MainText>
      </Box>
      <Box col className='rounded-b-md bg-gray-800/50 px-4 py-2'>
        <Box spaced className='mb-1 items-end'>
          <MainText gradient className='text-xs'>
            Your position
          </MainText>
          <MainText heading className='text-sm'>
            {!Number(deposit?.value) ? '---' : formatCurrency(deposit.value)}
          </MainText>
        </Box>
        <Box spaced className='mt-1 items-end'>
          <MainText gradient className='text-xs'>
            In wallet
          </MainText>
          <MainText heading className='text-sm'>
            {!balance || !Number(balance?.formatted) ? '---' : formatToDecimal(balance.formatted, 6)}
          </MainText>
        </Box>
      </Box>
    </GrayElement>
  )
}
