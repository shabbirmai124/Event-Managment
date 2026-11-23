# EventPortal — Enterprise Event Management & Media Showcase

A complete, production-ready web application for end-to-end event lifecycle management, ticket reservations, attendee check-ins, sponsorship tracking, financial analytics, and curated event photography management.

---

## Table of Contents

1. [Overview & Key Capabilities](#overview--key-capabilities)
2. [10 Uploaded Event Images — Detailed Explanations](#10-uploaded-event-images--detailed-explanations)
3. [Feature Walkthrough](#feature-walkthrough)
4. [Technology Stack & Architecture](#technology-stack--architecture)
5. [Project Structure](#project-structure)
6. [Getting Started](#getting-started)

---

## Overview & Key Capabilities

EventPortal upgrades the original static HTML prototype (`ProjectDone.html`) into a modular React + TypeScript + Tailwind CSS application with persistent browser state (`localStorage`), real file-upload support, downloadable CSV/JSON exports, printable ticket receipts, and dark/light theme support.

- **10 Full-Featured Events**: Pre-seeded across 10 distinct event formats (Conference, Workshop, Meetup, Webinar, Gala, Hackathon, Forum, Bootcamp, Exhibition, Retreat), complete with agendas, speaker bios, capacities, and pricing.
- **10 Uploaded High-Resolution Photographs + Custom Upload Studio**: Every event is paired with a bespoke `4:3` editorial photograph (`1408 × 1056 px`) documented with venue context and visual composition notes. Organizers can also upload custom JPG/PNG/WEBP files directly from disk.
- **Complete End-to-End Workflows**: No placeholder alerts or stub dialogs—every action uses inline validation, accessible modals, and live state updates across all modules.

---

## 10 Uploaded Event Images — Detailed Explanations

All 10 curated event images reside in `src/assets/images/` and are showcased in the **Media Gallery** section (`src/components/GalleryView.tsx`) as well as linked across the 10 scheduled events (`src/data/seedData.ts`):

### 01. Global Tech Summit Keynote Auditorium
- **File**: `src/assets/images/event_tech_summit_1795427460531.jpg`
- **Event**: Global Tech Summit 2026 (`Conference`)
- **Venue**: Grand Symphony Hall, San Francisco
- **Detailed Explanation**: Shot from the balcony centerline in `4:3` editorial framing, this image captures the main keynote stage under focused spotlights against curved acoustic timber balconies. It communicates auditorium scale, visual clarity, and executive conference production value to prospective attendees and Platinum sponsors.

### 02. Full-Stack Engineering Loft Workshop
- **File**: `src/assets/images/event_web_workshop_1795427464151.jpg`
- **Event**: Modern Web Architecture Workshop (`Workshop`)
- **Venue**: Foundry Brick Studio, Seattle
- **Detailed Explanation**: Documents a collaborative pair-programming session inside a sunlit industrial brick loft. Solid oak worktables, dual-screen developer setups, and tall daylight windows clearly illustrate the 1:6 mentor-to-engineer ratio and hands-on lab seating available to workshop registrants.

### 03. Twilight Founders & Venture Networking Lounge
- **File**: `src/assets/images/event_startup_mixer_1795427464179.jpg`
- **Event**: Startup Founders & Venture Mixer (`Meetup`)
- **Venue**: Skyline Glass Pavilion, New York
- **Detailed Explanation**: Captures an evening founders and seed-investor reception inside a glass-walled skyline lounge. Warm tungsten interior lighting balanced against the twilight cityscape conveys an approachable, curated networking environment, helping guests anticipate dress code, crowd density, and open-floor conversation spacing.

### 04. Broadcast Webinar & Digital Strategy Studio
- **File**: `src/assets/images/event_marketing_studio_1795427464071.jpg`
- **Event**: Digital Growth & Strategy Webinar (`Webinar`)
- **Venue**: Studio B Broadcast Suite (Online)
- **Detailed Explanation**: Showcases the acoustic-treated broadcast desk, boom microphone rig, and soft studio key lighting used for remote webinars. It reassures online ticket holders that they are attending a studio-produced live session with crisp audio and structured visual walkthroughs.

### 05. Annual Creative Leadership Museum Gala
- **File**: `src/assets/images/event_design_gala_1795427463724.jpg`
- **Event**: Annual Design & Leadership Gala (`Gala`)
- **Venue**: Civic Limestone Atrium, Chicago
- **Detailed Explanation**: Architectural photograph of formal linen-draped dining tables arranged beneath a glass skylight and arched limestone colonnades at dusk. Used by VIP table sponsors and individual gala patrons to preview seating layout and evening hospitality ambiance before booking.

### 06. 48-Hour University Innovation Hackathon
- **File**: `src/assets/images/event_ai_hackathon_1795427463487.jpg`
- **Event**: Applied Systems Hackathon (`Hackathon`)
- **Venue**: North Innovation Hall, Boston
- **Detailed Explanation**: Candid documentary view of cross-disciplinary teams mapping architectures on rolling glass whiteboards beside high-density laptop pods. Gives student and professional builders an accurate preview of team workspace, mentor walkways, and collaborative power access.

### 07. Executive FinTech Policy & Markets Panel
- **File**: `src/assets/images/event_fintech_forum_1795427463640.jpg`
- **Event**: Global FinTech & Payments Forum (`Forum`)
- **Venue**: Exchange Plenary Room, London
- **Detailed Explanation**: Features four C-suite panelists on a walnut and brushed-slate stage under directional key lighting. Emphasizes unscripted moderated roundtable dialogue, clear audience sightlines for Q&A, and an intimate plenary format tailored to institutional finance leaders.

### 08. Cloud Infrastructure & Reliability Bootcamp
- **File**: `src/assets/images/event_cloud_bootcamp_1795427464004.jpg`
- **Event**: Cloud Reliability & SRE Bootcamp (`Bootcamp`)
- **Venue**: Systems Engineering Institute, Austin
- **Detailed Explanation**: Architectural photograph of a tiered oak amphitheater lab beneath natural overhead skylights. Demonstrates unobstructed classroom sightlines and dedicated workstation spacing so engineers attending intensive two-day chaos-engineering labs know the instructional setup.

### 09. Industrial Hardware & Product Design Expo
- **File**: `src/assets/images/event_product_expo_1795427463465.jpg`
- **Event**: Industrial & Product Design Expo (`Exhibition`)
- **Venue**: Glasshouse Exhibition Pavilion, Berlin
- **Detailed Explanation**: Highlights minimalist matte-white display plinths, travertine flooring, and generous visitor circulation corridors in a sunlit glass pavilion. Ideal for hardware exhibitors evaluating prototype visibility, lighting quality, and attendee foot-traffic flow.

### 10. Timber Pavilion Executive Strategy Retreat
- **File**: `src/assets/images/event_leadership_retreat_1795427464411.jpg`
- **Event**: Executive Strategy & Leadership Retreat (`Retreat`)
- **Venue**: Cascade Timber Pavilion, Portland
- **Detailed Explanation**: Depicts an intimate 12-seat round oak conference table inside a timber-and-glass woodland pavilion. Communicates the distraction-free, Chatham House Rule executive planning format designed for annual roadmap alignment and peer coaching.

---

## Feature Walkthrough

1. **Dashboard Overview**: Displays real-time KPIs (Published Events, Tickets Issued & Check-In Rate, Ticket Revenue, Active Sponsors), upcoming flagship events spotlight, and recent attendee registrations.
2. **Events Directory & Event Studio**: Live search, category filter, date filter, and price/date sorting. Clicking any event opens a full detail modal with multi-session agenda and speaker details. Organizers can create or edit events and attach images either from the 10-image library or via local file upload.
3. **Media Gallery & Upload Studio**: Filterable showcase of all 10 curated uploaded photographs with detailed editorial explanations, a full-resolution Lightbox Metadata Inspector, and an interactive **Upload New Image** form (`FileReader` data URL persistence).
4. **Ticket Reservation & Checkout**: Event selector, live seat capacity validation, 3% platform processing fee calculation, formatted Credit Card / PayPal / Invoice payment methods, and instant downloadable `.txt` ticket receipts.
5. **Attendee Roster & Check-In**: Filter by event, check-in status (`All`, `Checked In`, `Pending`), or search by ticket code/email; toggle live check-ins; and export filtered rosters as `.csv`.
6. **Wishlist & Reminders**: Bookmark favorite events and configure advance reminder intervals (`2 hours before`, `1 day before`, `3 days before`, `1 week before`).
7. **Sponsors Directory**: Track Platinum, Gold, Silver, and Bronze underwriting tiers with full create/edit/delete management.
8. **Analytics & Financial Reporting**: Live proportional revenue bar breakdown, portfolio seat occupancy, average order value, event performance table, and one-click **Export CSV** / **Export JSON** reports.
9. **Account Management & Help Desk**: Sign in, register new accounts, or use one-click Demo Organizer access, plus a slide-over Portal Help Desk with quick navigation topics.

---

## Technology Stack & Architecture

- **Frontend Framework**: React 18 with strict TypeScript (`tsconfig.json`)
- **Build & Dev Server**: Vite 6 (`host: 0.0.0.0`, `port: 3000`)
- **Styling**: Tailwind CSS v4 (`@tailwindcss/vite`, `@custom-variant dark`)
- **Typography**: `Outfit` (Display), `Plus Jakarta Sans` (UI/Body), `JetBrains Mono` (Tabular Numerals)
- **Icons**: `lucide-react`
- **State Persistence**: Browser `localStorage` with one-click **Reset Demo Dataset** restoration

---

## Project Structure

```text
├── index.html                  # HTML entry with Google Fonts & SEO meta tags
├── metadata.json               # Applet metadata
├── package.json                # Dependencies and Vite scripts
├── vite.config.ts              # Vite + Tailwind v4 config (port 3000)
├── tsconfig.json               # Strict TypeScript configuration
├── README.md                   # Complete documentation & 10-image guide
└── src/
    ├── main.tsx                # React root mount
    ├── index.css               # Tailwind v4 setup & typography rules
    ├── types.ts                # Domain interfaces (Events, MediaAsset, Attendee, Sponsor)
    ├── App.tsx                 # Main workspace shell, state, persistence, routing
    ├── assets/images/          # 10 high-resolution curated event photographs (.jpg)
    ├── data/
    │   └── seedData.ts         # 10 events, 10 detailed media records, attendees, sponsors
    └── components/
        ├── AnalyticsView.tsx   # Revenue bars, occupancy table, CSV/JSON export
        ├── AttendeesView.tsx   # Roster table, live check-in, CSV export
        ├── AuthModal.tsx       # Sign-in, registration, demo organizer login
        ├── BookingView.tsx     # Checkout calculator & downloadable ticket receipts
        ├── ConfirmModal.tsx    # Accessible confirmation dialog
        ├── DashboardView.tsx   # KPI strip, operations bar, spotlight, recent ledger
        ├── EventsView.tsx      # Searchable grid, agenda modal, create/edit with upload
        ├── GalleryView.tsx     # 10-image showcase, lightbox inspector, upload studio
        ├── HelpDrawer.tsx      # Interactive support & navigation desk
        ├── ResilientImage.tsx  # Zero-broken-image wrapper with styled fallback
        ├── SponsorsView.tsx    # Sponsor tiers & CRUD ledger
        ├── ToastContainer.tsx  # In-app notification stack
        └── WishlistView.tsx    # Saved events & configurable reminders
```

---

## Getting Started

```bash
# 1. Install dependencies
npm install

# 2. Start the development server on port 3000
npm run dev

# 3. Type-check and build for production
npm run build
```
