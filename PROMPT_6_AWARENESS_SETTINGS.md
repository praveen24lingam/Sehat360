# SEHAT360 — PROMPT 6
## Awareness, Settings, Final Polish, Ship

Read `AGENTS.md`. Prompts 1–5 are complete.

This is the final prompt. Build Awareness and Settings, then do a full quality pass across the entire app.

---

## Awareness `/awareness`

Purpose: trusted health content in Hindi. Not a blog. Not a medical reference. Simple, readable, trustworthy.

### Data

Use `awarenessArticles` from `src/data/awarenessArticles.ts`.
Language is from Zustand store — display `article.title[language]` and `article.content[language]`.

---

### Page Header

```tsx
// PageHeader:
//   title: "Health Jaankari"
//   subtitle: "Trusted health tips Hindi mein"
//   showBack: false
//   rightSlot: <LanguageToggle />
```

---

### Search Bar

```tsx
// Sticky below PageHeader (sticky top-[52px+height_of_header])
// bg-brand-smoke/95 backdrop-blur-sm px-4 py-2
//
// Input:
//   bg-white border border-brand-border rounded-xl
//   pl-10 (for search icon) h-10
//   [Search icon, absolute left-3, brand-inkSoft, size=16]
//   placeholder: "Articles dhundhen..."
//
// Debounce 300ms before filtering
// Searches: title[language], summary[language], category
```

---

### Category Pills

```tsx
// Horizontal scroll, no visible scrollbar
// Sticky below search bar
// bg-brand-smoke/95 backdrop-blur-sm px-4 py-2
//
// Pills: ['all', 'periods', 'pregnancy', 'anaemia', 'nutrition', 'newborn', 'vaccination', 'mentalHealth', 'phc']
//
// Each pill:
//   Active: bg-brand-deepGreen text-white rounded-full px-3 py-1.5 text-sm font-medium
//   Inactive: bg-white border border-brand-border text-brand-inkSoft rounded-full px-3 py-1.5 text-sm
//
// 'all' pill always first
// Clicking filters article list + clears search
```

---

### Article List

Filter logic:
```ts
const filtered = articles.filter(article => {
  const matchesSearch = searchQuery
    ? article.title[language].toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.summary[language].toLowerCase().includes(searchQuery.toLowerCase())
    : true
  const matchesCategory = activeCategory === 'all' || article.category === activeCategory
  return matchesSearch && matchesCategory
})
```

**Layout: Single column at 375px (always — titles are long, 2-col causes overflow).**

Each article card:
```tsx
// bg-white border border-brand-border rounded-2xl overflow-hidden
// Framer Motion: staggerChildren 0.05s on list
//
// Top color bar (4px height):
//   article.tone determines color:
//   green → brand-lightGreen, pink → brand-pinkLight, 
//   red → brand-dangerLight, saffron → brand-saffronLight, blue → brand-blueLight
//
// Card body p-4:
//   Row 1: category badge + read time ("3 min")
//   Row 2: article.title[language] text-base font-semibold (2-line max)
//   Row 3: article.summary[language] text-sm text-brand-inkSoft (3-line max)
//   Bottom: [Lucide icon for article.icon] + "Padhein →" text-brand-deepGreen text-sm font-medium
```

Empty state (no results):
```tsx
// EmptyState: Search icon, "Koi article nahi mila", "Search band karein"
```

---

### Article Detail

Use Shadcn `Sheet` (from bottom) instead of a separate route — simpler and better on mobile.

```tsx
// When article card tapped → open Sheet
// Sheet snap: 90% viewport height, scrollable inside
//
// Sheet header:
//   category badge + read time
//   title font-bold text-xl (localized)
//   Share button (Web Share API or clipboard)
//   Close button (already in Shadcn Sheet)
//
// Sheet body (scrollable):
//   content[language].map(paragraph => <p className="text-base leading-relaxed mb-4">{paragraph}</p>)
//
// Sheet footer (sticky inside sheet):
//   bg-brand-blueLight rounded-xl p-3
//   "Yeh sirf jaankari hai, doctor ki salaah nahi. Kisi bhi takleef mein PHC jayein."
//   text-xs text-brand-blue
```

---

### Awareness i18n Keys

