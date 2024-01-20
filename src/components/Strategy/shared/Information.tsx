import { Box, DarkElement, GrayElement, MainText, SecondaryText } from '@/components/Layout'
import { Analytics } from '@/components/Strategy'
import { Icon } from 'src/components/Tokens'
import { TokenContext } from '@/contexts'
import { usePrices } from '@/hooks/api'
import { explorerContractURL, formatTokenPrice, getTokenDescription, getTokenName } from '@/misc'
import { Strategy } from '@/types'
import { Link as LinkIcon, OpenInNew } from '@mui/icons-material'
import { useNetwork } from '@starknet-react/core'
import Link from 'next/link'
import { useCallback, useContext } from 'react'

interface InformationProps {
  strategy: Strategy
}

export const Information = ({ strategy }: InformationProps) => {
  const tokensList = useContext(TokenContext)

  const { chain } = useNetwork()

  const { data: prices } = usePrices()

  const tokenPrice = useCallback(
    (address: string) => prices?.find((price) => price.address === address)?.price,
    [prices]
  )

  return (
    <Box col className='flex-[3] lg:flex-[4]'>
      <DarkElement col className='h-fit'>
        <Box spaced className='w-full lg:flex-row'>
          <MainText heading className='pt-1 text-2xl'>
            Strategy
          </MainText>
          <Box center>
            <Link href={explorerContractURL(strategy.address, chain)} target='_blank' rel='noopener noreferrer'>
              <Box center className='w-fit rounded bg-gray-700 px-2 py-1 uppercase'>
                <MainText className='text-xs'>Strategy contract</MainText>
                <Box className='ml-2 text-small'>
                  <OpenInNew fontSize='inherit' className='text-gray-200' />
                </Box>
              </Box>
            </Link>
          </Box>
        </Box>
        <div className='gradient-border-b my-6 h-[1px] w-full' />
        <Box className='justify-start'>
          <SecondaryText>{strategy.description}</SecondaryText>
        </Box>
      </DarkElement>

      <Analytics strategy={strategy} />

      <DarkElement col className='mt-2 h-fit'>
        <Box spaced className='w-full'>
          <MainText heading className='pt-1 text-2xl'>
            Asset Details
          </MainText>
        </Box>
        <div className='gradient-border-b my-6 h-[1px] w-full' />
        <Box col center className='justify-start'>
          {strategy.tokens.map((address, index) => {
            const price = tokenPrice(address)

            return (
              <GrayElement col center key={index} className='w-full is-not-last-child:mb-6'>
                <Box spaced className='w-full'>
                  <Box center>
                    <Icon address={address} size={30} className='z-20' />
                    <MainText className='mx-4'>{getTokenName(address, tokensList)}</MainText>
                    {price && (
                      <Box center className='w-fit rounded bg-gray-700 px-2 uppercase'>
                        <MainText className='text-sm'>{formatTokenPrice(price)}</MainText>
                      </Box>
                    )}
                  </Box>
                  <Box center>
                    <Link href={explorerContractURL(address, chain)} target='_blank' rel='noopener noreferrer'>
                      <Box center className='w-fit rounded bg-gray-700 px-2 py-1 uppercase'>
                        <Box className='mr-2 text-small'>
                          <LinkIcon fontSize='inherit' className='text-gray-200' />
                        </Box>
                        <MainText className='text-xs'>Contract</MainText>
                      </Box>
                    </Link>
                  </Box>
                </Box>
                <Box className='mt-2 w-full'>
                  <SecondaryText className='mt-4'>{getTokenDescription(address, tokensList)}</SecondaryText>
                </Box>
              </GrayElement>
            )
          })}
        </Box>
      </DarkElement>
    </Box>
  )
}
