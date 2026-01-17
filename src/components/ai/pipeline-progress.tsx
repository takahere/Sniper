'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Search, Brain, Pencil, Check, AlertCircle, Loader2 } from 'lucide-react'
import type { NodeProgress, NodeStatus } from '@/lib/agent'
import { cn } from '@/lib/utils'

interface PipelineProgressProps {
  progress: NodeProgress
  currentNode: string | null
  className?: string
}

interface NodeConfig {
  id: keyof NodeProgress
  label: string
  icon: React.ComponentType<{ className?: string }>
  description: string
}

const nodes: NodeConfig[] = [
  {
    id: 'researcher',
    label: 'Research',
    icon: Search,
    description: 'Gathering company intel',
  },
  {
    id: 'analyst',
    label: 'Analyze',
    icon: Brain,
    description: 'Extracting signals',
  },
  {
    id: 'copywriter',
    label: 'Draft',
    icon: Pencil,
    description: 'Writing email',
  },
]

function NodeIndicator({
  config,
  status,
  isActive,
}: {
  config: NodeConfig
  status: NodeStatus
  isActive: boolean
}) {
  const Icon = config.icon

  return (
    <motion.div
      className={cn(
        'relative flex flex-col items-center gap-2',
        status === 'completed' && 'text-emerald-500',
        status === 'running' && 'text-blue-500',
        status === 'error' && 'text-red-500',
        status === 'pending' && 'text-zinc-500'
      )}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Icon container */}
      <div
        className={cn(
          'relative flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all duration-300',
          status === 'completed' && 'border-emerald-500 bg-emerald-500/10',
          status === 'running' && 'border-blue-500 bg-blue-500/10',
          status === 'error' && 'border-red-500 bg-red-500/10',
          status === 'pending' && 'border-zinc-700 bg-zinc-900'
        )}
      >
        <AnimatePresence mode="wait">
          {status === 'running' ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <Loader2 className="h-5 w-5 animate-spin" />
            </motion.div>
          ) : status === 'completed' ? (
            <motion.div
              key="check"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
            >
              <Check className="h-5 w-5" />
            </motion.div>
          ) : status === 'error' ? (
            <motion.div
              key="error"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
            >
              <AlertCircle className="h-5 w-5" />
            </motion.div>
          ) : (
            <motion.div
              key="icon"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
            >
              <Icon className="h-5 w-5" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Pulse animation for running state */}
        {status === 'running' && (
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-blue-500"
            initial={{ opacity: 1, scale: 1 }}
            animate={{ opacity: 0, scale: 1.5 }}
            transition={{
              duration: 1,
              repeat: Infinity,
              ease: 'easeOut',
            }}
          />
        )}
      </div>

      {/* Label */}
      <div className="flex flex-col items-center gap-0.5">
        <span
          className={cn(
            'text-xs font-medium',
            status === 'pending' && 'text-zinc-500',
            (status === 'running' || status === 'completed') && 'text-zinc-200'
          )}
        >
          {config.label}
        </span>
        {isActive && (
          <motion.span
            className="text-[10px] text-zinc-500"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {config.description}
          </motion.span>
        )}
      </div>
    </motion.div>
  )
}

function Connector({ status }: { status: 'pending' | 'active' | 'completed' }) {
  return (
    <div className="relative flex-1 px-2">
      <div
        className={cn(
          'h-0.5 w-full rounded-full transition-all duration-500',
          status === 'completed' && 'bg-emerald-500',
          status === 'active' && 'bg-gradient-to-r from-blue-500 to-zinc-700',
          status === 'pending' && 'bg-zinc-800'
        )}
      />
      {status === 'active' && (
        <motion.div
          className="absolute top-0 h-0.5 w-4 rounded-full bg-blue-400"
          initial={{ left: 0 }}
          animate={{ left: '100%' }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      )}
    </div>
  )
}

export function PipelineProgress({
  progress,
  currentNode,
  className,
}: PipelineProgressProps) {
  const getConnectorStatus = (
    fromNode: keyof NodeProgress,
    toNode: keyof NodeProgress
  ): 'pending' | 'active' | 'completed' => {
    const fromStatus = progress[fromNode]
    const toStatus = progress[toNode]

    if (fromStatus === 'completed' && toStatus !== 'pending') {
      return 'completed'
    }
    if (fromStatus === 'completed' && toStatus === 'pending') {
      return 'active'
    }
    if (fromStatus === 'running') {
      return 'active'
    }
    return 'pending'
  }

  return (
    <div className={cn('flex items-center justify-center py-4', className)}>
      <div className="flex items-center">
        {nodes.map((node, index) => (
          <div key={node.id} className="flex items-center">
            <NodeIndicator
              config={node}
              status={progress[node.id]}
              isActive={currentNode === node.id}
            />
            {index < nodes.length - 1 && (
              <Connector
                status={getConnectorStatus(
                  node.id,
                  nodes[index + 1].id
                )}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
