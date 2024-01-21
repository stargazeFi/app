import { explorerTransactionURL, shortenTxHash } from '@/misc'
import { TransactionType } from '@/types'
import { Chain } from '@starknet-react/chains'
import Link from 'next/link'
import { toast as toastify } from 'react-toastify'
import { Box, MainText } from '@/components/Layout'

const toastContent = (transactionType: TransactionType, type: 'info' | 'success' | 'error') =>
  ({
    [TransactionType.StrategyDeposit]: {
      error: 'Error depositing',
      info: 'Depositing into strategy...',
      success: 'Deposit successful!'
    },
    [TransactionType.StrategyRedeem]: {
      error: 'Error redeeming',
      info: 'Redeeming from strategy...',
      success: 'Redeem successful!'
    }
  })[transactionType][type]

interface ToastProps {
  action: TransactionType
  chain: Chain
  transactionHash?: string
  type?: 'info' | 'success' | 'error'
}

export const toast = ({ action, chain, transactionHash, type = 'info' }: ToastProps) => {
  toastify[type](
    <Box col className='ml-4 items-start'>
      <MainText heading className='text-lg text-white'>
        {toastContent(action, type).toUpperCase()}
      </MainText>
      {transactionHash && (
        <Link href={explorerTransactionURL(transactionHash, chain)} target='_blank' rel='noopener noreferrer'>
          <MainText className='text-sm'>
            Transaction hash:{' '}
            <MainText heading className='text-blue-600 underline'>
              {shortenTxHash(transactionHash)}
            </MainText>
          </MainText>
        </Link>
      )}
    </Box>,
    {
      style: {
        border: '0.5px solid rgb(61, 61, 61)',
        borderRadius: '0.375rem',
        backgroundColor: 'rgba(19, 19, 19, 0.8)',
        padding: '0.75rem 1.5rem 0.75rem 0.75rem',
        width: '400px'
      }
    }
  )
}
