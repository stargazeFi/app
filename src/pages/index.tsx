import { useAccount, useBalance } from '@starknet-react/core'
import { useCallback, useContext, useMemo, useState } from 'react'
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Image,
  Input,
  Pagination,
  Spinner
} from '@nextui-org/react'
import { Close, KeyboardArrowDown, KeyboardArrowUp, SwapVert } from '@mui/icons-material'
import ErrorPage from '@/components/ErrorPage'
import { Box, Container, DarkElement, MainText } from '@/components/Layout'
import { formatPercentage, formatCurrency, formatToDecimal, getTokenIcon } from '@/misc'
import { useStrategies } from '@/hooks/api'
import { Strategy } from '@/types'
import Link from 'next/link'
import { TokenContext, TokenContextItem } from '@/contexts'

type Order = 'decreasing' | 'increasing'
type Sort = 'wallet' | 'deposited' | 'APY' | 'daily' | 'TVL' | 'stargazeTVL'

const RESULTS_PER_PAGE = 7

const FILTERS: { sort: Sort; flex: string }[] = [
  { sort: 'wallet', flex: 'flex-[4]' },
  { sort: 'deposited', flex: 'flex-[4]' },
  { sort: 'APY', flex: 'flex-[3]' },
  { sort: 'daily', flex: 'flex-[4]' },
  { sort: 'TVL', flex: 'flex-[4]' }
]

const Strategy = ({
  index,
  address,
  strategy: { name, protocol, poolToken, type, APY, TVL, stargazeTVL, daily, tokens, strategyAddress },
  tokensList
}: {
  index: number
  address: string | undefined
  strategy: Strategy
  tokensList: TokenContextItem[]
}) => {
  const { data: balance } = useBalance({
    token: poolToken,
    address,
    enabled: !!address,
    watch: true
  })

  const TVLComponent = useCallback(
    ({ className }: { className: string }) => {
      return (
        <Box col className={`ml-6 items-end ${FILTERS[4].flex} ${className}`}>
          <MainText heading className='text-xl font-light text-gray-600 lg:hidden'>
            TVL
          </MainText>
          <MainText gradient className='text-lg'>
            {formatCurrency(stargazeTVL)}
          </MainText>
          <MainText className='text-sm text-gray-600'>{formatCurrency(TVL)}</MainText>
        </Box>
      )
    },
    [TVL, stargazeTVL]
  )

  return (
    <>
      {index !== 0 && <div className='my-3 h-[0.1px] w-full bg-gray-700' />}
      <Link href={`/strategy/${strategyAddress}`}>
        <Box col className='w-full cursor-pointer rounded p-2 hover:bg-gray-800/50 lg:flex-row'>
          <Box className='flex-[1]'>
            <Box center>
              <Box center className='w-[64px]'>
                <Image className='z-20' src={getTokenIcon(tokens[0], tokensList)} width={40} height={40} />
                {tokens[1] && (
                  <Box className='-ml-5'>
                    <Image src={getTokenIcon(tokens[1], tokensList)} width={40} height={40} />
                  </Box>
                )}
              </Box>
              <Box col className='ml-4 items-start'>
                <MainText gradient heading className='text-xl'>
                  {name}
                </MainText>
                <Box>
                  <Box center className='w-fit rounded bg-gray-700 px-2 py-1 uppercase'>
                    <MainText className='text-xs'>{protocol}</MainText>
                  </Box>
                  <Box
                    center
                    className={`ml-2 w-fit rounded ${
                      type === 'LP' ? 'bg-purple-700' : 'bg-green-700'
                    } px-2 py-1 uppercase`}
                  >
                    <MainText className='text-xs'>{type}</MainText>
                  </Box>
                </Box>
              </Box>
            </Box>
            <TVLComponent className='lg:hidden' />
          </Box>
          <Box className='mt-6 flex-[3] items-start lg:mt-0 lg:items-center lg:justify-center'>
            <Box col className={`ml-6 items-start justify-end lg:items-end ${FILTERS[0].flex}`}>
              <MainText heading className='text-xl font-light text-gray-600 lg:hidden'>
                Wallet
              </MainText>
              <MainText gradient className={`text-lg ${type === 'Direct' ? 'lg:hidden' : ''}`}>
                {(type === 'LP' && formatToDecimal(balance?.formatted, 4)) ?? ''}
              </MainText>
            </Box>
            <Box col className={`ml-6 items-start justify-end ${FILTERS[1].flex} lg:flex-row`}>
              <MainText heading className='text-xl font-light text-gray-600 lg:hidden'>
                Deposited
              </MainText>
              <MainText gradient>??</MainText>
            </Box>
            <Box col className={`ml-6 items-end justify-end ${FILTERS[2].flex} lg:flex-row`}>
              <MainText heading className='text-xl font-light text-gray-600 lg:hidden'>
                APY
              </MainText>
              <MainText gradient>{formatPercentage(APY)}</MainText>
            </Box>
            <Box col className={`ml-6 items-end justify-end ${FILTERS[3].flex} lg:flex-row`}>
              <MainText heading className='text-xl font-light text-gray-600 lg:hidden'>
                Daily
              </MainText>
              <MainText gradient>{formatPercentage(daily)}</MainText>
            </Box>
            <TVLComponent className='hidden lg:flex' />
          </Box>
        </Box>
      </Link>
    </>
  )
}

