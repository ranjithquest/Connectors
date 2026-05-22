import { execSync } from 'child_process';
import { NextRequest, NextResponse } from 'next/server';
import path from 'path';

const REPO_ROOT = path.resolve(process.cwd());

function toBranchSlug(name: string): string {
  return name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

export async function POST(req: NextRequest) {
  try {
    const { name, owner } = await req.json();
    if (!name?.trim()) return NextResponse.json({ error: 'Feature name is required' }, { status: 400 });

    const slug = toBranchSlug(name);
    const ownerSlug = (owner ?? 'ranjith').toLowerCase().replace(/\s+/g, '');
    const branch = `${ownerSlug}/${slug}`;

    // Refuse to create if the working tree is dirty — otherwise the user's in-progress
    // changes would silently follow them onto the new branch.
    const dirty = execSync('git status --porcelain', { cwd: REPO_ROOT }).toString().trim();
    if (dirty) {
      return NextResponse.json({
        error: 'You have uncommitted changes on the current branch. Commit them (run /publish), stash them, or discard them before creating a new feature.',
      }, { status: 409 });
    }

    // Refuse if a local or remote branch with this name already exists.
    const remoteRefs = execSync('git ls-remote --heads gim-connectors', { cwd: REPO_ROOT, timeout: 10000 }).toString();
    const localRefs = execSync('git for-each-ref --format=%(refname:short) refs/heads/', { cwd: REPO_ROOT }).toString();
    if (remoteRefs.includes(`refs/heads/${branch}`) || localRefs.split('\n').map(s => s.trim()).includes(branch)) {
      return NextResponse.json({ error: `Branch "${branch}" already exists` }, { status: 409 });
    }

    // Create branch off main and switch to it in one step.
    execSync('git fetch gim-connectors main --quiet', { cwd: REPO_ROOT, timeout: 10000 });
    execSync(`git checkout -b ${branch} gim-connectors/main`, { cwd: REPO_ROOT });

    return NextResponse.json({ branch, message: `Branch "${branch}" created and checked out` });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
