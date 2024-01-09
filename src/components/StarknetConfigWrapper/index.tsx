import { ReactNode, useMemo } from 'react'
import { goerli, mainnet } from '@starknet-react/chains'
import { argent, braavos, Connector, jsonRpcProvider, StarknetConfig } from '@starknet-react/core'
import { constants } from 'starknet'
// @ts-expect-error package is here
import { ArgentMobileConnector } from 'starknetkit/argentMobile'

export default function StarknetConfigWrapper({ children }: { children: ReactNode }) {
  const { chains, provider, connectors } = useMemo(
    () => ({
      connectors: [
        braavos(),
        argent(),
        new ArgentMobileConnector({
          dappName: 'Stargaze App',
          description: 'Web application for interacting with Stargaze protocol',
          url: 'https://app.stargaze.finance',
          chainId: constants.NetworkName.SN_MAIN
        })
      ] as Connector[],
      provider: jsonRpcProvider({
        rpc: (chain) => {
          if (chain.id === mainnet.id) {
            return {
              chainId: constants.StarknetChainId.SN_MAIN,
              nodeUrl: `https://starknet-goerli.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_STARKNET_ALCHEMY_KEY}`
            }
          } else if (chain.id === goerli.id) {
            return {
              chainId: constants.StarknetChainId.SN_GOERLI,
              nodeUrl: `https://starknet-goerli.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_STARKNET_GOERLI_ALCHEMY_KEY}`
            }
          }
          throw new Error(`Unrecognized chain ID: ${chain.id}`)
        }
      }),
      chains: [mainnet, goerli]
    }),
    []
  )

  return (
    <StarknetConfig chains={chains} provider={provider} connectors={connectors} autoConnect>
      {children}
    </StarknetConfig>
  )
}
