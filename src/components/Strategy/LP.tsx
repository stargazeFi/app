import { useCallback, useEffect, useMemo, useState } from 'react'
import { OpenInNew } from '@mui/icons-material'
import { useAccount, useContractWrite } from '@starknet-react/core'
import { Call } from 'starknet'
import { AmountInputField, Footer, Header, Information, StrategyProps, useHandleCTA } from '@/components/Strategy'
import { Box, Container, DarkElement, MainButton, MainText } from '@/components/Layout'
import { useBalances, useDeposit } from '@/hooks'
import { parseAmount, poolLiquidityURL, serializeAddress, serializeU256 } from '@/misc'
import { Amounts } from '@/types'

export const LP = ({ strategy }: StrategyProps) => {
  const { address } = useAccount()

  const { data: balances, isLoading: balancesLoading, refetch: refetchBalances } = useBalances(address)
  const { data: deposited, isLoading: depositLoading, refetch: refetchDeposit } = useDeposit(address, strategy.address)

  const refetch = useCallback(async () => {
    return await Promise.all([refetchBalances(), refetchDeposit()])
  }, [refetchBalances, refetchDeposit])

  const [displayAmount, setDisplayAmount] = useState<Amounts>({})
  const [mode, setMode] = useState<'deposit' | 'redeem'>('deposit')

  useEffect(() => setDisplayAmount({}), [mode])

  const base = useMemo(() => balances[strategy.asset!], [balances, strategy])
  const amount = useMemo(
    () => parseAmount(displayAmount.base, (mode === 'deposit' ? base : deposited)?.decimals),
    [base, deposited, displayAmount, mode]
  )

  const disableCTA = useMemo(() => {
    const { formatted } = (mode === 'deposit' ? base : deposited) || {}
    return !Number(displayAmount.base) || Number(displayAmount.base) > Number(formatted)
  }, [base, deposited, displayAmount, mode])

  const depositCalls = useMemo(() => {
    if (mode === 'deposit' && address) {
      try {
        const approveBase: Call = {
          contractAddress: strategy.asset!,
          entrypoint: 'approve',
          calldata: [serializeAddress(strategy.address), ...serializeU256(amount)]
        }

        const deposit: Call = {
          contractAddress: strategy.address,
          entrypoint: 'deposit',
          calldata: [...serializeU256(amount), serializeAddress(address)]
        }

        return [approveBase, deposit]
      } catch (error) {
        console.error('Failed to generate call data', error)
      }
    }
  }, [address, amount, strategy])

  const redeemCalls = useMemo(() => {
    if (mode === 'redeem' && address) {
      try {
        const redeem: Call = {
          contractAddress: strategy.address,
          entrypoint: 'redeem',
          calldata: [...serializeU256(amount), serializeAddress(address), serializeAddress(address)]
        }

        return [redeem]
      } catch (error) {
        console.error('Failed to generate call data', error)
      }
    }
  }, [address, amount, strategy])

  const { writeAsync: deposit } = useContractWrite({ calls: depositCalls })
  const { writeAsync: redeem } = useContractWrite({ calls: redeemCalls })

  const handleCTA = useHandleCTA({ deposit, mode, redeem, refetch, strategy })

  return (
    <Container>
      <Header strategy={strategy} deposited={deposited} depositLoading={depositLoading} />
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
              className={`flex-1 cursor-pointer border-b ${mode === 'redeem' ? 'border-white' : 'border-gray-700'}`}
            >
              <button onClick={() => setMode('redeem')} className='h-[4.5rem] w-full'>
                <MainText>WITHDRAW</MainText>
              </button>
            </Box>
          </Box>
          <Box col className='pt-2'>
            <AmountInputField
              amount={displayAmount.base}
              balance={base}
              deposit={deposited}
              isLoading={mode === 'deposit' ? balancesLoading : depositLoading}
              mode={mode}
              setDisplayAmount={setDisplayAmount}
              strategy={strategy}
              type='base'
            />
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
            <Box center className='mt-6'>
              <MainButton isDisabled={disableCTA} onClick={handleCTA} className='w-full p-6'>
                <MainText className='capitalize text-white'>{address ? mode : 'Connect wallet'}</MainText>
              </MainButton>
            </Box>
            <Footer strategy={strategy} />
          </Box>
        </DarkElement>
      </Box>
    </Container>
  )
}
