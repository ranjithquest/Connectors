#!/usr/bin/env node
// Build-time generator for public/branches.json.
// Mirrors the logic in app/api/branches/route.ts so the deployed about page shows
// the same features, descriptions, and ordering as the local dev server.

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const SKIP = /^(main|gh-pages|dependabot\/|copilot\/)/;
const FILLER = /^(fix|update|add|remove|improve|refactor|tweak|clean|bump|wip|misc|minor|merge|revert)\b/i;
const BASE = 'https://studious-adventure-j17vp6o.pages.github.io';

function sh(cmd) {
  return execSync(cmd, { encoding: 'utf8' });
}

function resolveRemote() {
  // CI uses "origin"; local dev pushes to "gim-connectors".
  for (const candidate of ['origin', 'gim-connectors']) {
    try {
      execSync(`git remote get-url ${candidate}`, { stdio: 'pipe' });
      return candidate;
    } catch { /* try next */ }
  }
  throw new Error('No suitable git remote (origin or gim-connectors) found');
}

const REMOTE = resolveRemote();

const BRANCH_META = {
  'ranjith/actionable-errors': {
    decks: [
      { label: 'Actionable Errors — Concept v1', url: 'https://studious-adventure-j17vp6o.pages.github.io/ranjith/actionable-errors/deck' },
      { label: 'Actionable Errors — Stakeholder Review', url: 'https://studious-adventure-j17vp6o.pages.github.io/ranjith/actionable-errors/deck' },
    ],
    walkthroughs: [
      { label: 'Setup flow', url: 'https://studious-adventure-j17vp6o.pages.github.io/ranjith/actionable-errors/connectors?tour=true' },
      { label: 'Error resolution flow', url: 'https://studious-adventure-j17vp6o.pages.github.io/ranjith/actionable-errors/connectors?tour=true' },
    ],
  },
};

function featureNameFromSlug(slug) {
  return slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

function ownerFromBranch(branch) {
  return branch.includes('/') ? branch.split('/')[0] : '—';
}

function getBranchDescription(branch) {
  try {
    const log = execSync(
      `git log ${REMOTE}/main..${REMOTE}/${branch} --format=%s --no-merges`,
      { encoding: 'utf8', timeout: 5000 }
    ).trim();
    if (!log) return '';
    const subjects = log.split('\n').filter(Boolean);
    const meaningful = subjects.find(s => !FILLER.test(s.trim())) ?? subjects[subjects.length - 1];
    return meaningful.trim()
      .replace(/^[a-z]+(\([^)]+\))?:\s*/i, '')
      .replace(/^./, c => c.toUpperCase())
      .replace(/\.$/, '');
  } catch {
    return '';
  }
}

function formatDate(isoDate) {
  return new Date(isoDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

const lsRemote = sh(`git ls-remote --heads ${REMOTE}`);
const branches = lsRemote
  .trim()
  .split('\n')
  .filter(Boolean)
  .map(line => {
    const [sha, ref] = line.split('\t');
    return { sha, branch: ref.replace('refs/heads/', '') };
  })
  .filter(({ branch }) => !SKIP.test(branch));

const features = branches.map(({ sha, branch }) => {
  let rawDate = '';
  try {
    rawDate = execSync(`git log -1 --format=%ci "${REMOTE}/${branch}"`, { encoding: 'utf8' }).trim();
    if (!rawDate) rawDate = execSync(`git log -1 --format=%ci ${sha}`, { encoding: 'utf8' }).trim();
  } catch {
    /* ignore */
  }

  const featureSlug = branch.includes('/') ? branch.split('/').slice(1).join('/') : branch;
  const meta = BRANCH_META[branch] || {};

  return {
    name: featureNameFromSlug(featureSlug),
    branch,
    owner: ownerFromBranch(branch),
    lastModified: rawDate ? formatDate(rawDate) : '',
    _rawDate: rawDate,
    previewUrl: `${BASE}/${branch}/connectors`,
    description: getBranchDescription(branch) || null,
    decks: meta.decks || [],
    walkthroughs: meta.walkthroughs || [],
  };
});

// Newest commit date first; branches with no date sink to the bottom.
features.sort((a, b) => {
  if (!a._rawDate) return 1;
  if (!b._rawDate) return -1;
  return a._rawDate > b._rawDate ? -1 : 1;
});

const result = features.map(({ _rawDate, ...f }) => f);
const outPath = path.join('public', 'branches.json');
fs.writeFileSync(outPath, JSON.stringify({ features: result }));
console.log(`Wrote ${result.length} branches to ${outPath}`);
