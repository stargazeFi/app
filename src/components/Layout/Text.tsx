import { ReactNode } from 'react'

interface TextProps {
  children: ReactNode
  gradient?: boolean
  heading?: boolean
  className?: string
}

export const MainText = ({ children, className, gradient, heading, ...props }: TextProps) => {
  className += ' text-center'
  className += heading ? ' font-heading' : ' font-body'
  if (gradient) {
    className += ' bg-gradient-to-br from-gray-300 to-zinc-400 bg-clip-text text-transparent'
  }

  return (
    <span className={className} {...props}>
      {children}
    </span>
  )
}

export const SecondaryText = ({ children, className }: { children: ReactNode; className?: string }) => (
  <MainText className={`!text-left text-sm text-gray-300 ${className}`}>{children}</MainText>
)
