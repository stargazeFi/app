import React from 'react'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import { NextUIProvider } from '@nextui-org/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Header from '@/components/Header'
import StarknetConfigWrapper from '@/components/StarknetConfigWrapper'
import '@/styles/globals.css'

const queryClient = new QueryClient()

export default function App({ Component, pageProps }: AppProps) {
  return (
    <NextUIProvider>
      <Head>
        <meta name='viewport' content='width=device-width, initial-scale=1.0' />
      </Head>
      <QueryClientProvider client={queryClient}>
        <StarknetConfigWrapper>
          <Header />
          <Component {...pageProps} />
        </StarknetConfigWrapper>
      </QueryClientProvider>
    </NextUIProvider>
  )
}
