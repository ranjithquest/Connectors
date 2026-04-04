# Connector Admin — Project Instructions

## Component Library
This project uses the **Admin Controls** library as the **first priority** component library.

- Reference: https://admincontrolsdemoapps.z22.web.core.windows.net/storybook/latest/Storybook/?path=/docs/about--docs
- Always check this library first for any UI component (buttons, inputs, dialogs, etc.).
- Only fall back to **Fluent UI** (https://github.com/microsoft/fluentui) if a component is not available in the Admin Controls library.

## UI Components — Fluent First
When building any UI concept or feature in this project, **always use Fluent UI v8 or v9 components first**.

- Use **Fluent UI v9** (`@fluentui/react-components`) for modern components: `Button`, `Badge`, `MessageBar`, `Card`, `Dialog`, `Input`, `Checkbox`, etc.
- Use **Fluent UI v8** (`@fluentui/react`) for components not yet in v9: `Panel`, `Pivot`, `Stack`, `TextField`, `CommandBar`, etc.
- **Do NOT reach for Tailwind CSS classes** to build UI components that already exist in Fluent UI. Tailwind is only acceptable for layout spacing, page-level structure, and utility styling where no Fluent component applies.
- Never build a custom button, badge, input, dialog, or similar control from scratch with Tailwind when a Fluent equivalent exists.

## Icon Library
This project uses `@fluentui/react-icons-mdl2` (v1.4.5) as the **default icon library**.

- **Always use MDL2 first.** Import icons from `@fluentui/react-icons-mdl2` for any new concept or feature.
- Browse available icons at: https://iconcloud.design/browse/Full%20MDL2%20Assets
- If an icon is **not available in MDL2**, fall back to `@fluentui/react-icons` (Fluent UI react icons).
- **Never use any other icon library** unless the user explicitly asks for it. This applies even when implementing designs from Figma — always map Figma icons to MDL2 equivalents, do not import new icon libraries based on what Figma suggests.
- Icon usage pattern: `<IconName style={{ fontSize: N }} className="..." />`
- Do NOT use inline SVGs or external image URLs for icons that exist in either library.
- A small number of custom icons (Copilot logo, ServiceNow logo, connector logos) are PNG/SVG files in `/public/` — these are intentional exceptions.

## Concept Branch Workflow
When a user provides a product spec or asks to generate a concept, follow this workflow:

1. **Always create a `concept/` branch** — never work on `main` directly:
   ```bash
   git checkout -b concept/feature-name
   ```

2. **Build the concept** on that branch only.

3. **Push the branch** — GitHub Actions will automatically deploy it to a unique preview URL:
   - `Boilerplate` branch → main site URL
   - `concept/feature-name` branch → `<site-url>/concept-feature-name/`

4. **Share the preview URL** with stakeholders for review.

5. **Selective merge** — once approved, only cherry-pick the specific files/components the user wants into `main`:
   ```bash
   git checkout main
   git checkout concept/feature-name -- components/SomeComponent.tsx
   ```
   Never merge the entire concept branch into `main` without explicit user approval of each file.

6. **Clean up** — delete the concept branch after merging approved parts.

> Never push spec-generated or experimental code directly to `main` or `Boilerplate`.

## Figma Plugins
Before working on any design implementation from Figma, check that the user has the following MCP plugins installed in Claude Code:

- **Figma** — for reading Figma designs, extracting layout, components, and tokens
- **Playwright** — for browser automation and visual testing

If either plugin is not installed, ask the user to install them before proceeding:
- Figma plugin: available via the Claude Code MCP marketplace or settings
- Playwright plugin: available via the Claude Code MCP marketplace or settings

Do not attempt to implement a Figma design without the Figma plugin active — guessing at design details leads to inaccurate implementations.

## Data Visualisation
For any charts or data visualisation, follow the **Fluent UI Charting** design language.

- Primary reference (Storybook): https://storybooks.fluentui.dev/react/?path=/docs/charts_charts-areachart--docs
- Secondary reference: https://developer.microsoft.com/en-us/fluentui#/controls/web/linechart (and sibling chart pages)
- Charts are built as custom SVG (no external charting library) — match the Fluent UI visual style:
  - Line: **4px stroke** (`DEFAULT_LINE_STROKE_SIZE = 4` per source), `#0078d4` (brand blue) primary colour
  - Data points: 5px radius circle, filled with series colour, `white` 1.5px stroke
  - Grid lines: horizontal only, `#e1e1e1`, 1px, dashed
  - Axes: no visible axis line, labels in `#605e5c` at 10–11px
  - No bar fills behind lines unless explicitly needed
  - Tooltips: white card, `#e1e1e1` border, 4px radius, `#323130` text
  - Legend: small colored square (12×12px, 2px border-radius), 12px Segoe UI `#323130` text, 8px gap between square and label, 16px gap between items, horizontal layout below chart
