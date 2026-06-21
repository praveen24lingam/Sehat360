# SEHAT360 — PROMPT 1
## Foundation: Next.js 14 + TypeScript + Design System + Shell

Read `AGENTS.md` completely before writing any code.

This is Prompt 1 of 6. After this prompt the app must: install, build, run at localhost:3000, show all routes, have correct design tokens, working bottom nav, i18n with Hindi default, Zustand store, all service boundaries, all data files, and placeholder pages that already look like the real product.

---

## Step 1: Project Initialization

```bash
npx create-next-app@latest sehat360 \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --src-dir \
  --import-alias "@/*" \
  --no-turbopack

cd sehat360

# Core dependencies
npm install \
  framer-motion \
  zustand \
  @supabase/supabase-js \
  react-hook-form \
  @hookform/resolvers \
  zod \
  next-intl \
  lucide-react \
  tesseract.js \
  clsx \
  tailwind-merge \
  class-variance-authority \
  date-fns

# Shadcn init
npx shadcn@latest init
# When prompted: TypeScript=yes, style=Default, base color=Neutral, CSS variables=yes

# Add all Shadcn components needed across the app
npx shadcn@latest add button card badge input label switch progress tabs sheet avatar separator select checkbox textarea alert dialog skeleton scroll-area
```

---

## Step 2: Tailwind Config

Replace `tailwind.config.ts` completely:

```ts
import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{ts,tsx}',
    './src/components/**/*.{ts,tsx}',
    './src/app/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          deepGreen:    '#1A6B4A',
          midGreen:     '#2D9B6F',
          lightGreen:   '#E8F5EE',
          saffron:      '#E8820C',
          saffronLight: '#FEF3E2',
          ink:          '#0F1C14',
          inkSoft:      '#3D5247',
          smoke:        '#F4F8F5',
          card:         '#FFFFFF',
          border:       '#D4E8DC',
          danger:       '#DC2626',
          dangerLight:  '#FEF2F2',
          blue:         '#2563EB',
          blueLight:    '#EFF6FF',
          pink:         '#DB2777',
          pinkLight:    '#FDF2F8',
        },
        // Override Shadcn defaults to match brand
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        border: 'hsl(var(--border))',
        ring: 'hsl(var(--ring))',
        primary: {
          DEFAULT: '#1A6B4A',
          foreground: '#FFFFFF',
        },
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Consolas', 'monospace'],
      },
      borderRadius: {
        'xl': '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      boxShadow: {
        'card': '0 1px 3px 0 rgba(15, 28, 20, 0.06)',
        'card-md': '0 4px 12px 0 rgba(15, 28, 20, 0.08)',
        'nav': '0 -1px 0 0 #D4E8DC, 0 -4px 16px 0 rgba(15, 28, 20, 0.04)',
      },
      maxWidth: {
        'shell': '430px',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}

export default config
```

---

## Step 3: Global CSS

`src/app/globals.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Google Fonts */
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;600;700&display=swap');

@layer base {
  :root {
    --background: 240 20% 98%;
    --foreground: 150 40% 8%;
    --border: 138 30% 85%;
    --ring: 154 60% 26%;
  }

  * {
    box-sizing: border-box;
  }

  html {
    overflow-x: hidden;
  }

  body {
    @apply font-sans bg-brand-smoke text-brand-ink antialiased;
    overflow-x: hidden;
    -webkit-text-size-adjust: 100%;
  }

  /* Remove iOS tap highlight */
  * {
    -webkit-tap-highlight-color: transparent;
  }

  /* Accessible focus rings */
  :focus-visible {
    @apply outline-none ring-2 ring-brand-deepGreen ring-offset-2;
  }

  /* 16px minimum for all inputs — prevents iOS zoom */
  input, textarea, select {
    font-size: 16px !important;
  }
}

@layer utilities {
  /* App shell utility */
  .app-shell {
    @apply max-w-shell mx-auto min-h-dvh relative;
  }

  /* Mono numbers */
  .rupee {
    @apply font-mono font-bold;
  }

  /* Safe area padding for bottom nav */
  .nav-safe-padding {
    padding-bottom: calc(80px + env(safe-area-inset-bottom, 0px));
  }

  /* Smooth scroll */
  .scroll-smooth {
    scroll-behavior: smooth;
    -webkit-overflow-scrolling: touch;
  }
}
```

---

