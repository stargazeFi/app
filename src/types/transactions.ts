export enum TransactionType {
  StrategyDeposit = 'Deposit in strategy',
  StrategyRedeem = 'Redeem from strategy'
}

export interface StrategyDeposit {
  action: TransactionType.StrategyDeposit
  strategyName: string
}

export interface StrategyRedeem {
  action: TransactionType.StrategyRedeem
  strategyName: string
}

export type Transaction = (StrategyDeposit | StrategyRedeem) & { hash: string; timestamp: number; toastMessage: string }
