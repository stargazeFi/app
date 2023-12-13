import React from 'react'

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
  return <div className={`mx-auto w-full px-4 sm:px-6 lg:px-8 ${maxWidth[size]} ${className}`}>{children}</div>
}
