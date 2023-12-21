import React, { useCallback, useContext, useMemo, useState } from 'react'
import { Button, Image, Input } from '@nextui-org/react'
import { format } from 'timeago.js'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { ArrowBack, HelpOutline, Link as LinkIcon, OpenInNew } from '@mui/icons-material'
import { Strategy } from '@/api'
import {
  Box,
  Container,
  DarkElement,
  GrayElement,
  MainButton,
  MainText,
  SecondaryText,
  Tooltip
} from '@/components/Layout'
import ErrorPage from '@/components/ErrorPage'
import AppLoader from '@/components/AppLoader'
import { useStrategies } from '@/hooks/api'
import { formatPercentage, formatCurrency } from '@/misc/format'
import { useAccount, useConnect, useNetwork } from '@starknet-react/core'
import { DOCS_FEES_URL } from '@/misc/constants'
import { TokenContext } from '@/contexts'
import { getTokenDescription, getTokenIcon, getTokenName } from '@/misc/tokens'

export default function Strategy() {
  const { isConnected } = useAccount()
  const { connect } = useConnect()
  const { chain } = useNetwork()
  const router = useRouter()

  const tokensList = useContext(TokenContext)

  const { id } = router.query

  const [amount, setAmount] = useState('0')
  const [mode, setMode] = useState<'deposit' | 'withdraw'>('deposit')

  const { data: strategies, isError, isLoading } = useStrategies()

  const strategy = useMemo(
    () => !isLoading && strategies!.find(({ strategyAddress }) => id === strategyAddress),
    [id, isLoading, strategies]
  )

  const {
    name,
    protocol,
    poolURL,
    description,
    depositFee,
    withdrawalFee,
    performanceFee,
    strategyAddress,
    vaultAddress,
    APY,
    daily,
    tokens,
    type,
    TVL,
    stargazeTVL,
    lastUpdate
  } = useMemo(() => (!isError && !isLoading && strategy) || ({} as Strategy), [isError, isLoading, strategy])

  const strategyContract = useMemo(
    () => (chain.testnet ? 'https://testnet.starkscan.co/' : 'https://starkscan.co/') + 'contract/' + strategyAddress,
    [chain.testnet, strategyAddress]
  )

  const tokenContract = useCallback(
    (address: string) =>
      (chain.testnet ? 'https://testnet.starkscan.co/' : 'https://starkscan.co/') + 'contract/' + address,
    [chain.testnet]
  )

  const vaultContract = useMemo(
    () => (chain.testnet ? 'https://testnet.starkscan.co/' : 'https://starkscan.co/') + 'contract/' + vaultAddress,
    [chain.testnet, vaultAddress]
  )

  const userBalance = useMemo(() => 0, [])

  if (isLoading) {
    return <AppLoader />
  }

  if (isError || strategy === undefined) {
    return <ErrorPage />
  }

  return (
    <Container>
      <Box spaced>
        <Box center>
          <Box className={`${tokens.length === 1 ? 'mr-2' : 'mr-4'} text-2xl`}>
            <button onClick={() => router.back()}>
              <ArrowBack fontSize='inherit' className='text-gray-200' />
            </button>
          </Box>
          <Box center>
            <Box center className='w-[64px]'>
              <Image className='z-20' src={getTokenIcon(tokens[0], tokensList)} width={40} height={40} />
              {tokens[1] && (
                <Box className='-ml-5'>
                  <Image src={getTokenIcon(tokens[1], tokensList)} width={40} height={40} />
                </Box>
              )}
            </Box>
            <MainText heading className='ml-2 pt-1 text-4xl'>
              {name}
            </MainText>
          </Box>
        </Box>
        <Box center>
          <Box center className='w-fit rounded bg-gray-700 px-2 uppercase'>
            <MainText>{protocol}</MainText>
          </Box>
          <Box
            center
            className={`ml-2 w-fit rounded ${type === 'LP' ? 'bg-purple-700' : 'bg-green-700'} px-2 uppercase`}
          >
            <MainText>{type}</MainText>
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
              {formatCurrency(stargazeTVL)}
            </MainText>
            <MainText className='text-sm text-gray-600'>{formatCurrency(TVL)}</MainText>
          </Box>
          <Box col className='flex-1 items-start border-l border-gray-700 pl-6'>
            <MainText heading className='text-xl font-light'>
              APY
            </MainText>
            <MainText gradient className='text-lg'>
              {formatPercentage(APY)}
            </MainText>
          </Box>
          <Box col className='flex-1 items-start border-l border-gray-700 pl-6'>
            <MainText heading className='text-xl font-light'>
              Daily
            </MainText>
            <MainText gradient className='text-lg'>
              {formatPercentage(daily)}
            </MainText>
          </Box>
        </DarkElement>
        <DarkElement spaced className='mt-2 flex-[2] lg:ml-2 lg:mt-0'>
          <Box col className='flex-1 items-start lg:items-end lg:border-r lg:border-gray-700 lg:pr-6'>
            <MainText heading className='text-xl font-light'>
              Your deposit
            </MainText>
            <MainText gradient className='text-lg'>
              {formatCurrency(123321)}
            </MainText>
          </Box>
          <Box col className='flex-1 items-start border-l border-gray-700 pl-6 lg:items-end lg:border-none'>
            <MainText heading className='text-xl font-light'>
              Last update
            </MainText>
            <MainText gradient className='text-lg'>
              {format(lastUpdate)}
            </MainText>
          </Box>
        </DarkElement>
      </Box>

      <Box className='mt-2 flex-col-reverse md:flex-row'>
        <Box col className='flex-[3] lg:flex-[4]'>
          <DarkElement col className='h-fit'>
            <Box col spaced className='w-full lg:flex-row'>
              <MainText heading className='pt-1 text-2xl'>
                Strategy
              </MainText>
              <Box center>
                <Link href={strategyContract} target='_blank' rel='noopener noreferrer'>
                  <Box center className='w-fit rounded bg-gray-700 px-2 py-1 uppercase'>
                    <MainText className='text-xs'>Strategy contract</MainText>
                    <Box className='ml-2 text-small'>
                      <OpenInNew fontSize='inherit' className='text-gray-200' />
                    </Box>
                  </Box>
                </Link>
                <Link href={vaultContract} target='_blank' rel='noopener noreferrer'>
                  <Box center className='ml-2 w-fit rounded bg-gray-700 px-2 py-1 uppercase'>
                    <MainText className='text-xs'>Vault contract</MainText>
                    <Box className='ml-2 text-small'>
                      <OpenInNew fontSize='inherit' className='text-gray-200' />
                    </Box>
                  </Box>
                </Link>
              </Box>
            </Box>
            <div className='gradient-border-b my-6 h-[1px] w-full' />
            <Box className='justify-start'>
              <SecondaryText>{description}</SecondaryText>
            </Box>
          </DarkElement>

          <DarkElement col className='mt-2 h-fit'>
            <Box spaced className='w-full'>
              <MainText heading className='pt-1 text-2xl'>
                Historical Rate
              </MainText>
            </Box>
            <div className='gradient-border-b my-6 h-[1px] w-full' />
            <Box center className='h-[100px] justify-start'>
              <SecondaryText>Coming soon</SecondaryText>
            </Box>
          </DarkElement>

          <DarkElement col className='mt-2 h-fit'>
            <Box spaced className='w-full'>
              <MainText heading className='pt-1 text-2xl'>
                Asset Details
              </MainText>
            </Box>
            <div className='gradient-border-b my-6 h-[1px] w-full' />
            <Box col center className='justify-start'>
              {tokens.map((address, index) => (
                <GrayElement col center key={index} className='w-full is-not-last-child:mb-6'>
                  <Box spaced className='w-full'>
                    <Box center>
                      <Image className='z-20' src={getTokenIcon(address, tokensList)} width={30} height={30} />
                      <MainText className='mx-4'>{getTokenName(address, tokensList)}</MainText>
                      {/* <Box center className='w-fit rounded bg-gray-700 px-2 uppercase'>
                        // TODO FETCH PRICE
                        <MainText className='text-sm'>$400</MainText>
                      </Box>*/}
                    </Box>
                    <Box center>
                      <Link href={tokenContract(address)} target='_blank' rel='noopener noreferrer'>
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
              ))}
            </Box>
          </DarkElement>
        </Box>

        <DarkElement col spaced className='mb-2 h-fit flex-[2] md:mb-0 md:ml-2'>
          <Box className='-mx-6 -mt-6'>
            <Box
              center
              className={`flex-1 cursor-pointer border-b ${mode === 'deposit' ? 'border-white' : 'border-gray-700'}`}
            >
              <button onClick={() => setMode('deposit')} className='h-[4.5rem] w-full'>
                <MainText>DEPOSIT</MainText>
              </button>
            </Box>
            <Box
              center
              className={`flex-1 cursor-pointer border-b ${mode === 'withdraw' ? 'border-white' : 'border-gray-700'}`}
            >
              <button onClick={() => setMode('withdraw')} className='h-[4.5rem] w-full'>
                <MainText>WITHDRAW</MainText>
              </button>
            </Box>
          </Box>
          <Box col className='pt-6'>
            <Box className='justify-end px-2'>
              <MainText className='text-xs'>Available: {userBalance}</MainText>
            </Box>
            <Box spaced className='mt-2'>
              <Box center className='mr-2 w-[80px] rounded-xl border-[0.5px] border-gray-400 bg-black/60'>
                <Image className='z-20' src={getTokenIcon(tokens[0], tokensList)} width={28} height={28} />
                {tokens[1] && (
                  <Box className='-ml-2'>
                    <Image src={getTokenIcon(tokens[1], tokensList)} width={28} height={28} />
                  </Box>
                )}
              </Box>
              <Input
                autoComplete='off'
                size='sm'
                variant='bordered'
                placeholder='0'
                value={amount}
                classNames={{
                  input: 'text-amber-50 text-md mr-6',
                  inputWrapper: 'bg-black/60 border border-gray-500'
                }}
                onChange={(e) => {
                  const { value } = e.target
                  if (!isNaN(Number(value))) {
                    setAmount(value)
                  }
                }}
                endContent={
                  <Button
                    radius='sm'
                    variant='bordered'
                    onClick={() => {}}
                    className='-mr-1 flex h-8 min-w-0 items-center justify-center border border-gray-500 bg-black/60'
                  >
                    <MainText heading gradient>
                      MAX
                    </MainText>
                  </Button>
                }
              />
            </Box>
            {type === 'LP' && (
              <a href={poolURL} target='_blank' rel='noopener noreferrer'>
                <Box center className='mt-2 w-fit rounded bg-gray-700 px-2 py-1 uppercase'>
                  <MainText className='text-xs'>{mode === 'deposit' ? 'Add' : 'Remove'} liquidity</MainText>
                  <Box className='ml-2 text-small'>
                    <OpenInNew fontSize='inherit' className='text-gray-200' />
                  </Box>
                </Box>
              </a>
            )}
            <Box center className='mt-6'>
              <MainButton onClick={() => (!isConnected ? connect() : null)} className='w-full p-6'>
                <MainText className='capitalize text-white'>{isConnected ? mode : 'Connect wallet'}</MainText>
              </MainButton>
            </Box>
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
                <MainText className='text-sm'>{formatPercentage(depositFee)}</MainText>
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
                <MainText className='text-sm'>{formatPercentage(withdrawalFee)}</MainText>
              </Box>
              <Box spaced className='mt-4'>
                <Box center>
                  <MainText className='text-lg text-gray-300' heading>
                    Performance Fee
                  </MainText>
                </Box>
                <MainText className='text-sm'>{formatPercentage(performanceFee)}</MainText>
              </Box>
              <SecondaryText>
                Stargaze Finance charges a performance fee on withdrawal. To learn more about the performance fee, you
                can refer to the{' '}
                <Link
                  href={DOCS_FEES_URL}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='text-amber-100 underline'
                >
                  documentation
                </Link>
                .
              </SecondaryText>
            </GrayElement>
          </Box>
        </DarkElement>
      </Box>
    </Container>
  )
}
