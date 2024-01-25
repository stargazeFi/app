import { Box, DarkElement, MainText, SecondaryText, Tooltip } from '@/components/Layout'
import { DOCS_FEES_URL, formatFee } from '@/misc'
import { Strategy } from '@/types'
import { HelpOutline } from '@mui/icons-material'
import Link from 'next/link'

interface FooterProps {
  strategy: Strategy
}

export const Footer = ({ strategy }: FooterProps) => {
  return (
    <DarkElement col className='mt-6'>
      <Box spaced>
        <Box center>
          <MainText className='text-lg text-gray-300' heading>
            DEPOSIT FEE
          </MainText>
          <Box className='ml-2 text-small'>
            <Tooltip content='Charged by the underlying protocol, not Stargaze'>
              <HelpOutline fontSize='inherit' className='text-gray-300' />
            </Tooltip>
          </Box>
        </Box>
        <Box center>
          <MainText heading className='text-sm'>
            {formatFee(strategy.depositFee)}
          </MainText>
        </Box>
      </Box>
      <Box spaced>
        <Box center>
          <MainText className='text-lg text-gray-300' heading>
            WITHDRAWAL FEE
          </MainText>
          <Box className='ml-2 text-small'>
            <Tooltip content='Charged by the underlying protocol, not Stargaze'>
              <HelpOutline fontSize='inherit' className='text-gray-300' />
            </Tooltip>
          </Box>
        </Box>
        <Box center>
          <MainText heading className='text-sm'>
            {formatFee(strategy.withdrawalFee)}
          </MainText>
        </Box>
      </Box>
      <Box spaced className='mt-4'>
        <Box center>
          <MainText className='text-lg text-gray-300' heading>
            PERFORMANCE FEE
          </MainText>
        </Box>
        <Box center>
          <MainText heading className='text-sm'>
            {formatFee(strategy.performanceFee)}
          </MainText>
        </Box>
      </Box>
      <SecondaryText>
        Stargaze Finance charges a performance fee on withdrawal. To learn more about the performance fee, you can refer
        to the{' '}
        <Link href={DOCS_FEES_URL} target='_blank' rel='noopener noreferrer' className='text-amber-100 underline'>
          documentation
        </Link>
        .
      </SecondaryText>
    </DarkElement>
  )
}
