import { BigNumberish, cairo, num } from 'starknet'

export const serializeAddress = (address: string) => num.getDecimalString(address)

export const serializeU256 = (n: string): [BigNumberish, BigNumberish] => {
  const { low, high } = cairo.uint256(n.replace(/\..*/, ''))
  return [low, high]
}
