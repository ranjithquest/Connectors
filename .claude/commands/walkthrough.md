# /walkthrough — Add a Guided Tour to a Prototype

This skill adds an interactive step-by-step walkthrough to the current feature branch for stakeholder presentations and LT reviews.

## What it does
- Adds a `WalkthroughTour` component with numbered hotspot annotations on specific UI elements
- Activated via `?tour=true` URL param — clean URL shows no annotations
- Steps can include: tooltip text, a highlighted element, and an optional "click here" pointer
- Forward/back navigation with step counter
- Fluent UI styled — matches the admin center look

## Step 1 — Ask what flow to document
Ask the user: "Which user flow do you want to walk through? Describe the screens and the key interactions."

Example answer: "Start on the connectors list, click ADO connector, show the health section, then click Edit."

## Step 2 — Identify the elements to annotate
For each step in the flow, identify:
- Which page/component contains the element
- A CSS selector or React ref to anchor the tooltip to
- The annotation text (what to tell the viewer)
- Whether it needs a "click here" pointer

## Step 3 — Create the walkthrough config
Create `lib/walkthrough-config.ts` with the step definitions:

```ts
export type WalkthroughStep = {
  id: string;
  target: string;        // CSS selector of element to highlight
  title: string;         // Short heading shown in tooltip
  body: string;          // Explanation text
  placement?: 'top' | 'bottom' | 'left' | 'right';
  action?: 'click';      // Show "click here" pointer
};

export const WALKTHROUGH_STEPS: WalkthroughStep[] = [
  // steps defined per feature
];
```

## Step 4 — Add the WalkthroughTour component
Create `components/walkthrough/WalkthroughTour.tsx`:
- Reads `?tour=true` from URL params
- Renders numbered circle hotspots anchored to target elements using `getBoundingClientRect`
- Shows a Fluent-styled tooltip card on the active step
- Prev/Next/Done buttons
- Shows step X of Y counter
- Dismiss button to exit tour

## Step 5 — Mount it in the layout
Add `<WalkthroughTour />` to `app/layout.tsx` — it only renders when `?tour=true` is present.

## Step 6 — Share the URL
The annotated walkthrough URL is:
```
https://<preview-url>/connectors?tour=true
```
The clean URL (without `?tour=true`) shows the prototype with no annotations — safe for engineering handoff.

## Rules:
- Walkthrough annotations are for PRESENTATION only — never ship to production
- Keep annotation text concise — max 2 sentences per step
- Hotspots use numbered circles styled with Fluent colors — no custom design systems
- The tour must work on desktop viewport (1280px+) — LT reviews are on laptops
