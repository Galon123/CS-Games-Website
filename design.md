# DESIGN SYSTEM: CS Games (Editorial & Humanist Light Theme)

## 1. Overview & Core Philosophy

The CS Department Sports & Gaming platform uses an **Editorial & Humanist Light Theme**. Moving away from high-contrast neon slates, dark gaming aesthetics, and artificial glow effects, this design system focuses on high legibility, structured whitespace, clean offset shadows, and tactile sports-journalism layouts.

**Hard Rules (never break):**
- No `backdrop-blur` or glassmorphism effects.
- No blurred drop shadows — only sharp offset `box-shadow` with zero blur radius.
- No neon or gradient glows.
- No dark mode. Light cream canvas only.
- `font-mono` is strictly for numbers and code. Never for body copy.
- Images are only shown for Football, Badminton, Chess, and Carrom. All other sports are image-free.

---

## 2. Color Palette

### CSS Custom Properties (`:root` in `globals.css`)

```css
--primary-bg: #FBF9F5;
--card-bg: #FFFFFF;
--brand-blue: #2563EB;
--ink-primary: #1A1A1A;
--ink-secondary: #64748B;
--border-subtle: #E5E0D8;
--pitch-green: #1F3A2B;
```

### Base & Surfaces

| Role | Hex | Tailwind |
|------|-----|---------|
| Canvas background | `#FBF9F5` | `bg-[#FBF9F5]` |
| Card surface | `#FFFFFF` | `bg-white` |
| Subtle border | `#E5E0D8` | `border-[#E5E0D8]` |
| Table divider | `#E2E8F0` | `border-slate-200` |

### Text

| Role | Hex | Tailwind |
|------|-----|---------|
| Primary / headings | `#1A1A1A` | `text-[#1A1A1A]` |
| Secondary / metadata | `#64748B` | `text-slate-500` |
| Muted labels | — | `text-slate-600` |

### Accent Colors

| Role | Hex | Tailwind |
|------|-----|---------|
| Primary (Royal Blue) | `#1E40AF` | `text-[#1E40AF]` / `bg-[#1E40AF]` |
| Brand Blue (lighter) | `#2563EB` | `bg-blue-600` |
| Ochre / Ticker Gold | `#F59E0B` | `bg-[#F59E0B]` |
| Trophy Gold | `#D97706` | `text-[#D97706]` |
| Football Pitch Turf | `#153422` | `.tactical-pitch` CSS class |
| Pitch Turf (alt) | `#1F3A2B` | `bg-[#1F3A2B]` |
| Live / Success Green | `#059669` | `bg-[#059669]` |
| Active / Confirmed Green | `#10B981` | `bg-[#10B981]` |

---

## 3. Typography Rules

### Fonts (Google Fonts, loaded in `globals.css`)

```
Fraunces: ital, opsz 9..144, wght 400..900
JetBrains Mono: wght 400..800
Plus Jakarta Sans: ital, wght 300..800
```

### Usage Rules

**`Fraunces` — Display & Primary Headings**
- Classes: `font-serif font-black tracking-tight text-[#1A1A1A]`
- Usage: Page titles, hero headlines, section headings, sport card names, admin section titles.
- Sizes: `text-base` (cards) → `text-xl sm:text-2xl` (section headings) → `text-2xl sm:text-3xl` (page titles) → `text-4xl sm:text-6xl lg:text-7xl` (hero).

**`Plus Jakarta Sans` — Body, Navigation, Labels**
- Classes: `font-sans font-medium text-slate-700`
- Usage: Navigation items, body copy, card descriptions, button labels, input fields, table headers.
- Default body font set on `<body>` in `globals.css`.

**`JetBrains Mono` — Numbers & Metrics Only**
- Classes: `font-mono font-bold text-slate-900`
- Usage: Match scores, jersey numbers, points, win/loss records, timestamps, stat counters, badge codes.
- Rule: Never use for prose or labels. Strictly data and codes only.

---

## 4. Body Background

```css
body {
  background-color: #FBF9F5;
  background-image: radial-gradient(rgba(229, 224, 216, 0.7) 1px, transparent 1px);
  background-size: 24px 24px;
  overflow-x: hidden;
  -webkit-font-smoothing: antialiased;
}
```

