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

## Step 1 — Detect the contributor's name

Run this silently before saying anything to the user:
```bash
git config user.name
```
Also extract the username from the remote URL:
```bash
git remote get-url gim-connectors
```
The remote URL contains the GitHub username before the `:` (e.g. `https://ranjithravi_microsoft:...@github.com/...` → `ranjithravi_microsoft`).

Use the GitHub username (from the remote URL) as `OWNER_SLUG` — it's already URL-safe.
Use the `git config user.name` value as `OWNER_DISPLAY_NAME` for display only.

Store as `OWNER_SLUG` and `OWNER_DISPLAY_NAME`.

## Step 2 — Ask only for the feature name

Say to the user:

> "Hi **<OWNER_DISPLAY_NAME>**! 👋
>
> What would you like to call this feature?
> *(e.g. "icon edit", "new setup flow", "diagnostics panel")*
>
> Once published, you'll get a preview link to share directly with stakeholders."

Store the answer as `FEATURE_NAME`.

If the user seems unsure, suggest a name based on what was built.

## Step 3 — Create and switch to a feature branch

Generate a branch name:
- Lowercase, spaces → hyphens, remove special characters
- Format: `<owner-slug>/<feature-slug>`
- Example: `aatman/icon-edit`

Run:
```bash
git checkout Boilerplate
git pull gim-connectors Boilerplate
git checkout -b <owner-slug>/<feature-slug>
```

Tell the user: "Creating your branch — you don't need to worry about this part."

## Step 4 — Commit all changes
```bash
git add -A
git commit -m "feat: <FEATURE_NAME>

Feature: <FEATURE_NAME>
Owner: <OWNER_DISPLAY_NAME>
Date: <today's date>"
```

## Step 5 — Push to GitHub
```bash
git push -u gim-connectors <owner-slug>/<feature-slug>
```

**Never push to `main` or `Boilerplate`.**

## Step 6 — Tell them what's happening

Say:
> "Your feature is deploying now — this takes about 2–3 minutes.
>
> Watch the build here: https://github.com/gim-home/Connectors/actions"

## Step 7 — Share the preview URL

Compute the preview URL:
- Branch `aatman/icon-edit` → `https://studious-adventure-j17vp6o.pages.github.io/aatman/icon-edit/connectors`
- Pattern: `https://studious-adventure-j17vp6o.pages.github.io/<owner-slug>/<feature-slug>/connectors`

Give the user this ready-to-send message:

---
**Your preview link is live at:**
🔗 `https://studious-adventure-j17vp6o.pages.github.io/<owner-slug>/<feature-slug>/connectors`

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
- Always branch off `Boilerplate` — never off `main`
- Branch format is `<owner>/<feature>` — no `bp/` prefix
- Always push to `gim-connectors` remote — never to `origin` or `main`
- Never merge to `Boilerplate` or `main` — feature branches are standalone previews
- If a branch with that name already exists, append a short timestamp suffix
- The preview URL updates automatically on every subsequent push to the same branch
- When approved work needs to go to the shared baseline, run `/handoff`
