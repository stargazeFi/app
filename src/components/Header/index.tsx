import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Container from '@/components/Container'
import { useScrollDirection } from '@/hooks'

export default function Header() {
  const scrollDirection = useScrollDirection()

  // check the scroll position is at the top of the page
  function isScrolledToTop() {
    if (typeof window !== 'undefined') {
      return window.scrollY === 0
    }
  }

  return (
    <header
      className={`sticky ${scrollDirection === 'down' ? '-top-24' : 'top-0'} ${
        isScrolledToTop() ? ' shadow-none ' : ''
      } z-50 transition-all duration-200`}
    >
      <Container className='flex w-full justify-between p-4'>
        <Link href='/' className='flex'>
          <Image src='/assets/brand/logo.svg' width={40} height={40} alt='' />
        </Link>
      </Container>
    </header>
  )
}
