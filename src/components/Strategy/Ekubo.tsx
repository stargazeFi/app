import { useCallback, useMemo, useState } from 'react'
import { OpenInNew } from '@mui/icons-material'
import { useAccount, useContractWrite } from '@starknet-react/core'
import { AmountInputField, Footer, Header, Information, StrategyProps, useHandleCTA } from '@/components/Strategy'
import { Box, Container, DarkElement, MainButton, MainText } from '@/components/Layout'
import { useBalances, useDeposit } from '@/hooks'
import { poolLiquidityURL } from '@/misc'
import { Amount } from '@/types'

export const Ekubo = ({ strategy }: StrategyProps) => {
  const { address, isConnected } = useAccount()

  const { data: balances, isLoading: balancesLoading, refetch: refetchBalances } = useBalances(address)
  const { data: deposited, isLoading: depositLoading, refetch: refetchDeposit } = useDeposit(address, strategy.address)

  const refetch = useCallback(async () => {
    return await Promise.all([refetchBalances(), refetchDeposit()])
  }, [refetchBalances, refetchDeposit])

  const [displayAmounts, setDisplayAmounts] = useState<Amount>({})
  const [mode, setMode] = useState<'deposit' | 'withdraw'>('deposit')

  const base = useMemo(() => balances[strategy.tokens[0]], [balances, strategy])
  const quote = useMemo(() => balances[strategy.tokens[1]], [balances, strategy])
  // const amounts = useMemo(() => parseRangeAmounts(), [])

  const disableCTA = useMemo(() => {
    const { base: b, quote: q } = displayAmounts
    if (mode === 'deposit') {
      return !Number(b) || !Number(q) || Number(b) > Number(base.formatted) || Number(q) > Number(quote.formatted)
    } else {
      return !Number(b) || Number(b) > Number(deposited?.formatted)
    }
  }, [base, deposited, displayAmounts, mode, quote])

  const depositCalls = useMemo(() => {
    return []
  }, [])

  const withdrawCalls = useMemo(() => {
    return []
  }, [])

  const { writeAsync: deposit } = useContractWrite({ calls: depositCalls })
  const { writeAsync: withdraw } = useContractWrite({ calls: withdrawCalls })

  const handleCTA = useHandleCTA({ deposit, mode, refetch, strategy, withdraw })

  return (
    <Container>
      <Header deposited={deposited} depositLoading={depositLoading} strategy={strategy} />
      <Box className='mt-2 flex-col-reverse md:flex-row'>
        <Information strategy={strategy} />
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
              amount={displayAmounts.base}
              balance={base}
              deposit={deposited}
              isLoading={mode === 'deposit' ? balancesLoading : depositLoading}
              mode={mode}
              setDisplayAmount={setDisplayAmounts}
              strategy={strategy}
              type='base'
            />
            {mode === 'deposit' && (
              <AmountInputField
                amount={displayAmounts.quote}
                balance={quote}
                deposit={deposited}
                isLoading={balancesLoading}
                mode={mode}
                setDisplayAmount={setDisplayAmounts}
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
            <Footer strategy={strategy} />
          </Box>
        </DarkElement>
      </Box>
    </Container>
  )
}
