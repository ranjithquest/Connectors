import { execSync } from 'child_process';
import { NextRequest, NextResponse } from 'next/server';
import path from 'path';

const REPO_ROOT = path.resolve(process.cwd());

export async function POST(req: NextRequest) {
  try {
    const { branch } = await req.json();
    if (!branch?.trim()) return NextResponse.json({ error: 'Branch is required' }, { status: 400 });

    // Fetch remote so the branch ref exists locally
    execSync('git fetch gim-connectors --quiet', { cwd: REPO_ROOT, timeout: 15000 });
    execSync(`git checkout ${branch}`, { cwd: REPO_ROOT });

    return NextResponse.json({ branch, message: `Switched to "${branch}"` });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
