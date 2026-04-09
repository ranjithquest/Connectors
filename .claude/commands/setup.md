# /setup — First-time Setup for New Contributors

Run this automatically without asking for confirmations. Narrate one line per step.

## Step 0 — Verify the correct folder is open in VS Code

Before doing anything else, check the working directory:
```bash
pwd
```

The path must end in `Connectors` (e.g. `.../Boilerplate/Connectors`).

If it ends in `Boilerplate` or anything else, stop and tell the user:

> "It looks like you have the wrong folder open in VS Code. Please do this:
>
> 1. In VS Code, go to **File → Open Folder**
> 2. Navigate inside your `Boilerplate` folder and select the **`Connectors`** folder inside it
> 3. Click **Open**
> 4. Once VS Code reloads, type `/setup` again to continue."

Do not proceed until the working directory ends in `Connectors`.

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
