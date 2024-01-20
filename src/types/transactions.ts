export enum TransactionType {
  StrategyDeposit = 'DEPOSIT IN STRATEGY',
  StrategyRedeem = 'REDEEM FROM STRATEGY'
}

export interface StrategyDeposit {
  action: TransactionType.StrategyDeposit
  strategyName: string
}

export interface StrategyRedeem {
  action: TransactionType.StrategyRedeem
  strategyName: string
}

export type Transaction = (StrategyDeposit | StrategyRedeem) & {
  hash: string
  timestamp: number
}
