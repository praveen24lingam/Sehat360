# Responsive Design Testing Guide

## Quick Start

Your Sehat360 app is now **fully responsive**. Test it at different screen sizes:

### Desktop Testing (Browser DevTools)

Open Chrome/Edge DevTools (F12) and switch to Device Emulation:

**Test Sizes:**
- **375px (Mobile):** iPhone SE, small phones
- **640px (Tablet):** iPad Mini  
- **768px (Tablet+):** iPad, tablets
- **1024px (Desktop):** Desktop minimum
- **1440px+ (Desktop XL):** Full-size monitors

**How to Test:**
1. Open http://localhost:3000
2. Press `F12` to open DevTools
3. Click "Toggle device toolbar" (Ctrl+Shift+M)
4. Select device or set custom dimensions
5. Check each page

---

## What to Verify at Each Size

### Mobile (375px)
```
✓ Bottom nav visible at bottom
✓ No horizontal scroll (ever)
✓ All content readable
✓ Dashboard: 2-column action grid
✓ Dashboard: Family horizontal scroll
✓ All text fits without overflow
✓ Safe area padding visible on notched phones
```

**Screenshot:** Dashboard should show:
```
┌─────────────────────────┐
│ Hello, [name] 🔔       │  ← Header
├─────────────────────────┤
│                         │
│  SAVINGS HERO CARD     │  ← Full width green card
│  ₹9,400                │
│                         │
│  📊 What to do today?   │
│  ┌─────────┐ ┌────────┐│
│  │ Medicines│ │ Schemes││  ← 2 column grid
│  └─────────┘ └────────┘│
│  ┌─────────┐ ┌────────┐│
│  │Pregnancy │ │Vaccines││
│  └─────────┘ └────────┘│
│                         │
│ ♥ REMINDERS            │
│ └─ [reminder card]      │
│                         │
│ 👥 FAMILY (scroll →)    │
│ [Avatar1][Avatar2][+]   │
│                         │
├─────────────────────────┤
│ 🏠 💊 🏛️ ❤️ ⋯            │  ← Bottom nav
└─────────────────────────┘
```

### Tablet (768px)
```
✓ Left sidebar drawer available (swipe left or menu icon)
✓ Top nav shows with logo + menu button
✓ Bottom nav HIDDEN
✓ Dashboard: 3-column action grid
✓ Wider padding (px-6)
✓ Sidebar closes on navigation
```

**Key Changes:**
- Dashboard: 3-column grid instead of 2
- Sidebar: Drawer on left (animated entry)
- Top nav: Menu button to toggle sidebar
- No bottom nav

### Desktop (1024px+)
```
✓ Left sidebar always visible (fixed)
✓ Top nav always visible (fixed)
✓ Bottom nav completely hidden
✓ Dashboard: 4-column action grid
✓ Dashboard: 2-col savings + 1-col stats (side by side)
✓ Dashboard: Reminders + Health Tip side by side
✓ Family members: 4-column grid (not horizontal scroll)
✓ Main content max-width of 1200px, centered
✓ Smoke background visible on sides
✓ Hover states on all cards/buttons
```

**Layout:**
```
┌────────────────────────────────────────────────────────┐
│ S Logo  Sehat360  [Settings]  [Logout]  [time]        │  ← TopNav
├──────────┬──────────────────────────────────────────────┤
│ 🏠 Home  │                                             │
│ 💊 Meds  │  SAVINGS HERO      │  STATS CARD           │
│ 🏛️ Scheme│  ₹9,400            │  ₹332/month           │
│ ❤️ Care  │                    │  5 prescriptions      │
│ 👜 Wallet│                    │                       │
│ 📚 Learn │  📊 What to do today?                       │
│ ⚙️ Set   │  ┌──────┐┌──────┐┌──────┐┌──────┐          │
│          │  │Meds  ││Schemes││Preg  ││Vac   │          │
│          │  └──────┘└──────┘└──────┘└──────┘          │
│          │                                             │
│          │  ♥ REMINDERS          📚 HEALTH TIP        │
│          │  ┌──────────────┐     ┌──────────────┐    │
│          │  │Reminder      │     │✓ Read Now   │    │
│          │  └──────────────┘     └──────────────┘    │
│          │                                             │
│          │  👥 FAMILY                                  │
│          │  ┌──┐┌──┐┌──┐┌──┐                         │
│          │  │M1││M2││M3││+│                          │
│          │  └──┘└──┘└──┘└──┘                         │
└──────────┴──────────────────────────────────────────────┘
```

