# Copilot Connectors Boilerplate — Automated Setup

You are setting up the Copilot Connectors Prototyping Boilerplate on this user's machine. Run every step automatically. Do not wait for confirmation between steps unless something fails. Narrate what you're doing in one line per step so the user can follow along.

---

## Step 1 — Ask for install location (the only question you ask upfront)

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

## Step 4 — Clone the boilerplate

```bash
cd <INSTALL_DIR>
git clone https://github.com/gim-home/Connectors.git
cd Connectors
```

If the `Connectors` folder already exists at that path, `cd` into it and run `git pull gim-connectors main` instead.

---

## Step 5 — Set up GitHub authentication (PAT)

Say: "Next I need to set up your GitHub access. This is a one-time step."

Ask: "What is your GitHub username? (It should look like `yourname_microsoft`)"

Store as `GITHUB_USERNAME`.

Then instruct:

> "Now create a Personal Access Token:
>
> 1. Go to **github.com** → your profile → **Settings → Developer Settings → Personal Access Tokens → Tokens (classic)**
> 2. Click **Generate new token (classic)**
> 3. Give it a name (e.g. "Connectors"), set expiry to 90 days, check the **`repo`** scope
> 4. Click **Generate token** and copy it
> 5. Click **Configure SSO** next to the token → **Authorize** for `gim-home`
> 6. Paste the token here when ready."

Store the token as `GITHUB_TOKEN`.

Then set up the authenticated remote:
```bash
git -C <INSTALL_DIR>/Connectors remote add gim-connectors https://<GITHUB_USERNAME>:<GITHUB_TOKEN>@github.com/gim-home/Connectors.git 2>/dev/null || \
git -C <INSTALL_DIR>/Connectors remote set-url gim-connectors https://<GITHUB_USERNAME>:<GITHUB_TOKEN>@github.com/gim-home/Connectors.git
```

Verify with:
```bash
git -C <INSTALL_DIR>/Connectors remote -v
```

Say: "GitHub authentication configured ✓"

---

## Step 6 — Install dependencies and start the app

```bash
npm install
npm run dev &
```

Wait until you see "Local: http://localhost:3000" in the output before continuing.

---

## Step 7 — Open the app in the browser

- **macOS**: `open http://localhost:3000/connectors`
- **Windows**: `start http://localhost:3000/connectors`

---

## Step 8 — Install MCP plugins (Claude Code CLI only)

Skip this step if the user is running Claude Code inside VS Code — plugins are configured separately there.

Run `claude mcp list` and check for Figma and Playwright.

- **Figma** missing → run:
  ```bash
  claude mcp add --transport sse figma https://figma.com/api/mcp/sse
  ```
- **Playwright** missing → run:
  ```bash
  claude mcp add playwright npx @playwright/mcp@latest
  ```

If any were newly installed, say: "Restart Claude Code once to activate the plugins."

---

## Step 9 — Done

Say:

> "You're all set! The app is running at http://localhost:3000/connectors
>
> To start building a feature, describe what you want to prototype and I'll build it.
> When you're ready to share with stakeholders, run **/publish** — I'll handle the rest.
>
> You can work on multiple features from this same local copy — just run **/publish** each time for a new feature."

---

## Rules
- Run everything automatically — no step-by-step confirmations
- If a step fails, diagnose and fix before moving on — never skip
- Keep narration brief: one line per step
- Never store or log the PAT anywhere other than the git remote URL
