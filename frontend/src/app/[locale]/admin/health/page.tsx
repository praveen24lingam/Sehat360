'use client'

import { useState } from 'react'
import { AppShell } from '@/components/layout/AppShell'
import { PageHeader } from '@/components/layout/PageHeader'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { AlertCircle, Plus, Youtube, FileText } from 'lucide-react'

export default function AdminHealthPage() {
  const [activeTab, setActiveTab] = useState<'articles' | 'videos'>('articles')
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState('')
  const [error, setError] = useState('')

  // Article Form State
  const [article, setArticle] = useState({
    title_en: '', title_hi: '',
    summary_en: '', summary_hi: '',
    category: 'nutrition',
    content_en: '', content_hi: ''
  })

  // Video Form State
  const [video, setVideo] = useState({
    title_en: '', title_hi: '',
    youtube_id: '', category: 'nutrition'
  })

  const handleAddArticle = async () => {
    setLoading(true); setMsg(''); setError('')
    try {
      if (!supabase) throw new Error('Supabase not configured')
      const payload = {
        ...article,
        content_en: article.content_en.split('\n').filter(Boolean),
        content_hi: article.content_hi.split('\n').filter(Boolean)
      }
      const { error: sbErr } = await supabase.from('health_articles').insert([payload])
      if (sbErr) throw sbErr
      setMsg('Article added successfully!')
      setArticle({ title_en: '', title_hi: '', summary_en: '', summary_hi: '', category: 'nutrition', content_en: '', content_hi: '' })
    } catch (err: any) {
      setError(err?.message || 'Error adding article')
    }
    setLoading(false)
  }

  const handleAddVideo = async () => {
    setLoading(true); setMsg(''); setError('')
    try {
      if (!supabase) throw new Error('Supabase not configured')
      const { error: sbErr } = await supabase.from('health_videos').insert([video])
      if (sbErr) throw sbErr
      setMsg('Video added successfully!')
      setVideo({ title_en: '', title_hi: '', youtube_id: '', category: 'nutrition' })
    } catch (err: any) {
      setError(err?.message || 'Error adding video')
    }
    setLoading(false)
  }

  return (
    <AppShell>
      <PageHeader title="Health Admin" subtitle="Manage Awareness Content" />
      <div className="p-4 md:p-6 lg:p-8">
        
        <div className="flex gap-2 mb-6">
          <Button 
            variant={activeTab === 'articles' ? 'default' : 'outline'} 
            onClick={() => setActiveTab('articles')}
            className={`flex-1 rounded-xl h-12 ${activeTab === 'articles' ? 'bg-brand-deepGreen text-white' : 'text-brand-ink'}`}
          >
            <FileText className="mr-2" size={18} /> Add Article
          </Button>
          <Button 
            variant={activeTab === 'videos' ? 'default' : 'outline'} 
            onClick={() => setActiveTab('videos')}
            className={`flex-1 rounded-xl h-12 ${activeTab === 'videos' ? 'bg-brand-deepGreen text-white' : 'text-brand-ink'}`}
          >
            <Youtube className="mr-2" size={18} /> Add Video
          </Button>
        </div>

        {error && <div className="p-4 mb-6 bg-brand-dangerLight text-brand-danger rounded-xl flex items-center gap-2"><AlertCircle size={18} /> {error}</div>}
        {msg && <div className="p-4 mb-6 bg-brand-lightGreen text-brand-deepGreen rounded-xl font-medium">{msg}</div>}

        {activeTab === 'articles' && (
          <div className="bg-white p-6 rounded-2xl shadow-card border border-brand-border flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-bold text-brand-ink mb-1 block">Title (English)</label>
                <Input value={article.title_en} onChange={e => setArticle({...article, title_en: e.target.value})} placeholder="Title in English" />
              </div>
              <div>
                <label className="text-sm font-bold text-brand-ink mb-1 block">Title (Hindi)</label>
                <Input value={article.title_hi} onChange={e => setArticle({...article, title_hi: e.target.value})} placeholder="Title in Hindi" />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-bold text-brand-ink mb-1 block">Summary (English)</label>
                <Input value={article.summary_en} onChange={e => setArticle({...article, summary_en: e.target.value})} placeholder="Short description" />
              </div>
              <div>
                <label className="text-sm font-bold text-brand-ink mb-1 block">Summary (Hindi)</label>
                <Input value={article.summary_hi} onChange={e => setArticle({...article, summary_hi: e.target.value})} placeholder="Short description" />
              </div>
            </div>

            <div>
              <label className="text-sm font-bold text-brand-ink mb-1 block">Category</label>
              <select className="w-full h-10 rounded-md border border-brand-border px-3" value={article.category} onChange={e => setArticle({...article, category: e.target.value})}>
                <option value="nutrition">Nutrition</option>
                <option value="pregnancy">Pregnancy</option>
                <option value="vaccination">Vaccination</option>
                <option value="mentalHealth">Mental Health</option>
                <option value="periods">Periods</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-bold text-brand-ink mb-1 block">Content (English) - Paragraphs separated by newlines</label>
                <Textarea value={article.content_en} onChange={e => setArticle({...article, content_en: e.target.value})} rows={6} placeholder="Write paragraphs..." />
              </div>
              <div>
                <label className="text-sm font-bold text-brand-ink mb-1 block">Content (Hindi) - Paragraphs separated by newlines</label>
                <Textarea value={article.content_hi} onChange={e => setArticle({...article, content_hi: e.target.value})} rows={6} placeholder="Write paragraphs..." />
              </div>
            </div>

            <Button onClick={handleAddArticle} disabled={loading} className="w-full h-12 bg-brand-deepGreen text-white rounded-xl mt-4">
              {loading ? 'Adding...' : 'Save Article'}
            </Button>
          </div>
        )}

        {activeTab === 'videos' && (
          <div className="bg-white p-6 rounded-2xl shadow-card border border-brand-border flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-bold text-brand-ink mb-1 block">Title (English)</label>
                <Input value={video.title_en} onChange={e => setVideo({...video, title_en: e.target.value})} placeholder="Video Title" />
              </div>
              <div>
                <label className="text-sm font-bold text-brand-ink mb-1 block">Title (Hindi)</label>
                <Input value={video.title_hi} onChange={e => setVideo({...video, title_hi: e.target.value})} placeholder="Video Title" />
              </div>
            </div>

            <div>
              <label className="text-sm font-bold text-brand-ink mb-1 block">YouTube Video ID</label>
              <Input value={video.youtube_id} onChange={e => setVideo({...video, youtube_id: e.target.value})} placeholder="e.g. dQw4w9WgXcQ" />
              <p className="text-xs text-brand-inkSoft mt-1">Found in the URL: youtube.com/watch?v=<strong>dQw4w9WgXcQ</strong></p>
            </div>

            <div>
              <label className="text-sm font-bold text-brand-ink mb-1 block">Category</label>
              <select className="w-full h-10 rounded-md border border-brand-border px-3" value={video.category} onChange={e => setVideo({...video, category: e.target.value})}>
                <option value="nutrition">Nutrition</option>
                <option value="pregnancy">Pregnancy</option>
                <option value="vaccination">Vaccination</option>
                <option value="mentalHealth">Mental Health</option>
                <option value="periods">Periods</option>
              </select>
            </div>

            <Button onClick={handleAddVideo} disabled={loading} className="w-full h-12 bg-brand-deepGreen text-white rounded-xl mt-4">
              {loading ? 'Adding...' : 'Save Video'}
            </Button>
          </div>
        )}

      </div>
    </AppShell>
  )
}
