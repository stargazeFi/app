import { useMemo, useState } from 'react'
import { Image, Input } from '@nextui-org/react'
import { Close, KeyboardArrowDown, KeyboardArrowUp, Search, SwapVert } from '@mui/icons-material'
import { Box, Container } from '@/components/Layout'
import { MainText } from '@/components/Text'
import { formatAPY, formatCurrency } from '@/misc/format'

type Order = 'decreasing' | 'increasing'
type Sort = 'wallet' | 'deposited' | 'APY' | 'daily' | 'TVL' | 'stargazeTVL'

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

const Strategy = ({
  index,
  strategy: { name, protocol, APY, TVL, stargazeTVL, daily, tokens, wallet, deposited }
}: StrategyProps) => (
  <>
    {index !== 0 && <div className='my-3 h-[0.1px] w-full bg-gray-700' />}
    <Box className='w-full cursor-pointer rounded p-2 hover:bg-gray-950'>
      <Box className='flex-[1]'>
        <Box center className='w-[64px]'>
          <Image className='z-20' src={`/assets/tokens/${tokens[0]}.svg`} width={40} height={40} />
          {tokens[1] && (
            <Box className='-ml-5'>
              <Image src={`/assets/tokens/${tokens[1]}.svg`} width={40} height={40} />
            </Box>
          )}
        </Box>
        <Box col className='ml-4 items-start'>
          <MainText heading size='xl'>
            {name}
          </MainText>
          <Box center className='w-fit rounded bg-gray-700 px-2 py-1 uppercase'>
            <MainText size='xs'>{protocol}</MainText>
          </Box>
        </Box>
      </Box>
      <Box center className='flex-[3]'>
        <Box className={`ml-6 justify-end ${FILTERS[0].flex}`}>
          <MainText size='lg'>{wallet}</MainText>
        </Box>
        <Box className={`ml-6 justify-end ${FILTERS[1].flex}`}>
          <MainText size='lg'>{deposited}</MainText>
        </Box>
        <Box className={`ml-6 justify-end ${FILTERS[2].flex}`}>
          <MainText size='lg'>{formatAPY(APY)}</MainText>
        </Box>
        <Box className={`ml-6 justify-end ${FILTERS[3].flex}`}>
          <MainText size='lg'>{formatAPY(daily)}</MainText>
        </Box>
        <Box col className={`ml-6 items-end ${FILTERS[4].flex}`}>
          <MainText size='lg'>{formatCurrency(stargazeTVL)}</MainText>
          <MainText size='xs' className='from-gray-600 to-gray-700'>
            {formatCurrency(TVL)}
          </MainText>
        </Box>
      </Box>
    </Box>
  </>
)

export default function Strategies() {
  const [filter, setFilter] = useState('')
  const [ordered, setOrdered] = useState<Order>('decreasing')
  const [sorted, setSorted] = useState<Sort | undefined>()

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
      wallet: 1,
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
      wallet: 123,
      deposited: 43267,
      APY: 0.48,
      daily: 0.000032178321,
      TVL: 23828932,
      stargazeTVL: 123321
    },
    {
      name: 'ETH-USDC v2 LBP 0.5%/0.005%',
      protocol: 'ekubo',
      tokens: ['eth', 'usdc'],
      wallet: 12,
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
        .sort((a, b) => (!sorted ? 0 : ordered === 'increasing' ? a[sorted] - b[sorted] : b[sorted] - a[sorted])),
    [filter, ordered, sorted, strategies]
  )

  return (
    <Container>
      <Box col className='justify-between rounded-xl bg-black/60 p-6 md:flex-row'>
        <Box col center className='md:items-start'>
          <MainText heading size='2xl' className='mb-2'>
            Portfolio
          </MainText>
          <Box className='w-full justify-between px-4 md:p-0'>
            {portfolio.map(({ title, value }, index) => (
              <Box key={index} col className='items-start md:mr-6'>
                <MainText heading size='xl' className='from-gray-600 to-gray-700 font-light'>
                  {title}
                </MainText>
                <MainText size='xl'>{index !== 3 ? formatCurrency(value) : formatAPY(value)}</MainText>
              </Box>
            ))}
          </Box>
        </Box>
        <Box col center className='mt-6 md:mt-0 md:items-end'>
          <MainText heading size='2xl' className='mb-2'>
            Platform
          </MainText>
          <Box className='w-full justify-evenly'>
            {platform.map(({ title, value }, index) => (
              <Box key={index} col className='items-start md:ml-6 md:items-end'>
                <MainText heading size='xl' className='from-gray-600 to-gray-700 font-light'>
                  {title}
                </MainText>
                <MainText size='xl'>{!index ? formatCurrency(value) : value}</MainText>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
      <Box col className='mt-2 justify-between rounded-xl bg-black/60 p-6'>
        <Box className='w-full'>
          <div className='flex-[1]'>
            <Input
              size='sm'
              variant='bordered'
              placeholder='Search...'
              isClearable
              value={filter}
              endContent={!filter ? <Search className='text-gray-500' /> : <Close className='text-gray-500' />}
              classNames={{
                input: 'text-amber-50 text-md mr-6',
                inputWrapper: 'bg-black/60 border border-gray-500'
              }}
              onChange={(e) => setFilter(e.target.value)}
              onClear={() => setFilter('')}
            />
          </div>
          <Box center className='flex-[3] justify-between'>
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
                  <MainText heading size='xl'>
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
            displayedStrategies.map((strategy, index) => <Strategy index={index} key={index} strategy={strategy} />)
          ) : (
            <>
              <MainText heading size='2xl'>
                No strategies found
              </MainText>
              <Box center className='mb-4'>
                <MainText size='sm'>Try clearing your filters or changing your search term.</MainText>
              </Box>
            </>
          )}
        </Box>
      </Box>
    </Container>
  )
}
