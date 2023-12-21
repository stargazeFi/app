import React from 'react'

export type BoxProps = {
  center?: boolean
  children: React.ReactNode
  className?: string
  col?: boolean
  spaced?: boolean
}

export const Box = ({ children, center, col, className = '', spaced }: BoxProps) => {
  let style = 'flex'
  if (col) {
    style += ' flex-col'
  }

  if (center) {
    style += ' items-center justify-center'
  } else if (spaced) {
    style += ' justify-between'
  }

  return <div className={style + ' ' + className}>{children}</div>
}
