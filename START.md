# Copilot Connectors Boilerplate

A prototyping toolkit for designing and sharing Copilot connector experiences. Build features locally, publish them as shareable preview links, and share with stakeholders — no deployment knowledge needed.

---

## What this is

This boilerplate gives your team a shared starting point. Everyone clones the same base, builds their feature on a separate branch, and gets a unique preview URL to share. Nothing gets merged back until you approve it.

---

## Getting started

**Prerequisites:** VS Code with the Claude Code extension installed.

1. Clone this repo to your local machine
2. Open the folder in VS Code
3. In the Claude Code chat, type: **`read SETUP.md and set me up`**

Claude will handle everything automatically — installing dependencies, setting up GitHub authentication, and launching the app.

---

## Building a feature

Once set up, describe what you want to build in the Claude Code chat. Claude will build it for you inside the app.

When you're ready to share:

1. Type **`/publish`** in Claude Code
2. Claude will ask what to call the feature
3. It creates a branch, deploys it, and gives you a shareable link

---

## Preview URLs

Every feature gets its own URL:

```
https://studious-adventure-j17vp6o.pages.github.io/yourname/feature-name/connectors
```

The shared boilerplate is always live at:

```
https://studious-adventure-j17vp6o.pages.github.io/connectors
```

---

## Working on multiple features

You can build multiple features from the same local copy. Just run `/publish` for each one — each gets its own branch and preview URL.

---

## Rules

- Never push directly to `main` — it's protected
- Each feature lives on its own branch (`yourname/feature-name`)
- Preview links are standalone — they don't affect the shared baseline
- When a feature is approved, the repo owner will merge it into `main`
