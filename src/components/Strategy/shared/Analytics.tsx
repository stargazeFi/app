import { useDimensions } from '@/hooks/useDimensions'
import { formatCurrency, formatEpochToShortDate, formatPercentage } from '@/misc'
import { useCallback, useMemo, useRef, useState } from 'react'
import { Area, ComposedChart, CartesianGrid, Tooltip, XAxis, YAxis, Line } from 'recharts'
import { ButtonGroup, Spinner } from '@nextui-org/react'
import { Box, GrayElement, MainButton, MainText } from '@/components/Layout'
import { useAnalytics } from '@/hooks/api'
import { Strategy } from '@/types'

type Timeframe = 'hourly' | 'daily'

interface AnalyticsProps {
  strategy: Strategy
}

export const Analytics = ({ strategy }: AnalyticsProps) => {
  const { data: analytics, isLoading } = useAnalytics(strategy.address)

  const [timeframe, setTimeframe] = useState<Timeframe>('hourly')
  const ref = useRef<HTMLHeadingElement>(null)

  const { height, width } = useDimensions(ref)

  const getXAxisLabel = useCallback(
    (timestamp: string) => {
      const date = new Date(Number(timestamp))
      return timeframe === 'hourly'
        ? date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
          })
        : date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    },
    [timeframe]
  )

  const data = useMemo(() => {
    if (!analytics) return []

    const dataSet = Object.entries(analytics.tvl).reduce(
      (data, it) => {
        const [timestamp, tvl] = it as unknown as [number, string]
        data.push({ timestamp, tvl: Number(tvl) })
        if (strategy.type === 'LP') {
          data[data.length - 1].price = Number(analytics.price[timestamp])
        }

        return data
      },
      [] as Array<{ timestamp: number; price?: number; tvl: number }>
    )

    if (timeframe === 'hourly') {
      return dataSet
        .map((data, index) => {
          const shareUnitPrice = Number(analytics.shareUnit[data.timestamp])
          const oldShareUnitPrice = Number(analytics.shareUnit[dataSet[Math.max(0, index - 25)].timestamp])
          const apy = (shareUnitPrice / oldShareUnitPrice - 1) * 365
          return { ...data, apy }
        })
        .slice(Math.max(0, dataSet.length - 25), dataSet.length)
    } else {
      return dataSet
        .map((data, index) => {
          const shareUnitPrice = Number(analytics.shareUnit[data.timestamp])
          const oldShareUnitPrice = Number(analytics.shareUnit[dataSet[Math.max(0, index - 721)].timestamp])
          const apy = (shareUnitPrice / oldShareUnitPrice - 1) * 12
          return { ...data, apy }
        })
        .filter((_, index) => !((index - (dataSet.length % 24)) % 24))
    }
  }, [analytics, strategy, timeframe])

  const domain = useCallback((values: Array<number>) => {
    const minValue = Math.min(...values)
    const maxValue = Math.max(...values)
    const range = maxValue - minValue
    const scale = Math.pow(10, Math.floor(Math.log10(range)) - 1) || 1
    const roundedMinValue = Math.floor(minValue / scale) * scale
    return [roundedMinValue.toString(), 'auto']
  }, [])

  return (
    <GrayElement col className='mt-4 h-fit p-6'>
      <Box spaced className='w-full'>
        <MainText heading className='pt-1 text-2xl'>
          HISTORICAL RATE
        </MainText>
        <ButtonGroup>
          <MainButton
            onClick={() => setTimeframe('daily')}
            size='sm'
            className={`${timeframe === 'daily' && 'bg-gray-700'}`}
          >
            <MainText heading>DAILY</MainText>
          </MainButton>
          <MainButton
            onClick={() => setTimeframe('hourly')}
            size='sm'
            className={`${timeframe === 'hourly' && 'bg-gray-700'}`}
          >
            <MainText heading>HOURLY</MainText>
          </MainButton>
        </ButtonGroup>
      </Box>
      <div className={`gradient-${strategy.type.toLowerCase()}-b my-6 h-[1px] w-full`} />
      <Box center ref={ref} className='h-[250px] w-full'>
        {isLoading ? (
          <Spinner />
        ) : (
          <ComposedChart
            width={width}
            height={height}
            data={data}
            margin={{
              top: 10,
              right: 30,
              left: 30,
              bottom: 0
            }}
          >
            <CartesianGrid stroke='#404040' strokeDasharray='3 3' />

            <XAxis
              dataKey='timestamp'
              interval={0}
              tick={({ x, y, payload }) => {
                const className =
                  (timeframe === 'hourly' && (payload.index + 2) % 4) ||
                  (timeframe === 'daily' && (!payload.index || payload.index === data.length - 1))
                    ? 'hidden'
                    : ''

                return (
                  <text x={x} y={y} dy={20} fontFamily='VCR' textAnchor='middle' fill='#ddd' className={className}>
                    {getXAxisLabel(payload.value)}
                  </text>
                )
              }}
            />

            <YAxis
              yAxisId='tvl'
              dataKey='tvl'
              domain={domain(data.map(({ tvl }) => tvl))}
              interval={0}
              stroke='#707070'
              strokeDasharray='0'
              tick={({ x, y, payload }) => {
                return (
                  <text x={x} y={y} dx={-40} dy={5} fontFamily='VCR' textAnchor='middle' fill='#777'>
                    {formatCurrency(payload.value)}
                  </text>
                )
              }}
            />
            <Area yAxisId='tvl' type='monotone' dataKey='tvl' stroke='#777' fill='#555' />

            <YAxis yAxisId='apy' dataKey='apy' hide domain={domain(data.map(({ apy }) => apy))} />
            <Line yAxisId='apy' dot={false} type='monotone' dataKey='apy' stroke='green' />

            {strategy.type === 'LP' && (
              <>
                <YAxis yAxisId='price' dataKey='price' hide domain={domain(data.map(({ price }) => price!))} />
                <Line yAxisId='price' dot={false} type='monotone' dataKey='price' stroke='#60a5fa' />
              </>
            )}

            <Tooltip
              content={(props) => {
                const [tvl, apy, price] = props.payload as Array<any>

                return (
                  <GrayElement col className='items-start rounded-xl border-1 border-gray-500 p-3'>
                    {tvl && (
                      <>
                        <MainText gradient>{formatEpochToShortDate(tvl.payload.timestamp)}</MainText>
                        <MainText heading>TVL: {formatCurrency(tvl.payload.tvl)}</MainText>
                        <MainText heading className='text-green-600'>
                          APY: {formatPercentage(apy.payload.apy)}
                        </MainText>
                        {!!price && (
                          <MainText heading className='text-blue-400'>
                            Price: {formatCurrency(price.payload.price)}
                          </MainText>
                        )}
                      </>
                    )}
                  </GrayElement>
                )
              }}
            />
          </ComposedChart>
        )}
      </Box>
    </GrayElement>
  )
}
