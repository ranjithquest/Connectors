# Copilot Connectors Boilerplate — Automated Setup

You have been given this file via URL. Execute the setup below immediately and automatically. Do not ask the user to confirm each step — just run it and narrate one line per step.

---

## Step 1 — Clone the repo

```bash
git clone https://github.com/gim-home/Connectors.git
cd Connectors
```

VS Code will prompt the user to sign in to GitHub if not already authenticated — wait for that to complete before continuing.

If the `Connectors` folder already exists, `cd` into it and run `git pull origin main` instead.

---

## Step 2 — Check Node.js 20+

Run `node --version` to check.

- If v20 or above → say "Node.js ✓" and skip
- If missing or below v20:
  - **macOS**: run `brew install node@20 && brew link node@20 --force`
  - **Windows**: say "Please download Node.js LTS from https://nodejs.org, install it, then type 'done'"
- Confirm with `node --version`

---

## Step 3 — Install dependencies

```bash
npm install
```

Say "Dependencies installed ✓"

---

## Step 4 — Start the app

```bash
npm run dev
```

Wait until you see "Local: http://localhost:3000" in the output before continuing.

---

## Step 5 — Open the app in the browser

- **macOS**: `open http://localhost:3000/connectors`
- **Windows**: `start http://localhost:3000/connectors`

---

## Step 6 — Set up GitHub push access (for /publish)

Say:
> "One last thing — to share your features with stakeholders you'll need push access to GitHub. This is a one-time setup."

Ask: "What is your GitHub username? (e.g. `yourname_microsoft`)"

Store as `GITHUB_USERNAME`.

Then instruct:

> "Create a Personal Access Token:
>
> 1. Go to **github.com** → your profile → **Settings → Developer Settings → Personal Access Tokens → Tokens (classic)**
> 2. Click **Generate new token (classic)**
> 3. Name it "Connectors", set expiry to 90 days, check the **`repo`** scope
> 4. Click **Generate token** and copy it
> 5. Click **Configure SSO** → **Authorize** for `gim-home`
> 6. Paste the token here."

Store as `GITHUB_TOKEN`.

Run:
```bash
git remote add gim-connectors https://<GITHUB_USERNAME>:<GITHUB_TOKEN>@github.com/gim-home/Connectors.git 2>/dev/null || \
git remote set-url gim-connectors https://<GITHUB_USERNAME>:<GITHUB_TOKEN>@github.com/gim-home/Connectors.git
```

Say: "Push access configured ✓"

---

## Step 7 — Done

Say:

> "You're all set! The app is running at http://localhost:3000/connectors
>
> Describe what you want to build and I'll build it. When you're ready to share with stakeholders, run **/publish** and I'll handle the rest.
>
> You can build multiple features from this same local copy — just run **/publish** each time."

---

## Rules
- Run everything automatically — no step-by-step confirmations
- If a step fails, diagnose and fix before moving on — never skip
- Keep narration brief: one line per step
- Never store or log the PAT anywhere other than the git remote URL
