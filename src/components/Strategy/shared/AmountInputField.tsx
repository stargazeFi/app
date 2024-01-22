import { useMemo, Dispatch, SetStateAction } from 'react'
import { Button, Input, Skeleton } from '@nextui-org/react'
import { Box, MainText } from '@/components/Layout'
import { Icon } from 'src/components/Tokens'
import { formatToDecimal } from '@/misc'
import { Amounts, Balance, Strategy } from '@/types'

interface AmountInputFieldProps {
  amount?: string
  balance?: Balance
  deposit?: Balance
  isLoading: boolean
  mode: 'deposit' | 'redeem'
  setDisplayAmount: Dispatch<SetStateAction<Amounts>>
  strategy: Strategy
  type: 'base' | 'quote'
}

export const AmountInputField = ({
  amount,
  balance,
  deposit,
  isLoading,
  mode,
  setDisplayAmount,
  strategy,
  type
}: AmountInputFieldProps) => {
  const available = useMemo(
    () =>
      mode === 'deposit'
        ? formatToDecimal(balance?.formatted, balance?.decimals)
        : formatToDecimal(deposit?.formatted, deposit?.decimals),
    [balance, deposit, mode]
  )

  return (
    <Box col className='mt-4'>
      <Box className='justify-end px-2'>
        {isLoading ? (
          <Skeleton className='mb-0.5 flex h-3.5 w-48 rounded-md' />
        ) : (
          <MainText heading className='text-sm text-white'>
            Available: {available}
          </MainText>
        )}
      </Box>
      <Box spaced className='mt-2'>
        {mode === 'deposit' && (
          <Box center className='mr-2 w-[80px] rounded-xl border-[0.5px] border-gray-400 bg-transparent'>
            <Icon address={strategy.tokens[type === 'base' ? 0 : 1]} size={28} />
            {strategy.type === 'LP' && (
              <Box className='z-20 -ml-2'>
                <Icon address={strategy.tokens[1]} size={28} />
              </Box>
            )}
          </Box>
        )}
        <Input
          autoComplete='off'
          size='sm'
          variant='bordered'
          placeholder='0'
          value={amount || '0'}
          classNames={{
            input: 'text-amber-50 mr-6 font-heading',
            inputWrapper: 'bg-transparent border border-gray-500'
          }}
          onChange={(e) => {
            const { value } = e.target
            !isNaN(Number(value)) && setDisplayAmount({ [type]: value })
          }}
          endContent={
            <Button
              radius='sm'
              variant='bordered'
              onClick={() => {
                setDisplayAmount({
                  [type]: mode === 'deposit' ? balance?.formatted : deposit?.formatted
                })
              }}
              className='-mr-1 flex h-8 min-w-0 items-center justify-center border border-gray-500 bg-main/20'
            >
              <MainText heading className='text-white'>
                MAX
              </MainText>
            </Button>
          }
        />
      </Box>
    </Box>
  )
}
