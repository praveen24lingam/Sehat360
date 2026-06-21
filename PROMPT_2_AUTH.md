# SEHAT360 — PROMPT 2
## Auth Flow: Landing, Login, Onboarding

Read `AGENTS.md` first. Prompt 1 is complete — routing, design system, shell, i18n, store, and service boundaries all exist.

This prompt builds the 3 public entry screens. These screens must convert a skeptical judge into a user in under 60 seconds.

---

## Cross-Prompt Rules (repeat for reference)

- No hardcoded visible strings. Every string in `messages/hi.ts` and `messages/en.ts`.
- Shadcn components for all form controls.
- Lucide icons only, no emoji.
- Framer Motion: page entrance only (`pageVariants`), not on every element.
- 375px first, desktop bonus.
- Supabase missing → demo mode, no crash.

---

## Screen 1: Landing `/`

### What This Screen Must Communicate

A judge opens this on their phone in 10 seconds. They must immediately see:
1. This is a health savings app for Indian families
2. Real rupee savings numbers — not vague promises
3. It works today, for free, in Hindi

### Design Direction

**Do not build a marketing landing page.** Build a product preview that happens to be the first screen.

Layout structure (top to bottom):
```
[Top bar: Sehat360 logo + Hindi/English toggle]
[Hero: bold savings number + family context]  
[Live product preview card]
[3 feature chips — horizontal scroll]
[CTA buttons]
[Trust strip]
```

### Implementation

**Top bar:**
- Left: `Sehat` in `text-brand-deepGreen font-bold` + `360` in `text-brand-saffron` — same size, inline
- Right: `LanguageToggle` component
- `bg-brand-smoke` (no card, no shadow — just the smoke background)

**Hero section:**
```
[Small badge: "Sama Social Hackathon 2025" — saffron pill]

"₹9,400 bachaye"          ← font-mono font-bold text-4xl text-brand-deepGreen
"ek Indian family ne"     ← text-brand-inkSoft text-base
"prescriptions scan karke, yojnaayein dhundh ke"  ← text-sm
```
Numbers must be real and prominent. This IS the headline, not a tagline.

**Product preview card:**
A `bg-white border border-brand-border rounded-2xl shadow-card p-4` card showing a mini-dashboard:

```
Row 1: [Green dot] "Dawai mein bacha: ₹332/mahina"   [→]
Row 2: [Saffron dot] "2 Yojnaayen mili: PM-JAY, PMMVY" [→]  
Row 3: [Blue dot] "Arjun ka vaccine due: Hep B Booster" [→]
```

This is real data from `MOCK_WALLET` and `MOCK_REMINDERS`. Make it look like a screenshot of the actual app.

**Feature chips (horizontal scroll, no scrollbar):**
```
[💊 Dawai Bachat] [🏛 Sarkari Yojnaayein] [🤰 Pregnancy Care] [💉 Vaccines]
```
Use Lucide icons (Pill, Building2, HeartPulse, Syringe), not emoji. Chips are `bg-brand-lightGreen text-brand-deepGreen rounded-full px-3 py-1.5 text-sm`.

**CTAs:**
- Primary: `bg-brand-deepGreen text-white rounded-xl w-full py-3` → `/onboarding` — "Shuru karein — free hai"
- Secondary: `border border-brand-border rounded-xl w-full py-3` → `/login` — "Login karein"

**Trust strip (4 items, horizontal, centered):**
```
✓ Bilkul free  |  ✓ Hindi + English  |  ✓ No ads  |  ✓ Demo mode
```
Use `CheckCircle` (size 14) in deepGreen, `text-brand-inkSoft text-xs`.

### Landing Animation

```tsx
// Only the hero number gets a count-up animation
// Rest uses pageVariants (fade + slide up, 0.25s)
// Product preview card: slight delay (0.15s stagger)
```

### Landing i18n Keys to Add