```ts
'awareness.title': 'Health Jaankari',
'awareness.subtitle': 'Trusted health tips Hindi mein',
'awareness.search': 'Articles dhundhen...',
'awareness.category.all': 'Sab',
'awareness.category.periods': 'Periods',
'awareness.category.pregnancy': 'Pregnancy',
'awareness.category.anaemia': 'Khoon ki kami',
'awareness.category.nutrition': 'Khana-Peena',
'awareness.category.newborn': 'Naya Bachcha',
'awareness.category.vaccination': 'Vaccines',
'awareness.category.mentalHealth': 'Mental Health',
'awareness.category.phc': 'PHC Visit',
'awareness.readTime': '{n} min',
'awareness.read': 'Padhein',
'awareness.empty': 'Koi article nahi mila',
'awareness.emptyAction': 'Search band karein',
'awareness.disclaimer': 'Yeh sirf jaankari hai, doctor ki salaah nahi. Kisi bhi takleef mein PHC jayein.',
```

---

### Awareness Acceptance

- [ ] Search filters correctly
- [ ] Category pills filter correctly
- [ ] Article language changes when LanguageToggle is used
- [ ] Article detail Sheet opens and is scrollable
- [ ] Share works (Web Share API + clipboard fallback)
- [ ] Medical disclaimer visible in article detail
- [ ] Single-column layout on 375px — no text clipping
- [ ] Empty state shows when no results

---

## Settings `/settings`

Purpose: profile, feature control, family members, language.
This is a utility screen — functional, not decorative.

---

### Page Header

```tsx
// PageHeader:
//   title: "Settings"
//   showBack: false
```

---

### Section 1: Profile Card

```tsx
// bg-white border border-brand-border rounded-2xl p-4
//
// Left: Avatar circle — initials, 48px, bg-brand-lightGreen text-brand-deepGreen font-bold text-lg
// Right:
//   Name font-semibold
//   City, State text-sm text-brand-inkSoft
//   Row: "Age: {age}" | "Language: {hi/en}"
//   Row (small stats): "{prescriptionCount} prescriptions" | "₹{savings} bachaye" | "{schemesCount} yojnaayein"
//
// "Edit" button (right side, ghost style) → opens Shadcn Dialog
```

**Edit Profile Dialog:**
```tsx
// Shadcn Dialog
// Fields: Name*, City*, State (Select)*, Age*
// On save: updateProfile(patch) + Supabase upsert if configured
// Validation: same Zod schema as onboarding Step 1
```

---

### Section 2: Features

Title: "Features"
Subtitle: "Band karne se Dashboard se hide ho jayega"

```tsx
// FeatureToggleRow for each feature
// Last-one-enabled protection already in FeatureToggleRow
// Immediate Zustand update on toggle
// Small note below section: "Features baad mein bhi badal sakte hain"
```

Feature rows with icon, title, description:

| Feature | Icon | Tone | Description |
|---|---|---|---|
| Dawai Bachat | Pill | green | Generic aur Jan Aushadhi alternatives |
| Sarkari Yojnaayein | Building2 | blue | PM-JAY, PMMVY, JSY eligibility |
| Pregnancy Care | HeartPulse | pink | Week tracker, checkup reminders |
| Vaccination | Syringe | saffron | Bachche ke vaccines ka hisaab |
| Health Jaankari | BookOpen | green | Hindi health articles |

---

### Section 3: Family Members

Title: "Parivaar"
Right: "Add karein" button (ghost) → opens Add Member Dialog

```tsx
// List of family members from store
// Each row:
//   Avatar initials (40px, toned by relation:
//     self: deepGreen, spouse: blue, child: saffron, parent: pink)
//   Name + relation badge
//   Context: age in months (child), pregnancy week (if pregnant), age in years (parent)
//   Edit icon → Edit Member Dialog
//   Delete icon → confirm dialog (cannot delete 'self')
```

**Add/Edit Member Dialog:**
```tsx
// Fields:
//   Name* → Input
//   Relation* → button group: Self | Spouse | Child | Parent | Other
//   Date of Birth → Input type="date"
//   Gender → button group: Male | Female
//   Pregnant? → Switch (show only if relation !== 'child')
//   LMP Date or Pregnancy Week → show only if isPregnant === true
//     Two options: "LMP date jaanti hain" (date input) or "Week pata hai" (number input)
//
// On save:
//   If child + DOB → available for Vaccination
//   If pregnant + LMP → available for Mother Care
//   Update store + Supabase if configured
```

---

### Section 4: Language

```tsx
// Two large equal-width buttons side by side
// Active: bg-brand-deepGreen text-white border-2 border-brand-deepGreen
// Inactive: bg-white border-2 border-brand-border text-brand-ink
//
// हिन्दी | English
//
// On select:
//   setLanguage(lang) in store
//   next-intl locale change
//   Supabase profile update if configured
```

---

### Section 5: App Settings

