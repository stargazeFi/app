import { useCallback, useEffect, useMemo, useState } from 'react'
import { OpenInNew } from '@mui/icons-material'
import { useAccount, useContractRead, useContractWrite, useNetwork } from '@starknet-react/core'
import { AmountInputField, Footer, Header, Information, StrategyProps, useHandleCTA } from '@/components/Strategy'
import { Box, Container, DarkElement, MainButton, MainText } from '@/components/Layout'
import { useBalances, useDeposit } from '@/hooks'
import { parseAmount, poolLiquidityURL, serializeAddress, serializeU128, serializeU256 } from '@/misc'
import { ekubo } from '@/protocols'
import { Amounts } from '@/types'
import { Call } from 'starknet'

export const Ekubo = ({ strategy }: StrategyProps) => {
  const { address } = useAccount()
  const { chain } = useNetwork()

  const { data: balances, isLoading: balancesLoading, refetch: refetchBalances } = useBalances(address)
  const { data: deposited, isLoading: depositLoading, refetch: refetchDeposit } = useDeposit(address, strategy.address)

  const poolKey = useMemo(() => {
    const [token0, token1] = strategy.tokens
    const { extension, fee, tickSpacing: tick_spacing } = strategy.position!.poolKey
    return { token0, token1, fee, tick_spacing, extension }
  }, [strategy])

  const { data: poolPrice } = useContractRead({
    abi: ekubo.abis.core,
    address: ekubo.addresses.core(chain.network),
    functionName: 'get_pool_price',
    args: [poolKey],
    watch: true
  })

  const refetch = useCallback(async () => {
    return await Promise.all([refetchBalances(), refetchDeposit()])
  }, [refetchBalances, refetchDeposit])

  const [displayAmounts, setDisplayAmounts] = useState<Amounts>({})
  const [mode, setMode] = useState<'deposit' | 'redeem'>('deposit')

  useEffect(() => setDisplayAmounts({}), [mode])

  const base = useMemo(() => balances[strategy.tokens[0]], [balances, strategy])
  const quote = useMemo(() => balances[strategy.tokens[1]], [balances, strategy])
  const amounts = useMemo(
    () => ekubo.math.parseAmounts(base, quote, displayAmounts, strategy, poolPrice),
    [base, displayAmounts, poolPrice, quote, strategy]
  )

  const disableCTA = useMemo(() => {
    const { base: b, quote: q } = amounts
    if (mode === 'deposit') {
      return !Number(b) || !Number(q) || Number(b) > Number(base.formatted) || Number(q) > Number(quote.formatted)
    } else {
      return !Number(b) || Number(b) > Number(deposited?.formatted)
    }
  }, [amounts, base, deposited, mode, quote])

  const depositCalls = useMemo(() => {
    if (mode === 'deposit' && address) {
      const baseAmount = parseAmount(amounts.base, base?.decimals)
      const quoteAmount = parseAmount(amounts.quote, quote?.decimals)
      const minLiquidity = ((amounts.maxLiquidity! * 99n) / 100n).toString()

      try {
        const approveBase: Call = {
          contractAddress: strategy.tokens[0],
          entrypoint: 'approve',
          calldata: [serializeAddress(strategy.address), ...serializeU256(baseAmount)]
        }

        const approveQuote: Call = {
          contractAddress: strategy.tokens[1],
          entrypoint: 'approve',
          calldata: [serializeAddress(strategy.address), ...serializeU256(quoteAmount)]
        }

        const deposit: Call = {
          contractAddress: strategy.address,
          entrypoint: 'deposit',
          calldata: [
            serializeU128(baseAmount),
            serializeU128(quoteAmount),
            serializeU128(minLiquidity),
            serializeAddress(address)
          ]
        }

        return [approveBase, approveQuote, deposit]
      } catch (error) {
        console.error('Failed to generate call data', error)
      }
    }
  }, [address, amounts, base, quote, mode, strategy])

  const redeemCalls = useMemo(() => {
    if (mode === 'redeem' && address) {
      const shares = parseAmount(amounts.base, deposited?.decimals)

      try {
        const redeem: Call = {
          contractAddress: strategy.address,
          entrypoint: 'redeem',
          calldata: [...serializeU256(shares), serializeAddress(address), serializeAddress(address)]
        }

        return [redeem]
      } catch (error) {
        console.error('Failed to generate call data', error)
      }
    }
  }, [address, amounts, deposited, mode, strategy])

  const { writeAsync: deposit } = useContractWrite({ calls: depositCalls })
  const { writeAsync: redeem } = useContractWrite({ calls: redeemCalls })

  const handleCTA = useHandleCTA({ deposit, mode, redeem, refetch, strategy })

  return (
    <Container>
      <Header deposited={deposited} depositLoading={depositLoading} strategy={strategy} />
      <Box className='mt-2 flex-col-reverse lg:flex-row'>
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
              amount={amounts?.base}
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
                amount={amounts?.quote}
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
