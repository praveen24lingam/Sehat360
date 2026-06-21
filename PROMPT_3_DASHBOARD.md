# SEHAT360 — PROMPT 3
## Dashboard and Health Wallet

Read `AGENTS.md`. Prompts 1 and 2 are complete.

Dashboard is the daily home screen — the "face" of the app. Wallet is the proof-of-impact screen. Both must feel financially motivating and useful, not like analytics dashboards.

---

## Dashboard `/dashboard`

### Data Sources (in priority order)

1. Zustand store (always available — has mock data in demo mode)
2. Supabase if configured (fetch on mount, update store)
3. Never block render waiting for Supabase

```tsx
// Pattern for all dashboard data:
const { profile, prescriptions, reminders, matchedSchemes } = useUserStore()
// Render immediately with store data
// Supabase refresh in background, silently update store
```

### Layout (top to bottom, all within px-4)

```
[TopBar]
[DemoBanner — if demo mode]
[SavingsHero card]          ← deep green gradient
[QuickActions grid]
[Reminders section]
[HealthTip card]
[FamilyRow]
[spacer for nav]
```

---

### TopBar

```tsx
// sticky top-0 bg-brand-smoke/95 backdrop-blur-sm z-10
// py-3 px-4 flex items-center justify-between
// Height: 52px

// Left:
//   "Namaste," text-brand-inkSoft text-sm
//   profile.name in text-brand-ink text-base font-semibold (on next line or inline)

// Right:
//   [LanguageToggle compact — just "Hi | En" text buttons]
//   [Bell icon — Lucide Bell, size 20]
//   Bell has a small dot (4px, brand-saffron) when reminders exist
```

---

### SavingsHero Card

```tsx
// bg-gradient-to-br from-brand-deepGreen to-brand-midGreen
// rounded-2xl p-5 text-white
// This is the ONLY card that gets this green gradient

// Layout:
// Top row: "Kul bachat" label (text-white/70 text-xs) + "Jan Aushadhi" badge (white/20 bg)
// 
// Big number: ₹{totalSavings}
//   font-mono font-bold text-4xl
//   Framer Motion: count up from 0 on first mount (useMotionValue + animate)
//
// Supporting row: "₹{monthly}/mahina" | "{prescriptionCount} prescriptions" | "{schemeCount} yojnaayein"
//   Each in its own small pill: bg-white/10 rounded-full px-2 py-0.5 text-xs
//
// Bottom: "Wallet dekhein →" link in text-white/80 text-sm → /wallet
```

**Count-up animation (Framer Motion):**
```tsx
import { useMotionValue, useTransform, animate } from 'framer-motion'

// On mount, animate from 0 to totalSavings over 1.2s
// Only runs once (useEffect with empty deps)
// Respects useReducedMotion — skip animation, show final value immediately
```

If prescription feature disabled:
- Replace with a simpler health summary card (no green gradient, use white card)
- Show: "Features chalu karein" with enabled feature badges

---

### Quick Actions Grid

Section title: "Aaj kya karein?" (text-base font-semibold text-brand-ink, mb-3)

```tsx
// CSS Grid: grid-cols-2 gap-3
// Each action card: bg-white border border-brand-border rounded-2xl p-4
//   shadow-card hover:shadow-card-md transition-shadow
```

Only show actions for **enabled features**. Order: prescription, schemes, pregnancy, vaccination, awareness.

**Action card structure:**
```tsx
// [Icon container: w-10 h-10 rounded-xl bg-{tone}Light flex items-center justify-center]
//   [Icon: size=20, color=brand-{tone}]
// [Title: text-sm font-semibold text-brand-ink mt-2]
// [Subtitle: text-xs text-brand-inkSoft] ← real data, not generic
// [Optional: urgent badge — top-right corner of card, saffron]
```

Action cards with real subtitles:

