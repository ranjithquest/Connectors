'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Stack, Text } from '@fluentui/react';
import { FluentProvider, webLightTheme, webDarkTheme, Badge, Button, Card, CardHeader } from '@fluentui/react-components';
import {
  ContactIcon, CodeIcon, LightbulbIcon, RocketIcon,
  BranchForkIcon, OpenPaneIcon, CheckMarkIcon,
  InfoIcon, GroupIcon, TriggerApprovalIcon,
} from '@fluentui/react-icons-mdl2';

const ROLES = [
  {
    id: 'product',
    label: 'Product',
    icon: <LightbulbIcon style={{ fontSize: 24 }} />,
    color: '#0078d4',
    bg: '#eff6fc',
    description: 'Turn specs and ideas into clickable prototypes without writing code.',
    steps: [
      { title: 'Clone the repo', body: 'Download the boilerplate to your local machine. You need Git and Node.js installed.' },
      { title: 'Install Claude Code', body: 'Install the Claude Code CLI or VS Code extension. This is your primary tool for generating concepts.' },
      { title: 'Create a feature branch', body: 'Run: git checkout Boilerplate && git checkout -b your-name/feature-name' },
      { title: 'Give Claude your spec', body: 'Paste your product spec, user story, or Figma link. Claude will build the UI concept on your branch.' },
      { title: 'Push and share', body: 'Run: git push origin your-name/feature-name — a preview URL is posted on your commit automatically.' },
      { title: 'Promote approved work', body: 'Once stakeholders approve, ask Claude to cherry-pick the approved components into Boilerplate.' },
    ],
    tools: ['Claude Code', 'Git', 'GitHub'],
  },
  {
    id: 'design',
    label: 'Design',
    icon: <OpenPaneIcon style={{ fontSize: 24 }} />,
    color: '#7719aa',
    bg: '#f7f0fb',
    description: 'Implement Figma designs directly into the prototype environment.',
    steps: [
      { title: 'Clone the repo', body: 'Download the boilerplate to your local machine. You need Git and Node.js installed.' },
      { title: 'Install Claude Code + MCP plugins', body: 'Install Claude Code and enable the Figma and Playwright MCP plugins in settings.' },
      { title: 'Create a feature branch', body: 'Run: git checkout Boilerplate && git checkout -b your-name/feature-name' },
      { title: 'Share your Figma URL', body: 'Paste your Figma link into Claude. It reads the design directly and implements it using Fluent UI components.' },
      { title: 'Verify with Playwright', body: 'Claude can take screenshots of the running prototype to verify it matches the design.' },
      { title: 'Push and share', body: 'Run: git push origin your-name/feature-name — preview URL is posted automatically on your commit.' },
    ],
    tools: ['Claude Code', 'Figma MCP plugin', 'Playwright MCP plugin', 'Git'],
  },
  {
    id: 'engineering',
    label: 'Engineering',
    icon: <CodeIcon style={{ fontSize: 24 }} />,
    color: '#107c10',
    bg: '#f1faf1',
    description: 'Build production-ready components and hand them off to the product repo.',
    steps: [
      { title: 'Clone and run locally', body: 'git clone, npm install, npm run dev. The app runs on localhost:3000.' },
      { title: 'Create a feature branch', body: 'Always branch from Boilerplate: git checkout Boilerplate && git checkout -b your-name/feature-name' },
      { title: 'Use Fluent UI first', body: 'Check Admin Controls → Fluent UI v9 → Fluent UI v8 → Tailwind (layout only). Never build custom components for things Fluent covers.' },
      { title: 'Icons from MDL2', body: 'Import from @fluentui/react-icons-mdl2. Fall back to @fluentui/react-icons. No other icon libraries.' },
      { title: 'Push for preview', body: 'git push origin your-name/feature-name — auto-deploys to a unique GitHub Pages URL for design/product review.' },
      { title: 'Run /handoff when approved', body: 'Use the /handoff Claude skill to extract clean, production-ready components ready for the product repo.' },
    ],
    tools: ['Node.js 20+', 'Git', 'Claude Code', 'VS Code'],
  },
];

const QUICK_LINKS = [
  { label: 'Component rules', href: 'https://admincontrolsdemoapps.z22.web.core.windows.net/storybook/latest/Storybook/?path=/docs/about--docs', external: true },
  { label: 'MDL2 icon browser', href: 'https://iconcloud.design/browse/Full%20MDL2%20Assets', external: true },
  { label: 'Fluent UI v9 docs', href: 'https://react.fluentui.dev', external: true },
  { label: 'CONTRIBUTING guide', href: 'https://github.com/gim-home/Connectors/blob/Boilerplate/CONTRIBUTING.md', external: true },
  { label: 'Connectors app →', href: '/connectors', external: false },
];

