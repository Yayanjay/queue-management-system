# shadcn/ui Redesign Complete! 🎨

## Overview

The Queue Management System UI has been completely redesigned with shadcn/ui design principles.

---

## What Changed

### ✅ Design System

**Before:**
- Blue/purple gradients everywhere
- Heavy shadows on cards
- Bright, colorful buttons
- Inconsistent styling across pages

**After:**
- Clean, minimal shadcn/ui aesthetic
- Neutral color palette (grayscale)
- Soft red accent for queue-related elements
- Subtle borders instead of heavy shadows
- Consistent component styling
- Dark mode support with toggle

---

## New Features

### 🌓 Dark Mode
- Theme toggle button on all pages
- Persists preference to localStorage
- Respects system preference on first visit
- Smooth transitions between themes

### 🎨 Color System
- CSS variable-based theming
- Neutral base (pure grayscale)
- Soft red accent for active queue elements
- Destructive red for danger actions
- Success green for completed states

### 🧩 shadcn/ui Components

All components follow shadcn/ui patterns:

| Component | Classes | Usage |
|-----------|---------|-------|
| **Button** | `.btn` + variant | `btn-primary`, `btn-secondary`, `btn-outline`, `btn-ghost`, `btn-accent`, `btn-destructive` |
| **Card** | `.card` | With `.card-header`, `.card-content`, `.card-footer` |
| **Badge** | `.badge` + status | `badge-waiting`, `badge-calling`, `badge-serving`, `badge-completed` |
| **Input** | `.input` | Consistent form input styling |
| **Label** | `.label` | Form label styling |
| **Alert** | `.alert` | With `.alert-destructive`, `.alert-success` |
| **Separator** | `.separator` | Horizontal divider line |

---

## Page-by-Page Changes

### 1. LoginView.vue
**Before:** Blue-purple gradient background  
**After:**
- Clean background with centered card
- shadcn/ui form inputs with focus rings
- Theme toggle in top-right corner
- Subtle border on card instead of heavy shadow

### 2. CustomerKiosk.vue
**Before:** Gradient bg, scale-on-hover effects  
**After:**
- Clean background
- Category cards with borders
- Hover effects use background color change
- Soft red accent on selected category
- Clean ticket display with print button
- Theme toggle available

### 3. StaffDashboard.vue
**Before:** Gray background, green highlight for current queue  
**After:**
- Clean header with border
- Current queue card uses soft red accent background
- Status badges for queue states (waiting, calling, serving)
- Subtle hover effects on queue cards
- Theme toggle in header
- Refresh icon on button

### 4. DisplayScreen.vue
**Before:** Dark gradient with backdrop blur  
**After:**
- Clean background (adapts to light/dark mode)
- No gradients, just clean typography
- Soft red accent for current queue number
- Animated pulse effect for current queue
- Clean next queue cards with borders
- Connection indicator uses success/destructive colors

### 5. AdminSettings.vue
**Before:** Mixed styling, red danger zone background  
**After:**
- Clean two-column layout
- Consistent card sections
- Form inputs with proper styling
- Danger zone card uses destructive border
- Category list with hover effects
- Badge for disabled categories
- Theme toggle in header

---

## CSS Variables

### Light Mode
```css
--background: white
--foreground: near-black
--card: white with border
--primary: black
--secondary: light gray
--accent: soft red
--destructive: red
--success: green
--border: gray
```

### Dark Mode
```css
--background: near-black
--foreground: near-white
--card: dark gray with subtle border
--primary: light gray
--secondary: darker gray
--accent: brighter soft red
--destructive: brighter red
--success: brighter green
--border: subtle white
```

---

## New Files Created

| File | Purpose |
|------|---------|
| `frontend/src/stores/theme.ts` | Theme state management (light/dark) |
| `frontend/src/components/ThemeToggle.vue` | Dark mode toggle button component |

---

## Modified Files

| File | Changes |
|------|---------|
| `frontend/src/assets/main.css` | Complete rewrite with CSS variables + shadcn components (~300 lines) |
| `frontend/src/App.vue` | Added theme provider initialization |
| `frontend/src/views/LoginView.vue` | Clean card-based login form |
| `frontend/src/views/CustomerKiosk.vue` | Minimal category selection with bordered cards |
| `frontend/src/views/StaffDashboard.vue` | Clean dashboard with status badges |
| `frontend/src/views/DisplayScreen.vue` | Clean display with soft red accent |
| `frontend/src/views/AdminSettings.vue` | Consistent admin interface |

**Total lines changed:** ~1,200 lines

---

## Component Classes Reference

### Buttons

```html
<!-- Primary (black bg, white text) -->
<button class="btn btn-primary">Primary</button>

<!-- Secondary (light gray bg) -->
<button class="btn btn-secondary">Secondary</button>

<!-- Accent (soft red bg) -->
<button class="btn btn-accent">Call Queue</button>

<!-- Destructive (red bg) -->
<button class="btn btn-destructive">Delete</button>

<!-- Outline (border only) -->
<button class="btn btn-outline">Cancel</button>

<!-- Ghost (no border, bg on hover) -->
<button class="btn btn-ghost">Menu</button>

<!-- Sizes -->
<button class="btn btn-primary btn-sm">Small</button>
<button class="btn btn-primary">Default</button>
<button class="btn btn-primary btn-lg">Large</button>
<button class="btn btn-primary btn-xl">Extra Large</button>
```