| Feature | Icon | Tone | Subtitle (from store) |
|---|---|---|---|
| Dawai Bachat | Pill | green | "₹{monthly}/mahina bachat ho rahi hai" |
| Sarkari Yojnaayein | Building2 | blue | "{count} yojnaayein milti hain" |
| Pregnancy Care | HeartPulse | pink | "Week {week} — {weeks_left} hafte baaki" |
| Vaccination | Syringe | saffron | "{done}/{total} vaccines ho gayi" |
| Health Jaankari | BookOpen | green | "{articleCount} articles — Hindi mein" |

If < 2 features enabled, add a "Settings" card: Settings icon, "Aur features chalu karein".

**Urgent badge:**
```tsx
// Show if: vaccine overdue, checkup due soon
// Small saffron circle top-right: absolute -top-1 -right-1 w-4 h-4
// bg-brand-saffron rounded-full text-white text-[8px] flex items-center justify-center
// Content: "!" or count
```

---

### Reminders Section

Title: "Yaad rakhein" + count badge (if > 0)

If reminders exist:
```tsx
// Use ReminderCard component
// Show max 3
// If > 3: "Aur {n} reminders hain →" link

// ReminderCard visual:
// Left: 4px rounded left border (saffron for urgent, deepGreen for normal)
// bg-brand-saffronLight (urgent) or bg-brand-lightGreen (normal)
// Icon + title + subtitle
// urgency badge: "Abhi" (urgent) | date (normal)
```

If no reminders:
```tsx
// EmptyState:
//   icon: CheckCircle
//   title: "Aaj koi urgent reminder nahi"
//   description: "Sab theek chal raha hai"
//   tone: green (no action needed)
```

Clicking a reminder → `reminder.linkedRoute`.

---

### Health Tip Card

```tsx
// bg-white border border-brand-border rounded-2xl p-4
// Left: BookOpen icon in bg-brand-lightGreen circle
// Right: 
//   Category badge (e.g., "Pregnancy" in pinkLight)
//   Tip title (localized from awarenessArticles[0].title)
//   "3 min padhein →" → /awareness

// Pick the first article from awarenessArticles that matches pregnancy if user is pregnant
// Otherwise: first article
```

---

### Family Row

Section title: "Parivaar" + "Sab dekho →" → /settings

```tsx
// Horizontal scroll: flex overflow-x-auto gap-3 pb-2 -mx-4 px-4
// No visible scrollbar (scrollbar-hide utility or CSS)

// Each family member chip:
// bg-white border border-brand-border rounded-2xl p-3 flex-shrink-0 w-28
// Avatar circle: initials, bg-brand-lightGreen text-brand-deepGreen
// Name: text-xs font-semibold truncate
// Relation: text-[10px] text-brand-inkSoft
// Status badge (below name):
//   Pregnant: bg-brand-pinkLight text-brand-pink text-[9px] "Pregnant"
//   Child: bg-brand-saffronLight text-brand-saffron text-[9px] "{age} mahine"
//   Overdue vaccine: bg-brand-dangerLight text-brand-danger text-[9px] "Vaccine due"

// Last item: "+" button → /settings (add family member)
//   Same card size, dashed border, text-brand-inkSoft text-xs text-center
```

---

### Dashboard i18n Keys

```ts
'dashboard.greeting': 'Namaste, {name}',
'dashboard.actionsTitle': 'Aaj kya karein?',
'dashboard.remindersTitle': 'Yaad rakhein',
'dashboard.remindersEmpty': 'Aaj koi urgent reminder nahi',
'dashboard.remindersEmptyDesc': 'Sab theek chal raha hai',
'dashboard.familyTitle': 'Parivaar',
'dashboard.tipTitle': 'Health tip',
'dashboard.walletLink': 'Wallet dekhein',
'dashboard.seeAllReminders': 'Aur {n} reminders hain',
'dashboard.seeAllFamily': 'Sab dekho',
'dashboard.savings.totalLabel': 'Kul bachat',
'dashboard.savings.monthly': '₹{amount}/mahina',
'dashboard.savings.prescriptions': '{count} prescriptions',
'dashboard.savings.schemes': '{count} yojnaayein',
'dashboard.action.prescription.subtitle': '₹{amount}/mahina bachat',
'dashboard.action.schemes.subtitle': '{count} yojnaayein milti hain',
'dashboard.action.pregnancy.subtitle': 'Week {week} — {left} hafte baaki',
'dashboard.action.vaccination.subtitle': '{done}/{total} vaccines ho gayi',
'dashboard.action.awareness.subtitle': '{count} articles Hindi mein',
'dashboard.action.settings.subtitle': 'Aur features chalu karein',
'dashboard.status.pregnant': 'Pregnant',
'dashboard.status.vaccineDue': 'Vaccine due',
```

