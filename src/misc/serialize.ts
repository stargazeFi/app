import { BigNumberish, cairo, num } from 'starknet'

const MAX_U128 = 2n ** 128n - 1n

export const serializeAddress = (address: string) => num.getDecimalString(address)

export const serializeU128 = (n: string): string => {
  if (BigInt(n) < 0n) throw new Error('negative serialize')
  if (BigInt(n) > MAX_U128) throw new Error('max u128 serialize')
  return num.toHex(n)
}

export const serializeU256 = (n: string): [BigNumberish, BigNumberish] => {
  const { low, high } = cairo.uint256(n.replace(/\..*/, ''))
  return [low, high]
}
