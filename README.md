# SehatMitra Folder Structure Guide

Aapko project samajhne me asani ho isliye yahan ek quick breakdown hai:

## 🧭 Pages & Routes (`src/app/`)
Next.js 14 App Router use ho raha hai, isliye har page `page.tsx` me hota hai.
- **Landing Page:** `src/app/[locale]/page.tsx`
- **Login Page:** `src/app/[locale]/login/page.tsx`
- **Dashboard:** `src/app/[locale]/dashboard/page.tsx`
- **Settings:** `src/app/[locale]/settings/page.tsx`
- **Wallet:** `src/app/[locale]/wallet/page.tsx`

*(Note: `[locale]` folder isliye hai kyunki app Hindi/English support karti hai via `next-intl`)*

## 🧩 Components (`src/components/`)
- `components/ui/` : Shadcn UI ke base components (Button, Input, Alert)
- `components/shared/` : Hamare custom components (MedicineCard, SchemeCard, SavingsCard, Footer)
- `components/layout/` : Navigation (BottomNav, AppShell)

## 🪝 Hooks (`src/hooks/`)
Reusable React logic.
- `useAuth.ts` : User login/logout handle karta hai
- `useFeatureGate.ts` : Check karta hai ki user ne kaunsa feature enable kiya hai

## 🧠 State / Data (`src/store/` & `src/data/`)
- `store/userStore.ts` : Zustand state manager jahan user ka saara data save hota hai (localStorage me)
- `data/` : Demo data, Vaccine schedule, Schemes list

## 🌐 Translations (`src/messages/`)
- `messages/hi.ts` : Hindi strings
- `messages/en.ts` : English strings

## 🛠️ Utils / Lib (`src/lib/`)
- `supabase.ts` : Database connection
- `gemini.ts` : AI logic
- `formatters.ts` : Rupye ya dates format karna
