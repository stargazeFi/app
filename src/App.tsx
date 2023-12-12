import { Route, Routes } from 'react-router-dom'
import Home from '@/pages/Home'
import PageNotFound from '@/pages/PageNotFound'
import Header from '@/components/Header'
import '@/styles/globals.css'

export default function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route index path='/' element={<Home />} />
        <Route path='*' element={<PageNotFound />} />
      </Routes>
    </>
  )
}
