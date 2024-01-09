import { MouseEventHandler, ReactNode } from 'react'
import { Button } from '@nextui-org/react'

interface ButtonProps {
  children: ReactNode
  onClick: MouseEventHandler<HTMLButtonElement>
  className?: string
  isDisabled?: boolean
  startContent?: ReactNode
}

export const MainButton = ({ children, isDisabled, onClick, startContent, className }: ButtonProps) => (
  <Button
    radius='sm'
    isDisabled={isDisabled}
    onClick={onClick}
    startContent={startContent}
    variant='bordered'
    className={`flex items-center justify-center border border-gray-500 bg-black/60 ${className}`}
  >
    {children}
  </Button>
)
