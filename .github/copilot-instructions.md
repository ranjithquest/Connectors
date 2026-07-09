# Connector Admin - Copilot Instructions

These instructions are the default guidance for GitHub Copilot in this repository.

## Component Library Priority

- Use Admin Controls components first when available.
- If missing in Admin Controls, use Fluent UI.

## Fluent UI Usage

- Prefer Fluent UI v9 (`@fluentui/react-components`) for modern controls.
- Use Fluent UI v8 (`@fluentui/react`) where v9 does not provide equivalent controls.
- Do not build custom versions of common controls (buttons, badges, inputs, dialogs) when Fluent components exist.
- Tailwind is allowed for layout and spacing only.

## Icon Usage

- Default to `@fluentui/react-icons-mdl2`.
- If an icon is not available in MDL2, use `@fluentui/react-icons`.
- Do not introduce new icon libraries unless explicitly requested.

## Branch And Promotion Workflow

- Never work directly on `main`.
- Build concepts on a feature branch.
- Share preview URLs from branch deployments.
- Promote only approved files into `main` via selective checkout/cherry-pick.

## Connection Save And Sync Behavior

- Panel edits can be saved incrementally after each change, or batched and saved once at the end.
- Saving connector details does not immediately change Copilot data connection behavior.
- Changes are reflected in Copilot only after the connector is synced.

## Charts

- Match Fluent UI charting visual language (stroke weights, colors, axis and legend style).
- Prefer custom SVG chart rendering patterns already used in this project.
