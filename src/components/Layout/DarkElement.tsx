import React from 'react'
import { Box, BoxProps } from '@/components/Layout'

export const DarkElement = ({ children, center, col, className = '', spaced }: BoxProps) => {
  return (
    <Box
      center={center}
      col={col}
      spaced={spaced}
      className={`gradient-dark-element rounded-xl bg-black/60 p-6 ${className}`}
    >
      {children}
    </Box>
  )
}