Subtle dot-grid texture gives the canvas an editorial newsprint feel.

**Scrollbar:** 6px, track `#FBF9F5`, thumb `#CBD5E1` → `#94A3B8` on hover, fully rounded.

**Text Selection:** `selection:bg-blue-600 selection:text-white` (on `<body>`).

---

## 5. Shadow System

All shadows are sharp offset with zero blur — no soft drop shadows:

| Class | CSS Value | Usage |
|-------|-----------|-------|
| `.shadow-editorial-sm` | `3px 3px 0px 0px #1A1A1A` | Standard cards, nav active pills |
| `.shadow-editorial-md` | `5px 5px 0px 0px #1A1A1A` | Section containers, table cards |
| `.shadow-editorial-lg` | `6px 6px 0px 0px #1A1A1A` | Hero section outer shadow |
| `.shadow-editorial-amber` | `4px 4px 0px 0px #D97706` | Gold-accented cards |
| `.shadow-editorial-white` | `4px 4px 0px 0px #FFFFFF` | Cards on dark (hero blue) backgrounds |
| `shadow-2xs` | Tailwind fine shadow | Badge chips, crest tokens |
| `shadow-[2px_2px_0px_0px_rgba(26,26,26,1)]` | Inline Tailwind | Buttons, badge chips, score blocks |
| `shadow-[5px_5px_0px_0px_rgba(26,26,26,1)]` | Inline Tailwind | Podium standings card on hero |
| `shadow-[6px_6px_0px_0px_rgba(26,26,26,1)]` | Inline Tailwind | Hero section outer frame |

`.editorial-card` CSS class:
```css
.editorial-card {
  background-color: #FFFFFF;
  border: 1px solid #E5E0D8;
  box-shadow: 4px 4px 0px 0px rgba(26, 26, 26, 0.08);
}
```

---

## 6. Animation & Interaction System

### CSS Classes

```css
/* Card lift on hover */
.card-lift { transition: transform 0.15s ease, border-color 0.15s ease, box-shadow 0.15s ease; }
.card-lift:hover { transform: translateY(-2px); box-shadow: 4px 4px 0px 0px #1A1A1A; border-color: #1A1A1A; }

/* Button physical press */
.btn-fluid-hover:hover { transform: translate(-1px, -1px); }
.btn-fluid-hover:active { transform: translate(2px, 2px); }

/* Marquee pause */
.pause-on-hover:hover { animation-play-state: paused !important; }

/* Stagger delays */
.animation-delay-75  { animation-delay: 75ms; }
.animation-delay-150 { animation-delay: 150ms; }
.animation-delay-200 { animation-delay: 200ms; }
.animation-delay-300 { animation-delay: 300ms; }
```

### Inline Tailwind Patterns

| Effect | Classes |
|--------|---------|
| Nav / Admin button hover lift | `hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5` |
| Card hover lift (divisions) | `hover:-translate-y-1 transition-all` |
| Snapshot card hover | `hover:-translate-y-0.5 transition-all` |
| Arrow link slide right | `group-hover:translate-x-1 transition-transform` on `ArrowRight` |
| Sport photo zoom | `group-hover:scale-105 transition-transform duration-200` |
| Logo mark scale | `group-hover:scale-105 transition-transform duration-200` |
| Active tab lift shadow | `shadow-[2px_2px_0px_0px_rgba(26,26,26,1)]` |
| Live dot ping | `animate-ping` on `w-2 h-2 rounded-full bg-[#10B981]` |

### Staggered Entry Animation

- Division cards: `animationDelay: Math.min(idx * 60 + 50, 400)ms` with `animate-fade-in-up`.
- Snapshot cards: `animationDelay: idx * 60ms` with `animate-fade-in-up`.

### Accessibility

