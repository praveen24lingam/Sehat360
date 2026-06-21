# Sehat360 — AGENTS.md
> Single source of truth for every AI coding agent working on this codebase.
> Read this entire file before writing a single line of code.

---

## What This App Is

Sehat360 is a mobile-first PWA for Indian families — specifically for the person managing the family's health and budget. She scans prescriptions to find cheaper generics, checks which government schemes she qualifies for, tracks pregnancy checkups, keeps her child's vaccines on time, and reads health content in Hindi.

**Tagline:** "Apni sehat ka poora hisaab, ek jagah."
**Hackathon:** Sama Social — Build for Good Bharat.

This is not a hospital admin panel. It is not a generic SaaS dashboard. It must feel like something a family in Indore would actually use and trust.

---

## Hard Rules — No Exceptions

1. **Next.js 14 App Router + TypeScript.** No `pages/` directory. All routes in `app/`.
2. **Mobile first, always.** Write every component for 375px first. Desktop is a bonus.
3. **No hardcoded visible strings in JSX.** Every user-facing string lives in `messages/hi.ts` and `messages/en.ts`. Use `next-intl`.
4. **Hindi is default.** English is secondary.
5. **Shadcn/UI for all form controls, cards, dialogs, sheets, switches, tabs, badges, selects, alerts, progress.** Do not invent custom form primitives.
6. **Lucide React for all icons.** No emoji as UI icons.
7. **Framer Motion for transitions and meaningful micro-interactions only.** Not on every div. Use `AnimatePresence` for page transitions and `motion.div` for cards entering view. Respect `prefers-reduced-motion`.
8. **Real Indian data everywhere.** Meena Sharma from Indore. Real medicine names. Real scheme names. Zero Lorem ipsum.
9. **Feature gates are real.** A disabled feature disappears from Dashboard. Its route shows an `EmptyState` with enable CTA, not a broken page.
10. **Every async action has three states: loading, success, error.** No silent failures.
11. **Service layer is separate from UI.** Data fetching, OCR, Gemini, Supabase — all in `lib/`. Pages and components call hooks, not services directly.
12. **No API keys in code.** All secrets in `.env.local` only. `.env.example` ships with empty values.
13. **`npm run build` must pass before any prompt is considered done.** Fix TypeScript errors, not suppress them.

---

## Tech Stack

| Layer | Choice | Why |
|---|---|---|
| Framework | Next.js 14 (App Router) | Vercel deploy, TypeScript native, file-based routing |
| Language | TypeScript | Fewer runtime bugs under hackathon pressure |
| Styling | Tailwind CSS v3 | Utility-first, works perfectly with Shadcn |
| UI Components | Shadcn/UI | Accessible, unstyled-first, composable |
| Icons | Lucide React | Consistent, tree-shakeable |
| Animations | Framer Motion | Page transitions, card entrances, micro-interactions |
| State | Zustand | Lightweight, persists to localStorage for demo mode |
| Forms | React Hook Form + Zod | Type-safe validation |
| Auth + DB + Storage | Supabase | Free tier sufficient for hackathon |
| OCR | Tesseract.js | Runs in browser, no server needed |
| AI | Google Gemini API (free tier) | Medicine mapping, scheme matching, pregnancy guidance |
| i18n | next-intl | Works with App Router, simple JSON messages |
| PWA | next-pwa | Manifest + service worker |
| Deployment | Vercel | Zero config with Next.js |

---

## Folder Structure

