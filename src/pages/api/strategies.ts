import { NextApiRequest, NextApiResponse } from 'next'
import { Strategy } from '@/api'

const strategies: Strategy[] = [
  {
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
  },
  {
    name: 'USDC-LUSD',
    type: 'LP',
    protocol: 'sithswap',
    poolURL: 'https://sithswap.com/',
    description:
      'This strategy uses a volatility-adjusted bollinger band algorithm to dynamically rebalance a tight liquidity range',
    depositFee: 0,
    withdrawalFee: 0.005,
    performanceFee: 0.05,
    tokens: [
      '0x053c91253bc9682c04929ca02ed00b3e423f6710d2ee7e0d5ebb06f3ecf368a8',
      '0x070a76fd48ca0ef910631754d77dd822147fe98a569b826ec85e3c33fde586ac'
    ],
    APY: 1.289,
    daily: 0.1,
    TVL: 233321,
    stargazeTVL: 1234,
    strategyAddress: '0x07c18e66743fbf5f03560bf50177bedebfe9042c29e4ab21151f40345f5c288b',
    vaultAddress: '0x07c18e667f3fbf5f03560bf50177bedebfe9042c29e4ab21151f40345f5c288b',
    lastUpdate: 1703018298000
  },
  {
    name: 'ETH-DAI v2 LBP',
    type: 'LP',
    protocol: 'jediswap',
    poolURL: 'https://jediswap.xyz',
    description:
      'This strategy uses a volatility-adjusted bollinger band algorithm to dynamically rebalance a tight liquidity range',
    depositFee: 0.01,
    withdrawalFee: 0.005,
    performanceFee: 0.05,
    tokens: [
      '0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7',
      '0x00da114221cb83fa859dbdb4c44beeaa0bb37c7537ad5ae66fe5e0efd20e6eb3'
    ],
    APY: 1.289,
    daily: 0.1,
    TVL: 233321,
    stargazeTVL: 1234,
    strategyAddress: '0x17c18e667f3fbf5f03560bf50177be2ebfe9042c29e4ab21151f40345f5c288b',
    vaultAddress: '0x17c18e667f3fbf5f03560bf50177bedebf29042c29e4ab21151f40345f5c288b',
    lastUpdate: 1703018298000
  },
  {
    name: 'LORDS-rETH v3',
    type: 'LP',
    protocol: 'myswap',
    poolURL: 'https://myswap.xyz',
    description:
      'This strategy uses a volatility-adjusted bollinger band algorithm to dynamically rebalance a tight liquidity range',
    depositFee: 0.01,
    withdrawalFee: 0.005,
    performanceFee: 0.05,
    tokens: [
      '0x0124aeb495b947201f5fac96fd1138e326ad86195b98df6dec9009158a533b49',
      '0x0319111a5037cbec2b3e638cc34a3474e2d2608299f3e62866e9cc683208c610'
    ],
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
