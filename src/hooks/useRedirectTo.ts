import { useLocation, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'

export function useRedirectTo(to: Partial<Location>) {
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    navigate(
      {
        ...location,
        ...to
      },
      { replace: true }
    )
  }, [location, navigate, to])
}
