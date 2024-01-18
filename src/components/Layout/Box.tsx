import React, { ForwardedRef, forwardRef } from 'react'

export type BoxProps = {
  center?: boolean
  children: React.ReactNode
  className?: string
  col?: boolean
  spaced?: boolean
}

export const Box = forwardRef(
  ({ children, center, col, className = '', spaced }: BoxProps, ref: ForwardedRef<HTMLDivElement | null>) => {
    let style = 'flex'
    if (col) {
      style += ' flex-col'
    }

    if (center) {
      style += ' items-center justify-center'
    } else if (spaced) {
      style += ' justify-between'
    }

    return (
      <div ref={ref} className={style + ' ' + className}>
        {children}
      </div>
    )
  }
)
