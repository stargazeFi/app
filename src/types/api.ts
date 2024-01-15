import { Uint256 } from 'starknet'

export type Protocol = 'sithswap' | 'ekubo' | 'jediswap'
export type StrategyType = 'LP' | 'Range'

export type PendingTransaction = {
  hash: string | null
}

export type Price = {
  address: string
  ticker: string
  price: number
  lastUpdated: number
}

interface EkuboPosition {
  poolKey: {
    fee: bigint
    tickSpacing: bigint
    extension: string
  }
  range: Array<bigint>
}

export type Strategy = {
  name: string
  address: string
  asset?: string
  assetDecimals?: number
  type: StrategyType
  protocol: Protocol
  position?: EkuboPosition
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
