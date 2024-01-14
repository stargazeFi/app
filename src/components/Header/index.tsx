import { useAppSelector } from '@/hooks'
import { selectPendingTransactions } from '@/store/appSlice'
import { useNetwork } from '@starknet-react/core'
import Link from 'next/link'
import { Image, Navbar, NavbarBrand, NavbarContent, NavbarItem, Spinner } from '@nextui-org/react'
import { AnalyticsOutlined, MonetizationOnOutlined } from '@mui/icons-material'
import { Box, MainText } from '@/components/Layout'
import WalletModal from '@/components/WalletModal'
import { useRouter } from 'next/router'
import { goerli } from '@starknet-react/chains'

export default function Header() {
  const { chain } = useNetwork()
  const { pathname } = useRouter()
  const pendingTransactions = useAppSelector(selectPendingTransactions)

  const routes = [
    { url: '/', name: 'Strategies', icon: <MonetizationOnOutlined className='text-gray-200' /> },
    { url: '/analytics', name: 'Analytics', icon: <AnalyticsOutlined className='text-gray-200' /> }
    // { url: '/dashboard', name: 'Dashboard' }
  ]

  return (
    <>
      {chain.id !== goerli.id && (
        <Box center className='h-8 w-full bg-red-900'>
          <MainText>Stargaze is currently in alpha, please switch network to Goerli</MainText>
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
          {!!pendingTransactions.length && (
            <Box center className='relative rounded-3xl border border-gray-500 bg-black/60 p-0.5'>
              <MainText className='absolute'>{pendingTransactions.length}</MainText>
              <Spinner />
            </Box>
          )}
          <WalletModal />
          <Box center className='rounded-md bg-red-900 px-3 py-1.5'>
            <MainText className='text-xs'>Alpha v0.3.0</MainText>
          </Box>
        </NavbarContent>
      </Navbar>
    </>
  )
}
