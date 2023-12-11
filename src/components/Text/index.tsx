import { ReactNode } from 'react'

interface TextProps {
  children: ReactNode
  heading?: boolean
  size?: string
  className?: string
}

export function MainText({ children, className, heading, size, ...props }: TextProps) {
  className += ' bg-gradient-to-br from-white to-zinc-400 bg-clip-text text-center text-transparent '
  className += heading ? 'font-heading' : 'font-body'
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
