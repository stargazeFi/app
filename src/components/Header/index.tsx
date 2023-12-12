import { Image, Link } from '@nextui-org/react'
import Container from '@/components/Container'
import WalletModal from '@/components/WalletModal'

export default function Header() {
  return (
    <header className='z-50 transition-all duration-200'>
      <Container className='flex w-full justify-between p-4'>
        <Link href='https://stargaze.finance' className='flex'>
          <Image src='/assets/brand/logo.svg' width={40} height={40} alt='' />
        </Link>
        <WalletModal />
      </Container>
    </header>
  )
}
