import Decimal from 'decimal.js-light'
import { Amount, Balance, Strategy } from '@/types'

// const Q128 = new Decimal(2).pow(128)
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

const currentPrice = (strategy: Strategy) => strategy.APY
/*
  BigInt(strategy.tokens[0]) > BigInt(strategy.tokens[1])
    ? new Decimal(1).div(new Decimal(typedPoolInfo.sqrt_ratio.toString()).div(Q128).pow(2))
    : new Decimal(typedPoolInfo.sqrt_ratio.toString()).div(Q128).pow(2)
*/

export const computeAmounts = ({
  baseToken,
  displayAmount,
  quoteToken,
  strategy
}: {
  baseToken: Balance
  displayAmount: Amount
  quoteToken: Balance
  strategy: Strategy
}) => {
  const sqrtPriceLower = SQRT_TICK_SIZE.pow(strategy.range![0])
  const sqrtPriceUpper = SQRT_TICK_SIZE.pow(strategy.range![1])

  if ('base' in displayAmount) {
    const { quote, maxLiquidity } = amountsFromSpecifiedAmount({
      amount: {
        base: new Decimal(Number(displayAmount.base)).mul(new Decimal(10).pow(baseToken.decimals)).toInteger()
      },
      sqrtPrice: new Decimal(currentPrice(strategy)).sqrt(),
      sqrtPriceLower,
      sqrtPriceUpper
    })

    return {
      maxLiquidity: BigInt(maxLiquidity.toFixed(0, Decimal.ROUND_DOWN)),
      base: displayAmount.base,
      quote: quote.div(new Decimal(10).pow(quoteToken.decimals)).toFixed(quoteToken.decimals, Decimal.ROUND_DOWN)
    }
  } else {
    const { base, maxLiquidity } = amountsFromSpecifiedAmount({
      amount: {
        quote: new Decimal(Number(displayAmount.quote)).mul(new Decimal(10).pow(quoteToken.decimals)).toInteger()
      },
      sqrtPrice: new Decimal(currentPrice(strategy)).sqrt(),
      sqrtPriceLower,
      sqrtPriceUpper
    })
    return {
      maxLiquidity: BigInt(maxLiquidity.toFixed(0, Decimal.ROUND_DOWN)),
      base: base.div(new Decimal(10).pow(baseToken.decimals)).toFixed(baseToken.decimals, Decimal.ROUND_DOWN),
      quote: displayAmount.quote
    }
  }
}
