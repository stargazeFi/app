import { TokenContextItem } from '@/contexts'

export const getTokenDescription = (address: string, tokens: TokenContextItem[]) =>
  tokens.find(({ l2_token_address }) => l2_token_address === address)?.description

export const getTokenName = (address: string, tokens: TokenContextItem[]) =>
  tokens.find(({ l2_token_address }) => l2_token_address === address)?.name
