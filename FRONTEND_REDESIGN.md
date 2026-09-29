# SC-LogiX Frontend Redesign Specification

## Status of This Document

This document defines the **Modern Control Tower & Analytics Dashboard Theme** for the SC-LogiX frontend. The visual design system is derived from modern intelligent logistics and operations platforms (featuring elevated light-mode surfaces, micro-visualizations, vibrant operational accent tiles, and clean geometric typography).

> **Important**: This redesign applies strictly to the visual theme, typography, layout aesthetics, and component presentation. All existing backend APIs (`/api/dashboard`, `/api/inventory`, `/api/shipments`, etc.), data contracts, business calculations, and supported user actions remain 100% intact and authoritative.

---

## A. Design Philosophy

The modern SC-LogiX interface is an **Intelligent Supply Chain Control Hub**. It moves beyond plain administrative data tables to deliver an executive-grade, decision-first experience characterized by:

1. **Airy, High-Clarity Canvas**: Replacing generic flat grays with a subtle, radiant light canvas (`#F4F7FB` to `#F8FAFC`) with soft lavender/cool undertones that reduce eye strain and make white cards float naturally.
2. **Elevated Card Architecture**: Pure white surfaces featuring generous border radius (`rounded-2xl` / 16px–20px) and soft, diffused multi-layered ambient shadows (`0 10px 25px -5px rgba(15, 23, 42, 0.04)`).
3. **Typography with Punch & Elegance**: Geometric sans-serif typography (`Plus Jakarta Sans` / `Inter`) with large, bold numeric display (32px–36px) paired with subtle, spaced uppercase tracking labels (`text-xs font-semibold uppercase tracking-wider`).
4. **Embedded Micro-Visualizations**: Highlighting trend directions inside KPI cards via embedded Recharts sparklines (smooth area curves, mini 5-day bar sparklines, and segmented progress meters).
5. **Vibrant Operational Accent Tiles**: Saturated, rounded operational tiles (Amber, Coral Rose, Electric Indigo, Emerald Green) for high-impact status callouts and instant pattern recognition.
6. **Friendly, Human-Centered Navigation**: Personalized time-aware greeting ("Good morning / afternoon, Operations Lead") combined with sleek rounded-full pill buttons and status pills.

---

## B. Modern Visual Design System

### 1. Color Palette & Tokens

| Purpose | Design Token | Hex / Class | Visual Treatment |
|---|---|---|---|
| **App Canvas** | `--bg-canvas` | `#F4F7FB` | Subtle cool blue-gray tinted background |
| **Card Surface** | `--bg-surface` | `#FFFFFF` | Crisp white with `rounded-2xl` and diffused shadow |
| **Card Border** | `--border-card` | `#F1F5F9` | Ultra-subtle slate border for clean definition |
| **Primary Brand** | `--primary-blue` | `#2563EB` | Vibrant Cobalt Blue for primary CTAs and active states |
| **Primary Hover** | `--primary-hover` | `#1D4ED8` | Deep Cobalt Blue for interactive hover states |
| **Secondary Accent** | `--accent-orange` | `#F97316` | Warm Tangerine / Orange for warnings and highlights |
| **Dark Neutral (Text)** | `--text-heading` | `#0F172A` | Slate-900 for ultra-crisp headings and metrics |
| **Muted Neutral (Text)** | `--text-muted` | `#64748B` | Slate-500 for secondary descriptions and labels |
| **Tile: Amber/Warning** | `--tile-amber` | `#F59E0B` | Saturated amber card with dark/white metric punch |
| **Tile: Coral/Danger** | `--tile-coral` | `#F43F5E` | Saturated coral-rose card for critical exception callouts |
| **Tile: Indigo/AI** | `--tile-indigo` | `#6366F1` | Vibrant indigo card for AI decisions and automation |
| **Tile: Emerald/Success** | `--tile-emerald` | `#10B981` | Vibrant emerald green card for savings and healthy KPIs |

