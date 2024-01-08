import BigNumber from 'bignumber.js'
import { uint256, Uint256 } from 'starknet'

export const computeUserBalance = (balance: Uint256, reserves: Uint256, TVL: string) => {
  const b = new BigNumber(uint256.uint256ToBN(balance).toString())
  const r = new BigNumber(uint256.uint256ToBN(reserves).toString())

  return r.isZero() ? '0' : b.multipliedBy(TVL).dividedBy(r).toString()
}
