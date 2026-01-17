'use client'

import { motion } from 'framer-motion'
import {
  Users,
  DollarSign,
  Code,
  TrendingUp,
  Newspaper,
} from 'lucide-react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { type SignalType, SIGNAL_CONFIGS } from '@/types/signal.types'
import { cn } from '@/lib/utils'

const iconMap = {
  hiring: Users,
  funding: DollarSign,
  techstack: Code,
  expansion: TrendingUp,
  news: Newspaper,
}

interface SignalBadgeProps {
  type: SignalType
  tooltip?: string
  size?: 'sm' | 'md'
  animated?: boolean
}

export function SignalBadge({
  type,
  tooltip,
  size = 'sm',
  animated = true,
}: SignalBadgeProps) {
  const config = SIGNAL_CONFIGS[type]
  const Icon = iconMap[type]

  const badge = (
    <motion.div
      initial={animated ? { scale: 0.8, opacity: 0 } : false}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.05 }}
      className={cn(
        'inline-flex items-center gap-1 rounded-full',
        config.bgColor,
        config.color,
        size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm'
      )}
    >
      <Icon className={cn(size === 'sm' ? 'h-3 w-3' : 'h-4 w-4')} />
      <span>{config.label}</span>
    </motion.div>
  )

  if (tooltip) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>{badge}</TooltipTrigger>
          <TooltipContent side="top" className="max-w-xs">
            {tooltip}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }

  return badge
}