```ts
'landing.badge': 'Sama Social Hackathon 2025',
'landing.heroSaving': '₹{amount} bachaye',
'landing.heroContext': 'ek Indian family ne',
'landing.heroDesc': 'prescriptions scan karke, yojnaayein dhundh ke',
'landing.savingRow': 'Dawai mein bacha',
'landing.schemesRow': 'Yojnaayen mili',
'landing.vaccineRow': 'Vaccine due',
'landing.ctaPrimary': 'Shuru karein — free hai',
'landing.ctaSecondary': 'Login karein',
'landing.trustFree': 'Bilkul free',
'landing.trustLang': 'Hindi + English',
'landing.trustNoAds': 'No ads',
'landing.trustDemo': 'Demo mode',
```

### Landing Acceptance

- [ ] Hero number is large, mono, deep green — immediately visible
- [ ] Product preview card uses real mock data (not static "₹9,400" text)
- [ ] Feature chips scroll horizontally without overflow
- [ ] Both CTA buttons visible without scrolling on 375x812
- [ ] Language toggle works on landing
- [ ] No generic marketing hero image/gradient

---

## Screen 2: Login `/login`

### Design

Centered card, max-width 390px, on smoke background.

**Layout:**
```
[Back arrow → /]
[Brand: Sehat360]
[Subtitle: "Apna phone number se login karein"]
[Mode toggle: Phone OTP | Email]
[Form]
[Demo button — if !isSupabaseConfigured]
```

### Phone OTP Flow

**Step 1 — Enter number:**
```tsx
// +91 prefix chip (non-editable) + 10-digit input inline
// Input: bg-white border border-brand-border rounded-xl h-12 pl-16 text-[16px] font-mono
// "+91" shown as absolute positioned label inside input
// Zod: .regex(/^\d{10}$/)
// Button: "OTP bhejo" — full width, deepGreen
```

**Step 2 — Enter OTP (after send):**

Six individual digit inputs in a row. Each is:
```tsx
// w-10 h-12 text-center text-xl font-mono border border-brand-border rounded-xl
// Focus: border-brand-deepGreen ring-1 ring-brand-deepGreen
// Auto-advance to next input on digit entry
// Backspace focuses previous input
// Paste fills all 6 at once
```

**OTP controls below 6 boxes:**
- "Verify karein" button — full width, deepGreen
- "Resend" with countdown: "30s mein dobara bhejo" → after 30s → "Dobara bhejo" link
- In demo mode: small note "Demo mein koi bhi 6 number daalo"

**Demo mode behavior:**
- Any 6-digit OTP = success
- Navigate to `/onboarding` (or `/dashboard` if profile exists in store)
- No Supabase call

**Supabase mode behavior:**
```ts
// Send: supabase.auth.signInWithOtp({ phone: '+91' + number })
// Verify: supabase.auth.verifyOtp({ phone, token, type: 'sms' })
// On success: check if profiles row exists → /dashboard or /onboarding
```

### Email Mode

Toggle between Phone OTP and Email. Email mode shows:
```tsx
// Single email input
// Button: "Magic link bhejo"
// Supabase: supabase.auth.signInWithOtp({ email })
// Demo: show success Alert with "Dashboard dekho" button → /onboarding
```

### Error Handling

All errors go in a Shadcn `Alert` with `AlertCircle` icon above the form:
```tsx
// bg-brand-dangerLight border-brand-danger/20 text-brand-danger
// Errors: invalid_number, invalid_otp, network_error, supabase_error
// Each has a specific Hindi message — not "Something went wrong"
```

### Demo Bypass Button

When `!isSupabaseConfigured`, show at bottom of card:
```tsx
// A ghost button: "Demo mein seedha jayein →"
// bg-brand-lightGreen text-brand-deepGreen rounded-xl
// Navigates to /onboarding, sets demo user in store
```

### Login i18n Keys

