import { Image, Link, Navbar, NavbarBrand, NavbarContent, NavbarItem } from '@nextui-org/react'
import { useLocation } from 'react-router-dom'
import WalletModal from '@/components/WalletModal'
import { MainText } from '@/components/Text'

export default function Header() {
  const { pathname } = useLocation()

  const routes = [
    { url: '/', name: 'Strategies' }
    // { url: '/dashboard', name: 'Dashboard' },
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
        {routes.map(({ url, name }, index) => (
          <NavbarItem key={index} className={pathname !== url ? 'cursor-pointer' : ''} isActive={pathname === url}>
            <Link href={url}>
              <MainText>{name}</MainText>
            </Link>
          </NavbarItem>
        ))}
      </NavbarContent>
      <NavbarContent justify='end'>
        <WalletModal />
      </NavbarContent>
    </Navbar>
  )
}
