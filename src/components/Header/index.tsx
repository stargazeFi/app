import Link from 'next/link'
import { Image, Navbar, NavbarBrand, NavbarContent, NavbarItem } from '@nextui-org/react'
import { CurrencyExchange } from '@mui/icons-material'
import { Box, MainText } from '@/components/Layout'
import WalletModal from '@/components/WalletModal'
import { useRouter } from 'next/router'

export default function Header() {
  const { pathname } = useRouter()

  const routes = [
    { url: '/', name: 'Strategies', icon: <CurrencyExchange fontSize='inherit' className='text-gray-200' /> }
    // { url: '/dashboard', name: 'Dashboard' }
    // { url: '/analytics', name: 'Analytics' }
  ]

  return (
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
        <Box center className='rounded-md bg-red-900 px-3 py-1.5'>
          <MainText className='text-xs'>Alpha v0.3.0</MainText>
        </Box>
      </NavbarContent>
    </Navbar>
  )
}
