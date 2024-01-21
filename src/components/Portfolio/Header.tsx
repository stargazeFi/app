import React, { useMemo } from 'react'
import { Box, GrayElement, MainText } from '@/components/Layout'
import { formatCurrency, formatPercentage } from '@/misc'
import { Deposits, Strategy } from '@/types'

interface HeaderProps {
  dailyReturns: Record<string, number>
  deposits: Deposits
  strategies: Array<Strategy>
}

export const Header = ({ dailyReturns, deposits, strategies }: HeaderProps) => {
  const averageDailyReturns = useMemo(
    () => Object.values(dailyReturns).reduce((acc, it) => acc + it, 0) / strategies.length,
    [dailyReturns, strategies]
  )

  const totalDeposits = useMemo(
    () => Object.values(deposits).reduce((acc, deposit) => acc + Number(deposit.value), 0),
    [deposits]
  )

  const averageDailyYield = useMemo(() => averageDailyReturns / totalDeposits, [averageDailyReturns, totalDeposits])
  const averageAPY = useMemo(() => averageDailyYield * 365, [averageDailyYield])

  return (
    <GrayElement col>
      <Box
        col
        className={`relative items-start rounded-t-small bg-gradient-to-r from-zinc-900 to-zinc-700 p-4 md:flex-row md:justify-between`}
      >
        <MainText heading className='text-3xl'>
          PORTFOLIO
        </MainText>
      </Box>
      <Box className={`items-start rounded-t-small bg-gradient-to-r p-4 lg:flex-row lg:justify-between`}>
        <Box col className='items-start'>
          <MainText gradient>Total Deposited</MainText>
          <MainText heading className='text-2xl text-white'>
            {formatCurrency(totalDeposits)}
          </MainText>
        </Box>
        <Box col>
          <MainText gradient>Average Projected Yield (APY)</MainText>
          <MainText heading className='text-2xl text-white'>
            {!isNaN(averageAPY) ? formatPercentage(averageAPY) : '---'}
          </MainText>
        </Box>
        <Box col spaced className='ml-10'>
          <MainText gradient>Average Daily Yield</MainText>
          <MainText heading className='text-2xl text-white'>
            {!isNaN(averageDailyYield) ? formatPercentage(averageDailyYield) : '---'}
          </MainText>
        </Box>
        <Box col className='items-end'>
          <MainText gradient>Estimated Daily Returns</MainText>
          <MainText heading className='text-2xl text-white'>
            {!isNaN(averageDailyReturns) ? formatCurrency(averageDailyReturns) : '---'}
          </MainText>
        </Box>
      </Box>
    </GrayElement>
  )
}
