'use client'

import { BottomNav } from './BottomNav'
import { SideNav } from './SideNav'
import { TopNav } from './TopNav'
import { DemoBanner } from '../shared/DemoBanner'
import { InstallPWA } from '@/components/shared/InstallPWA'
import { Toaster } from 'sonner'
import { isSupabaseConfigured } from '@/lib/supabase'
import { useState } from 'react'

interface AppShellProps {
  children: React.ReactNode
  hideNav?: boolean
}

export function AppShell({ children, hideNav = false }: AppShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-dvh w-screen bg-brand-smoke flex flex-col">
      {!isSupabaseConfigured && <DemoBanner />}
      
      <div className="flex-1 flex flex-col md:flex-row w-full">
        {/* Mobile/Tablet: Bottom Nav */}
        {!hideNav && <BottomNav />}
        
        {/* Desktop: Side Nav */}
        {!hideNav && <SideNav open={sidebarOpen} onOpenChange={setSidebarOpen} />}
        
        {/* Desktop: Top Nav + Content */}
        <div className="flex-1 flex flex-col w-full md:w-auto">
          {!hideNav && <TopNav onMenuClick={() => setSidebarOpen(true)} />}
          
          <main className="flex-1 w-full overflow-x-hidden">
            {/* Responsive shell - grows with screen size */}
            <div className="w-full h-full flex justify-center">
              <div className="w-full px-4 sm:px-6 lg:px-8 max-w-shell md:max-w-shell-tablet lg:max-w-shell-desktop">
                {children}
              </div>
            </div>
          </main>
        </div>
      </div>
      <InstallPWA />
      <Toaster position="top-center" richColors />
    </div>
  )
}