export default function OnboardingPage() {
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const role = ROLES.find((r) => r.id === selectedRole) ?? null;

  return (
    <FluentProvider theme={webLightTheme} style={{ background: 'transparent' }}>
      <div className="min-h-screen bg-white dark:bg-[#141414]">

        {/* Hero */}
        <div className="bg-[#0078d4] px-4 sm:px-8 lg:px-12 py-12">
          <Stack tokens={{ childrenGap: 8 }}>
            <Text styles={{ root: { fontSize: 28, fontWeight: 700, color: '#ffffff', lineHeight: '36px' } }}>
              Welcome to the Connectors Prototyping Boilerplate
            </Text>
            <Text styles={{ root: { fontSize: 16, color: 'rgba(255,255,255,0.85)', maxWidth: 640 } }}>
              A shared environment for product, design, and engineering to build, preview, and hand off Copilot Connector features — fast.
            </Text>
          </Stack>
        </div>

        <div className="px-4 sm:px-8 lg:px-12 py-10">

          {/* Role selector */}
          <Stack tokens={{ childrenGap: 6 }} styles={{ root: { marginBottom: 32 } }}>
            <Text styles={{ root: { fontSize: 18, fontWeight: 600, color: '#323130' } }}>
              Who are you?
            </Text>
            <Text styles={{ root: { fontSize: 14, color: '#605e5c' } }}>
              Select your role to see a tailored getting started guide.
            </Text>
            <Stack horizontal tokens={{ childrenGap: 12 }} styles={{ root: { marginTop: 8, flexWrap: 'wrap' } }}>
              {ROLES.map((r) => (
                <button
                  key={r.id}
                  onClick={() => setSelectedRole(r.id === selectedRole ? null : r.id)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 10, padding: '12px 20px',
                    border: `2px solid ${r.id === selectedRole ? r.color : '#e1e1e1'}`,
                    borderRadius: 8, background: r.id === selectedRole ? r.bg : '#ffffff',
                    cursor: 'pointer', transition: 'all 0.15s',
                  }}
                >
                  <span style={{ color: r.color }}>{r.icon}</span>
                  <span style={{ fontSize: 15, fontWeight: 600, color: r.id === selectedRole ? r.color : '#323130' }}>{r.label}</span>
                  {r.id === selectedRole && <CheckMarkIcon style={{ fontSize: 14, color: r.color }} />}
                </button>
              ))}
            </Stack>
          </Stack>

          {/* Role guide */}
          {role && (
            <div style={{ marginBottom: 40, padding: 24, borderRadius: 8, border: `1px solid ${role.color}30`, background: role.bg }}>
              <Stack tokens={{ childrenGap: 4 }} styles={{ root: { marginBottom: 20 } }}>
                <Text styles={{ root: { fontSize: 16, fontWeight: 600, color: role.color } }}>{role.label} Guide</Text>
                <Text styles={{ root: { fontSize: 14, color: '#484644' } }}>{role.description}</Text>
              </Stack>

              {/* Steps */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20 }}>
                {role.steps.map((step, i) => (
                  <div key={i} style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                    <div style={{
                      width: 28, height: 28, borderRadius: '50%', background: role.color,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                    }}>
                      <span style={{ fontSize: 12, fontWeight: 700, color: '#fff' }}>{i + 1}</span>
                    </div>
                    <div>
                      <Text styles={{ root: { fontSize: 14, fontWeight: 600, color: '#323130', display: 'block' } }}>{step.title}</Text>
                      <Text styles={{ root: { fontSize: 13, color: '#605e5c' } }}>{step.body}</Text>
                    </div>
                  </div>
                ))}
              </div>

              {/* Tools needed */}
              <Stack tokens={{ childrenGap: 6 }}>
                <Text styles={{ root: { fontSize: 12, fontWeight: 600, color: '#605e5c', textTransform: 'uppercase', letterSpacing: '0.05em' } }}>
                  Tools you need
                </Text>
                <Stack horizontal tokens={{ childrenGap: 8 }} styles={{ root: { flexWrap: 'wrap' } }}>
                  {role.tools.map((t) => (
                    <Badge key={t} appearance="outline" size="medium">{t}</Badge>
                  ))}
                </Stack>
              </Stack>
            </div>
          )}

          {/* Workflow overview */}
          <Stack tokens={{ childrenGap: 6 }} styles={{ root: { marginBottom: 32 } }}>
            <Text styles={{ root: { fontSize: 18, fontWeight: 600, color: '#323130' } }}>How it works</Text>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, marginTop: 8 }}>
              {[
                { icon: <BranchForkIcon style={{ fontSize: 20, color: '#0078d4' }} />, title: 'Branch', body: 'Create a feature branch from Boilerplate. Your work stays isolated.' },
                { icon: <LightbulbIcon style={{ fontSize: 20, color: '#7719aa' }} />, title: 'Build', body: 'Use Claude with a spec or Figma file. Get a working prototype fast.' },
                { icon: <RocketIcon style={{ fontSize: 20, color: '#107c10' }} />, title: 'Preview', body: 'Push your branch — a unique preview URL is posted automatically on your commit.' },
                { icon: <GroupIcon style={{ fontSize: 20, color: '#835b00' }} />, title: 'Review', body: 'Share the URL with stakeholders and LT. Add a walkthrough tour for guided demos.' },
                { icon: <TriggerApprovalIcon style={{ fontSize: 20, color: '#a80000' }} />, title: 'Approve', body: 'Decide which parts to promote. Cherry-pick approved components into Boilerplate.' },
                { icon: <CodeIcon style={{ fontSize: 20, color: '#0078d4' }} />, title: 'Handoff', body: 'Run /handoff to export clean, production-ready components to the product repo.' },
              ].map((item) => (
                <div key={item.title} style={{ padding: 16, border: '1px solid #e1e1e1', borderRadius: 8, background: '#faf9f8' }}>
                  <Stack tokens={{ childrenGap: 6 }}>
                    {item.icon}
                    <Text styles={{ root: { fontSize: 14, fontWeight: 600, color: '#323130' } }}>{item.title}</Text>
                    <Text styles={{ root: { fontSize: 13, color: '#605e5c' } }}>{item.body}</Text>
                  </Stack>
                </div>
              ))}
            </div>
          </Stack>

          {/* Claude skills */}
          <Stack tokens={{ childrenGap: 6 }} styles={{ root: { marginBottom: 32 } }}>
            <Text styles={{ root: { fontSize: 18, fontWeight: 600, color: '#323130' } }}>Claude Skills</Text>
            <Text styles={{ root: { fontSize: 14, color: '#605e5c' } }}>
              Type these commands in Claude Code to trigger built-in workflows.
            </Text>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 8 }}>
              {[
                { cmd: '/onboard', desc: 'Walk through role-specific setup and answer questions about the boilerplate.' },
                { cmd: '/publish', desc: 'Push your branch to GitHub, get your preview URL, and share it with stakeholders.' },
                { cmd: '/walkthrough', desc: 'Add an interactive guided tour to your prototype for stakeholder presentations.' },
                { cmd: '/handoff', desc: 'Extract approved components into production-ready code for the engineering team.' },
              ].map((s) => (
                <div key={s.cmd} style={{ display: 'flex', gap: 16, alignItems: 'center', padding: '12px 16px', border: '1px solid #e1e1e1', borderRadius: 6, background: '#ffffff' }}>
                  <code style={{ fontSize: 13, fontWeight: 700, color: '#0078d4', background: '#eff6fc', padding: '2px 8px', borderRadius: 4, flexShrink: 0 }}>{s.cmd}</code>
                  <Text styles={{ root: { fontSize: 13, color: '#484644' } }}>{s.desc}</Text>
                </div>
              ))}
            </div>
          </Stack>

          {/* Quick links */}
          <Stack tokens={{ childrenGap: 6 }}>
            <Text styles={{ root: { fontSize: 18, fontWeight: 600, color: '#323130' } }}>Quick links</Text>
            <Stack horizontal tokens={{ childrenGap: 8 }} styles={{ root: { flexWrap: 'wrap', marginTop: 8 } }}>
              {QUICK_LINKS.map((l) =>
                l.external ? (
                  <a key={l.label} href={l.href} target="_blank" rel="noopener noreferrer">
                    <Button appearance="outline" size="small">{l.label}</Button>
                  </a>
                ) : (
                  <Link key={l.label} href={l.href}>
                    <Button appearance="primary" size="small">{l.label}</Button>
                  </Link>
                )
              )}
            </Stack>
          </Stack>

        </div>
      </div>
    </FluentProvider>
  );
}
