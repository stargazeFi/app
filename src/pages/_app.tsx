import React from 'react'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import { NextUIProvider } from '@nextui-org/react'
import Layout from '@/components/Layout'
import StarknetConfigWithConnectors from '@/components/StarknetConfigWithConnectors'
import '@/styles/globals.css'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <meta name='viewport' content='width=device-width, initial-scale=1.0' />
      </Head>
      <NextUIProvider>
        <StarknetConfigWithConnectors>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </StarknetConfigWithConnectors>
      </NextUIProvider>
    </>
  )
}
