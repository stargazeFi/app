import React from 'react'
import { Box, BoxProps } from '@/components/Layout/Box'

type ContainerProps = {
  children: React.ReactNode
  className?: string
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'xxl'
}

const maxWidth = {
  sm: 'max-w-4xl',
  md: 'max-w-5xl',
  lg: 'max-w-6xl',
  xl: 'max-w-7xl',
  xxl: 'max-w-[100rem]'
}

export const Container = ({ children, className = '', size = 'xxl' }: ContainerProps) => {
  return (
    <div className={`mx-auto max-w-[1400px] px-4 pb-6 sm:px-6 lg:pb-24 ${maxWidth[size]} ${className}`}>{children}</div>
  )
}

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

export const GrayElement = ({ children, center, col, className = '', spaced }: BoxProps) => {
  return (
    <Box center={center} col={col} spaced={spaced} className={`rounded-lg bg-[#191919] p-3 ${className}`}>
      {children}
    </Box>
  )
}