## Step 4: TypeScript Types

Create `src/types/index.ts` with all types from `AGENTS.md` types section — copy them exactly. Additionally add:

```ts
export interface SchemeAnswers {
  state: string
  monthlyIncome: string  // range string e.g. '0-5000'
  rationCardType: 'none' | 'apl' | 'bpl' | 'aay' | 'unknown'
  isPregnant: boolean
  childrenUnder5: number
  hasSenior: boolean
  hasAyushmanCard: 'yes' | 'no' | 'unknown'
}

export interface OCRProgress {
  status: 'idle' | 'loading' | 'done' | 'error'
  percent: number
  step: string
}

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: string
}

export interface Milestone {
  id: string
  labelKey: string
  done: boolean
  value?: number
}
```

---

## Step 5: Data Files

### `src/data/mockData.ts`

```ts
import type { UserProfile, FamilyMember, Prescription, Scheme, Reminder } from '@/types'

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
```

### `src/data/medicineCatalog.ts`

Create a catalog with exactly these medicines (realistic Indian brand → generic data):

| Brand | Salt | Dosage | Brand ₹ | Generic ₹ |
|---|---|---|---|---|
| Glycomet 500 | Metformin | 500mg | 85 | 12 |
| Lipitor 10 | Atorvastatin | 10mg | 145 | 18 |
| Deplatt 75 | Clopidogrel | 75mg | 165 | 33 |
| Crocin 500 | Paracetamol | 500mg | 30 | 4 |
| Pan 40 | Pantoprazole | 40mg | 95 | 14 |
| Amlip 5 | Amlodipine | 5mg | 75 | 10 |
| Telma 40 | Telmisartan | 40mg | 120 | 18 |
| Cetcip 10 | Cetirizine | 10mg | 45 | 6 |
| Amoxil 500 | Amoxicillin | 500mg | 80 | 22 |
| Feronia XT | Iron + Folic Acid | — | 65 | 12 |
| Shelcal 500 | Calcium + Vit D3 | 500mg | 115 | 20 |
| Electral | ORS | — | 25 | 8 |
| Betaloc 25 | Metoprolol | 25mg | 90 | 14 |
| Omez 20 | Omeprazole | 20mg | 70 | 10 |
| Losartan 50 | Losartan | 50mg | 110 | 16 |

Export as `MEDICINE_CATALOG: MedicineCatalogItem[]` with type:
```ts
interface MedicineCatalogItem {
  id: string
  brandName: string
  saltName: string
  dosage: string
  brandPrice: number
  genericPrice: number
  keywords: string[]  // for OCR text matching: ['glycomet', 'metformin', 'glymet']
}
```

### `src/data/schemes.ts`

Create `SCHEMES_DATA: SchemeData[]` with full data for all 6 schemes.

Each SchemeData has all Scheme fields plus:
```ts
eligibilityRules: {
  requiresPregnancy?: boolean
  requiresChildUnder5?: boolean
  requiresLowIncome?: boolean
  requiresBPLCard?: boolean
  requiresSenior?: boolean
  stateSpecific?: string
}
```

Schemes:
1. **PM-JAY** — ₹5,00,000/year hospital cover, requires BPL/low income
2. **PMMVY** — ₹5,000 maternity benefit, requires pregnancy + first child
3. **Janani Suraksha Yojana** — ₹1,400 institutional delivery, requires pregnancy + BPL
4. **Jan Aushadhi** — Generic medicine access, prescription feature users
5. **Mission Indradhanush** — Free vaccines, children under 5
6. **MP Nishulk Dawai Yojana** — Free medicine at govt hospitals (MP-specific)

### `src/data/vaccinationSchedule.ts`