```ts
'login.title': 'Sehat360 mein login karein',
'login.subtitle': 'Apna phone number se continue karein',
'login.phoneLabel': 'Mobile number',
'login.phonePlaceholder': '10 digit number',
'login.sendOtp': 'OTP bhejo',
'login.enterOtp': 'OTP daalo',
'login.otpSentTo': '+91 {number} pe OTP bheja',
'login.verify': 'Verify karein',
'login.resendIn': '{seconds}s mein dobara bhejo',
'login.resend': 'Dobara bhejo',
'login.demoNote': 'Demo mein koi bhi 6 number daalo',
'login.switchEmail': 'Email se login karein',
'login.switchPhone': 'Phone se wapas',
'login.emailLabel': 'Email address',
'login.sendMagicLink': 'Magic link bhejo',
'login.demoBypass': 'Demo mein seedha jayein',
'login.error.invalidPhone': 'Sahi 10 digit number daalo',
'login.error.invalidOtp': 'OTP galat hai, dobara try karein',
'login.error.network': 'Network error — internet check karein',
```

### Login Acceptance

- [ ] Phone number validates exactly 10 digits
- [ ] +91 prefix shows but is not editable
- [ ] 6 OTP boxes auto-advance
- [ ] Paste works on OTP
- [ ] Resend countdown works
- [ ] Demo mode bypasses Supabase
- [ ] Demo bypass button navigates correctly
- [ ] Error Alert shows for invalid input
- [ ] Loading state disables button

---

## Screen 3: Onboarding `/onboarding`

3-step wizard. No bottom nav. Progress indicator at top.

### Step Indicator

```tsx
// 3 circles connected by lines
// Done: bg-brand-deepGreen, white CheckCircle icon inside
// Active: border-2 border-brand-deepGreen, step number inside
// Pending: bg-white border border-brand-border, step number (muted)
// Lines between: bg-brand-border (pending) → bg-brand-midGreen (done)
// Labels below each: "Profile" | "Features" | "Taiyaar"
```

### Step 1: Profile Setup

Title: "Aapke baare mein batayein"

Fields (stacked, full width):

```
Name*           → Input, placeholder "Meena Sharma"
City*           → Input, placeholder "Indore"  
State*          → Shadcn Select, all Indian states
Age*            → Input type="number" min=13 max=100
Language        → Two toggle buttons: हिन्दी | English (same as LanguageToggle)
```

**Validation (Zod):**
```ts
z.object({
  name: z.string().min(2, 'Naam kam se kam 2 akshar ka ho'),
  city: z.string().min(2, 'Sheher ka naam daalo'),
  state: z.string().min(1, 'State chunein'),
  age: z.number().min(13).max(100),
})
```

Language change immediately updates i18next (user sees UI change in real time).

Indian states list — all 28 states + 8 UTs, in Hindi names when language is Hindi.

**CTA:** Fixed bottom button "Aage" → goes to Step 2.

### Step 2: Feature Selection

Title: "Kya chahiye aapko?"
Subtitle: "Jo kaam aayega woh chunein — baad mein badal sakte hain"

5 feature cards in a 2-column grid:

```tsx
// Each card: bg-white border-2 border-brand-border rounded-2xl p-4
// Selected: border-brand-deepGreen bg-brand-lightGreen
// Card structure:
//   [Icon in colored circle] [Checkbox top-right]
//   [Feature name: font-semibold]
//   [One-line description: text-sm text-brand-inkSoft]
```

Feature cards:

| Feature | Icon | Circle color | Description |
|---|---|---|---|
| Dawai Bachat | Pill | `bg-brand-lightGreen` | Prescription scan karke generic alternatives |
| Sarkari Yojnaayein | Building2 | `bg-brand-blueLight` | PM-JAY, PMMVY, JSY eligibility check |
| Pregnancy Care | HeartPulse | `bg-brand-pinkLight` | Week tracker, checkup reminders |
| Vaccination | Syringe | `bg-brand-saffronLight` | Bachche ke vaccines track karein |
| Health Jaankari | BookOpen | `bg-brand-lightGreen` | Hindi health articles |

