import { useEffect } from 'react'
import { useRouter } from 'next/router'

export default function RedirectionToStrategies() {
  const router = useRouter()

  useEffect(() => {
    router.push('/').then()
  }, [router])

  return null
}
