import { useNetwork } from '@starknet-react/core'
import Link from 'next/link'
import { Image, Navbar, NavbarBrand, NavbarContent, NavbarItem } from '@nextui-org/react'
import { CurrencyExchange } from '@mui/icons-material'
import { Box, MainText } from '@/components/Layout'
import WalletModal from '@/components/WalletModal'
import { useRouter } from 'next/router'
import { useMemo } from 'react'

export default function Header() {
  const { chain } = useNetwork()
  const { pathname } = useRouter()

  const wrongEnv = useMemo(() => {
    const prod = 'https://app.stargaze.finance'
    const dev = 'https://nyanya.stargaze.finance'
    const { host } = window.location

    return host === prod && chain.testnet ? dev : host === dev && !chain.testnet ? prod : false
  }, [chain])

  const routes = [
    { url: '/', name: 'Strategies', icon: <CurrencyExchange fontSize='inherit' className='text-gray-200' /> }
    // { url: '/dashboard', name: 'Dashboard' }
    // { url: '/analytics', name: 'Analytics' }
  ]

  return (
    <>
      {wrongEnv && (
        <Box center className='h-10 w-full bg-red-700'>
          <MainText>
            Wrong network, change network or go to <a href={wrongEnv}>{wrongEnv}</a>
          </MainText>
        </Box>
      )}
      <Navbar position='static' isBlurred={false} maxWidth='xl' className='mb-10 bg-transparent'>
        <NavbarBrand>
          <Link href='https://stargaze.finance'>
            <Image src='/assets/brand/logo.svg' width={40} height={40} alt='' />
          </Link>
        </NavbarBrand>
        <NavbarContent justify='center' className='flex gap-10 xl:gap-20'>
          {routes.map(({ url, name, icon }, index) => (
            <NavbarItem key={index} className={pathname !== url ? 'cursor-pointer' : ''} isActive={pathname === url}>
              <Link href={pathname === url ? '' : url}>
                <Box center>
                  {icon}
                  <MainText gradient className='ml-2'>
                    {name}
                  </MainText>
                </Box>
              </Link>
            </NavbarItem>
          ))}
        </NavbarContent>
        <NavbarContent justify='end'>
          <WalletModal />
        </NavbarContent>
      </Navbar>
    </>
  )
}