```
src/
  app/
    [locale]/
      layout.tsx           ← Root layout with AppShell or PublicShell
      page.tsx             ← Landing /
      login/
        page.tsx
      onboarding/
        page.tsx
      dashboard/
        page.tsx
      prescription/
        page.tsx
      schemes/
        page.tsx
      mother-care/
        page.tsx
      vaccination/
        page.tsx
      awareness/
        page.tsx
      wallet/
        page.tsx
      settings/
        page.tsx
  components/
    layout/
      AppShell.tsx         ← Max-width shell, bottom nav padding
      BottomNav.tsx        ← 5 tabs, active state, safe area
      PageHeader.tsx       ← Back button, title, right slot
      MoreSheet.tsx        ← Bottom sheet from More tab
      CareSwitcher.tsx     ← Tabs for Mother Care / Vaccination
    shared/
      SavingsCard.tsx
      MedicineCard.tsx
      SchemeCard.tsx
      ReminderCard.tsx
      StatCard.tsx
      FeatureToggleRow.tsx
      LoadingSpinner.tsx
      EmptyState.tsx
      ErrorState.tsx
      LanguageToggle.tsx
      RupeeDisplay.tsx     ← Dedicated component for ₹ numbers
    ui/                    ← Shadcn generated components (do not edit)
  data/
    mockData.ts
    schemes.ts
    vaccinationSchedule.ts
    awarenessArticles.ts
    medicineCatalog.ts
  hooks/
    useAuth.ts
    useProfile.ts
    useFeatureGate.ts
    usePrescriptions.ts
    useSchemes.ts
    useVaccinations.ts
    usePregnancy.ts
  lib/
    supabase.ts
    gemini.ts
    ocr.ts
    medicineMapper.ts
    schemeMatcher.ts
    dates.ts
    formatters.ts
    utils.ts
  messages/
    hi.ts
    en.ts
  store/
    userStore.ts
  types/
    index.ts               ← All shared TypeScript types
middleware.ts              ← next-intl locale routing
```

---

## Design System

### Brand Colors — Use Exactly These

```ts
// tailwind.config.ts
brand: {
  deepGreen:   '#1A6B4A',   // primary action, active states, hero bg
  midGreen:    '#2D9B6F',   // secondary green, progress
  lightGreen:  '#E8F5EE',   // card backgrounds, success tints
  saffron:     '#E8820C',   // urgent, highlight, accent only
  saffronLight:'#FEF3E2',   // saffron card backgrounds
  ink:         '#0F1C14',   // primary text
  inkSoft:     '#3D5247',   // secondary text, labels
  smoke:       '#F4F8F5',   // page background
  card:        '#FFFFFF',   // card surface
  border:      '#D4E8DC',   // card borders, dividers
  danger:      '#DC2626',   // overdue, error
  dangerLight: '#FEF2F2',   // danger card bg
  blue:        '#2563EB',   // info, links
  blueLight:   '#EFF6FF',
  pink:        '#DB2777',   // pregnancy accent
  pinkLight:   '#FDF2F8',
}
```

**Color usage rules — enforce these:**
- `deepGreen` ONLY for: active nav, primary CTA buttons, hero cards
- `saffron` ONLY for: urgent reminders, overdue badges, highlight numbers — not decorative
- `smoke` is page background — cards sit on top as white (`#FFFFFF`) with `border-brand-border`
- Never put a green gradient on every card. Only the savings hero gets it.
- Text on white cards: `ink` for headings, `inkSoft` for body
- Danger red only for genuinely urgent/overdue states

### Typography

```ts
fontFamily: {
  sans: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
  mono: ['JetBrains Mono', 'Consolas', 'monospace'],
}
```

**Typography rules:**
- `font-mono` ONLY for: rupee amounts, counts, dates, OTP, progress percentages
- `font-sans` for everything else
- Minimum 16px on all inputs (prevents iOS zoom)
- Do not use `text-[size]` with viewport units — fixed sizes only
- Heading scale: `text-2xl font-bold` → `text-xl font-semibold` → `text-base font-medium`

### Elevation and Cards

```
Page background:   bg-brand-smoke
Card surface:      bg-white border border-brand-border rounded-2xl
Elevated card:     bg-white border border-brand-border rounded-2xl shadow-sm
Active/hero card:  bg-brand-deepGreen text-white rounded-2xl (savings hero only)
Urgent card:       bg-brand-saffronLight border border-brand-saffron/20 rounded-xl
Danger card:       bg-brand-dangerLight border border-brand-danger/20 rounded-xl
```

