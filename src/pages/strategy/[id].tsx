import AppLoader from '@/components/AppLoader'
import ErrorPage from '@/components/ErrorPage'
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
import { TokenContext } from '@/contexts'
import { usePairs, usePrices, useStrategiesManager, useTransactionManager } from '@/hooks'
import { useStrategies } from '@/hooks/api'
import { usePairTVL } from '@/hooks/usePairTVL'
import {
  DOCS_FEES_URL,
  explorerContractURL,
  formatCurrency,
  formatPercentage,
  formatToDecimal,
  getTokenDescription,
  getTokenIcon,
  getTokenName,
  poolLiquidityURL,
  serializeAddress,
  serializeU256
} from '@/misc'
import { Strategy, TransactionType } from '@/types'
import { ArrowBack, HelpOutline, Link as LinkIcon, OpenInNew } from '@mui/icons-material'
import { Button, Image, Input, Skeleton } from '@nextui-org/react'
import { useAccount, useBalance, useConnect, useContractWrite, useNetwork } from '@starknet-react/core'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { Call } from 'starknet'
import { format } from 'timeago.js'

export default function Strategy() {
  const { address, isConnected } = useAccount()
  const { connect } = useConnect()
  const { chain } = useNetwork()
  const { addTransaction } = useTransactionManager()
  const router = useRouter()

  const tokensList = useContext(TokenContext)

  const { id } = router.query

  const [amount, setAmount] = useState('0')
  const [mode, setMode] = useState<'deposit' | 'withdraw'>('deposit')

  const { data: prices } = usePrices()
  const { data: pairs } = usePairs()
  const { data, isError: strategyError, isLoading } = useStrategies()
  const { strategies, storeStrategies } = useStrategiesManager()

  const isFetching = useMemo(() => !strategies.length && isLoading, [isLoading, strategies])

  useEffect(() => data && storeStrategies(data), [data, storeStrategies])

  const strategy: Strategy | undefined = useMemo(
    () => strategies?.find(({ strategyAddress }) => id === strategyAddress),
    [id, strategies]
  )

  const pairTVL = usePairTVL({ pairs, poolToken: strategy?.poolToken, prices, tokensList })

  const { data: shares } = useBalance({
    token: strategy?.strategyAddress,
    address,
    enabled: !!address,
    watch: true
  })

  const { data: baseToken, isError: baseTokenError } = useBalance({
    token: strategy?.poolToken || strategy?.tokens[0],
    address,
    enabled: !!address,
    watch: true
  })

  const { data: quoteToken, isError: quoteTokenError } = useBalance({
    token: strategy?.tokens[1],
    address,
    enabled: !!address && strategy?.type === 'Direct',
    watch: true
  })

  const available = useMemo(
    () =>
      mode === 'deposit'
        ? formatToDecimal(baseToken?.formatted, baseToken?.decimals)
        : formatToDecimal(shares?.formatted, shares?.decimals),
    [baseToken, mode, shares]
  )

  const depositCalls = useMemo(() => {
    if (address && strategy) {
      try {
        const approveToken0: Call = {
          contractAddress: strategy.poolToken || strategy.tokens[0],
          entrypoint: 'approve',
          calldata: [serializeAddress(strategy.strategyAddress), ...serializeU256(amount, baseToken?.decimals)]
        }

        const approveToken1: Call | null =
          strategy.type === 'Direct'
            ? {
                contractAddress: strategy.tokens[1],
                entrypoint: 'approve',
                calldata: [serializeAddress(strategy.strategyAddress), ...serializeU256(amount, quoteToken?.decimals)]
              }
            : null

        const deposit: Call = {
          contractAddress: strategy.strategyAddress,
          entrypoint: 'deposit',
          calldata: [...serializeU256(amount, baseToken?.decimals), serializeAddress(address)]
        }

        return [approveToken0, approveToken1, deposit].filter((x): x is Call => x !== null)
      } catch (error) {
        console.error('Failed to generate call data', error)
      }
    }
  }, [address, amount, baseToken, quoteToken, strategy])

  const withdrawCalls = useMemo(() => {
    if (address && strategy) {
      try {
        const withdraw: Call = {
          contractAddress: strategy.strategyAddress,
          entrypoint: 'redeem',
          calldata: [...serializeU256(amount, shares?.decimals), serializeAddress(address), serializeAddress(address)]
        }

        return [withdraw].filter((x): x is Call => x !== null)
      } catch (error) {
        console.error('Failed to generate call data', error)
      }
    }
  }, [address, amount, shares?.decimals, strategy])

  const { writeAsync: deposit } = useContractWrite({ calls: depositCalls })
  const { writeAsync: withdraw } = useContractWrite({ calls: withdrawCalls })

  const disableCTA = useMemo(
    () => !Number(amount) || Number(amount) > Number(mode === 'deposit' ? baseToken?.formatted : shares?.formatted),
    [amount, baseToken, mode, shares]
  )

  const handleCTA = useCallback(async () => {
    if (!isConnected) {
      connect()
    }

    try {
      const { transaction_hash: hash } = await (mode === 'deposit' ? deposit() : withdraw())
      addTransaction({
        action: mode === 'deposit' ? TransactionType.StrategyDeposit : TransactionType.StrategyRedeem,
        hash,
        strategyName: strategy!.name,
        timestamp: Date.now(),
        toastMessage: mode === 'deposit' ? 'Depositing into strategy...' : 'Redeeming from strategy...'
      })
    } catch (e) {
      console.error(e)
    }
  }, [addTransaction, connect, deposit, isConnected, mode, strategy, withdraw])

  if (isFetching) {
    return <AppLoader />
  }

  if (strategyError || baseTokenError || quoteTokenError) {
    return <ErrorPage />
  }

  if (!strategy) {
    return <ErrorPage errMessage='Invalid strategy.' />
  }

  return (
    <Container>
      <Box spaced>
        <Box center>
          <Box className={`${strategy.tokens.length === 1 ? 'mr-2' : 'mr-4'} text-2xl`}>
            <button onClick={() => router.back()} className='flex items-center'>
              <ArrowBack fontSize='inherit' className='text-gray-200' />
            </button>
          </Box>
          <Box center>
            <Box center className='w-[64px]'>
              <Image className='z-20' src={getTokenIcon(strategy.tokens[0], tokensList)} width={40} height={40} />
              {strategy.type === 'LP' && (
                <Box className='-ml-5'>
                  <Image src={getTokenIcon(strategy.tokens[1], tokensList)} width={40} height={40} />
                </Box>
              )}
            </Box>
            <MainText heading className='ml-2 pt-1 text-4xl'>
              {strategy.name}
            </MainText>
          </Box>
        </Box>
        <Box center>
          <Box center className='w-fit rounded bg-gray-700 px-2 uppercase'>
            <MainText>{strategy.protocol}</MainText>
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
            {!pairTVL ? (
              <Skeleton className='my-0.5 flex h-3.5 w-20 rounded-md' />
            ) : (
              <Box center>
                <MainText className='text-sm text-gray-600'>{formatCurrency(pairTVL)}</MainText>
                <Box className='ml-2 pb-0.5 text-small'>
                  <Tooltip content="Protocol's own TVL">
                    <HelpOutline fontSize='inherit' className='text-gray-600' />
                  </Tooltip>
                </Box>
              </Box>
            )}
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
            <MainText gradient className='text-lg'>
              {formatCurrency(123321)}
            </MainText>
          </Box>
          <Box col className='flex-1 items-start border-l border-gray-700 pl-6 lg:items-end lg:border-none'>
            <MainText heading className='text-xl font-light'>
              Last update
            </MainText>
            <MainText gradient className='text-lg'>
              {format(strategy.lastUpdated)}
            </MainText>
          </Box>
        </DarkElement>
      </Box>

      <Box className='mt-2 flex-col-reverse md:flex-row'>
        <Box col className='flex-[3] lg:flex-[4]'>
          <DarkElement col className='h-fit'>
            <Box spaced className='w-full lg:flex-row'>
              <MainText heading className='pt-1 text-2xl'>
                Strategy
              </MainText>
              <Box center>
                <Link
                  href={explorerContractURL(strategy.strategyAddress, chain)}
                  target='_blank'
                  rel='noopener noreferrer'
                >
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
              {strategy.tokens.map((address, index) => (
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
              <MainText className='text-xs'>Available: {available}</MainText>
            </Box>
            <Box spaced className='mt-2'>
              <Box center className='mr-2 w-[80px] rounded-xl border-[0.5px] border-gray-400 bg-black/60'>
                <Image className='z-20' src={getTokenIcon(strategy.tokens[0], tokensList)} width={28} height={28} />
                {strategy.type === 'LP' && (
                  <Box className='-ml-2'>
                    <Image src={getTokenIcon(strategy.tokens[1], tokensList)} width={28} height={28} />
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
                    onClick={() =>
                      setAmount(mode === 'deposit' ? baseToken?.formatted || '0' : shares?.formatted || '0')
                    }
                    className='-mr-1 flex h-8 min-w-0 items-center justify-center border border-gray-500 bg-black/60'
                  >
                    <MainText heading gradient>
                      MAX
                    </MainText>
                  </Button>
                }
              />
            </Box>
            {strategy.type === 'LP' && (
              <Box className='mt-2 w-fit rounded bg-gray-700 px-2 py-1 uppercase'>
                <a
                  href={poolLiquidityURL(strategy.protocol, strategy.poolToken as string, mode)}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='flex items-center'
                >
                  <MainText className='text-xs'>{mode === 'deposit' ? 'Add' : 'Remove'} liquidity</MainText>
                  <Box className='ml-2 text-small'>
                    <OpenInNew fontSize='inherit' className='text-gray-200' />
                  </Box>
                </a>
              </Box>
            )}
            <Box center className='mt-6'>
              <MainButton isDisabled={disableCTA} onClick={handleCTA} className='w-full p-6'>
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
