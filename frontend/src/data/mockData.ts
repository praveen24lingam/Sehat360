import type { UserProfile, FamilyMember, Prescription, Reminder } from '@/types'

export const MOCK_PROFILE: UserProfile = {
  id: 'mock-user-1',
  name: 'Meena Sharma',
  city: 'Indore',
  state: 'Madhya Pradesh',
  age: 32,
  language: 'hi',
  features: {
    prescription: true,
    schemes: true,
    pregnancy: true,
    vaccination: true,
    awareness: true,
  },
}

export const MOCK_FAMILY: FamilyMember[] = [
  {
    id: 'member-1',
    userId: 'mock-user-1',
    name: 'Meena Sharma',
    relation: 'self',
    dob: '1992-03-15',
    gender: 'female',
    isPregnant: true,
    pregnancyWeek: 22,
    lmpDate: new Date(Date.now() - 22 * 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  },
  {
    id: 'member-2',
    userId: 'mock-user-1',
    name: 'Rajesh Sharma',
    relation: 'spouse',
    dob: '1989-07-22',
    gender: 'male',
  },
  {
    id: 'member-3',
    userId: 'mock-user-1',
    name: 'Arjun Sharma',
    relation: 'child',
    dob: new Date(Date.now() - 15 * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    gender: 'male',
  },
  {
    id: 'member-4',
    userId: 'mock-user-1',
    name: 'Savitri Devi',
    relation: 'parent',
    dob: '1964-11-08',
    gender: 'female',
  },
]

export const MOCK_PRESCRIPTION: Prescription = {
  id: 'rx-001',
  userId: 'mock-user-1',
  medicines: [
    {
      id: 'med-1',
      brandName: 'Glycomet 500',
      saltName: 'Metformin',
      dosage: '500mg',
      brandPrice: 85,
      genericPrice: 12,
      monthlySaving: 73,
      yearlySaving: 876,
      confidence: 0.92,
      source: 'fallback',
    },
    {
      id: 'med-2',
      brandName: 'Lipitor 10',
      saltName: 'Atorvastatin',
      dosage: '10mg',
      brandPrice: 145,
      genericPrice: 18,
      monthlySaving: 127,
      yearlySaving: 1524,
      confidence: 0.88,
      source: 'fallback',
    },
    {
      id: 'med-3',
      brandName: 'Deplatt 75',
      saltName: 'Clopidogrel',
      dosage: '75mg',
      brandPrice: 165,
      genericPrice: 33,
      monthlySaving: 132,
      yearlySaving: 1584,
      confidence: 0.85,
      source: 'fallback',
    },
  ],
  totalMonthlySaving: 332,
  totalYearlySaving: 3984,
  createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
}

export const MOCK_REMINDERS: Reminder[] = [
  {
    id: 'rem-1',
    type: 'vaccine',
    title: 'Hepatitis B Booster Due',
    titleHi: 'Arjun ka Hepatitis B booster baaki hai',
    subtitle: 'Arjun • 15 months',
    subtitleHi: 'Arjun • 15 mahine',
    urgency: 'urgent',
    linkedRoute: '/vaccination',
  },
  {
    id: 'rem-2',
    type: 'checkup',
    title: 'Anomaly Scan Due — Week 24',
    titleHi: 'Week 24 anomaly scan baaki hai',
    subtitle: 'Meena • Week 22 now',
    subtitleHi: 'Meena • Abhi week 22',
    urgency: 'normal',
    linkedRoute: '/mother-care',
  },
]

export const MOCK_WALLET = {
  totalSavings: 9400,
  monthlySavings: 332,
  prescriptionsScanned: 3,
  schemesUnlocked: 2,
  vaccinationPercent: 68,
}