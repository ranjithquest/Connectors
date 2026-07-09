# Connector Admin

A shared prototyping environment for **product, design, and engineering** teams to rapidly build and preview feature concepts for the Microsoft 365 Copilot Connectors admin experience.

This project mirrors the look and feel of the M365 Admin Center and is pre-wired with realistic mock data, Fluent UI components, and a GitHub Pages preview pipeline — so every branch gets its own shareable URL automatically.

---

## Getting Started

Choose the path that fits your setup:

- [With GitHub Copilot (recommended)](#with-github-copilot-recommended)
- [Manual setup (without Copilot)](#manual-setup-without-copilot)

---

## Figma MCP and Shared Skills

This repo now includes project-level Figma MCP setup and shared Figma skills so collaborators can use the same design workflows after cloning.

### What is included
- `.mcp.json` at the repo root with a `figma` MCP server entry
- Shared skills in `.github/skills/` (team-visible)
- Shared skills in `.claude/skills/` (repo-local Claude tooling)

### Team onboarding after clone
1. Open this repo in VS Code.
2. Ensure your MCP client picks up `.mcp.json`.
3. Authenticate the Figma MCP server in your client if prompted.
4. Restart the editor/chat session once if tools or skills do not appear immediately.

### Skills added
- `figma-code-connect`
- `figma-create-new-file`
- `figma-generate-design`
- `figma-generate-diagram`
- `figma-generate-library`
- `figma-swiftui`
- `figma-use`
- `figma-use-figjam`
- `figma-use-slides`

---

## With GitHub Copilot (recommended)

GitHub Copilot is the default AI workflow for this repo.

### 1. Prerequisites
- [VS Code](https://code.visualstudio.com/)
- [GitHub Copilot VS Code extension](https://marketplace.visualstudio.com/items?itemName=GitHub.copilot)
- [Node.js 20+](https://nodejs.org/)
- [Git](https://git-scm.com/)

### 2. Clone the repo
Create a folder called `Boilerplate` on your machine, then inside it:
```bash
git clone https://github.com/gim-home/Connectors.git
```

### 3. Open the correct folder in VS Code
> ⚠️ This step is critical — open the **`Connectors`** folder, not the `Boilerplate` folder it lives inside.

**File → Open Folder → select `Connectors`**

VS Code will prompt you to install the recommended **GitHub Copilot** extension if you don't have it yet.

### 4. Run setup
Open a terminal in VS Code and run:
```bash
./setup.sh
```
This installs dependencies, starts the app, and configures GitHub push access.

### 5. Prototype and publish
- Build your feature on a feature branch
- When ready to share, run:
```bash
./publish.sh
```
- When approved, cherry-pick or selectively checkout only approved files into `main`

---

## Manual setup (without Copilot)

### 1. Prerequisites
- [Node.js 20+](https://nodejs.org/)
- [Git](https://git-scm.com/)
- A GitHub Personal Access Token with `repo` scope, authorized for `gim-home` via SSO

### 2. Clone the repo
Create a folder called `Boilerplate` on your machine, then inside it:
```bash
git clone https://github.com/gim-home/Connectors.git
cd Connectors
```

### 3. Install dependencies
```bash
npm install
```

### 4. Run locally
```bash
npm run dev
```
Open [http://localhost:3000/connectors](http://localhost:3000/connectors)

### 5. Set up GitHub push access (one-time)
Replace `YOUR_USERNAME` and `YOUR_TOKEN` with your GitHub username and PAT:
```bash
git remote add gim-connectors https://YOUR_USERNAME:YOUR_TOKEN@github.com/gim-home/Connectors.git
```

To create a PAT:
1. Go to **github.com → your profile → Settings → Developer Settings → Personal Access Tokens → Tokens (classic)**
2. Click **Generate new token (classic)**
3. Name it "Connectors", set expiry to 90 days, check the `repo` scope
4. Click **Configure SSO → Authorize** for `gim-home`
5. Copy the token and use it in the command above

### 6. Create a feature branch
Always branch off `main` — never commit directly to `main`:
```bash
git checkout main
git pull gim-connectors main
git checkout -b your-name/feature-name
```

### 7. Make your changes
Edit files, build your concept, update mock data in `lib/mock-data.ts` as needed.

### 8. Push and get your preview URL
```bash
git add -A
git commit -m "feat: your feature name"
git push -u gim-connectors your-name/feature-name
```

GitHub Actions will build and deploy your branch in ~2–3 minutes. A comment on your commit will show your preview URL:
```
https://studious-adventure-j17vp6o.pages.github.io/your-name/feature-name/connectors
```

Watch the build: [github.com/gim-home/Connectors/actions](https://github.com/gim-home/Connectors/actions)

### 9. Iterate
Push more commits to the same branch — each push updates the same preview URL automatically.

### 10. Promote approved work to main
Once stakeholders approve specific files, cherry-pick only those into `main`:
```bash
git checkout main
git pull gim-connectors main
git checkout your-name/feature-name -- components/connectors/MyComponent.tsx
git commit -m "Promote MyComponent — approved by [stakeholder name]"
git push gim-connectors main
```

### 11. Clean up
```bash
git push gim-connectors --delete your-name/feature-name
git branch -d your-name/feature-name
```

---

## Project Structure

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

.github/copilot-instructions.md # Project-wide GitHub Copilot instructions
.claude/commands/               # Legacy Claude command scripts (optional)
public/
  logos/                        # Connector logo PNGs/SVGs
```

### Stack
- **Next.js 14** (App Router, TypeScript, static export)
- **Fluent UI v8** (`@fluentui/react`) + **v9** (`@fluentui/react-components`)
- **`@fluentui/react-icons-mdl2`** — primary icon library
- **Tailwind CSS** — layout and utility styling only
- **Admin Controls** — first-priority UI component library

---

## Branch and Deployment Model

| Branch | Purpose | Preview URL |
|---|---|---|
| `main` | Protected shared baseline | `<pages-url>/connectors` |
| `your-name/feature` | Concept in progress | `<pages-url>/<branch-slug>/connectors` |

Every push to a feature branch triggers an automatic deployment. The preview URL is posted as a comment on your commit.

> **Never push directly to `main`.** All work goes through feature branches and is cherry-picked in after stakeholder approval.

---

## Questions?

Built by the **Connectors Design team** — reach out to Ranjith Ravi for questions.