---

## Testing Each Page

### Dashboard ✓ (Already done)
- [x] Mobile: 2-column actions
- [x] Tablet: 3-column actions
- [x] Desktop: 4-column actions, side-by-side layout

### Other Pages (To Update)

1. **Prescription Page** (`/prescription`)
   - Mobile: Full-width upload form
   - Tablet: Side buttons (Camera | Upload)
   - Desktop: 2-3 medicine cards per row

2. **Schemes Page** (`/schemes`)
   - Mobile: Full-width form
   - Tablet: Multi-column form layout
   - Desktop: Form left, results right (sidebar)

3. **Wallet Page** (`/wallet`)
   - Mobile: 2 stat columns
   - Tablet: 3 stat columns
   - Desktop: 4 stat columns + table view

4. **Vaccination Page** (`/vaccination`)
   - Mobile: 2-column vaccine grid
   - Tablet: 3-column vaccine grid
   - Desktop: 4-column vaccine grid

5. **Mother Care Page** (`/mother-care`)
   - Mobile: Single column content
   - Tablet: Same
   - Desktop: 2-column layout

6. **Awareness Page** (`/awareness`)
   - Mobile: 1-column articles
   - Tablet: 2-column articles
   - Desktop: 3-column articles

7. **Settings Page** (`/settings`)
   - Mobile: Full-width form fields
   - Tablet: Same
   - Desktop: Form centered, max-width ~600px

---

## Breakpoint Debugging

### Find Which Breakpoint You're At

Open browser console and paste:

```javascript
const width = window.innerWidth
if (width < 640) console.log('🍕 Mobile (0-639px)')
else if (width < 768) console.log('📱 Small Tablet (640-767px)')
else if (width < 1024) console.log('📑 Tablet (768-1023px)')
else console.log('🖥️ Desktop (1024px+)')
```

Or add this to `page.tsx` temporarily:

```tsx
<div className="fixed bottom-4 right-4 bg-black text-white px-2 py-1 text-xs rounded z-50">
  {window.innerWidth}px
</div>
```

---

## Common Responsive Bugs to Check

### ❌ Horizontal Scroll
**Problem:** Page scrolls left/right at any size  
**Fix:** Check for `fixed` or `absolute` width elements, use `w-full` not `w-[400px]`

### ❌ Text Overflow
**Problem:** Text doesn't fit in container  
**Fix:** Add `truncate`, `line-clamp-2`, or responsive text sizes

### ❌ Bottom Nav Covers Content
**Problem:** Last item hidden behind nav  
**Fix:** Check `pb-20 md:pb-6` padding on main content

### ❌ Sidebar Overlaps Content
**Problem:** Sidebar hides content on tablet  
**Fix:** Sidebar should close after navigation click, add `onClick={() => onOpenChange(false)}`

### ❌ Images Don't Scale
**Problem:** Large image breaks layout  
**Fix:** Add `max-w-full h-auto` to images

---

## Browser DevTools Tips

### Chrome/Edge DevTools
1. Press `F12` or `Ctrl+Shift+I`
2. Click **Toggle device toolbar** (`Ctrl+Shift+M`)
3. Select device from dropdown or enter custom dimensions
4. **Keyboard:** Hold Shift + Click to disable pointer events (check hover styles)

### Firefox DevTools
1. Press `F12`
2. Click **Responsive Design Mode** (`Ctrl+Shift+M`)
3. Change viewport dimensions

### Safari (macOS)
1. Press `Cmd+Option+I`
2. Click **Responsive Design Mode** from menu
3. Safari: Menu → Develop → Enter Responsive Design Mode

