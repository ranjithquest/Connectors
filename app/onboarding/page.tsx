'use client';

import Link from 'next/link';
import { FluentProvider, webLightTheme, Button, Badge } from '@fluentui/react-components';

const STEPS = [
  {
    title: 'Clone the repo and run locally',
    body: 'Clone the Boilerplate branch to your machine, run npm install && npm run dev. The app opens at localhost:3000.',
  },
  {
    title: 'Install Claude Code',
    body: 'Install the Claude Code CLI or VS Code extension. Enable the Figma and Playwright MCP plugins in Claude Code settings for design implementation.',
  },
  {
    title: 'Create a feature branch',
    body: 'Always branch from Boilerplate — never work on main directly.\ngit checkout Boilerplate && git checkout -b your-name/feature-name',
  },
  {
    title: 'Build your concept',
    body: 'Give Claude a product spec, user story, or Figma URL. It builds the UI concept on your branch using Fluent UI components and realistic mock data.',
  },
  {
    title: 'Publish and share',
    body: 'Run /publish in Claude Code. It pushes your branch, deploys it automatically, and gives you a shareable preview URL for stakeholders.',
  },
  {
    title: 'Add a walkthrough for reviews',
    body: 'Run /walkthrough to add a step-by-step guided tour with annotations. Append ?tour=true to your preview URL to activate it during presentations.',
  },
  {
    title: 'Promote approved work',
    body: 'Once approved, run /handoff to extract clean production-ready components. Cherry-pick the approved files into Boilerplate for the shared baseline.',
  },
];

const SKILLS = [
  {
    cmd: '/onboard',
    title: 'Onboard',
    desc: 'Walk through setup step by step and get answers about how this boilerplate works.',
  },
  {
    cmd: '/publish',
    title: 'Publish',
    desc: 'Name your concept, push your branch, get a shareable preview URL, and send it to stakeholders.',
  },
  {
    cmd: '/walkthrough',
    title: 'Walkthrough',
    desc: 'Add a guided tour with numbered step annotations for LT reviews and stakeholder presentations.',
  },
  {
    cmd: '/handoff',
    title: 'Handoff',
    desc: 'Extract approved components into production-ready code with a full integration guide for engineering.',
  },
];

const TOOLS = ['Claude Code', 'Git', 'Node.js 20+', 'Figma MCP plugin', 'Playwright MCP plugin'];

const QUICK_LINKS = [
  { label: 'Component library', href: 'https://admincontrolsdemoapps.z22.web.core.windows.net/storybook/latest/Storybook/?path=/docs/about--docs', external: true },
  { label: 'MDL2 icon browser', href: 'https://iconcloud.design/browse/Full%20MDL2%20Assets', external: true },
  { label: 'Fluent UI v9 docs', href: 'https://react.fluentui.dev', external: true },
  { label: 'Contributing guide', href: 'https://github.com/gim-home/Connectors/blob/Boilerplate/CONTRIBUTING.md', external: true },
];

