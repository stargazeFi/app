import { formatCurrency } from '@/misc'
import React, { useMemo } from 'react'
import { Icon } from '@/components/Tokens'
import { useColors } from '@/hooks'
import { Deposit, Strategy } from '@/types'
import { Box, GrayElement, MainText } from '@/components/Layout'
import { format } from 'timeago.js'

interface HeaderProps {
  deposited?: Deposit
  strategy: Strategy
}

export const Header = ({ deposited, strategy }: HeaderProps) => {
  const { header, info, main } = useColors(strategy.protocol)

  const type = useMemo(() => {
    switch (strategy.type) {
      case 'Range':
        return 'AUTOMATED RANGE REBALANCING'
      default:
        return 'LIQUIDITY MINING AUTOCOMPOUNDING'
    }
  }, [strategy.type])

  return (
    <GrayElement col>
      <Box
        col
        className={`relative items-start rounded-t-small bg-gradient-to-r md:flex-row md:justify-between ${header} p-6 pb-12`}
      >
        <MainText heading className='text-3xl'>
          {strategy.name}
        </MainText>
        <Box className='mt-4 md:m-0'>
          <Box center className={`rounded-sm ${info} px-2 py-1`}>
            <MainText heading className='text-white'>
              {type}
            </MainText>
          </Box>
          <Box center className={`ml-4 rounded-sm ${main} px-2 py-1`}>
            <MainText heading className='text-white'>
              {strategy.protocol.toUpperCase()}
            </MainText>
          </Box>
        </Box>
        <Box center className='absolute -bottom-[25px] left-3 w-[100px]'>
          <Icon address={strategy.tokens[0]} size={50} />
          <Box className='z-20 -ml-3'>
            <Icon address={strategy.tokens[1]} size={50} />
          </Box>
        </Box>
      </Box>
      <Box col className={`items-start rounded-t-small bg-gradient-to-r p-6 pt-12 lg:flex-row lg:justify-between`}>
        <Box col spaced className='w-full md:flex-row lg:mt-0 lg:w-auto'>
          <Box col className='items-start'>
            <MainText gradient>Total Value Locked</MainText>
            <MainText heading className='text-2xl text-white'>
              {formatCurrency(strategy.TVL)}
            </MainText>
          </Box>
          <Box className='mt-6 md:mt-0'>
            <Box col spaced className='items-start md:ml-10'>
              <MainText gradient>Total Projected Yield (APY)</MainText>
              <MainText heading className='text-2xl text-white'>
                {strategy.APY}
              </MainText>
            </Box>
            <Box col className='ml-10 items-end lg:items-start'>
              <MainText gradient>Daily yield</MainText>
              <MainText heading className='text-2xl text-white'>
                {strategy.dailyAPY}
              </MainText>
            </Box>
          </Box>
        </Box>
        <Box spaced className='mt-6 w-full lg:mt-0 lg:w-auto'>
          <Box col className='mr-10 items-start'>
            <MainText gradient>Your deposit</MainText>
            <MainText heading className='text-2xl text-white'>
              {!Number(deposited?.value) ? '---' : formatCurrency(deposited!.value)}
            </MainText>
          </Box>
          <Box col className='items-start'>
            <MainText gradient>Last update</MainText>
            <MainText heading className='text-2xl text-white'>
              {format(Number(strategy.lastUpdated) * 1000).toUpperCase()}
            </MainText>
          </Box>
        </Box>
      </Box>
    </GrayElement>
  )
}
