# Design System — Dark Editorial Sport & Premium Product

> **Codename:** NOIR EDITORIAL
> **Scope:** Social/lineup graphics, fixture & formation posters, marketing web UI, and event/product surfaces that share one visual DNA.
> **Source artifacts:** `Startelvan.` lineup card (Malmö FF) · `Formation` poster (Aston Villa) · `This Week's Fixtures` poster (Aston Villa) · `Padel Social Club` desktop concept · `August Events` calendar tile.
> **Last reviewed:** 2026‑09‑22

---

## 0. TL;DR — The Five Laws

1. **Darkness is the canvas.** Every surface starts from near‑black or a heavily darkened photograph. Light is spent only on type and on one accent.
2. **Type is the hero, not decoration.** Headlines are oversized, high‑contrast, and set in a single voice per surface (editorial serif *or* bold sans — never both on one composition).
3. **Photography is atmosphere, never illustration.** Cinematic, desaturated, single‑source‑lit, vignetted. The image earns its darkness so the words can stay crisp.
4. **One electric accent per context.** Acid‑lime for product/event surfaces; sky‑kit‑blue and Europa‑orange as the editorial track's secondary sparks. Everything else is monochrome.
5. **Restraint reads as prestige.** Asymmetric magazine layouts, vast negative space, terse declarative copy, and tiny tracked meta‑labels do the heavy lifting.

---

## 1. Brand Pillars & Mood

| Pillar | Meaning | Visual proof |
|---|---|---|
| **Editorial** | Borrowed from fashion/print magazines: dominant display type, corner‑anchored meta, full‑bleed imagery. | `Formation`, `This Week's Fixtures` |
| **Cinematic** | Moody, low‑key lighting; subjects lit from one side; deep shadows. | Player portraits in `Startelvan.` |
| **Tactical** | Data (numbers, positions, dates) treated as graphic elements, not captions. | Jersey numbers in lineup & formation |
| **Prestige** | Monochrome crests, hairline rules, generous whitespace, "seamless access" tone. | `Padel Social Club` hero copy |
| **Electric** | A single saturated accent punctuates the monochrome — used sparingly, never for large fills (except featured states). | Acid‑lime in Padel + Events |

**Voice:** confident, terse, declarative. Headlines are single words or short phrases that **end in a full stop** (`Motion.` `Discipline.` `Result.` `Startelvan.`). Secondary information is compressed into uppercase, letter‑spaced strings separated by pipes (`|`).

---

## 2. Color

Two coordinated tracks share one neutral spine. Pick a track per surface; do not mix the accent palettes inside one composition.

### 2.1 Neutral spine (both tracks)

| Token | Hex | Use |
|---|---|---|
| `--ink-900` | `#06080A` | Deepest background, true‑black web canvas |
| `--ink-800` | `#0B0E11` | Default dark background (lineup, posters) |
| `--ink-700` | `#11161A` | Raised panels, card backing |
| `--midnight-teal` | `#0E1A18` | Cool‑cast dark for atmospheric/seat imagery |
| `--paper` | `#FFFFFF` | Pure white type (product track) |
| `--cream` | `#ECE9E1` | Warm off‑white type (editorial track) |
| `--mist` | `rgba(255,255,255,0.55)` | Meta labels, captions on dark |
| `--fog` | `rgba(255,255,255,0.30)` | Disabled / empty tiles, hairlines |
| `--rule` | `rgba(255,255,255,0.12)` | Borders, glass edges, dividers |

### 2.2 Editorial track accents

| Token | Hex | Use |
|---|---|---|
| `--sky-kit` | `#A9D6E5` | Team‑kit blue; appears inside photography, not as UI fill |
| `--europa-orange` | `#EE5A1F` | Competition mark / trophy icon only |

### 2.3 Product / event track accent

| Token | Hex | Use |
|---|---|---|
| `--acid` | `#D7F22B` | Primary accent: CTA fills, highlighted words, featured tiles, glow lines |
| `--acid-hot` | `#C8FF00` | Hover / max‑saturation variant of `--acid` |
| `--acid-ink` | `#0B0E11` | Text placed **on** acid (always dark‑on‑bright) |

### 2.4 Surface treatments

- **Glass tile** (calendar / modules): fill `rgba(255,255,255,0.06)`, border `1px rgba(255,255,255,0.12)`, `backdrop-filter: blur(14px)`, radius `18px`.
- **Solid tile** (active event): fill `#F4F4F2`, text `--ink-900`.
- **Featured tile**: fill `--acid`, text `--acid-ink`.
- **Photo scrim**: linear/radial gradient from transparent → `rgba(6,8,10,0.85)` so type holds contrast over imagery.

