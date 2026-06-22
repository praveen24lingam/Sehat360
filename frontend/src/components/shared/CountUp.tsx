'use client'

import { useEffect } from 'react'
import { motion, useMotionValue, useTransform, animate, useReducedMotion } from 'framer-motion'

interface CountUpProps {
  amount: number
  className?: string
}

export function CountUp({ amount, className = '' }: CountUpProps) {
  const count = useMotionValue(0)
  const rounded = useTransform(count, (latest) => `₹${Math.round(latest).toLocaleString('en-IN')}`)
  const prefersReducedMotion = useReducedMotion()

  useEffect(() => {
    if (prefersReducedMotion) {
      count.set(amount)
    } else {
      const controls = animate(count, amount, { duration: 1.2, ease: 'easeOut' })
      return () => controls.stop()
    }
  }, [amount, prefersReducedMotion, count])

  return <motion.span className={className}>{rounded}</motion.span>
}