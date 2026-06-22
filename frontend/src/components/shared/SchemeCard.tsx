'use client'

import { Scheme } from '@/types'
import { ChevronDown, ChevronUp, ExternalLink, ShieldCheck } from 'lucide-react'
import { useTranslations } from 'next-intl'

interface SchemeCardProps {
  scheme: Scheme
  expanded?: boolean
  onToggle?: () => void
  language?: 'hi' | 'en'
}

export function SchemeCard({ scheme, expanded = false, onToggle, language = 'hi' }: SchemeCardProps) {
  const t = useTranslations('schemes')
  
  const isEligible = scheme.status === 'eligible'
  const isLikely = scheme.status === 'likely'
  
  let statusColor = 'bg-brand-blueLight text-brand-blue border-brand-blue/20'
  let statusKey = 'status.check'
  if (isEligible) {
    statusColor = 'bg-brand-lightGreen text-brand-deepGreen border-brand-deepGreen/20'
    statusKey = 'status.eligible'
  } else if (isLikely) {
    statusColor = 'bg-brand-saffronLight text-brand-saffron border-brand-saffron/20'
    statusKey = 'status.likely'
  }

  const name = language === 'hi' ? scheme.nameHi : scheme.name
  const benefit = language === 'hi' ? scheme.benefitHi : scheme.benefit
  const reason = language === 'hi' ? scheme.reasonHi : scheme.reason
  const documents = language === 'hi' ? scheme.documentsHi : scheme.documents
  const applyAt = language === 'hi' ? scheme.applyAtHi : scheme.applyAt

  return (
    <div 
      onClick={onToggle} 
      className={`bg-white transition-all duration-300 cursor-pointer overflow-hidden ${expanded ? 'rounded-[2rem] border-brand-border shadow-card-lg' : 'rounded-[1.5rem] border border-brand-border/60 shadow-card hover:shadow-card-md hover:border-brand-border'}`}
    >
      <div className="p-5">
        <div className="flex justify-between items-start mb-3">
          <div className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${statusColor} flex items-center gap-1 shadow-sm`}>
            {isEligible && <ShieldCheck size={12} />}
            {t(statusKey as any)}
          </div>
          <div className="bg-brand-smoke p-1.5 rounded-full text-brand-inkSoft">
            {!expanded ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
          </div>
        </div>
        
        <h4 className="font-black text-brand-ink mb-1 text-lg tracking-tight">{name}</h4>
        <p className="text-sm font-bold text-brand-deepGreen">{benefit}</p>
        
        {expanded ? (
          <div className="mt-5 pt-5 border-t border-brand-border/60 space-y-5">
            <div className="bg-brand-smoke rounded-2xl p-4 border border-brand-border/40">
              <h5 className="text-[10px] font-black uppercase tracking-widest text-brand-inkSoft mb-2">{t('card.why')}</h5>
              <div className="text-sm text-brand-ink font-medium leading-relaxed">
                {reason}
              </div>
            </div>
            
            <div className="px-1">
              <h5 className="text-[10px] font-black uppercase tracking-widest text-brand-inkSoft mb-2.5">{t('card.documents')}</h5>
              <ul className="text-sm text-brand-ink font-medium space-y-2">
                {documents.map((doc) => (
                  <li key={doc} className="flex gap-2.5 items-start">
                    <div className="w-1.5 h-1.5 rounded-full bg-brand-deepGreen shrink-0 mt-1.5" />
                    <span className="leading-tight">{doc}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="px-1 pt-2">
              <h5 className="text-[10px] font-black uppercase tracking-widest text-brand-inkSoft mb-1.5">{t('card.applyAt')}</h5>
              <p className="text-sm text-brand-ink font-medium bg-brand-lightGreen/50 px-3 py-2 rounded-xl border border-brand-deepGreen/10">{applyAt}</p>
              
              {scheme.officialUrl && (
                <a 
                  href={scheme.officialUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="mt-4 inline-flex items-center justify-center gap-2 text-sm font-bold text-white bg-brand-deepGreen hover:bg-brand-deepGreen/90 py-3 w-full rounded-xl transition-colors shadow-sm"
                >
                  {t('card.officialSite')} <ExternalLink size={16} />
                </a>
              )}
            </div>
          </div>
        ) : (
          <div className="mt-3 text-xs font-medium text-brand-inkSoft line-clamp-1 pr-4">{reason}</div>
        )}
      </div>
    </div>
  )
}