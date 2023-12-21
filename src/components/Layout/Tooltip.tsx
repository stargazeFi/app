import React from 'react'
import { Box, MainText } from '@/components/Layout'
import { Tooltip as NextTooltip } from '@nextui-org/react'

export type TooltipProps = {
  children: React.ReactNode
  content: React.ReactNode
  override?: boolean
}

export const Tooltip = ({ content, children, override }: TooltipProps) => (
  <NextTooltip
    color='foreground'
    content={
      override ? (
        content
      ) : (
        <Box className='p-2'>
          <MainText>{content}</MainText>
        </Box>
      )
    }
    delay={0}
    closeDelay={0}
  >
    {children}
  </NextTooltip>
)
