import { useEffect, useMemo } from 'react'
import { useRouter } from 'next/router'
import AppLoader from '@/components/AppLoader'
import ErrorPage from '@/components/ErrorPage'
import { Ekubo, LP } from '@/components/Strategy'
import { useStrategiesManager } from '@/hooks'
import { useStrategies } from '@/hooks/api'

export default function Strategy() {
  const router = useRouter()
  const { id } = router.query

  const { data, isError, isLoading } = useStrategies()
  const { strategies, storeStrategies } = useStrategiesManager()

  const isFetching = useMemo(() => !strategies.length && isLoading, [isLoading, strategies])

  useEffect(() => data && storeStrategies(data), [data, storeStrategies])

  const strategy = useMemo(() => strategies?.find(({ address }) => id === address), [id, strategies])

  if (isFetching) {
    return <AppLoader />
  }

  if (isError) {
    return <ErrorPage />
  }

  if (!strategy) {
    return <ErrorPage errMessage='Invalid strategy.' />
  }

  switch (strategy.type) {
    case 'Range':
      return <Ekubo strategy={strategy} />
    default:
      return <LP strategy={strategy} />
  }
}
