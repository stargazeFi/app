import React from 'react'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import { NextUIProvider } from '@nextui-org/react'
import Layout from '@/components/Layout'

import '@/styles/globals.css'
import StarknetConfigWithConnectors from '@/components/StarknetConfigWithConnectors'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <NextUIProvider>
      <Head>
        <meta name='viewport' content='width=device-width, initial-scale=1.0' />
      </Head>
      <StarknetConfigWithConnectors>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </StarknetConfigWithConnectors>
    </NextUIProvider>
  )
}
