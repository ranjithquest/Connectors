# /publish — Push Your Branch and Share Preview URL

This skill guides you through pushing your current feature branch to GitHub and getting a shareable preview URL for stakeholders.

## Step 1 — Collect concept details
Before doing anything, ask the user these two questions:

1. **"What is the name of this feature or concept?"**
   - This becomes the human-readable title (e.g. "Connector Health Dashboard", "ISV Onboarding Flow")
   - Keep it clear and presentable — stakeholders will see this in the shared message

2. **"What is your name?"**
   - This is recorded as the owner in the commit metadata — it will NOT appear on any screens
   - Used only for internal tracking and record-keeping

Store both as variables: `CONCEPT_NAME` and `OWNER_NAME`.

## Step 2 — Check current branch
Run: `git branch --show-current`

If the user is on `main` or `Boilerplate`, stop and say:
"You are on a protected branch. Let me create a feature branch for you first."

Create the branch using their name and concept:
```bash
git checkout -b <owner-name-slug>/<concept-name-slug>
# e.g. ranjith/connector-health-dashboard
```

Slugify both: lowercase, spaces → hyphens, remove special characters.

## Step 3 — Check for uncommitted changes
Run: `git status`

If there are uncommitted changes, stage and commit them with a structured commit message that includes both the concept name and owner — but only in the commit metadata, not visible in the UI:

```bash
git add -A
git commit -m "feat: <CONCEPT_NAME>

Concept: <CONCEPT_NAME>
Owner: <OWNER_NAME>
Date: <today's date>"
```

Example:
```
feat: Connector Health Dashboard

Concept: Connector Health Dashboard
Owner: Ranjith Ravi
Date: 2026-04-04
```

This records the owner permanently in git history without surfacing it anywhere in the app.

## Step 4 — Push to GitHub
```bash
git push -u origin <branch-name>
```

## Step 5 — Wait for deployment
Tell the user:
"Your branch is being built and deployed. This usually takes 2–3 minutes. You can watch progress at:
https://github.com/gim-home/Connectors/actions"

## Step 6 — Share the preview URL
The preview URL is:
```
https://studious-adventure-j17vp6o.pages.github.io/<branch-slug>/connectors
```

Where `<branch-slug>` is the branch name with `/` replaced by `-` and lowercased.
For example: `ranjith/connector-health-dashboard` → `ranjith-connector-health-dashboard`

Give the user this ready-to-send stakeholder message:

---
**Stakeholder message template:**
> Hi team, I'd like to share a prototype for your review.
>
> **Feature:** `<CONCEPT_NAME>`
> 🔗 **Preview link:** `<URL>`
>
> This is an interactive prototype — you can click through the UI as you normally would.
> To see a guided walkthrough, add `?tour=true` to the URL: `<URL>?tour=true`
>
> Please share any feedback directly or reply to this message.
---

## Step 7 — Confirm the URL works
Ask the user: "Would you like me to verify the deployment is live before you share it?"

If yes, wait ~3 minutes and check if the URL returns a valid page.

## Important reminders
- The concept name and owner are recorded in git commit history — this is permanent and searchable
- The preview URL is public — anyone with the link can view it
- The URL updates automatically every time you push to the same branch
- Do NOT share `main` or `Boilerplate` branch URLs as concept previews
- When ready to promote approved work, run `/handoff`
