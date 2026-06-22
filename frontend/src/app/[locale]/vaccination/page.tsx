'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { useUserStore } from '@/store/userStore'
import { AppShell } from '@/components/layout/AppShell'
import { PageHeader } from '@/components/layout/PageHeader'
import { CareSwitcher } from '@/components/layout/CareSwitcher'
import { EmptyState } from '@/components/shared/EmptyState'
import { Syringe, AlertTriangle, MapPin, CheckCircle } from 'lucide-react'
import { differenceInDays } from 'date-fns'
import { calculateVaccineDueDate, getVaccineStatus, formatDateInLocale } from '@/lib/dates'
import { VACCINATION_SCHEDULE } from '@/data/vaccinationSchedule'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { motion, AnimatePresence } from 'framer-motion'

const ANIM_VARIANTS = {
  hidden: { height: 0, opacity: 0 },
  visible: { height: 'auto', opacity: 1 },
  exit: { height: 0, opacity: 0 }
}

const getStatusStyles = (status: string) => {
  if (status === 'overdue') return 'bg-brand-dangerLight text-brand-danger'
  if (status === 'dueSoon') return 'bg-brand-saffronLight text-brand-saffron'
  if (status === 'done') return 'text-brand-midGreen'
  return 'text-brand-inkSoft'
}

