import { ReactNode, useMemo } from 'react'
import { goerli, mainnet } from '@starknet-react/chains'
import { argent, braavos, Connector, jsonRpcProvider, StarknetConfig } from '@starknet-react/core'
import { constants } from 'starknet'
import { ArgentMobileConnector } from 'starknetkit/dist/connectors'
import { WebWalletConnector } from 'starknetkit/dist/connectors'

export default function StarknetConfigWithConnectors({ children }: { children: ReactNode }) {
  const { chains, provider, connectors } = useMemo(
    () => ({
      connectors: [
        argent(),
        new ArgentMobileConnector({
          dappName: 'Stargaze App',
          description: 'Web application for interacting with Stargaze protocol',
          url: window.location.origin,
          chainId: constants.NetworkName.SN_MAIN
        }),
        braavos(),
        new WebWalletConnector({ url: 'https://web.argent.xyz' })
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
