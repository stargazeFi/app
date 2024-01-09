import BigNumber from 'bignumber.js'
import { BigNumberish, cairo, num } from 'starknet'

export const serializeAddress = (address: string) => num.getDecimalString(address)

export const serializeU256 = (n: string, decimals: number = 0): [BigNumberish, BigNumberish] => {
  const { low, high } = cairo.uint256(new BigNumber(n).multipliedBy(new BigNumber(10).pow(decimals)).toString())
  return [low, high]
}
