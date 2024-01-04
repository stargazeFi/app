export type Protocol = 'sithswap' | 'ekubo' | 'jediswap'

export type StrategyType = 'LP' | 'Direct'

export type Pair = {
  address: string
  token0: string
  token1: string
  reserve0: bigint
  reserve1: bigint
}

export type Price = {
  address: string
  ticker: string
  price: number
  lastUpdated: number
}

export type Strategy = {
  name: string
  type: StrategyType
  protocol: Protocol
  description: string
  depositFee: number
  withdrawalFee: number
  performanceFee: number
  poolToken?: string
  tokens: string[]
  APY: number
  daily: number
  TVL: number
  strategyAddress: string
  lastUpdated: number
}

export type TokenInfo = {
  name: string
  symbol: string
  decimals: number
  l2_token_address: string
  hidden?: boolean
  sort_order?: number
}
