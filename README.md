# Growth Model

A funnel-based acquisition planning tool for modeling user growth across multiple channels.

---

## Features

- **Matrix Overview** -- All channels displayed in a single table with editable conversion rates at each funnel step
- **Channel Detail** -- Full funnel visualization with bar charts, timestamped notes, team assignments, and pre-funnel breakdowns
- **Time Projection** -- Compound growth model factoring organic growth rate, churn rate, and viral K-factor across configurable weeks
- **Week Matrix** -- Per-channel weekly breakdown showing how channel multipliers distribute activations over time
- **Planned vs Actual** -- Snapshot comparison against real numbers, with the ability to save projections and overlay actuals
- **Financial Projections** -- B2C Premium, B2B Sponsored Notifications, custom revenue streams, and expense tracking
- **Revenue Stream Types** -- Fixed Monthly (flat $/mo), User-Based (mirrors B2C accumulation logic), Campaign-Based (mirrors B2B with a monthly plan)
- **Scenario Toggling** -- Switch between Base (1.0x), Conservative (0.7x), and Optimistic (1.3x) multipliers
- **Dark / Light Theme** -- Toggle between color schemes
- **Auto-Save** -- Changes persist automatically via server API or localStorage fallback
- **JSON Import / Export** -- Backup and share models as JSON files
- **Shareable URL Hash Routing** -- Navigate directly to specific views via URL hash

---

## Getting Started

Open `index.html` directly in a browser. No build step is required.

For persistent server-side storage, run the Node.js server:

```bash
node server.js
# Open http://localhost:3456
```

For cloud deployment, push to Netlify or Vercel (configuration files are included).

The tool loads default example data on first visit. To use your own data, import a `data.json` file through the UI.

---

## Data Model Overview

All state is stored in a single `data.json` file. Here is what each top-level key contains:

| Key | Purpose |
|-----|---------|
| `meta` | Current user count, target goal, deadline date, last updated timestamp |
| `channels[]` | Acquisition channels, each with a name, description, platform, confidence level, funnel steps, notes, and detailed breakdown |
| `weekly[]` | Week-by-week targets and actuals for manual tracking |
| `projection` | Growth projection settings (start users, organic rate, churn rate, K-factor), week definitions, and per-channel multiplier arrays |
| `financial` | Complete financial model: B2C pricing and assumptions, B2B cost-per-user model, campaigns with monthly plans, custom revenue streams, and expenses |
| `snapshots[]` | Saved projection snapshots for planned vs actual comparison |
| `actuals[]` | Real user numbers recorded per week for comparison against projections |
| `phases[]` | Timeline phases with assigned channels, dates, and visual styling |
| `platforms[]` | Available platform options (e.g., app, telegram, both) |
| `project` | Project metadata: name, description, branding, goals, and milestones |

### Example Structure

```json
{
  "meta": {
    "current": 1437,
    "target": 5000,
    "deadline": "2026-03-31",
    "lastUpdated": "2026-02-09T18:55:41.310Z"
  },
  "channels": [...],
  "projection": {
    "settings": { "startUsers": 1434, "organicRate": 0.25, "churnRate": 3, "kFactor": 0.03 },
    "weeks": [...],
    "channelMultipliers": { "channelId": [0, 0, 0.8, 0.2, ...] }
  },
  "financial": {
    "b2c": { "enabled": true, "launchDate": 8, "pricing": {...}, "assumptions": {...} },
    "b2b": { "enabled": true, "launchDate": 3, "costPerUser": 0.45, ... },
    "campaigns": [...],
    "customStreams": [...],
    "expenses": [...]
  },
  "snapshots": [...],
  "actuals": [...]
}
```

---

## Views Explained

### Matrix

All channels in one table. Each row shows a channel with its funnel steps and conversion rates. Values are editable inline, and downstream numbers recalculate instantly.

### Channel Detail

Full breakdown for a single channel. Includes the funnel visualized as horizontal bars, pre-funnel breakdown (e.g., "60 power users, 20 will post, 30K impressions"), strategy notes, team assignments, checklists, and templates.

### Time Projection

Compound growth model rendered as a chart. Configurable settings include organic growth rate, weekly churn rate, and viral K-factor. Each channel has per-week multipliers that control when its activations land.

### Week Matrix

A grid showing each channel's contribution per week. Multiplier values (0.0 to 1.0) control what fraction of a channel's total activations land in each week. The sum across all weeks for a channel should equal 1.0 (or close to it).

### Planned vs Actual

Compare saved projection snapshots against real numbers. Save a snapshot at any time to capture the current projection. Enter actual user counts per week and see the delta between plan and reality.

