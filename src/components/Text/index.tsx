import { ReactNode } from 'react'

interface TextProps {
  children: ReactNode
  gradient?: boolean
  heading?: boolean
  size?: string
  className?: string
}

export function MainText({ children, className, gradient, heading, size, ...props }: TextProps) {
  className += ' text-center'
  className += heading ? ' font-heading' : ' font-body'
  if (gradient) {
    className += ' bg-gradient-to-br from-white to-zinc-400 bg-clip-text text-transparent'
  }
  if (size === 'xs') {
    className += ' text-xs'
  } else if (size === 'md') {
    className += ' text-md'
  } else if (size === 'lg') {
    className += ' text-lg'
  } else if (size === 'xl') {
    className += ' text-xl'
  } else if (size === '2xl') {
    className += ' text-2xl'
  }

  return (
    <span className={className} {...props}>
      {children}
    </span>
  )
}
