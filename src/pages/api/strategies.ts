import { NextApiRequest, NextApiResponse } from 'next'
import { Strategy } from '@/api'

const strategies: Strategy[] = [
  /* {
    name: 'WBTC',
    type: 'Direct',
    protocol: 'ekubo',
    description:
      'This strategy uses a volatility-adjusted bollinger band algorithm to dynamically rebalance a tight liquidity range',
    depositFee: 0.01,
    withdrawalFee: 0.005,
    performanceFee: 0.05,
    tokens: ['0x03fe2b97c1fd336e750087d68b9b867997fd64a2661ff3ca5a7c771641e8e7ac'],
    APY: 0.09,
    daily: 0.9998,
    TVL: 23828932,
    stargazeTVL: 123321,
    strategyAddress: '0x4248217820918390218758482397bedebfe9042c29e4ab21151f40345f5c288b',
    vaultAddress: '0x4748217820918390218758482397bedebfe9042c29e4ab21151f40345f5c288b',
    lastUpdate: 1703018298000
  }, */
  {
    name: 'USDC/ETH VLP #7',
    type: 'LP',
    protocol: 'sithswap',
    poolToken: '0x0490ae81d31d6d0a255e0cf1f27ac393d28911526c5bbdc1519f34059e6b143c',
    poolURL: 'https://app.sithswap.com/add/0x0490ae81d31d6d0a255e0cf1f27ac393d28911526c5bbdc1519f34059e6b143c/',
    description:
      'This strategy uses a volatility-adjusted bollinger band algorithm to dynamically rebalance a tight liquidity range',
    depositFee: 0.01,
    withdrawalFee: 0.005,
    performanceFee: 0.05,
    tokens: [
      '0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7',
      '0x005a643907b9a4bc6a55e9069c4fd5fd1f5c79a22470690f75556c4736e34426'
    ],
    APY: 1.289,
    daily: 0.1,
    TVL: 233321,
    stargazeTVL: 1234,
    strategyAddress: '0x7e4f839aabe3dbcc077b965a9d67b6c068b4e6bc1b91fc8e706cbac792777b4',
    vaultAddress: '0x6f6ce52b557eaef4f318640df5b3b72d15125b89abfb85e22463548c6eb0c8d',
    lastUpdate: 1703018298000
  } /*,
  {
    name: 'ETH-mERC20 v2 LBP',
    type: 'LP',
    protocol: 'jediswap',
    poolToken: '',
    poolURL: 'https://jediswap.xyz',
    description:
      'This strategy uses a volatility-adjusted bollinger band algorithm to dynamically rebalance a tight liquidity range',
    depositFee: 0.01,
    withdrawalFee: 0.005,
    performanceFee: 0.05,
    tokens: [
      '0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7',
      '0x01c4a2899632ea4001a6104b521b41b639f2dba5019f177c3c439095df95d3c8'
    ],
    APY: 1.289,
    daily: 0.1,
    TVL: 233321,
    stargazeTVL: 1234,
    strategyAddress: '0x17c18e667f3fbf5f03560bf50177be2ebfe9042c29e4ab21151f40345f5c288b',
    vaultAddress: '0x17c18e667f3fbf5f03560bf50177bedebf29042c29e4ab21151f40345f5c288b',
    lastUpdate: 1703018298000
  }*/
]

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'GET') {
    return res.status(405).json({})
  }

  res.status(200).json(strategies)
}
