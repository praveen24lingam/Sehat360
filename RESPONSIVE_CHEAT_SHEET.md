# Sehat360 Responsive Design - Cheat Sheet

## Copy-Paste Responsive Patterns

### Pattern 1: Responsive Grid (Most Common)
```tsx
// 2 cols mobile → 3 cols tablet → 4 cols desktop
<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 lg:gap-6">
  {items.map(item => <Card {...item} />)}
</div>
```

### Pattern 2: Responsive Padding
```tsx
// 16px mobile → 24px tablet → 32px desktop
<div className="p-4 md:p-6 lg:p-8">
  Content
</div>
```

### Pattern 3: Two-Column Layout
```tsx
// Stacked mobile → Side-by-side desktop
<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
  <LeftSection />
  <RightSection />
</div>
```

### Pattern 4: Hide/Show by Size
```tsx
// Hide on mobile, show on desktop
<div className="hidden md:block">Desktop only</div>

// Show on mobile, hide on desktop  
<div className="md:hidden">Mobile only</div>

// Different display at different sizes
<div className="block md:hidden lg:flex">Varies</div>
```

### Pattern 5: Responsive Text
```tsx
// Sizes increase with screen
<h1 className="text-base md:text-lg lg:text-xl font-semibold">Title</h1>
<p className="text-sm md:text-base">Body text</p>
```

### Pattern 6: Responsive Container
```tsx
// Full-width with responsive max-width and padding
<div className="mx-auto w-full px-4 md:px-6 lg:px-8 
                max-w-shell md:max-w-shell-tablet lg:max-w-shell-desktop">
  Content
</div>
```

### Pattern 7: Three-Column Section
```tsx
// Mobile: 1 col → Tablet: 1 col → Desktop: 3 cols
<div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
  <Section1 />
  <Section2 />
  <Section3 />
</div>
```

### Pattern 8: Side-by-Side with Sidebar
```tsx
// Mobile: Sidebar hidden → Tablet: Drawer → Desktop: Fixed
<div className="flex">
  <SideNav className="hidden lg:block w-60" />
  <main className="flex-1">
    Content
  </main>
</div>
```

---

## Breakpoints Reference

```
sm   640px   First tablet breakpoint
md   768px   Main tablet breakpoint (navigation changes)
lg   1024px  Desktop breakpoint (sidebar becomes fixed)
xl   1280px  Extra large screens
```

---

## Common CSS Classes

### Display
```css
block                 /* Display: block */
inline               /* Display: inline */
flex                 /* Display: flex */
grid                 /* Display: grid */
hidden               /* Display: none */

md:hidden             /* Hidden on tablet+ */
hidden md:block       /* Hidden on mobile, show on tablet+ */
md:grid               /* Change to grid on tablet */
```

### Sizing
```css
w-full               /* Width: 100% */
w-1/2                /* Width: 50% */
w-1/3                /* Width: 33.33% */
h-auto               /* Height: auto */
max-w-shell          /* Max-width: 430px */
md:max-w-shell-tablet /* Max-width: 700px */
lg:max-w-shell-desktop /* Max-width: 1200px */
```

### Spacing (Padding)
```css
p-4                  /* All padding: 16px */
px-4                 /* Horizontal: 16px */
py-3                 /* Vertical: 12px */
p-4 md:p-6 lg:p-8   /* Responsive padding */
```

### Spacing (Margin)
```css
m-4                  /* All margin: 16px */
mx-auto              /* Horizontal center */
gap-3                /* Gap between grid items: 12px */
gap-3 md:gap-4       /* Responsive gaps */
```

### Grid
```css
grid-cols-1          /* 1 column */
grid-cols-2          /* 2 columns */
grid-cols-3          /* 3 columns */
grid-cols-4          /* 4 columns */
grid-cols-2 md:grid-cols-3 lg:grid-cols-4  /* Responsive */
```

### Text
```css
text-xs              /* Font-size: 12px */
text-sm              /* Font-size: 14px */
text-base            /* Font-size: 16px */
text-lg              /* Font-size: 18px */
text-xl              /* Font-size: 20px */
text-2xl             /* Font-size: 24px */

text-base md:text-lg lg:text-xl  /* Responsive text */
```

### Colors & Styling
```css
text-brand-ink       /* Dark text color */
text-brand-inkSoft   /* Secondary text */
bg-brand-smoke       /* Light background */
bg-white             /* Card background */
border-brand-border  /* Card border */
text-center          /* Center text */
font-semibold        /* Medium weight */
font-bold            /* Bold text */
```

---

## Quick Decision Tree