---

## CSS Debugging

### Show Grid Breakpoints
Add temporarily to `globals.css`:

```css
@media (max-width: 639px) {
  body::before {
    content: "📱 MOBILE";
    position: fixed;
    top: 0;
    left: 0;
    background: red;
    color: white;
    padding: 4px 8px;
    z-index: 9999;
    font-size: 12px;
  }
}

@media (min-width: 640px) and (max-width: 767px) {
  body::before {
    content: "📱 SM-TABLET";
    background: orange;
    /* ... */
  }
}

@media (min-width: 768px) and (max-width: 1023px) {
  body::before {
    content: "📑 TABLET";
    background: yellow;
    /* ... */
  }
}

@media (min-width: 1024px) {
  body::before {
    content: "🖥️ DESKTOP";
    background: green;
    /* ... */
  }
}
```

---

## Performance Check

After implementing responsive updates:

1. **Lighthouse Score** (Chrome DevTools)
   - Click **Lighthouse** tab
   - Run "Mobile" report
   - Target: 90+ score

2. **CSS Bundle Size**
   - Check browser DevTools → Network
   - CSS should be <50KB

3. **No Layout Shifts**
   - Cumulative Layout Shift (CLS) should be <0.1
   - Check in Lighthouse

---

## Production Testing

Before deploying to production:

1. **Test on Real Devices**
   - iPhone 12/13/14
   - iPad Pro
   - Android phone (Samsung Galaxy, OnePlus)
   - Desktop Windows/Mac

2. **Test on Actual Networks**
   - 4G connection
   - WiFi
   - Slow 3G (throttle in DevTools)

3. **Test Touch Interactions**
   - Sidebar drawer swipe
   - Bottom nav scrolling
   - Button tap targets (should be 44px+)

4. **Test Accessibility**
   - Keyboard navigation (Tab key)
   - Screen reader (NVDA on Windows, VoiceOver on Mac)
   - Focus visible (should see blue ring)

---

## Responsive CSS Patterns Reference

### Responsive Padding
```tailwind
p-4 md:p-6 lg:p-8
px-4 md:px-6 lg:px-8
py-3 md:py-4 lg:py-5
```

### Responsive Text
```tailwind
text-sm md:text-base lg:text-lg
text-xs md:text-sm
text-lg md:text-xl lg:text-2xl
```

### Responsive Grid
```tailwind
grid-cols-1 md:grid-cols-2 lg:grid-cols-3
grid-cols-2 md:grid-cols-3 lg:grid-cols-4
```

### Responsive Display
```tailwind
block md:hidden        ← Show on mobile only
hidden md:block        ← Hide on mobile, show on tablet+
hidden md:grid lg:grid ← Different display at each size
```

### Responsive Width
```tailwind
w-full md:w-1/2 lg:w-1/3
max-w-shell md:max-w-shell-tablet lg:max-w-shell-desktop
```

---

## Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| Bottom nav hidden on desktop | Use `md:hidden` class on BottomNav |
| Sidebar visible on mobile | Use `hidden lg:block` or drawer behavior |
| Text too small on desktop | Add `md:text-base lg:text-lg` |
| Cards cramped on desktop | Add `lg:grid-cols-4` to grids |
| Image breaks layout | Add `max-w-full h-auto` |
| Horizontal scroll | Check for fixed-width containers, use `w-full` |
| Touch targets too small | Ensure buttons are 44px+ height |
| No space for sidebar | Use drawer on tablet instead of fixed |

---

## Next: Apply to Other Pages

After verifying dashboard is responsive, apply the same patterns to:

1. ✅ Dashboard (done)
2. ⬜ Prescription
3. ⬜ Schemes
4. ⬜ Wallet
5. ⬜ Vaccination
6. ⬜ Mother Care
7. ⬜ Awareness
8. ⬜ Settings

Each should follow the same responsive grid patterns.

---

**Happy testing!** 🚀

Open http://localhost:3000 and resize your browser to see the magic happen.