```ts
export const VACCINATION_SCHEDULE: VaccineScheduleItem[] = [
  { id: 'bcg',       name: 'BCG',              dueAgeDays: 0,    dueLabelKey: 'vaccines.due.birth',    descriptionKey: 'vaccines.bcg.desc' },
  { id: 'hepb0',     name: 'Hepatitis B',       dueAgeDays: 0,    dueLabelKey: 'vaccines.due.birth',    descriptionKey: 'vaccines.hepb.desc' },
  { id: 'opv0',      name: 'OPV (0 dose)',       dueAgeDays: 0,    dueLabelKey: 'vaccines.due.birth',    descriptionKey: 'vaccines.opv.desc' },
  { id: 'penta1',    name: 'Pentavalent 1',      dueAgeDays: 42,   dueLabelKey: 'vaccines.due.6weeks',   descriptionKey: 'vaccines.penta.desc' },
  { id: 'opv1',      name: 'OPV 1',             dueAgeDays: 42,   dueLabelKey: 'vaccines.due.6weeks',   descriptionKey: 'vaccines.opv.desc' },
  { id: 'penta2',    name: 'Pentavalent 2',      dueAgeDays: 70,   dueLabelKey: 'vaccines.due.10weeks',  descriptionKey: 'vaccines.penta.desc' },
  { id: 'opv2',      name: 'OPV 2',             dueAgeDays: 70,   dueLabelKey: 'vaccines.due.10weeks',  descriptionKey: 'vaccines.opv.desc' },
  { id: 'penta3',    name: 'Pentavalent 3',      dueAgeDays: 98,   dueLabelKey: 'vaccines.due.14weeks',  descriptionKey: 'vaccines.penta.desc' },
  { id: 'opv3',      name: 'OPV 3',             dueAgeDays: 98,   dueLabelKey: 'vaccines.due.14weeks',  descriptionKey: 'vaccines.opv.desc' },
  { id: 'ipv',       name: 'IPV',               dueAgeDays: 98,   dueLabelKey: 'vaccines.due.14weeks',  descriptionKey: 'vaccines.ipv.desc' },
  { id: 'measles1',  name: 'Measles-Rubella 1',  dueAgeDays: 270,  dueLabelKey: 'vaccines.due.9months',  descriptionKey: 'vaccines.mr.desc' },
  { id: 'vita1',     name: 'Vitamin A (1st)',     dueAgeDays: 270,  dueLabelKey: 'vaccines.due.9months',  descriptionKey: 'vaccines.vita.desc' },
  { id: 'dpt1',      name: 'DPT Booster 1',      dueAgeDays: 548,  dueLabelKey: 'vaccines.due.18months', descriptionKey: 'vaccines.dpt.desc' },
  { id: 'measles2',  name: 'Measles-Rubella 2',  dueAgeDays: 548,  dueLabelKey: 'vaccines.due.18months', descriptionKey: 'vaccines.mr.desc' },
]
```

### `src/data/awarenessArticles.ts`

10 articles. Sample structure (build all 10 with real Hindi and English content):

```ts
{
  id: 'anaemia-signs',
  category: 'anaemia',
  tone: 'red',
  title: {
    hi: 'खून की कमी के 5 जरूरी संकेत',
    en: '5 Signs of Anaemia You Shouldn\'t Ignore',
  },
  summary: {
    hi: 'थकान, पीली आंखें, सांस फूलना — ये संकेत खून की कमी की तरफ इशारा कर सकते हैं।',
    en: 'Fatigue, pale eyes, and shortness of breath may be signs of low haemoglobin.',
  },
  readTimeMinutes: 3,
  level: 'beginner',
  icon: 'Droplets',
  content: {
    hi: [
      'खून में हीमोग्लोबिन की कमी को एनीमिया कहते हैं...',
      // 4-6 real paragraphs
    ],
    en: [
      'Anaemia means your blood has low haemoglobin levels...',
    ],
  },
}
```

Categories to cover: periods, irregular periods, anaemia, iron-rich foods, pregnancy nutrition, pregnancy warning signs, newborn first 7 days, vaccination importance, mental health in pregnancy, when to visit PHC.

---

## Step 6: i18n Setup (next-intl)

### `src/middleware.ts`

```ts
import createMiddleware from 'next-intl/middleware'

export default createMiddleware({
  locales: ['hi', 'en'],
  defaultLocale: 'hi',
  localePrefix: 'never',  // URLs stay clean: /dashboard not /hi/dashboard
})

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
}
```

### `src/i18n.ts` (next-intl config)

```ts
import { getRequestConfig } from 'next-intl/server'

export default getRequestConfig(async ({ locale }) => ({
  messages: (await import(`./messages/${locale}.ts`)).default,
}))
```

### `src/messages/hi.ts` and `src/messages/en.ts`

Create both files with matching keys. Hindi is the source of truth — English translates it.

Minimum keys required (add page-specific keys in later prompts):

