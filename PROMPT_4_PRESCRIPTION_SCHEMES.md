# SEHAT360 — PROMPT 4
## Prescription Savings Engine + Government Schemes Finder

Read `AGENTS.md`. Prompts 1–3 are complete.

These are the two strongest hackathon features. They must work end-to-end in demo mode and connect cleanly to Gemini and Supabase when configured.

---

## Prescription `/prescription`

Purpose: scan a family prescription, see exactly how much cheaper generics/Jan Aushadhi are, and save that data to the health wallet.

### State Machine

Use explicit state — do not mix states in a single boolean flag:

```ts
type ScanState = 'idle' | 'selected' | 'ocr' | 'mapping' | 'results' | 'error'
```

All state lives in `useState` within the page. Successful results are saved to Zustand (and Supabase if configured).

---

### State: idle

**Upload zone:**
```tsx
// Dashed border box: border-2 border-dashed border-brand-border rounded-2xl p-8
// bg-white, centered content
//
// [ScanLine icon, size=40, text-brand-midGreen]
// "Prescription ki photo lein ya chunein"  ← h3 font-semibold
// "Supabase ya Tesseract se text padha jayega" ← text-xs text-brand-inkSoft
//
// Two buttons side by side:
//   [Camera icon] "Photo kheinchein"   → accept="image/*" capture="environment"
//   [Upload icon] "File chunein"       → accept="image/*,application/pdf"
//
// Below: "JPG, PNG, PDF — max 10MB" text-[11px] text-brand-inkSoft
//
// Drag and drop support: onDragOver/onDrop on the zone
// When dragging: border-brand-deepGreen bg-brand-lightGreen (subtle highlight)
```

**How it works (3 steps, compact):**
```tsx
// Above the upload zone, 3 steps in a single horizontal row:
// [1] Camera icon → [2] ScanText icon → [3] IndianRupee icon
// Each: icon in circle + one-line label
// Step numbers: small muted bg circles, left-aligned
// Keep this compact — it should not dominate the page
```

**Previous prescriptions (below upload):**
```tsx
// Title: "Pichhli prescriptions" + count badge
// Load from store.prescriptions
// Each row: compact — date, medicine count, saving
// If none: small EmptyState (not full-page — just a short note)
```

---

### State: selected (file chosen, not yet scanned)

```tsx
// Remove upload zone, show file preview card:
// bg-white border border-brand-border rounded-2xl p-4
//
// [File icon or image thumbnail (if image)]
// File name (truncated with ellipsis)
// File size in KB/MB
// File type badge
//
// Two buttons:
//   "Scan shuru karein" → starts OCR → bg-brand-deepGreen text-white w-full
//   "Doosri file chunein" → back to idle → ghost button
```

---

### State: ocr (Tesseract running)

```tsx
// Animated scan card:
// bg-white border border-brand-border rounded-2xl p-5
// [Animated ScanLine icon — use CSS animation, not Framer (simpler)]
//
// Step list (3 items):
//   ✓ "Photo load ho gayi"     ← completed green check
//   ⟳ "Text padha ja raha hai — {percent}%"  ← active, loading spinner
//   ○ "Dawaaiyon ke naam dhundhna"  ← pending, muted
//
// Progress bar below step list:
//   bg-brand-lightGreen rounded-full h-1.5
//   Fill: bg-brand-midGreen, width controlled by percent state
//
// Percent comes from Tesseract onProgress callback
```

---

### State: mapping (Gemini/fallback running)

```tsx
// Collapsed OCR text preview:
//   "Padha gaya text:" + small eye icon to expand
//   Collapsed by default (text can be garbled — don't show by default)
//   Expand: shows raw text in monospace bg-gray-50 rounded-xl p-3 text-xs max-h-32 overflow-y-auto
//
// Main card:
//   [Sparkles icon, brand-saffron] "Generic alternatives dhundh rahe hain..."
//   If isGeminiConfigured: "Gemini AI se" badge (purple/blue)
//   If not: "Demo data se" badge (green)
//   Subtle pulse animation on the Sparkles icon
```

---

### State: results

This is the most important UI state. Make it feel like a win.

**Results header:**
```tsx
// bg-brand-lightGreen border border-brand-border rounded-2xl p-4
//   [CheckCircle icon, brand-deepGreen]
//   "{count} dawaiyaan mili"
//   Confidence: "High confidence" | "Medium" based on avg confidence
```