### I want a responsive grid...

**2 items per row:**
```tsx
grid-cols-2 md:grid-cols-3 lg:grid-cols-4
```

**3 items per row:**
```tsx
grid-cols-3 md:grid-cols-4 lg:grid-cols-5
```

**1 column mobile, 2 desktop:**
```tsx
grid-cols-1 lg:grid-cols-2
```

**1 column mobile, 2 tablet, 3 desktop:**
```tsx
grid-cols-1 md:grid-cols-2 lg:grid-cols-3
```

---

### I want responsive spacing...

**Padding:**
```tsx
p-4 md:p-6 lg:p-8        /* All sides */
px-4 md:px-6 lg:px-8     /* Horizontal only */
py-3 md:py-4 lg:py-5     /* Vertical only */
```

**Gaps between items:**
```tsx
gap-3 md:gap-4 lg:gap-6  /* Between grid items */
```

**Margin:**
```tsx
mx-auto                   /* Center horizontally */
```

---

### I want responsive text...

**Headings:**
```tsx
text-lg md:text-xl lg:text-2xl font-semibold
```

**Body text:**
```tsx
text-sm md:text-base
```

**Small text:**
```tsx
text-xs md:text-sm
```

---

### I want to show/hide elements...

**Show only on mobile:**
```tsx
className="md:hidden"
```

**Show only on tablet/desktop:**
```tsx
className="hidden md:block"
```

**Different on each size:**
```tsx
className="block md:hidden lg:flex"
```

---

### I want a two-column layout...

**Desktop only:**
```tsx
grid grid-cols-1 lg:grid-cols-2
```

**Tablet and desktop:**
```tsx
grid grid-cols-1 md:grid-cols-2
```

**At all sizes:**
```tsx
grid grid-cols-2  // No breakpoint = all sizes
```

---

## Size Reference Table

```
Size         Width    Use Case
────────────────────────────────────
xs           320px    iPhone SE
sm           640px    Large phone / small tablet
md           768px    iPad
lg           1024px   Desktop minimum
xl           1280px   Large desktop
2xl          1536px   Very large screens
────────────────────────────────────

Sehat360 Specific:
Mobile:      375px    (default: 0-639px)
Tablet:      768px    (md breakpoint: 640-1023px)
Desktop:     1024px+  (lg breakpoint: 1024px+)
```

---

## Responsive Typography Scales

### Headings
```
Mobile   →  Tablet   →  Desktop
────────────────────────────────
text-base   text-lg     text-xl      (Main heading)
text-sm     text-base   text-lg      (Subheading)
text-xs     text-sm     text-base    (Section title)
```

### Body Text
```
Mobile   →  Tablet   →  Desktop
────────────────────────────────
text-sm     text-sm     text-base    (Normal text)
text-xs     text-xs     text-sm      (Small text)
```

---

## Colors Quick Reference

### Text Colors
```css
text-brand-ink          /* Primary heading color */
text-brand-inkSoft      /* Secondary/muted text */
text-brand-deepGreen    /* Interactive/active state */
text-white              /* On dark backgrounds */
```

### Background Colors
```css
bg-brand-smoke          /* Page background */
bg-white                /* Card backgrounds */
bg-brand-deepGreen      /* Primary action */
bg-brand-lightGreen     /* Light backgrounds */
bg-brand-saffronLight   /* Warning/highlight bg */
bg-brand-dangerLight    /* Error/danger bg */
```

### Border Colors
```css
border-brand-border     /* Card borders */
border-brand-saffron    /* Highlight borders */
border-brand-danger     /* Error borders */
```

---

## Layout Templates

### Dashboard-Style 3-Section (Reminders + Tip)
```tsx
<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
  <section className="lg:col-span-2">
    {/* Left: 2 columns on desktop */}
  </section>
  <section className="lg:col-span-1">
    {/* Right: 1 column on desktop */}
  </section>
</div>
```

### Cards with Responsive Grid
```tsx
<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
  {items.map(item => (
    <div key={item.id} className="bg-white rounded-xl border border-brand-border p-4">
      {/* Card content */}
    </div>
  ))}
</div>
```

### Sidebar + Content Layout
```tsx
<div className="flex flex-col md:flex-row">
  <aside className="hidden md:block w-60 border-r border-brand-border">
    {/* Sidebar */}
  </aside>
  <main className="flex-1 p-4 md:p-6">
    {/* Main content */}
  </main>
</div>
```

### Hero Section + Grid
```tsx
<div className="space-y-6">
  <div className="bg-brand-deepGreen rounded-2xl p-6 text-white">
    {/* Hero content */}
  </div>
  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
    {/* Grid items */}
  </div>
</div>
```