### 2. Typography

- **Primary Font Stack**: `'Plus Jakarta Sans', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`
- **Metric Values**: `text-3xl` to `text-4xl` (30px–36px), `font-bold` or `font-extrabold`, `tracking-tight text-slate-900`
- **Metric Labels**: `text-xs` (11px–12px), `font-semibold uppercase tracking-wider text-slate-500`
- **Section Headings**: `text-xl` to `text-2xl` (20px–24px), `font-bold text-slate-900`
- **Body & Subtitles**: `text-sm` (13px–14px), `text-slate-600` or `text-slate-500`

### 3. Surface & Elevation Guidelines

- **Cards**:
  ```css
  background: #ffffff;
  border-radius: 1rem; /* 16px - 20px */
  border: 1px solid #f1f5f9;
  box-shadow: 0 4px 20px -2px rgba(15, 23, 42, 0.04), 0 2px 6px -1px rgba(15, 23, 42, 0.02);
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  ```
  *Hover state*: `transform: translateY(-2px); box-shadow: 0 12px 30px -4px rgba(15, 23, 42, 0.08);`
- **Pill Buttons & Badges**:
  - Full pill radius: `rounded-full` (`px-4 py-2` or `px-5 py-2.5`).
  - Primary button: `bg-blue-600 text-white font-medium shadow-md shadow-blue-500/20 hover:bg-blue-700 active:scale-[0.98]`.
  - Secondary button: `bg-white border border-slate-200 text-slate-700 font-medium hover:bg-slate-50 shadow-sm`.
  - Status pills: `rounded-full text-xs font-semibold px-3 py-1` with soft tinted background and bold colored text.

### 4. Micro-Visualizations in KPI Cards

Each flagship KPI card includes an embedded micro-chart to provide instantaneous trend context:
1. **Total Shipments**: Includes a mini 5-day vertical bar sparkline (`Recharts` or lightweight SVG) alternating blue and orange accents.
2. **On-Time Delivery Rate**: Features a smooth curved Recharts `AreaChart` sparkline in vibrant blue with gradient fill.
3. **Fleet Utilization**: Displays a dual-segment progress bar or mini circular meter representing active vs available capacity.
4. **Inventory Health**: Displays a smooth percentage radial or segmented health bar.

### 5. High-Impact Operational Accent Tiles

Inspired by modern control-tower overviews, the interface features a 4-tile grid of high-contrast, rounded colorful cards:
- **In-Transit Fleet Pulse** (Vibrant Blue): Live vehicle load and movement rate.
- **Unrealized Cost Savings** (Emerald Green): Projected savings waiting for AI recommendation execution.
- **Active Exceptions & Delays** (Coral Rose): High-risk delayed shipments requiring immediate triage.
- **Stockout Vulnerability** (Warm Amber): SKUs currently resting below emergency reorder points.

---

## C. Application Shell and Navigation

`frontend/src/components/Layout.jsx` provides the modern application shell:
- **Sidebar**: Modernized with a sleek dark-slate aesthetic (`#0F172A`) or clean light-slate contrast, featuring rounded-xl active route highlights, glowing primary accents, and clear navigation icons.
- **Header Top Bar**: Elevated with a clean white surface, rounded-full search or filter affordances, real-time date display pill, notification bell badge, and user profile block with avatar pill.
- **Main Viewport**: Clean `#F4F7FB` background with fluid spacing and smooth page transitions.

---

## D. Route Architecture & APIs

All existing routes and API integrations remain unaltered:

