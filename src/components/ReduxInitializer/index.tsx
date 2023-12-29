import React, { useEffect } from 'react'

interface ReduxInitializerProps {
  children: React.ReactNode
}

export default function ReduxInitializer({ children }: ReduxInitializerProps) {
  const dispatch = useDispatch()

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const userFromLocalStorage = localStorage.getItem('user')
      const tokenFromLocalStorage = localStorage.getItem('access_token')

      if (userFromLocalStorage) {
        dispatch(setUser(JSON.parse(userFromLocalStorage) as User))
      }

      if (tokenFromLocalStorage) {
        dispatch(setToken(tokenFromLocalStorage))
      }
    }
  }, [dispatch])

  return children
}
