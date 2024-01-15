import { useEffect, useMemo } from 'react'
import { useRouter } from 'next/router'
import AppLoader from '@/components/AppLoader'
import ErrorPage from '@/components/ErrorPage'
import { Ekubo, LP } from '@/components/Strategy'
import { useStrategiesManager } from '@/hooks'
import { useStrategies } from '@/hooks/api'

export default function Strategy() {
  const router = useRouter()
  const { id } = router.query

  const { data, isError, isLoading } = useStrategies()
  const { strategies, storeStrategies } = useStrategiesManager()

  const isFetching = useMemo(() => !strategies.length && isLoading, [isLoading, strategies])

  useEffect(() => data && storeStrategies(data), [data, storeStrategies])

  const strategy = useMemo(() => strategies?.find(({ address }) => id === address), [id, strategies])

  if (isFetching) {
    return <AppLoader />
  }

  if (isError) {
    return <ErrorPage />
  }

  if (!strategy) {
    return <ErrorPage errMessage='Invalid strategy.' />
  }

  switch (strategy.type) {
    case 'Range':
      return <Ekubo strategy={strategy} />
    default:
      return <LP strategy={strategy} />
  }
}

/*
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
import { TokenIcon } from '@/components/TokenIcon'
import { TokenContext } from '@/contexts'
import { useBalances, useDeposit, useStrategiesManager, useTransactionManager } from '@/hooks'
import { usePrices, useStrategies } from '@/hooks/api'
import {
  DOCS_FEES_URL,
  explorerContractURL,
  formatCurrency,
  formatPercentage,
  formatToDecimal,
  formatTokenPrice,
  getTokenDescription,
  getTokenName,
  poolLiquidityURL,
  serializeAddress,
  serializeU256
} from '@/misc'
import { Amount, computeAmount } from '@/misc/maths'
import { Balance, Deposit, Strategy, TransactionType } from '@/types'
import { ArrowBack, HelpOutline, Link as LinkIcon, OpenInNew } from '@mui/icons-material'
import { Button, Input, Skeleton } from '@nextui-org/react'
import { useAccount, useConnect, useContractWrite, useNetwork } from '@starknet-react/core'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { Dispatch, SetStateAction, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { Call } from 'starknet'





export default function Strategy() {
  const { address, isConnected } = useAccount()
  const { connect } = useConnect()
  const { chain } = useNetwork()
  const { addTransaction } = useTransactionManager()

  const tokensList = useContext(TokenContext)


  const [displayAmount, setDisplayAmount] = useState<Amount>({ base: '0', quote: '0' })
  const [mode, setMode] = useState<'deposit' | 'withdraw'>('deposit')

  const { data: prices } = usePrices()




  useEffect(() => setDisplayAmount({ base: '0', quote: '0' }), [mode])

  const { data: balances, isLoading: balancesLoading, refetch: refetchBalances } = useBalances(address)
  const baseToken = useMemo(
    () => strategy && balances[strategy.type === 'LP' ? strategy.asset! : strategy.tokens[0]],
    [balances, strategy]
  )
  const quoteToken = useMemo(
    () => (strategy?.type === 'Range' ? balances[strategy.tokens[1]] : undefined),
    [balances, strategy]
  )
  const { data: deposited, isLoading: depositLoading, refetch: refetchDeposit } = useDeposit(address, strategy?.address)

  const amounts = useMemo(
    () => computeAmount({ baseToken, deposited, displayAmount, quoteToken, mode, strategy }),
    [baseToken, deposited, displayAmount, mode, quoteToken, strategy]
  )

  console.log(displayAmount, amounts)

  const refetch = useCallback(async () => {
    return await Promise.all([refetchBalances(), refetchDeposit()])
  }, [refetchBalances, refetchDeposit])

  const depositCalls = useMemo(() => {
    if (address && baseToken && strategy) {
      try {
        const approveBaseToken: Call = {
          contractAddress: strategy.asset || strategy.tokens[0],
          entrypoint: 'approve',
          calldata: [serializeAddress(strategy.address), ...serializeU256(amounts.base || '0')]
        }

        const approveQuoteToken: Call | null = quoteToken
          ? {
              contractAddress: strategy.tokens[1],
              entrypoint: 'approve',
              calldata: [serializeAddress(strategy.address), ...serializeU256(amounts.quote || '0')]
            }
          : null

        // TODO ADD FOR RANGE
        const deposit: Call = {
          contractAddress: strategy.address,
          entrypoint: 'deposit',
          calldata: [...serializeU256(amounts.base || '0'), serializeAddress(address)]
        }

        return [approveBaseToken, approveQuoteToken, deposit].filter((x): x is Call => x !== null)
      } catch (error) {
        console.error('Failed to generate call data', error)
      }
    }
  }, [address, amounts, baseToken, quoteToken, strategy])

  // TODO ADD FOR RANGE
  const withdrawCalls = useMemo(() => {
    if (address && strategy) {
      try {
        const withdraw: Call = {
          contractAddress: strategy.address,
          entrypoint: 'redeem',
          calldata: [...serializeU256(amounts.base || '0'), serializeAddress(address), serializeAddress(address)]
        }

        return [withdraw].filter((x): x is Call => x !== null)
      } catch (error) {
        console.error('Failed to generate call data', error)
      }
    }
  }, [address, amounts, strategy])

  const { writeAsync: deposit } = useContractWrite({ calls: depositCalls })
  const { writeAsync: withdraw } = useContractWrite({ calls: withdrawCalls })

  const tokenPrice = useCallback(
    (address: string) => {
      return prices?.find((price) => price.address === address)?.price
    },
    [prices]
  )

  const disableCTA = useMemo(() => {
    const { base, quote } = displayAmount
    if (strategy?.type === 'LP') {
      return !Number(base) || Number(base) > Number(mode === 'deposit' ? baseToken?.formatted : deposited?.formatted)
    } else {
      return (
        !Number(base) ||
        !Number(quote) ||
        Number(base) > Number(mode === 'deposit' ? baseToken?.formatted : deposited?.formatted) ||
        Number(quote) > Number(quoteToken?.formatted)
      )
    }
  }, [baseToken, deposited, displayAmount, mode, quoteToken, strategy])

  const handleCTA = useCallback(async () => {
    if (!isConnected) {
      connect()
    }

    try {
      const { transaction_hash: hash } = await (mode === 'deposit' ? deposit() : withdraw())
      addTransaction(refetch, {
        action: mode === 'deposit' ? TransactionType.StrategyDeposit : TransactionType.StrategyRedeem,
        hash,
        strategyName: strategy!.name,
        timestamp: Date.now()
      })
    } catch (e) {
      console.error(e)
    }
  }, [addTransaction, connect, deposit, isConnected, mode, refetch, strategy, withdraw])



  return (
    <Container>
      <Box spaced>
        <Box center>
          <Box className={`${strategy.tokens.length === 1 ? 'mr-2' : 'mr-4'} text-2xl`}>
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

      <Box className='mt-2 flex-col-reverse md:flex-row'>
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
              {strategy.tokens.map((address, index) => {
                const price = tokenPrice(address)

                return (
                  <GrayElement col center key={index} className='w-full is-not-last-child:mb-6'>
                    <Box spaced className='w-full'>
                      <Box center>
                        <TokenIcon address={address} size={30} className='z-20' />
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
          <Box col className='pt-2'>
            <AmountInputField
              amount={amounts?.base || '0'}
              balance={baseToken}
              deposit={deposited}
              isLoading={mode === 'deposit' ? balancesLoading : depositLoading}
              mode={mode}
              setDisplayAmount={setDisplayAmount}
              strategy={strategy}
              type='base'
            />
            {strategy.type === 'Range' && mode === 'deposit' && (
              <AmountInputField
                amount={amounts?.quote || '0'}
                balance={quoteToken}
                isLoading={mode === 'deposit' ? balancesLoading : depositLoading}
                mode={mode}
                setDisplayAmount={setDisplayAmount}
                strategy={strategy}
                type='quote'
              />
            )}
            {strategy.type === 'LP' && (
              <Box className='mt-2 w-fit rounded bg-gray-700 px-2 py-1 uppercase'>
                <a
                  href={poolLiquidityURL(strategy.protocol, strategy.asset!, strategy.tokens, mode)}
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
*/