```tsx
// List rows (same style as FeatureToggleRow but without switch):
//
// [Bell icon] Notifications → Toggle Switch (local only, no backend for MVP)
//
// [Shield icon] Privacy & Data → tap to expand inline or small Sheet:
//   "Data kahan jaata hai: Demo mode mein sirf aapke phone pe. Supabase configure hone pe encrypted cloud pe."
//   "Hum kabhi bhi data bechte nahi hain."
//
// [Share2 icon] App Share → Web Share / clipboard fallback
//   Share text: "Sehat360 — free family health app. Prescriptions scan karo, paise bachao. sehat360.vercel.app"
//
// [Info icon] About → Shadcn Dialog:
//   Sehat360 v1.0
//   "Sama Social — Build for Good Bharat"
//   "MERN Stack developer ke saath banaya"
//   Build date
//
// [LogOut icon] Logout (text-brand-danger):
//   Shadcn Dialog: "Logout karein?"
//   On confirm:
//     if isSupabaseConfigured: supabase.auth.signOut()
//     clearStore() (reset to initial demo state)
//     router.push('/')
```

---

### Section 6: Version Footer

```tsx
// Center aligned, text-brand-inkSoft text-xs
// py-8
//
// Sehat360 v1.0
// Sama Social — Build for Good Bharat 2025
// "Apni sehat ka poora hisaab, ek jagah"
```

---

### Settings i18n Keys

```ts
'settings.title': 'Settings',
'settings.profileTitle': 'Profile',
'settings.featuresTitle': 'Features',
'settings.featuresSubtitle': 'Band karne se Dashboard se hide ho jayega',
'settings.featuresNote': 'Features baad mein bhi badal sakte hain',
'settings.familyTitle': 'Parivaar',
'settings.addMember': 'Add karein',
'settings.languageTitle': 'Bhasha',
'settings.appTitle': 'App Settings',
'settings.notifications': 'Notifications',
'settings.privacy': 'Privacy & Data',
'settings.shareApp': 'App share karein',
'settings.about': 'App ke baare mein',
'settings.logout': 'Logout karein',
'settings.logoutConfirm': 'Sach mein logout karein?',
'settings.logoutNote': 'Demo data hata diya jayega',
'settings.version': 'Sehat360 v1.0',
'settings.hackathon': 'Sama Social — Build for Good Bharat 2025',
'settings.member.add': 'Family member add karein',
'settings.member.edit': 'Member edit karein',
'settings.member.delete': 'Member hatayein',
'settings.member.deleteConfirm': 'Sach mein {name} ko hatayein?',
'settings.member.relation.self': 'Main',
'settings.member.relation.spouse': 'Patni/Pati',
'settings.member.relation.child': 'Bachcha',
'settings.member.relation.parent': 'Maa-Baap',
'settings.member.relation.other': 'Aur',
'settings.privacyTitle': 'Privacy & Data',
'settings.privacyDemo': 'Demo mode mein data sirf aapke phone pe rehta hai.',
'settings.privacySupabase': 'Supabase configure hone pe encrypted cloud pe.',
'settings.privacyNoSell': 'Hum kabhi bhi data bechte nahi hain.',
```

---

### Settings Acceptance

- [ ] Profile edit dialog saves and reflects immediately
- [ ] Feature toggles update dashboard behavior (test by going to /dashboard)
- [ ] Cannot turn off all features (last toggle disabled)
- [ ] Add family member dialog saves child correctly (available in /vaccination)
- [ ] Add family member dialog saves pregnant member correctly (available in /mother-care)
- [ ] Language change persists after page refresh
- [ ] Logout navigates to / and clears store (demo data reloads on next open)
- [ ] No overflow at 375px

---

## Final Polish Pass

After building both screens, do a full audit:

### Navigation Audit

```bash
# Check every link in the app:
# BottomNav → 5 tabs navigate correctly
# MoreSheet → Wallet, Awareness, Settings
# CareSwitcher → MotherCare, Vaccination
# Dashboard → all quick actions
# Dashboard reminders → linked routes
# PageHeader back buttons → navigate(-1) or /dashboard fallback
# All "Settings mein jayein" EmptyState buttons
# All "Scan karein" / "Check karein" CTAs
```

Verify:
- [ ] No dead links (every button/link navigates to a working page)
- [ ] Back button never leaves the app to browser chrome
- [ ] Care tab active on both /mother-care and /vaccination

### Feature Gate Audit

Test with features disabled:
1. Go to Settings, disable prescription
2. Go to /dashboard → Prescription quick action must be gone
3. Go to /prescription directly → EmptyState with enable CTA
4. Go to /wallet → Prescription stats hidden
5. Re-enable → everything reappears

- [ ] All 5 features gate correctly
- [ ] Direct URL access to disabled feature shows EmptyState, not 404 or broken page

