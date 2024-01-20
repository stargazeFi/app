import React, { useMemo } from 'react'
import { Box, MainText } from '@/components/Layout'
import { Icon } from '@/components/Tokens'
import { ASSET_FILTER, PROTOCOL_FILTER, STRATEGY_FILTER } from '@/pages'
import { Check } from '@mui/icons-material'

interface AssetFilterProps {
  filter: typeof ASSET_FILTER
  item: string
}

interface ProtocolFilterProps {
  filter: typeof PROTOCOL_FILTER
  item: string
}

interface StrategyFilterProps {
  filter: typeof STRATEGY_FILTER
  item: string
}

export const AssetFilter = ({ filter, item }: AssetFilterProps) => {
  const colors = useMemo(() => {
    switch (item) {
      case 'USDC':
        return { background: 'bg-usdc/10', border: 'border-usdc' }
      case 'WBTC':
        return { background: 'bg-wbtc/10', border: 'border-wbtc' }
      default:
        return { background: 'bg-eth/10', border: 'border-eth' }
    }
  }, [item])

  const isChecked = useMemo(() => filter.has(item), [filter, item])

  return (
    <Box
      spaced
      className={`${isChecked ? colors.border : 'border-transparent'} rounded-3xl border-2 ${colors.background} p-1`}
    >
      <Box center>
        <Icon size={40} symbol={item} />
        <MainText heading className='ml-4 flex text-white'>
          {item}
        </MainText>
      </Box>
      <Box center className='pr-2'>
        {isChecked && <Check color='inherit' className='text-white' />}
      </Box>
    </Box>
  )
}

export const ProtocolFilter = ({ filter, item }: ProtocolFilterProps) => {
  const colors = useMemo(() => {
    switch (item) {
      case 'EKUBO':
        return { background: 'bg-ekubo/10', border: 'border-ekubo' }
      case 'SITHSWAP':
        return { background: 'bg-sithswap/10', border: 'border-sithswap' }
      default:
        return { background: 'bg-jediswap/10', border: 'border-jediswap' }
    }
  }, [item])

  const isChecked = useMemo(() => filter.has(item), [filter, item])

  return (
    <Box
      spaced
      className={`${isChecked ? colors.border : 'border-transparent'} h-[52px] rounded-3xl border-2 ${
        colors.background
      } p-1`}
    >
      <Box center>
        <MainText heading className='ml-4 flex text-white'>
          {item.toUpperCase()}
        </MainText>
      </Box>
      <Box center className='pr-2'>
        {isChecked && <Check color='inherit' className='text-white' />}
      </Box>
    </Box>
  )
}

export const StrategyFilter = ({ filter, item }: StrategyFilterProps) => {
  const colors = useMemo(() => {
    switch (item) {
      case 'RANGE':
        return { background: 'bg-violet-800/10', border: 'border-violet-800' }
      default:
        return { background: 'bg-blue-800/10', border: 'border-blue-800' }
    }
  }, [item])

  const isChecked = useMemo(() => filter.has(item), [filter, item])

  return (
    <Box
      spaced
      className={`${isChecked ? colors.border : 'border-transparent'} h-[52px] rounded-3xl border-2 ${
        colors.background
      } p-1`}
    >
      <Box center>
        <MainText heading className='ml-4 flex text-white'>
          {item}
        </MainText>
      </Box>
      <Box center className='pr-2'>
        {isChecked && <Check color='inherit' className='text-white' />}
      </Box>
    </Box>
  )
}
