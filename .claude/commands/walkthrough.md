# /walkthrough — Add a Guided Tour to a Prototype

This skill adds an interactive step-by-step walkthrough to the current concept for stakeholder presentations and LT reviews. Claude handles everything — you just describe the flow.

## What it does
- Adds numbered hotspot annotations anchored to specific UI elements
- Fluent UI styled tooltip cards with prev/next navigation and step counter
- Claude opens the browser with the tour already active — no URL changes needed

## Step 1 — Ask what flow to document
Ask the user: "Walk me through the flow you want to present. Which screens and which interactions should I highlight?"

Example: "Start on the connectors list, click the ADO connector, show the health section, then click Edit."

## Step 2 — Identify the elements to annotate
For each step in the flow, identify:
- Which page/component contains the element
- A CSS selector to anchor the tooltip to
- The annotation text (what to tell the viewer)
- Optional: "click here" pointer for interactive steps

## Step 3 — Create the walkthrough config
Create or update `lib/walkthrough-config.ts`:

```ts
import type { WalkthroughStep } from '@/components/walkthrough/WalkthroughTour';

export const WALKTHROUGH_STEPS: WalkthroughStep[] = [
  {
    id: 'step-1',
    target: '[data-tour="connector-list"]',
    title: 'Your connections',
    body: 'All your active connectors are listed here. Each row shows status, last sync, and any issues.',
    placement: 'bottom',
  },
  // ... more steps
];
```

## Step 4 — Add data-tour attributes to target elements
Add `data-tour="<id>"` attributes to the elements that need to be highlighted. This is more reliable than CSS class selectors.

## Step 5 — Mount WalkthroughTour in the layout
Import and add `<WalkthroughTour steps={WALKTHROUGH_STEPS} />` to `app/layout.tsx`. It reads the `?tour=true` URL param to activate.

## Step 6 — Open the browser automatically
Use the Playwright MCP plugin to open the prototype with the tour active:

```
Open http://localhost:3000/connectors?tour=true
```

The tour starts immediately — no manual URL editing needed. Claude will narrate each step and confirm the annotations look right before you share.

## Step 7 — Share
When ready, run /publish. The shareable URL will automatically include `?tour=true` in the stakeholder message alongside the clean URL.

## Rules:
- Walkthrough annotations are for presentation only — never ship to production
- Keep annotation text concise — max 2 sentences per step
- Always use `data-tour` attributes as targets — not fragile CSS class selectors
- The tour must work at 1280px+ viewport — LT reviews are on laptops
