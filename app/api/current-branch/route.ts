import { execSync } from 'child_process';
import { NextResponse } from 'next/server';
import path from 'path';

export async function GET() {
  try {
    const branch = execSync('git branch --show-current', { cwd: path.resolve(process.cwd()) }).toString().trim();
    // Extract owner slug from remote URL (e.g. ranjithravi_microsoft → ranjith)
    let ownerSlug = '';
    try {
      const remoteUrl = execSync('git remote get-url gim-connectors', { cwd: path.resolve(process.cwd()) }).toString().trim();
      const match = remoteUrl.match(/https?:\/\/([^:@]+)/);
      if (match) ownerSlug = match[1].replace(/_microsoft$/, '').toLowerCase();
    } catch { /* ignore */ }
    return NextResponse.json({ branch, ownerSlug });
  } catch {
    return NextResponse.json({ branch: '', ownerSlug: '' });
  }
}
