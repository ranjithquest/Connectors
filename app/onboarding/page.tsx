'use client';

import Link from 'next/link';
import { FluentProvider, webLightTheme } from '@fluentui/react-components';

const STEPS = [
  {
    num: '01',
    title: 'Install VS Code and Claude Code',
    body: 'Download VS Code from code.visualstudio.com. Install the Claude Code extension from the VS Code marketplace. Then enable two MCP plugins inside Claude Code settings: Figma (for reading and implementing designs) and Playwright (for visual verification).',
    accent: '#0f6cbd',
    bg: 'linear-gradient(135deg, #ebf3fc 0%, #f5f9fe 100%)',
  },
  {
    num: '02',
    title: 'Download the boilerplate',
    body: 'Clone this repository to your local machine and run the app.\n\ngit clone https://github.com/gim-home/Connectors.git\ncd Connectors  →  npm install  →  npm run dev\n\nThe app opens at localhost:3000 and redirects to the Connectors experience.',
    accent: '#7719aa',
    bg: 'linear-gradient(135deg, #f7f0fb 0%, #faf5fd 100%)',
  },
  {
    num: '03',
    title: 'Start ideating with Claude',
    body: 'Open the project in VS Code and start a conversation with Claude. Share a product spec, user story, or Figma URL — Claude builds the concept directly in the app using Fluent UI components.\n\nIterate freely. Explore, experiment, and refine until you\'re satisfied. No rules at this stage.',
    accent: '#107c10',
    bg: 'linear-gradient(135deg, #f1faf1 0%, #f6fcf6 100%)',
  },
  {
    num: '04',
    title: 'Add a walkthrough (optional)',
    body: 'Run /walkthrough in Claude Code to add guided step-by-step annotations to your prototype — perfect for LT reviews and stakeholder presentations.\n\nActivate the tour by appending ?tour=true to your preview URL. The clean URL shows no annotations.',
    accent: '#835b00',
    bg: 'linear-gradient(135deg, #fdf8ee 0%, #fefbf4 100%)',
  },
  {
    num: '05',
    title: 'Publish and share',
    body: 'Run /publish in Claude Code when you\'re ready to share. Claude asks for your name and a concept name, then handles everything automatically — creates a branch, pushes your work, deploys it, and gives you a link to share with stakeholders.',
    accent: '#c50f1f',
    bg: 'linear-gradient(135deg, #fdf1f2 0%, #fef6f7 100%)',
  },
];

const SKILLS = [
  { cmd: '/onboard', title: 'Onboard', desc: 'Get guided setup help and answers about how this boilerplate works.' },
  { cmd: '/publish', title: 'Publish', desc: 'Name your concept, push it, deploy it, and get a shareable URL — fully automatic.' },
  { cmd: '/walkthrough', title: 'Walkthrough', desc: 'Add a guided tour with numbered step annotations for presentations and LT reviews.' },
  { cmd: '/handoff', title: 'Handoff', desc: 'Extract approved components into production-ready code with an integration guide.' },
];

const TOOLS = ['VS Code', 'Claude Code', 'Git', 'Node.js 20+', 'Figma MCP plugin', 'Playwright MCP plugin'];

const LINKS = [
  { label: 'Component library', href: 'https://admincontrolsdemoapps.z22.web.core.windows.net/storybook/latest/Storybook/?path=/docs/about--docs' },
  { label: 'MDL2 icon browser', href: 'https://iconcloud.design/browse/Full%20MDL2%20Assets' },
  { label: 'Fluent UI v9 docs', href: 'https://react.fluentui.dev' },
  { label: 'Contributing guide', href: 'https://github.com/gim-home/Connectors/blob/Boilerplate/CONTRIBUTING.md' },
];

