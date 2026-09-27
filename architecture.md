# CS Games 2026 - Architecture & Component Structure

This document outlines the high-level architecture and page interconnection for the CS Games 2026 platform. The application is built using Next.js 14 (App Router), React, Tailwind CSS, and Context APIs for state management.

## 1. Global Layout & State Management (\`app/layout.tsx\`)
The root layout serves as the wrapper for the entire application, injecting global fonts (Anton, DM Sans, Plus Jakarta Sans), the top \`Navbar\`, the global \`Footer\`, and two essential context providers:
- **ThemeProvider:** Handles Light/Dark mode toggling.
- **TournamentProvider:** Manages global state including \`isAdmin\` (for unlocking the admin console) and \`liveMatch\` telemetry.
- **LiveMatchOverlay:** A globally mounted floating widget that reads from \`TournamentContext\` and displays live scores anywhere on the site when a match is active.

## 2. Main Landing Page (\`app/page.tsx\`)
The homepage is a single-page scrolling experience composed of stacked sections:
1. **HeroPresentationCarousel:** The main banner slider showcasing high-impact editorial imagery.
2. **SeptemberEvents:** A custom timeline/grid displaying the official schedule (CS Cup, Badminton, Esports, etc.) pulling data from \`lib/events-data.ts\`.
3. **AboutSection:** Features the main event poster and descriptive copy detailing the spirit of the intra-departmental championship.
4. **SponsorsBox:** A statically aligned grid showcasing partners and sponsors.

## 3. Dedicated Event Views (e.g., \`app/games/football/page.tsx\`)
When users navigate to a specific sport (e.g., Football / CS Cup), they are taken to a dedicated view:
- **CsCupView:** A massive, tab-driven component replacing standard generic views.
  - **Tabs:** Home (Upcoming Fixtures & Meet the Teams), Matches (Results & Live Match Triggers), Points Table, and Stats (Top Scorers & Goalkeepers).
  - **Interactive Modals:** Clicking on teams opens squad cards (e.g., \`S1.png\`, \`S3.png\`), and clicking on finished matches opens detailed statistical breakdowns (goals, assists, shots, saves).

## 4. Administration Console (\`app/admin/page.tsx\`)
The secured `/admin` route is the nerve center for tournament organizers.
- **AdminPanel:** Provides a tactical interface to manage matches, update points tables, create athlete profiles, and edit the live telemetry score. 
- Features heavily brutalist typography (Anton) and utility-first data inputs.

## 5. Data Flow & Telemetry
- Static data (like the September schedule and placeholder team stats) is housed in \`lib/\` and mocked inside components like \`CsCupView.tsx\`.
- Real-time or user-edited data (like the Live Match Score) is stored in the \`TournamentContext\` and synchronized across tabs using \`localStorage\`.
- The **Navbar** dynamically reacts to the \`liveMatch\` state, displaying a pulsating red "LIVE MATCH" indicator globally whenever an admin initiates a live session.
