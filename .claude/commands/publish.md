# /publish — Push Your Concept and Share Preview URL

This skill handles everything needed to push your work to GitHub and get a shareable preview URL. You don't need to know anything about branches.

## Step 1 — Collect concept details
Ask the user two things:

1. **"What would you like to call this concept?"**
   - Suggest a generated name based on what was built if they're unsure (e.g. "Connector Health Dashboard", "ISV Setup Flow")
   - This becomes the branch name and appears in the stakeholder message
   - Keep it short and descriptive

2. **"What is your name?"**
   - Recorded silently in the commit — never shown on any screen
   - Used only for internal record-keeping

Store as `CONCEPT_NAME` and `OWNER_NAME`.

## Step 2 — Create and switch to a feature branch automatically
Generate a branch name from their inputs:
- Lowercase, spaces → hyphens, remove special characters
- Format: `<owner-slug>/<concept-slug>`
- Example: `ranjith/connector-health-dashboard`

Run:
```bash
git checkout -b <owner-slug>/<concept-slug>
```

Tell the user: "I've created a branch for your concept — you don't need to worry about this."

## Step 3 — Commit all changes
Stage and commit everything with structured metadata in the commit body:
```bash
git add -A
git commit -m "feat: <CONCEPT_NAME>

Concept: <CONCEPT_NAME>
Owner: <OWNER_NAME>
Date: <today's date>"
```

## Step 4 — Push to GitHub
```bash
git push -u origin <branch-name>
```

## Step 5 — Wait for deployment
Tell the user:
"Your concept is being deployed. This usually takes 2–3 minutes. You can watch progress at:
https://github.com/gim-home/Connectors/actions"

## Step 6 — Share the preview URL
Compute the preview URL:
- Branch `ranjith/connector-health-dashboard` → slug `ranjith-connector-health-dashboard`
- URL: `https://studious-adventure-j17vp6o.pages.github.io/<slug>/connectors`

Give the user both links:

- **Prototype link** (clean, no tour): `<URL>`
- **Guided walkthrough link** (with annotations): `<URL>?tour=true`

Then say:
> Share the **prototype link** when you want stakeholders to explore freely — it looks exactly like the real product.
> Share the **guided walkthrough link** when you're presenting to LTs or want to walk them through a specific flow step-by-step.

Then give the user this ready-to-send message (using the prototype link by default):

---
**Stakeholder message template:**
> Hi team, here's a prototype I'd like to share for your review.
>
> **Concept:** <CONCEPT_NAME>
> 🔗 **Preview:** <URL>
>
> Please share any feedback directly or reply to this message.
---

## Step 7 — Offer to verify
Ask: "Would you like me to confirm the deployment is live before you share the link?"

If yes, wait ~3 minutes and check the URL.

## Rules
- Always auto-create the branch — never ask the user to do it manually
- If a branch with that name already exists, append a short timestamp suffix
- Concept name and owner are recorded in git history permanently — not shown in the UI
- The preview URL updates automatically on every subsequent push to the same branch
- When approved work needs to go to the shared baseline, run `/handoff`
