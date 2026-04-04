# Contributing to the Connectors Boilerplate

This guide explains how to prototype a feature, get a preview URL, and promote work to the shared boilerplate.

---

## Ground Rules

- **Never push directly to `main` or `Boilerplate`**
- All work happens on a personal feature branch
- Only promoted (reviewed + approved) components make it into `Boilerplate`
- Keep mock data realistic — don't add test data with names like "foo" or "test123"

---

## Step-by-Step: Prototyping a Feature

### 1. Start from Boilerplate
Always branch off `Boilerplate`, not `main`:
```bash
git fetch origin
git checkout Boilerplate
git pull origin Boilerplate
git checkout -b your-name/feature-name
```

### 2. Build your concept
- Use Claude Code with the spec or Figma file
- Follow the component and icon rules in `CLAUDE.md`
- Update `lib/mock-data.ts` for any new data states you need

### 3. Push and get your preview URL
```bash
git push origin your-name/feature-name
```
GitHub Actions will build and deploy your branch. A comment on your commit will show the preview URL:
```
https://<pages-url>/<branch-slug>/connectors
```
Share this URL with stakeholders directly — no build steps needed on their end.

### 4. Iterate
Push more commits to the same branch — each push updates the same preview URL.

### 5. Get approval
Share the preview with your product/design stakeholders. Document which components/files are approved for promotion.

### 6. Promote approved parts to Boilerplate
Only cherry-pick the specific files that were approved:
```bash
git checkout Boilerplate
git checkout your-name/feature-name -- components/connectors/MyNewComponent.tsx
git checkout your-name/feature-name -- lib/mock-data.ts   # only if data changes are approved
git commit -m "Promote MyNewComponent — approved by [stakeholder name]"
git push origin Boilerplate
```

### 7. Clean up
```bash
git push origin --delete your-name/feature-name
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
3. Claude will always work on a feature branch — never `main` or `Boilerplate`
4. After approval, ask Claude to cherry-pick specific files into `Boilerplate`

---

## Questions?

Reach out to Ranjith Ravi or open a discussion in the repo.
