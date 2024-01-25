import React from 'react'
import { MainText } from '@/components/Layout'
import { Tooltip as NextTooltip } from '@nextui-org/react'

export type TooltipProps = {
  children: React.ReactNode
  content: React.ReactNode
}

export const Tooltip = ({ content, children }: TooltipProps) => (
  <NextTooltip
    content={
      <MainText className='bg-gradient-to-br from-zinc-200 to-gray-200 bg-clip-text text-transparent'>
        {content}
      </MainText>
    }
    classNames={{
      base: ['rounded-lg border-1 border-gray-500 p-1 bg-[#191919]'],
      content: 'bg-transparent'
    }}
    delay={0}
    closeDelay={0}
  >
    {children}
  </NextTooltip>
)