---

### Dashboard Acceptance

- [ ] TopBar shows correct name from store
- [ ] Bell dot appears when reminders exist
- [ ] Savings hero count-up animation runs on first load
- [ ] Savings hero is green gradient — no other card on dashboard has this
- [ ] Quick actions only show enabled features
- [ ] Each quick action has real data in subtitle (not placeholder text)
- [ ] Urgent badge appears on overdue vaccine action
- [ ] ReminderCard shows with correct urgency styling
- [ ] Family row scrolls horizontally
- [ ] Family member status badges show correctly
- [ ] Language toggle works from dashboard
- [ ] No horizontal overflow at 375px

---

## Health Wallet `/wallet`

Purpose: "Sehat360 ne kitna farak diya?"

This is a motivational screen. Show real impact with numbers that feel earned.

### Page Header

```tsx
// PageHeader:
//   title: wallet.title
//   subtitle: wallet.subtitle
//   showBack: true (back to /dashboard or navigate(-1))
//   rightSlot: Share2 icon button
```

Share behavior:
```ts
// 1. Build share text: "Sehat360 se ₹{total} bachaye! Yojnaayein bhi mili: PM-JAY. sehat360.vercel.app"
// 2. if (navigator.share) → navigator.share({ title, text, url })
// 3. else → navigator.clipboard.writeText(text) → show success toast/alert
```

---

### Total Savings Hero

```tsx
// bg-gradient-to-br from-brand-deepGreen to-brand-midGreen rounded-2xl p-5 text-white

// "Kul dawai bachat" text-white/70 text-xs
// ₹{totalSavings} — font-mono font-bold text-4xl (same count-up as dashboard but only if navigating fresh)
// 
// Progress to ₹10,000 milestone:
//   "₹10,000 target" text-white/60 text-xs
//   Custom progress bar: bg-white/20 rounded-full h-2
//   Fill: bg-white rounded-full, width = (totalSavings/10000)*100%
//   Below: "₹{remaining} aur bachao" text-white/70 text-xs

// If no prescriptions:
//   EmptyState (white card below hero): "Abhi tak koi prescription nahi"
//   CTA: "Pehla prescription scan karein" → /prescription
```

---

### Stats Grid

```tsx
// Respect feature gates — only show enabled feature stats
// Use StatCard component

// Stats (if feature enabled):
// 1. Prescriptions scanned — Pill icon — green tone
// 2. Schemes unlocked — Building2 icon — blue tone
// 3. Vaccines complete % — Syringe icon — saffron tone

// Grid: 1, 2, or 3 columns depending on enabled count
// grid-cols-1 sm:grid-cols-3 — at 375px always 3 columns if all enabled
// StatCard: bg-white border border-brand-border rounded-2xl p-4
//   Icon in colored circle top-left
//   Value: font-mono font-bold text-2xl
//   Label: text-xs text-brand-inkSoft
```

---

### Prescription History

Title: "Prescription History"

```tsx
// List from store.prescriptions (newest first)
// Each row: bg-white border border-brand-border rounded-xl p-3 mb-2
//   Left: Pill icon in green circle
//   Middle: 
//     "Prescription #{n}" font-medium text-sm
//     date in text-xs text-brand-inkSoft (formatDateInLocale)
//     "{count} dawaiyaan" text-xs text-brand-inkSoft
//   Right:
//     "₹{monthly}/mahina" font-mono font-bold text-brand-deepGreen text-sm
//     "₹{yearly}/saal" text-xs text-brand-inkSoft

// If empty:
//   EmptyState: Pill icon, "Abhi tak koi prescription nahi"
//   CTA: "Scan karein" → /prescription
```

