import { useAccount } from '@starknet-react/core'
import React, { useEffect, useMemo } from 'react'
import { Skeleton } from '@nextui-org/react'
import { ErrorPage } from '@/components/ErrorPage'
import { Box, Container, DarkElement, MainText } from '@/components/Layout'
import { formatPercentage, formatCurrency } from '@/misc'
import { useDeposits, useStrategiesManager } from '@/hooks'
import { useStrategies } from '@/hooks/api'

export default function Portfolio() {
  const { address } = useAccount()

  const { data, isError: strategiesError, isLoading: strategiesLoading } = useStrategies()
  const { strategies, storeStrategies } = useStrategiesManager()
  useEffect(() => data && storeStrategies(data), [data, storeStrategies])

  const { data: deposits, isLoading: depositsLoading } = useDeposits(address)

  const stargazeTVL = useMemo(() => strategies.reduce((acc, it) => acc + Number(it.TVL), 0), [strategies])

  const portfolio = useMemo(
    () => [
      { title: 'Deposited', value: Object.values(deposits).reduce((acc, it) => acc + Number(it.value), 0) },
      { title: 'Monthly Yield', value: 0 },
      { title: 'Daily Yield', value: 0 },
      { title: 'AVG. APY', value: 0 }
    ],
    [deposits]
  )

  const isFetching = useMemo(() => !strategies.length && strategiesLoading, [strategies, strategiesLoading])

  if (strategiesError) {
    return <ErrorPage />
  }

  return (
    <Container>
      <DarkElement col spaced className='md:flex-row'>
        <Box col center className='md:items-start'>
          <MainText gradient heading className='mb-2 text-2xl lg:text-3xl'>
            Portfolio
          </MainText>
          <Box spaced className='w-full px-4 md:p-0'>
            {portfolio.map(({ title, value }, index) => (
              <Box key={index} col className='items-start md:mr-6'>
                <MainText heading className='text-xl font-light text-gray-600'>
                  {title}
                </MainText>
                {depositsLoading ? (
                  <Skeleton className='my-1 flex h-5 w-20 rounded-md' />
                ) : (
                  <MainText gradient className='text-xl'>
                    {index !== 3 ? formatCurrency(value) : formatPercentage(value)}
                  </MainText>
                )}
              </Box>
            ))}
          </Box>
        </Box>
        <Box col center className='mt-6 md:mt-0 md:items-end'>
          <MainText gradient heading className='mb-2 text-2xl lg:text-3xl'>
            Stargaze
          </MainText>
          <Box className='w-full justify-evenly'>
            <Box col className='items-start md:ml-6 md:items-end'>
              <MainText heading className='text-xl font-light text-gray-600'>
                TVL
              </MainText>
              {isFetching ? (
                <Skeleton className='my-1 flex h-5 w-24 rounded-md' />
              ) : (
                <MainText gradient className='text-xl'>
                  {formatCurrency(stargazeTVL)}
                </MainText>
              )}
            </Box>
            <Box col className='items-start md:ml-6 md:items-end'>
              <MainText heading className='text-xl font-light text-gray-600'>
                Strategies
              </MainText>
              {isFetching ? (
                <Skeleton className='my-1 flex h-5 w-12 rounded-md' />
              ) : (
                <MainText gradient className='text-xl'>
                  {strategies.length}
                </MainText>
              )}
            </Box>
          </Box>
        </Box>
      </DarkElement>
    </Container>
  )
}
