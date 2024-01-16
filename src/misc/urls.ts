import { Protocol } from '@/types'
import { Chain } from '@starknet-react/chains'

export const explorerContractURL = (address: string | undefined, chain: Chain) =>
  (chain.testnet ? 'https://testnet.starkscan.co/' : 'https://starkscan.co/') + 'contract/' + address

export const explorerTransactionURL = (address: string, chain: Chain) =>
  (chain.testnet ? 'https://testnet.starkscan.co/' : 'https://starkscan.co/') + 'tx/' + address

export const poolLiquidityURL = (protocol: Protocol, address: string, tokens: string[], mode: 'deposit' | 'redeem') =>
  ({
    sithswap: `https://app.sithswap.com/${mode === 'deposit' ? 'add' : 'withdraw'}/${address}`,
    jediswap: `https://app.testnet.jediswap.xyz/#/${mode === 'deposit' ? 'add' : 'remove'}/${tokens[0]}/${tokens[1]}`,
    ekubo: ''
  })[protocol]
