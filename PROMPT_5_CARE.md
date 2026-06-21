# SEHAT360 — PROMPT 5
## Mother Care + Child Vaccination

Read `AGENTS.md`. Prompts 1–4 are complete.

These screens must feel calm, warm, and useful — not clinical. A family member tracking pregnancy or child vaccines is not looking at a dashboard. They need quick, clear answers to "what's due?" and "are we on track?"

---

## CareSwitcher

Both pages share the same Care tab in bottom nav. Implement `CareSwitcher` at the top of both pages:

```tsx
// src/components/layout/CareSwitcher.tsx
// Shadcn Tabs component
// Tab 1: "Pregnancy" HeartPulse icon → /mother-care
// Tab 2: "Vaccination" Syringe icon → /vaccination
//
// Styling:
//   bg-white border-b border-brand-border px-4 pt-2 sticky top-[52px] z-10
//   (sits below PageHeader which is sticky at top)
//   Active tab: text-brand-deepGreen border-b-2 border-brand-deepGreen
//   Inactive: text-brand-inkSoft
//   Use router.push on tab change — not Shadcn Tabs internal state
```

---

## Mother Care `/mother-care`

### Feature Gate Check

```tsx
// At top of page, before any UI:
const { isFeatureEnabled } = useUserStore()
if (!isFeatureEnabled('pregnancy')) {
  return <EmptyState
    icon={HeartPulse}
    title="Pregnancy Care band hai"
    description="Is feature ko Settings mein chalu karein"
    actionLabel="Settings mein jayein"
    onAction={() => router.push('/settings')}
  />
}
```

### Data Setup

```tsx
const pregnantMember = useUserStore(s => s.getPregnantMember())

if (!pregnantMember) {
  return <EmptyState
    icon={HeartPulse}
    title="Koi pregnant member nahi"
    description="Settings mein pregnant family member add karein"
    actionLabel="Family member add karein"
    onAction={() => router.push('/settings')}
  />
}

const week = calculatePregnancyWeek(pregnantMember.lmpDate!)
const dueDate = calculateDueDate(pregnantMember.lmpDate!)
const weeksLeft = 40 - week
const trimester = week <= 13 ? 1 : week <= 26 ? 2 : 3
```

### Page Header

```tsx
// PageHeader:
//   title: "Pregnancy Care"
//   subtitle: "Week {week} — {weeksLeft} hafte baaki"
//   showBack: true
//   rightSlot: if multiple pregnant members → member selector (Shadcn Select)
```

---

### Section 1: Week Progress Hero

```tsx
// bg-gradient-to-br from-brand-pink to-brand-pink/70 rounded-2xl p-5 text-white
// (Pink gradient — NOT green — this screen is about pregnancy, differentiate visually)

// Layout:
// Row: "Trimester {trimester}" badge (white/20) + "Due: {formattedDueDate}" text-white/70
//
// Center: "Week {week}" font-mono font-bold text-5xl + "/40" text-white/60 text-2xl
//
// Segmented progress bar (3 sections):
//   Section widths: T1=13/40, T2=13/40, T3=14/40
//   Visual: 3 pill segments side by side with 2px gap
//   Completed portion: white, upcoming: white/20
//   Current week dot: white circle above the bar at correct position
//   Labels below: "T1 (1–13)" | "T2 (14–26)" | "T3 (27–40)" text-[10px] text-white/60
//
// Bottom: "{memberName}" + LMP date in text-white/70 text-xs
```

Progress calculation:
```ts
const progressPercent = (week / 40) * 100
// T1 progress: Math.min(week, 13) / 13
// T2 progress: week > 13 ? Math.min(week - 13, 13) / 13 : 0
// T3 progress: week > 26 ? (week - 26) / 14 : 0
```

---

### Section 2: Baby This Week

