import React from 'react'

type BoxProps = {
  children: React.ReactNode
  className?: string
}

export const Box = ({ children, className }: BoxProps) => {
  return <div className={`flex flex-col items-center justify-center ${className}`}>{children}</div>
}