---

## Debugging Checklist

When something doesn't look right:

- [ ] Check if you're at correct breakpoint (F12 → check width)
- [ ] Verify class names are spelled correctly
- [ ] Ensure breakpoint prefix (md: lg:) is present
- [ ] Check for conflicting classes (both grid-cols-2 and w-full?)
- [ ] Clear browser cache (Ctrl+Shift+Del)
- [ ] Refresh page (F5)
- [ ] Check DevTools → Elements tab for applied styles
- [ ] Look for max-width limiting the layout
- [ ] Ensure grid-cols-X matches number of children

---

## Performance Tips

### ✓ Do This
```tsx
// Good: Responsive within component
<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
```

### ✗ Don't Do This
```tsx
// Bad: Multiple separate components
{isMobile && <MobileGrid />}
{isTablet && <TabletGrid />}
{isDesktop && <DesktopGrid />}
```

### ✓ Do This
```tsx
// Good: Responsive hiding
<div className="hidden md:block">Desktop only</div>
```

### ✗ Don't Do This
```tsx
// Bad: Using display:none excessively
<div style={{display: isMobile ? 'none' : 'block'}}>
```

---

## Common Mistakes & Fixes

### ❌ Horizontal Scroll
**Problem:** Content scrolls left/right  
**Fix:** Use `w-full` not fixed widths, check for `fixed` positioning

### ❌ Text Overflow
**Problem:** Text goes outside container  
**Fix:** Add `truncate` or responsive text sizes

### ❌ Grid Overlaps
**Problem:** Grid items overlap  
**Fix:** Ensure gap: `gap-3 md:gap-4` is set

### ❌ Padding Too Much
**Problem:** Content too squished on mobile  
**Fix:** Use mobile first: `p-4` not `p-8`

### ❌ Navigation Hidden
**Problem:** Nav disappears on some sizes  
**Fix:** Check classes: `hidden md:block` vs `md:hidden`

---

## File Organization

```
components/
├── layout/
│   ├── AppShell.tsx          ← Responsive wrapper
│   ├── TopNav.tsx            ← Fixed on desktop
│   ├── SideNav.tsx           ← Fixed sidebar
│   ├── BottomNav.tsx         ← Mobile only
│   └── PageHeader.tsx        ← Responsive header
├── shared/
│   ├── Cards.tsx             ← Responsive components
│   └── Buttons.tsx           ← Touch/hover friendly

app/
├── [locale]/
│   ├── dashboard/
│   │   └── page.tsx          ← Responsive grids
│   ├── prescription/
│   │   └── page.tsx          ← Apply same patterns
│   └── ...

globals.css                    ← Responsive utilities

tailwind.config.ts             ← Breakpoint config
```

---

## Quick Reference: All Responsive Utilities

```css
/* Grid Columns */
grid-cols-1  grid-cols-2  grid-cols-3  grid-cols-4  grid-cols-5

/* Text Sizes */
text-xs  text-sm  text-base  text-lg  text-xl  text-2xl

/* Padding */
p-1  p-2  p-3  p-4  p-5  p-6  p-8
px-1  px-2  px-3  px-4  px-5  px-6  px-8
py-1  py-2  py-3  py-4  py-5  py-6  py-8

/* Gaps */
gap-1  gap-2  gap-3  gap-4  gap-6  gap-8

/* Display */
block  inline  flex  grid  hidden

/* Width */
w-full  w-1/2  w-1/3  w-1/4  w-auto

/* Max Width */
max-w-shell  max-w-shell-tablet  max-w-shell-desktop

/* Breakpoints */
sm:  md:  lg:  xl:  2xl:
```

---

## Need Something Specific?

### Responsive card grid with 4 columns on desktop?
```tsx
<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
```

### Responsive form with 2 columns on desktop?
```tsx
<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
```

### Responsive padding that increases on desktop?
```tsx
className="p-4 md:p-6 lg:p-8"
```

### Responsive heading that's bigger on desktop?
```tsx
className="text-lg md:text-xl lg:text-2xl font-semibold"
```

### Show something only on desktop?
```tsx
className="hidden lg:block"
```

### Hide something on mobile?
```tsx
className="md:block"
```

---

**Save this file!** 💾  
Use these patterns for every responsive component you build.

**Bookmark the guides:**
- RESPONSIVE_DESIGN_GUIDE.md (technical details)
- RESPONSIVE_TESTING.md (how to test)
- QUICK_START.md (quick reference)