```tsx
// bg-white border border-brand-border rounded-2xl p-4
//
// Left: Simple size comparison visual
//   Use a lookup object by week range → fruit/vegetable name
//   Display as: large emoji-free icon (Leaf, Apple icon from Lucide) or simple SVG circle
//   Show actual size text: "Anaar jaisa — lagbhag 27cm"
//
// Right:
//   "Is hafte aapka bachcha:" font-medium text-sm
//   Size/weight description (Hindi, from data)
//   One warm tip line: "Woh aapki awaaz pehchaanta hai" text-brand-inkSoft text-sm

// Baby size data by week range:
const BABY_SIZE_BY_WEEK = {
  4: { hi: 'Khas ke daane jaisa', size: '< 1mm' },
  8: { hi: 'Matar jaisa', size: '1.6cm' },
  12: { hi: 'Nimbu jaisa', size: '5.4cm' },
  16: { hi: 'Avocado jaisa', size: '11.6cm' },
  20: { hi: 'Kele jaisa', size: '25.6cm' },
  24: { hi: 'Bhutte jaisa', size: '30cm' },
  28: { hi: 'Baingan jaisa', size: '37.6cm' },
  32: { hi: 'Nariyal jaisa', size: '42.4cm' },
  36: { hi: 'Papita jaisa', size: '47.4cm' },
  40: { hi: 'Tarbuz jaisa', size: '50cm' },
}
// Use closest lower bound
```

---

### Section 3: Urgent Checkup Alert

```tsx
// Static pregnancy checkup schedule:
const PREGNANCY_CHECKUPS = [
  { id: 'booking', week: 8, nameKey: 'checkups.booking', desc: 'Pehla checkup' },
  { id: 'nt-scan', week: 12, nameKey: 'checkups.ntScan', desc: 'NT scan' },
  { id: 'anomaly', week: 20, nameKey: 'checkups.anomaly', desc: 'Anomaly scan' },
  { id: 'glucose', week: 24, nameKey: 'checkups.glucose', desc: 'Glucose test' },
  { id: 'check28', week: 28, nameKey: 'checkups.check28', desc: '3rd trimester start' },
  { id: 'check32', week: 32, nameKey: 'checkups.check32', desc: 'Growth scan' },
  { id: 'check36', week: 36, nameKey: 'checkups.check36', desc: 'Position check' },
  { id: 'check38', week: 38, nameKey: 'checkups.check38', desc: 'Pre-delivery' },
]

// Find next due checkup: first checkup where week > currentWeek - 2 and not done
// If within 2 weeks: show urgent alert card
// bg-brand-saffronLight border border-brand-saffron/30 rounded-2xl p-4
//   [AlertTriangle icon, brand-saffron]
//   "Week {checkup.week} {checkup.nameKey} due hai!"
//   "Abhi Week {week} hai — jaldi doctor se milein"
//   Button: "Appointment note karein" (saves local note / mark done)
//
// If no urgent checkup:
//   bg-brand-lightGreen rounded-xl p-3 text-sm text-brand-inkSoft
//   "Agli check-up: Week {nextCheckup.week} — {checkupName}"
```

---

### Section 4: Checkups Timeline

```tsx
// Title: "Checkup Timeline"
//
// List of all checkups with status:
// Each row:
//   Left dot: 
//     done → bg-brand-midGreen (solid circle)
//     urgent → bg-brand-saffron (pulsing via CSS animation)
//     missed → bg-brand-danger
//     upcoming → bg-brand-border
//   Center:
//     Week number + checkup name
//     "Week {week}" text-xs text-brand-inkSoft
//   Right:
//     done → "✓ Ho gayi" text-brand-midGreen text-xs
//     urgent → "Due hai" badge bg-brand-saffron text-white text-xs
//     missed → "Miss ho gayi" badge bg-brand-danger text-white text-xs
//     upcoming → "Week {week} mein" text-brand-inkSoft text-xs
//
//   "Mark done" tap (for upcoming/urgent):
//     Tapping the row shows a Shadcn Dialog to confirm + optionally add date
//     On confirm: updates local store checkup status
//
// Vertical line connecting dots (decorative, brand-border)
```

---

### Section 5: Week Tips

