import React from 'react'

type BoxProps = {
  center?: boolean
  children: React.ReactNode
  className?: string
  col?: boolean
}

export const Box = ({ children, center, col, className = '' }: BoxProps) => {
  return (
    <div className={`flex ${col ? 'flex-col' : ''} ${center ? 'items-center justify-center' : ''} ${className}`}>
      {children}
    </div>
  )
}