```css
@media (prefers-reduced-motion: reduce) {
  *, ::before, ::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

---

## 7. Component Rules

### A. Navigation & Header

**Container:** `sticky top-0 z-50 bg-white border-b-2 border-[#1A1A1A]`
**Inner:** `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8` height `h-16`

**Logo:**
- CSBrandMark with `shadow-editorial-sm rounded-md group-hover:scale-105 transition-transform duration-200`
- "CS GAMES" → `font-serif font-black text-lg text-[#1A1A1A]`
- "2026" → `font-serif font-black text-lg text-[#1E40AF]`
- "★ MEET" badge → `hidden sm:inline-flex text-[10px] font-mono font-black px-2 py-0.5 rounded bg-[#F59E0B] text-[#1A1A1A] border border-[#1A1A1A] shadow-2xs`
- Sub-label → `text-[10px] sm:text-[11px] font-bold text-slate-600 tracking-wide uppercase font-mono`

**Nav Links (inactive):** `text-slate-700 hover:text-[#1A1A1A] hover:bg-slate-100 border-2 border-transparent px-3.5 py-1.5 rounded-md text-xs font-bold transition-all`
**Nav Links (active):** `bg-[#1E40AF] text-white border-2 border-[#172554] shadow-[2px_2px_0px_0px_rgba(26,26,26,1)]`

**Admin Button:**
- Default: `bg-[#F59E0B] hover:bg-[#D97706] text-[#1A1A1A]`
- Authenticated: `bg-[#10B981] text-[#1A1A1A]`
- On /admin page: `bg-[#1E40AF] text-white`
- All states: `border-2 border-[#1A1A1A] shadow-[2px_2px_0px_0px_rgba(26,26,26,1)] hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 text-xs font-black px-3.5 py-1.5 rounded-md`

**Mobile Drawer:** `md:hidden border-b border-[#E5E0D8] bg-white px-4 pt-2 pb-4 space-y-1 shadow-md`
- Active: `bg-blue-50 text-blue-600 font-semibold rounded-lg`
- Inactive: `text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg`

---

### B. Live Ticker (Top Banner, above Navbar)

**Container:** `bg-[#F59E0B] border-b-2 border-[#1A1A1A] text-[#1A1A1A] text-xs py-2 px-3 sm:px-4 select-none overflow-hidden`

**LIVE badge:** `bg-[#1A1A1A] text-white font-mono text-xs font-black px-2.5 py-0.5 rounded shadow-[2px_2px_0px_0px_rgba(26,26,26,0.2)] tracking-wider uppercase`
- Pulsing dot: `w-2 h-2 rounded-full bg-[#10B981] animate-ping`
- "TICKER" label: `hidden sm:inline font-mono font-black text-xs text-[#1A1A1A] tracking-wider uppercase`

**Scrolling Track:** `animate-marquee pause-on-hover whitespace-nowrap will-change-transform py-0.5` — list duplicated for seamless loop.

**Chip Types:**
- Live match: `bg-white text-[#1A1A1A] px-2.5 py-0.5 rounded border border-[#1A1A1A] shadow-[2px_2px_0px_0px_rgba(26,26,26,1)]`; score badge `bg-[#059669] text-white`
- Upcoming: `bg-white/80 text-[#1A1A1A] px-2 py-0.5 rounded border border-[#1A1A1A]/40`
- Announcement: `bg-[#1A1A1A] text-white px-2.5 py-0.5 rounded border border-[#1A1A1A] shadow-[2px_2px_0px_0px_rgba(26,26,26,0.3)]` with Trophy icon `text-[#F59E0B]`

**Match Text Formats:**
- Standard: `Team A [score] - [score] Team B`
- FFA: `Free For All Mass Showdown • All N Competitors in Action`
- Quad: `P1 vs P2 vs P3 vs P4 • 1v1v1v1 [Sport]`

**Right Status Pill:** `bg-[#1A1A1A] text-[#FBF9F5] text-[10px] font-mono font-bold px-2 py-0.5 rounded`
- Emerald dot `bg-emerald-400` when Supabase live
- Blue dot `bg-blue-400` when local sync mode

---

### C. Hero Section

**Container:** `relative min-h-[calc(100vh-8.5rem)] lg:min-h-[calc(100vh-7.5rem)] flex flex-col justify-between py-6 sm:py-8 overflow-hidden rounded-2xl border-2 border-[#172554] px-4 sm:px-8 lg:px-10 bg-[#1E40AF] text-white shadow-[6px_6px_0px_0px_rgba(26,26,26,1)]`

**Background SVG:** Football pitch chalk line-art at `text-white/15`, centered, `pointer-events-none -z-0`.

**Badge Row:** `bg-[#F59E0B] text-[#1A1A1A] font-mono font-black text-[10px] border border-[#1A1A1A] shadow-2xs uppercase px-2 py-0.5 rounded`

**Main Headline:** `font-serif font-black text-4xl sm:text-6xl lg:text-7xl tracking-tight`

#### CS Cup Scoreboard Sub-card

**Container:** `bg-[#FBF9F5] border-2 border-[#1A1A1A] rounded-lg p-4 sm:p-5`
**Grid:** `grid grid-cols-[1fr_auto_1fr] items-center gap-2 sm:gap-4`

**Team Crest Tokens:** `w-12 h-12 rounded-md bg-white border-2 border-[#1A1A1A] font-mono font-black text-sm text-[#1A1A1A] shadow-[2px_2px_0px_0px_rgba(26,26,26,1)]`

**Score Blocks:** `w-10 h-10 sm:w-12 sm:h-12 rounded-md bg-white border-2 border-[#1A1A1A] shadow-[2px_2px_0px_0px_rgba(26,26,26,1)]`; text `text-xl sm:text-2xl font-mono font-black text-[#1A1A1A] tabular-nums`

**VS Chip (upcoming):** `w-12 h-9 rounded-md bg-white border-2 border-[#1A1A1A] shadow-[2px_2px_0px_0px_rgba(26,26,26,1)]`; text `font-mono font-black text-blue-600 text-sm tracking-widest`

**Status Badges:**
- LIVE: `bg-[#059669] text-white font-mono text-xs font-black px-2.5 py-1 rounded border border-emerald-800 shadow-2xs`
- FINAL: `bg-slate-200 text-slate-800 text-[10px] font-black uppercase tracking-wide border border-slate-300`
- UPCOMING: `font-mono font-bold text-slate-700 bg-slate-200 border border-slate-300 px-2 py-0.5 rounded uppercase tracking-wider`

**Date/Time Chip:** `bg-[#FBF9F5] border-2 border-[#1A1A1A] shadow-2xs px-2.5 py-1 rounded font-mono font-bold text-[#1A1A1A]`; Calendar icon `text-[#D97706]`, Clock icon `text-blue-600`

**Venue Chip:** `bg-slate-100 px-2.5 py-1 rounded border border-slate-200 text-slate-700 text-xs font-medium`; MapPin icon `text-blue-600`

#### Podium Standings Card

**Container:** `bg-white text-[#1A1A1A] border-2 border-[#1A1A1A] rounded-xl p-4 shadow-[5px_5px_0px_0px_rgba(26,26,26,1)]`

**Rank Badges (`w-5 h-5 rounded font-mono font-black text-[11px] border`):**
- #1: `bg-[#F59E0B] text-[#1A1A1A] border-[#1A1A1A] shadow-2xs` (👑)
- #2: `bg-slate-200 text-slate-800 border-slate-400` (#2)
- #3: `bg-amber-100 text-amber-900 border-amber-300` (#3)

**Points Chip:** `font-mono font-black text-[#1A1A1A] px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-xs tabular-nums`

---

### D. Tournament Division Cards (Sport Grid)

**Grid:** `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5`
**Card:** `bg-white rounded-xl overflow-hidden border-2 border-[#1A1A1A] shadow-editorial-sm hover:shadow-editorial-md hover:-translate-y-1 transition-all group flex flex-col justify-between`
**CS Cup Special:** Also `ring-2 ring-blue-500/20` and `border-[#1E40AF]`

**Photo Header (Football, Badminton, Chess, Carrom ONLY):**
- Container: `relative h-36 w-full overflow-hidden bg-slate-100 border-b-2 border-[#1A1A1A]`
- Image: `w-full h-full object-cover group-hover:scale-105 transition-transform duration-200`
- Badge (CS Cup): `bg-[#153422] text-[#F59E0B] border-[#F59E0B]`
- Badge (others): `bg-white text-[#1A1A1A] border-[#1A1A1A]`
- Icon button: `w-6 h-6 rounded bg-white border-2 border-[#1A1A1A] shadow-2xs`
- Venue strip: `absolute bottom-0 inset-x-0 bg-black/75 px-2.5 py-1 text-[10px] text-white font-mono`; MapPin icon `text-[#F59E0B]`

**No-Photo Header:** `p-4 pb-1`, badge `text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-100 text-[#1A1A1A] border border-[#1A1A1A]`

**Card Body:**
- Title: `font-serif font-black text-base text-[#1A1A1A] group-hover:text-blue-600 transition-colors`
- CS Cup ★: `text-[#F59E0B] font-black text-xs`
- Description: `text-xs text-slate-600 mt-1 leading-relaxed line-clamp-2 font-sans`
- Venue (no-photo): `mt-2 text-[10px] text-slate-500 font-mono`; MapPin `text-blue-600`

**Card Footer:** `border-t border-slate-100 px-4 pb-3.5 pt-2.5 text-xs font-bold text-[#1A1A1A] group-hover:text-blue-600 flex items-center justify-between transition-colors`; ArrowRight `group-hover:translate-x-1 transition-transform`

---

### E. Leaderboard & Standings Tables

**Sport Tabs:**
- Active: `bg-[#1E40AF] text-white border-2 border-[#172554] shadow-[2px_2px_0px_0px_rgba(26,26,26,1)] px-3.5 py-1.5 rounded-md text-xs font-bold`
- CS Cup active: `bg-[#F59E0B] text-[#1A1A1A]` (same shape)
- Inactive: `bg-white text-slate-700 border border-slate-300 hover:border-[#1A1A1A]`

**Division Header Card:** `relative overflow-hidden bg-white border-2 border-[#1A1A1A] rounded-xl shadow-editorial-md`
- CS Cup: `bg-[#153422]` with `bg-[#F59E0B] text-[#1A1A1A]` badge
- Background image (4 sports only): `opacity-15` with `absolute inset-0 bg-white/90` overlay
- Sport watermark SVGs: `opacity-[0.035]–[0.04]` in bottom-right corner
- "Contenders" counter: `bg-white border-2 border-[#1A1A1A] rounded-lg px-4 py-2 shadow-editorial-sm`

**Table:** `bg-white border-2 border-[#1A1A1A] rounded-xl overflow-hidden shadow-editorial-md`
**Header Row:** `bg-slate-50 border-b-2 border-slate-200 text-xs font-mono font-black text-slate-700 tracking-wider uppercase`

**Column Headers by sport type:**
- `solo` → "Competitor / Department"
- `quad` or Carrom (non-duo) → "Contender / Department"
- `duo` → "Pair / Department"
- `free_for_all` → "Contender / Department"
- `team` → "Team / Laboratory"
- Action column: "Profile" for solo/ffa/quad/carrom; "Roster" for team

**Rows:** `hover:bg-slate-50 transition-colors duration-150 group` with `divide-y divide-slate-100`

**Rank Badges (`w-7 h-7 rounded-md`):**
- #1: `bg-amber-100/90 border border-amber-300 shadow-2xs ring-1 ring-amber-400/40` — Crown icon `fill-amber-500 text-amber-600`
- #2: `bg-slate-200/80 border border-slate-300 shadow-2xs ring-1 ring-slate-300/60` — Medal icon
- #3: `bg-amber-200/60 border border-amber-300 shadow-2xs ring-1 ring-amber-400/30` — Medal icon `text-amber-700`
- Others: `text-slate-500 font-semibold w-7 h-7 inline-flex items-center justify-center rounded-md`

**Rank Movement:** ArrowUp `text-emerald-600`, ArrowDown `text-rose-600`, Minus `text-slate-400`

**Crest Token:** `w-8 h-8 rounded-lg bg-slate-100 border border-slate-200 font-mono font-bold text-slate-700 group-hover:border-blue-300`
**Contender Name:** `font-semibold text-slate-900 group-hover:text-blue-600 transition-colors`
**LEADER Badge:** `text-[10px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200 font-sans`
**Department:** `text-[11px] text-slate-500`

**Stat Cells:** Played `font-mono text-slate-700` | Won `font-mono font-semibold text-emerald-700` | Drawn `font-mono text-slate-600` | Lost `font-mono text-rose-700`

**Points Badge:** `font-mono font-bold text-sm text-slate-900 px-2.5 py-0.5 rounded bg-slate-100 border border-slate-200 group-hover:border-blue-300 group-hover:bg-blue-50/60 group-hover:text-blue-700`

**Action Link:** `text-[11px] text-slate-700 hover:text-slate-900 font-medium py-1 px-2.5 rounded-md bg-white hover:bg-slate-50 border border-slate-200 shadow-2xs hover:border-slate-300`

---

### F. Home Page Standings Snapshot Section

**Section:** `bg-white border-2 border-[#1A1A1A] rounded-xl p-6 space-y-6 shadow-editorial-md`
**Header Icon:** `w-10 h-10 rounded-md bg-[#F59E0B] border-2 border-[#1A1A1A] shadow-[2px_2px_0px_0px_rgba(26,26,26,1)]`

**Snapshot Grid:** `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4`
**Card:** `bg-white border-2 border-[#1A1A1A] rounded-lg p-4 flex items-center justify-between shadow-editorial-sm hover:-translate-y-0.5 transition-all animate-fade-in-up`
**Points:** `text-base font-black font-mono text-[#1E40AF]` + `text-[10px] font-normal text-slate-500 PTS`
**Record:** `text-[10px] text-slate-500 font-mono font-medium`

---

### G. Teams & Rosters Page

**Direct Enrollment Sports (no team needed):** `type === 'solo'`, `type === 'free_for_all'`, `type === 'quad'`, or name includes "carrom" unless `type === 'duo'`. Players shown in separate "Individual Athletes" section without team grouping.

**Player Modal:** `fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50`. Card: `bg-white border border-[#E5E0D8] rounded-lg p-6 max-w-xl shadow-xl max-h-[90vh] overflow-y-auto`

---

### H. Football Tactical Pitch

**Pitch:** `.tactical-pitch { background-color: #153422; }`
**Lines:** Crisp off-white markings (`stroke-white/20`)
**Players:** Circular tokens, jersey `font-mono`, positioned by `position_x`/`position_y` percentages
**Formations:** Strings e.g. `2-2-1`, `3-2`, `1-3-1`. Admin controls: defensive line height (low/mid/high), pitch width (narrow/standard/wide).

---

### I. Admin Panel

**Auth Gate:** `max-w-md mx-auto my-12`, inputs `border-2 border-[#E5E0D8] rounded-md h-11`
**Tabs:** Active `border-b-2 border-[#1E40AF] text-[#1E40AF] font-semibold`, inactive `text-slate-600 hover:text-slate-900`
**Section Cards:** `bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-4`

**Match Scheduler — Quad / 1v1v1v1 (Carrom, `type === 'quad'`):**
- 4 player dropdowns with color position markers: North (blue), South (red), East (amber), West (emerald)
- Validation: all 4 players distinct, none empty
- Dispatches `player_a_id`, `player_b_id`, `player_c_id`, `player_d_id`

**Match Cards — Quad Display:** 2×2 grid of player position tiles with name, department, score, +/- buttons.

**Notifications:** Slide-in `bg-emerald-500 text-white rounded-lg shadow-lg`, auto-dismiss 3s.
**SQL Preview Box:** `bg-slate-50 border border-slate-200 rounded-lg p-4 text-xs font-mono text-slate-800 overflow-x-auto max-h-56`
**Danger Actions:** `bg-red-50 border border-red-200 rounded-xl`, `text-red-700` buttons.

---

### J. MarqueeTicker (Secondary Marquee)

**Container:** `relative w-full overflow-hidden bg-white border-y border-[#E5E0D8] py-2 select-none group`
**Track:** `flex w-max animate-marquee pause-on-hover items-center` — list duplicated for seamless loop.

**Item Pills:** `inline-flex items-center space-x-2.5 mx-3 px-3.5 py-1 rounded-full text-xs border`
- Live: `bg-red-50/80 border-red-200 text-red-950` + radar ping dot (red)
- Non-live: `bg-slate-50 border-[#E5E0D8] text-slate-800`

**Category Badge:** `text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded font-mono`; Live: `bg-red-600 text-white`; Non-live: `bg-white text-slate-700 border border-slate-200`

**Text:** `font-medium text-slate-900 tracking-tight text-xs whitespace-nowrap`

**Content Priority:** Live → Upcoming → Results → Division leaders → Venues → Fallback: enrolled division counts.

---

## 8. Sport-Type Theming

| Type | Badge Text | Color Classes |
|------|------------|--------------|
| `team` — Football / CS Cup | `CS CUP` | `bg-[#153422] text-[#F59E0B] border-[#F59E0B]` |
| `team` — generic | `TEAM` | `bg-blue-50 text-blue-700 border-blue-200` |
| `duo` — Badminton | `DOUBLES` | `bg-sky-50 text-sky-700 border-sky-200` |
| `solo` — Chess | `SOLO 1v1` | `bg-amber-50 text-amber-800 border-amber-200` |
| `free_for_all` | `FREE FOR ALL` | `bg-amber-100 text-amber-900 border-amber-300` |
| `quad` — Carrom | `1v1v1v1` | `bg-violet-100 text-violet-900 border-violet-300 font-mono font-bold` |
| Esports / Gaming | `ESPORTS 1v1` | `bg-indigo-50 text-indigo-700 border-indigo-200` |
| Tennis / Ping Pong | `SOLO 1v1` or `DOUBLES` | `bg-rose-50 text-rose-700 border-rose-200` |
| Basketball / Cricket | `TEAM SQUAD` | `bg-teal-50 text-teal-700 border-teal-200` |
| Custom / Unknown | Auto-assigned | Cycle: Blue → Sky → Amber → Violet → Rose → Emerald → Indigo |

**Carrom rule:** If `type === 'duo'` → sky/Doubles styling. Otherwise → violet/1v1v1v1 regardless of stored type.

---

## 9. Sports Image Rules

**Only 4 sports receive images (Unsplash):**
- Football / CS Cup / Soccer → turf action photo
- Badminton → court photo
- Chess → board photo
- Carrom / Carroms → board photo

All other sports (custom, esports, any virtual game) → **no image**. Cards render a clean solid header.

**Carrom fallback:** Any image URL containing the pattern `1508098682722` is rejected (old placeholder) and replaced with the curated carrom URL.

---

## 10. Mobile & Responsive Layout

| Breakpoint | Width | Key changes |
|------------|-------|-------------|
| (base) | < 640px | 1-col, hamburger nav, condensed hero text |
| `sm` | 640px | 2-col grids, show TICKER label, show ★ MEET badge |
| `md` | 768px | Desktop horizontal nav appears, admin button visible |
| `lg` | 1024px | 3-col sport grid, larger hero font |
| `xl` | 1280px | 4-col sport grid |

- **Global max-width:** `max-w-7xl mx-auto` with `px-4 sm:px-6 lg:px-8`
- **Touch targets:** Minimum `h-11` (44px) for all interactive controls
- **Horizontal tabs:** `overflow-x-auto no-scrollbar` — hides scrollbar, keeps touch-scroll
- **Hero height:** `min-h-[calc(100vh-8.5rem)] lg:min-h-[calc(100vh-7.5rem)]`
- **Leaderboard table:** `overflow-x-auto` for horizontal scroll on small screens

---

## 11. Data State Patterns

| State | Style |
|-------|-------|
| Empty state | `py-8 px-4 text-center rounded-xl bg-slate-50 border-2 border-dashed border-slate-300` |
| Loading | `text-slate-400 text-xs p-8 text-center` |
| Success notification | Slide-in `bg-emerald-500 text-white rounded-lg shadow-lg` |
| Error / danger | `bg-red-50 border border-red-200 rounded-xl text-red-700` |
| Supabase live | Emerald dot `bg-emerald-400` in ticker right panel |
| Local sync mode | Blue dot `bg-blue-400` in ticker right panel |
| Optimistic update | Local state first, Supabase in background; `PGRST204` → graceful retry without quad columns |
