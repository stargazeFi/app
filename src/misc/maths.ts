import BigNumber from 'bignumber.js'
import { uint256, Uint256 } from 'starknet'

export const parseLPAmounts = (amount: string | undefined, decimals: number | undefined) => {
  if (!amount || !decimals) {
    return '0'
  }

  return new BigNumber(amount).multipliedBy(new BigNumber(10).pow(decimals)).toString()
}

export const parseRangeAmounts = () => {
  return { base: '0', quote: '0' }
}

/*
export const computeAmount = ({
  baseToken,
  deposited,
  displayAmount,
  quoteToken,
  mode,
  strategy
}: {
  baseToken?: Balance
  deposited?: Balance
  displayAmount: Amount
  quoteToken?: Balance
  mode: 'deposit' | 'withdraw'
  strategy?: Strategy
}) => {
  if (!strategy || !baseToken) {
    return displayAmount
  }

  if (strategy.protocol === 'ekubo' && strategy.range) {
    return protocols.ekubo.computeAmounts({ displayAmount, baseToken, quoteToken: quoteToken!, strategy })
  }

  return {
    base: parseAmount(displayAmount.base || '0', (mode === 'deposit' ? baseToken : deposited)?.decimals),
    quote: '0'
  }
}
*/

export const computeUserBalance = (balance: Uint256, reserves: Uint256, TVL: string) => {
  const b = new BigNumber(uint256.uint256ToBN(balance).toString())
  const r = new BigNumber(uint256.uint256ToBN(reserves).toString())

  return r.isZero() ? '0' : b.multipliedBy(TVL).dividedBy(r).toString()
}
