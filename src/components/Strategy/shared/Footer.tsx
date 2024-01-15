import { Box, GrayElement, MainText, SecondaryText, Tooltip } from '@/components/Layout'
import { DOCS_FEES_URL, formatPercentage } from '@/misc'
import { Strategy } from '@/types'
import { HelpOutline } from '@mui/icons-material'
import Link from 'next/link'

interface FooterProps {
  strategy: Strategy
}

export const Footer = ({ strategy }: FooterProps) => {
  return (
    <GrayElement col className='mt-6'>
      <Box spaced>
        <Box center>
          <MainText className='text-lg text-gray-300' heading>
            Deposit Fee
          </MainText>
          <Box className='ml-2 pb-1 text-small'>
            <Tooltip content='Charged by the underlying protocol, not Stargaze'>
              <HelpOutline fontSize='inherit' className='text-gray-300' />
            </Tooltip>
          </Box>
        </Box>
        <MainText className='text-sm'>{formatPercentage(strategy.depositFee)}</MainText>
      </Box>
      <Box spaced>
        <Box center>
          <MainText className='text-lg text-gray-300' heading>
            Withdrawal Fee
          </MainText>
          <Box className='ml-2 pb-1 text-small'>
            <Tooltip content='Charged by the underlying protocol, not Stargaze'>
              <HelpOutline fontSize='inherit' className='text-gray-300' />
            </Tooltip>
          </Box>
        </Box>
        <MainText className='text-sm'>{formatPercentage(strategy.withdrawalFee)}</MainText>
      </Box>
      <Box spaced className='mt-4'>
        <Box center>
          <MainText className='text-lg text-gray-300' heading>
            Performance Fee
          </MainText>
        </Box>
        <MainText className='text-sm'>{formatPercentage(strategy.performanceFee)}</MainText>
      </Box>
      <SecondaryText>
        Stargaze Finance charges a performance fee on withdrawal. To learn more about the performance fee, you can refer
        to the{' '}
        <Link href={DOCS_FEES_URL} target='_blank' rel='noopener noreferrer' className='text-amber-100 underline'>
          documentation
        </Link>
        .
      </SecondaryText>
    </GrayElement>
  )
}
