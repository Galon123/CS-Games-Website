# DESIGN SYSTEM: CS Games (Editorial & Humanist Light Theme)

## 1. Overview & Core Philosophy
The CS Department Sports & Gaming platform uses an **Editorial & Humanist Light Theme**. Moving away from high-contrast neon slates, dark gaming aesthetics, and artificial glow effects, this design system focuses on high legibility, structured whitespace, clean single-pixel borders, and tactile sports-journalism layouts.

---

## 2. Color Palette

### Base & Surfaces
* **Canvas Background:** `#FBF9F5` (`bg-[#FBF9F5]` or `bg-slate-50`) — Warm off-white/cream canvas providing an organic, paper-like foundation.
* **Surface Cards:** `#FFFFFF` (`bg-white`) — Crisp white surfaces for cards, tables, and modal dialogs.
* **Borders & Dividers:** `#E5E0D8` / `#E2E8F0` (`border-[#E5E0D8]` or `border-slate-200`) — Razor-thin 1px borders to separate content without heavy drop shadows.

### Typography & Text
* **Primary Text:** `#1A1A1A` / `#0F172A` (`text-[#1A1A1A]` or `text-slate-900`) — High-contrast deep ink charcoal for headings and core copy.
* **Secondary Text:** `#64748B` (`text-slate-500` / `text-slate-600`) — Soft pebble gray for metadata, subtitles, and table headers.

### Primary & Status Accents
* **Primary Accent:** `#2563EB` (`bg-blue-600` / `text-blue-600`) — Royal Blue used for active tabs, primary navigation pills, and main interactive buttons.
* **Field Green (Football Pitch):** `#1F3A2B` (`bg-[#1F3A2B]`) — Deep, realistic turf green dedicated strictly to the football tactical pitch display.
* **Status Indicators:** 
  * Live / Success: `#059669` (`bg-emerald-600`) — Live match status badges and win indicators.
  * Trophy Gold: `#D97706` (`text-amber-600`) — Leaderboards, tournament gold badges, and icon player highlights.

---

## 3.Typography Rules

* **Display & Primary Headings: `Fraunces`**
  * **Classification:** Variable Serif (Display / Warm Editorial)
  * **Usage:** Page titles, hero section headlines, section headings, and sport event titles.
  * **Classes:** `font-serif tracking-tight font-black text-[#1A1A1A]`
  * **Why:** Brings dynamic, calligraphic weight variations that give the department event an authoritative, university-journalism feel.

* **Subheadings, Navigation & Body Copy: `Plus Jakarta Sans`**
  * **Classification:** Modern Humanist / Geometric Sans-Serif
  * **Usage:** Navigation items, body copy, card labels, buttons, inputs, and table headers.
  * **Classes:** `font-sans tracking-normal font-medium text-slate-700`
  * **Why:** Crisp, extremely legible at small sizes, and retains a warm, approachable human feel without looking generic.

* **Numerical Data & Metrics (Strict Rule): `JetBrains Mono`**
  * **Classification:** Monospace
  * **Usage:** Strictly reserved for numerical data: match scores, jersey numbers, points, leaderboards, timestamps, and statistics.
  * **Classes:** `font-mono font-bold text-slate-900`
  * **Why:** Ensures tabular alignment and high visibility for live scores and player stats.
---

## 4. Component Design System

### A. Navigation & Header
* **Style:** Flat white top navigation bar with a bottom border (`border-b border-[#E5E0D8]`).
* **Active Links:** Styled as subtle rounded pills (`bg-blue-50 text-blue-600 font-medium px-3.5 py-1.5 rounded-md`).
* **Logo/Branding:** Bold headline text (`CS GAMES 2026`) paired with a minimal department tag.

### B. Cards & UI Containers
* **Styling:** Flat white background, 1px subtle border, and minimal corner rounding (`rounded-lg` or `rounded-md`).
* **Shadows:** Avoid heavy drop shadows or glassmorphism. Use subtle border definition (`hover:border-slate-300 transition`).

### C. Football Tactical Pitch
* **Background:** Deep realistic forest turf (`bg-[#1F3A2B]`).
* **Pitch Lines:** Crisp off-white regulation markings (`border-white/20`).
* **Player Discs:** Minimalist circular tokens with jersey numbers (`font-mono`) and name badges.

### D. Leaderboard & Scoreboard Tables
* **Structure:** Clean tabular layout with light gray dividing rules (`divide-y divide-slate-100`).
* **Headers:** Soft gray uppercase sans-serif (`text-xs font-semibold text-slate-500 tracking-wider`).
* **Rows:** High contrast with row hovers (`hover:bg-slate-50/80`).

---

## 5. Mobile & Responsive Layout
* **Grid Layouts:** 1 column on mobile (`grid-cols-1`), scaling to 2 or 3 columns on desktop (`md:grid-cols-2 lg:grid-cols-3`).
* **Navigation:** Collapsible mobile menu drawer or horizontal scrollable tab bar for sports navigation.
* **Touch Targets:** Minimum height of 44px (`h-11`) for buttons and interactive controls.