### Spacing and Shell

```
App shell max-width:    430px centered
App shell min-height:   100dvh
Page padding:           px-4 (16px sides)
Card padding:           p-4 or p-5
Section gap:            space-y-3 or gap-3
Bottom nav height:      64px
Content bottom padding: pb-[calc(80px+env(safe-area-inset-bottom,0px))]
```

### Animation Patterns (Framer Motion)

Use these exact patterns — do not invent new ones:

```ts
// Page entrance
const pageVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.25, ease: 'easeOut' } }
}

// Card list stagger
const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } }
}
const cardVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.2 } }
}

// Number count-up for savings (use framer-motion useMotionValue + useTransform)
// Only on Dashboard savings hero and Wallet total

// Bottom sheet / modal: use Shadcn Sheet — DO NOT build custom
```

**Do not animate:** navigation, form inputs, error states, loading spinners.
**Always use:** `will-change-transform` on cards that animate position.
**Always respect:** `prefers-reduced-motion` — wrap with `useReducedMotion()` hook.

---

## TypeScript Types

Define all shared types in `src/types/index.ts`:

```ts
export interface UserProfile {
  id: string
  name: string
  city: string
  state: string
  age: number
  language: 'hi' | 'en'
  features: FeatureFlags
}

export interface FeatureFlags {
  prescription: boolean
  schemes: boolean
  pregnancy: boolean
  vaccination: boolean
  awareness: boolean
}

export interface FamilyMember {
  id: string
  userId: string
  name: string
  relation: 'self' | 'spouse' | 'child' | 'parent' | 'other'
  dob?: string  // ISO date string
  gender?: 'male' | 'female' | 'other'
  isPregnant?: boolean
  pregnancyWeek?: number
  lmpDate?: string  // ISO date string
}

export interface Medicine {
  id: string
  brandName: string
  saltName: string
  dosage: string
  brandPrice: number
  genericPrice: number
  monthlySaving: number
  yearlySaving: number
  confidence: number
  source: 'gemini' | 'fallback'
}

export interface Prescription {
  id: string
  userId: string
  imageUrl?: string
  rawOcrText?: string
  medicines: Medicine[]
  totalMonthlySaving: number
  totalYearlySaving: number
  createdAt: string
}

export interface Scheme {
  id: string
  name: string
  nameHi: string
  status: 'eligible' | 'likely' | 'check' | 'notEligible'
  benefit: string
  benefitHi: string
  reason: string
  reasonHi: string
  documents: string[]
  documentsHi: string[]
  applyAt: string
  applyAtHi: string
  officialUrl?: string
}

export interface VaccineRecord {
  id: string
  vaccineName: string
  dueDate: string
  doneDate?: string
  done: boolean
  status: 'done' | 'overdue' | 'dueSoon' | 'upcoming'
}

export interface VaccineScheduleItem {
  id: string
  name: string
  dueAgeDays: number
  dueLabelKey: string
  descriptionKey: string
}

export interface AwarenessArticle {
  id: string
  category: AwarenessCategory
  tone: 'green' | 'pink' | 'blue' | 'red' | 'saffron'
  title: { hi: string; en: string }
  summary: { hi: string; en: string }
  readTimeMinutes: number
  level: 'beginner' | 'intermediate'
  icon: string  // Lucide icon name
  content: { hi: string[]; en: string[] }
}

export type AwarenessCategory =
  | 'periods'
  | 'pregnancy'
  | 'anaemia'
  | 'nutrition'
  | 'newborn'
  | 'vaccination'
  | 'mentalHealth'
  | 'phc'

export interface CheckupItem {
  id: string
  week: number
  nameKey: string
  descriptionKey: string
  done: boolean
  urgent: boolean
}

export interface Reminder {
  id: string
  type: 'vaccine' | 'checkup' | 'medicine'
  title: string
  titleHi: string
  subtitle: string
  subtitleHi: string
  urgency: 'urgent' | 'normal'
  linkedRoute: string
}

export interface WalletData {
  totalSavings: number
  monthlySavings: number
  prescriptionsScanned: number
  schemesUnlocked: number
  vaccinationPercent: number
}
```

