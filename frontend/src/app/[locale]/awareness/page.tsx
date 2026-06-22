'use client'

import { useState, useMemo, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { 
  Search, BookOpen, Share2, Info, ArrowRight, Droplets, Apple, Baby, 
  ShieldAlert, Activity, Smile, PlusSquare, AlertTriangle, Users, PlaySquare, PlayCircle
} from 'lucide-react'
import { AppShell } from '@/components/layout/AppShell'
import { PageHeader } from '@/components/layout/PageHeader'
import { LanguageToggle } from '@/components/shared/LanguageToggle'
import { EmptyState } from '@/components/shared/EmptyState'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { AWARENESS_ARTICLES } from '@/data/awarenessArticles'
import { useUserStore } from '@/store/userStore'
import { AwarenessCategory } from '@/types'
import { supabase } from '@/lib/supabase'

export default function AwarenessPage() {
  const t = useTranslations()
  const router = useRouter()
  const { isFeatureEnabled, language } = useUserStore()
  
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState<AwarenessCategory | 'all'>('all')
  const [activeTab, setActiveTab] = useState<'articles' | 'videos'>('articles')
  
  const [articles, setArticles] = useState<any[]>([])
  const [videos, setVideos] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const [selectedArticle, setSelectedArticle] = useState<any | null>(null)
  const [selectedVideo, setSelectedVideo] = useState<any | null>(null)

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchQuery), 300)
    return () => clearTimeout(timer)
  }, [searchQuery])

  useEffect(() => {
    async function fetchContent() {
      setLoading(true)
      try {
        // Fetch articles
        let fetchedArticles: any[] = []
        if (supabase) {
          const { data: artData, error: artErr } = await supabase.from('health_articles').select('*')
          if (!artErr && artData) {
            fetchedArticles = artData.map(a => ({
              id: a.id,
              title: { en: a.title_en, hi: a.title_hi },
              summary: { en: a.summary_en, hi: a.summary_hi },
              content: { en: a.content_en, hi: a.content_hi },
              category: a.category,
              readTimeMinutes: a.read_time_minutes,
              thumbnailUrl: a.thumbnail_url,
              tone: a.tone || 'green',
              icon: a.icon || 'BookOpen'
            }))
          }
        }
        
        // Fallback to local data if DB is empty or fails
        if (fetchedArticles.length === 0) {
          fetchedArticles = AWARENESS_ARTICLES
        }
        setArticles(fetchedArticles)

        // Fetch videos
        if (supabase) {
          const { data: vidData, error: vidErr } = await supabase.from('health_videos').select('*')
          if (!vidErr && vidData) {
            setVideos(vidData.map(v => ({
              id: v.id,
              title: { en: v.title_en, hi: v.title_hi },
              youtube_id: v.youtube_id,
              category: v.category
            })))
          }
        }
      } catch (err) {
        console.error('Failed to fetch awareness content:', err)
        setArticles(AWARENESS_ARTICLES)
      }
      setLoading(false)
    }
    fetchContent()
  }, [])

  const filteredArticles = useMemo(() => {
    return articles.filter(article => {
      const matchesSearch = debouncedSearch
        ? article.title[language].toLowerCase().includes(debouncedSearch.toLowerCase()) ||
          article.summary[language].toLowerCase().includes(debouncedSearch.toLowerCase())
        : true
      const matchesCategory = activeCategory === 'all' || article.category === activeCategory
      return matchesSearch && matchesCategory
    })
  }, [articles, debouncedSearch, activeCategory, language])

  const filteredVideos = useMemo(() => {
    return videos.filter(video => {
      const matchesSearch = debouncedSearch
        ? video.title[language].toLowerCase().includes(debouncedSearch.toLowerCase())
        : true
      const matchesCategory = activeCategory === 'all' || video.category === activeCategory
      return matchesSearch && matchesCategory
    })
  }, [videos, debouncedSearch, activeCategory, language])

  if (!isFeatureEnabled('awareness')) {
    return (
      <AppShell>
        <PageHeader title={t('awareness.title')} rightSlot={<LanguageToggle compact />} />
        <EmptyState
          icon={BookOpen}
          title="Health Jaankari band hai"
          description="Is feature ko Settings mein chalu karein"
          actionLabel="Settings mein jayein"
          onAction={() => router.push('/settings')}
          tone="feature"
        />
      </AppShell>
    )
  }

  const categories: (AwarenessCategory | 'all')[] = ['all', 'periods', 'pregnancy', 'anaemia', 'nutrition', 'newborn', 'vaccination', 'mentalHealth', 'phc']

  const handleShare = async (item: any, type: 'article' | 'video') => {
    const text = `${item.title[language]}\n\nPadhein SehatMitra par: SehatMitra.vercel.app`
    if (navigator.share) {
      try { await navigator.share({ title: item.title[language], text }) } catch (err) {}
    } else {
      navigator.clipboard.writeText(text)
    }
  }

  const containerVariants = { hidden: {}, visible: { transition: { staggerChildren: 0.05 } } }
  const itemVariants = { hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }

  return (
    <AppShell>
      <PageHeader title={t('awareness.title')} subtitle={t('awareness.subtitle')} rightSlot={<LanguageToggle compact />} />

      <div className="sticky top-[52px] z-10 bg-brand-smoke/95 backdrop-blur-sm px-4 py-2 border-b border-brand-border shadow-sm flex flex-col gap-3">
        {/* Type Tabs */}
        <div className="flex gap-2">
          <button onClick={() => setActiveTab('articles')} className={`flex-1 flex items-center justify-center gap-2 h-10 rounded-xl font-bold transition-colors ${activeTab === 'articles' ? 'bg-brand-deepGreen text-white' : 'bg-white border border-brand-border text-brand-inkSoft hover:bg-brand-smoke'}`}>
            <BookOpen size={16} /> Articles
          </button>
          <button onClick={() => setActiveTab('videos')} className={`flex-1 flex items-center justify-center gap-2 h-10 rounded-xl font-bold transition-colors ${activeTab === 'videos' ? 'bg-brand-deepGreen text-white' : 'bg-white border border-brand-border text-brand-inkSoft hover:bg-brand-smoke'}`}>
            <PlaySquare size={16} /> Videos
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-inkSoft" size={16} />
          <input
            type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('awareness.search')}
            className="w-full h-10 pl-10 pr-4 rounded-xl border border-brand-border focus:outline-none focus:ring-2 focus:ring-brand-deepGreen text-sm"
          />
        </div>
        
        {/* Categories */}
        <div className="flex overflow-x-auto gap-2 pb-2 scrollbar-hide -mx-4 px-4 snap-x">
          {categories.map(cat => (
            <button
              key={cat} onClick={() => { setActiveCategory(cat); setSearchQuery('') }}
              className={`flex-shrink-0 px-3 py-1.5 rounded-full text-sm snap-start transition-colors font-medium
                ${activeCategory === cat ? 'bg-brand-deepGreen text-white' : 'bg-white border border-brand-border text-brand-inkSoft hover:bg-brand-smoke'}`}
            >
              {t(`awareness.category.${cat}` as any)}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 pb-10">
        {loading ? (
          <div className="flex flex-col gap-4">
            {[1, 2, 3].map(i => <div key={i} className="bg-white border border-brand-border rounded-2xl p-4 h-[180px] animate-pulse" />)}
          </div>
        ) : activeTab === 'articles' ? (
          filteredArticles.length > 0 ? (
            <motion.div variants={containerVariants} initial="hidden" animate="visible" className="flex flex-col gap-4">
              {filteredArticles.map(article => (
                <motion.div key={article.id} variants={itemVariants} onClick={() => setSelectedArticle(article)} className="bg-white border border-brand-border rounded-2xl overflow-hidden shadow-card hover:shadow-card-md transition-shadow cursor-pointer flex flex-col">
                  <div className={`w-full h-1 bg-brand-deepGreen`} />
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-brand-lightGreen text-brand-deepGreen`}>
                        {t(`awareness.category.${article.category}` as any)}
                      </span>
                      <span className="text-[10px] font-semibold text-brand-inkSoft bg-brand-smoke px-1.5 py-0.5 rounded">
                        {t('awareness.readTime', { n: article.readTimeMinutes || 5 })}
                      </span>
                    </div>
                    <h3 className="text-base font-semibold text-brand-ink mb-1.5 line-clamp-2 leading-tight">{article.title[language]}</h3>
                    <p className="text-sm text-brand-inkSoft mb-3 line-clamp-3">{article.summary[language]}</p>
                    <div className="flex items-center justify-between text-brand-deepGreen pt-3 border-t border-brand-border border-dashed">
                      <BookOpen size={16} />
                      <span className="text-sm font-medium flex items-center gap-1">{t('awareness.read')} <ArrowRight size={14} /></span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <EmptyState icon={Search} title={t('awareness.empty')} description="" actionLabel={t('awareness.emptyAction')} onAction={() => { setSearchQuery(''); setActiveCategory('all') }} />
          )
        ) : (
          filteredVideos.length > 0 ? (
            <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredVideos.map(video => (
                <motion.div key={video.id} variants={itemVariants} onClick={() => setSelectedVideo(video)} className="bg-white border border-brand-border rounded-2xl overflow-hidden shadow-card hover:shadow-card-md transition-shadow cursor-pointer">
                  <div className="relative aspect-video w-full bg-brand-smoke overflow-hidden group">
                    <Image src={`https://img.youtube.com/vi/${video.youtube_id}/mqdefault.jpg`} alt={video.title[language]} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                      <PlayCircle size={48} className="text-white drop-shadow-md" />
                    </div>
                  </div>
                  <div className="p-4">
                    <span className={`inline-block mb-2 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-brand-pinkLight text-brand-pink`}>
                      {t(`awareness.category.${video.category}` as any)}
                    </span>
                    <h3 className="text-sm font-bold text-brand-ink leading-tight line-clamp-2">{video.title[language]}</h3>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <EmptyState icon={PlaySquare} title="No videos found" description="Check back later for new health videos" actionLabel="Clear Search" onAction={() => { setSearchQuery(''); setActiveCategory('all') }} />
          )
        )}
      </div>

      {/* Article Viewer Sheet */}
      <Sheet open={!!selectedArticle} onOpenChange={(open) => !open && setSelectedArticle(null)}>
        <SheetContent side="bottom" className="rounded-t-3xl h-[90vh] p-0 flex flex-col max-w-[430px] mx-auto outline-none">
          {selectedArticle && (
            <>
              <SheetHeader className="p-5 border-b border-brand-border text-left relative flex-shrink-0">
                <div className="flex items-center gap-2 mb-3">
                  <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-brand-lightGreen text-brand-deepGreen`}>
                    {t(`awareness.category.${selectedArticle.category}` as any)}
                  </span>
                </div>
                <SheetTitle className="text-xl font-bold text-brand-ink leading-tight pr-10">{selectedArticle.title[language]}</SheetTitle>
                <button onClick={() => handleShare(selectedArticle, 'article')} className="absolute right-5 top-5 w-8 h-8 flex items-center justify-center rounded-full bg-brand-smoke text-brand-ink active:bg-brand-border"><Share2 size={16} /></button>
              </SheetHeader>
              <div className="p-5 overflow-y-auto flex-1 text-brand-ink">
                {selectedArticle.content[language].map((paragraph: string, idx: number) => (
                  <p key={`${selectedArticle.id}-p-${idx}`} className="text-[15px] leading-relaxed mb-4 text-brand-ink/90">{paragraph}</p>
                ))}
              </div>
              <div className="p-4 bg-white border-t border-brand-border flex-shrink-0 pb-[calc(16px+env(safe-area-inset-bottom,0px))]">
                <div className="bg-brand-blueLight border border-brand-blue/20 rounded-xl p-3 flex gap-3 items-start">
                  <Info size={16} className="text-brand-blue shrink-0 mt-0.5" />
                  <p className="text-[11px] text-brand-blue font-medium leading-relaxed">{t('awareness.disclaimer')}</p>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      {/* Video Viewer Sheet */}
      <Sheet open={!!selectedVideo} onOpenChange={(open) => !open && setSelectedVideo(null)}>
        <SheetContent side="bottom" className="rounded-t-3xl h-[85vh] p-0 flex flex-col max-w-[430px] mx-auto outline-none bg-black">
          {selectedVideo && (
            <>
              <SheetHeader className="p-4 border-b border-white/10 text-left relative flex-shrink-0 bg-brand-ink">
                <SheetTitle className="text-base font-bold text-white leading-tight pr-10 line-clamp-2">{selectedVideo.title[language]}</SheetTitle>
                <button onClick={() => handleShare(selectedVideo, 'video')} className="absolute right-4 top-4 w-8 h-8 flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"><Share2 size={16} /></button>
              </SheetHeader>
              <div className="flex-1 flex flex-col justify-center w-full bg-black relative">
                <iframe 
                  className="w-full aspect-video" 
                  src={`https://www.youtube.com/embed/${selectedVideo.youtube_id}?autoplay=1`} 
                  title={selectedVideo.title[language]} 
                  frameBorder="0" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                  allowFullScreen
                />
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

    </AppShell>
  )
}
