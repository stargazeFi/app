import { Protocol } from '@/types'
import { Chain } from '@starknet-react/chains'

export const explorerContractURL = (address: string | undefined, chain: Chain) =>
  (chain.testnet ? 'https://testnet.starkscan.co/' : 'https://starkscan.co/') + 'contract/' + address

export const explorerTransactionURL = (address: string, chain: Chain) =>
  (chain.testnet ? 'https://testnet.starkscan.co/' : 'https://starkscan.co/') + 'tx/' + address

export const poolLiquidityURL = (protocol: Protocol, address: string, mode: 'deposit' | 'withdraw') =>
  ({
    sithswap: `https://app.sithswap.com/${mode === 'deposit' ? 'add' : 'withdraw'}/${address}`,
    jediswap: '',
    ekubo: ''
  })[protocol]

export const poolURL = (protocol: Protocol, address: string) =>
  ({
    sithswap: `https://app.sithswap.com/add/${address}`,
    jediswap: '',
    ekubo: ''
  })[protocol]
