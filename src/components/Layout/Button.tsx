import { MouseEventHandler, ReactNode } from 'react'
import { Button } from '@nextui-org/react'

interface ButtonProps {
  children: ReactNode
  onClick: MouseEventHandler<HTMLButtonElement>
  className?: string
  isDisabled?: boolean
  size?: 'sm' | 'md' | 'lg'
  startContent?: ReactNode
}

export const MainButton = ({ children, isDisabled, onClick, size = 'md', startContent, className }: ButtonProps) => (
  <Button
    radius='sm'
    isDisabled={isDisabled}
    onClick={onClick}
    size={size}
    startContent={startContent}
    className={`flex items-center justify-center bg-palette1/60 ${className}`}
  >
    {children}
  </Button>
)
