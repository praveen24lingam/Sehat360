import React from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface EmptyStateProps {
  title: string
  description: string
  imageSrc?: string
  icon?: React.ReactNode
  actionLabel?: string
  onAction?: () => void
  className?: string
}

export function EmptyState({ 
  title, 
  description, 
  imageSrc, 
  icon, 
  actionLabel, 
  onAction,
  className 
}: EmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center text-center p-8 bg-white rounded-3xl shadow-sm border border-brand-border/40 max-w-lg mx-auto", className)}>
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="mb-6 relative w-48 h-48 sm:w-64 sm:h-64 flex items-center justify-center"
      >
        {imageSrc ? (
          <Image 
            src={imageSrc} 
            alt={title} 
            fill
            className="object-contain"
            sizes="(max-width: 640px) 192px, 256px"
          />
        ) : icon ? (
          <div className="text-brand-midGreen opacity-50 transform scale-[3]">{icon}</div>
        ) : null}
      </motion.div>
      
      <motion.h3 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.4 }}
        className="text-xl md:text-2xl font-black text-brand-ink mb-2 tracking-tight"
      >
        {title}
      </motion.h3>
      
      <motion.p 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.4 }}
        className="text-sm text-brand-inkSoft font-medium max-w-sm mb-6"
      >
        {description}
      </motion.p>
      
      {actionLabel && onAction && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
        >
          <Button 
            onClick={onAction}
            className="bg-brand-deepGreen hover:bg-brand-midGreen text-white font-bold rounded-xl px-8 h-12 shadow-sm active:scale-95 transition-all"
          >
            {actionLabel}
          </Button>
        </motion.div>
      )}
    </div>
  )
}