```ts
// hi.ts
export default {
  'app.name': 'Sehat360',
  'app.tagline': 'Apni sehat ka poora hisaab, ek jagah',

  'nav.home': 'Home',
  'nav.prescription': 'Dawai',
  'nav.schemes': 'Yojana',
  'nav.care': 'Care',
  'nav.more': 'More',

  'common.loading': 'Load ho raha hai...',
  'common.save': 'Save karein',
  'common.cancel': 'Raddh karein',
  'common.edit': 'Badlein',
  'common.delete': 'Hatayein',
  'common.enable': 'Chalu karein',
  'common.close': 'Band karein',
  'common.back': 'Wapas',
  'common.share': 'Share karein',
  'common.retry': 'Dobara try karein',
  'common.seeAll': 'Sab dekho',
  'common.next': 'Aage',
  'common.done': 'Ho gaya',
  'common.demo': 'Demo mode',
  'common.demoNote': 'Supabase/Gemini connected nahi hai — demo data dikh raha hai',

  'features.prescription': 'Dawai Bachat',
  'features.schemes': 'Sarkari Yojnaayein',
  'features.pregnancy': 'Pregnancy Care',
  'features.vaccination': 'Vaccination Tracker',
  'features.awareness': 'Health Jaankari',

  'emptyState.featureDisabled': '{feature} band hai',
  'emptyState.featureDisabledDesc': 'Settings mein is feature ko chalu karein',
  'emptyState.enableButton': 'Settings mein jayein',
  // ... (add more as needed, every page key added in its prompt)
} as const
```

---

## Step 7: Zustand Store

`src/store/userStore.ts` — implement exactly the interface from `AGENTS.md`. Initialize with `MOCK_PROFILE` and `MOCK_FAMILY` when Supabase is not configured.

Key implementation note:
```ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { MOCK_PROFILE, MOCK_FAMILY, MOCK_PRESCRIPTION, MOCK_WALLET } from '@/data/mockData'
import { isSupabaseConfigured } from '@/lib/supabase'

// On first load: if not configured, initialize with mock data
// If configured: initialize empty, fill from Supabase after auth
```

---

## Step 8: Service Layer

### `src/lib/supabase.ts`
```ts
import { createClient } from '@supabase/supabase-js'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export const isSupabaseConfigured = Boolean(url && key && url !== 'your_supabase_url')

export const supabase = isSupabaseConfigured
  ? createClient(url!, key!)
  : null  // components check isSupabaseConfigured before calling
```

### `src/lib/gemini.ts`
```ts
// This runs server-side only via /api/gemini route
// Client calls /api/gemini — never reads GEMINI_API_KEY directly
export const isGeminiConfigured = Boolean(process.env.GEMINI_API_KEY)

// POST /api/gemini body: { prompt: string }
// Returns: { text: string } | { error: string }
```

Create `src/app/api/gemini/route.ts`:
```ts
import { GoogleGenerativeAI } from '@google/generative-ai'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) return NextResponse.json({ error: 'not_configured' }, { status: 503 })

  const { prompt } = await req.json()
  const genAI = new GoogleGenerativeAI(apiKey)
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })
  const result = await model.generateContent(prompt)
  return NextResponse.json({ text: result.response.text() })
}
```

Install: `npm install @google/generative-ai`

### `src/lib/ocr.ts`
```ts
import Tesseract from 'tesseract.js'

export async function extractPrescriptionText(
  file: File,
  onProgress: (pct: number) => void
): Promise<string> {
  const result = await Tesseract.recognize(file, 'eng+hin', {
    logger: (m) => {
      if (m.status === 'recognizing text') {
        onProgress(Math.round(m.progress * 100))
      }
    },
  })
  return result.data.text
}
```

### `src/lib/medicineMapper.ts`
Implement with two paths:
1. If Gemini configured: POST to `/api/gemini` with structured prompt asking for JSON
2. Fallback: match rawText keywords against `MEDICINE_CATALOG`, return top matches

Always return the full `{ medicines, totalMonthlySaving, totalYearlySaving, source }` shape.

### `src/lib/schemeMatcher.ts`
Static rule matcher for demo. Gemini path sends answers as JSON, asks for scheme matches.

