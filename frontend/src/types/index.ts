export interface UserProfile {
  id: string;
  name: string;
  city: string;
  state: string;
  age: number;
  language: 'hi' | 'en';
  features: FeatureFlags;
}

export interface FeatureFlags {
  prescription: boolean;
  schemes: boolean;
  pregnancy: boolean;
  vaccination: boolean;
  awareness: boolean;
}

export interface FamilyMember {
  id: string;
  userId: string;
  name: string;
  relation: 'self' | 'spouse' | 'child' | 'parent' | 'other';
  dob?: string;
  gender?: 'male' | 'female' | 'other';
  isPregnant?: boolean;
  pregnancyWeek?: number;
  lmpDate?: string;
}

export interface Medicine {
  id: string;
  brandName: string;
  saltName: string;
  dosage: string;
  brandPrice: number;
  genericPrice: number;
  monthlySaving: number;
  yearlySaving: number;
  confidence: number;
  source: 'gemini' | 'fallback';
}

export interface Prescription {
  id: string;
  userId: string;
  imageUrl?: string;
  rawOcrText?: string;
  medicines: Medicine[];
  totalMonthlySaving: number;
  totalYearlySaving: number;
  createdAt: string;
}

export interface Scheme {
  id: string;
  name: string;
  nameHi: string;
  status: 'eligible' | 'likely' | 'check' | 'notEligible';
  benefit: string;
  benefitHi: string;
  reason: string;
  reasonHi: string;
  documents: string[];
  documentsHi: string[];
  applyAt: string;
  applyAtHi: string;
  officialUrl?: string;
}

export interface VaccineRecord {
  id: string;
  vaccineName: string;
  dueDate: string;
  doneDate?: string;
  done: boolean;
  status: 'done' | 'overdue' | 'dueSoon' | 'upcoming';
}

export interface VaccineScheduleItem {
  id: string;
  name: string;
  dueAgeDays: number;
  dueLabelKey: string;
  descriptionKey: string;
}

export type AwarenessCategory =
  | 'periods'
  | 'pregnancy'
  | 'anaemia'
  | 'nutrition'
  | 'newborn'
  | 'vaccination'
  | 'mentalHealth'
  | 'phc';

export interface AwarenessArticle {
  id: string;
  category: AwarenessCategory;
  tone: 'green' | 'pink' | 'blue' | 'red' | 'saffron';
  title: { hi: string; en: string };
  summary: { hi: string; en: string };
  readTimeMinutes: number;
  level: 'beginner' | 'intermediate';
  icon: string;
  content: { hi: string[]; en: string[] };
}

export interface CheckupItem {
  id: string;
  week: number;
  nameKey: string;
  descriptionKey: string;
  done: boolean;
  urgent: boolean;
}

export interface Reminder {
  id: string;
  type: 'vaccine' | 'checkup' | 'medicine';
  title: string;
  titleHi: string;
  subtitle: string;
  subtitleHi: string;
  urgency: 'urgent' | 'normal';
  linkedRoute: string;
}

export interface WalletData {
  totalSavings: number;
  monthlySavings: number;
  prescriptionsScanned: number;
  schemesUnlocked: number;
  vaccinationPercent: number;
}

export interface SchemeAnswers {
  state: string;
  monthlyIncome: string;
  rationCardType: 'none' | 'apl' | 'bpl' | 'aay' | 'unknown';
  isPregnant: boolean;
  childrenUnder5: number;
  hasSenior: boolean;
  hasAyushmanCard: 'yes' | 'no' | 'unknown';
}

export interface OCRProgress {
  status: 'idle' | 'loading' | 'done' | 'error';
  percent: number;
  step: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface Milestone {
  id: string;
  labelKey: string;
  done: boolean;
  value?: number;
}
