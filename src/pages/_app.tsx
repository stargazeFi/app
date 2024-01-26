import type { AppProps } from 'next/app'
import React, { useState } from 'react'
import Head from 'next/head'
import { NextUIProvider } from '@nextui-org/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Provider as ReduxProvider } from 'react-redux'
import { BalancesProvider, DepositsProvider, PendingTransactionsProvider, TokensProvider } from '@/contexts'
import Header from '@/components/Header'
import StarknetConfigWrapper from '@/components/StarknetConfigWrapper'
import { ToastContainer } from 'react-toastify'
import { store } from '@/store'
import '@/styles/globals.css'
import 'react-toastify/dist/ReactToastify.css'

export default function App({ Component, pageProps }: AppProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000
          }
        }
      })
  )

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
                  <DepositsProvider>
                    <BalancesProvider>
                      <PendingTransactionsProvider>
                        <Component {...pageProps} />
                      </PendingTransactionsProvider>
                    </BalancesProvider>
                  </DepositsProvider>
                </TokensProvider>
              </StarknetConfigWrapper>
            </ReduxProvider>
          </QueryClientProvider>
        </main>
      </NextUIProvider>
    </>
  )
}
