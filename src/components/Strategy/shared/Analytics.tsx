import { useDimensions } from '@/hooks/useDimensions'
import { formatCurrency } from '@/misc'
import { useCallback, useMemo, useRef, useState } from 'react'
import { VictoryArea, VictoryAxis, VictoryChart, VictoryTooltip, VictoryVoronoiContainer } from 'victory'
import { ButtonGroup, Spinner } from '@nextui-org/react'
import { Box, DarkElement, MainButton, MainText } from '@/components/Layout'
import { useAnalytics } from '@/hooks/api'
import { theme } from '@/styles/charts'
import { Strategy } from '@/types'

type Metric = 'price' | 'tvl'

interface AnalyticsProps {
  strategy: Strategy
}

export const Analytics = ({ strategy }: AnalyticsProps) => {
  const { data: analytics, isLoading } = useAnalytics(strategy.address)

  const [metrics, setMetrics] = useState<Metric>('tvl')
  const ref = useRef<HTMLHeadingElement>(null)

  const { height, width } = useDimensions(ref)

  const getXAxisLabel = useCallback((timestamp: string) => {
    const date = new Date(Number(timestamp))
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    })
  }, [])

  const data = useMemo(() => {
    const elements = analytics?.[metrics] || []
    return Object.entries(elements).map(([timestamp, price]) => ({ x: timestamp, y: price }))
  }, [analytics, metrics])

  return (
    <DarkElement col className='mt-2 h-fit'>
      <Box spaced className='w-full'>
        <MainText heading className='pt-1 text-2xl'>
          Historical Rate
        </MainText>
        <ButtonGroup>
          <MainButton onClick={() => setMetrics('tvl')} className={`${metrics === 'tvl' && 'bg-gray-700'}`}>
            TVL
          </MainButton>
          {strategy.type === 'LP' && (
            <MainButton onClick={() => setMetrics('price')} className={`${metrics === 'price' && 'bg-gray-700'}`}>
              Price
            </MainButton>
          )}
        </ButtonGroup>
      </Box>
      <div className='gradient-border-b my-6 h-[1px] w-full' />
      <Box center ref={ref} className='h-[250px] w-full'>
        {isLoading ? (
          <Spinner />
        ) : (
          <VictoryChart
            animate={{ onLoad: { duration: 500 } }}
            containerComponent={
              <VictoryVoronoiContainer
                labels={({ datum }) => {
                  const date = new Date(Number(datum.x)).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                    hour: 'numeric',
                    minute: 'numeric',
                    hour12: true
                  })
                  const data = formatCurrency(datum.y)

                  return `${date}\n${metrics === 'price' ? 'Price' : metrics.toUpperCase()}: ${data}`
                }}
                labelComponent={<VictoryTooltip dy={-5} constrainToVisibleArea />}
              />
            }
            height={height}
            width={width}
            padding={{ top: 10, bottom: 25, left: 70, right: 20 }}
            theme={theme}
          >
            <VictoryAxis
              animate={false}
              tickFormat={(value, index) => (!((index + 2) % 4) ? getXAxisLabel(value) : null)}
              tickValues={data.map(({ x }) => x)}
            />
            <VictoryAxis
              animate={false}
              dependentAxis
              tickFormat={(value, index) => (!(index % 3) ? formatCurrency(value) : null)}
              tickValues={data.map(({ y }) => y)}
            />
            <VictoryArea data={data} interpolation='monotoneX' />
          </VictoryChart>
        )}
      </Box>
    </DarkElement>
  )
}
