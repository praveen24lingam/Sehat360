import React from 'react'
import { cn } from '@/lib/utils'

interface LogoProps {
  variant?: 'primary' | 'icon' | 'app'
  className?: string
  iconClassName?: string
  textClassName?: string
}

export function Logo({ variant = 'primary', className, iconClassName, textClassName }: LogoProps) {
  // SVG Icon
  const Icon = (
    <svg 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={cn("shrink-0", iconClassName)}
    >
      {/* Outer Shield/Leaf Shape */}
      <path 
        d="M50 10 C 25 10, 10 30, 10 50 C 10 75, 40 90, 50 95 C 60 90, 90 75, 90 50 C 90 30, 75 10, 50 10 Z" 
        fill="currentColor" 
        className="opacity-20"
      />
      {/* Inner Heart/Cross fusion */}
      <path 
        d="M50 25 C 40 15, 25 25, 25 40 C 25 60, 45 75, 50 80 C 55 75, 75 60, 75 40 C 75 25, 60 15, 50 25 Z" 
        fill="currentColor" 
        className="opacity-90"
      />
      {/* Dynamic S */}
      <path 
        d="M58 38 C 55 35, 50 35, 48 37 C 45 39, 45 42, 48 44 C 55 48, 58 52, 57 57 C 55 62, 48 63, 42 60" 
        stroke="white" 
        strokeWidth="6" 
        strokeLinecap="round" 
        fill="none"
      />
    </svg>
  )

  if (variant === 'icon') {
    return (
      <div className={cn("text-brand-deepGreen w-10 h-10 flex items-center justify-center", className)}>
        {Icon}
      </div>
    )
  }

  if (variant === 'app') {
    return (
      <div className={cn("w-14 h-14 bg-gradient-premium rounded-2xl flex items-center justify-center shadow-button text-white", className)}>
        <div className="w-8 h-8">
          <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            <path d="M50 10C25 10 10 30 10 50C10 75 40 90 50 95C60 90 90 75 90 50C90 30 75 10 50 10Z" fill="white" className="opacity-20"/>
            <path d="M50 25C40 15 25 25 25 40C25 60 45 75 50 80C55 75 75 60 75 40C75 25 60 15 50 25Z" fill="white" className="opacity-90"/>
            <path d="M58 38C55 35 50 35 48 37C45 39 45 42 48 44C55 48 58 52 57 57C55 62 48 63 42 60" stroke="#047857" strokeWidth="6" strokeLinecap="round" fill="none"/>
          </svg>
        </div>
      </div>
    )
  }

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className={cn("text-brand-deepGreen w-8 h-8 flex items-center justify-center", iconClassName)}>
        {Icon}
      </div>
      <div className={cn("flex items-baseline leading-none font-sans", textClassName)}>
        <span className="text-xl md:text-2xl font-black text-brand-ink tracking-tight">Sehat</span>
        <span className="text-xl md:text-2xl font-black text-brand-saffron tracking-tight">Mitra</span>
      </div>
    </div>
  )
}
