'use client'

import { Reminder } from '@/types'
import Link from 'next/link'
import { ChevronRight, AlertCircle, Bell } from 'lucide-react'

interface ReminderCardProps {
  reminder: Reminder
  language: 'hi' | 'en'
}

export function ReminderCard({ reminder, language }: ReminderCardProps) {
  const isUrgent = reminder.urgency === 'urgent'
  const title = language === 'hi' ? reminder.titleHi : reminder.title
  const subtitle = language === 'hi' ? reminder.subtitleHi : reminder.subtitle

  return (
    <Link
      href={reminder.linkedRoute}
      className={`flex items-center gap-3 p-4 rounded-2xl border transition-all active:scale-[0.98] ${
        isUrgent
          ? 'bg-brand-saffronLight border-brand-saffron/25'
          : 'bg-white border-brand-border shadow-card'
      }`}
    >
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
        isUrgent ? 'bg-brand-saffron/20' : 'bg-brand-lightGreen'
      }`}>
        {isUrgent
          ? <AlertCircle size={18} className="text-brand-saffron" />
          : <Bell size={18} className="text-brand-deepGreen" />
        }
      </div>
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-bold truncate ${isUrgent ? 'text-brand-ink' : 'text-brand-ink'}`}>{title}</p>
        <p className="text-xs text-brand-inkSoft font-medium truncate mt-0.5">{subtitle}</p>
      </div>
      <ChevronRight size={18} className={isUrgent ? 'text-brand-saffron' : 'text-brand-inkSoft/50'} />
    </Link>
  )
}