export default function OnboardingPage() {
  return (
    <FluentProvider theme={webLightTheme} style={{ background: 'transparent' }}>
      <div style={{ minHeight: '100vh', background: '#ffffff', fontFamily: "'Segoe UI', system-ui, sans-serif" }}>

        {/* Hero — centered, generous padding */}
        <div style={{ textAlign: 'center', padding: '72px 48px 64px', maxWidth: 720, margin: '0 auto' }}>
          {/* Eyebrow */}
          <div style={{ display: 'inline-block', fontSize: 12, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#0f6cbd', background: '#ebf3fc', padding: '4px 14px', borderRadius: 20, marginBottom: 24 }}>
            Prototyping Boilerplate
          </div>
          <h1 style={{ fontSize: 48, fontWeight: 600, color: '#242424', lineHeight: '60px', margin: '0 0 20px', letterSpacing: '-1px' }}>
            Build. Preview. Share.
          </h1>
          <p style={{ fontSize: 18, color: '#616161', lineHeight: '30px', margin: '0 0 40px' }}>
            A shared environment for rapidly prototyping Copilot Connector features — from first idea to stakeholder review, no engineering background required.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/connectors" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 14, fontWeight: 600, color: '#ffffff', background: '#0f6cbd', padding: '10px 22px', borderRadius: 6, textDecoration: 'none' }}>
              Open the app →
            </Link>
            <a href="https://github.com/gim-home/Connectors/blob/Boilerplate/CONTRIBUTING.md" target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 14, fontWeight: 600, color: '#0f6cbd', background: '#ebf3fc', padding: '10px 22px', borderRadius: 6, textDecoration: 'none' }}>
              Read the guide
            </a>
          </div>
        </div>

        {/* Divider */}
        <div style={{ maxWidth: 960, margin: '0 auto', padding: '0 48px' }}>
          <hr style={{ border: 'none', borderTop: '1px solid #e0e0e0' }} />
        </div>

        {/* Getting started */}
        <div style={{ maxWidth: 960, margin: '0 auto', padding: '64px 48px' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <h2 style={{ fontSize: 32, fontWeight: 600, color: '#242424', lineHeight: '42px', margin: '0 0 12px' }}>
              Getting started
            </h2>
            <p style={{ fontSize: 15, color: '#616161', lineHeight: '24px', margin: 0 }}>
              Five steps from install to sharing your first concept.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {STEPS.map((step) => (
              <div key={step.num} style={{
                display: 'flex', gap: 0, borderRadius: 16,
                border: '1px solid #e8e8e8', overflow: 'hidden',
                background: step.bg,
              }}>
                {/* Number sidebar */}
                <div style={{
                  width: 72, flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  borderRight: `2px solid ${step.accent}20`,
                }}>
                  <span style={{ fontSize: 22, fontWeight: 700, color: step.accent, opacity: 0.4 }}>{step.num}</span>
                </div>
                {/* Content */}
                <div style={{ padding: '24px 28px 24px 24px', flex: 1 }}>
                  <div style={{ fontSize: 16, fontWeight: 600, color: '#242424', marginBottom: 8 }}>{step.title}</div>
                  <div style={{ fontSize: 14, color: '#616161', lineHeight: '23px', whiteSpace: 'pre-line' }}>{step.body}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Claude skills */}
        <div style={{ background: '#fafafa', borderTop: '1px solid #e8e8e8', borderBottom: '1px solid #e8e8e8' }}>
          <div style={{ maxWidth: 960, margin: '0 auto', padding: '64px 48px' }}>
            <div style={{ textAlign: 'center', marginBottom: 48 }}>
              <h2 style={{ fontSize: 32, fontWeight: 600, color: '#242424', lineHeight: '42px', margin: '0 0 12px' }}>
                Claude skills
              </h2>
              <p style={{ fontSize: 15, color: '#616161', lineHeight: '24px', margin: 0 }}>
                Type these commands in Claude Code at any point to trigger built-in workflows.
              </p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
              {SKILLS.map((s) => (
                <div key={s.cmd} style={{ background: '#ffffff', border: '1px solid #e0e0e0', borderRadius: 16, padding: '24px' }}>
                  <code style={{ display: 'inline-block', fontSize: 13, fontWeight: 700, color: '#0f6cbd', background: '#ebf3fc', padding: '3px 10px', borderRadius: 6, marginBottom: 12 }}>{s.cmd}</code>
                  <div style={{ fontSize: 15, fontWeight: 600, color: '#242424', marginBottom: 6 }}>{s.title}</div>
                  <div style={{ fontSize: 13, color: '#616161', lineHeight: '20px' }}>{s.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* What you need + Resources */}
        <div style={{ maxWidth: 960, margin: '0 auto', padding: '64px 48px 80px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64 }}>
          <div>
            <h2 style={{ fontSize: 24, fontWeight: 600, color: '#242424', margin: '0 0 12px' }}>What you need</h2>
            <p style={{ fontSize: 14, color: '#616161', lineHeight: '23px', margin: '0 0 20px' }}>
              VS Code and Claude Code are the essentials. The MCP plugins unlock Figma design implementation.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {TOOLS.map((t) => (
                <span key={t} style={{ fontSize: 13, color: '#242424', background: '#f0f0f0', padding: '5px 12px', borderRadius: 20, fontWeight: 500 }}>{t}</span>
              ))}
            </div>
          </div>
          <div>
            <h2 style={{ fontSize: 24, fontWeight: 600, color: '#242424', margin: '0 0 12px' }}>Resources</h2>
            <p style={{ fontSize: 14, color: '#616161', lineHeight: '23px', margin: '0 0 20px' }}>
              References for components, icons, and contributing guidelines.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {LINKS.map((l) => (
                <a key={l.label} href={l.href} target="_blank" rel="noopener noreferrer"
                  style={{ fontSize: 14, color: '#0f6cbd', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}
                  onMouseOver={(e) => (e.currentTarget.style.textDecoration = 'underline')}
                  onMouseOut={(e) => (e.currentTarget.style.textDecoration = 'none')}
                >
                  {l.label} →
                </a>
              ))}
            </div>
          </div>
        </div>

      </div>
    </FluentProvider>
  );
}
