import React, { useCallback, useMemo, useState } from 'react'
import Link from 'next/link'
import { AppLoader } from '@/components/AppLoader'
import { ErrorPage } from '@/components/ErrorPage'
import { AssetFilter, ProtocolFilter, StrategyCard, StrategyFilter } from '@/components/Strategies'
import { useBalances, useDeposits } from '@/hooks'
import { useStrategies, useTokens } from '@/hooks/api'
import { useAccount } from '@starknet-react/core'
import { KeyboardArrowDown } from '@mui/icons-material'
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownSection, DropdownTrigger } from '@nextui-org/react'
import { Box, Container, MainButton, MainText } from '@/components/Layout'

type Sort = 'DEFAULT' | 'WALLET' | 'APY' | 'DAILY' | 'TVL'
const SortOptions = ['DEFAULT', 'WALLET', 'APY', 'DAILY', 'TVL']
export const ASSET_FILTER = new Set(['ETH', 'WBTC', 'USDC'])
export const PROTOCOL_FILTER = new Set(['ekubo', 'jediswap', 'sithswap'])
export const STRATEGY_FILTER = new Set(['LP', 'Range'])

export default function Strategies() {
  const { address } = useAccount()

  const [assetFilter, setAssetFilter] = useState<typeof ASSET_FILTER>(new Set())
  const [currentDropdown, setCurrentDropdown] = useState<'assets' | 'protocols' | 'strategies' | 'sort' | undefined>()
  const [protocolFilter, setProtocolFilter] = useState<typeof PROTOCOL_FILTER>(new Set())
  const [sorted, setSorted] = useState<Sort>('DEFAULT')
  const [strategyFilter, setStrategyFilter] = useState<typeof STRATEGY_FILTER>(new Set())

  const { data: strategies, isError: strategiesError, isLoading: strategiesLoading } = useStrategies()
  const { data: tokens, isLoading: tokensLoading } = useTokens()

  const { data: balances } = useBalances(address)
  const { data: deposits } = useDeposits(address)

  const handleSave = useCallback(
    () => (document.querySelector('[aria-haspopup="true"][aria-expanded="true"]') as HTMLElement).click(),
    []
  )

  const displayedStrategies = useMemo(
    () =>
      (strategies || [])
        .filter((strategy) => {
          const a = tokens?.find(({ l2_token_address }) => strategy.tokens[0] === l2_token_address)
          const b = tokens?.find(({ l2_token_address }) => strategy.tokens[1] === l2_token_address)
          return (
            (!assetFilter.size || !a || assetFilter.has(a.symbol) || !b || assetFilter.has(b.symbol)) &&
            (!protocolFilter.size || protocolFilter.has(strategy.protocol)) &&
            (!strategyFilter.size || strategyFilter.has(strategy.type))
          )
        })
        .sort((lhs, rhs) => {
          switch (sorted) {
            case 'WALLET':
              const b = (rhs.asset && balances[rhs.asset]?.formatted) || 0
              const a = (lhs.asset && balances[lhs.asset]?.formatted) || 0
              return Number(b) - Number(a)
            case 'TVL':
              return Number(rhs.TVL) - Number(lhs.TVL)
            case 'DAILY':
              return Number(rhs.dailyAPY.slice(0, -1)) - Number(lhs.dailyAPY.slice(0, -1))
            case 'APY':
              return Number(rhs.APY.slice(0, -1)) - Number(lhs.APY.slice(0, -1))
            default:
              return Number(deposits[rhs.address]?.value || 0) - Number(deposits[lhs.address]?.value || 0)
          }
        }),
    [assetFilter, balances, deposits, protocolFilter, sorted, strategies, strategyFilter, tokens]
  )

  const isFetching = useMemo(() => strategiesLoading || tokensLoading, [strategiesLoading, tokensLoading])

  if (strategiesError) {
    return <ErrorPage />
  }

  return (
    <Container className='max-w-[1400px]'>
      <Box center>
        <Dropdown
          type='menu'
          closeOnSelect={false}
          onClose={() => setCurrentDropdown(undefined)}
          onOpenChange={() => setCurrentDropdown('strategies')}
          placement='bottom-start'
          shouldCloseOnInteractOutside={(e) => {
            const ed = document.querySelector('[aria-haspopup="true"][aria-expanded="true"]') as HTMLElement
            if (ed && ed !== e) ed.click()
            return false
          }}
          classNames={{ content: 'p-0 bg-[#191919] border border-gray-800' }}
        >
          <DropdownTrigger aria-label='strategies'>
            <Button radius='sm' className='border border-gray-900 bg-palette1/60'>
              <Box center>
                <MainText heading>STRATEGY</MainText>
                {!!strategyFilter.size && (
                  <MainText heading className='ml-2'>
                    ({strategyFilter.size})
                  </MainText>
                )}
                <KeyboardArrowDown
                  className={`-mr-2 ml-2 text-amber-50 ${
                    currentDropdown === 'strategies' ? 'rotate-180' : ''
                  } transition`}
                />
              </Box>
            </Button>
          </DropdownTrigger>
          <DropdownMenu
            aria-label='strategies'
            onAction={(strategy) =>
              STRATEGY_FILTER.has(strategy as string) &&
              setStrategyFilter((state) => {
                const newState = new Set(state)
                state.has(strategy as string) ? newState.delete(strategy as string) : newState.add(strategy as string)
                return newState
              })
            }
          >
            <DropdownSection className='mb-0 mt-1'>
              {Array.from(STRATEGY_FILTER).map((item) => (
                <DropdownItem aria-label={item} key={item} variant='bordered' className='border-none'>
                  <StrategyFilter filter={strategyFilter} item={item} />
                </DropdownItem>
              ))}
            </DropdownSection>
            <DropdownSection className='mb-1'>
              <DropdownItem aria-label='toggle' variant='bordered' className='border-none'>
                <Button
                  onClick={handleSave}
                  radius='sm'
                  className='flex w-full items-center justify-center bg-palette1/60'
                >
                  <MainText heading className='text-white'>
                    SAVE
                  </MainText>
                </Button>
              </DropdownItem>
            </DropdownSection>
          </DropdownMenu>
        </Dropdown>

        <Dropdown
          type='menu'
          closeOnSelect={false}
          onClose={() => setCurrentDropdown(undefined)}
          onOpenChange={() => setCurrentDropdown('protocols')}
          placement='bottom-start'
          shouldCloseOnInteractOutside={(e) => {
            const ed = document.querySelector('[aria-haspopup="true"][aria-expanded="true"]') as HTMLElement
            if (ed && ed !== e) ed.click()
            return false
          }}
          classNames={{ content: 'p-0 bg-[#191919] border border-gray-800' }}
        >
          <DropdownTrigger aria-label='protocols' className='mx-2'>
            <Button radius='sm' className='border border-gray-900 bg-palette1/60'>
              <Box center>
                <MainText heading>PROTOCOL</MainText>
                {!!protocolFilter.size && (
                  <MainText heading className='ml-2'>
                    ({protocolFilter.size})
                  </MainText>
                )}
                <KeyboardArrowDown
                  className={`-mr-2 ml-2 text-amber-50 ${
                    currentDropdown === 'protocols' ? 'rotate-180' : ''
                  } transition`}
                />
              </Box>
            </Button>
          </DropdownTrigger>
          <DropdownMenu
            aria-label='protocols'
            onAction={(protocol) =>
              PROTOCOL_FILTER.has(protocol as string) &&
              setProtocolFilter((state) => {
                const newState = new Set(state)
                state.has(protocol as string) ? newState.delete(protocol as string) : newState.add(protocol as string)
                return newState
              })
            }
          >
            <DropdownSection className='mb-0 mt-1'>
              {Array.from(PROTOCOL_FILTER).map((item) => (
                <DropdownItem aria-label={item} key={item} variant='bordered' className='border-none'>
                  <ProtocolFilter filter={protocolFilter} item={item} />
                </DropdownItem>
              ))}
            </DropdownSection>
            <DropdownSection className='mb-1'>
              <DropdownItem aria-label='toggle' variant='bordered' className='border-none'>
                <Button
                  onClick={handleSave}
                  radius='sm'
                  className='flex w-full items-center justify-center bg-palette1/60'
                >
                  <MainText heading className='text-white'>
                    SAVE
                  </MainText>
                </Button>
              </DropdownItem>
            </DropdownSection>
          </DropdownMenu>
        </Dropdown>

        <Dropdown
          type='menu'
          closeOnSelect={false}
          onClose={() => setCurrentDropdown(undefined)}
          onOpenChange={() => setCurrentDropdown('assets')}
          shouldCloseOnInteractOutside={(e) => {
            const ed = document.querySelector('[aria-haspopup="true"][aria-expanded="true"]') as HTMLElement
            if (ed && ed !== e) ed.click()
            return false
          }}
          classNames={{ content: 'p-0 bg-[#191919] border border-gray-800' }}
        >
          <DropdownTrigger aria-label='assets'>
            <Button radius='sm' className='border border-gray-900 bg-palette1/60'>
              <MainText heading>ASSETS</MainText>
              {!!assetFilter.size && <MainText heading>({assetFilter.size})</MainText>}
              <KeyboardArrowDown
                className={`-mr-2 text-amber-50 ${currentDropdown === 'assets' ? 'rotate-180' : ''} transition`}
              />
            </Button>
          </DropdownTrigger>
          <DropdownMenu
            aria-label='assets'
            onAction={(asset) =>
              ASSET_FILTER.has(asset as string) &&
              setAssetFilter((state) => {
                const newState = new Set(state)
                state.has(asset as string) ? newState.delete(asset as string) : newState.add(asset as string)
                return newState
              })
            }
          >
            <DropdownSection className='mb-0 mt-1'>
              {Array.from(ASSET_FILTER).map((item) => (
                <DropdownItem aria-label={item} key={item} variant='bordered' className='border-none'>
                  <AssetFilter filter={assetFilter} item={item} />
                </DropdownItem>
              ))}
            </DropdownSection>
            <DropdownSection className='mb-1'>
              <DropdownItem aria-label='toggle' variant='bordered' className='border-none'>
                <Button
                  onClick={handleSave}
                  radius='sm'
                  className='flex w-full items-center justify-center bg-palette1/60'
                >
                  <MainText heading className='text-white'>
                    SAVE
                  </MainText>
                </Button>
              </DropdownItem>
            </DropdownSection>
          </DropdownMenu>
        </Dropdown>

        <Dropdown
          type='menu'
          onClose={() => setCurrentDropdown(undefined)}
          onOpenChange={() => setCurrentDropdown('sort')}
          placement='bottom-end'
          shouldCloseOnInteractOutside={(e) => {
            const ed = document.querySelector('[aria-haspopup="true"][aria-expanded="true"]') as HTMLElement
            if (ed && ed !== e) ed.click()
            return false
          }}
          classNames={{ content: 'p-0 bg-[#191919] border border-gray-800' }}
        >
          <DropdownTrigger aria-label='sort' className='ml-2'>
            <Button radius='sm' className='border border-gray-900 bg-palette1/60'>
              <MainText heading>{sorted === 'DEFAULT' ? 'SORT BY' : sorted}</MainText>
              <KeyboardArrowDown
                className={`-mr-2 text-amber-50 ${currentDropdown === 'sort' ? 'rotate-180' : ''} transition`}
              />
            </Button>
          </DropdownTrigger>
          <DropdownMenu aria-label='sort' onAction={(sorted) => setSorted(sorted as Sort)}>
            {SortOptions.map((sort) => (
              <DropdownItem aria-label={sort} key={sort} variant='bordered' className='border-none'>
                <MainText heading className='flex text-sm text-white'>
                  {sort}
                </MainText>
              </DropdownItem>
            ))}
          </DropdownMenu>
        </Dropdown>

        {(!!assetFilter.size || !!protocolFilter.size || !!strategyFilter.size) && (
          <MainButton
            onClick={() => {
              setAssetFilter(new Set())
              setProtocolFilter(new Set())
              setStrategyFilter(new Set())
            }}
            className='ml-2'
          >
            <MainText heading>CLEAR FILTERS</MainText>
          </MainButton>
        )}
      </Box>

      {isFetching ? (
        <AppLoader />
      ) : displayedStrategies.length ? (
        <Box center className='mt-8 flex-wrap'>
          {displayedStrategies.map((strategy, index) => (
            <Link key={index} href={`/strategy/${strategy.address}`}>
              <StrategyCard
                balance={balances[strategy?.asset || '']}
                deposit={deposits[strategy.address]}
                strategy={strategy}
              />
            </Link>
          ))}
        </Box>
      ) : (
        <Box center col className='h-[70vh]'>
          <MainText gradient heading className='text-2xl'>
            NO STRATEGY FOUND
          </MainText>
          <Box center className='mb-4'>
            <MainText gradient className='text-sm'>
              Try adjusting your filters.
            </MainText>
          </Box>
        </Box>
      )}
    </Container>
  )
}
