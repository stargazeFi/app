import { TokenContextItem } from '@/contexts'

export const getTokenDescription = (address: string, tokens: TokenContextItem[]) =>
  tokens.find(({ l2_token_address }) => l2_token_address === address)?.description

export const getTokenIcon = (address: string, tokens: TokenContextItem[]) =>
  `/assets/tokens/${tokens.find(({ l2_token_address }) => l2_token_address === address)?.symbol.toLowerCase()}.svg`

export const getTokenName = (address: string, tokens: TokenContextItem[]) =>
  tokens.find(({ l2_token_address }) => l2_token_address === address)?.name
