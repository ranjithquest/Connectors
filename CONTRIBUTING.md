# Contributing to the Connectors Prototype

This guide explains how to prototype a feature, get a preview URL, and promote work to the shared baseline.

---

## Ground Rules

- **Never push directly to `main`**
- All work happens on a personal feature branch
- Only approved components get cherry-picked into `main`
- Keep mock data realistic — don't add test data with names like "foo" or "test123"

---

## Step-by-Step: Prototyping a Feature

### 1. Start from main
Always branch off `main`:
```bash
git fetch gim-connectors
git checkout main
git pull gim-connectors main
git checkout -b your-name/feature-name
```

### 2. Build your concept
- Use Claude Code with the spec or Figma file
- Follow the component and icon rules in `CLAUDE.md`
- Update `lib/mock-data.ts` for any new data states you need

### 3. Push and get your preview URL
Use `/publish` in Claude Code — it handles branching, committing, pushing, and gives you the preview URL.

Or manually:
```bash
git push gim-connectors your-name/feature-name
```
GitHub Actions will build and deploy your branch. A comment on your commit will show the preview URL:
```
https://studious-adventure-j17vp6o.pages.github.io/<branch-slug>/connectors
```
Share this URL with stakeholders directly — no build steps needed on their end.

### 4. Iterate
Push more commits to the same branch — each push updates the same preview URL.

### 5. Get approval
Share the preview with your product/design stakeholders. Document which components/files are approved for promotion.

### 6. Promote approved parts to main
Use `/handoff` in Claude Code — it cherry-picks only the approved files into `main`.

Or manually:
```bash
git checkout main
git checkout your-name/feature-name -- components/connectors/MyNewComponent.tsx
git commit -m "Promote MyNewComponent — approved by [stakeholder name]"
git push gim-connectors main
```

### 7. Clean up
```bash
git push gim-connectors --delete your-name/feature-name
git branch -d your-name/feature-name
```

---

## What NOT to Promote

- Work-in-progress or half-finished components
- Debug code, console.logs, or commented-out experiments
- Changes to `next.config.mjs`, `tailwind.config.ts`, or `package.json` without team discussion
- New dependencies without team agreement

---

## Working with Claude Code

If you're using Claude Code to prototype:
1. Make sure the **Figma** and **Playwright** MCP plugins are installed
2. Claude will follow the rules in `CLAUDE.md` automatically
3. Claude will always work on a feature branch — never directly on `main`
4. Use `/publish` to push and get a preview URL
5. Use `/handoff` to cherry-pick approved files into `main`

---

## Questions?

Reach out to Ranjith Ravi or open a discussion in the repo.