```ts
export function matchSchemesStatic(answers: SchemeAnswers): Scheme[] {
  const matches: Scheme[] = []
  if (answers.requiresLowIncome || answers.rationCardType === 'bpl') {
    matches.push(SCHEMES_DATA.find(s => s.id === 'pm-jay')!)
  }
  if (answers.isPregnant) {
    matches.push(SCHEMES_DATA.find(s => s.id === 'pmmvy')!)
    matches.push(SCHEMES_DATA.find(s => s.id === 'jsy')!)
  }
  if (answers.childrenUnder5 > 0) {
    matches.push(SCHEMES_DATA.find(s => s.id === 'mission-indradhanush')!)
  }
  // Always recommend Jan Aushadhi if prescription feature enabled
  matches.push(SCHEMES_DATA.find(s => s.id === 'jan-aushadhi')!)
  return matches.filter(Boolean)
}
```

### `src/lib/dates.ts`
Implement all date helpers using `date-fns`:

```ts
import { differenceInDays, differenceInWeeks, addDays, format } from 'date-fns'
import { hi as hiLocale, enIN } from 'date-fns/locale'

export function calculatePregnancyWeek(lmpDate: string): number {
  return Math.floor(differenceInDays(new Date(), new Date(lmpDate)) / 7)
}

export function calculateDueDate(lmpDate: string): string {
  return addDays(new Date(lmpDate), 280).toISOString().split('T')[0]
}

export function calculateAgeInMonths(dob: string): number {
  return Math.floor(differenceInDays(new Date(), new Date(dob)) / 30.44)
}

export function calculateVaccineDueDate(dob: string, dueAgeDays: number): string {
  return addDays(new Date(dob), dueAgeDays).toISOString().split('T')[0]
}

export function getVaccineStatus(dueDate: string, done: boolean): 'done' | 'overdue' | 'dueSoon' | 'upcoming' {
  if (done) return 'done'
  const days = differenceInDays(new Date(dueDate), new Date())
  if (days < 0) return 'overdue'
  if (days <= 14) return 'dueSoon'
  return 'upcoming'
}

export function formatDateInLocale(date: string, locale: 'hi' | 'en'): string {
  return format(new Date(date), 'd MMM yyyy', { locale: locale === 'hi' ? hiLocale : enIN })
}
```

### `src/lib/formatters.ts`
```ts
export function formatRupee(amount: number): string {
  return `₹${amount.toLocaleString('en-IN')}`
}

export function formatRupeeCompact(amount: number): string {
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`
  if (amount >= 1000) return `₹${(amount / 1000).toFixed(1)}K`
  return formatRupee(amount)
}

export function formatPercent(value: number): string {
  return `${Math.round(value)}%`
}
```

---

## Step 9: Layout Components

### `src/components/layout/AppShell.tsx`

```tsx
'use client'
import { BottomNav } from './BottomNav'

interface AppShellProps {
  children: React.ReactNode
  hideNav?: boolean
}

export function AppShell({ children, hideNav = false }: AppShellProps) {
  return (
    <div className="app-shell bg-white">
      {/* Desktop: show smoke background outside shell */}
      <div className="hidden md:block fixed inset-0 bg-brand-smoke -z-10" />
      
      <main className={`min-h-dvh bg-brand-smoke ${hideNav ? '' : 'nav-safe-padding'}`}>
        {children}
      </main>
      
      {!hideNav && <BottomNav />}
    </div>
  )
}
```

### `src/components/layout/BottomNav.tsx`

5 tabs. Active state = deep green icon + label + 2px top bar. Tab bar uses `bg-white/90 backdrop-blur-md`.

```tsx
'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Pill, Building2, HeartPulse, MoreHorizontal } from 'lucide-react'
import { useState } from 'react'
import { MoreSheet } from './MoreSheet'

const TABS = [
  { href: '/dashboard',    icon: Home,          labelKey: 'nav.home' },
  { href: '/prescription', icon: Pill,          labelKey: 'nav.prescription' },
  { href: '/schemes',      icon: Building2,     labelKey: 'nav.schemes' },
  { href: '/mother-care',  icon: HeartPulse,    labelKey: 'nav.care',
    activeOn: ['/mother-care', '/vaccination'] },
  { href: '#more',         icon: MoreHorizontal, labelKey: 'nav.more',
    activeOn: ['/settings', '/wallet', '/awareness'] },
]

