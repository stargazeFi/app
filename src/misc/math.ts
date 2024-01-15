import BigNumber from 'bignumber.js'
import { uint256, Uint256 } from 'starknet'

export const parseAmount = (amount: string | undefined, decimals: number | undefined) => {
  if (!amount || !decimals) {
    return '0'
  }

  return new BigNumber(amount).multipliedBy(new BigNumber(10).pow(decimals)).toString()
}

export const computeUserBalance = (balance: Uint256, reserves: Uint256, TVL: string) => {
  const b = new BigNumber(uint256.uint256ToBN(balance).toString())
  const r = new BigNumber(uint256.uint256ToBN(reserves).toString())

  return r.isZero() ? '0' : b.multipliedBy(TVL).dividedBy(r).toString()
}
