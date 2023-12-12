import { Image, Link, Navbar, NavbarBrand, NavbarContent } from '@nextui-org/react'
import WalletModal from '@/components/WalletModal'

export default function Header() {
  return (
    <Navbar isBlurred={false} maxWidth='2xl' className='bg-transparent'>
      <NavbarBrand>
        <Link href='https://stargaze.finance'>
          <Image src='/assets/brand/logo.svg' width={40} height={40} alt='' />
        </Link>
      </NavbarBrand>
      <NavbarContent justify='end'>
        <WalletModal />
      </NavbarContent>
    </Navbar>
  )
}