---

### Schemes Unlocked

Title: "Milin Yojnaayein"

```tsx
// Use SchemeCard component for each matched scheme
// If schemes feature disabled: feature EmptyState
// If no schemes matched: EmptyState with "Eligibility check karein" → /schemes
// Show only eligible/likely schemes (not 'check' or 'notEligible')
```

---

### Milestones

Title: "Milestones"

```tsx
// Data-driven list — compute done/pending from store
const MILESTONES = [
  { id: 'first-scan', labelKey: 'wallet.milestone.firstScan', done: prescriptions.length > 0 },
  { id: 'save-5k', labelKey: 'wallet.milestone.save5k', done: totalSavings >= 5000, value: 5000 },
  { id: 'pmjay', labelKey: 'wallet.milestone.pmjay', done: matchedSchemes.some(s => s.id === 'pm-jay') },
  { id: 'save-10k', labelKey: 'wallet.milestone.save10k', done: totalSavings >= 10000, value: 10000 },
  { id: 'vaccines-50', labelKey: 'wallet.milestone.vaccines50', done: vaccinationPercent >= 50 },
]

// Each row:
// [icon: CheckCircle (done, deepGreen) or Lock (pending, muted)]
// [label from i18n key]
// [value if applicable: "₹5,000"]
// Done rows: text-brand-ink; Pending: text-brand-inkSoft opacity-60
// No progress bar — clean icon + text list
// Compact rows: py-2.5 border-b border-brand-border last:border-0
```

---

### Wallet i18n Keys

```ts
'wallet.title': 'Health Wallet',
'wallet.subtitle': 'Aapki sehat ki bachat',
'wallet.totalLabel': 'Kul dawai bachat',
'wallet.targetLabel': '₹10,000 target',
'wallet.remaining': '₹{amount} aur bachao',
'wallet.share': 'Share karein',
'wallet.shareText': 'Sehat360 se ₹{amount} bachaye! PM-JAY aur PMMVY bhi mili. {url}',
'wallet.statsTitle': 'Numbers',
'wallet.stat.prescriptions': 'Prescriptions',
'wallet.stat.schemes': 'Yojnaayein',
'wallet.stat.vaccines': 'Vaccines complete',
'wallet.historyTitle': 'Prescription History',
'wallet.historyEmpty': 'Abhi tak koi prescription nahi',
'wallet.historyCta': 'Scan karein',
'wallet.schemesTitle': 'Milin Yojnaayein',
'wallet.schemesEmpty': 'Eligibility check karein',
'wallet.milestonesTitle': 'Milestones',
'wallet.milestone.firstScan': 'Pehla prescription scan kiya',
'wallet.milestone.save5k': '₹5,000 bachaye',
'wallet.milestone.pmjay': 'PM-JAY eligible hua',
'wallet.milestone.save10k': '₹10,000 target',
'wallet.milestone.vaccines50': '50% vaccines complete',
'wallet.copy.success': 'Text copy ho gaya!',
```

---

### Wallet Acceptance

- [ ] Share button works (Web Share API or clipboard fallback)
- [ ] Progress bar width is computed from real data, not hardcoded
- [ ] Stats respect feature gates — disabled feature stat hidden
- [ ] Prescription history shows with correct dates
- [ ] Milestones derive done/pending from store data
- [ ] Empty states exist for 0 prescriptions, 0 schemes
- [ ] No clipped rupee numbers at 375px

---

## Final Verification

```bash
npm run build   # zero errors
```

- [ ] `/dashboard` and `/wallet` load directly via URL
- [ ] Navigating Dashboard → Wallet → back to Dashboard works
- [ ] No horizontal overflow on either screen at 375px
- [ ] Bottom nav correct active state on both routes
