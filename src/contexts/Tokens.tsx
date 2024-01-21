import { ReactNode, createContext, useMemo, useCallback } from 'react'
import { Spinner } from '@nextui-org/react'
import { Box, Container } from '@/components/Layout'
import { useTokens, usePrices } from '@/hooks/api'
import { TokenInfo } from '@/types'

const DESCRIPTIONS: Record<string, string> = {
  '0x012d537dc323c439dc65c976fad242d5610d27cfb5f31689a0a319b8be7f3d56':
    'Wrapped Bitcoin (WBTC) is the first ERC20 token backed 1:1 with Bitcoin. Completely transparent. 100% verifiable. Community led.',
  '0x03fe2b97c1fd336e750087d68b9b867997fd64a2661ff3ca5a7c771641e8e7ac':
    'Wrapped Bitcoin (WBTC) is the first ERC20 token backed 1:1 with Bitcoin. Completely transparent. 100% verifiable. Community led.',
  '0x00da114221cb83fa859dbdb4c44beeaa0bb37c7537ad5ae66fe5e0efd20e6eb3':
    'Dai is a stablecoin cryptocurrency which aims to keep its value as close to one United States dollar as possible through an automated system of smart contracts on the Ethereum blockchain.',
  '0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7':
    'Ether or ETH is the native currency built on the Ethereum blockchain.',
  '0x0124aeb495b947201f5fac96fd1138e326ad86195b98df6dec9009158a533b49':
    'The $LORDS token is the ERC20 token that powers the Realmverse. It acts as a fungible means of access and exit for the network and is fundamental for gameplay. The $LORDS token can be used to acquire resources, summon armies, construct structures, and various other actions within the Realmverse.',
  '0x070a76fd48ca0ef910631754d77dd822147fe98a569b826ec85e3c33fde586ac':
    'Liquity is a decentralized borrowing protocol that allows you to draw interest-free loans against Ether used as collateral. Loans are paid out in LUSD (a USD pegged stablecoin) and need to maintain a minimum collateral ratio of 110%.',
  '0x0319111a5037cbec2b3e638cc34a3474e2d2608299f3e62866e9cc683208c610':
    'As a Rocket Pool staker, your role is to deposit ETH into the deposit pool which will enable a node operator to create a new Beacon Chain validator. You can stake as little as 0.01 ETH. In doing so, you will be given a token called rETH. rETH represents both how much ETH you deposited, and when you deposited it.',
  '0x049210ffc442172463f3177147c1aeaa36c51d152c1b0630f2364c300d4f48ee':
    'UNI is the governance token for Uniswap. UNI was introduced on 16th September 2020 through a retrospective airdrop to users who have interacted with the protocol either by swapping tokens or by providing liquidity.',
  '0x005a643907b9a4bc6a55e9069c4fd5fd1f5c79a22470690f75556c4736e34426':
    'USDC is a fully collateralized US dollar stablecoin. USDC is issued by regulated financial institutions, backed by fully reserved assets, redeemable on a 1:1 basis for US dollars.',
  '0x053c91253bc9682c04929ca02ed00b3e423f6710d2ee7e0d5ebb06f3ecf368a8':
    'USDC is a fully collateralized US dollar stablecoin. USDC is issued by regulated financial institutions, backed by fully reserved assets, redeemable on a 1:1 basis for US dollars.',
  '0x042b8f0484674ca266ac5d08e4ac6a3fe65bd3129795def2dca5c34ecc5f96d2':
    'Lido is a liquid staking solution for ETH backed by industry-leading staking providers. Lido lets users stake their ETH - without locking assets or maintaining infrastructure - whilst participating in on-chain activities, e.g. lending. Lido attempts to solve the problems associated with initial ETH staking - illiquidity, immovability and accessibility - making staked ETH liquid and allowing for participation with any amount of ETH to improve security of the Ethereum network.',
  '0x068f5c6a61780768455de69077e07e89787839bf8166decfbf92b645209c0fb8':
    'Tether is a stablecoin pegged to the US Dollar. A stablecoin is a type of cryptocurrency whose value is pegged to another fiat currency like the US Dollar or to a commodity like Gold. Tether is the first stablecoin to be created and it is the most popular stablecoin used in the ecosystem.',
  '0x04578fffc279e61b5cb0267a5f8e24b6089d40f93158fbbad2cb23b8622c9233':
    'sfrxETH is a ERC-4626 vault designed to accrue the staking yield of the Frax ETH validators. At any time, frxETH can be exchanged for sfrxETH by depositing it into the sfrxETH vault, which allows users to earn staking yield on their frxETH. Over time, as validators accrue staking yield, an equivalent amount of frxETH is minted and added to the vault, allowing users to redeem their sfrxETH for an greater amount of frxETH than they deposited.'
}

export type TokenContextInfo = TokenInfo & {
  description: string
  price: number
}

type TokenContextState = {
  colors: (item: string) => { background: string; border: string }
  getTokenDescription: (address: string) => string | undefined
  getTokenName: (address: string) => string | undefined
  getTokenSymbol: (address: string) => string | undefined
  tokens: Array<TokenContextInfo>
}

export const TokenContext = createContext<TokenContextState>({
  colors: () => ({ background: '', border: '' }),
  getTokenDescription: () => '',
  getTokenName: () => '',
  getTokenSymbol: () => '',
  tokens: []
})

export const TokensProvider = ({ children }: { children: ReactNode }) => {
  const { data } = useTokens()
  const { data: prices } = usePrices()

  const tokens: TokenContextInfo[] = useMemo(
    () =>
      data?.map((token) => ({
        ...token,
        description: DESCRIPTIONS[token.l2_token_address],
        price: (prices?.find(({ ticker }) => ticker === token.symbol) || { price: 0 }).price
      })) || [],
    [data, prices]
  )

  const colors = useCallback((item: string) => {
    switch (item) {
      case 'USDC':
        return { background: 'bg-usdc/10', border: 'border-usdc' }
      case 'WBTC':
        return { background: 'bg-wbtc/10', border: 'border-wbtc' }
      default:
        return { background: 'bg-eth/10', border: 'border-eth' }
    }
  }, [])

  const getTokenDescription = useCallback(
    (address: string) => tokens.find(({ l2_token_address }) => l2_token_address === address)?.description,
    [tokens]
  )

  const getTokenName = useCallback(
    (address: string) => tokens.find(({ l2_token_address }) => l2_token_address === address)?.name,
    [tokens]
  )

  const getTokenSymbol = useCallback(
    (address: string) => tokens.find(({ l2_token_address }) => l2_token_address === address)?.symbol,
    [tokens]
  )

  if (!tokens) {
    return (
      <Container>
        <Box center className='h-[70vh]'>
          <Spinner size='lg' />
        </Box>
      </Container>
    )
  }

  return (
    <TokenContext.Provider
      value={{
        colors,
        getTokenDescription,
        getTokenName,
        getTokenSymbol,
        tokens
      }}
    >
      {children}
    </TokenContext.Provider>
  )
}