export default function OnboardingPage() {
  return (
    <FluentProvider theme={webLightTheme} style={{ background: 'transparent' }}>
      <div style={{ minHeight: '100vh', background: '#ffffff', fontFamily: "'Segoe UI', system-ui, sans-serif" }}>

        {/* Content column — matches Fluent docs ~530px content width with left margin */}
        <div style={{ maxWidth: 760, padding: '48px 48px 80px' }}>

          {/* Page title */}
          <h1 style={{ fontSize: 40, fontWeight: 600, color: '#242424', lineHeight: '52px', margin: '0 0 16px 0', letterSpacing: '-0.5px' }}>
            Connectors Prototyping Boilerplate
          </h1>

          {/* Lead */}
          <p style={{ fontSize: 16, color: '#424242', lineHeight: '26px', margin: '0 0 56px 0', maxWidth: 560 }}>
            A shared environment for rapidly building, previewing, and handing off Copilot Connector feature concepts — from idea to stakeholder review to engineering handoff.
          </p>

          {/* Section: Getting started */}
          <h2 style={{ fontSize: 24, fontWeight: 600, color: '#242424', lineHeight: '32px', margin: '0 0 16px 0' }}>
            Getting started
          </h2>
          <p style={{ fontSize: 14, color: '#424242', lineHeight: '24px', margin: '0 0 28px 0' }}>
            Follow these steps to go from zero to a shareable prototype. You don't need to be an engineer — Claude handles the code.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 24, marginBottom: 56 }}>
            {STEPS.map((step, i) => (
              <div key={i} style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>
                <div style={{
                  width: 28, height: 28, borderRadius: '50%',
                  background: '#0f6cbd', color: '#fff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 12, fontWeight: 700, flexShrink: 0, marginTop: 2,
                }}>
                  {i + 1}
                </div>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 600, color: '#242424', marginBottom: 4 }}>{step.title}</div>
                  <div style={{ fontSize: 14, color: '#616161', lineHeight: '22px', whiteSpace: 'pre-line' }}>{step.body}</div>
                </div>
              </div>
            ))}
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid #e0e0e0', margin: '0 0 56px 0' }} />

          {/* Section: Claude skills */}
          <h2 style={{ fontSize: 24, fontWeight: 600, color: '#242424', lineHeight: '32px', margin: '0 0 16px 0' }}>
            Claude skills
          </h2>
          <p style={{ fontSize: 14, color: '#424242', lineHeight: '24px', margin: '0 0 28px 0' }}>
            Type these commands in Claude Code to trigger built-in workflows. Each skill guides you step by step.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 16, marginBottom: 56 }}>
            {SKILLS.map((s) => (
              <div key={s.cmd} style={{
                padding: '20px 24px',
                border: '1px solid #e0e0e0',
                borderRadius: 12,
                background: '#fafafa',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                  <code style={{
                    fontSize: 13, fontWeight: 700, color: '#0f6cbd',
                    background: '#ebf3fc', padding: '2px 10px', borderRadius: 4,
                  }}>{s.cmd}</code>
                </div>
                <div style={{ fontSize: 15, fontWeight: 600, color: '#242424', marginBottom: 4 }}>{s.title}</div>
                <div style={{ fontSize: 13, color: '#616161', lineHeight: '20px' }}>{s.desc}</div>
              </div>
            ))}
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid #e0e0e0', margin: '0 0 56px 0' }} />

          {/* Section: What you need */}
          <h2 style={{ fontSize: 24, fontWeight: 600, color: '#242424', lineHeight: '32px', margin: '0 0 16px 0' }}>
            What you need
          </h2>
          <p style={{ fontSize: 14, color: '#424242', lineHeight: '24px', margin: '0 0 20px 0' }}>
            Install these tools before you start. Claude Code and Git are the essentials — the MCP plugins unlock Figma design implementation.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 56 }}>
            {TOOLS.map((t) => (
              <span key={t} style={{
                fontSize: 13, color: '#242424', background: '#f0f0f0',
                padding: '5px 12px', borderRadius: 6, fontWeight: 500,
              }}>{t}</span>
            ))}
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid #e0e0e0', margin: '0 0 56px 0' }} />

          {/* Section: Resources */}
          <h2 style={{ fontSize: 24, fontWeight: 600, color: '#242424', lineHeight: '32px', margin: '0 0 16px 0' }}>
            Resources
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {QUICK_LINKS.map((l) => (
              <a
                key={l.label}
                href={l.href}
                target="_blank"
                rel="noopener noreferrer"
                style={{ fontSize: 14, color: '#0f6cbd', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 4 }}
                onMouseOver={(e) => (e.currentTarget.style.textDecoration = 'underline')}
                onMouseOut={(e) => (e.currentTarget.style.textDecoration = 'none')}
              >
                {l.label} →
              </a>
            ))}
            <Link
              href="/connectors"
              style={{ fontSize: 14, color: '#0f6cbd', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 4, marginTop: 4 }}
            >
              Open the Connectors app →
            </Link>
          </div>

        </div>
      </div>
    </FluentProvider>
  );
}
