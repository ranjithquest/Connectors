# Connector Admin

A shared prototyping environment for **product, design, and engineering** teams to rapidly build and preview feature concepts for the Microsoft 365 Copilot Connectors admin experience.

This project mirrors the look and feel of the M365 Admin Center and is pre-wired with realistic mock data, Fluent UI components, and a GitHub Pages preview pipeline — so every branch gets its own shareable URL automatically.

---

## For Everyone — Quick Start

### Run locally
```bash
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) — redirects to `/connectors`.

### Prototype a feature
1. Create a branch from `main`:
   ```bash
   git checkout main
   git pull gim-connectors main
   git checkout -b your-name/feature-name
   ```
2. Make your changes
3. Push the branch using `/publish` in Claude Code — it handles the rest
4. GitHub Actions builds and deploys it automatically. A **preview URL** is posted as a comment on your commit — share it with stakeholders.
5. When approved, use `/handoff` in Claude Code to cherry-pick approved files into `main`.

> **Never push directly to `main`.** All work goes through feature branches.

---

## For Product — Prototyping a Spec

You don't need to write code. Work with Claude Code or an engineer to turn your spec into a working prototype:

1. Share your spec (written doc, Figma link, or bullet points)
2. Claude will create a feature branch and build the concept
3. You get a preview URL to share with stakeholders
4. Decide which parts to promote to `main`

**Tips:**
- Mock data lives in `lib/mock-data.ts` — easy to add new connector states, issues, or sync history without touching UI code
- The connector list, detail panel, setup flow, and gallery are all prototypable independently

---

## For Design — Working with Figma

Before implementing from a Figma file:
- Make sure the **Figma MCP plugin** is installed in Claude Code
- Make sure the **Playwright MCP plugin** is installed for visual verification

Share your Figma URL with Claude and it will extract layout, components, and tokens directly.

**Design rules baked in:**
- All icons come from `@fluentui/react-icons-mdl2` — [browse here](https://iconcloud.design/browse/Full%20MDL2%20Assets). If an icon is not in MDL2, fall back to `@fluentui/react-icons`. No other icon libraries.
- Components use **Fluent UI v8/v9** — not custom Tailwind components
- Charts follow the **Fluent UI Charting** visual language

---

## For Engineering — Project Structure

```
app/
  (app)/connectors/
    page.tsx                    # Gallery + Your connections (single-page with tabs)

  get-started/
    page.tsx                    # Onboarding / get started page

  layout.tsx                    # Root layout with dark mode + Fluent provider
  globals.css                   # CSS variables, dark mode overrides, drawer sizing

components/
  connectors/
    SetupPanel.tsx              # New connector setup wizard (simple mode)
    AdvancedSetupPanel.tsx      # Full edit panel: Setup/Users/Content/Sync pivot tabs
    ConnectorDetailPanel.tsx    # Read-only connector detail panel
    ISVPanel.tsx                # ISV connector detail panel
    SetupGuideRail.tsx          # Accordion guide rail used in setup panels
    EditPanel.tsx               # Edit wrapper that opens AdvancedSetupPanel
  layout/
    LeftNav.tsx                 # Collapsible left navigation

lib/
  mock-data.ts                  # Connector mock instances + diagnostic issues
  gallery-data.ts               # Connector catalog (type, logo, config schema)
  types.ts                      # Shared TypeScript types

.claude/commands/               # Claude skills: /setup, /publish, /walkthrough, /handoff
public/
  logos/                        # Connector logo PNGs/SVGs
```

### Stack
- **Next.js 14** (App Router, TypeScript, static export)
- **Fluent UI v8** (`@fluentui/react`) + **v9** (`@fluentui/react-components`)
- **`@fluentui/react-icons-mdl2`** — primary icon library
- **Tailwind CSS** — layout and utility styling only
- **Admin Controls** — first-priority UI component library

### Component priority order
1. **Admin Controls** — check first for any UI component
2. **Fluent UI v9** — for modern components (Button, Badge, MessageBar, Card, etc.)
3. **Fluent UI v8** — for components not yet in v9 (Panel, Pivot, Stack, TextField, etc.)
4. **Tailwind** — layout spacing and page structure only, never for UI components

### Adding mock data
Edit `lib/mock-data.ts` to add connectors, sync history, issues, or change health states. The UI reads directly from this file — no API needed.

---

## Key UI behaviours

### Gallery page
- Hero banner + connector cards with slide-down animation
- Left sidebar (search + category filter) visible at ≥1280px; collapses to scrollable chips below
- "Add" opens the setup wizard

### Your connections tab
- DataGrid with status, health badges, last sync time
- User-created connectors float to top; show "Now" for last sync until first real sync
- Delete only available on user-created connectors

### Setup panel
- Fluent Drawer sizing: 100vw <1024px · 90vw 1024–1279px · 80vw ≥1280px
- Right guide rail: **static side column** when panel width ≥800px, **overlay** when narrower
- Rail collapses automatically via `ResizeObserver` — no hardcoded viewport breakpoints
- Confirmation screen shown on successful connector creation

### Advanced setup / edit panel
- Pivot tabs: Setup · Users · Content · Sync
- Right rail: **Actions** tab (issue cards, inline fix actions) + **Guide** tab
- Same ResizeObserver-driven rail collapse as setup panel (threshold: 800px)
- Shimmer skeleton shown when switching from Simple → Advanced mode
- Manage Properties: v8 CommandBar toolbar, Content Property dropdown, Badge tags for content type

### Right rail behaviour summary

| Panel content-row width | Behaviour |
|---|---|
| ≥800px | Static side column, always visible |
| <800px (collapsed by user or auto) | Hidden; "Guide" / "Actions & Guide" button opens as overlay |

### Dark mode
Full dark mode via `.dark` class on `<html>`, mapped to Fluent `webDarkTheme` tokens. Covers nav, surfaces, inputs, dropdowns, Fluent v8 components, and all status/health pill colours.

---

## Branch and Deployment Model

| Branch | Purpose | Preview URL |
|---|---|---|
| `main` | Protected shared baseline | `<pages-url>/connectors` |
| `your-name/feature` | Concept in progress | `<pages-url>/<branch-slug>/connectors` |

Every push to a feature branch triggers an automatic deployment. The preview URL is posted as a comment on your commit.

**To promote approved work to main:**
```bash
git checkout main
git checkout your-name/feature -- components/SomeComponent.tsx
git commit -m "Promote SomeComponent — approved by [stakeholder name]"
git push gim-connectors main
```

Or use `/handoff` in Claude Code — it handles this automatically.

---

## Recovery

A `v1.0-stable` tag marks the original stable state. To restore:
```bash
git checkout v1.0-stable
git checkout -b recovery-branch
git push gim-connectors recovery-branch
```

---

## Contact

Built by the **Connectors Design team** — reach out to Ranjith Ravi for questions.
