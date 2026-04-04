# /handoff — Engineering Handoff

This skill extracts approved components from a feature branch and prepares them for integration into the production product repo.

## What it produces
- Clean, production-ready component files with no mock data dependencies
- Proper TypeScript prop interfaces replacing all hardcoded values
- A `HANDOFF.md` documenting each component, its props, and backend integration requirements
- A `/handoff` output folder ready to copy into the product repo

## Step 1 — Identify what to hand off
Ask the user:
1. "Which feature branch are we handing off from?"
2. "Which components/files have been approved by stakeholders?"
3. "What is the target product repo and folder structure?"

## Step 2 — Audit each approved component
For each approved component:
- Read the file
- Identify all mock data dependencies (imports from `lib/mock-data.ts`, hardcoded arrays, etc.)
- Identify all prototype-only code (walkthrough annotations, `?tour=true` guards, `console.log`, etc.)
- Identify missing backend integration points (where real API calls should go)

## Step 3 — Clean the components
For each component:
1. Replace mock data imports with proper prop interfaces:
   ```ts
   // Before (prototype)
   import { CONNECTORS } from '@/lib/mock-data';
   
   // After (production)
   interface Props {
     connectors: Connector[];
     onConnectorClick: (id: string) => void;
   }
   ```
2. Remove all walkthrough/annotation code
3. Remove all `console.log` statements
4. Remove prototype-only state (e.g. `openToAuth`, demo-specific flags)
5. Add `// TODO: [description]` comments where backend integration is needed

## Step 4 — Create the /handoff folder
```
handoff/
  components/         # Cleaned component files
  types/              # TypeScript interfaces
  HANDOFF.md          # Integration guide
```

## Step 5 — Generate HANDOFF.md
The handoff doc must include for each component:
- **Component name and purpose**
- **Props interface** (full TypeScript)
- **Screenshot** (ask Claude to take one with Playwright if available)
- **Backend requirements**: what API endpoints or data contracts are needed
- **Dependencies**: which Fluent UI packages are required
- **Notes**: any design decisions the engineering team should know about

## Step 6 — Confirm and package
Show the user the list of files in `/handoff` and ask:
"Does this look complete? Shall I create a zip or open a PR into the product repo?"

## Rules:
- NEVER include mock data in the handoff output
- NEVER include prototype-only components (walkthrough, debug panels, etc.)
- ALWAYS preserve the Fluent UI component choices — do not swap to Tailwind
- ALWAYS keep the TypeScript types from `lib/types.ts` that are genuinely reusable
- Flag any component that has hardcoded strings that should come from i18n/localization
- If a component uses `@fluentui/react` (v8), flag it and suggest v9 equivalent if one exists
