import { Pair, Price, TokenInfo } from '@/types'
import BigNumber from 'bignumber.js'
import Long from 'long'

export const usePairTVL = ({
  pairs,
  poolToken,
  prices,
  tokensList
}: {
  pairs: Pair[] | undefined
  poolToken: string | undefined
  prices: Price[] | undefined
  tokensList: TokenInfo[]
}) => {
  if (!poolToken) {
    return null
  }

  const match = pairs?.find(({ address }) => address === poolToken)
  if (!match) {
    return null
  }

  const { reserve0, reserve1, token0, token1 } = match
  const price0 = prices?.find(({ address }) => address === token0)?.price
  const decimals0 = tokensList.find(({ l2_token_address }) => l2_token_address === token0)?.decimals
  const price1 = prices?.find(({ address }) => address === token1)?.price
  const decimals1 = tokensList.find(({ l2_token_address }) => l2_token_address === token1)?.decimals
  if (!price0 || !price1 || !decimals0 || !decimals1) {
    return null
  }

  const r0 = new BigNumber(Long.fromValue(reserve0 as unknown as Long).toString())
  const r1 = new BigNumber(Long.fromValue(reserve1 as unknown as Long).toString())
  const tvlToken0 = r0.multipliedBy(price0).div(10 ** decimals0)
  const tvlToken1 = r1.multipliedBy(price1).div(10 ** decimals1)

  return Number(tvlToken0.plus(tvlToken1))
}
