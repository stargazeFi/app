import { Icon } from '@/components/Tokens'
import { formatCurrency } from '@/misc'
import React, { useCallback, useContext, useMemo, useState } from 'react'
import { TokenContext } from '@/contexts'
import { PieChart, Pie, Cell } from 'recharts'
import { Box, MainText } from '@/components/Layout'
import { Deposits, Strategy } from '@/types'

interface AnalyticsProps {
  deposits: Deposits
  strategies: Array<Strategy>
}

export const Analytics = ({ deposits, strategies }: AnalyticsProps) => {
  const { getTokenSymbol } = useContext(TokenContext)

  const [hover, setHover] = useState<{ address: string; symbol: string } | undefined>()

  const colors = useCallback((symbol: string) => {
    switch (symbol) {
      case 'USDC':
        return { fill: '#4b72be20', stroke: '#4b72be' }
      case 'WBTC':
        return { fill: '#d7985d20', stroke: '#d7985d' }
      default:
        return { fill: '#687de320', stroke: '#687de3' }
    }
  }, [])

  const data = useMemo(
    () =>
      Object.entries(
        strategies.reduce(
          (data, strategy) => {
            const [a, b] = strategy.tokens
            const value = Number(deposits[strategy.address].value) / 2
            data[a] = (data[a] || 0) + value
            data[b] = (data[b] || 0) + value

            return data
          },
          {} as Record<string, number>
        )
      ).map(([address, value]) => ({ address, symbol: getTokenSymbol(address)!, value })),
    [deposits, getTokenSymbol, strategies]
  )

  return (
    <Box col center className='h-fit'>
      <PieChart width={350} height={350}>
        <Pie
          data={data}
          cx='50%'
          cy='50%'
          activeShape={false}
          onMouseEnter={(hover) => setHover(hover)}
          onMouseLeave={() => setHover(undefined)}
          outerRadius={150}
          dataKey='value'
        >
          {data.map(({ address, symbol }, index) => (
            <Cell
              key={index}
              fill={colors(symbol).fill}
              stroke={colors(symbol).stroke}
              style={{
                filter: hover?.address === address ? `drop-shadow(0 0 10px ${colors(symbol).stroke})` : ''
              }}
            />
          ))}
        </Pie>
      </PieChart>
      {hover && (
        <Box center className='-mt-4'>
          <Icon address={hover.address} size={30} />
          <MainText heading className='ml-2 text-lg'>
            {hover.symbol}: {formatCurrency(data.find(({ address }) => address === hover.address)!.value)}
          </MainText>
        </Box>
      )}
    </Box>
  )
}