**Savings summary (the highlight):**
```tsx
// bg-gradient-to-br from-brand-deepGreen to-brand-midGreen rounded-2xl p-5 text-white
//   "Is prescription se bachat:"
//   ₹{totalMonthlySaving}/mahina   ← font-mono font-bold text-3xl
//   "₹{totalYearlySaving}/saal"    ← font-mono text-lg text-white/80
//   "Jan Aushadhi generic alternatives" ← text-white/60 text-xs
```

**Medicine list:**
```tsx
// Use MedicineCard component, expanded=true
// Each MedicineCard:
//
//   Header (always visible):
//   Left: brandName font-semibold + dosage badge
//   Right: saving badge "₹{saving}/mahina" bg-brand-saffron text-white rounded-full
//
//   Body (expanded):
//   Two-column comparison:
//     Brand side: brandName, ₹{brandPrice}, "MRP" label
//     Generic side: saltName, ₹{genericPrice} text-brand-deepGreen font-bold, "Jan Aushadhi" label
//   Center: arrow → or vs divider
//   Bottom: confidence badge "Gemini: 92% confident" or "Catalog match"
//
// Cards are stacked with gap-3
// Framer Motion: staggerChildren 0.06s on the list
```

**Safety note:**
```tsx
// bg-brand-blueLight border border-brand-blue/20 rounded-xl p-3
// [AlertCircle icon, brand-blue, size=16]
// "Doctor ya pharmacist se confirm karna zaroori hai pehle medicine badalne se"
// text-xs text-brand-blue
// This must be visible — do not hide it below the fold
```

**Actions row:**
```tsx
// Four compact action buttons (2x2 grid or horizontal scroll):
// [Save karein] → saves to store + Supabase
// [Jan Aushadhi store dhundhen] → opens maps
// [Yojnaayein check karein] → /schemes
// [Doosra scan karein] → back to idle
```

---

### State: error

```tsx
// ErrorState component
// Common errors with specific messages:
//   'ocr_failed': "Image clearly nahi dikh raha — doosri photo try karein"
//   'mapping_failed': "Mapping error — demo data use kar rahe hain"
//   'save_failed': "Save nahi hua — net check karein"
// Always show "Dobara try karein" button
```

---

### Demo Mode

When Gemini is not configured, `mapMedicinesFromText` returns:
```ts
// The 3 medicines from MOCK_PRESCRIPTION (Glycomet, Lipitor, Deplatt)
// source: 'fallback'
// Show "Demo data" badge in results
```

The user must not feel like demo mode is broken — it should feel like a working preview.

---

### Prescription i18n Keys

```ts
'prescription.title': 'Dawai Bachat',
'prescription.subtitle': 'Prescription scan karein, paise bachayein',
'prescription.uploadTitle': 'Prescription ki photo lein ya chunein',
'prescription.uploadSubtitle': 'Tesseract se text padha jayega',
'prescription.camera': 'Photo kheinchein',
'prescription.upload': 'File chunein',
'prescription.fileLimit': 'JPG, PNG, PDF — max 10MB',
'prescription.startScan': 'Scan shuru karein',
'prescription.changeFile': 'Doosri file chunein',
'prescription.ocr.step1': 'Photo load ho gayi',
'prescription.ocr.step2': 'Text padha ja raha hai — {percent}%',
'prescription.ocr.step3': 'Dawaaiyon ke naam dhundhna',
'prescription.mapping.title': 'Generic alternatives dhundh rahe hain...',
'prescription.mapping.gemini': 'Gemini AI se',
'prescription.mapping.demo': 'Demo data se',
'prescription.results.found': '{count} dawaiyaan mili',
'prescription.results.saving': 'Is prescription se bachat:',
'prescription.results.monthly': '₹{amount}/mahina',
'prescription.results.yearly': '₹{amount}/saal',
'prescription.disclaimer': 'Doctor ya pharmacist se confirm karna zaroori hai pehle medicine badalne se',
'prescription.action.save': 'Save karein',
'prescription.action.janAushadhi': 'Jan Aushadhi store dhundhen',
'prescription.action.schemes': 'Yojnaayein check karein',
'prescription.action.scanAnother': 'Doosra scan karein',
'prescription.history.title': 'Pichhli prescriptions',
'prescription.error.ocrFailed': 'Image clearly nahi dikh raha — doosri photo try karein',
'prescription.error.mappingFailed': 'Mapping error — demo data use kar rahe hain',
```

