import { execSync } from 'child_process';
import { NextResponse } from 'next/server';
import path from 'path';

const SKIP = /^(main|gh-pages|dependabot\/|copilot\/)/;
const BASE = 'https://studious-adventure-j17vp6o.pages.github.io';

// Per-branch metadata — description is auto-generated from git commits
// Add decks/walkthroughs here as they are created
const BRANCH_META: Record<string, {
  decks?: { label: string; url: string }[];
  walkthroughs?: { label: string; url: string }[];
}> = {
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

const FILLER = /^(fix|update|add|remove|improve|refactor|tweak|clean|bump|wip|misc|minor|merge|revert)\b/i;

function getBranchDescription(branch: string, remote = 'origin'): string {
  try {
    const log = execSync(
      `git log ${remote}/main..${remote}/${branch} --format="%s" --no-merges`,
      { cwd: REPO_ROOT, timeout: 5000 }
    ).toString().trim();
    if (!log) return '';
    const subjects = log.split('\n').filter(Boolean);
    // Prefer the first meaningful commit (branch purpose); fall back to the oldest commit.
    const meaningful = subjects.find(s => !FILLER.test(s.trim())) ?? subjects[subjects.length - 1];
    // Strip conventional commit prefix (feat:, feat(scope):, fix:, etc.) then capitalise.
    return meaningful.trim()
      .replace(/^[a-z]+(\([^)]+\))?:\s*/i, '')
      .replace(/^./, c => c.toUpperCase())
      .replace(/\.$/, '');
  } catch {
    return '';
  }
}
const REPO_ROOT = path.resolve(process.cwd());

function formatDate(isoDate: string): string {
  return new Date(isoDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function featureNameFromSlug(slug: string): string {
  return slug
    .replace(/-/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase());
}

function ownerFromBranch(branch: string): string {
  // For owner/feature branches, the owner is the part before the first slash.
  // For flat branches (e.g. "Salesforce-ME-ID"), there's no clear owner, so fall back to '—'.
  return branch.includes('/') ? branch.split('/')[0] : '—';
}

function resolveRemote(): string {
  try {
    execSync('git remote get-url gim-connectors', { cwd: REPO_ROOT });
    return 'gim-connectors';
  } catch {
    return 'origin';
  }
}

export async function GET() {
  try {
    const remote = resolveRemote();
    execSync(`git fetch ${remote} --quiet`, { cwd: REPO_ROOT, timeout: 15000 });
    const lsRemote = execSync(`git ls-remote --heads ${remote}`, { cwd: REPO_ROOT, timeout: 10000 }).toString();

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
        rawDate = execSync(`git log -1 --format="%ci" "${remote}/${branch}"`, { cwd: REPO_ROOT }).toString().trim();
        if (!rawDate) rawDate = execSync(`git log -1 --format="%ci" ${sha}`, { cwd: REPO_ROOT }).toString().trim();
      } catch { /* ignore */ }

      // Owner/feature branches put the slug after the first slash. Flat branches use the whole name.
      const featureSlug = branch.includes('/') ? branch.split('/').slice(1).join('/') : branch;

      const meta = BRANCH_META[branch] ?? {};
      return {
        name: featureNameFromSlug(featureSlug),
        branch,
        owner: ownerFromBranch(branch),
        lastModified: rawDate ? formatDate(rawDate) : '',
        _rawDate: rawDate,
        previewUrl: `${BASE}/${branch}/connectors`,
        description: getBranchDescription(branch, remote) || null,
        decks: meta.decks ?? [],
        walkthroughs: meta.walkthroughs ?? [],
      };
    });

    // Sort by raw ISO date descending — reliable ordering
    features.sort((a, b) => {
      if (!a._rawDate) return 1;
      if (!b._rawDate) return -1;
      return a._rawDate > b._rawDate ? -1 : 1;
    });

    // Strip internal sort key before returning
    const result = features.map(({ _rawDate, ...f }) => f);

    return NextResponse.json({ features: result });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
