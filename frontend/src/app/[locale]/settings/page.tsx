'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Pill, Building2, HeartPulse, Syringe, BookOpen, Settings as SettingsIcon, Bell, Shield, Share2, LogOut, Edit3, Trash2, Plus, Info, CheckCircle } from 'lucide-react'

import { AppShell } from '@/components/layout/AppShell'
import { PageHeader } from '@/components/layout/PageHeader'
import { FeatureToggleRow } from '@/components/shared/FeatureToggleRow'
import { LanguageToggle } from '@/components/shared/LanguageToggle'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'

import { useUserStore } from '@/store/userStore'
import { FamilyMember } from '@/types'
import { INDIAN_STATES } from '@/data/states'
import { isSupabaseConfigured, supabase } from '@/lib/supabase'

export default function SettingsPage() {
  const t = useTranslations()
  const router = useRouter()
  const { profile, familyMembers, language, updateProfile, addFamilyMember, updateFamilyMember, removeFamilyMember, getWalletData, clearStore } = useUserStore()
  const wallet = getWalletData()

  const [editProfileOpen, setEditProfileOpen] = useState(false)
  const [memberDialogOpen, setMemberDialogOpen] = useState(false)
  const [editingMember, setEditingMember] = useState<FamilyMember | null>(null)
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)
  const [logoutOpen, setLogoutOpen] = useState(false)
  const [privacyOpen, setPrivacyOpen] = useState(false)
  const [aboutOpen, setAboutOpen] = useState(false)

  const profileSchema = z.object({
    name: z.string().min(2, t('onboarding.error.nameMin')),
    city: z.string().min(2, t('onboarding.error.cityMin')),
    state: z.string().min(1, t('onboarding.error.stateMin')),
    age: z.string().refine((val) => {
      const num = parseInt(val, 10)
      return !isNaN(num) && num >= 13 && num <= 100
    }, t('onboarding.error.ageMin')),
  })

  const { register: regProfile, handleSubmit: submitProfile, formState: { isValid: isProfileValid }, setValue: setProfileVal, watch: watchProfile } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: profile?.name || '',
      city: profile?.city || '',
      state: profile?.state || '',
      age: profile?.age ? String(profile?.age) : '',
    },
    mode: 'onChange'
  })

  const memberSchema = z.object({
    name: z.string().min(2, 'Name is required'),
    relation: z.enum(['self', 'spouse', 'child', 'parent', 'other']),
    dob: z.string().optional(),
    gender: z.enum(['male', 'female', 'other']).optional(),
    isPregnant: z.boolean().default(false).optional(),
    lmpDate: z.string().optional(),
  })
  
  type MemberFormValues = z.infer<typeof memberSchema>

  const { control: ctlMember, register: regMember, handleSubmit: submitMember, formState: { isValid: isMemberValid }, setValue: setMemberVal, watch: watchMember, reset: resetMember } = useForm<MemberFormValues>({
    resolver: zodResolver(memberSchema),
    defaultValues: { name: '', relation: 'other', dob: '', gender: 'other', isPregnant: false, lmpDate: '' },
    mode: 'onChange'
  })

  if (!profile) return null

  const handleProfileSave = async (data: z.infer<typeof profileSchema>) => {
    const patch = { ...data, age: parseInt(data.age, 10) }
    updateProfile(patch)
    if (isSupabaseConfigured) {
      const { data: { user } } = await supabase!.auth.getUser()
      if (user) {
        await supabase!.from('profiles').update(patch).eq('id', user.id)
      }
    }
    setEditProfileOpen(false)
  }

  const openAddMember = () => {
    resetMember({ name: '', relation: 'other', dob: '', gender: 'other', isPregnant: false, lmpDate: '' })
    setEditingMember(null)
    setMemberDialogOpen(true)
  }

  const openEditMember = (member: FamilyMember) => {
    resetMember({
      name: member.name,
      relation: member.relation,
      dob: member.dob || '',
      gender: member.gender || 'other',
      isPregnant: member.isPregnant || false,
      lmpDate: member.lmpDate || ''
    })
    setEditingMember(member)
    setMemberDialogOpen(true)
  }

  const handleMemberSave = (data: MemberFormValues) => {
    const memberData: FamilyMember = {
      id: editingMember ? editingMember.id : `mem-${Date.now()}`,
      userId: profile.id,
      name: data.name,
      relation: data.relation,
      dob: data.dob || undefined,
      gender: data.gender,
      isPregnant: data.relation !== 'child' ? !!data.isPregnant : false,
      lmpDate: data.isPregnant && data.lmpDate ? data.lmpDate : undefined,
    }
    
    if (editingMember) updateFamilyMember(editingMember.id, memberData)
    else addFamilyMember(memberData)
    setMemberDialogOpen(false)
  }

  const handleDeleteMember = () => {
    if (deleteConfirmId) {
      removeFamilyMember(deleteConfirmId)
      setDeleteConfirmId(null)
    }
  }

  const handleLogout = async () => {
    if (isSupabaseConfigured) await supabase!.auth.signOut()
    clearStore()
    router.push('/')
  }

  const handleAppShare = () => {
    const text = 'SehatMitra — free family health app. Prescriptions scan karo, paise bachao. SehatMitra.vercel.app'
    if (navigator.share) navigator.share({ title: 'SehatMitra', text }).catch(()=>{})
    else { navigator.clipboard.writeText(text); alert(t('wallet.copy.success')) }
  }

  const OptionButton = ({ label, active, onClick }: { label: string, active: boolean, onClick: () => void }) => (
    <button type="button" onClick={onClick} className={`px-3 py-2 text-xs font-medium rounded-xl border transition-colors flex-1 text-center ${active ? 'bg-brand-deepGreen text-white border-brand-deepGreen shadow-sm' : 'bg-white text-brand-inkSoft border-brand-border hover:bg-brand-smoke'}`}>
      {label}
    </button>
  )

  const relationColor = (relation: string) => {
    switch(relation) {
      case 'self': return 'bg-brand-deepGreen text-white'
      case 'spouse': return 'bg-brand-blue text-white'
      case 'child': return 'bg-brand-saffron text-white'
      case 'parent': return 'bg-brand-pink text-white'
      default: return 'bg-brand-border text-brand-ink'
    }
  }

  return (
    <AppShell>
      <PageHeader title={t('settings.title')} showBack={false} />
      
      <div className="p-4 flex flex-col gap-6 pb-12">
        <section>
          <div className="bg-gradient-to-br from-brand-deepGreen to-brand-midGreen rounded-2xl p-5 shadow-card-md relative overflow-hidden">
            <div className="absolute -top-6 -right-6 w-28 h-28 rounded-full bg-white/5 pointer-events-none" />
            <div className="relative z-10">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-white/20 text-white font-bold text-lg flex items-center justify-center">
                    {profile.name.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-base leading-tight">{profile.name}</h3>
                    <p className="text-white/60 text-xs font-medium">{profile.city}, {profile.state}</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setEditProfileOpen(true)} className="text-white/80 hover:text-white hover:bg-white/10 h-8 w-8 p-0 rounded-lg">
                  <Edit3 size={15} />
                </Button>
              </div>
              <div className="flex items-center gap-4">
                <div>
                  <p className="text-white/50 text-[10px] font-semibold uppercase tracking-wide">Age</p>
                  <p className="text-white font-bold text-sm">{profile.age} yrs</p>
                </div>
                <div className="w-px h-8 bg-white/20" />
                <div>
                  <p className="text-white/50 text-[10px] font-semibold uppercase tracking-wide">Language</p>
                  <p className="text-white font-bold text-sm">{profile.language === 'hi' ? 'Hindi' : 'English'}</p>
                </div>
                <div className="w-px h-8 bg-white/20" />
                <div>
                  <p className="text-white/50 text-[10px] font-semibold uppercase tracking-wide">Total Saved</p>
                  <p className="text-white font-mono font-bold text-sm">₹{wallet.totalSavings}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section>
          <div className="mb-3">
            <p className="section-label">{t('settings.featuresTitle')}</p>
            <p className="text-xs text-brand-inkSoft mt-0.5">{t('settings.featuresSubtitle')}</p>
          </div>
          <div className="flex flex-col gap-3">
            <FeatureToggleRow featureKey="prescription" icon={Pill} title={t('features.prescription')} description={t('onboarding.features.prescription.desc')} tone="green" />
            <FeatureToggleRow featureKey="schemes" icon={Building2} title={t('features.schemes')} description={t('onboarding.features.schemes.desc')} tone="blue" />
            <FeatureToggleRow featureKey="pregnancy" icon={HeartPulse} title={t('features.pregnancy')} description={t('onboarding.features.pregnancy.desc')} tone="pink" />
            <FeatureToggleRow featureKey="vaccination" icon={Syringe} title={t('features.vaccination')} description={t('onboarding.features.vaccination.desc')} tone="saffron" />
            <FeatureToggleRow featureKey="awareness" icon={BookOpen} title={t('features.awareness')} description={t('onboarding.features.awareness.desc')} tone="green" />
          </div>
          <p className="text-center text-[10px] text-brand-inkSoft mt-3">{t('settings.featuresNote')}</p>
        </section>

        <section>
          <div className="flex items-center justify-between mb-3">
            <p className="section-label">{t('settings.familyTitle')}</p>
            <Button variant="ghost" size="sm" onClick={openAddMember} className="text-brand-deepGreen h-8 px-2 text-xs">
              <Plus size={14} className="mr-1" /> {t('settings.addMember')}
            </Button>
          </div>
          <div className="flex flex-col gap-3">
            {familyMembers.map(member => (
              <div key={member.id} className="bg-white border border-brand-border rounded-xl p-3 shadow-sm flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full font-bold flex items-center justify-center text-sm ${relationColor(member.relation)}`}>
                    {member.name.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="font-semibold text-sm text-brand-ink">{member.name}</span>
                      <span className="bg-brand-smoke px-1.5 py-0.5 rounded text-[9px] text-brand-inkSoft uppercase font-bold tracking-wide">{t(`settings.member.relation.${member.relation}` as any)}</span>
                    </div>
                    <p className="text-[10px] text-brand-inkSoft font-medium">
                      {member.relation === 'child' && member.dob ? `${Math.floor((Date.now() - new Date(member.dob).getTime()) / (30.44 * 24 * 60 * 60 * 1000))} months` : 
                       member.isPregnant ? 'Pregnant' : 
                       member.dob ? `${Math.floor((Date.now() - new Date(member.dob).getTime()) / (365.25 * 24 * 60 * 60 * 1000))} yrs` : ''}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => openEditMember(member)} className="p-2 text-brand-inkSoft hover:text-brand-deepGreen"><Edit3 size={16} /></button>
                  {member.relation !== 'self' && <button onClick={() => setDeleteConfirmId(member.id)} className="p-2 text-brand-danger hover:bg-brand-dangerLight rounded-full"><Trash2 size={16} /></button>}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <p className="section-label mb-3">{t('settings.languageTitle')}</p>
          <LanguageToggle />
        </section>

        <section>
          <p className="section-label mb-3">{t('settings.appTitle')}</p>
          <div className="bg-white border border-brand-border rounded-2xl shadow-sm overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-brand-border">
              <div className="flex items-center gap-3 text-brand-ink"><Bell size={20} className="text-brand-inkSoft" /><span className="text-sm font-medium">{t('settings.notifications')}</span></div>
              <Switch defaultChecked />
            </div>
            <button onClick={() => setPrivacyOpen(true)} className="flex items-center justify-between p-4 border-b border-brand-border active:bg-brand-smoke text-left">
              <div className="flex items-center gap-3 text-brand-ink"><Shield size={20} className="text-brand-inkSoft" /><span className="text-sm font-medium">{t('settings.privacy')}</span></div>
            </button>
            <button onClick={handleAppShare} className="flex items-center justify-between p-4 border-b border-brand-border active:bg-brand-smoke text-left">
              <div className="flex items-center gap-3 text-brand-ink"><Share2 size={20} className="text-brand-inkSoft" /><span className="text-sm font-medium">{t('settings.shareApp')}</span></div>
            </button>
            <button onClick={() => setAboutOpen(true)} className="flex items-center justify-between p-4 border-b border-brand-border active:bg-brand-smoke text-left">
              <div className="flex items-center gap-3 text-brand-ink"><Info size={20} className="text-brand-inkSoft" /><span className="text-sm font-medium">{t('settings.about')}</span></div>
            </button>
            <button onClick={() => setLogoutOpen(true)} className="flex items-center justify-between p-4 active:bg-brand-dangerLight text-left">
              <div className="flex items-center gap-3 text-brand-danger"><LogOut size={20} /><span className="text-sm font-semibold">{t('settings.logout')}</span></div>
            </button>
          </div>
        </section>

        <div className="py-8 text-center flex flex-col items-center justify-center opacity-60">
          <div className="w-8 h-8 bg-brand-border rounded-lg mb-3 flex items-center justify-center text-brand-ink font-bold">S</div>
          <p className="text-xs font-bold text-brand-ink mb-1">{t('settings.version')}</p>
          <p className="text-[10px] text-brand-inkSoft mb-1">SehatMitra</p>
          <p className="text-[10px] text-brand-inkSoft italic">&quot;{t('app.tagline')}&quot;</p>
        </div>
      </div>

      {/* Dialogs */}
      <Dialog open={editProfileOpen} onOpenChange={setEditProfileOpen}>
        <DialogContent className="w-[90%] max-w-[400px] rounded-2xl p-6">
          <DialogHeader><DialogTitle>Edit Profile</DialogTitle></DialogHeader>
          <form id="profile-edit-form" onSubmit={submitProfile(handleProfileSave)} className="flex flex-col gap-4 mt-2">
            <div className="space-y-1"><label className="text-xs font-medium text-brand-inkSoft uppercase">{t('onboarding.step1.nameLabel')}</label><Input {...regProfile('name')} className="h-11 rounded-xl" /></div>
            <div className="space-y-1"><label className="text-xs font-medium text-brand-inkSoft uppercase">{t('onboarding.step1.cityLabel')}</label><Input {...regProfile('city')} className="h-11 rounded-xl" /></div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-brand-inkSoft uppercase">{t('onboarding.step1.stateLabel')}</label>
              <Select onValueChange={(val) => setProfileVal('state', val, { shouldValidate: true })} defaultValue={watchProfile('state')}>
                <SelectTrigger className="h-11 rounded-xl"><SelectValue /></SelectTrigger>
                <SelectContent className="max-h-[250px]">{INDIAN_STATES.map(s => <SelectItem key={s.id} value={s.en}>{language === 'hi' ? s.hi : s.en}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-1"><label className="text-xs font-medium text-brand-inkSoft uppercase">{t('onboarding.step1.ageLabel')}</label><Input type="number" {...regProfile('age')} className="h-11 rounded-xl" /></div>
          </form>
          <DialogFooter className="flex-col gap-2 mt-4">
            <Button type="submit" form="profile-edit-form" disabled={!isProfileValid} className="w-full h-11 rounded-xl bg-brand-deepGreen">{t('common.save')}</Button>
            <Button variant="ghost" onClick={() => setEditProfileOpen(false)} className="w-full h-11 rounded-xl">{t('common.cancel')}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={memberDialogOpen} onOpenChange={setMemberDialogOpen}>
        <DialogContent className="w-[90%] max-w-[400px] rounded-2xl p-6 h-[80vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editingMember ? t('settings.member.edit') : t('settings.member.add')}</DialogTitle></DialogHeader>
          <form id="member-form" onSubmit={submitMember(handleMemberSave)} className="flex flex-col gap-4 mt-2">
            <div className="space-y-1.5"><label className="text-xs font-medium text-brand-inkSoft uppercase">Name</label><Input {...regMember('name')} className="h-11 rounded-xl" /></div>
            <div className="space-y-1.5"><label className="text-xs font-medium text-brand-inkSoft uppercase">Relation</label>
              <div className="grid grid-cols-3 gap-2">
                <OptionButton label={t('settings.member.relation.spouse')} active={watchMember('relation') === 'spouse'} onClick={() => setMemberVal('relation', 'spouse')} />
                <OptionButton label={t('settings.member.relation.child')} active={watchMember('relation') === 'child'} onClick={() => setMemberVal('relation', 'child')} />
                <OptionButton label={t('settings.member.relation.parent')} active={watchMember('relation') === 'parent'} onClick={() => setMemberVal('relation', 'parent')} />
                <OptionButton label={t('settings.member.relation.other')} active={watchMember('relation') === 'other'} onClick={() => setMemberVal('relation', 'other')} />
              </div>
            </div>
            <div className="space-y-1.5"><label className="text-xs font-medium text-brand-inkSoft uppercase">Date of Birth</label><Input type="date" {...regMember('dob')} max={new Date().toISOString().split('T')[0]} className="h-11 rounded-xl font-mono text-sm" /></div>
            <div className="space-y-1.5"><label className="text-xs font-medium text-brand-inkSoft uppercase">Gender</label>
              <div className="flex gap-2">
                <OptionButton label="Male" active={watchMember('gender') === 'male'} onClick={() => setMemberVal('gender', 'male')} />
                <OptionButton label="Female" active={watchMember('gender') === 'female'} onClick={() => setMemberVal('gender', 'female')} />
              </div>
            </div>
            {watchMember('relation') !== 'child' && watchMember('gender') !== 'male' && (
              <div className="p-4 border border-brand-border rounded-xl bg-brand-smoke space-y-4">
                <div className="flex items-center justify-between"><label className="text-sm font-medium text-brand-ink">Is Pregnant?</label><Controller name="isPregnant" control={ctlMember} render={({field}) => <Switch checked={field.value} onCheckedChange={field.onChange} />} /></div>
                {watchMember('isPregnant') && (
                  <div className="space-y-1.5 pt-2 border-t border-brand-border">
                    <label className="text-xs font-medium text-brand-inkSoft uppercase">LMP Date (Last Period)</label><Input type="date" {...regMember('lmpDate')} max={new Date().toISOString().split('T')[0]} className="h-11 rounded-xl font-mono text-sm" />
                    <p className="text-[10px] text-brand-inkSoft leading-tight mt-1">LMP date se pregnancy week automatically track hoga.</p>
                  </div>
                )}
              </div>
            )}
          </form>
          <DialogFooter className="flex-col gap-2 mt-2">
            <Button type="submit" form="member-form" disabled={!isMemberValid} className="w-full h-11 rounded-xl bg-brand-deepGreen">{t('common.save')}</Button>
            <Button variant="ghost" onClick={() => setMemberDialogOpen(false)} className="w-full h-11 rounded-xl">{t('common.cancel')}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!deleteConfirmId} onOpenChange={(open) => !open && setDeleteConfirmId(null)}>
        <DialogContent className="w-[90%] max-w-[320px] rounded-2xl p-6">
          <DialogHeader><DialogTitle className="text-brand-danger">Delete Member</DialogTitle></DialogHeader>
          <div className="py-2"><p className="text-sm text-brand-ink">{t('settings.member.deleteConfirm', { name: familyMembers.find(m => m.id === deleteConfirmId)?.name || '' })}</p></div>
          <DialogFooter className="flex-col gap-2 mt-4">
            <Button onClick={handleDeleteMember} variant="destructive" className="w-full h-11 rounded-xl">{t('common.delete')}</Button>
            <Button variant="ghost" onClick={() => setDeleteConfirmId(null)} className="w-full h-11 rounded-xl">{t('common.cancel')}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Sheet open={privacyOpen} onOpenChange={setPrivacyOpen}>
        <SheetContent side="bottom" className="rounded-t-3xl max-w-[430px] mx-auto p-6">
          <SheetHeader className="mb-6 text-left"><SheetTitle>{t('settings.privacyTitle')}</SheetTitle></SheetHeader>
          <div className="flex flex-col gap-4">
            <div className="flex items-start gap-3"><Shield className="text-brand-deepGreen shrink-0 mt-0.5" size={20} /><p className="text-sm text-brand-ink leading-relaxed">{t('settings.privacyDemo')}</p></div>
            <div className="flex items-start gap-3"><Building2 className="text-brand-blue shrink-0 mt-0.5" size={20} /><p className="text-sm text-brand-ink leading-relaxed">{t('settings.privacySupabase')}</p></div>
            <div className="flex items-start gap-3"><CheckCircle className="text-brand-midGreen shrink-0 mt-0.5" size={20} /><p className="text-sm text-brand-ink leading-relaxed font-semibold">{t('settings.privacyNoSell')}</p></div>
          </div>
          <Button onClick={() => setPrivacyOpen(false)} className="w-full h-12 mt-8 rounded-xl bg-brand-deepGreen">Understood</Button>
        </SheetContent>
      </Sheet>

      <Dialog open={aboutOpen} onOpenChange={setAboutOpen}>
        <DialogContent className="w-[90%] max-w-[320px] rounded-2xl p-6 text-center">
          <div className="w-16 h-16 bg-brand-deepGreen rounded-2xl flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">S</div>
          <DialogTitle className="text-xl">{t('settings.version')}</DialogTitle>
          <div className="py-4 space-y-2"><p className="text-sm font-semibold text-brand-ink">SehatMitra</p><p className="text-xs text-brand-inkSoft">Built with Next.js 14, Zustand, Shadcn & Tailwind CSS.</p><p className="text-xs text-brand-inkSoft">AI features powered by Google Gemini.</p></div>
          <Button onClick={() => setAboutOpen(false)} variant="outline" className="w-full h-11 rounded-xl mt-2">Close</Button>
        </DialogContent>
      </Dialog>

      <Dialog open={logoutOpen} onOpenChange={setLogoutOpen}>
        <DialogContent className="w-[90%] max-w-[320px] rounded-2xl p-6">
          <DialogHeader><DialogTitle className="text-brand-danger">{t('settings.logout')}</DialogTitle></DialogHeader>
          <div className="py-2 space-y-2"><p className="text-sm text-brand-ink font-medium">{t('settings.logoutConfirm')}</p><p className="text-xs text-brand-inkSoft">{t('settings.logoutNote')}</p></div>
          <DialogFooter className="flex-col gap-2 mt-4">
            <Button onClick={handleLogout} variant="destructive" className="w-full h-11 rounded-xl">Logout</Button>
            <Button variant="ghost" onClick={() => setLogoutOpen(false)} className="w-full h-11 rounded-xl">{t('common.cancel')}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppShell>
  )
}