```tsx
// 3 compact cards in horizontal scroll (or vertical on mobile if they'd be too small):
// Each card: bg-white border border-brand-border rounded-xl p-3 flex-shrink-0 w-64
//
// Tip categories (static by trimester):
// T1 tips: "Folic acid lo", "Rest karo", "Nausea se bachne ke tips"
// T2 tips: "Iron-rich khana", "Pani piyen", "Soft exercise"  
// T3 tips: "Hospital bag taiyaar karein", "Delivery plan banayein", "Back pain ke liye position"
//
// Each tip card:
//   [Icon: relevant Lucide icon] in colored circle
//   Tip title (Hindi, from i18n)
//   2-line body text
// DO NOT make diagnostic claims — these are general wellness tips only
```

---

### Section 6: AI Guidance Chat

```tsx
// Title: "Doctor se poochne wale sawaal ya tips"
//
// Simple chat UI:
//   Messages list (max-h-64 overflow-y-auto)
//   User bubble: right-aligned, bg-brand-deepGreen text-white rounded-2xl rounded-tr-sm
//   AI bubble: left-aligned, bg-white border border-brand-border rounded-2xl rounded-tl-sm
//   Loading bubble: animated dots
//
// Input row (sticky bottom of chat area):
//   Textarea (2 lines) + Send button
//   Placeholder: "Week {week} mein kya poochna chahte hain?"
//   Send disabled when empty
//
// Disclaimer (below chat, always visible):
//   bg-brand-blueLight rounded-xl p-2 text-xs text-brand-blue
//   "Yeh AI guidance hai, doctor ki jaanch nahi. Dard, bleeding, bukhar, ya koi bhi pareshani mein seedha doctor ke paas jayein."
```

**Gemini prompt (server-side):**
```ts
const systemPrompt = `
Tum ek supportive pregnancy guide ho. User ${week}vi hafte mein pregnant hai.
App language: ${language}.
Response: ${language === 'hi' ? 'Hindi mein' : 'English mein'}.
Rules:
- 2–3 sentences max
- Supportive aur clear baat karein
- Koi diagnosis mat karein
- Severe pain, bleeding, bukhar, swelling, headache, ya baby ki movement kam ho to seedha doctor ke paas bhejo
- Ek helpful tip ya answer dein
`
```

**Demo mode fallback:**
```ts
// If Gemini not configured, return canned responses based on keywords:
const DEMO_RESPONSES = {
  'dard': 'Halka dard normal hai. Agar zyada ho ya bleeding ho, turant doctor ke paas jayein.',
  'khana': 'Is hafte iron aur folic acid wala khana zyada khayein — palak, dal, aur khajoor achhe hain.',
  'exercise': 'Halki walking aur prenatal yoga safe hai. Koi bhi naya exercise shuru karne se pehle doctor se poochein.',
  default: `Week ${week} mein aap achha kar rahi hain. Pani piyen, rest karein, aur agli checkup miss mat karein.`,
}
```

---

### Mother Care i18n Keys

```ts
'motherCare.title': 'Pregnancy Care',
'motherCare.week': 'Week {week}',
'motherCare.weeksLeft': '{left} hafte baaki',
'motherCare.dueDate': 'Due: {date}',
'motherCare.trimester': 'Trimester {n}',
'motherCare.babySize': 'Is hafte aapka bachcha:',
'motherCare.urgentCheckup': 'Week {week} {name} due hai!',
'motherCare.urgentDesc': 'Abhi Week {week} hai — jaldi doctor se milein',
'motherCare.appointmentNote': 'Appointment note karein',
'motherCare.nextCheckup': 'Agli check-up: Week {week} — {name}',
'motherCare.timelineTitle': 'Checkup Timeline',
'motherCare.markDone': 'Mark done',
'motherCare.chatTitle': 'AI se poochein',
'motherCare.chatPlaceholder': 'Week {week} mein kya poochna chahte hain?',
'motherCare.chatDisclaimer': 'AI guidance hai, doctor ki jaanch nahi. Koi bhi pareshani mein doctor ke paas jayein.',
'motherCare.checkup.done': 'Ho gayi',
'motherCare.checkup.due': 'Due hai',
'motherCare.checkup.missed': 'Miss ho gayi',
```

---

### Mother Care Acceptance

