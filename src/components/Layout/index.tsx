import { ReactNode } from 'react'
import Header from '@/components/Header'

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      <Header />
      <main className='relative'>
        <div className='absolute inset-0 z-[-1] h-full w-full bg-cover bg-fixed bg-center bg-no-repeat opacity-50' />
        {children}
      </main>
    </>
  )
}
