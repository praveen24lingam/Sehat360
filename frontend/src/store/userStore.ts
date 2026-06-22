import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { UserProfile, FamilyMember, Prescription, Scheme, VaccineRecord, FeatureFlags, WalletData, Reminder, SchemeAnswers } from '@/types'
import { MOCK_PROFILE, MOCK_FAMILY, MOCK_PRESCRIPTION, MOCK_WALLET, MOCK_REMINDERS } from '@/data/mockData'
import { isSupabaseConfigured } from '@/lib/supabase'

interface UserStore {
  profile: UserProfile | null
  familyMembers: FamilyMember[]
  prescriptions: Prescription[]
  schemeAnswers: SchemeAnswers | null
  matchedSchemes: Scheme[]
  vaccinationRecords: Record<string, VaccineRecord[]>
  reminders: Reminder[]
  language: 'hi' | 'en'
  isDemo: boolean
  
  setProfile: (profile: UserProfile) => void
  updateProfile: (patch: Partial<UserProfile>) => void
  toggleFeature: (key: keyof FeatureFlags) => void
  setFeature: (key: keyof FeatureFlags, value: boolean) => void
  isFeatureEnabled: (key: keyof FeatureFlags) => boolean
  setLanguage: (lang: 'hi' | 'en') => void
  addFamilyMember: (member: FamilyMember) => void
  updateFamilyMember: (id: string, patch: Partial<FamilyMember>) => void
  removeFamilyMember: (id: string) => void
  addPrescription: (prescription: Prescription) => void
  setSchemeResults: (answers: SchemeAnswers, schemes: Scheme[]) => void
  markVaccineDone: (memberId: string, vaccineId: string, doneDate: string) => void
  getPregnantMember: () => FamilyMember | undefined
  getChildMembers: () => FamilyMember[]
  getWalletData: () => WalletData
  clearStore: () => void
}

export const useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
      profile: !isSupabaseConfigured ? MOCK_PROFILE : null,
      familyMembers: !isSupabaseConfigured ? MOCK_FAMILY : [],
      prescriptions: !isSupabaseConfigured ? [MOCK_PRESCRIPTION] : [],
      schemeAnswers: null,
      matchedSchemes: [],
      vaccinationRecords: {},
      reminders: !isSupabaseConfigured ? MOCK_REMINDERS : [],
      language: 'hi',
      isDemo: !isSupabaseConfigured,

      setProfile: (profile) => set({ profile }),
      updateProfile: (patch) => set((state) => ({ profile: state.profile ? { ...state.profile, ...patch } : null })),
      
      toggleFeature: (key) => set((state) => ({
        profile: state.profile 
          ? { ...state.profile, features: { ...state.profile.features, [key]: !state.profile.features[key] } }
          : null
      })),
      
      setFeature: (key, value) => set((state) => ({
        profile: state.profile 
          ? { ...state.profile, features: { ...state.profile.features, [key]: value } }
          : null
      })),
      
      isFeatureEnabled: (key) => {
        const state = get();
        if (state.isDemo) return true;
        return state.profile ? state.profile.features[key] : false;
      },
      
      setLanguage: (lang) => set({ language: lang }),
      
      addFamilyMember: (member) => set((state) => ({ familyMembers: [...state.familyMembers, member] })),
      updateFamilyMember: (id, patch) => set((state) => ({
        familyMembers: state.familyMembers.map((m) => m.id === id ? { ...m, ...patch } : m)
      })),
      removeFamilyMember: (id) => set((state) => ({
        familyMembers: state.familyMembers.filter((m) => m.id !== id)
      })),
      
      addPrescription: (prescription) => set((state) => ({
        prescriptions: [...state.prescriptions, prescription]
      })),
      
      setSchemeResults: (answers, schemes) => set({ schemeAnswers: answers, matchedSchemes: schemes }),
      
      markVaccineDone: (memberId, vaccineId, doneDate) => set((state) => {
        const records = state.vaccinationRecords[memberId] || [];
        const updatedRecords = records.map(r => 
          r.id === vaccineId ? { ...r, done: true, doneDate, status: 'done' as const } : r
        );
        return {
          vaccinationRecords: { ...state.vaccinationRecords, [memberId]: updatedRecords }
        };
      }),
      
      getPregnantMember: () => get().familyMembers.find(m => m.isPregnant),
      getChildMembers: () => get().familyMembers.filter(m => m.relation === 'child'),
      
      getWalletData: () => {
        const state = get();
        if (state.isDemo && state.prescriptions.length <= 1 && state.matchedSchemes.length === 0) return MOCK_WALLET;
        const prescriptionsScanned = state.prescriptions.length;
        const monthlySavings = state.prescriptions.reduce((sum, p) => sum + p.totalMonthlySaving, 0);
        const totalSavings = state.prescriptions.reduce((sum, p) => sum + p.totalYearlySaving, 0);
        const schemesUnlocked = state.matchedSchemes.filter(s => s.status === 'eligible').length;
        
        let totalVaccines = 0;
        let doneVaccines = 0;
        Object.values(state.vaccinationRecords).forEach(records => {
          totalVaccines += records.length;
          doneVaccines += records.filter(r => r.done).length;
        });
        const vaccinationPercent = totalVaccines > 0 ? Math.round((doneVaccines / totalVaccines) * 100) : 0;
        
        return {
          totalSavings,
          monthlySavings,
          prescriptionsScanned,
          schemesUnlocked,
          vaccinationPercent
        };
      },
      
      clearStore: () => set({
        profile: !isSupabaseConfigured ? MOCK_PROFILE : null,
        familyMembers: !isSupabaseConfigured ? MOCK_FAMILY : [],
        prescriptions: !isSupabaseConfigured ? [MOCK_PRESCRIPTION] : [],
        schemeAnswers: null,
        matchedSchemes: [],
        vaccinationRecords: {},
        reminders: !isSupabaseConfigured ? MOCK_REMINDERS : [],
        isDemo: !isSupabaseConfigured
      })
    }),
    {
      name: 'sehatmitra-storage',
      partialize: (state) => ({
        profile: state.profile,
        familyMembers: state.familyMembers,
        prescriptions: state.prescriptions,
        matchedSchemes: state.matchedSchemes,
        vaccinationRecords: state.vaccinationRecords,
        language: state.language
      }),
    }
  )
)