- [ ] Feature disabled state shows EmptyState with settings link
- [ ] No pregnant member state shows EmptyState with add link
- [ ] Week calculated from LMP — not hardcoded
- [ ] Pink gradient hero (not green)
- [ ] Progress bar segments correspond to trimesters correctly
- [ ] Urgent checkup alert shows when within 2 weeks
- [ ] "Mark done" dialog works and updates UI
- [ ] AI chat sends to /api/gemini when configured
- [ ] Demo fallback returns canned response (not empty)
- [ ] Safety disclaimer visible below chat
- [ ] No overflow at 375px

---

## Vaccination `/vaccination`

### Feature Gate Check

Same pattern as Mother Care — check `isFeatureEnabled('vaccination')`.

### No Child Member State

```tsx
const childMembers = useUserStore(s => s.getChildMembers())
if (childMembers.length === 0) {
  return <EmptyState
    icon={Syringe}
    title="Koi bachcha nahi mila"
    description="Settings mein bachche ka naam aur janam taareekh add karein"
    actionLabel="Bachcha add karein"
    onAction={() => router.push('/settings')}
  />
}
```

### Member Selector

If multiple children:
```tsx
// Shadcn Select in PageHeader rightSlot
// Default: youngest child
// On change: updates selectedChildId local state
```

### Data Calculation

```tsx
const selectedChild = childMembers.find(m => m.id === selectedChildId)
const ageInDays = differenceInDays(new Date(), new Date(selectedChild.dob!))

// For each vaccine in VACCINATION_SCHEDULE:
const vaccineStatuses = VACCINATION_SCHEDULE.map(vaccine => {
  const dueDate = calculateVaccineDueDate(selectedChild.dob!, vaccine.dueAgeDays)
  const record = vaccinationRecords[selectedChild.id]?.find(r => r.vaccineName === vaccine.id)
  const status = getVaccineStatus(dueDate, record?.done ?? false)
  return { ...vaccine, dueDate, status, doneDate: record?.doneDate }
})

const doneCount = vaccineStatuses.filter(v => v.status === 'done').length
const overdueCount = vaccineStatuses.filter(v => v.status === 'overdue').length
const dueSoonCount = vaccineStatuses.filter(v => v.status === 'dueSoon').length
const totalCount = vaccineStatuses.length
const percent = Math.round((doneCount / totalCount) * 100)
```

---

### Section 1: Progress Hero

```tsx
// bg-gradient-to-br from-brand-saffron to-brand-saffron/70 rounded-2xl p-5 text-white
// (Saffron gradient — distinct from green for dashboard and pink for pregnancy)

// Left: Avatar circle (initials, bg-white/20, text-white font-bold)
//       Name + age in months below
//
// Right: Large percentage
//   font-mono font-bold text-4xl "{percent}%"
//   "vaccines complete" text-white/70 text-xs
//
// Progress bar: bg-white/20 rounded-full h-2
//   Fill: bg-white rounded-full width={percent}%
//
// Status pills row:
//   "❌ {overdueCount} overdue" bg-white/20 text-white rounded-full px-2 py-0.5 text-xs
//   "⏳ {dueSoonCount} jaldi" same
//   "✓ {doneCount}/{totalCount} complete" same
```

---

### Section 2: Overdue Alert

```tsx
// Show only when overdueCount > 0:
// bg-brand-dangerLight border border-brand-danger/20 rounded-2xl p-4
//   [AlertTriangle icon, brand-danger]
//   "{overdueCount} vaccine{overdueCount > 1 ? 'n' : ''} miss ho gayi hain"
//   "{mostUrgentVaccineName} — {daysOverdue} din se baaki"
//   Button: "PHC Dhundhen" → open maps (geolocation or fallback to maps search)
//
// No overdue: compact green card
//   [CheckCircle, deepGreen] "Sab on track!" text-brand-deepGreen text-sm
```

---

### Section 3: Vaccine List By Status

Three groups, rendered in order:

**Group 1: Miss Ho Gayi / Overdue** (only if > 0)
**Group 2: Jaldi Due / Due Soon** (only if > 0)
**Group 3: Aane Wali / Upcoming** (collapsed by default, "Dekho →" to expand)
**Group 4: Ho Gayi / Done** (collapsed by default, count shown, "Dekho →" to expand)

