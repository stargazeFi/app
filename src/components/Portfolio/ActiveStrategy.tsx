import { Icon } from '@/components/Tokens'
import { Box, GrayElement, MainText } from '@/components/Layout'
import { useColors } from '@/hooks'
import { formatCurrency } from '@/misc'
import { Deposit, Strategy } from '@/types'
import React from 'react'

interface ActiveStrategyProps {
  dailyReturns: number
  deposit: Deposit
  strategy: Strategy
}

export const ActiveStrategy = ({
  dailyReturns,
  deposit,
  strategy: { name, protocol, tokens, type, APY, dailyAPY }
}: ActiveStrategyProps) => {
  const { border, header, info, main, shadow } = useColors(protocol)

  return (
    <GrayElement col className={`cursor-pointer transition-all ${shadow} border-2 border-transparent ${border} mb-3`}>
      <Box spaced className={`rounded-t-small bg-gradient-to-r ${header} w-full p-3`}>
        <Box center>
          <Icon address={tokens[0]} size={32} />
          <Box className='z-20 -ml-3'>
            <Icon address={tokens[1]} size={32} />
          </Box>
          <MainText heading className='ml-3 text-xl text-white'>
            {name.toUpperCase()}
          </MainText>
        </Box>
        <Box center>
          <Box center className={`rounded-sm ${info} px-2 py-0.5`}>
            <MainText heading className='text-sm text-white'>
              {type.toUpperCase()}
            </MainText>
          </Box>
          <Box center className={`mx-2 rounded-sm ${main} px-2 py-0.5`}>
            <MainText heading className='text-sm text-white'>
              {protocol.toUpperCase()}
            </MainText>
          </Box>
        </Box>
      </Box>
      <Box spaced className='p-3'>
        <Box col className='items-start'>
          <MainText gradient className='text-sm'>
            Deposit
          </MainText>
          <MainText heading className='text-xl text-white'>
            {formatCurrency(deposit.value)}
          </MainText>
        </Box>
        <Box col>
          <MainText gradient className='text-sm'>
            APY
          </MainText>
          <MainText heading className='text-xl text-white'>
            {APY}
          </MainText>
        </Box>
        <Box col spaced className='ml-10'>
          <MainText gradient className='text-sm'>
            Daily Yield
          </MainText>
          <MainText heading className='text-xl text-white'>
            {dailyAPY}
          </MainText>
        </Box>
        <Box col spaced className='ml-10'>
          <MainText gradient className='text-sm'>
            Daily Returns
          </MainText>
          <MainText heading className='text-xl text-white'>
            {formatCurrency(dailyReturns)}
          </MainText>
        </Box>
      </Box>
    </GrayElement>
  )
}
