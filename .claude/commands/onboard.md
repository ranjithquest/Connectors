# /onboard — Automated Setup

Run this flow fully automatically. Do not wait for confirmation between steps unless something fails. Narrate what you're doing at each step so the user can follow along.

---

## Step 1 — Ask for install location (only question you ask)

Say: "Welcome! I'll set everything up for you automatically. Where would you like to save the project? Press Enter to use your Desktop, or paste a folder path."

- If they press Enter or say nothing specific → use `~/Desktop`
- Store as `INSTALL_DIR`

---

## Step 2 — Install Node.js 20+

Run `node --version` to check.

- If v20 or above → say "Node.js is already installed ✓" and skip
- If missing or below v20:
  - **macOS**: run `brew install node@20 && brew link node@20 --force`
  - **Windows**: say "Please download Node.js LTS from https://nodejs.org, install it, then type 'done' to continue"
  - After install → re-run `node --version` to confirm

---

## Step 3 — Install Git

Run `git --version` to check.

- If installed → say "Git is already installed ✓" and skip
- If missing:
  - **macOS**: run `xcode-select --install`, wait for completion
  - **Windows**: say "Please download Git from https://git-scm.com, install it, then type 'done'"
  - After install → re-run `git --version` to confirm

---

## Step 4 — Install Figma MCP plugin

Run `claude mcp list` and check if Figma is listed.

- If present → say "Figma MCP already installed ✓" and skip
- If missing → run:
  ```bash
  claude mcp add --transport sse figma https://figma.com/api/mcp/sse
  ```
  Confirm it appears in `claude mcp list`.

---

## Step 5 — Install Playwright MCP plugin

Run `claude mcp list` and check if Playwright is listed.

- If present → say "Playwright MCP already installed ✓" and skip
- If missing → run:
  ```bash
  claude mcp add playwright npx @playwright/mcp@latest
  ```
  Confirm it appears in `claude mcp list`.

---

## Step 6 — Clone the boilerplate

```bash
cd <INSTALL_DIR>
git clone https://github.com/gim-home/Connectors.git
cd Connectors
```

If the `Connectors` folder already exists at that location, `cd` into it and run `git pull origin Boilerplate` instead.

---

## Step 7 — Install dependencies and start the app

```bash
npm install
npm run dev &
```

Wait for the server to be ready (watch for "Local: http://localhost:3000" in output).

---

## Step 8 — Open the get started page in the browser

Once the server is running, open the browser:

- **macOS**: `open http://localhost:3000/get-started`
- **Windows**: `start http://localhost:3000/get-started`

---

## Step 9 — Done

Say:

> "You're all set! The app is running at http://localhost:3000
>
> The **Get started** page is now open in your browser — it walks you through the workflow and links to the Connectors app.
>
> To start building, just describe what you want to prototype and I'll build it. When you're ready to share, run **/publish**."

If any MCP plugins were newly installed, add:
> "Restart Claude Code once to activate the Figma and Playwright plugins."

---

## Rules
- Run everything automatically — do not ask for confirmation at each step
- If a step fails, diagnose and fix before moving on — do not skip
- Keep narration short: one line per step as you go
- Never overwhelm with explanations — just do it and confirm when done
