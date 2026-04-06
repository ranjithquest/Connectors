# Copilot Connectors Boilerplate — Automated Setup

You are setting up the Copilot Connectors Prototyping Boilerplate on this user's machine. Run every step automatically. Do not wait for confirmation between steps unless something fails. Narrate what you're doing in one line per step so the user can follow along.

---

## Step 1 — Ask for install location (the only question you ask)

Say: "Welcome! I'll set everything up for you automatically. Where would you like to save the project? Press Enter to use your Desktop, or paste a folder path."

- If they press Enter or say nothing specific → use `~/Desktop`
- Store as `INSTALL_DIR`

---

## Step 2 — Install Node.js 20+

Run `node --version` to check.

- If v20 or above → say "Node.js ✓" and skip
- If missing or below v20:
  - **macOS**: run `brew install node@20 && brew link node@20 --force`
  - **Windows**: say "Please download Node.js LTS from https://nodejs.org, install it, then type 'done'"
- Confirm with `node --version`

---

## Step 3 — Install Git

Run `git --version` to check.

- If installed → say "Git ✓" and skip
- If missing:
  - **macOS**: run `xcode-select --install`
  - **Windows**: say "Please download Git from https://git-scm.com, install it, then type 'done'"
- Confirm with `git --version`

---

## Step 4 — Install Figma MCP plugin

Run `claude mcp list` and check if Figma is listed.

- If present → say "Figma MCP ✓" and skip
- If missing → run:
  ```bash
  claude mcp add --transport sse figma https://figma.com/api/mcp/sse
  ```

---

## Step 5 — Install Playwright MCP plugin

Run `claude mcp list` and check if Playwright is listed.

- If present → say "Playwright MCP ✓" and skip
- If missing → run:
  ```bash
  claude mcp add playwright npx @playwright/mcp@latest
  ```

---

## Step 6 — Clone the boilerplate

```bash
cd <INSTALL_DIR>
git clone https://github.com/gim-home/Connectors.git
cd Connectors
git checkout Boilerplate
```

If the `Connectors` folder already exists at that path, `cd` into it and run `git pull origin Boilerplate` instead.

---

## Step 7 — Install dependencies and start the app

```bash
npm install
npm run dev &
```

Wait until you see "Local: http://localhost:3000" in the output before continuing.

---

## Step 8 — Open the get started page

- **macOS**: `open http://localhost:3000/get-started`
- **Windows**: `start http://localhost:3000/get-started`

---

## Step 9 — Done

Say exactly this:

> "You're all set! 🎉
>
> The app is running at **http://localhost:3000**
>
> The **Get started** page is now open in your browser — it walks you through the workflow. Click **Open the app** to go to the Connectors prototype.
>
> To start building, just describe what you want to prototype and I'll build it. When ready to share, run **/publish**."

If any MCP plugins were newly installed, add:
> "One more thing — restart VS Code once to activate the Figma and Playwright plugins."

---

## Rules
- Run everything automatically — no step-by-step confirmations
- If a step fails, diagnose and fix before moving on — never skip
- Keep narration brief: one line per step