---

## Zustand Store

`src/store/userStore.ts` — single store with clear sections:

```ts
interface UserStore {
  // State
  profile: UserProfile | null
  familyMembers: FamilyMember[]
  prescriptions: Prescription[]
  schemeAnswers: Record<string, unknown> | null
  matchedSchemes: Scheme[]
  vaccinationRecords: Record<string, VaccineRecord[]>  // keyed by memberId
  language: 'hi' | 'en'
  isDemo: boolean  // true when Supabase not configured

  // Actions
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
  setSchemeResults: (answers: Record<string, unknown>, schemes: Scheme[]) => void
  markVaccineDone: (memberId: string, vaccineId: string, doneDate: string) => void
  getPregnantMember: () => FamilyMember | undefined
  getChildMembers: () => FamilyMember[]
  getWalletData: () => WalletData
}
```

**Persist these keys to localStorage:** `profile`, `familyMembers`, `prescriptions`, `matchedSchemes`, `vaccinationRecords`, `language`.

**Do not persist:** `isDemo` (recomputed on load).

---

## Service Layer

### `lib/supabase.ts`
```ts
export const supabase = createClient(url, key)  // or mock client
export const isSupabaseConfigured: boolean      // checks env vars
```

### `lib/gemini.ts`
```ts
export const isGeminiConfigured: boolean
export async function callGemini(prompt: string): Promise<string>
// Returns '' and logs warning when not configured — never throws
```

### `lib/ocr.ts`
```ts
export async function extractPrescriptionText(
  file: File,
  onProgress: (pct: number) => void
): Promise<string>
// Throws OCRError with user-friendly message
```

### `lib/medicineMapper.ts`
```ts
export async function mapMedicinesFromText(rawText: string): Promise<{
  medicines: Medicine[]
  totalMonthlySaving: number
  totalYearlySaving: number
  source: 'gemini' | 'fallback'
}>
// Uses Gemini if configured, medicineCatalog fallback otherwise
// Always returns valid structure — never returns null
```

### `lib/schemeMatcher.ts`
```ts
export async function matchSchemes(answers: SchemeAnswers): Promise<{
  matches: Scheme[]
  summary: { eligibleCount: number; checkCount: number }
  source: 'gemini' | 'static'
}>
```

### `lib/dates.ts`
```ts
export function calculatePregnancyWeek(lmpDate: string): number
export function calculateDueDate(lmpDate: string): string
export function calculateAgeInMonths(dob: string): number
export function calculateVaccineDueDate(dob: string, dueAgeDays: number): string
export function getVaccineStatus(dueDate: string, done: boolean): VaccineRecord['status']
export function formatDateInLocale(date: string, locale: 'hi' | 'en'): string
```

### `lib/formatters.ts`
```ts
export function formatRupee(amount: number): string     // "₹9,400"
export function formatRupeeCompact(amount: number): string  // "₹9.4K"
export function formatPercent(value: number): string    // "73%"
```

---

## i18n Setup (next-intl)

```
messages/
  hi.ts   ← default
  en.ts
```

Both files export a flat or shallow-nested object. All keys must match exactly.

