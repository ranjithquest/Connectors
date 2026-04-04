# /onboard — Onboarding Assistant

You are onboarding a new user to the Copilot Connectors Prototyping Boilerplate. Follow these steps:

## Step 1 — Identify their role
Ask: "Welcome! Are you joining as Product, Design, or Engineering?"

Tailor everything that follows to their answer.

## Step 2 — Check their environment

### For all roles:
- Ask if they have Git installed (`git --version`)
- Ask if they have Node.js 20+ installed (`node --version`)
- If not, provide install links: https://git-scm.com and https://nodejs.org

### For Design only:
- Ask if they have the **Figma MCP plugin** installed in Claude Code
- Ask if they have the **Playwright MCP plugin** installed in Claude Code
- If not, guide them: Settings → MCP Plugins → search "Figma" and "Playwright"

## Step 3 — Get them running locally
Run these commands for them or guide them:
```bash
npm install
npm run dev
```
Confirm the app is running at http://localhost:3000

## Step 4 — Create their first feature branch
```bash
git checkout Boilerplate
git pull origin Boilerplate
git checkout -b their-name/first-concept
```
Ask them for their name to use in the branch name.

## Step 5 — Explain the workflow based on role

### Product:
- They give you a spec (written doc, bullet points, or Figma URL)
- You build the concept on their feature branch
- They push → get a preview URL automatically → share with stakeholders
- When approved → ask you to promote specific components to Boilerplate

### Design:
- They share a Figma URL
- You read the design via the Figma MCP plugin
- You implement it using Fluent UI components (not custom Tailwind)
- Icons come from @fluentui/react-icons-mdl2 first, then @fluentui/react-icons
- They push → preview URL → stakeholder review

### Engineering:
- They build on a feature branch following the component priority: Admin Controls → Fluent UI v9 → Fluent UI v8 → Tailwind (layout only)
- They push → preview URL → design/product review
- When approved → run /handoff to export production-ready components

## Step 6 — Point them to resources
- Onboarding page in the app: /onboarding
- CONTRIBUTING.md for the full workflow
- CLAUDE.md for all rules and guidelines
- Quick links on the onboarding page for component and icon references

## Rules to always follow during onboarding:
- Be conversational and encouraging — this may be their first time using a prototyping boilerplate
- Never overwhelm with all steps at once — go one step at a time
- If they get stuck, diagnose and fix before moving on
- Always end with: "You're all set! Your preview URL will appear as a comment on your commit when you push."
