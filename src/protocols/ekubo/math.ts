import Decimal from 'decimal.js-light'
import { Amounts, Balance, Strategy } from '@/types'
import { Result } from 'starknet'

const Q128 = new Decimal(2).pow(128)
const TICK_SIZE = new Decimal('1.000001')
const SQRT_TICK_SIZE = TICK_SIZE.sqrt()

const liquidityToAmountBase = ({
  sqrtPriceLower,
  sqrtPriceUpper,
  liquidity
}: {
  liquidity: Decimal
  sqrtPriceLower: Decimal
  sqrtPriceUpper: Decimal
}): Decimal => {
  return liquidity.mul(sqrtPriceUpper.sub(sqrtPriceLower)).div(sqrtPriceLower.mul(sqrtPriceUpper))
}

const liquidityToAmountQuote = ({
  sqrtPriceLower,
  sqrtPriceUpper,
  liquidity
}: {
  liquidity: Decimal
  sqrtPriceLower: Decimal
  sqrtPriceUpper: Decimal
}): Decimal => {
  return liquidity.mul(sqrtPriceUpper.sub(sqrtPriceLower))
}

const maxLiquidityForBaseToken = ({
  sqrtPriceLower,
  sqrtPriceUpper,
  amount
}: {
  amount: Decimal
  sqrtPriceLower: Decimal
  sqrtPriceUpper: Decimal
}): Decimal => {
  if (amount.eq(0)) {
    return new Decimal(0)
  }
  return sqrtPriceLower.mul(sqrtPriceUpper).mul(amount).div(sqrtPriceUpper.sub(sqrtPriceLower))
}

const maxLiquidityForQuoteToken = ({
  sqrtPriceLower,
  sqrtPriceUpper,
  amount
}: {
  amount: Decimal
  sqrtPriceLower: Decimal
  sqrtPriceUpper: Decimal
}): Decimal => {
  if (amount.eq(0)) {
    return new Decimal(0)
  }
  return amount.div(sqrtPriceUpper.sub(sqrtPriceLower))
}

const maxLiquidityForSpecifiedAmount = ({
  sqrtPrice,
  sqrtPriceUpper,
  sqrtPriceLower,
  amount
}: {
  amount: { base: Decimal } | { quote: Decimal }
  sqrtPrice: Decimal
  sqrtPriceLower: Decimal
  sqrtPriceUpper: Decimal
}): Decimal => {
  if (sqrtPrice.lte(sqrtPriceLower)) {
    return 'base' in amount
      ? maxLiquidityForBaseToken({
          sqrtPriceLower,
          sqrtPriceUpper,
          amount: amount.base
        })
      : new Decimal(0)
  } else if (sqrtPrice.lt(sqrtPriceUpper)) {
    return 'base' in amount
      ? maxLiquidityForBaseToken({
          sqrtPriceLower: sqrtPrice,
          sqrtPriceUpper,
          amount: amount.base
        })
      : maxLiquidityForQuoteToken({
          sqrtPriceLower,
          sqrtPriceUpper: sqrtPrice,
          amount: amount.quote
        })
  } else {
    return 'quote' in amount
      ? maxLiquidityForQuoteToken({
          sqrtPriceLower,
          sqrtPriceUpper,
          amount: amount.quote
        })
      : new Decimal(0)
  }
}

