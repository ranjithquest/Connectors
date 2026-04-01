# Connector Admin

A prototype of the **Microsoft 365 Copilot Connector Admin** experience — built for design exploration and feature prototyping. Mirrors the look and feel of the M365 Admin Center.

## Stack

- **Next.js 14** (App Router, TypeScript)
- **Fluent UI v8 + v9** — component library
- **@fluentui/react-icons-mdl2** — icon set
- **Tailwind CSS** — utility-first styling with dark mode support
- **Admin Controls** — first-priority UI component library

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — it redirects to `/connectors`.

## Project Structure

```
app/
  connectors/
    page.tsx              # Connectors list (table view)
    gallery/page.tsx      # Add connector gallery
    [id]/page.tsx         # Connector detail / health view
  [[...slug]]/page.tsx    # Catch-all boilerplate page

components/
  connectors/
    SetupDrawer.tsx       # Connector setup flow drawer
    SimpleSetupDrawer.tsx # Simplified setup drawer variant
  dashboard/
    ConnectorActionsSection.tsx  # Health actions panel
  layout/
    LeftNav.tsx           # Collapsible left navigation
    TopNav.tsx            # Top bar with search and account
    ThemeBar.tsx          # Dark/light mode toggle bar
  wizard/
    WizardRail.tsx        # Step rail for multi-step wizards

lib/
  gallery-data.ts         # Connector catalog data + icon URLs
  mock-data.ts            # Mock connectors for the list view
  types.ts                # Shared TypeScript types

public/
  logos/                  # Local SVG/PNG connector logos
  fluent-banner.webp      # Hero banner for boilerplate page
```

## Adding a New Page

The `app/[[...slug]]/page.tsx` catch-all route serves as the **boilerplate page** for any unrecognised path. To add a real page, create a new folder under `app/` with a `page.tsx` and add a nav entry in `components/layout/LeftNav.tsx`.

## Component Guidelines

- Check **Admin Controls** first for any UI component before reaching for Fluent UI.
- Icons come from `@fluentui/react-icons-mdl2` — browse at [iconcloud.design](https://iconcloud.design/browse/Full%20MDL2%20Assets).
- Charts follow the **Fluent UI Charting** visual style (custom SVG, no external charting lib).

## Contact

Built by the **Connectors Design team** — reach out to Ranjith Ravi or Rohan Baruah for questions.