> **Contrast rule:** body/meta text on dark must reach ≥ 4.5:1 (`--mist` qualifies at the sizes used; never drop below `--fog` for readable copy). Dark‑on‑acid and cream‑on‑ink both pass AA at display sizes.

---

## 3. Typography

Three display voices exist, split across two tracks, plus a neutral body/meta face. **One display voice per composition.**

### 3.1 Families & roles

| Role | Token | Primary → fallback | Where |
|---|---|---|---|
| Display — Editorial | `--font-serif` | `"Canela Display","Freight Display Pro","Tiempos Headline","Playfair Display",Georgia,serif` | `Startelvan.`, `Formation`, `Fixtures`, jersey numbers + names, poster meta |
| Display — Product | `--font-grotesk` | `"Helvetica Now Display","Neue Haas Grotesk","Archivo","Inter Tight",system-ui,sans-serif` | Padel `Motion./Discipline./Result.`, section heads, stat numbers |
| Display — Rounded | `--font-geo` | `"Poppins","Sora","Outfit","Gilroy",system-ui,sans-serif` | `events` wordmark, calendar numerals |
| Body | `--font-body` | `"Inter","Helvetica Neue",system-ui,sans-serif` | Paragraphs, card copy, nav |
| Meta / Kicker | `--font-meta` | `--font-body`, uppercase, `letter-spacing:.14em`, weight 500 | Dates, venues, pipe‑lists, eyebrows |

### 3.2 Scale (clamp‑based, fluid)

| Step | Size | Line‑height | Tracking | Use |
|---|---|---|---|---|
| `display-xl` | `clamp(3.5rem, 9vw, 8rem)` | 0.92 | `-0.02em` | Full‑bleed poster headlines (`Fixtures`) |
| `display-lg` | `clamp(2.75rem, 6vw, 5.5rem)` | 0.95 | `-0.015em` | Section/hero heads (`Formation`, `events`) |
| `display-md` | `clamp(2rem, 4vw, 3.5rem)` | 1.0 | `-0.01em` | Card titles, triple‑word heroes |
| `num-xl` | `clamp(2.5rem, 5vw, 4rem)` | 1.0 | `0` | Formation / jersey numerals |
| `title` | `1.5rem` | 1.2 | `-0.01em` | Module heads (`TRAIN LIKE A PRO` is meta, this is card name) |
| `body-lg` | `1.125rem` | 1.6 | `0` | Lead paragraphs |
| `body` | `1rem` | 1.6 | `0` | Default copy |
| `meta` | `0.75rem` | 1.4 | `.14em` upper | Kickers, dates, captions |
| `micro` | `0.6875rem` | 1.3 | `.1em` upper | Vertical credits, legal |

### 3.3 Typographic signatures (must‑keep)

- **Terminal full stop** on display words: `Word.` — punctuation is part of the logo‑type.
- **Pipe‑separated meta lists**: `Name | Name | Name` wrapped to 2 lines, top‑right aligned.
- **Number‑over‑name** lockup for athletes/roles: large numeral, small name beneath, baseline‑aligned.
- **Mixed‑case display** in editorial track (`Startelvan.`), **all‑caps** in product eyebrows (`TRAIN LIKE A PRO`), **all‑lowercase** in rounded track (`events`, `august`).
- Serif numerals are **lining**, not oldstyle; set with `font-feature-settings:"lnum"`.

---

## 4. Layout & Grid

### 4.1 Canvas

- Posters/social: **4:5** or **1:1** vertical, full‑bleed image, content pinned to corners (asymmetric, not centered) except the headline block which may center (`Formation`).
- Web: **12‑column** grid, `max-width: 1280px`, side gutter `clamp(20px, 5vw, 64px)`, section vertical padding `clamp(72px, 10vw, 128px)`.
- Calendar/product grids: square tiles, `gap: 12–16px`, 4–7 columns responsive.

### 4.2 Recurring compositions

| Pattern | Description | Ref |
|---|---|---|
| **Portrait matrix** | N‑up grid of 1:1 cropped faces with side‑lit drama; caption row (`no. name`) under each; last row may be short (3 of 4). | `Startelvan.` |
| **Pitch map** | Free‑positioned number+name nodes over a darkened field photo, arranged in tactical rows (GK → DF → MF → FW). | `Formation` |
| **Corner‑anchored poster** | Full‑bleed flat‑lay; crests + meta in opposing corners; lone subject mid‑frame; oversized headline bottom‑anchored. | `Fixtures` |
| **Stacked web sections** | Hero → marquee → blurred‑image band → horizontal card rail → gallery band; each section full‑width, content in container. | Padel |
| **Glass calendar** | Translucent tile grid over atmospheric photo; featured tiles inverted to acid; floating CTA tag at base. | Events |