export default function Strategies() {
  const [currentPage, setCurrentPage] = useState(1)
  const [filter, setFilter] = useState('')
  const [ordered, setOrdered] = useState<Order>('decreasing')
  const [sorted, setSorted] = useState('TVL')

  const { address } = useAccount()
  const { data: strategies, isError, isLoading } = useStrategies()
  const tokens = useContext(TokenContext)

  const portfolio = useMemo(
    () => [
      { title: 'Deposited', value: 0 },
      { title: 'Monthly Yield', value: 0 },
      { title: 'Daily Yield', value: 0 },
      { title: 'AVG. APY', value: 0 }
    ],
    []
  )

  const displayedStrategies = useMemo(
    () =>
      (strategies || [])
        .filter(
          ({ name, protocol, tokens }) =>
            !filter ||
            name.match(new RegExp(filter, 'i')) ||
            protocol.match(new RegExp(filter, 'i')) ||
            tokens[0].match(new RegExp(filter, 'i')) ||
            (tokens[1] || '').match(new RegExp(filter, 'i'))
        )
        // @ts-expect-error ts bitching for no reason
        .sort((a, b) => (ordered === 'increasing' ? a[sorted] - b[sorted] : b[sorted] - a[sorted])),
    [filter, ordered, sorted, strategies]
  )

  const totalPages = useMemo(
    () => Math.ceil(displayedStrategies.length / RESULTS_PER_PAGE),
    [displayedStrategies.length]
  )

  if (isError) {
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
                <MainText gradient className='text-xl'>
                  {index !== 3 ? formatCurrency(value) : formatPercentage(value)}
                </MainText>
              </Box>
            ))}
          </Box>
        </Box>
        <Box col center className='mt-6 md:mt-0 md:items-end'>
          <MainText gradient heading className='mb-2 text-2xl lg:text-3xl'>
            Stargaze
          </MainText>
          <Box className='w-full justify-evenly'>
            {!isLoading && strategies && (
              <>
                <Box col className='items-start md:ml-6 md:items-end'>
                  <MainText heading className='text-xl font-light text-gray-600'>
                    TVL
                  </MainText>
                  <MainText gradient className='text-xl'>
                    {formatCurrency(strategies.reduce((acc, it) => acc + it.stargazeTVL, 0))}
                  </MainText>
                </Box>
                <Box col className='items-start md:ml-6 md:items-end'>
                  <MainText heading className='text-xl font-light text-gray-600'>
                    Strategies
                  </MainText>
                  <MainText gradient className='text-xl'>
                    {strategies.length}
                  </MainText>
                </Box>
              </>
            )}
          </Box>
        </Box>
      </DarkElement>

      <DarkElement col spaced className='mt-2 p-6'>
        <Box spaced className='w-full'>
          <div className='max-w-sm flex-[1]'>
            <Input
              autoComplete='off'
              size='sm'
              variant='bordered'
              placeholder='Search...'
              isClearable
              value={filter}
              endContent={<Close className='text-gray-500' />}
              classNames={{
                input: 'text-amber-50 text-md mr-6',
                inputWrapper: 'bg-black/60 border border-gray-500'
              }}
              onChange={(e) => {
                setFilter(e.target.value)
                setCurrentPage(1)
              }}
              onClear={() => {
                setFilter('')
                setCurrentPage(1)
              }}
            />
          </div>
          <Box className='ml-6 lg:hidden'>
            <Dropdown
              type='menu'
              classNames={{
                base: 'child:bg-black border border-gray-700 rounded-xl'
              }}
            >
              <DropdownTrigger>
                <Button
                  radius='sm'
                  variant='bordered'
                  className='flex h-full items-center justify-center border border-gray-500 bg-black/60'
                >
                  <MainText gradient>Sort by:</MainText>
                  <MainText gradient heading className='text-lg'>
                    {sorted}
                  </MainText>
                  <Box center>
                    <KeyboardArrowDown fontSize='inherit' className='text-amber-50' />
                  </Box>
                </Button>
              </DropdownTrigger>
              <DropdownMenu onAction={(sorted) => setSorted(sorted as Sort)}>
                {FILTERS.map(({ sort }) => (
                  <DropdownItem key={sort} variant='bordered' className='border-none'>
                    <MainText heading gradient className='text-lg'>
                      {sort}
                    </MainText>
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
          </Box>
          <Box spaced className='hidden flex-[3] items-center lg:flex'>
            {FILTERS.map(({ sort, flex }, index) => (
              <Box key={index} className={`${flex} ml-6 justify-end`}>
                <button
                  className='flex cursor-pointer'
                  onClick={() => {
                    if (sorted !== sort) {
                      setSorted(sort)
                      setOrdered('decreasing')
                    } else {
                      setOrdered(ordered === 'increasing' ? 'decreasing' : 'increasing')
                    }
                  }}
                >
                  <MainText gradient heading className='text-xl'>
                    {sort}
                  </MainText>
                  <Box center className='ml-1 h-6'>
                    {sorted !== sort ? (
                      <SwapVert fontSize='inherit' className='text-amber-50' />
                    ) : ordered === 'decreasing' ? (
                      <KeyboardArrowDown fontSize='inherit' className='text-amber-50' />
                    ) : (
                      <KeyboardArrowUp fontSize='inherit' className='text-amber-50' />
                    )}
                  </Box>
                </button>
              </Box>
            ))}
          </Box>
        </Box>
        <div className='gradient-border-b my-6 h-[1px] w-full' />
        <Box col>
          {isLoading ? (
            <Spinner size='lg' className='my-10' />
          ) : displayedStrategies.length ? (
            displayedStrategies
              .slice(RESULTS_PER_PAGE * (currentPage - 1), RESULTS_PER_PAGE * currentPage)
              .map((strategy, index) => (
                <Strategy index={index} key={index} address={address} strategy={strategy} tokensList={tokens} />
              ))
          ) : (
            <>
              <MainText gradient heading className='text-2xl'>
                No strategies found
              </MainText>
              <Box center className='mb-4'>
                <MainText gradient className='text-sm'>
                  Try clearing your filters or changing your search term.
                </MainText>
              </Box>
            </>
          )}
        </Box>
      </DarkElement>

      {totalPages !== 1 && (
        <Box center className='mt-6 pr-6 lg:justify-end'>
          <Pagination
            page={currentPage}
            onChange={setCurrentPage}
            variant='bordered'
            showControls
            total={totalPages}
            initialPage={1}
            classNames={{
              prev: `${currentPage === 1 ? 'child:text-transparent' : 'child:text-white'}`,
              next: `${currentPage === totalPages ? 'child:text-transparent' : 'child:text-white'}`,
              item: 'border border-gray-700 text-white !bg-transparent hover:border-gray-500',
              cursor: 'bg-transparent border border-white'
            }}
          />
        </Box>
      )}
    </Container>
  )
}
