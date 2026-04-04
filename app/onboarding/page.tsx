'use client';

import Link from 'next/link';
import { Stack, Text } from '@fluentui/react';
import { FluentProvider, webLightTheme, Badge, Button } from '@fluentui/react-components';
import {
  CodeIcon, LightbulbIcon, RocketIcon,
  BranchForkIcon, GroupIcon, TriggerApprovalIcon,
} from '@fluentui/react-icons-mdl2';

const STEPS = [
  {
    title: 'Clone the repo and run locally',
    body: 'git clone the Boilerplate branch, run npm install && npm run dev. The app opens at localhost:3000.',
  },
  {
    title: 'Install Claude Code',
    body: 'Install the Claude Code CLI or VS Code extension. Also enable the Figma and Playwright MCP plugins in Claude Code settings.',
  },
  {
    title: 'Create a feature branch',
    body: 'Always branch from Boilerplate — never work on main directly.\ngit checkout Boilerplate && git checkout -b your-name/feature-name',
  },
  {
    title: 'Build your concept',
    body: 'Give Claude a product spec, user story, or Figma URL. It will build the UI concept on your branch using Fluent UI components.',
  },
  {
    title: 'Publish and share',
    body: 'Run /publish in Claude Code. It pushes your branch, deploys it, and gives you a shareable preview URL to send to stakeholders.',
  },
  {
    title: 'Add a walkthrough for reviews',
    body: 'Run /walkthrough in Claude Code to add a guided tour with step-by-step annotations. Append ?tour=true to your URL to activate it.',
  },
  {
    title: 'Promote approved work',
    body: 'Once stakeholders approve, run /handoff to extract clean, production-ready components. Cherry-pick approved files into Boilerplate.',
  },
];

const SKILLS = [
  { cmd: '/onboard', desc: 'Walk through setup and get answers about how this boilerplate works.' },
  { cmd: '/publish', desc: 'Push your branch, get your preview URL, and share it with stakeholders.' },
  { cmd: '/walkthrough', desc: 'Add a guided tour with step annotations for presentations and LT reviews.' },
  { cmd: '/handoff', desc: 'Extract approved components into production-ready code for the product repo.' },
];

const QUICK_LINKS = [
  { label: 'Component library', href: 'https://admincontrolsdemoapps.z22.web.core.windows.net/storybook/latest/Storybook/?path=/docs/about--docs', external: true },
  { label: 'MDL2 icons', href: 'https://iconcloud.design/browse/Full%20MDL2%20Assets', external: true },
  { label: 'Fluent UI v9', href: 'https://react.fluentui.dev', external: true },
  { label: 'Contributing guide', href: 'https://github.com/gim-home/Connectors/blob/Boilerplate/CONTRIBUTING.md', external: true },
  { label: 'Open the app →', href: '/connectors', external: false },
];

const TOOLS = ['Claude Code', 'Git', 'Node.js 20+', 'Figma MCP plugin', 'Playwright MCP plugin'];

