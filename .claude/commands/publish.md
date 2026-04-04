# /publish — Push Your Branch and Share Preview URL

This skill guides you through pushing your current feature branch to GitHub and getting a shareable preview URL for stakeholders.

## Step 1 — Check current branch
Run: `git branch --show-current`

If you are on `main` or `Boilerplate`, stop and ask:
"You are on a protected branch. Let me create a feature branch for you first. What would you like to call it? (e.g. your-name/feature-name)"

Then run:
```bash
git checkout -b <branch-name>
```

## Step 2 — Check for uncommitted changes
Run: `git status`

If there are uncommitted changes, stage and commit them:
```bash
git add -A
git commit -m "<ask the user for a short description of what they built>"
```

Keep the commit message clear and descriptive — stakeholders may see it in GitHub.

## Step 3 — Push to GitHub
```bash
git push origin <branch-name>
```

If the branch doesn't exist on remote yet, run:
```bash
git push -u origin <branch-name>
```

## Step 4 — Wait for deployment
Tell the user:
"Your branch is being built and deployed. This usually takes 2–3 minutes. You can watch the progress at:
https://github.com/gim-home/Connectors/actions"

## Step 5 — Share the preview URL
Once deployed, the preview URL will be:
```
https://studious-adventure-j17vp6o.pages.github.io/<branch-slug>/connectors
```

Where `<branch-slug>` is the branch name with `/` replaced by `-` and lowercased.
For example: `ranjith/connector-health` → `ranjith-connector-health`

So the full URL becomes:
```
https://studious-adventure-j17vp6o.pages.github.io/ranjith-connector-health/connectors
```

Tell the user their exact URL and give them this message to copy and send to stakeholders:

---
**Stakeholder message template:**
> Hi team, I'd like to share a prototype for your review.
>
> 🔗 **Preview link:** `<URL>`
>
> This is an interactive prototype — you can click through the UI as you normally would.
> To see a guided walkthrough, add `?tour=true` to the URL: `<URL>?tour=true`
>
> Please share any feedback directly or reply to this message.
---

## Step 6 — Confirm the URL works
Ask the user: "Would you like me to verify the deployment is live before you share it?"

If yes, wait ~3 minutes and check if the URL returns a valid page.

## Important reminders
- The preview URL is public — anyone with the link can view it
- The URL updates automatically every time you push to the same branch
- Do NOT share `main` or `Boilerplate` branch URLs as concept previews — always use your feature branch URL
- When you are ready to promote approved work to Boilerplate, run `/handoff`