### 4.3 Spacing scale

`4 · 8 · 12 · 16 · 24 · 32 · 48 · 64 · 96 · 128` (px). Gutters between portrait cards `16–24px`; space above caption row `12px`; meta‑to‑headline gap `24–32px`.

### 4.4 Radii

`--r-sm 6px` (tags, small buttons) · `--r-md 12px` (cards) · `--r-lg 18px` (glass tiles) · `--r-pill 999px` (CTA pills, marquee chips).

---

## 5. Components

| Component | Anatomy | States / notes |
|---|---|---|
| **Display headline** | One display voice, terminal stop optional, tight tracking | Always the largest element on screen |
| **Meta kicker** | Uppercase tracked string; pipe lists allowed; optional leading date | Top‑right or top‑center; `--mist` |
| **Portrait card** | 1:1 image w/ vignette + caption row (`numeral` + `name`) | Hover: subtle zoom + caption brightens |
| **Formation node** | `num-xl` serif over `meta` name | Positioned absolutely on pitch photo |
| **Crest / logo lockup** | Monochrome white mark, optional wordmark | Sits on photo; never recolored to accent |
| **Vertical credit** | 90° rotated `micro` text + small competition icon | Bottom‑right edge |
| **CTA button** | Label + `↗` (or `→` for rails); acid fill or 1px outline | Hover: arrow translates +4x/+4y, bg → `--acid-hot` |
| **Marquee strip** | Repeating uppercase wordmark, hairline rules top/bottom | Continuous horizontal scroll |
| **Stat module** | Big numeral + small label, optional unit (`h`, `+`) | Numerals in display voice |
| **Content/coach card** | Image + name + 2 stats + corner tag (`BOOK A SESSION ↗`) | Horizontal rail, snap‑scroll |
| **Glass tile** | Rounded translucent panel + border + blur | States: `empty` (fog), `default` (solid white), `featured` (acid) |
| **Section header** | Eyebrow `meta` + display title, left or center | Eyebrow often paired with a dot/▸ marker |
| **Physical‑digital overlap** | Real object (racket/net) shot in foreground over the UI | Adds tactile depth; keep out of focus |

---

## 6. Imagery & Art Direction

- **Lighting:** single hard source, side or top; deep falloff to black; rim light on hair/shoulders. No flat studio key.
- **Color grade:** desaturated, cool shadows, lifted only by the kit/accent; skin tones natural but moody.
- **Framing:** tight crops on faces (portrait matrix); extreme wide / top‑down for atmosphere (flat‑lay pitch, empty seats, through‑net).
- **Treatment before type:** apply a scrim gradient; target ≥ 4.5:1 behind any text. Add subtle film grain (2–4%) to kill banding on dark gradients.
- **Subjects:** one hero per atmospheric frame (lone player at corner, empty auditorium) — isolation = prestige.
- **Never:** bright stock smiles, multi‑light setups, saturated backgrounds behind display type, accent color painted onto photography.

---

## 7. Iconography, Logos & Motifs

- **Arrow grammar:** `↗` = external action / reserve / book; `→` = navigate rail / swipe. Thin stroke, matches text weight.
- **Markers:** small dot `●`, triangle `▸`, and the pipe `|` as structural separators.
- **Logos/crests:** always supplied as **monochrome white** SVG for overlay; full‑color versions reserved for white/light surfaces only.
- **Competition marks** (Europa League trophy, league lions) rendered white, except the trophy's intrinsic orange which is the only warm spark in the editorial track.
- **Glow lines** (events): 1px acid strokes tracing object edges = the product track's signature "energy" motif; animate subtly.

---

## 8. Motion & Interaction

| Trigger | Motion | Easing / duration |
|---|---|---|
| Page/section enter | Headline clip‑reveal upward; meta fade‑up staggered 60ms | `cubic-bezier(.2,.8,.2,1)`, 700ms |
| Card hover | Image scale 1.0→1.06; caption `--mist`→`--cream`; lift `translateY(-4px)` | 350ms ease‑out |
| CTA hover | Arrow `↗` translate (+3,+‑3); bg → `--acid-hot`; shadow bloom | 200ms |
| Marquee | Infinite linear translateX | 30–40s / loop |
| Tile hover (glass) | Border brightens to `--rule`→`rgba(255,255,255,.25)`; faint acid edge‑glow | 250ms |
| Scroll (web) | Parallax on full‑bleed imagery (≤ 8%); sticky section labels | rAF, damped |
| Reduced‑motion | Disable parallax, marquee, zoom; keep opacity fades only | honor `prefers-reduced-motion` |

