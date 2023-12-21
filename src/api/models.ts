export type StrategyType = 'LP' | 'Direct'

export type Strategy = {
  name: string
  protocol: string
  description: string
  type: StrategyType
  depositFee: number
  withdrawalFee: number
  performanceFee: number
  poolURL?: string
  tokens: string[]
  APY: number
  daily: number
  TVL: number
  stargazeTVL: number
  strategyAddress: string
  vaultAddress: string
  lastUpdate: number
}

export type TokenInfo = {
  name: string
  symbol: string
  decimals: number
  l2_token_address: string
  hidden?: boolean
  sort_order?: number
}
