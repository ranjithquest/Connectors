import { execSync } from 'child_process';
import { NextResponse } from 'next/server';
import path from 'path';

const REPO_ROOT = path.resolve(process.cwd());

function sh(cmd: string): string {
  return execSync(cmd, { cwd: REPO_ROOT }).toString();
}

export async function GET() {
  try {
    const out = sh("git for-each-ref --format='%(refname:short)' refs/heads/");
    const names = out
      .split('\n')
      .map(b => b.trim())
      .filter(b => b && b !== 'main');

    // Resolve which remote we're publishing to.
    let remote = 'origin';
    try {
      sh('git remote get-url gim-connectors');
      remote = 'gim-connectors';
    } catch { /* keep origin */ }

    // Currently checked-out branch + dirty working tree?
    let currentBranch = '';
    try { currentBranch = sh('git branch --show-current').trim(); } catch { /* ignore */ }
    let workingTreeDirty = false;
    try { workingTreeDirty = sh('git status --porcelain').trim().length > 0; } catch { /* ignore */ }

    const branches = names.map(name => {
      let needsPublish = false;
      try {
        const localSha = sh(`git rev-parse "${name}"`).trim();
        let remoteSha = '';
        try { remoteSha = sh(`git rev-parse "${remote}/${name}"`).trim(); } catch { /* no remote tracking */ }
        if (!remoteSha) needsPublish = true; // branch has never been pushed
        else if (localSha !== remoteSha) needsPublish = true; // commits diverged
      } catch { /* ignore */ }
      if (name === currentBranch && workingTreeDirty) needsPublish = true;
      return { name, needsPublish };
    });

    return NextResponse.json({ branches });
  } catch {
    return NextResponse.json({ branches: [] });
  }
}
