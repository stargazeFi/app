import { ReactNode } from 'react'

type ContainerProps = {
  children: ReactNode
  className?: string
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'xxl'
  id?: string
}

const maxWidth = {
  sm: 'max-w-4xl',
  md: 'max-w-5xl',
  lg: 'max-w-6xl',
  xl: 'max-w-7xl',
  xxl: 'max-w-[100rem]'
}

export default function Container({ children, className, size = 'xxl', id }: ContainerProps): JSX.Element {
  return (
    <div id={id} className={`mx-auto w-full px-4 sm:px-6 lg:px-8 ${maxWidth[size]} ${className}`}>
      {children}
    </div>
  )
}
