# /setup — First-time Setup for New Contributors

Run this automatically without asking for confirmations. Narrate one line per step.

## Step 0 — Authenticate with GitHub

The repo is private and requires a GitHub Personal Access Token (PAT).

Say:
> "This repo is private — you'll need a GitHub PAT to clone it. Here's how:
>
> 1. Go to **github.com** → your profile → **Settings → Developer Settings → Personal Access Tokens → Tokens (classic)**
> 2. Click **Generate new token (classic)**
> 3. Name it "Connectors", set expiry to 90 days, check the **`repo`** scope
> 4. Click **Generate token** and copy it
> 5. Click **Configure SSO** → **Authorize** for `gim-home`
> 6. Paste the token here."

Store as `GITHUB_TOKEN`. Ask for their GitHub username and store as `GITHUB_USERNAME`.

Run:
```bash
git clone https://<GITHUB_USERNAME>:<GITHUB_TOKEN>@github.com/gim-home/Connectors.git
cd Connectors
```

If the clone succeeds, say "Repo cloned ✓" and continue.
If it fails, check the token has `repo` scope and SSO is authorized for `gim-home`.

## Step 0b — Verify the correct folder

Check the working directory:
```bash
pwd
```

The path must end in `Connectors`. If not, run:
```bash
cd Connectors
```

## Step 1 — Check Node.js 20+

```bash
node --version
```

- If v20 or above → say "Node.js ✓" and continue
- If missing or below v20:
  - **macOS**: `brew install node@20 && brew link node@20 --force`
  - **Windows**: say "Please download Node.js LTS from https://nodejs.org, install it, then type 'done'"
- Confirm with `node --version`

## Step 2 — Install dependencies

```bash
npm install
```

Say "Dependencies installed ✓"

## Step 3 — Start the app

```bash
npm run dev
```

Wait until the terminal shows "Local: http://localhost:3000" before continuing.

## Step 4 — Open the app

- **macOS**: `open http://localhost:3000/connectors`
- **Windows**: `start http://localhost:3000/connectors`

## Step 5 — Set up GitHub push access

Say:
> "One last thing — to share your features with stakeholders you'll need push access to GitHub. This is a one-time setup."

Ask: "What is your GitHub username? (e.g. `yourname_microsoft`)"

Store as `GITHUB_USERNAME`.

Then say:
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

## Step 6 — Done

Say:
> "You're all set! The app is running at http://localhost:3000/connectors
>
> Describe what you want to build and I'll build it. When you're ready to share with stakeholders, run **/publish** and I'll handle the rest."

## Rules
- Run everything automatically — no step-by-step confirmations
- If a step fails, diagnose and fix before moving on — never skip
- Keep narration brief: one line per step
- Never store or log the PAT anywhere other than the git remote URL