**Vaccine card (overdue/dueSoon):**
```tsx
// bg-white border border-brand-border rounded-xl p-4
// Framer Motion: staggerChildren on each group
//
// Left: [Status dot — red/saffron/green/muted] + vaccine name font-medium
// Middle:
//   Recommended age: "6 hafte" text-xs text-brand-inkSoft
//   Due date: formatDateInLocale text-xs
// Right:
//   Status badge (overdue: red, dueSoon: saffron, upcoming: muted, done: green)
//   Action button (only for overdue/dueSoon):
//     "Mark Done" → opens Shadcn Dialog to confirm + add done date

// Mark Done Dialog:
//   "Vaccine date confirm karein"
//   Date picker (Shadcn Input type="date", default today)
//   "Ho gayi!" confirm button
//   On confirm: store.markVaccineDone(memberId, vaccineId, doneDate)
```

**Upcoming/Done rows (compact, in collapsed sections):**
```tsx
// Simpler rows: just name + date (no action button)
// Show/hide with Framer Motion AnimatePresence height animation
```

---

### Section 4: PHC Locator

```tsx
// bg-white border border-brand-border rounded-2xl p-4
// [MapPin icon, brand-blue]
// "Najdeeki PHC mein free vaccines milti hain"
// Button: "PHC / Anganwadi Dhundhen"
//   onClick:
//     if (navigator.geolocation):
//       navigator.geolocation.getCurrentPosition(pos => {
//         const url = `https://maps.google.com/?q=primary+health+centre+near+${pos.coords.latitude},${pos.coords.longitude}`
//         window.open(url, '_blank')
//       }, () => fallbackMapsOpen())
//     else:
//       window.open('https://maps.google.com/?q=primary+health+centre+near+me', '_blank')
// NOTE: Do NOT request geolocation on page load — only on button click
```

---

### Vaccination i18n Keys

```ts
'vaccination.title': 'Vaccination Tracker',
'vaccination.subtitle': '{name} — {age} mahine',
'vaccination.progress': '{percent}% vaccines complete',
'vaccination.overdueAlert': '{count} vaccine miss ho gayi hain',
'vaccination.overdueDesc': '{name} — {days} din se baaki',
'vaccination.phcButton': 'PHC / Anganwadi Dhundhen',
'vaccination.allOnTrack': 'Sab on track!',
'vaccination.group.overdue': 'Miss Ho Gayi',
'vaccination.group.dueSoon': 'Jaldi Due',
'vaccination.group.upcoming': 'Aane Wali',
'vaccination.group.done': 'Ho Gayi',
'vaccination.markDone': 'Mark Done',
'vaccination.markDoneTitle': 'Vaccine date confirm karein',
'vaccination.markDoneConfirm': 'Ho gayi!',
'vaccination.status.overdue': 'Baaki hai',
'vaccination.status.dueSoon': 'Jaldi',
'vaccination.status.upcoming': 'Aane wali',
'vaccination.status.done': 'Ho gayi',
'vaccination.pill.overdue': '{count} overdue',
'vaccination.pill.dueSoon': '{count} jaldi',
'vaccination.pill.done': '{done}/{total} complete',
```

---

### Vaccination Acceptance

- [ ] Feature disabled shows EmptyState
- [ ] No child member shows EmptyState
- [ ] Age calculated from DOB (not hardcoded)
- [ ] Vaccine statuses computed from schedule + store records
- [ ] Overdue count is real — not demo hardcoded
- [ ] Saffron gradient hero (not green, not pink)
- [ ] Mark done dialog updates status immediately
- [ ] Overdue/done sections collapsible
- [ ] PHC button requests geolocation only on click
- [ ] No overflow at 375px

---

## Final Verification

```bash
npm run build   # zero TypeScript errors
```

- [ ] `/mother-care` loads directly
- [ ] `/vaccination` loads directly
- [ ] CareSwitcher navigates between both
- [ ] Care tab stays active on both routes
- [ ] Demo mode shows Arjun's data (15 months old, some overdue vaccines)
- [ ] Demo mode shows Meena's pregnancy data (week 22, upcoming anomaly scan)
