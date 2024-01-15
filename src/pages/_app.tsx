import React from 'react'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import { NextUIProvider } from '@nextui-org/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Provider as ReduxProvider } from 'react-redux'
import { PendingTransactionsProvider, TokensProvider } from '@/contexts'
import Header from '@/components/Header'
import StarknetConfigWrapper from '@/components/StarknetConfigWrapper'
import { ToastContainer } from 'react-toastify'
import { store } from '@/store'
import '@/styles/globals.css'
import 'react-toastify/dist/ReactToastify.css'

const queryClient = new QueryClient()

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <meta name='viewport' content='width=device-width, initial-scale=1.0' />
        <link rel='icon' href='/favicon/favicon.ico' />
        <link rel='icon' type='image/png' sizes='16x16' href='/favicon/favicon-16x16.png' />
        <link rel='icon' type='image/png' sizes='32x32' href='/favicon/favicon-32x32.png' />
        <link rel='icon' type='image/png' sizes='192x192' href='/favicon/android-chrome-192x192.png' />
        <link rel='icon' type='image/png' sizes='512x512' href='/favicon/android-chrome-512x512.png' />
        <link rel='apple-touch-icon' type='image/png' href='/favicon/apple-touch-icon.png' />
        <title>Stargaze Finance</title>
      </Head>
      <NextUIProvider>
        <main className='text-foreground dark'>
          <QueryClientProvider client={queryClient}>
            <ReduxProvider store={store}>
              <StarknetConfigWrapper>
                <PendingTransactionsProvider>
                  <ToastContainer
                    position='bottom-right'
                    autoClose={3000}
                    newestOnTop
                    pauseOnFocusLoss
                    draggable={false}
                    pauseOnHover={false}
                  />
                  <Header />
                  <TokensProvider>
                    <Component {...pageProps} />
                  </TokensProvider>
                </PendingTransactionsProvider>
              </StarknetConfigWrapper>
            </ReduxProvider>
          </QueryClientProvider>
        </main>
      </NextUIProvider>
    </>
  )
}