| Route | View | API Endpoint | Notes |
|---|---|---|---|
| `/` or `/command-center` | Command Center | `GET /api/dashboard`<br>`POST /api/alerts/recommendations/:id/apply` | Redesigned with new visual theme, micro-charts, and accent tiles. |
| `/network` | Supply Chain Map | Placeholder | Retains existing placeholder; map data integration reserved for future work. |
| `/inventory` | Inventory Risk | `GET /api/inventory/risks` | Existing operational logic preserved. |
| `/warehouses` | Warehouses | `GET /api/warehouses` | Existing operational logic preserved. |
| `/shipments` | Shipments | `GET /api/shipments` | Existing operational logic preserved. |
| `/fleet` | Fleet Operations | `GET /api/fleet` | Existing operational logic preserved. |
| `/optimization` | AI Optimization | `POST /api/optimization/*` | Existing operational logic preserved. |
| `/analytics` | Predictive Analytics | `GET /api/analytics/*` | Existing operational logic preserved. |
| `/alerts` | Insights & Alerts | `GET /api/alerts`<br>`PATCH /api/alerts/:id/resolve` | Existing operational logic preserved. |
| `/reports` | Executive Reports | `GET /api/reports/*` | Existing operational logic preserved. |

---

## E. Reusable Component Redesign Specifications

### 1. `KPICard.jsx`
- Updated to `rounded-2xl` with subtle border and floating shadow.
- Supports optional micro-charts (sparklines, mini bars, or progress meters).
- Large bold numbers (`text-3xl text-slate-900`) and upper-right diagonal arrow icon (`ArrowUpRight`).
- Pill badge for percentage changes (`+3.4% this period`).

### 2. `AIDecisionCard.jsx`
- Clean white card with `rounded-2xl` corners and soft left border accent.
- Rounded pill severity badges (`Critical`, `High`, `Medium`).
- High-visibility impact cards for Cost Savings and Time Saved with green/blue tinted badges.
- Prominent `btn-primary` button for "Apply Recommendation" with loading spinner state.

### 3. `StatusBadge.jsx`
- Enhanced with `rounded-full` pill styling, soft pastel background, matching font weight, and consistent padding.

---

## F. Command Center Redesign Architecture

The redesigned Command Center (`frontend/src/pages/CommandCenter.jsx`) is structured as follows:

```
+-----------------------------------------------------------------------------------+
|  GREETING & ACTION HEADER                                                         |
|  "Good morning, Operations Lead" | "Real-time Supply Chain Health & Decisions"    |
|  [ Last 30 Days ] [ Export CSV ] [ ⟳ Refresh Dashboard ]                          |
+-----------------------------------------------------------------------------------+
|  TOP ROW: 4 CORE KPI CARDS (with embedded micro-sparklines)                       |
|  [ Total Shipments ]    [ On-Time Rate ]    [ Inventory Health ]  [ Fleet Util. ] |
|  (with 5-day mini bars) (with area curve)   (with radial meter)   (with mini ring)|
+-----------------------------------------------------------------------------------+
|  OPERATIONAL ACCENT TILES (Image 1 High-Saturation Tiles)                         |
|  [ Amber: Stockout ]    [ Rose: At-Risk ]   [ Indigo: Cost ]      [ Green: Saving]|
+-----------------------------------------------------------------------------------+
|  SPLIT SECTION:                                                                   |
|  LEFT (2/3 Col): NETWORK HEALTH & AI DECISIONS  | RIGHT (1/3 Col): EXCEPTION WATCH|
|  - Circular Health Gauge & Breakdown Stages     | - Alert list with pill badges   |
|  - AI Decision Cards with 1-click execution     | - Quick category counts         |
+-----------------------------------------------------------------------------------+
```

---

## G. Quality and Aesthetic Standards

1. **No Low-Fi Default Elements**: Zero browser default buttons or plain HTML selects. All controls use styled pill buttons or clean custom containers.
2. **Animation & Interaction**: Subtle enter animations (`fade-in-up`), smooth card hover elevation (`translate-y-[-2px]`), and responsive button press states (`active:scale-[0.98]`).
3. **Data Authenticity**: Every metric displayed maps directly to data returned by `api.getDashboard()`. No dummy data is hardcoded where real backend fields exist.