export function BottomNav() {
  const pathname = usePathname()
  const [moreOpen, setMoreOpen] = useState(false)

  return (
    <>
      <nav
        className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-shell
                   bg-white/90 backdrop-blur-md shadow-nav border-t border-brand-border
                   z-50"
        style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
      >
        <div className="flex h-16">
          {TABS.map((tab) => {
            const activeRoutes = tab.activeOn ?? [tab.href]
            const isActive = activeRoutes.some(r => pathname.startsWith(r))
            const Icon = tab.icon

            if (tab.href === '#more') {
              return (
                <button
                  key="more"
                  onClick={() => setMoreOpen(true)}
                  className={`flex-1 flex flex-col items-center justify-center gap-0.5 relative
                    transition-colors ${isActive ? 'text-brand-deepGreen' : 'text-brand-inkSoft'}`}
                  aria-label="More options"
                >
                  {isActive && (
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full bg-brand-deepGreen" />
                  )}
                  <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                  <span className="text-[10px] font-medium">{/* translated label */}More</span>
                </button>
              )
            }

            return (
              <Link
                key={tab.href}
                href={tab.href}
                aria-current={isActive ? 'page' : undefined}
                className={`flex-1 flex flex-col items-center justify-center gap-0.5 relative
                  transition-colors ${isActive ? 'text-brand-deepGreen' : 'text-brand-inkSoft'}`}
              >
                {isActive && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full bg-brand-deepGreen" />
                )}
                <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                <span className="text-[10px] font-medium">{tab.labelKey}</span>
              </Link>
            )
          })}
        </div>
      </nav>

      <MoreSheet open={moreOpen} onClose={() => setMoreOpen(false)} />
    </>
  )
}
```

**IMPORTANT:** Replace the hardcoded label strings with `useTranslations()` from next-intl.

### `src/components/layout/PageHeader.tsx`

```tsx
interface PageHeaderProps {
  title: string
  subtitle?: string
  showBack?: boolean
  rightSlot?: React.ReactNode
}

// Back button uses router.back() with fallback to /dashboard
// Title: text-lg font-semibold text-brand-ink
// Subtitle: text-sm text-brand-inkSoft
// Height: h-14, sticky, bg-brand-smoke/95 backdrop-blur-sm
```

### `src/components/layout/MoreSheet.tsx`

Shadcn Sheet from bottom. Links: Health Wallet → /wallet, Awareness → /awareness, Settings → /settings.

### `src/components/layout/CareSwitcher.tsx`

Two tabs (Mother Care | Vaccination) shown at top of care pages. Uses Shadcn Tabs.

---

## Step 10: Shared Components

### `src/components/shared/RupeeDisplay.tsx`
```tsx
interface RupeeDisplayProps {
  amount: number
  size?: 'sm' | 'md' | 'lg' | 'xl'
  color?: 'white' | 'green' | 'default'
}

// Always uses font-mono font-bold
// Sizes: sm=text-lg, md=text-2xl, lg=text-3xl, xl=text-4xl
// Formats with formatRupee()
```

### `src/components/shared/EmptyState.tsx`
```tsx
interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description: string
  actionLabel?: string
  onAction?: () => void
  tone?: 'default' | 'feature'  // feature tone = shows green card
}
```

### `src/components/shared/LoadingSpinner.tsx`
```tsx
// Centered spinner, uses brand-deepGreen color
// fullPage prop: centers in viewport
// message prop: shows below spinner
```

### `src/components/shared/SavingsCard.tsx`
```tsx
interface SavingsCardProps {
  monthly: number
  yearly: number
  prescriptionCount: number
  schemeCount?: number
}

// Deep green gradient background, white text
// Monthly saving prominent with font-mono font-bold text-3xl
// Never reuse this gradient style on other cards
```

### `src/components/shared/MedicineCard.tsx`
```tsx
interface MedicineCardProps {
  medicine: Medicine
  expanded?: boolean
  onToggle?: () => void
}

// Shows: brandName → saltName comparison
// Brand price crossed out, generic price highlighted in deepGreen
// Saving badge in saffron
// Confidence shown as small badge
```

### `src/components/shared/SchemeCard.tsx`
```tsx
interface SchemeCardProps {
  scheme: Scheme
  expanded?: boolean
  onToggle?: () => void
}

// Status badge: eligible=green, likely=saffron, check=blue
// Expandable for documents list
```

### `src/components/shared/ReminderCard.tsx`
```tsx
interface ReminderCardProps {
  reminder: Reminder
  language: 'hi' | 'en'
}

