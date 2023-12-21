import { ReactNode } from 'react'

interface TextProps {
  children: ReactNode
  gradient?: boolean
  heading?: boolean
  size?: string
  className?: string
}

export const MainText = ({ children, className, gradient, heading, size, ...props }: TextProps) => {
  className += ' text-center'
  className += heading ? ' font-heading' : ' font-body'
  if (gradient) {
    className += ' bg-gradient-to-br from-gray-300 to-zinc-400 bg-clip-text text-transparent'
  }

  if (size === 'h1') {
    className += ' text-4xl'
  } else {
    className += ` text-${size}`
  }

  return (
    <span className={className} {...props}>
      {children}
    </span>
  )
}

export const SecondaryText = ({ children }: { children: ReactNode }) => (
  <MainText className='!text-left !text-sm text-gray-300'>{children}</MainText>
)
