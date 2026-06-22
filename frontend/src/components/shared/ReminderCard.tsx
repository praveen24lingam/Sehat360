'use client'

import { Reminder } from '@/types'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

interface ReminderCardProps {
  reminder: Reminder
  language: 'hi' | 'en'
}

export function ReminderCard({ reminder, language }: ReminderCardProps) {
  const isUrgent = reminder.urgency === 'urgent'
  const title = language === 'hi' ? reminder.titleHi : reminder.title
  const subtitle = language === 'hi' ? reminder.subtitleHi : reminder.subtitle

  return (
    <Link href={reminder.linkedRoute} className={`block p-4 rounded-xl border-l-4 shadow-sm bg-white border border-y-brand-border border-r-brand-border ${isUrgent ? 'border-l-brand-saffron bg-brand-saffronLight/30' : 'border-l-brand-deepGreen bg-brand-lightGreen/30'}`}>
      <div className="flex items-center justify-between">
        <div>
          <h4 className={`font-semibold mb-1 ${isUrgent ? 'text-brand-saffron' : 'text-brand-deepGreen'}`}>
            {title}
          </h4>
          <p className="text-sm text-brand-inkSoft">{subtitle}</p>
        </div>
        <ChevronRight size={20} className="text-brand-inkSoft/50" />
      </div>
    </Link>
  )
}