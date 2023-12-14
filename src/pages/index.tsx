import { useMemo, useState } from 'react'
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Image,
  Input,
  Pagination
} from '@nextui-org/react'
import { Close, KeyboardArrowDown, KeyboardArrowUp, SwapVert } from '@mui/icons-material'
import { Box, Container } from '@/components/Layout'
import { MainText } from '@/components/Text'
import { formatAPY, formatCurrency } from '@/misc/format'

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

interface StrategyProps {
  index: number
  strategy: {
    name: string
    protocol: string
    tokens: string[]
    wallet: number
    deposited: number
    APY: number
    daily: number
    stargazeTVL: number
    TVL: number
  }
}

const TVLComponent = ({ className, stargazeTVL, TVL }: { className: string; stargazeTVL: number; TVL: number }) => {
  return (
    <Box col className={`ml-6 items-end ${FILTERS[4].flex} ${className}`}>
      <MainText heading size='xl' className='font-light text-gray-600 lg:hidden'>
        TVL
      </MainText>
      <MainText gradient size='lg'>
        {formatCurrency(stargazeTVL)}
      </MainText>
      <MainText size='xs' className='text-gray-600'>
        {formatCurrency(TVL)}
      </MainText>
    </Box>
  )
}

const Strategy = ({
  index,
  strategy: { name, protocol, APY, TVL, stargazeTVL, daily, tokens, wallet, deposited }
}: StrategyProps) => (
  <>
    {index !== 0 && <div className='my-3 h-[0.1px] w-full bg-gray-700' />}
    <Box col className='w-full cursor-pointer rounded p-2 hover:bg-gray-950 lg:flex-row'>
      <Box className='flex-[1]'>
        <Box>
          <Box center className='w-[64px]'>
            <Image className='z-20' src={`/assets/tokens/${tokens[0]}.svg`} width={40} height={40} />
            {tokens[1] && (
              <Box className='-ml-5'>
                <Image src={`/assets/tokens/${tokens[1]}.svg`} width={40} height={40} />
              </Box>
            )}
          </Box>
          <Box col className='ml-4 items-start'>
            <MainText gradient heading size='xl'>
              {name}
            </MainText>
            <Box center className='w-fit rounded bg-gray-700 px-2 py-1 uppercase'>
              <MainText gradient size='xs'>
                {protocol}
              </MainText>
            </Box>
          </Box>
        </Box>
        <TVLComponent stargazeTVL={stargazeTVL} TVL={TVL} className='lg:hidden' />
      </Box>
      <Box className='mt-6 flex-[3] items-start lg:mt-0 lg:items-center lg:justify-center'>
        <Box col className={`ml-6 items-start justify-end lg:items-end ${FILTERS[0].flex}`}>
          <MainText heading size='xl' className='font-light text-gray-600 lg:hidden'>
            Wallet
          </MainText>
          <MainText gradient size='lg'>
            {wallet}
          </MainText>
        </Box>
        <Box col className={`ml-6 items-start justify-end ${FILTERS[1].flex} lg:flex-row`}>
          <MainText heading size='xl' className='font-light text-gray-600 lg:hidden'>
            Deposited
          </MainText>
          <MainText gradient size='lg'>
            {deposited}
          </MainText>
        </Box>
        <Box col className={`ml-6 items-end justify-end ${FILTERS[2].flex} lg:flex-row`}>
          <MainText heading size='xl' className='font-light text-gray-600 lg:hidden'>
            APY
          </MainText>
          <MainText gradient size='lg'>
            {formatAPY(APY)}
          </MainText>
        </Box>
        <Box col className={`ml-6 items-end justify-end ${FILTERS[3].flex} lg:flex-row`}>
          <MainText heading size='xl' className='font-light text-gray-600 lg:hidden'>
            Daily
          </MainText>
          <MainText gradient size='lg'>
            {formatAPY(daily)}
          </MainText>
        </Box>
        <TVLComponent stargazeTVL={stargazeTVL} TVL={TVL} className='hidden lg:flex' />
      </Box>
    </Box>
  </>
)

