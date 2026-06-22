'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { useUserStore } from '@/store/userStore'
import { AppShell } from '@/components/layout/AppShell'
import { PageHeader } from '@/components/layout/PageHeader'
import { CareSwitcher } from '@/components/layout/CareSwitcher'
import { EmptyState } from '@/components/shared/EmptyState'
import { HeartPulse, AlertTriangle, Leaf, Send, Sparkles, CheckCircle2 } from 'lucide-react'
import { calculatePregnancyWeek, calculateDueDate } from '@/lib/dates'
import { isGeminiConfigured } from '@/lib/gemini'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { FamilyMember } from '@/types'

const BABY_SIZE_BY_WEEK = {
  4: { hi: 'Khas ke daane jaisa', en: 'Like a poppy seed', size: '< 1mm' },
  8: { hi: 'Matar jaisa', en: 'Like a pea', size: '1.6cm' },
  12: { hi: 'Nimbu jaisa', en: 'Like a lemon', size: '5.4cm' },
  16: { hi: 'Avocado jaisa', en: 'Like an avocado', size: '11.6cm' },
  20: { hi: 'Kele jaisa', en: 'Like a banana', size: '25.6cm' },
  24: { hi: 'Bhutte jaisa', en: 'Like an ear of corn', size: '30cm' },
  28: { hi: 'Baingan jaisa', en: 'Like an eggplant', size: '37.6cm' },
  32: { hi: 'Nariyal jaisa', en: 'Like a coconut', size: '42.4cm' },
  36: { hi: 'Papita jaisa', en: 'Like a papaya', size: '47.4cm' },
  40: { hi: 'Tarbuz jaisa', en: 'Like a watermelon', size: '50cm' },
}

const PREGNANCY_CHECKUPS = [
  { id: 'booking', week: 8, nameKey: 'checkups.booking' },
  { id: 'nt-scan', week: 12, nameKey: 'checkups.ntScan' },
  { id: 'anomaly', week: 20, nameKey: 'checkups.anomaly' },
  { id: 'glucose', week: 24, nameKey: 'checkups.glucose' },
  { id: 'check28', week: 28, nameKey: 'checkups.check28' },
  { id: 'check32', week: 32, nameKey: 'checkups.check32' },
  { id: 'check36', week: 36, nameKey: 'checkups.check36' },
  { id: 'check38', week: 38, nameKey: 'checkups.check38' },
]

const getDotColor = (isDone: boolean, isMissed: boolean, isUrgentDot: boolean) => {
  if (isDone) return 'bg-brand-midGreen'
  if (isMissed) return 'bg-brand-danger'
  if (isUrgentDot) return 'bg-brand-saffron'
  return 'bg-brand-border'
}