Rules:
- Tapping anywhere on card toggles it
- At least 1 must be selected — show toast/inline error if user tries to unselect last one
- Default: prescription + schemes + vaccination + awareness selected; pregnancy off

**CTA:** Fixed bottom button "Aage" → Step 3.

### Step 3: Ready

Animation entrance: `CheckCircle` icon scales in with spring animation.

Content:
```
[Large CheckCircle, 64px, brand-deepGreen, spring scale animation]
"Sab taiyaar hai, {name}!" 
"Aapne {count} features chunein"

[Selected feature pills — horizontal scroll]
[Pill: icon + name, bg-brand-lightGreen rounded-full px-3 py-1 text-sm]

"App kholein aur shuru karein:"
• Dawai scan karein aur paise bachayein  
• Sarkari yojnaayein dhundhein
• Family ki health manage karein — ek jagah

[CTA: "Dashboard dekhein" → /dashboard, full width, deepGreen]
```

**On submit (CTA click):**
```ts
// 1. Update Zustand: setProfile({ name, city, state, age, language, features })
// 2. If isSupabaseConfigured && user logged in:
//    await supabase.from('profiles').upsert({ id: user.id, ...profileData })
// 3. In demo mode: just update store, isDemo stays true
// 4. Navigate to /dashboard
```

### Transitions Between Steps

```tsx
// Use AnimatePresence + motion.div
// Step entering: x: 20 → x: 0, opacity 0 → 1 (0.2s)
// Step leaving: x: 0 → x: -20, opacity 1 → 0 (0.15s)
// No spring here — simple ease
// Respect prefers-reduced-motion: skip animation if reduced
```

### Fixed Bottom CTA Pattern

All 3 steps have a fixed bottom CTA that doesn't scroll away:

```tsx
// Fixed: bottom-0, full width up to max-shell
// bg-brand-smoke/95 backdrop-blur-sm, pt-3 pb-[env(safe-area-inset-bottom,16px)]
// Border-top: border-t border-brand-border
// Button inside: w-full
// IMPORTANT: form fields must have enough pb-32 to not hide behind this
```

### Onboarding i18n Keys

```ts
'onboarding.step1.title': 'Aapke baare mein batayein',
'onboarding.step1.nameLabel': 'Aapka naam',
'onboarding.step1.cityLabel': 'Sheher',
'onboarding.step1.stateLabel': 'State',
'onboarding.step1.ageLabel': 'Aayu',
'onboarding.step1.languageLabel': 'Bhasha',
'onboarding.step2.title': 'Kya chahiye aapko?',
'onboarding.step2.subtitle': 'Jo kaam aayega woh chunein',
'onboarding.step3.title': 'Sab taiyaar hai, {name}!',
'onboarding.step3.subtitle': 'Aapne {count} features chunein',
'onboarding.step3.cta': 'Dashboard dekhein',
'onboarding.steps.profile': 'Profile',
'onboarding.steps.features': 'Features',
'onboarding.steps.ready': 'Taiyaar',
'onboarding.error.minFeatures': 'Kam se kam ek feature chunein',
// Add all Zod validation messages too
```

### Onboarding Acceptance

- [ ] Step indicator shows correct state for each step
- [ ] Name/city/state/age validate with Hindi messages
- [ ] State select has all Indian states
- [ ] Language toggle on Step 1 changes UI language immediately
- [ ] Feature cards toggle with tap on entire card
- [ ] Last selected feature cannot be deselected
- [ ] Step transitions animate (or skip cleanly with reduced-motion)
- [ ] Fixed CTA does not cover form fields
- [ ] On finish: Zustand has profile and features
- [ ] Supabase upsert attempted when configured
- [ ] Navigates to /dashboard after finish

---

## Final Verification

```bash
npm run build   # zero TypeScript errors
```

Manual at 375px:
- [ ] Landing CTA buttons both visible without scroll
- [ ] Login OTP boxes fit in one row
- [ ] Onboarding fixed CTA doesn't hide fields
- [ ] No horizontal overflow on any screen
