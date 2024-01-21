import { AppLoader } from '@/components/AppLoader'
import { useMemo } from 'react'
import { useRouter } from 'next/router'
import { ErrorPage } from '@/components/ErrorPage'
import { Ekubo, LP } from '@/components/Strategy'
import { useStrategies } from '@/hooks/api'

export default function Strategy() {
  const router = useRouter()
  const { id } = router.query

  const { data, isLoading, isError } = useStrategies()

  const strategy = useMemo(() => data?.find(({ address }) => id === address), [data, id])

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