export default function OnboardingPage() {
  return (
    <FluentProvider theme={webLightTheme} style={{ background: 'transparent' }}>
      <div className="min-h-screen bg-white dark:bg-[#141414]">

        {/* Hero */}
        <div className="bg-[#0078d4] px-4 sm:px-8 lg:px-12 py-12">
          <Stack tokens={{ childrenGap: 8 }}>
            <Text styles={{ root: { fontSize: 28, fontWeight: 700, color: '#ffffff', lineHeight: '36px' } }}>
              Welcome to the Connectors Prototyping Boilerplate
            </Text>
            <Text styles={{ root: { fontSize: 16, color: 'rgba(255,255,255,0.85)', maxWidth: 600 } }}>
              A shared environment for rapidly building, previewing, and handing off Copilot Connector feature concepts — from idea to stakeholder review to engineering handoff.
            </Text>
          </Stack>
        </div>

        <div className="px-4 sm:px-8 lg:px-12 py-10" style={{ maxWidth: 860 }}>

          {/* Getting started */}
          <Stack tokens={{ childrenGap: 6 }} styles={{ root: { marginBottom: 40 } }}>
            <Text styles={{ root: { fontSize: 20, fontWeight: 600, color: '#323130' } }}>Getting started</Text>
            <Text styles={{ root: { fontSize: 14, color: '#605e5c', marginBottom: 8 } }}>
              Follow these steps to go from zero to a shareable prototype.
            </Text>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {STEPS.map((step, i) => (
                <div key={i} style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: '50%', background: '#0078d4',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2,
                  }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>{i + 1}</span>
                  </div>
                  <div>
                    <Text styles={{ root: { fontSize: 14, fontWeight: 600, color: '#323130', display: 'block', marginBottom: 2 } }}>{step.title}</Text>
                    <Text styles={{ root: { fontSize: 13, color: '#605e5c', whiteSpace: 'pre-line' } }}>{step.body}</Text>
                  </div>
                </div>
              ))}
            </div>
          </Stack>

          {/* Tools */}
          <Stack tokens={{ childrenGap: 8 }} styles={{ root: { marginBottom: 40 } }}>
            <Text styles={{ root: { fontSize: 20, fontWeight: 600, color: '#323130' } }}>What you need</Text>
            <Stack horizontal tokens={{ childrenGap: 8 }} styles={{ root: { flexWrap: 'wrap' } }}>
              {TOOLS.map((t) => <Badge key={t} appearance="outline" size="large">{t}</Badge>)}
            </Stack>
          </Stack>

          {/* How it works */}
          <Stack tokens={{ childrenGap: 8 }} styles={{ root: { marginBottom: 40 } }}>
            <Text styles={{ root: { fontSize: 20, fontWeight: 600, color: '#323130' } }}>How it works</Text>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 }}>
              {[
                { icon: <BranchForkIcon style={{ fontSize: 20, color: '#0078d4' }} />, title: 'Branch', body: 'Create a feature branch from Boilerplate. Your work stays isolated from the shared baseline.' },
                { icon: <LightbulbIcon style={{ fontSize: 20, color: '#7719aa' }} />, title: 'Build', body: 'Give Claude a spec or Figma file. It builds the UI concept using Fluent UI components.' },
                { icon: <RocketIcon style={{ fontSize: 20, color: '#107c10' }} />, title: 'Publish', body: 'Run /publish — your branch deploys automatically and you get a shareable preview URL.' },
                { icon: <GroupIcon style={{ fontSize: 20, color: '#835b00' }} />, title: 'Review', body: 'Share the URL. Add a walkthrough tour for guided LT or stakeholder presentations.' },
                { icon: <TriggerApprovalIcon style={{ fontSize: 20, color: '#a80000' }} />, title: 'Approve', body: 'Stakeholders decide what to keep. Approved parts get cherry-picked into Boilerplate.' },
                { icon: <CodeIcon style={{ fontSize: 20, color: '#0078d4' }} />, title: 'Handoff', body: 'Run /handoff to export clean production-ready components for the engineering team.' },
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
          <Stack tokens={{ childrenGap: 8 }} styles={{ root: { marginBottom: 40 } }}>
            <Text styles={{ root: { fontSize: 20, fontWeight: 600, color: '#323130' } }}>Claude skills</Text>
            <Text styles={{ root: { fontSize: 14, color: '#605e5c' } }}>
              Type these commands in Claude Code to trigger built-in workflows.
            </Text>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {SKILLS.map((s) => (
                <div key={s.cmd} style={{ display: 'flex', gap: 16, alignItems: 'center', padding: '12px 16px', border: '1px solid #e1e1e1', borderRadius: 6, background: '#ffffff' }}>
                  <code style={{ fontSize: 13, fontWeight: 700, color: '#0078d4', background: '#eff6fc', padding: '2px 8px', borderRadius: 4, flexShrink: 0 }}>{s.cmd}</code>
                  <Text styles={{ root: { fontSize: 13, color: '#484644' } }}>{s.desc}</Text>
                </div>
              ))}
            </div>
          </Stack>

          {/* Quick links */}
          <Stack tokens={{ childrenGap: 8 }}>
            <Text styles={{ root: { fontSize: 20, fontWeight: 600, color: '#323130' } }}>Quick links</Text>
            <Stack horizontal tokens={{ childrenGap: 8 }} styles={{ root: { flexWrap: 'wrap' } }}>
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
