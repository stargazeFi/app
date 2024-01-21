import { useAppSelector } from '@/hooks'
import { selectPendingTransactions } from '@/store/appSlice'
import { useAccount, useNetwork } from '@starknet-react/core'
import Link from 'next/link'
import { Image, Navbar, NavbarBrand, NavbarContent, NavbarItem, Spinner } from '@nextui-org/react'
import { Box, MainText } from '@/components/Layout'
import WalletModal from '@/components/WalletModal'
import { useRouter } from 'next/router'
import { goerli } from '@starknet-react/chains'

export default function Header() {
  const { isConnected } = useAccount()
  const { chain } = useNetwork()
  const { pathname } = useRouter()
  const pendingTransactions = useAppSelector(selectPendingTransactions)

  const routes = [
    { url: '/', name: 'EARN' },
    { url: '/portfolio', name: 'PORTFOLIO' }
  ]

  return (
    <>
      {isConnected && chain.id !== goerli.id && (
        <Box center className='h-8 w-full bg-red-900'>
          <MainText>Stargaze is currently in alpha, please switch network to Goerli</MainText>
        </Box>
      )}
      <Navbar className='gradient-dark-element !sticky z-50 mb-10 rounded-xl bg-main/20' maxWidth='full'>
        <NavbarBrand>
          <Link href='https://stargaze.finance'>
            <Image src='/assets/brand/logo.svg' width={40} height={40} alt='' />
          </Link>
        </NavbarBrand>
        <NavbarContent justify='center' className='flex gap-10 xl:gap-20'>
          {routes.map(({ url, name }, index) => {
            const isActive = pathname === url

            return (
              <NavbarItem key={index} className={!isActive ? 'cursor-pointer' : ''} isActive={isActive}>
                <Link href={isActive ? '' : url}>
                  <MainText heading gradient withHover={!isActive} className={isActive ? 'text-white' : ''}>
                    {name}
                  </MainText>
                </Link>
              </NavbarItem>
            )
          })}
        </NavbarContent>
        <NavbarContent justify='end'>
          {!!pendingTransactions.length && (
            <Box center className='relative rounded-3xl border border-gray-500 bg-black/60 p-0.5'>
              <MainText className='absolute'>{pendingTransactions.length}</MainText>
              <Spinner />
            </Box>
          )}
          <WalletModal />
          <Box center className='rounded-md bg-red-900 px-3 py-1.5'>
            <MainText className='text-xs'>Alpha v0.5.0</MainText>
          </Box>
        </NavbarContent>
      </Navbar>
    </>
  )
}
