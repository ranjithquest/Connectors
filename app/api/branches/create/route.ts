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

    // Check branch doesn't already exist
    const existing = execSync('git ls-remote --heads gim-connectors', { cwd: REPO_ROOT, timeout: 10000 }).toString();
    if (existing.includes(`refs/heads/${branch}`)) {
      return NextResponse.json({ error: `Branch "${branch}" already exists` }, { status: 409 });
    }

    // Create branch off main
    execSync('git fetch gim-connectors main --quiet', { cwd: REPO_ROOT, timeout: 10000 });
    execSync(`git checkout -b ${branch} gim-connectors/main`, { cwd: REPO_ROOT });

    return NextResponse.json({ branch, message: `Branch "${branch}" created successfully` });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