export default function Strategies() {
  const [currentPage, setCurrentPage] = useState(1)
  const [filter, setFilter] = useState('')
  const [ordered, setOrdered] = useState<Order>('decreasing')
  const [sorted, setSorted] = useState('TVL')

  const portfolio = [
    { title: 'Deposited', value: 0 },
    { title: 'Monthly Yield', value: 0 },
    { title: 'Daily Yield', value: 0 },
    { title: 'AVG. APY', value: 0 }
  ]

  const platform = [
    { title: 'TVL', value: 0 },
    { title: 'Strategies', value: 0 }
  ]

  const strategies = [
    {
      name: 'USDC',
      protocol: 'ekubo',
      tokens: ['usdc'],
      wallet: 0,
      deposited: 1,
      APY: 0.09,
      daily: 0.9998,
      TVL: 23828932,
      stargazeTVL: 123321
    },
    {
      name: 'USDC',
      protocol: 'ekubo',
      tokens: ['usdc'],
      wallet: 1,
      deposited: 43267,
      APY: 0.48,
      daily: 0.000032178321,
      TVL: 23828932,
      stargazeTVL: 123321
    },
    {
      name: 'USDC',
      protocol: 'ekubo',
      tokens: ['usdc'],
      wallet: 2,
      deposited: 43267,
      APY: 0.48,
      daily: 0.000032178321,
      TVL: 23828932,
      stargazeTVL: 123321
    },
    {
      name: 'USDC',
      protocol: 'ekubo',
      tokens: ['usdc'],
      wallet: 3,
      deposited: 43267,
      APY: 0.48,
      daily: 0.000032178321,
      TVL: 23828932,
      stargazeTVL: 123321
    },
    {
      name: 'USDC',
      protocol: 'ekubo',
      tokens: ['usdc'],
      wallet: 4,
      deposited: 43267,
      APY: 0.48,
      daily: 0.000032178321,
      TVL: 23828932,
      stargazeTVL: 123321
    },
    {
      name: 'USDC',
      protocol: 'ekubo',
      tokens: ['usdc'],
      wallet: 5,
      deposited: 43267,
      APY: 0.48,
      daily: 0.000032178321,
      TVL: 23828932,
      stargazeTVL: 123321
    },
    {
      name: 'USDC',
      protocol: 'ekubo',
      tokens: ['usdc'],
      wallet: 6,
      deposited: 43267,
      APY: 0.48,
      daily: 0.000032178321,
      TVL: 23828932,
      stargazeTVL: 123321
    },
    {
      name: 'USDC',
      protocol: 'ekubo',
      tokens: ['usdc'],
      wallet: 7,
      deposited: 43267,
      APY: 0.48,
      daily: 0.000032178321,
      TVL: 23828932,
      stargazeTVL: 123321
    },
    {
      name: 'USDC',
      protocol: 'ekubo',
      tokens: ['usdc'],
      wallet: 8,
      deposited: 43267,
      APY: 0.48,
      daily: 0.000032178321,
      TVL: 23828932,
      stargazeTVL: 123321
    },
    {
      name: 'USDC',
      protocol: 'ekubo',
      tokens: ['usdc'],
      wallet: 9,
      deposited: 43267,
      APY: 0.48,
      daily: 0.000032178321,
      TVL: 23828932,
      stargazeTVL: 123321
    },
    {
      name: 'ETH-USDC v2 LBP',
      protocol: 'ekubo',
      tokens: ['eth', 'usdc'],
      wallet: 10,
      deposited: 2782,
      APY: 1.289,
      daily: 0.1,
      TVL: 233321,
      stargazeTVL: 1234
    }
  ]

  const displayedStrategies = useMemo(
    () =>
      strategies
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

  return (
    <Container>
      <Box col className='justify-between rounded-xl bg-black/60 p-6 md:flex-row'>
        <Box col center className='md:items-start'>
          <MainText gradient heading size='2xl' className='mb-2'>
            Portfolio
          </MainText>
          <Box className='w-full justify-between px-4 md:p-0'>
            {portfolio.map(({ title, value }, index) => (
              <Box key={index} col className='items-start md:mr-6'>
                <MainText heading size='xl' className='font-light text-gray-600'>
                  {title}
                </MainText>
                <MainText gradient size='xl'>
                  {index !== 3 ? formatCurrency(value) : formatAPY(value)}
                </MainText>
              </Box>
            ))}
          </Box>
        </Box>
        <Box col center className='mt-6 md:mt-0 md:items-end'>
          <MainText gradient heading size='2xl' className='mb-2'>
            Platform
          </MainText>
          <Box className='w-full justify-evenly'>
            {platform.map(({ title, value }, index) => (
              <Box key={index} col className='items-start md:ml-6 md:items-end'>
                <MainText heading size='xl' className='font-light text-gray-600'>
                  {title}
                </MainText>
                <MainText gradient size='xl'>
                  {!index ? formatCurrency(value) : value}
                </MainText>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
      <Box col className='mt-2 justify-between rounded-xl bg-black/60 p-6'>
        <Box className='w-full justify-between'>
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
                  <MainText gradient heading size='lg'>
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
                    <MainText heading gradient size='lg'>
                      {sort}
                    </MainText>
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
          </Box>
          <Box center className='hidden flex-[3] justify-between lg:flex'>
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
                  <MainText gradient heading size='xl'>
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
          {displayedStrategies.length ? (
            displayedStrategies
              .slice(RESULTS_PER_PAGE * (currentPage - 1), RESULTS_PER_PAGE * currentPage)
              .map((strategy, index) => <Strategy index={index} key={index} strategy={strategy} />)
          ) : (
            <>
              <MainText gradient heading size='2xl'>
                No strategies found
              </MainText>
              <Box center className='mb-4'>
                <MainText gradient size='sm'>
                  Try clearing your filters or changing your search term.
                </MainText>
              </Box>
            </>
          )}
        </Box>
      </Box>
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