**Key structure:**
```ts
{
  // Navigation
  "nav.home": "...",
  "nav.prescription": "...",
  "nav.schemes": "...",
  "nav.care": "...",
  "nav.more": "...",

  // App
  "app.name": "Sehat360",
  "app.tagline": "...",

  // Common
  "common.loading": "...",
  "common.save": "...",
  "common.cancel": "...",
  "common.edit": "...",
  "common.delete": "...",
  "common.enable": "...",
  "common.close": "...",
  "common.back": "...",
  "common.share": "...",
  "common.retry": "...",
  "common.seeAll": "...",
  "common.next": "...",
  "common.done": "...",

  // Features
  "features.prescription": "...",
  "features.schemes": "...",
  "features.pregnancy": "...",
  "features.vaccination": "...",
  "features.awareness": "...",

  // Pages — each has its own prefix
  "landing.*": "...",
  "login.*": "...",
  "onboarding.*": "...",
  "dashboard.*": "...",
  "prescription.*": "...",
  "schemes.*": "...",
  "motherCare.*": "...",
  "vaccination.*": "...",
  "awareness.*": "...",
  "wallet.*": "...",
  "settings.*": "...",
  "errors.*": "...",
  "disclaimers.*": "...",
}
```

---

## Data Files — What Each Must Contain

### `data/mockData.ts`
The demo story user:
- **Meena Sharma**, Indore, MP, age 32, language: hi
- Family: Meena (self), Rajesh (spouse, 35), Arjun (child, DOB 15 months ago), Savitri (parent, 60)
- Meena is currently **22 weeks pregnant**, LMP = 5 months ago
- Features enabled: prescription, schemes, pregnancy, vaccination, awareness
- Prescriptions: 1 saved with 3 medicines, ₹332/month saving
- Wallet total: ₹9,400 total savings
- Reminders: 1 overdue vaccine (Arjun, Hepatitis B booster), 1 upcoming checkup (week 24 anomaly scan)
- Schemes matched: PM-JAY (eligible), PMMVY (eligible), JSY (likely)

### `data/medicineCatalog.ts`
At least 15 medicines with real brand names, salts, prices:
Metformin, Atorvastatin, Clopidogrel, Paracetamol, Pantoprazole, Amlodipine,
Telmisartan, Cetirizine, Amoxicillin, Iron+Folic Acid, Calcium+D3, ORS,
Metoprolol, Omeprazole, Losartan.

### `data/schemes.ts`
Full data for: PM-JAY, PMMVY, JSY, Jan Aushadhi, Mission Indradhanush, MP state scheme.
Each scheme has both Hindi and English text fields.

### `data/vaccinationSchedule.ts`
NIS-style schedule from birth to 5 years. At least 14 vaccines.
Each: `id`, `name`, `dueAgeDays`, `dueLabelKey`, `descriptionKey`.

### `data/awarenessArticles.ts`
Exactly 10 articles. Each has: id, category, tone, title {hi,en}, summary {hi,en}, readTimeMinutes, level, icon, content {hi: string[], en: string[]}.
No Lorem. Real health information in simple language.

---

## Navigation Rules

**Bottom nav — 5 tabs exactly:**

| Tab | Icon | Active on routes |
|---|---|---|
| Home | `Home` | `/dashboard` |
| Dawai | `Pill` | `/prescription` |
| Yojana | `Building2` | `/schemes` |
| Care | `HeartPulse` | `/mother-care`, `/vaccination` |
| More | `MoreHorizontal` | `/settings`, `/wallet`, `/awareness` |

**Active state:** `text-brand-deepGreen` icon + label + 2px top border in `brand-deepGreen`.
**Inactive:** `text-brand-inkSoft`.
**Tab bar:** `bg-white/90 backdrop-blur-md border-t border-brand-border`.

**More tab** opens a bottom Sheet (`MoreSheet`) with links to Wallet, Awareness, Settings.
**Care tab** at `/mother-care` shows `CareSwitcher` tabs (Mother Care | Vaccination) at top.

---

## Feature Gate Behavior

```
Feature OFF + route visited → EmptyState component:
  icon: relevant Lucide icon
  title: "Feature ka naam" + " band hai"
  description: explain what it does in one sentence
  button: "Settings mein enable karein" → /settings
  
Feature OFF + dashboard → quick action card hidden entirely
Feature OFF + wallet → stat hidden, section hidden
```

---

