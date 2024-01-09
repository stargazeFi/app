import { Uint256 } from 'starknet'

export type Protocol = 'sithswap' | 'ekubo' | 'jediswap'

export type StrategyType = 'LP' | 'Direct'

export type Price = {
  address: string
  ticker: string
  price: number
  lastUpdated: number
}

export type Strategy = {
  name: string
  address: string
  asset: string
  assetDecimals: number
  type: StrategyType
  protocol: Protocol
  protocolTVL: string
  tokens: Array<string>
  description: string
  depositFee: number
  withdrawalFee: number
  performanceFee: number
  daily: number
  APY: number
  TVL: string
  reserves: Uint256
  lastUpdated: bigint
}

export type TokenInfo = {
  name: string
  symbol: string
  decimals: number
  l2_token_address: string
}
