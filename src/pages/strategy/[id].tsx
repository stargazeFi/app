import { AppLoader } from '@/components/AppLoader'
import { useEffect, useMemo } from 'react'
import { useRouter } from 'next/router'
import { ErrorPage } from '@/components/ErrorPage'
import { Ekubo, LP } from '@/components/Strategy'
import { useStrategiesManager } from '@/hooks'
import { useStrategies } from '@/hooks/api'

export default function Strategy() {
  const router = useRouter()
  const { id } = router.query

  const { data, isLoading, isError } = useStrategies()
  const { strategies, storeStrategies } = useStrategiesManager()

  useEffect(() => data && storeStrategies(data), [data, storeStrategies])

  const strategy = useMemo(() => strategies?.find(({ address }) => id === address), [id, strategies])

  if (isLoading) {
    return <AppLoader />
  }

  if (isError) {
    return <ErrorPage />
  }

  if (!strategy) {
    return <ErrorPage errMessage='Strategy not found.' />
  }

  switch (strategy.type) {
    case 'Range':
      return <Ekubo strategy={strategy} />
    default:
      return <LP strategy={strategy} />
  }
}
