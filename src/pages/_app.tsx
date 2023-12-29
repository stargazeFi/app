import React from 'react'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import { NextUIProvider } from '@nextui-org/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Provider as ReduxProvider } from 'react-redux'
import { TokensProvider } from '@/contexts'
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
      </Head>
      <NextUIProvider>
        <main className='text-foreground dark'>
          <QueryClientProvider client={queryClient}>
            <ReduxProvider store={store}>
              <StarknetConfigWrapper>
                <TokensProvider>
                  <ToastContainer
                    position='bottom-right'
                    autoClose={3000}
                    newestOnTop
                    pauseOnFocusLoss
                    draggable={false}
                    pauseOnHover={false}
                  />
                  <Header />
                  <Component {...pageProps} />
                </TokensProvider>
              </StarknetConfigWrapper>
            </ReduxProvider>
          </QueryClientProvider>
        </main>
      </NextUIProvider>
    </>
  )
}