### Prescription Acceptance

- [ ] File selection via camera and file picker works
- [ ] Drag and drop changes zone appearance
- [ ] OCR states appear in sequence with real progress
- [ ] Results savings hero is green gradient (only green gradient on this page)
- [ ] Medicine cards show brand vs generic comparison clearly
- [ ] Safety note is visible in results
- [ ] Demo mode returns mock medicines (not empty results)
- [ ] Save stores to Zustand, Supabase attempted if configured
- [ ] Error state has specific message, not generic
- [ ] No horizontal overflow at 375px on medicine cards

---

## Schemes `/schemes`

Purpose: answer 7 simple questions → get matched government schemes with documents and apply instructions.

### Layout

```
[PageHeader]
[Trust banner]
[Eligibility form]
  → [Loading state]
  → [Results]
```

---

### Trust Banner

```tsx
// bg-white border border-brand-border rounded-2xl p-4 mb-4
// [Building2 icon in blue circle]
// "Sarkari yojnaayein aapke liye"
// "PM-JAY, PMMVY, JSY, Jan Aushadhi — free mein check karein"
// Small note: "Sirf guidance hai — final approval sarkari documents pe depend karta hai"
// text-xs text-brand-inkSoft
```

---

### Eligibility Form

Use React Hook Form + Zod.

Pre-fill from store: `profile.state`, family data (pregnancy, children, age).

```tsx
// 7 fields, visually grouped into 2–3 sections:

// Section 1: Location & Income
//   State (Select — pre-filled from profile)
//   Monthly income (Select options): 
//     "₹0–5,000", "₹5,001–10,000", "₹10,001–25,000", "₹25,001 se zyada"

// Section 2: Ration Card & Schemes
//   Ration card type (big button group, not select):
//     [APL] [BPL] [Antyodaya (AAY)] [Nahi hai]
//     Active: bg-brand-deepGreen text-white, Inactive: bg-white border
//   Ayushman card (button group): [Hai] [Nahi hai] [Pata nahi]

// Section 3: Family
//   Pregnant member? (Toggle switch — Shadcn Switch)
//   Children under 5 (stepper: - [count] +, min 0 max 10)
//   Senior citizen in family? (Toggle switch)
```

**Button group pattern:**
```tsx
// Replaces Select for 3-5 options on mobile
// Each option: rounded-xl border px-3 py-2 text-sm
// Looks like a segmented control
// Much better UX than dropdowns for binary/trinary choices
```

**Form CTA:**
```tsx
// Sticky bottom button (same pattern as onboarding)
// "Yojnaayein dhundho" → triggers matchSchemes
// Full width, bg-brand-deepGreen, rounded-xl
// Loading: spinner + "Dhundh rahe hain..."
```

---

### Matching Loading State

```tsx
// Replace form with loading card:
// [Building2 icon spinning-ish or Loader2 icon]
// "Aapki eligibility check ho rahi hai..."
// If isGeminiConfigured: "Gemini se" badge
// If not: "Sarkari rules se" badge
// Don't show this for > 2s in demo mode
```

---

### Results

**Summary bar:**
```tsx
// Row: "{eligibleCount} eligible" (green badge) + "{likelyCount} likely" (saffron) + "{checkCount} check karein" (blue)
// Appears above scheme cards
// "Naye sawaalon se dobara check karein" link → resets to form
```

**Scheme cards (SchemeCard expanded):**
```tsx
// Each SchemeCard:
//
// Header (always visible):
//   Status badge: "Eligible ✓" (deepGreen), "Likely →" (saffron), "Check karein" (blue)
//   Scheme name font-semibold
//   Benefit pill: "₹5,00,000/saal" or "₹5,000 ek baar"
//
// Body (expandable, default expanded on mobile for top match):
//   "Kyun mili?" section: reason text (Hindi from store.matchedSchemes)
//   "Documents chahiye:" — bullet list
//   "Apply kahan karein:" — location text
//   "Official site →" link (opens in new tab, rel="noopener")
//
// Framer Motion: staggerChildren on cards list
```

