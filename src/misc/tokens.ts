import { TokenContextInfo } from '@/contexts'

export const getTokenDescription = (address: string, tokens: TokenContextInfo[]) =>
  tokens.find(({ l2_token_address }) => l2_token_address === address)?.description

export const getTokenIcon = (address: string, tokens: TokenContextInfo[]) =>
  `/assets/tokens/${tokens.find(({ l2_token_address }) => l2_token_address === address)?.symbol.toLowerCase()}.svg`

export const getTokenName = (address: string, tokens: TokenContextInfo[]) =>
  tokens.find(({ l2_token_address }) => l2_token_address === address)?.name
