import React from 'react'
import Container from '@/components/Container'

export default function Home() {
  return (
    <>
      <div className='relative w-full'>
        <div
          className='absolute inset-0 z-[0] block h-full w-full bg-center bg-no-repeat opacity-50'
          style={{
            backgroundImage: `url('/assets/general/bg-space.jpg')`
          }}
        />
        <Container className=''>
          <div className='h-[1200px]' />
        </Container>
      </div>
    </>
  )
}