const amountsFromSpecifiedAmount = ({
  sqrtPrice,
  sqrtPriceUpper,
  sqrtPriceLower,
  amount
}: {
  amount: { base: Decimal } | { quote: Decimal }
  sqrtPrice: Decimal
  sqrtPriceLower: Decimal
  sqrtPriceUpper: Decimal
}): { base: Decimal; quote: Decimal; maxLiquidity: Decimal } => {
  const maxLiquidity = maxLiquidityForSpecifiedAmount({
    sqrtPrice,
    sqrtPriceLower,
    sqrtPriceUpper,
    amount
  })

  if ('base' in amount) {
    if (sqrtPrice.lt(sqrtPriceLower)) {
      return {
        maxLiquidity,
        base: amount.base,
        quote: liquidityToAmountQuote({
          liquidity: maxLiquidity,
          sqrtPriceLower,
          sqrtPriceUpper
        })
      }
    } else if (sqrtPrice.lt(sqrtPriceUpper)) {
      return {
        maxLiquidity,
        base: amount.base,
        quote: liquidityToAmountQuote({
          liquidity: maxLiquidity,
          sqrtPriceLower,
          sqrtPriceUpper: sqrtPrice
        })
      }
    } else {
      return { maxLiquidity, base: amount.base, quote: new Decimal(0) }
    }
  } else {
    if (sqrtPrice.lt(sqrtPriceLower)) {
      return { maxLiquidity, quote: amount.quote, base: new Decimal(0) }
    } else if (sqrtPrice.lt(sqrtPriceUpper)) {
      return {
        maxLiquidity,
        quote: amount.quote,
        base: liquidityToAmountBase({
          liquidity: maxLiquidity,
          sqrtPriceLower: sqrtPrice,
          sqrtPriceUpper
        })
      }
    } else {
      return {
        maxLiquidity,
        quote: amount.quote,
        base: liquidityToAmountBase({
          liquidity: maxLiquidity,
          sqrtPriceLower,
          sqrtPriceUpper
        })
      }
    }
  }
}

const computePrice = (sqrtRatio: bigint, strategy: Strategy) =>
  BigInt(strategy.tokens[0]) > BigInt(strategy.tokens[1])
    ? new Decimal(1).div(new Decimal(sqrtRatio.toString()).div(Q128).pow(2))
    : new Decimal(sqrtRatio.toString()).div(Q128).pow(2)

export const parseAmounts = (
  baseToken: Balance,
  quoteToken: Balance,
  displayAmounts: Amounts,
  strategy: Strategy,
  poolPrice?: Result
) => {
  let amounts: Amounts = { base: '0', quote: '0', maxLiquidity: 0n }

  if (poolPrice) {
    const sqrtPriceLower = SQRT_TICK_SIZE.pow(BigInt(strategy.position!.bounds[0]).toString())
    const sqrtPriceUpper = SQRT_TICK_SIZE.pow(BigInt(strategy.position!.bounds[1]).toString())
    const currentPrice = computePrice((poolPrice as { sqrt_ratio: bigint }).sqrt_ratio, strategy)

    if ('base' in displayAmounts && !isNaN(Number(displayAmounts.base))) {
      const { quote, maxLiquidity } = amountsFromSpecifiedAmount({
        amount: {
          base: new Decimal(Number(displayAmounts.base)).mul(new Decimal(10).pow(baseToken.decimals)).toInteger()
        },
        sqrtPrice: new Decimal(currentPrice).sqrt(),
        sqrtPriceLower,
        sqrtPriceUpper
      })

      amounts = {
        maxLiquidity: BigInt(maxLiquidity.toFixed(0, Decimal.ROUND_DOWN)),
        base: displayAmounts.base,
        quote: quote.div(new Decimal(10).pow(quoteToken.decimals)).toFixed(quoteToken.decimals, Decimal.ROUND_DOWN)
      }
    } else if ('quote' in displayAmounts && !isNaN(Number(displayAmounts.quote))) {
      const { base, maxLiquidity } = amountsFromSpecifiedAmount({
        amount: {
          quote: new Decimal(Number(displayAmounts.quote)).mul(new Decimal(10).pow(quoteToken.decimals)).toInteger()
        },
        sqrtPrice: new Decimal(currentPrice).sqrt(),
        sqrtPriceLower,
        sqrtPriceUpper
      })
      amounts = {
        maxLiquidity: BigInt(maxLiquidity.toFixed(0, Decimal.ROUND_DOWN)),
        base: base.div(new Decimal(10).pow(baseToken.decimals)).toFixed(baseToken.decimals, Decimal.ROUND_DOWN),
        quote: displayAmounts.quote
      }
    }
  }

  return amounts
}
