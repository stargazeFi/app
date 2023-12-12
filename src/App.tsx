import { NextUIProvider } from '@nextui-org/react'
import { Route, Routes, useNavigate } from 'react-router-dom'
import PageNotFound from '@/pages/PageNotFound'
import Strategies from '@/pages/Strategies'
import Header from '@/components/Header'
import '@/styles/globals.css'

export default function App() {
  const navigate = useNavigate()

  return (
    <NextUIProvider navigate={navigate}>
      <Header />
      <Routes>
        <Route index path='/' element={<Strategies />} />
        <Route path='*' element={<PageNotFound />} />
      </Routes>
    </NextUIProvider>
  )
}
