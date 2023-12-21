import { NextApiRequest, NextApiResponse } from 'next'
import { Strategy } from '@/api'

const strategies: Strategy[] = [
  {
    name: 'USDC',
    type: 'Direct',
    protocol: 'ekubo',
    description:
      'This strategy uses a volatility-adjusted bollinger band algorithm to dynamically rebalance a tight liquidity range',
    depositFee: 0.01,
    withdrawalFee: 0.005,
    performanceFee: 0.05,
    tokens: ['usdc'],
    APY: 0.09,
    daily: 0.9998,
    TVL: 23828932,
    stargazeTVL: 123321,
    strategyAddress: '0x4248217820918390218758482397bedebfe9042c29e4ab21151f40345f5c288b',
    vaultAddress: '0x4748217820918390218758482397bedebfe9042c29e4ab21151f40345f5c288b',
    lastUpdate: 1703018298000
  },
  {
    name: 'ETH-USDC v2 LBP',
    type: 'LP',
    protocol: 'sithswap',
    poolURL: 'https://sithswap.com/',
    description:
      'This strategy uses a volatility-adjusted bollinger band algorithm to dynamically rebalance a tight liquidity range',
    depositFee: 0,
    withdrawalFee: 0.005,
    performanceFee: 0.05,
    tokens: ['eth', 'usdc'],
    APY: 1.289,
    daily: 0.1,
    TVL: 233321,
    stargazeTVL: 1234,
    strategyAddress: '0x07c18e66743fbf5f03560bf50177bedebfe9042c29e4ab21151f40345f5c288b',
    vaultAddress: '0x07c18e667f3fbf5f03560bf50177bedebfe9042c29e4ab21151f40345f5c288b',
    lastUpdate: 1703018298000
  },
  {
    name: 'ETH-USDC v2 LBP',
    type: 'LP',
    protocol: 'jediswap',
    poolURL: 'https://jediswap.xyz',
    description:
      'This strategy uses a volatility-adjusted bollinger band algorithm to dynamically rebalance a tight liquidity range',
    depositFee: 0.01,
    withdrawalFee: 0.005,
    performanceFee: 0.05,
    tokens: ['eth', 'usdc'],
    APY: 1.289,
    daily: 0.1,
    TVL: 233321,
    stargazeTVL: 1234,
    strategyAddress: '0x17c18e667f3fbf5f03560bf50177be2ebfe9042c29e4ab21151f40345f5c288b',
    vaultAddress: '0x17c18e667f3fbf5f03560bf50177bedebf29042c29e4ab21151f40345f5c288b',
    lastUpdate: 1703018298000
  },
  {
    name: 'ETH-USDC v2 LBP',
    type: 'LP',
    protocol: 'myswap',
    poolURL: 'https://myswap.xyz',
    description:
      'This strategy uses a volatility-adjusted bollinger band algorithm to dynamically rebalance a tight liquidity range',
    depositFee: 0.01,
    withdrawalFee: 0.005,
    performanceFee: 0.05,
    tokens: ['eth', 'usdc'],
    APY: 1.289,
    daily: 0.1,
    TVL: 233321,
    stargazeTVL: 1234,
    strategyAddress: '0x27c18e667f3fbf5f03560bf50177bedebfe9042c29e4a121151f40345f5c288b',
    vaultAddress: '0x27c18e667f3fbf5f03560bf50177bedebfe9042c19e4ab21151f40345f5c288b',
    lastUpdate: 1703018298000
  }
]

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'GET') {
    return res.status(405).json({})
  }

  res.status(200).json(strategies)
}