**Action guide (below all scheme cards):**
```tsx
// bg-brand-lightGreen border border-brand-border rounded-2xl p-4
// [MapPin icon] "Najdeeki PHC/Anganwadi dhundhen"
// Button: opens Google Maps "primary health centre near me"
// [FileText icon] "Documents ready rakhein"
// Short checklist of common documents (Aadhaar, Ration Card, Income Certificate)
```

**Disclaimer:**
```tsx
// bg-brand-blueLight border border-brand-blue/20 rounded-xl p-3 mt-4
// [Info icon, brand-blue]
// "Yeh sirf guidance hai. Final eligibility sarkari rules aur documents pe depend karti hai."
// text-xs
```

---

### Static Matching Rules (schemeMatcher.ts)

```ts
// Demo mode matching logic:
if (isPregnant) → PMMVY (eligible), JSY (likely)
if (childrenUnder5 > 0) → Mission Indradhanush (eligible)
if (income === '0-5000' || rationCard === 'bpl' || rationCard === 'aay') → PM-JAY (likely)
if (hasAyushmanCard === 'yes') → PM-JAY (eligible)
if (state === 'Madhya Pradesh') → MP Nishulk Dawai (check)
// Always include:
→ Jan Aushadhi (eligible) with reason about generic medicines
```

---

### Schemes i18n Keys

```ts
'schemes.title': 'Sarkari Yojnaayein',
'schemes.subtitle': 'Aapki eligibility free mein check karein',
'schemes.trustTitle': 'Sarkari yojnaayein aapke liye',
'schemes.trustSubtitle': 'PM-JAY, PMMVY, JSY, Jan Aushadhi',
'schemes.trustNote': 'Sirf guidance hai — final approval sarkari documents pe depend karta hai',
'schemes.form.stateLabel': 'Aapka state',
'schemes.form.incomeLabel': 'Mahine ki amdani',
'schemes.form.rationLabel': 'Ration card',
'schemes.form.ayushmanLabel': 'Ayushman card hai?',
'schemes.form.pregnantLabel': 'Parivaar mein koi pregnant hai?',
'schemes.form.childrenLabel': 'Bachche jinki umar 5 saal se kam hai',
'schemes.form.seniorLabel': 'Buzurg (60+) parivaar mein hain?',
'schemes.form.cta': 'Yojnaayein dhundho',
'schemes.loading': 'Aapki eligibility check ho rahi hai...',
'schemes.results.eligible': '{count} eligible',
'schemes.results.likely': '{count} likely',
'schemes.results.check': '{count} check karein',
'schemes.results.retry': 'Naye sawaalon se dobara check karein',
'schemes.status.eligible': 'Eligible ✓',
'schemes.status.likely': 'Likely →',
'schemes.status.check': 'Check karein',
'schemes.card.why': 'Kyun mili?',
'schemes.card.documents': 'Documents chahiye:',
'schemes.card.applyAt': 'Apply kahan karein:',
'schemes.card.officialSite': 'Official site',
'schemes.action.phc': 'Najdeeki PHC/Anganwadi dhundhen',
'schemes.disclaimer': 'Yeh sirf guidance hai. Final eligibility sarkari rules aur documents pe depend karti hai.',
```

### Schemes Acceptance

- [ ] Form pre-fills from store profile
- [ ] Button groups work for ration card and ayushman selections
- [ ] Children stepper increments/decrements
- [ ] Loading state shows before results
- [ ] Demo mode returns real scheme matches (not empty)
- [ ] Scheme cards show status badge + benefit prominently
- [ ] Top scheme card is expanded by default
- [ ] Disclaimer visible
- [ ] Official URLs open in new tab with rel="noopener"
- [ ] "Dobara check karein" link resets form
- [ ] No horizontal overflow at 375px

---

## Final Verification

```bash
npm run build   # zero TypeScript errors
```

- [ ] `/prescription` direct load works, idle state shows
- [ ] `/schemes` direct load works, form shows
- [ ] Demo mode: prescription scan returns mock medicines
- [ ] Demo mode: scheme check returns matched schemes
- [ ] Gemini configured: `/api/gemini` route receives requests
- [ ] No hardcoded strings in page JSX