### Financial

Overview of all revenue and expense projections. Shows key metrics (MRR, ARR, ARPU) and a combined revenue chart. Links to the detail views below.

### B2C Detail

Premium subscription model. Configurable parameters include monthly price, conversion rate (free to premium), monthly churn rate, days to convert, and active user percentage. Revenue accumulates as users convert and churn is applied monthly.

### B2B Detail

Sponsored notifications model. Uses cost-per-user pricing and campaign activations. Each campaign has a monthly plan specifying how many activations occur per month.

### Campaign Detail

Manage individual B2B campaigns. Each campaign has a client name, status, notes, and a monthly plan defining activations per month (e.g., "2026-03": 2, "2026-04": 5).

### Expense Detail

Track monthly operating expenses. Each expense has a name, monthly amount, launch week (when it starts), and a monthly growth ratio (e.g., 1.05 means 5% month-over-month increase).

### Stream Detail

Custom revenue streams beyond B2C and B2B. Three types are available:

- **Fixed Monthly** -- A flat dollar amount per month
- **User-Based** -- Mirrors B2C accumulation logic with its own conversion rate, churn, and pricing
- **Campaign-Based** -- Mirrors B2B with a monthly activation plan and cost-per-user

---

## Financial Model Explained

### B2C: Premium Subscriptions

Users convert from free to premium at a configurable conversion rate. Monthly churn is applied to the existing premium base, and new conversions are added each period. Revenue equals retained premium users multiplied by the monthly price.

Key parameters:
- Monthly price
- Conversion rate (% of active users converting per period)
- Monthly churn rate (% of premium users lost per period)
- Active user percentage (% of total users considered active)

### B2B: Sponsored Notifications

Revenue from partner projects sending targeted notifications to users. The model uses a cost-per-user rate and campaign activations.

Key parameters:
- Cost per user reached
- Addressable user percentage
- Campaign activations per month (defined per campaign)

### Custom Streams

Three configurable types for modeling additional revenue:

| Type | Behavior |
|------|----------|
| **Fixed Monthly** | Flat dollar amount per month, starting from a configured launch week |
| **User-Based** | Mirrors B2C logic with its own conversion rate, churn, and monthly price. Accumulates subscribers over time. |
| **Campaign-Based** | Mirrors B2B logic. Uses a monthly activation plan and cost-per-user. |

### Expenses

Monthly operating costs with optional growth ratios. Each expense has:

- **Monthly amount** -- Base cost per month
- **Launch week** -- When the expense starts (week index)
- **Monthly ratio** -- Growth multiplier applied each month (1.0 = flat, 1.05 = 5% monthly increase)

### Scenarios

All financial projections support three scenarios:

| Scenario | Multiplier | Use Case |
|----------|------------|----------|
| Conservative | 0.7x | Pessimistic assumptions for risk planning |
| Base | 1.0x | Default, most likely outcome |
| Optimistic | 1.3x | Best-case projections |

---

## Deployment

### Static (Local)

Open `index.html` directly in a browser. Data is saved to localStorage. No server required.

### Node.js Server

```bash
node server.js
# Serves on http://localhost:3456
# Data persists to data.json on disk
```

### Netlify

A `netlify.toml` and serverless function (`netlify/functions/save.mjs`) are included. Push the project directory to a Netlify site and it will work out of the box.

```
netlify.toml        -- Build config and redirects
netlify/functions/  -- Serverless save function
```

### Vercel

A `vercel.json` and API route (`api/save.js`) are included. Push to Vercel for automatic deployment.

```
vercel.json   -- Rewrite rules
api/save.js   -- Serverless save function
```

---

## Data Import / Export

**Export:** Download the current model as a JSON file. Use this to create backups or share the model with team members.

**Import:** Upload a JSON file to replace the current model. This is useful for restoring backups, switching between different growth plans, or sharing models across devices.

All data lives in a single JSON file, making it easy to version control, diff, and merge.

---

## File Structure

```
otomato-growth-model/
  index.html              -- Single-page application (all views)
  data.json               -- Current model data (source of truth)
  example-data.json       -- Example data for reference
  server.js               -- Node.js server for local persistence
  image.png               -- Screenshot
  netlify.toml            -- Netlify deployment config
  netlify/functions/      -- Netlify serverless functions
    save.mjs
  vercel.json             -- Vercel deployment config
  api/
    save.js               -- Vercel serverless function
  growth-model-context.md -- Discussion context and channel details
  financial-model-spec.md -- Financial model specification
  growth-plan-5k-users.md -- Growth plan documentation
```
