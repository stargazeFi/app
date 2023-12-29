import { explorerTransactionAddress, shortenTxHash } from '@/misc/format'
import { Chain } from '@starknet-react/chains'
import Link from 'next/link'
import { toast as toastify } from 'react-toastify'
import { Box, MainText } from '@/components/Layout'

interface ToastProps {
  chain: Chain
  content: string
  transactionHash?: string
  type?: 'info' | 'success' | 'error'
}

export const toast = ({ chain, content, transactionHash, type = 'info' }: ToastProps) => {
  toastify[type](
    <Box col className='ml-4 items-start'>
      <MainText heading gradient className='text-xl'>
        {content}
      </MainText>
      {transactionHash && (
        <Link href={explorerTransactionAddress(transactionHash, chain)} target='_blank' rel='noopener noreferrer'>
          <MainText className='text-sm'>
            Transaction hash: <u className='text-blue-600'>{shortenTxHash(transactionHash)}</u>
          </MainText>
        </Link>
      )}
    </Box>,
    {
      style: {
        border: '0.5px solid rgb(61, 61, 61)',
        borderRadius: '0.375rem',
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        padding: '0.75rem',
        width: '400px'
      }
    }
  )
}