// urgent: saffron left border + saffronLight background
// normal: green left border + lightGreen background
```

### `src/components/shared/StatCard.tsx`
```tsx
interface StatCardProps {
  icon: LucideIcon
  value: string | number
  label: string
  tone?: 'green' | 'saffron' | 'blue' | 'pink'
}

// Fixed aspect ratio to prevent layout shift
// Value uses font-mono
```

### `src/components/shared/FeatureToggleRow.tsx`
```tsx
interface FeatureToggleRowProps {
  featureKey: keyof FeatureFlags
  icon: LucideIcon
  title: string
  description: string
  tone?: 'green' | 'saffron' | 'blue' | 'pink'
}

// Uses Shadcn Switch
// Reads/writes from/to Zustand store directly
// At least one feature must remain enabled — disable switch if it's the last one
```

### `src/components/shared/LanguageToggle.tsx`
```tsx
// Two buttons: Hindi | English
// Active: bg-brand-deepGreen text-white
// Inactive: bg-white border border-brand-border
// On click: update next-intl locale + Zustand language
```

### `src/components/shared/ErrorState.tsx`
```tsx
interface ErrorStateProps {
  title: string
  description: string
  actionLabel?: string
  onAction?: () => void
}
// Uses brand-danger color, AlertCircle icon
```

---

## Step 11: Placeholder Pages

Create all 11 pages now. Each must:
1. Use `AppShell` (or no shell for public pages)
2. Have `PageHeader` where appropriate
3. Show a real-looking preview using mock data — NOT a blank "coming soon" page
4. Wrap content in Framer Motion `motion.div` with `pageVariants`
5. Use i18n translation keys
6. Have correct route

**Public pages** (no BottomNav): Landing, Login, Onboarding
**App pages** (with BottomNav): all others

Each app page placeholder must show:
- PageHeader with real title
- One relevant shared component with real mock data (e.g. Dashboard shows SavingsCard)
- A subtle note that full content comes in the next prompt
- No plain text "under construction" divs

---

## Step 12: Demo Banner Component

`src/components/shared/DemoBanner.tsx`

Small dismissible banner shown in AppShell when `!isSupabaseConfigured`:

```tsx
// bg-brand-saffronLight border-b border-brand-saffron/20
// text-brand-saffron text-xs
// "Demo mode — real data ke liye Supabase configure karein"
// Dismiss button (X)
```

---

## Step 13: PWA Setup

`public/manifest.json`:
```json
{
  "name": "Sehat360",
  "short_name": "Sehat360",
  "description": "Apni sehat ka poora hisaab, ek jagah",
  "start_url": "/",
  "display": "standalone",
  "orientation": "portrait",
  "background_color": "#F4F8F5",
  "theme_color": "#1A6B4A",
  "icons": [
    { "src": "/icons/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icons/icon-512.png", "sizes": "512x512", "type": "image/png" }
  ]
}
```

In `src/app/layout.tsx` (root), add:
```tsx
export const metadata: Metadata = {
  title: 'Sehat360',
  description: 'Apni sehat ka poora hisaab, ek jagah',
  manifest: '/manifest.json',
  themeColor: '#1A6B4A',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
}
```

Create simple 192×192 and 512×512 SVG-based icon files in `public/icons/`. They can be simple green squares with "S360" text — will be replaced but must exist for PWA validation.

---

## Acceptance Checklist — Prompt 1

- [ ] `npm install` succeeds with zero peer dependency errors
- [ ] `npm run build` passes with zero TypeScript errors
- [ ] App loads at `http://localhost:3000`
- [ ] All 11 routes return a page (not 404)
- [ ] Bottom nav shows on all app routes
- [ ] Active tab highlights correctly on each route
- [ ] More sheet opens and has correct links
- [ ] Care tab stays active on `/vaccination`
- [ ] More tab stays active on `/wallet` and `/awareness`
- [ ] Hindi is default language (text shows Hindi)
- [ ] Language toggle switches to English
- [ ] Demo banner shows when env vars missing
- [ ] `bg-brand-smoke` visible as page background
- [ ] Cards are white with `border-brand-border`
- [ ] No horizontal overflow at 375px
- [ ] Bottom nav does not cover page content
- [ ] Font is Plus Jakarta Sans (check in DevTools)
- [ ] Rupee amounts use JetBrains Mono
- [ ] No Lorem ipsum anywhere
- [ ] `MOCK_PROFILE` data used in placeholder pages (Meena Sharma)
