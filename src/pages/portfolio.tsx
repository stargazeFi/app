import React, { useEffect, useMemo } from 'react'
import Link from 'next/link'
import { useAccount } from '@starknet-react/core'
import { AppLoader } from '@/components/AppLoader'
import { ErrorPage } from '@/components/ErrorPage'
import { Box, Container } from '@/components/Layout'
import { ActiveStrategy, Analytics, Header } from '@/components/Portfolio'
import { useDeposits, useStrategiesManager } from '@/hooks'
import { useStrategies } from '@/hooks/api'

export default function Portfolio() {
  const { address } = useAccount()

  const { data: deposits, isLoading: depositsLoading } = useDeposits(address)
  const { data, isError: strategiesError, isLoading: strategiesLoading } = useStrategies()
  const { strategies, storeStrategies } = useStrategiesManager()
  useEffect(() => data && storeStrategies(data), [data, storeStrategies])

  const activeStrategies = useMemo(
    () =>
      strategies
        .filter(({ address }) => deposits[address]?.value)
        .sort((a, b) => Number(deposits[b.address].value) - Number(deposits[a.address].value)),
    [deposits, strategies]
  )

  const dailyReturns = useMemo(
    () =>
      activeStrategies.reduce(
        (dailyReturns, strategy) => {
          const deposit = deposits[strategy.address]
          dailyReturns[strategy.address] = Number(strategy.dailyAPY.slice(0, -1)) * Number(deposit!.value)
          return dailyReturns
        },
        {} as Record<string, number>
      ),
    [activeStrategies, deposits]
  )

  const isFetching = useMemo(
    () => (!strategies.length && strategiesLoading) || depositsLoading,
    [depositsLoading, strategies.length, strategiesLoading]
  )

  if (strategiesError) {
    return <ErrorPage />
  }

  return (
    <Container>
      <Header deposits={deposits} dailyReturns={dailyReturns} strategies={activeStrategies} />
      {isFetching ? (
        <AppLoader className='h-[60vh]' />
      ) : (
        !!activeStrategies.length && (
          <Box className='mt-6'>
            <Box col className='w-full'>
              {activeStrategies.map((strategy, index) => (
                <Link key={index} href={`/strategy/${strategy.address}`}>
                  <ActiveStrategy
                    dailyReturns={dailyReturns[strategy.address]}
                    deposit={deposits[strategy.address]}
                    strategy={strategy}
                  />
                </Link>
              ))}
            </Box>
            <Box className='ml-6'>
              <Analytics deposits={deposits} strategies={activeStrategies} />
            </Box>
          </Box>
        )
      )}
    </Container>
  )
}