Principle: motion is **quiet and physical** (weight, inertia), never bouncy or playful except the acid glow which may pulse.

---

## 9. Accessibility

- Minimum contrast: body/meta ≥ 4.5:1, display ≥ 3:1 against its background (scrim guarantees this over photo).
- Acid is **decorative fill only**; never rely on it alone to convey state — pair with text/shape (featured tiles also carry full labels).
- Focus rings: 2px `--cream` offset 2px on dark; 2px `--ink-900` on acid/white surfaces.
- Touch targets ≥ 44×44px (CTA pills, tiles).
- All crest/logo overlays get `alt`/`aria-label`; decorative scrims & grain are `aria-hidden`.
- Type remains legible at 200% zoom; display headlines use `clamp()` so they never overflow.

---

## 10. Do / Don't

**Do**
- Anchor content to corners and let negative space breathe.
- Set one display voice per surface and let it dominate.
- End hero words with a full stop; compress facts into pipe‑meta.
- Darken photography until the type is unmistakable.
- Use the single accent for action and emphasis only.

**Don't**
- Don't mix serif + grotesque + rounded in one composition.
- Don't place display type on un‑scrimsed bright imagery.
- Don't tint crests/logos with the accent or use full‑color marks on dark.
- Don't fill large areas with acid (except a featured tile / CTA).
- Don't center everything — asymmetry is the editorial signature.
- Don't add drop shadows to type; separation comes from darkness, not shadow.

---

## 11. Token Reference (CSS custom properties)

```css
:root{
  /* neutrals */
  --ink-900:#06080A; --ink-800:#0B0E11; --ink-700:#11161A; --midnight-teal:#0E1A18;
  --paper:#FFFFFF; --cream:#ECE9E1;
  --mist:rgba(255,255,255,.55); --fog:rgba(255,255,255,.30); --rule:rgba(255,255,255,.12);
  /* editorial accents */
  --sky-kit:#A9D6E5; --europa-orange:#EE5A1F;
  /* product accent */
  --acid:#D7F22B; --acid-hot:#C8FF00; --acid-ink:#0B0E11;
  /* surfaces */
  --glass-fill:rgba(255,255,255,.06); --glass-line:rgba(255,255,255,.12);
  --tile-solid:#F4F4F2;
  /* type */
  --font-serif:"Canela Display","Freight Display Pro","Tiempos Headline","Playfair Display",Georgia,serif;
  --font-grotesk:"Helvetica Now Display","Neue Haas Grotesk","Archivo","Inter Tight",system-ui,sans-serif;
  --font-geo:"Poppins","Sora","Outfit","Gilroy",system-ui,sans-serif;
  --font-body:"Inter","Helvetica Neue",system-ui,sans-serif;
  --font-meta:var(--font-body);
  /* radii */
  --r-sm:6px; --r-md:12px; --r-lg:18px; --r-pill:999px;
  /* spacing */
  --s-1:4px; --s-2:8px; --s-3:12px; --s-4:16px; --s-5:24px; --s-6:32px;
  --s-7:48px; --s-8:64px; --s-9:96px; --s-10:128px;
  /* motion */
  --ease-out:cubic-bezier(.2,.8,.2,1); --dur-fast:200ms; --dur-mid:350ms; --dur-slow:700ms;
}
/* meta label helper */
.meta{font:500 .75rem/var(--lh,1.4) var(--font-meta);text-transform:uppercase;letter-spacing:.14em;color:var(--mist);}
/* CTA helper */
.cta{display:inline-flex;gap:.5em;align-items:center;padding:.85em 1.4em;border-radius:var(--r-pill);
     background:var(--acid);color:var(--acid-ink);font:600 .8125rem var(--font-body);letter-spacing:.08em;text-transform:uppercase;}
.cta:hover{background:var(--acid-hot);}
.cta .arrow{transition:transform var(--dur-fast) var(--ease-out);}
.cta:hover .arrow{transform:translate(3px,-3px);}
/* glass tile helper */
.tile{border-radius:var(--r-lg);background:var(--glass-fill);border:1px solid var(--glass-line);
      backdrop-filter:blur(14px);aspect-ratio:1;display:grid;place-content:center;gap:.25em;text-align:center;}
.tile--solid{background:var(--tile-solid);color:var(--ink-900);border-color:transparent;}
.tile--featured{background:var(--acid);color:var(--acid-ink);border-color:transparent;}
@media (prefers-reduced-motion:reduce){*{animation:none!important;transition-duration:1ms!important;}}