### i18n Audit

```bash
# Search for any visible string not using useTranslations()
grep -rn "\"[A-Za-z]" src/app --include="*.tsx" | grep -v "className\|href\|id\|key\|aria\|import\|type\|interface"
# This will have false positives but review them
```

Manual check:
- [ ] Switch to English → entire app in English (no Hindi visible except demo data proper nouns)
- [ ] Switch back to Hindi → Hindi everywhere
- [ ] No translation key shows raw (e.g., "settings.title" literally on screen)

### Responsive Audit

Test at these widths:
- 375px (iPhone SE)
- 390px (iPhone 15)
- 430px (iPhone 15 Plus / max-shell)
- 768px (tablet)
- 1440px (desktop)

Check on each:
- [ ] No horizontal scroll
- [ ] Bottom nav visible and not floating off-screen
- [ ] Content not hidden behind bottom nav
- [ ] Dialogs/Sheets fit within viewport
- [ ] Text not overflowing cards
- [ ] On 768px+ → app shell centered, smoke background on sides

### Performance Audit

- [ ] Tesseract.js loaded only on /prescription (dynamic import)
- [ ] No Gemini calls on page load
- [ ] No geolocation on page load
- [ ] Images (if any) have width/height to prevent layout shift

### Accessibility Audit

Quick pass:
- [ ] All icon-only buttons have aria-label
- [ ] All form inputs have associated labels (not just placeholder)
- [ ] Shadcn Dialog closes on Escape
- [ ] Tab navigation works on main flows (Landing → Onboarding → Dashboard)

### PWA Audit

- [ ] `public/manifest.json` exists with correct fields
- [ ] `next/head` or metadata has manifest link
- [ ] Theme color `#1A6B4A` in HTML meta
- [ ] App can be installed via Chrome "Add to Home Screen"
- [ ] Icons exist in `public/icons/`

---

## Build and Ship Gate

```bash
npm run build
npm run lint
```

Both must pass with zero errors.

Then verify:
```bash
grep -r "Lorem\|TODO\|FIXME\|Coming soon\|coming soon\|placeholder text" src/
# Must return zero results
```

---

## Final Completion Checklist

### Screens (11/11)
- [ ] Landing — product preview, real data, works on mobile
- [ ] Login — OTP + demo bypass
- [ ] Onboarding — 3 steps, profile + features, saves to store
- [ ] Dashboard — real data, quick actions gated, reminders, family
- [ ] Prescription — OCR states, results with savings, demo mode
- [ ] Schemes — form, matching, scheme cards with documents
- [ ] Mother Care — week progress, checkups, AI chat
- [ ] Vaccination — vaccine list by status, mark done, PHC locator
- [ ] Awareness — search, category filter, article detail sheet
- [ ] Wallet — savings hero, stats, milestone list
- [ ] Settings — profile edit, feature toggles, family members, language

### Full-Stack (Demo + Live)
- [ ] App runs with no env vars (demo mode)
- [ ] App runs with Supabase + Gemini env vars (live mode)
- [ ] Supabase OTP login works
- [ ] Gemini medicine mapping works
- [ ] Gemini scheme matching works
- [ ] Gemini pregnancy chat works
- [ ] Tesseract OCR runs in browser
- [ ] Supabase save works for prescriptions
- [ ] Supabase RLS blocks cross-user access

### Quality
- [ ] `npm run build` passes
- [ ] `npm run lint` passes
- [ ] All text translated (Hindi + English match)
- [ ] No horizontal overflow at 375px
- [ ] No dead routes or broken navigation
- [ ] No Lorem ipsum or placeholder text
- [ ] No API keys in committed code
- [ ] PWA manifest and icons exist

### Demo Story Verified
A judge can:
1. Open app, see ₹9,400 savings on landing screen
2. Complete onboarding in < 60 seconds
3. See Dashboard with Meena's real data
4. Demo-scan a prescription, see 3 medicines with savings
5. Check schemes, get PM-JAY + PMMVY + JSY results
6. See pregnancy week 22 progress in Mother Care
7. See Arjun's overdue vaccine in Vaccination
8. Read a Hindi article in Awareness
9. See all data summarized in Wallet
10. Switch to English and back to Hindi
11. Recognize it as a PWA (installable)

---

## Deployment Notes

Vercel deployment:
```bash
# Add these in Vercel dashboard → Settings → Environment Variables:
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
GEMINI_API_KEY=
```

`GEMINI_API_KEY` is server-side only — never `NEXT_PUBLIC_`.

Vercel will auto-deploy on `git push` to main. Zero config needed.