export default function MotherCarePage() {
  const t = useTranslations()
  const router = useRouter()
  const { isFeatureEnabled, getPregnantMember, language } = useUserStore()
  
  const [chatInput, setChatInput] = useState('')
  const [messages, setMessages] = useState<{role: 'user' | 'assistant', content: string}[]>([])
  const [isChatLoading, setIsChatLoading] = useState(false)
  const [doneCheckups, setDoneCheckups] = useState<Record<string, boolean>>({}) 
  const [markDoneId, setMarkDoneId] = useState<string | null>(null)
  
  const chatEndRef = useRef<HTMLDivElement>(null)

  if (!isFeatureEnabled('pregnancy')) {
    return (
      <AppShell>
        <PageHeader title={t('motherCare.title')} />
        <CareSwitcher />
        <EmptyState icon={HeartPulse} title="Pregnancy Care band hai" description="Is feature ko Settings mein chalu karein" actionLabel="Settings mein jayein" onAction={() => router.push('/settings')} tone="feature" />
      </AppShell>
    )
  }

  const pregnantMember = getPregnantMember()
  if (!pregnantMember) {
    return (
      <AppShell>
        <PageHeader title={t('motherCare.title')} />
        <CareSwitcher />
        <EmptyState icon={HeartPulse} title="Koi pregnant member nahi" description="Settings mein pregnant family member add karein" actionLabel="Family member add karein" onAction={() => router.push('/settings')} />
      </AppShell>
    )
  }

  const week = Math.min(40, Math.max(1, calculatePregnancyWeek(pregnantMember.lmpDate!)))
  const dueDate = calculateDueDate(pregnantMember.lmpDate!)
  const weeksLeft = Math.max(0, 40 - week)
  const trimester = week <= 13 ? 1 : week <= 26 ? 2 : 3

  const t1Progress = Math.min(week, 13) / 13
  const t2Progress = week > 13 ? Math.min(week - 13, 13) / 13 : 0
  const t3Progress = week > 26 ? (week - 26) / 14 : 0

  const sizeKeys = Object.keys(BABY_SIZE_BY_WEEK).map(Number).sort((a,b) => b-a)
  const sizeKey = sizeKeys.find(k => week >= k) || 4
  const babySize = BABY_SIZE_BY_WEEK[sizeKey as keyof typeof BABY_SIZE_BY_WEEK]

  const upcomingCheckups = PREGNANCY_CHECKUPS.filter(c => !doneCheckups[c.id])
  const nextCheckup = upcomingCheckups.find(c => c.week >= week - 2)
  const isUrgent = nextCheckup && (nextCheckup.week - week <= 2 && nextCheckup.week - week >= -2)

  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!chatInput.trim()) return

    const newMsgs = [...messages, { role: 'user' as const, content: chatInput }]
    setMessages(newMsgs)
    setChatInput('')
    setIsChatLoading(true)
    
    setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100)

    try {
      if (isGeminiConfigured) {
        const res = await fetch('/api/gemini', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt: `Tum ek supportive pregnancy guide ho. User ${week}vi hafte mein pregnant hai. Language: ${language}. Rule: 2-3 sentences max. User query: ${chatInput}` })
        })
        const data = await res.json()
        setMessages([...newMsgs, { role: 'assistant', content: data.text }])
      } else {
        await new Promise(r => setTimeout(r, 1000))
        const lower = chatInput.toLowerCase()
        let reply = `Week ${week} mein aap achha kar rahi hain. Pani piyen, rest karein, aur agli checkup miss mat karein.`
        if (lower.includes('dard') || lower.includes('pain')) reply = 'Halka dard normal hai. Agar zyada ho ya bleeding ho, turant doctor ke paas jayein.'
        else if (lower.includes('khana') || lower.includes('eat') || lower.includes('food')) reply = 'Is hafte iron aur folic acid wala khana zyada khayein — palak, dal, aur khajoor achhe hain.'
        setMessages([...newMsgs, { role: 'assistant', content: reply }])
      }
    } catch (err) {
      setMessages([...newMsgs, { role: 'assistant', content: 'Connection error. Please try again.' }])
    } finally {
      setIsChatLoading(false)
      setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100)
    }
  }

  const markCheckupDone = () => {
    if (markDoneId) {
      setDoneCheckups(prev => ({ ...prev, [markDoneId]: true }))
      setMarkDoneId(null)
    }
  }

  const renderTimeline = () => (
    <div className="bg-white border border-brand-border rounded-2xl p-4 shadow-sm">
      <div className="relative border-l-2 border-brand-border ml-3 space-y-6 py-2">
        {PREGNANCY_CHECKUPS.map(checkup => {
          const isDone = !!doneCheckups[checkup.id]
          const isMissed = !isDone && week > checkup.week + 2
          const isUrgentDot = !isDone && !isMissed && week >= checkup.week - 2 && week <= checkup.week + 2
          const isUpcoming = !isDone && !isMissed && !isUrgentDot
          const dotColor = getDotColor(isDone, isMissed, isUrgentDot)

          return (
            <div key={checkup.id} className="relative pl-6 flex items-center justify-between" onClick={() => (isUrgentDot || isUpcoming) && setMarkDoneId(checkup.id)}>
              <div className={`absolute -left-[9px] w-4 h-4 rounded-full border-[3px] border-white ${dotColor} ${isUrgentDot ? 'animate-pulse' : ''}`} />
              <div>
                <div className="text-xs font-semibold text-brand-inkSoft mb-0.5">Week {checkup.week}</div>
                <div className={`text-sm font-medium ${isDone ? 'text-brand-ink' : isMissed ? 'text-brand-danger' : 'text-brand-ink'}`}>{t(checkup.nameKey as any)}</div>
              </div>
              <div>
                {isDone && <span className="text-xs font-semibold text-brand-midGreen">{t('motherCare.checkup.done')}</span>}
                {isMissed && <span className="text-[10px] font-bold bg-brand-danger text-white px-2 py-0.5 rounded-md">{t('motherCare.checkup.missed')}</span>}
                {isUrgentDot && <span className="text-[10px] font-bold bg-brand-saffron text-white px-2 py-0.5 rounded-md">{t('motherCare.checkup.due')}</span>}
                {isUpcoming && <span className="text-xs text-brand-inkSoft">Week {checkup.week} mein</span>}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )

  const renderChat = () => (
    <div className="bg-white border border-brand-border rounded-2xl flex flex-col h-[320px] shadow-sm overflow-hidden">
      <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-3 bg-brand-smoke/30">
        <div className="bg-white border border-brand-border rounded-2xl rounded-tl-sm p-3 self-start max-w-[85%] shadow-sm">
          <p className="text-sm text-brand-ink">Namaste! Main yahan aapki pregnancy se jude general sawaalon ke jawaab dene ke liye hoon. Week {week} kaisa chal raha hai?</p>
        </div>
        {messages.map((msg, i) => (
          <div key={`msg-${i}`} className={`p-3 max-w-[85%] shadow-sm ${msg.role === 'user' ? 'bg-brand-deepGreen text-white rounded-2xl rounded-tr-sm self-end' : 'bg-white border border-brand-border text-brand-ink rounded-2xl rounded-tl-sm self-start'}`}>
            <p className="text-sm">{msg.content}</p>
          </div>
        ))}
        {isChatLoading && (
          <div className="bg-white border border-brand-border rounded-2xl rounded-tl-sm p-3 self-start max-w-[85%] shadow-sm">
            <div className="flex gap-1.5">
              <div className="w-1.5 h-1.5 bg-brand-midGreen rounded-full animate-bounce" />
              <div className="w-1.5 h-1.5 bg-brand-midGreen rounded-full animate-bounce [animation-delay:0.2s]" />
              <div className="w-1.5 h-1.5 bg-brand-midGreen rounded-full animate-bounce [animation-delay:0.4s]" />
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>
      <form onSubmit={handleChatSubmit} className="p-3 border-t border-brand-border bg-white flex gap-2">
        <Input value={chatInput} onChange={e => setChatInput(e.target.value)} placeholder={t('motherCare.chatPlaceholder', { week })} className="rounded-xl h-10 border-brand-border bg-brand-smoke focus-visible:ring-brand-deepGreen text-sm" />
        <Button type="submit" disabled={!chatInput.trim() || isChatLoading} size="icon" className="h-10 w-10 shrink-0 rounded-xl bg-brand-deepGreen">
          <Send size={18} />
        </Button>
      </form>
    </div>
  )

  return (
    <AppShell>
      <PageHeader title={t('motherCare.title')} subtitle={t('motherCare.weeksLeft', { left: weeksLeft })} showBack={true} />
      <CareSwitcher />
      
      <div className="p-4 flex flex-col gap-6">
        <section>
          <div className="bg-gradient-to-br from-brand-pink to-[#B8165F] rounded-2xl p-5 text-white shadow-card-md">
            <div className="flex justify-between items-start mb-6">
              <div className="bg-white/20 px-2 py-0.5 rounded text-xs font-medium">{t('motherCare.trimester', { n: trimester })}</div>
              <div className="text-white/70 text-xs font-medium">{t('motherCare.dueDate', { date: new Date(dueDate).toLocaleDateString() })}</div>
            </div>
            <div className="text-center mb-8">
              <span className="font-mono font-bold text-5xl">Week {week}</span>
              <span className="text-white/60 text-2xl font-mono">/40</span>
            </div>
            <div className="relative mb-6">
              <div className="absolute top-0 -mt-1.5 w-3 h-3 bg-white rounded-full shadow-sm z-10 transition-all duration-500 ease-out" style={{ left: `calc(${(week/40)*100}% - 6px)` }} />
              <div className="flex gap-[2px] h-2">
                <div className="relative flex-1 bg-white/20 rounded-l-full overflow-hidden" style={{ flexGrow: 13 }}><div className="absolute top-0 left-0 h-full bg-white transition-all" style={{ width: `${t1Progress*100}%` }} /></div>
                <div className="relative flex-1 bg-white/20 overflow-hidden" style={{ flexGrow: 13 }}><div className="absolute top-0 left-0 h-full bg-white transition-all" style={{ width: `${t2Progress*100}%` }} /></div>
                <div className="relative flex-1 bg-white/20 rounded-r-full overflow-hidden" style={{ flexGrow: 14 }}><div className="absolute top-0 left-0 h-full bg-white transition-all" style={{ width: `${t3Progress*100}%` }} /></div>
              </div>
              <div className="flex justify-between text-[10px] text-white/60 mt-1.5 px-1 font-medium">
                <span>T1 (1-13)</span><span>T2 (14-26)</span><span>T3 (27-40)</span>
              </div>
            </div>
            <div className="text-center text-white/70 text-xs font-medium">{pregnantMember.name} • LMP: {new Date(pregnantMember.lmpDate!).toLocaleDateString()}</div>
          </div>
        </section>

        <section>
          <div className="bg-white border border-brand-border rounded-2xl p-4 shadow-sm flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-brand-lightGreen flex items-center justify-center shrink-0">
              <Leaf size={32} className="text-brand-deepGreen" />
            </div>
            <div>
              <h3 className="font-semibold text-brand-ink text-sm mb-0.5">{t('motherCare.babySize')}</h3>
              <p className="text-sm font-medium text-brand-deepGreen mb-1">{language === 'hi' ? babySize.hi : babySize.en}</p>
              <p className="text-xs text-brand-inkSoft font-mono">{babySize.size}</p>
            </div>
          </div>
        </section>

        <section>
          {isUrgent && nextCheckup ? (
            <div className="bg-brand-saffronLight border border-brand-saffron/30 rounded-2xl p-4 shadow-sm">
              <div className="flex items-start gap-3">
                <AlertTriangle size={20} className="text-brand-saffron shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-brand-saffron mb-1">{t('motherCare.urgentCheckup', { week: nextCheckup.week, name: t(nextCheckup.nameKey as any) })}</h3>
                  <p className="text-xs text-brand-saffron/80 font-medium mb-3">{t('motherCare.urgentDesc', { week })}</p>
                  <Button size="sm" onClick={() => setMarkDoneId(nextCheckup.id)} className="bg-brand-saffron hover:bg-[#D9770B] text-white text-xs h-8 rounded-lg">{t('motherCare.appointmentNote')}</Button>
                </div>
              </div>
            </div>
          ) : (
            nextCheckup && (
              <div className="bg-brand-lightGreen rounded-xl p-3 text-sm text-brand-inkSoft font-medium text-center border border-brand-midGreen/20">
                {t('motherCare.nextCheckup', { week: nextCheckup.week, name: t(nextCheckup.nameKey as any) })}
              </div>
            )
          )}
        </section>

        <section>
          <h2 className="text-base font-semibold text-brand-ink mb-4">{t('motherCare.timelineTitle')}</h2>
          {renderTimeline()}
        </section>

        <section className="mb-4">
          <h2 className="text-base font-semibold text-brand-ink mb-3">{t('motherCare.chatTitle')}</h2>
          {renderChat()}
          <div className="bg-brand-blueLight border border-brand-blue/20 rounded-xl p-3 flex items-start gap-2 mt-3">
            <Sparkles size={16} className="text-brand-blue shrink-0 mt-0.5" />
            <p className="text-[10px] text-brand-blue font-medium leading-relaxed">{t('motherCare.chatDisclaimer')}</p>
          </div>
        </section>
      </div>

      <Dialog open={!!markDoneId} onOpenChange={(open) => !open && setMarkDoneId(null)}>
        <DialogContent className="w-[90%] rounded-2xl p-6">
          <DialogHeader>
            <DialogTitle className="text-center text-xl">{t('motherCare.markDone')}</DialogTitle>
          </DialogHeader>
          <div className="py-4 flex justify-center">
            <div className="w-16 h-16 bg-brand-lightGreen rounded-full flex items-center justify-center text-brand-deepGreen">
              <CheckCircle2 size={32} />
            </div>
          </div>
          <DialogFooter className="flex-col sm:flex-col gap-2">
            <Button onClick={markCheckupDone} className="w-full h-12 bg-brand-deepGreen rounded-xl text-base">{t('common.save')}</Button>
            <Button variant="ghost" onClick={() => setMarkDoneId(null)} className="w-full h-12 rounded-xl text-brand-inkSoft">{t('common.cancel')}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppShell>
  )
}