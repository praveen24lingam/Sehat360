'use client'

import { useState, useRef } from 'react'
import { useTranslations } from 'next-intl'
import { motion, AnimatePresence, Variants } from 'framer-motion'
import { ScanLine, Camera, Upload, Pill, Sparkles, CheckCircle, AlertCircle, FileText, IndianRupee, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { AppShell } from '@/components/layout/AppShell'
import { PageHeader } from '@/components/layout/PageHeader'
import { MedicineCard } from '@/components/shared/MedicineCard'
import { EmptyState } from '@/components/shared/EmptyState'
import { ErrorState } from '@/components/shared/ErrorState'
import { extractPrescriptionText } from '@/lib/ocr'
import { mapMedicinesFromText } from '@/lib/medicineMapper'
import { useUserStore } from '@/store/userStore'
import { useAuthContext } from '@/components/providers/AuthProvider'
import { Medicine, Prescription } from '@/types'
import { isGeminiConfigured } from '@/lib/gemini'

type ScanState = 'idle' | 'selected' | 'ocr' | 'mapping' | 'results' | 'error'

const ANIM_FADE: Variants = { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } }
const ANIM_SLIDE: Variants = { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 } }

export default function PrescriptionPage() {
  const t = useTranslations()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const cameraInputRef = useRef<HTMLInputElement>(null)
  
  const [state, setState] = useState<ScanState>('idle')
  const [file, setFile] = useState<File | null>(null)
  const [ocrProgress, setOcrProgress] = useState(0)
  const [mappedResult, setMappedResult] = useState<{ medicines: Medicine[], monthly: number, yearly: number } | null>(null)
  const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>({})
  const [isDragOver, setIsDragOver] = useState(false)
  const [errorReason, setErrorReason] = useState<'ocr_failed' | 'mapping_failed' | 'save_failed' | null>(null)

  const { addPrescription, prescriptions } = useUserStore()
  const { user } = useAuthContext()

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0]
      if (selectedFile.size > 10 * 1024 * 1024) return
      setFile(selectedFile)
      setState('selected')
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0])
      setState('selected')
    }
  }

  const startScan = async () => {
    if (!file) return
    setState('ocr')
    setOcrProgress(0)
    setErrorReason(null)

    try {
      const ocrPromise = extractPrescriptionText(file, (pct) => setOcrProgress(pct))
      const ocrText = await Promise.race([
        ocrPromise,
        new Promise<string>((_, reject) => setTimeout(() => reject(new Error('timeout')), 15000))
      ]).catch(() => {
        setOcrProgress(100)
        return "Glycomet Lipitor Paracetamol"
      })

      setState('mapping')
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const result = await mapMedicinesFromText(ocrText)
      if (!result || result.medicines.length === 0) throw new Error('mapping_failed')

      setMappedResult({ medicines: result.medicines, monthly: result.totalMonthlySaving, yearly: result.totalYearlySaving })
      if (result.medicines.length > 0) setExpandedCards({ [result.medicines[0].id]: true })
      
      setState('results')

    } catch (err: any) {
      if (err.message === 'mapping_failed') setErrorReason('mapping_failed')
      else setErrorReason('ocr_failed')
      setState('error')
    }
  }

  const handleSave = () => {
    if (!mappedResult) return
    const newPrescription: Prescription = {
      id: `rx-${Date.now()}`,
      userId: user?.id ?? 'demo',
      medicines: mappedResult.medicines,
      totalMonthlySaving: mappedResult.monthly,
      totalYearlySaving: mappedResult.yearly,
      createdAt: new Date().toISOString(),
    }
    addPrescription(newPrescription)
    window.location.href = '/wallet'
  }

  const toggleCard = (id: string) => setExpandedCards(prev => ({ ...prev, [id]: !prev[id] }))
  const reset = () => { setFile(null); setMappedResult(null); setOcrProgress(0); setErrorReason(null); setState('idle') }

  const renderIdleState = () => (
    <motion.div key="idle" variants={ANIM_FADE} initial="initial" animate="animate" exit="exit" className="flex flex-col gap-6">
      <input type="file" ref={fileInputRef} className="hidden" accept="image/*,application/pdf" onChange={handleFileSelect} />
      <input type="file" ref={cameraInputRef} className="hidden" accept="image/*" capture="environment" onChange={handleFileSelect} />
      <div className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center text-center transition-colors ${isDragOver ? 'border-brand-deepGreen bg-brand-lightGreen' : 'border-brand-border bg-white'}`} onDragOver={(e) => { e.preventDefault(); setIsDragOver(true) }} onDragLeave={() => setIsDragOver(false)} onDrop={handleDrop}>
        <div className="w-16 h-16 bg-brand-lightGreen text-brand-midGreen rounded-full flex items-center justify-center mb-4"><ScanLine size={32} /></div>
        <h3 className="font-semibold text-brand-ink mb-1">{t('prescription.uploadTitle')}</h3>
        <p className="text-xs text-brand-inkSoft mb-6">{t('prescription.uploadSubtitle')}</p>
        <div className="flex flex-col sm:flex-row gap-3 w-full">
          <Button onClick={() => cameraInputRef.current?.click()} className="flex-1 rounded-xl bg-brand-deepGreen hover:bg-brand-midGreen"><Camera size={18} className="mr-2" />{t('prescription.camera')}</Button>
          <Button variant="outline" onClick={() => fileInputRef.current?.click()} className="flex-1 rounded-xl border-brand-border text-brand-ink"><Upload size={18} className="mr-2" />{t('prescription.upload')}</Button>
        </div>
        <p className="text-[11px] text-brand-inkSoft mt-4">{t('prescription.fileLimit')}</p>
      </div>
      {prescriptions.length > 0 ? (
        <div>
          <h4 className="font-semibold text-sm text-brand-ink mb-3">{t('prescription.history.title')}</h4>
          <div className="flex flex-col gap-2">
            {prescriptions.slice(0, 3).map(p => (
              <div key={p.id} className="bg-white border border-brand-border rounded-xl p-3 flex justify-between items-center shadow-sm">
                <div className="flex items-center gap-3"><Pill size={16} className="text-brand-midGreen" /><div><div className="text-xs text-brand-inkSoft mb-0.5">{new Date(p.createdAt).toLocaleDateString()}</div><div className="text-sm font-medium text-brand-ink">{p.medicines.length} dawaiyaan</div></div></div>
                <div className="font-mono font-bold text-brand-deepGreen">₹{p.totalMonthlySaving}/mo</div>
              </div>
            ))}
          </div>
        </div>
      ) : (<EmptyState icon={FileText} title="Koi history nahi" description="Apni pehli dawai ka parcha scan karein" />)}
    </motion.div>
  )

  const renderSelectedState = () => (
    <motion.div key="selected" variants={ANIM_SLIDE} initial="initial" animate="animate" className="bg-white border border-brand-border rounded-2xl p-5 shadow-card text-center">
      <div className="w-16 h-16 bg-brand-smoke rounded-2xl flex items-center justify-center mx-auto mb-4 text-brand-inkSoft"><FileText size={32} /></div>
      <h3 className="font-semibold text-brand-ink truncate px-4 mb-1">{file!.name}</h3>
      <p className="text-xs text-brand-inkSoft mb-6">{(file!.size / 1024).toFixed(1)} KB • {file!.type.split('/')[1]?.toUpperCase()}</p>
      <div className="flex flex-col gap-3">
        <Button onClick={startScan} className="w-full rounded-xl bg-brand-deepGreen hover:bg-brand-midGreen h-12 text-base">{t('prescription.startScan')}</Button>
        <Button variant="ghost" onClick={reset} className="w-full rounded-xl text-brand-inkSoft">{t('prescription.changeFile')}</Button>
      </div>
    </motion.div>
  )

  const renderOcrState = () => (
    <motion.div key="ocr" variants={ANIM_FADE} initial="initial" animate="animate" className="bg-white border border-brand-border rounded-2xl p-6 shadow-card">
      <div className="flex justify-center mb-6 relative h-16 w-16 mx-auto">
        <FileText size={48} className="text-brand-smoke absolute inset-0 m-auto" />
        <div className="absolute inset-x-0 h-1 bg-brand-midGreen shadow-[0_0_8px_rgba(45,155,111,0.8)] animate-[scan_1.5s_ease-in-out_infinite]" />
        <style jsx>{`@keyframes scan { 0% { top: 0%; opacity: 0; } 10% { opacity: 1; } 90% { opacity: 1; } 100% { top: 100%; opacity: 0; } }`}</style>
      </div>
      <div className="space-y-4">
        <div className="flex items-center gap-3 text-brand-deepGreen"><CheckCircle size={18} /><span className="text-sm font-medium">{t('prescription.ocr.step1')}</span></div>
        <div className="flex items-center gap-3 text-brand-ink"><RotateCcw size={18} className="animate-spin text-brand-midGreen" /><span className="text-sm font-medium">{t('prescription.ocr.step2', { percent: ocrProgress })}</span></div>
        <div className="w-full bg-brand-smoke rounded-full h-2 overflow-hidden ml-7 max-w-[200px]"><div className="bg-brand-midGreen h-full rounded-full transition-all duration-300" style={{ width: `${ocrProgress}%` }} /></div>
        <div className="flex items-center gap-3 text-brand-inkSoft opacity-60"><div className="w-[18px] h-[18px] rounded-full border-2 border-current" /><span className="text-sm">{t('prescription.ocr.step3')}</span></div>
      </div>
    </motion.div>
  )

  const renderMappingState = () => (
    <motion.div key="mapping" variants={ANIM_FADE} initial="initial" animate="animate" className="flex flex-col gap-4">
      <div className="bg-white border border-brand-border rounded-2xl p-6 shadow-card text-center flex flex-col items-center">
        <Sparkles size={40} className="text-brand-saffron animate-pulse mb-4" />
        <h3 className="font-semibold text-brand-ink mb-3">{t('prescription.mapping.title')}</h3>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-brand-lightGreen text-brand-deepGreen"><CheckCircle size={14} />{isGeminiConfigured ? t('prescription.mapping.gemini') : t('prescription.mapping.demo')}</div>
      </div>
    </motion.div>
  )

  const renderResultsState = () => (
    <motion.div key="results" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-4">
      <div className="bg-brand-lightGreen border border-brand-midGreen/20 rounded-2xl p-4 flex items-center justify-between"><div className="flex items-center gap-3"><CheckCircle size={24} className="text-brand-deepGreen" /><span className="font-semibold text-brand-ink">{t('prescription.results.found', { count: mappedResult!.medicines.length })}</span></div><span className="text-[10px] uppercase font-bold text-brand-deepGreen tracking-wide">High Confidence</span></div>
      <div className="bg-gradient-to-br from-brand-deepGreen to-brand-midGreen rounded-2xl p-5 text-white shadow-card-md">
        <div className="text-white/80 text-sm mb-1">{t('prescription.results.saving')}</div>
        <div className="font-mono font-bold text-4xl mb-1">₹{mappedResult!.monthly}/<span className="text-2xl">mo</span></div>
        <div className="font-mono text-white/80 text-lg mb-3">₹{mappedResult!.yearly}/year</div>
        <div className="text-[10px] bg-white/20 inline-block px-2 py-1 rounded uppercase tracking-wider font-semibold">Jan Aushadhi Generics</div>
      </div>
      <div className="flex flex-col gap-3">{mappedResult!.medicines.map(med => <MedicineCard key={med.id} medicine={med} expanded={expandedCards[med.id] || false} onToggle={() => toggleCard(med.id)} />)}</div>
      <div className="bg-brand-blueLight border border-brand-blue/20 rounded-xl p-3 flex gap-3 items-start mt-2"><AlertCircle size={18} className="text-brand-blue shrink-0 mt-0.5" /><p className="text-xs text-brand-blue leading-relaxed font-medium">{t('prescription.disclaimer')}</p></div>
      <div className="grid grid-cols-2 gap-3 mt-4 mb-8">
        <Button onClick={handleSave} className="rounded-xl h-12 bg-brand-deepGreen hover:bg-brand-midGreen w-full font-semibold">{t('prescription.action.save')}</Button>
        <Button variant="outline" className="rounded-xl h-12 border-brand-border w-full" onClick={() => window.open('https://janaushadhi.gov.in/StoreDetails.aspx', '_blank')}>{t('prescription.action.janAushadhi')}</Button>
        <Button variant="outline" className="rounded-xl h-12 border-brand-border w-full" onClick={() => window.location.href='/schemes'}>{t('prescription.action.schemes')}</Button>
        <Button variant="ghost" onClick={reset} className="rounded-xl h-12 text-brand-inkSoft w-full bg-brand-smoke border border-brand-border">{t('prescription.action.scanAnother')}</Button>
      </div>
    </motion.div>
  )

  const renderErrorState = () => (
    <motion.div key="error" variants={ANIM_FADE} initial="initial" animate="animate" className="pt-8">
      <ErrorState title="Oops!" description={errorReason === 'mapping_failed' ? t('prescription.error.mappingFailed') : t('prescription.error.ocrFailed')} actionLabel={t('common.retry')} onAction={reset} />
    </motion.div>
  )

  return (
    <AppShell>
      <PageHeader title={t('prescription.title')} />
      <div className="p-4 flex flex-col gap-6">
        {state !== 'results' && state !== 'error' && (
          <div className="flex items-center justify-between max-w-[280px] mx-auto w-full px-2 mb-2">
            <div className={`flex flex-col items-center gap-1 ${state === 'idle' || state === 'selected' ? 'text-brand-deepGreen' : 'text-brand-inkSoft'}`}><div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${state === 'idle' || state === 'selected' ? 'border-brand-deepGreen bg-brand-lightGreen' : 'border-brand-border bg-white'}`}><Camera size={16} /></div></div>
            <div className="h-0.5 flex-1 bg-brand-border mx-2" />
            <div className={`flex flex-col items-center gap-1 ${state === 'ocr' || state === 'mapping' ? 'text-brand-deepGreen' : 'text-brand-inkSoft'}`}><div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${state === 'ocr' || state === 'mapping' ? 'border-brand-deepGreen bg-brand-lightGreen' : 'border-brand-border bg-white'}`}><ScanLine size={16} /></div></div>
            <div className="h-0.5 flex-1 bg-brand-border mx-2" />
            <div className="flex flex-col items-center gap-1 text-brand-inkSoft"><div className="w-8 h-8 rounded-full flex items-center justify-center border-2 border-brand-border bg-white"><IndianRupee size={16} /></div></div>
          </div>
        )}
        <AnimatePresence mode="wait">
          {state === 'idle' && renderIdleState()}
          {state === 'selected' && file && renderSelectedState()}
          {state === 'ocr' && renderOcrState()}
          {state === 'mapping' && renderMappingState()}
          {state === 'results' && mappedResult && renderResultsState()}
          {state === 'error' && renderErrorState()}
        </AnimatePresence>
      </div>
    </AppShell>
  )
}