## Supabase Schema (v2 — with TypeScript alignment)

```sql
-- profiles
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null,
  city text,
  state text,
  age integer,
  language text default 'hi' check (language in ('hi', 'en')),
  features jsonb not null default '{"prescription":true,"schemes":true,"pregnancy":false,"vaccination":false,"awareness":true}',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- family_members
create table family_members (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  name text not null,
  relation text not null check (relation in ('self','spouse','child','parent','other')),
  dob date,
  gender text check (gender in ('male','female','other')),
  is_pregnant boolean default false,
  pregnancy_week integer,
  lmp_date date,
  created_at timestamptz default now()
);

-- prescriptions
create table prescriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  image_url text,
  raw_ocr_text text,
  medicines jsonb not null default '[]',
  total_monthly_saving numeric default 0,
  total_yearly_saving numeric default 0,
  created_at timestamptz default now()
);

-- vaccinations
create table vaccinations (
  id uuid primary key default gen_random_uuid(),
  member_id uuid not null references family_members(id) on delete cascade,
  vaccine_name text not null,
  due_date date,
  done boolean default false,
  done_date date,
  created_at timestamptz default now()
);

-- Enable RLS on all tables
alter table profiles enable row level security;
alter table family_members enable row level security;
alter table prescriptions enable row level security;
alter table vaccinations enable row level security;

-- RLS policies (add these)
create policy "users own their profile" on profiles for all using (auth.uid() = id);
create policy "users own their family" on family_members for all using (auth.uid() = user_id);
create policy "users own their prescriptions" on prescriptions for all using (auth.uid() = user_id);
```

---

## Environment Variables

`.env.local` (never commit):
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
GEMINI_API_KEY=
```

`.env.example` (commit this):
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
GEMINI_API_KEY=your_gemini_key
```

**Note:** `GEMINI_API_KEY` is server-only (used in API route `/api/gemini`). Do not expose to client.

---

## Demo Mode Behavior

When env vars are missing, the app must work fully as a demo:

- `isSupabaseConfigured = false` → all auth shows "Demo mein continue karein" button, skips Supabase calls
- `isGeminiConfigured = false` → `mapMedicinesFromText` returns mock medicines from `medicineCatalog`, `matchSchemes` uses static rules
- Store initializes with Meena's mock data
- All features are enabled in demo
- A small `DemoBanner` component shows at top of app pages: "Demo mode — Supabase/Gemini not connected"

---

## Build Verification Checklist

After every prompt, before moving on:

```bash
npm run build      # must pass with zero TypeScript errors
npm run lint       # fix all warnings too, not just errors
```

Manual checks at 375px:
- [ ] No horizontal scroll at any point
- [ ] Bottom nav visible and not covering last content item  
- [ ] All buttons/cards have readable text (no overflow)
- [ ] Forms are usable (inputs not zooming on iOS = 16px minimum)
- [ ] Dialogs fit within viewport

Manual checks on desktop:
- [ ] App shell centered at 430px max-width
- [ ] `bg-brand-smoke` visible on sides
- [ ] No stretched layouts

Code search before done:
```bash
grep -r "Lorem\|TODO\|FIXME\|Coming soon\|placeholder" src/
grep -r "hardcoded₹\|hardcoded Hindi" src/
```

---

## Prompt Sequence

Execute in order. Each prompt leaves the app in a runnable state.

1. `PROMPT_1_FOUNDATION.md` — Next.js setup, design system, shell, i18n, data, store
2. `PROMPT_2_AUTH.md` — Landing, Login (Supabase OTP + demo), Onboarding
3. `PROMPT_3_DASHBOARD.md` — Dashboard, Health Wallet
4. `PROMPT_4_PRESCRIPTION_SCHEMES.md` — Prescription scanner, Schemes finder
5. `PROMPT_5_CARE.md` — Mother Care, Child Vaccination
6. `PROMPT_6_AWARENESS_SETTINGS.md` — Awareness, Settings, final polish