export default function VaccinationPage() {
  const t = useTranslations()
  const router = useRouter()
  const { isFeatureEnabled, getChildMembers, vaccinationRecords, markVaccineDone, language } = useUserStore()
  
  const childMembers = getChildMembers()
  const [selectedChildId, setSelectedChildId] = useState<string>(childMembers[0]?.id || '')
  
  const [markDoneId, setMarkDoneId] = useState<string | null>(null)
  const [doneDate, setDoneDate] = useState(new Date().toISOString().split('T')[0])

  if (!isFeatureEnabled('vaccination')) {
    return (
      <AppShell>
        <PageHeader title={t('vaccination.title')} />
        <CareSwitcher />
        <EmptyState icon={Syringe} title="Vaccination Tracker band hai" description="Is feature ko Settings mein chalu karein" actionLabel="Settings mein jayein" onAction={() => router.push('/settings')} tone="feature" />
      </AppShell>
    )
  }

  if (childMembers.length === 0) {
    return (
      <AppShell>
        <PageHeader title={t('vaccination.title')} />
        <CareSwitcher />
        <EmptyState icon={Syringe} title="Koi bachcha nahi mila" description="Settings mein bachche ka naam aur janam taareekh add karein" actionLabel="Bachcha add karein" onAction={() => router.push('/settings')} />
      </AppShell>
    )
  }

  const selectedChild = childMembers.find(m => m.id === selectedChildId) || childMembers[0]
  const ageInDays = differenceInDays(new Date(), new Date(selectedChild.dob!))
  const ageMonths = Math.floor(ageInDays / 30.44)

  const vaccineStatuses = VACCINATION_SCHEDULE.map(vaccine => {
    const dueDate = calculateVaccineDueDate(selectedChild.dob!, vaccine.dueAgeDays)
    const records = vaccinationRecords[selectedChild.id] || []
    const record = records.find(r => r.id === vaccine.id)
    const status = getVaccineStatus(dueDate, record?.done ?? false)
    return { ...vaccine, dueDate, status, doneDate: record?.doneDate }
  })

  const overdue = vaccineStatuses.filter(v => v.status === 'overdue')
  const dueSoon = vaccineStatuses.filter(v => v.status === 'dueSoon')
  const upcoming = vaccineStatuses.filter(v => v.status === 'upcoming')
  const done = vaccineStatuses.filter(v => v.status === 'done')

  const totalCount = vaccineStatuses.length
  const doneCount = done.length
  const percent = Math.round((doneCount / totalCount) * 100)

  const handleMarkDone = () => {
    if (markDoneId) {
      markVaccineDone(selectedChild.id, markDoneId, doneDate)
      setMarkDoneId(null)
    }
  }

  const handlePHC = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => window.open(`https://maps.google.com/?q=primary+health+centre+near+${pos.coords.latitude},${pos.coords.longitude}`, '_blank'),
        () => window.open('https://maps.google.com/?q=primary+health+centre+near+me', '_blank')
      )
    } else {
      window.open('https://maps.google.com/?q=primary+health+centre+near+me', '_blank')
    }
  }

  const initials = selectedChild.name.substring(0, 2).toUpperCase()

  const VaccineGroup = ({ title, items, defaultOpen = true }: { title: string, items: typeof vaccineStatuses, defaultOpen?: boolean }) => {
    const [open, setOpen] = useState(defaultOpen)
    if (items.length === 0) return null

    return (
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3 cursor-pointer select-none" onClick={() => setOpen(!open)}>
          <h3 className="font-semibold text-brand-ink text-sm flex items-center gap-2">
            {title} <span className="bg-brand-smoke text-brand-inkSoft text-[10px] px-1.5 py-0.5 rounded-full">{items.length}</span>
          </h3>
          <span className="text-xs font-medium text-brand-deepGreen">{open ? 'Band karein' : 'Dekho →'}</span>
        </div>
        
        <AnimatePresence>
          {open && (
            <motion.div variants={ANIM_VARIANTS} initial="hidden" animate="visible" exit="exit" className="flex flex-col gap-3 overflow-hidden">
              {items.map(v => (
                <div key={v.id} className="bg-white border border-brand-border rounded-xl p-4 shadow-sm flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${v.status === 'overdue' ? 'bg-brand-danger' : v.status === 'dueSoon' ? 'bg-brand-saffron' : v.status === 'done' ? 'bg-brand-midGreen' : 'bg-brand-border'}`} />
                    <div>
                      <h4 className="font-semibold text-sm text-brand-ink leading-tight mb-1">{v.name}</h4>
                      <p className="text-[10px] font-medium text-brand-inkSoft">{t(v.dueLabelKey as any)} • {formatDateInLocale(v.dueDate, language)}</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-end gap-2">
                    {v.status === 'overdue' && <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${getStatusStyles('overdue')}`}>{t('vaccination.status.overdue')}</span>}
                    {v.status === 'dueSoon' && <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${getStatusStyles('dueSoon')}`}>{t('vaccination.status.dueSoon')}</span>}
                    {v.status === 'done' && <span className={`text-xs font-semibold ${getStatusStyles('done')}`}>✓ {formatDateInLocale(v.doneDate!, language)}</span>}
                    
                    {(v.status === 'overdue' || v.status === 'dueSoon' || v.status === 'upcoming') && (
                      <button onClick={() => setMarkDoneId(v.id)} className="text-xs font-semibold text-brand-deepGreen hover:text-brand-midGreen">{t('vaccination.markDone')}</button>
                    )}
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    )
  }

  const renderHero = () => (
    <div className="bg-gradient-to-br from-[#E8820C] to-[#C26B06] rounded-2xl p-5 text-white shadow-card-md">
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-bold text-sm">{initials}</div>
          <div>
            <h3 className="font-semibold text-sm leading-tight">{selectedChild.name}</h3>
            <p className="text-xs text-white/80">{t('vaccination.subtitle', { name: '', age: ageMonths }).replace(' — ', '')}</p>
          </div>
        </div>
      </div>
      <div className="text-right mb-2"><span className="font-mono font-bold text-4xl">{percent}%</span></div>
      <div className="text-right text-white/70 text-xs mb-3">{t('vaccination.progress', { percent: '' }).replace('%', '')}</div>
      <div className="w-full bg-white/20 rounded-full h-2 overflow-hidden mb-5"><div className="bg-white h-full rounded-full transition-all" style={{ width: `${percent}%` }} /></div>
      <div className="flex flex-wrap gap-2">
        {overdue.length > 0 && <span className="bg-white/20 text-white rounded-full px-2 py-0.5 text-[10px] font-medium tracking-wide">❌ {t('vaccination.pill.overdue', { count: overdue.length })}</span>}
        {dueSoon.length > 0 && <span className="bg-white/20 text-white rounded-full px-2 py-0.5 text-[10px] font-medium tracking-wide">⏳ {t('vaccination.pill.dueSoon', { count: dueSoon.length })}</span>}
        <span className="bg-white/20 text-white rounded-full px-2 py-0.5 text-[10px] font-medium tracking-wide">✓ {t('vaccination.pill.done', { done: doneCount, total: totalCount })}</span>
      </div>
    </div>
  )

  const renderOverdueAlert = () => {
    if (overdue.length > 0) {
      return (
        <div className="bg-brand-dangerLight border border-brand-danger/20 rounded-2xl p-4 shadow-sm">
          <div className="flex items-start gap-3">
            <AlertTriangle size={20} className="text-brand-danger shrink-0 mt-0.5" />
            <div className="w-full">
              <h3 className="font-semibold text-brand-danger text-sm mb-1">{t('vaccination.overdueAlert', { count: overdue.length, s: overdue.length > 1 ? 'n' : '' })}</h3>
              <p className="text-xs text-brand-danger/80 font-medium mb-3">{t('vaccination.overdueDesc', { name: overdue[0].name, days: Math.abs(differenceInDays(new Date(), new Date(overdue[0].dueDate))) })}</p>
              <Button onClick={handlePHC} className="w-full h-10 bg-brand-danger hover:bg-red-700 text-white text-xs rounded-xl shadow-sm">{t('vaccination.phcButton')}</Button>
            </div>
          </div>
        </div>
      )
    }
    return (
      <div className="bg-brand-lightGreen border border-brand-midGreen/20 rounded-xl p-3 flex items-center justify-center gap-2 text-brand-deepGreen text-sm font-semibold">
        <CheckCircle size={16} /> {t('vaccination.allOnTrack')}
      </div>
    )
  }

  return (
    <AppShell>
      <PageHeader 
        title={t('vaccination.title')} 
        rightSlot={childMembers.length > 1 ? (
          <Select value={selectedChildId} onValueChange={setSelectedChildId}>
            <SelectTrigger className="h-8 text-xs border-none bg-brand-smoke w-[120px] focus:ring-0"><SelectValue /></SelectTrigger>
            <SelectContent>
              {childMembers.map(m => <SelectItem key={m.id} value={m.id} className="text-xs">{m.name.split(' ')[0]}</SelectItem>)}
            </SelectContent>
          </Select>
        ) : null}
      />
      <CareSwitcher />
      
      <div className="p-4 flex flex-col gap-5">
        <section>{renderHero()}</section>
        <section>{renderOverdueAlert()}</section>

        <section className="mt-2 pb-10">
          <VaccineGroup title={t('vaccination.group.overdue')} items={overdue} defaultOpen={true} />
          <VaccineGroup title={t('vaccination.group.dueSoon')} items={dueSoon} defaultOpen={true} />
          <VaccineGroup title={t('vaccination.group.upcoming')} items={upcoming} defaultOpen={false} />
          <VaccineGroup title={t('vaccination.group.done')} items={done} defaultOpen={false} />
        </section>

        <section>
          <div className="bg-white border border-brand-border rounded-2xl p-4 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-brand-blueLight flex items-center justify-center shrink-0"><MapPin size={24} className="text-brand-blue" /></div>
            <div className="w-full">
              <p className="text-xs font-semibold text-brand-ink mb-2 leading-tight">Najdeeki PHC mein free vaccines milti hain</p>
              <Button variant="outline" size="sm" onClick={handlePHC} className="w-full text-xs h-8 border-brand-border rounded-lg"><MapPin size={12} className="mr-1.5" /> Map kholein</Button>
            </div>
          </div>
        </section>
      </div>

      <Dialog open={!!markDoneId} onOpenChange={(open) => !open && setMarkDoneId(null)}>
        <DialogContent className="w-[90%] rounded-2xl p-6">
          <DialogHeader>
            <DialogTitle className="text-center text-xl">{t('vaccination.markDoneTitle')}</DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-2">
            <label className="text-sm font-medium text-brand-inkSoft">Date</label>
            <input type="date" value={doneDate} onChange={e => setDoneDate(e.target.value)} max={new Date().toISOString().split('T')[0]} className="flex h-12 w-full rounded-xl border border-brand-border bg-brand-smoke px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-deepGreen font-mono" />
          </div>
          <DialogFooter className="flex-col sm:flex-col gap-2">
            <Button onClick={handleMarkDone} className="w-full h-12 bg-brand-deepGreen rounded-xl text-base">{t('vaccination.markDoneConfirm')}</Button>
            <Button variant="ghost" onClick={() => setMarkDoneId(null)} className="w-full h-12 rounded-xl text-brand-inkSoft">{t('common.cancel')}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppShell>
  )
}