### Cards

```html
<div class="card">
  <div class="card-header">
    <h2 class="card-title">Title</h2>
    <p class="card-description">Description</p>
  </div>
  <div class="card-content">
    <!-- Content here -->
  </div>
  <div class="card-footer">
    <!-- Footer actions -->
  </div>
</div>
```

### Badges

```html
<!-- Status badges for queues -->
<span class="badge badge-waiting">Waiting</span>
<span class="badge badge-calling">Calling</span>
<span class="badge badge-serving">Serving</span>
<span class="badge badge-completed">Completed</span>
<span class="badge badge-skipped">Skipped</span>

<!-- Generic badges -->
<span class="badge badge-default">Default</span>
<span class="badge badge-secondary">Secondary</span>
<span class="badge badge-accent">Accent</span>
<span class="badge badge-destructive">Error</span>
<span class="badge badge-success">Success</span>
<span class="badge badge-outline">Outline</span>
```

### Forms

```html
<!-- Input -->
<input type="text" class="input" placeholder="Enter text" />

<!-- Textarea -->
<textarea class="textarea" placeholder="Enter text"></textarea>

<!-- Select -->
<select class="select">
  <option>Option 1</option>
</select>

<!-- Label -->
<label class="label">Field Label</label>

<!-- Complete form field -->
<div class="space-y-2">
  <label class="label">Username</label>
  <input type="text" class="input" placeholder="Enter username" />
</div>
```

### Alerts

```html
<!-- Error alert -->
<div class="alert alert-destructive">
  Something went wrong!
</div>

<!-- Success alert -->
<div class="alert alert-success">
  Operation successful!
</div>
```

### Separators

```html
<div class="separator"></div>
```

---

## Theme Toggle Usage

Add the theme toggle to any page:

```vue
<template>
  <div>
    <ThemeToggle />
  </div>
</template>

<script setup lang="ts">
import ThemeToggle from '@/components/ThemeToggle.vue';
</script>
```

---

## Dark Mode Implementation

The theme system uses:
1. **CSS Variables** - Colors defined in `:root` and `.dark` selectors
2. **Local Storage** - Theme preference persisted
3. **System Preference** - Respects `prefers-color-scheme` on first visit
4. **Pinia Store** - Centralized theme state management
5. **HTML Class** - `.dark` class added to `<html>` element

---

## Browser Support

All modern browsers support the features used:
- ✅ Chrome/Edge 88+
- ✅ Firefox 90+
- ✅ Safari 14+
- ✅ Mobile browsers

---

## Typography

Font sizes follow shadcn/ui patterns:

| Element | Size |
|---------|------|
| Page titles | `text-2xl` to `text-5xl` |
| Section headings | `text-xl` to `text-3xl` |
| Card titles | `card-title` class |
| Body text | Default (16px) |
| Small text | `text-sm` (14px) |
| Tiny text | `text-xs` (12px) |

Font weights:
- Normal: 400
- Medium: 500 (`.font-medium`)
- Semibold: 600 (`.font-semibold`)
- Bold: 700 (`.font-bold`)

---

## Accessibility

All components include proper accessibility features:
- Semantic HTML
- ARIA labels where needed
- Keyboard navigation support
- Focus visible states
- Proper color contrast (WCAG AA compliant)

---

## Performance

- CSS variables for instant theme switching
- No JavaScript-based theme calculations
- Minimal CSS bundle size
- No external CSS framework dependencies
- Tailwind purges unused styles in production

---

## Testing Checklist

✅ TypeScript compilation passes  
✅ All pages render correctly  
✅ Light mode works  
✅ Dark mode works  
✅ Theme persists on reload  
✅ Theme toggle works on all pages  
✅ Print styles maintained  
✅ WebSocket updates still work  
✅ Forms submit correctly  
✅ Buttons have proper hover states  
✅ Cards have proper borders  
✅ Badges display correctly  
✅ Responsive design maintained  

---

## Next Steps

To run and test the redesigned UI:

```bash
# Backend
cd backend
npm run start:dev

# Frontend (new terminal)
cd frontend
npm run dev
```

Visit:
- http://localhost:5173/login
- http://localhost:5173/kiosk
- http://localhost:5173/staff
- http://localhost:5173/display
- http://localhost:5173/admin

Try toggling between light and dark mode on each page!

---

## Credits

Design system based on [shadcn/ui](https://ui.shadcn.com/) by shadcn.

---

**The UI redesign is complete!** 🎉

All pages now follow shadcn/ui design principles with:
- Neutral color palette
- Soft red accent
- Dark mode support
- Consistent components
- Clean, minimal aesthetic
