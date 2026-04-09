# /publish — Push Your Concept and Share Preview URL

This skill handles everything needed to push your work to GitHub and get a shareable preview URL.

## Step 0 — Check GitHub authentication

Before doing anything, check if the `gim-connectors` remote is configured with a PAT:
```bash
git remote get-url gim-connectors
```

If the URL does **not** contain a username and token (i.e. it's just `https://github.com/gim-home/Connectors.git`), stop and guide the user to set up authentication:

> "Before we can publish, you need to set up GitHub access on your machine. Here's how:
>
> 1. Go to **github.com** → your profile → **Settings → Developer Settings → Personal Access Tokens → Tokens (classic)**
> 2. Click **Generate new token (classic)**
> 3. Give it a name (e.g. "Connectors deploy"), set expiry, and check the **`repo`** scope
> 4. After creating it, click **Configure SSO** next to the token → **Authorize** for `gim-home`
> 5. Copy the token
> 6. Run this in your terminal (replace with your username and token):
>    ```bash
>    git remote set-url gim-connectors https://YOUR_GITHUB_USERNAME:YOUR_TOKEN@github.com/gim-home/Connectors.git
>    ```
> 7. Come back and run `/publish` again."

Do not proceed until the remote URL contains valid credentials.

## Step 1 — Detect current branch and contributor

Run these silently:
```bash
git branch --show-current
git config user.name
git remote get-url gim-connectors
```

- Store the current branch as `CURRENT_BRANCH`
- Extract the GitHub username from the remote URL (e.g. `https://ranjithravi_microsoft:...@github.com/...` → `ranjithravi_microsoft`) as `OWNER_SLUG`
- Use `git config user.name` as `OWNER_DISPLAY_NAME` for display only

## Step 2 — Ask: same feature or new?

Check if `CURRENT_BRANCH` is a feature branch (i.e. not `main` or detached `HEAD`).

**If currently on a feature branch** (e.g. `ranjith/dark-panel-bg`), ask:

> "Hi **<OWNER_DISPLAY_NAME>**! 👋
>
> You're currently on branch **`<CURRENT_BRANCH>`**.
>
> Are you publishing an update to this same feature, or is this a new feature that needs its own branch and preview URL?
>
> - **Same feature** → I'll push your changes to `<CURRENT_BRANCH>` and update its preview link
> - **New feature** → I'll create a new branch and generate a fresh preview URL"

**If on `main` or detached HEAD**, skip this question and go straight to Step 3 (new branch flow).

### If "same feature":
- Skip to **Step 4** (commit) using `CURRENT_BRANCH` as the target
- The preview URL is derived from `CURRENT_BRANCH` — no new branch needed

### If "new feature":
- Continue to **Step 3** to create a new branch

---

## Step 3 — (New feature only) Ask for the feature name

Say:

> "What would you like to call this feature?
> *(e.g. "icon edit", "new setup flow", "diagnostics panel")*"

Store the answer as `FEATURE_NAME`.

Generate the branch name:
- Lowercase, spaces → hyphens, strip special characters
- Format: `<owner-slug>/<feature-slug>`
- Example: `ranjith/dark-panel-bg`

Run:
```bash
git checkout main
git pull gim-connectors main
git checkout -b <owner-slug>/<feature-slug>
```

> Always branch off `main` — this is the clean shared baseline.

Tell the user: "Creating your branch — you don't need to worry about this part."

Set `TARGET_BRANCH` = `<owner-slug>/<feature-slug>`

---

## Step 4 — Commit all changes

```bash
git add -A
git commit -m "feat: <FEATURE_NAME or branch description>

Feature: <FEATURE_NAME>
Owner: <OWNER_DISPLAY_NAME>
Date: <today's date>"
```

If there are no uncommitted changes (clean working tree), skip the commit and just push.

## Step 5 — Push to GitHub

```bash
git push -u gim-connectors <TARGET_BRANCH>
```

**Never push directly to `main`.**

## Step 6 — Tell them what's happening

Say:
> "Your feature is deploying now — this takes about 2–3 minutes.
>
> Watch the build here: https://github.com/gim-home/Connectors/actions"

## Step 7 — Share the preview URL

Compute the preview URL from `TARGET_BRANCH`:
- Branch `ranjith/dark-panel-bg` → `https://studious-adventure-j17vp6o.pages.github.io/ranjith/dark-panel-bg/connectors`
- Pattern: `https://studious-adventure-j17vp6o.pages.github.io/<TARGET_BRANCH>/connectors`

Give the user this ready-to-send message:

---
**Your preview link is live at:**
🔗 `https://studious-adventure-j17vp6o.pages.github.io/<TARGET_BRANCH>/connectors`

**Share this with your stakeholders:**
> Hi team, here's a prototype I'd like your feedback on.
>
> **Feature:** <FEATURE_NAME>
> 🔗 **Preview:** `<URL>`
>
> This is a standalone preview — it won't affect the shared baseline. Please share any feedback directly or reply to this message.

---

## Step 8 — Offer to verify
Ask: "Would you like me to confirm the deployment is live before you share the link?"

If yes, wait ~3 minutes and check the URL is reachable.

## Rules
- Always branch off `main` for new features — never commit directly to `main`
- Branch format is `<owner>/<feature>` — no `bp/` prefix
- Always push to `gim-connectors` remote — never to `origin`
- Never push directly to `main` — feature branches are standalone previews only
- If a new branch with that name already exists, append a short timestamp suffix
- The preview URL updates automatically on every subsequent push to the same branch
- When approved work needs to go to the shared baseline, run `/handoff`

---

## Don't have Claude Code? Manual steps

If you're not using Claude Code, here's how to publish manually:

### 1. Set up GitHub push access (one-time)
```bash
git remote add gim-connectors https://YOUR_USERNAME:YOUR_TOKEN@github.com/gim-home/Connectors.git
```
Get a PAT from **github.com → Settings → Developer Settings → Personal Access Tokens (classic)** with `repo` scope, then SSO-authorize it for `gim-home`.

### 2. Create a feature branch
```bash
git checkout main
git pull gim-connectors main
git checkout -b your-name/feature-name
```

### 3. Commit and push
```bash
git add -A
git commit -m "feat: your feature name"
git push -u gim-connectors your-name/feature-name
```

### 4. Get your preview URL
GitHub Actions deploys in ~2–3 minutes. Watch progress at [github.com/gim-home/Connectors/actions](https://github.com/gim-home/Connectors/actions).

Your preview URL will be:
```
https://studious-adventure-j17vp6o.pages.github.io/your-name/feature-name/connectors
```
It's also posted as a comment on your commit automatically.
