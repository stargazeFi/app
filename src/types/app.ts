export interface Amounts {
  base?: string
  quote?: string
  maxLiquidity?: bigint
}

export interface Balance {
  decimals: number
  formatted: string
}

export type Balances = Record<string, Balance>

export interface Deposit extends Balance {
  value: string
}

export type Deposits = Record<string, Deposit>
