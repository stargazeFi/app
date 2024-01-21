import React from 'react'
import { Spinner } from '@nextui-org/react'
import { Box } from '@/components/Layout'

interface AppLoaderProps {
  className?: string
}

export const AppLoader = ({ className }: AppLoaderProps) => {
  return (
    <Box center className={`h-[70vh] ${className}`}>
      <Spinner size='lg' />
    </Box>
  )
}
