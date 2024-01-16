import React from 'react'
import { useRouter } from 'next/router'
import { format } from 'timeago.js'
import { Box, DarkElement, MainText, Tooltip } from '@/components/Layout'
import { TokenIcon } from '@/components/TokenIcon'
import { formatCurrency, formatPercentage } from '@/misc'
import { Deposit, Strategy } from '@/types'
import { ArrowBack, HelpOutline } from '@mui/icons-material'
import { Image, Skeleton } from '@nextui-org/react'

interface HeaderProps {
  deposited?: Deposit
  depositLoading: boolean
  strategy: Strategy
}

export const Header = ({ deposited, depositLoading, strategy }: HeaderProps) => {
  const router = useRouter()

  return (
    <>
      <Box spaced>
        <Box center>
          <Box className='mr-4 text-2xl'>
            <button onClick={() => router.push('/')} className='flex items-center'>
              <ArrowBack fontSize='inherit' className='text-gray-200' />
            </button>
          </Box>
          <Box center>
            <Box center className='w-[64px]'>
              <TokenIcon address={strategy.tokens[0]} size={40} />
              <Box className='z-20 -ml-3'>
                <TokenIcon address={strategy.tokens[1]} size={40} />
              </Box>
            </Box>
            <MainText heading className='ml-2 pt-1 text-4xl'>
              {strategy.name}
            </MainText>
          </Box>
        </Box>
        <Box center>
          <Box center className='h-6 w-fit rounded bg-gray-700 px-2 py-1'>
            <Image src={`/assets/partners/${strategy.protocol}.svg`} width={80} height={20} />
          </Box>
          <Box
            center
            className={`ml-2 w-fit rounded ${strategy.type === 'LP' ? 'bg-purple-700' : 'bg-green-700'} px-2 uppercase`}
          >
            <MainText>{strategy.type}</MainText>
          </Box>
        </Box>
      </Box>

      <Box col className='mt-2 lg:flex-row'>
        <DarkElement spaced className='flex-[3]'>
          <Box col className='flex-1 items-start'>
            <MainText heading className='text-xl font-light'>
              TVL
            </MainText>
            <MainText gradient className='text-lg'>
              {formatCurrency(strategy.TVL)}
            </MainText>
            <Box center>
              <MainText className='text-sm text-gray-600'>{formatCurrency(strategy.protocolTVL)}</MainText>
              <Box className='ml-2 pb-0.5 text-small'>
                <Tooltip content='Pool TVL'>
                  <HelpOutline fontSize='inherit' className='text-gray-600' />
                </Tooltip>
              </Box>
            </Box>
          </Box>
          <Box col className='flex-1 items-start border-l border-gray-700 pl-6'>
            <MainText heading className='text-xl font-light'>
              APY
            </MainText>
            <MainText gradient className='text-lg'>
              {formatPercentage(strategy.APY)}
            </MainText>
          </Box>
          <Box col className='flex-1 items-start border-l border-gray-700 pl-6'>
            <MainText heading className='text-xl font-light'>
              Daily
            </MainText>
            <MainText gradient className='text-lg'>
              {formatPercentage(strategy.daily)}
            </MainText>
          </Box>
        </DarkElement>
        <DarkElement spaced className='mt-2 flex-[2] lg:ml-2 lg:mt-0'>
          <Box col className='flex-1 items-start lg:items-end lg:border-r lg:border-gray-700 lg:pr-6'>
            <MainText heading className='text-xl font-light'>
              Your deposit
            </MainText>
            {depositLoading ? (
              <Skeleton className='my-1 flex h-5 w-20 rounded-md' />
            ) : (
              <MainText gradient className='text-lg'>
                {formatCurrency(deposited?.value || 0)}
              </MainText>
            )}
          </Box>
          <Box col className='flex-1 items-start border-l border-gray-700 pl-6 lg:items-end lg:border-none'>
            <MainText heading className='text-xl font-light'>
              Last update
            </MainText>
            <MainText gradient className='text-lg'>
              {format(Number(strategy.lastUpdated) * 1000)}
            </MainText>
          </Box>
        </DarkElement>
      </Box>
    </>
  )
}
