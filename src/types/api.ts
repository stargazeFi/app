import { Uint256 } from 'starknet'

export type Protocol = 'sithswap' | 'ekubo' | 'jediswap'
export type StrategyType = 'LP' | 'Range'

export interface Analytics {
  address: string
  price: Record<number, string>
  tvl: Record<number, string>
}

export interface PendingTransaction {
  hash: string | null
}

export interface Price {
  address: string
  lastUpdated: number
  price: number
  ticker: string
}

interface EkuboPosition {
  bounds: Array<string>
  poolKey: {
    fee: string
    tickSpacing: string
    extension: string
  }
}

export interface Strategy {
  address: string
  asset?: string
  assetDecimals?: number
  cursorUpdate: bigint
  daily: number
  depositFee: number
  description: string
  lastUpdated: bigint
  name: string
  performanceFee: number
  position?: EkuboPosition
  protocol: Protocol
  protocolTVL: string
  tokens: Array<string>
  totalShares: Uint256
  type: StrategyType
  withdrawalFee: number
  APY: number
  TVL: string
}

export interface TokenInfo {
  decimals: number
  l2_token_address: string
  name: string
  symbol: string
}
