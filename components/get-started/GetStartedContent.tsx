'use client';

import { useState } from 'react';

const REPO_URL = 'https://github.com/gim-home/Connectors';
const CLONE_CMD = 'git clone https://github.com/gim-home/Connectors.git';

type SetupTab = 'vscode' | 'cli' | 'copilot';

const SETUP_TABS: { key: SetupTab; label: string }[] = [
  { key: 'vscode', label: 'VS Code + Claude Code' },
  { key: 'cli', label: 'Claude Code CLI' },
  { key: 'copilot', label: 'GitHub Copilot' },
];

const SETUP_CONTENT: Record<SetupTab, { body: string; steps: { text: string; code?: string }[] }> = {
  vscode: {
    body: 'Install VS Code and the Claude Code extension. Clone the repo using the URL above, open the folder in VS Code, then run /setup to install dependencies and configure push access.',
    steps: [
      { text: 'Install the Claude Code extension from the VS Code marketplace — search "Claude Code" by Anthropic.' },
      { text: 'Create a folder with a feature name on your system and open it in VS Code.' },
      { text: 'Clone the repo — VS Code will prompt you to sign in with GitHub to access this private repo.', code: CLONE_CMD },
      { text: 'Open Claude Code and run /setup to install dependencies and configure push access.', code: '/setup' },
    ],
  },
  cli: {
    body: 'Install Claude Code CLI, clone the repo, then run /setup inside it to install dependencies and configure push access.',
    steps: [
      { text: 'Install Claude Code CLI.', code: 'npm install -g @anthropic-ai/claude-code' },
      { text: 'Create a folder with a feature name on your system and open a terminal inside it.', code: 'mkdir my-connectors && cd my-connectors' },
      { text: 'Clone the repo — you will be prompted to sign in with GitHub to access this private repo.', code: CLONE_CMD },
      { text: 'Run /setup to install dependencies and configure push access.', code: '/setup' },
    ],
  },
  copilot: {
    body: '',
    steps: [
      { text: 'Open VS Code with the GitHub Copilot extension installed.' },
      { text: 'Create a folder with a feature name on your system and open it in VS Code.' },
      { text: 'Clone the repo — you will be prompted to sign in with GitHub to access this private repo.', code: CLONE_CMD },
      { text: 'Open a terminal in VS Code and run setup.sh — handles dependencies, GitHub push access, and starts the app.', code: './setup.sh' },
    ],
  },
};

function SetupTabs() {
  const [active, setActive] = useState<SetupTab>('vscode');
  const content = SETUP_CONTENT[active];
  return (
    <div style={{ marginTop: 4 }}>
      {/* Tab bar */}
      <div style={{ display: 'flex', borderBottom: '1px solid #e0e0e0', marginBottom: 20, gap: 0 }}>
        {SETUP_TABS.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActive(tab.key)}
            style={{
              padding: '8px 16px', fontSize: 13, fontWeight: active === tab.key ? 600 : 400,
              color: active === tab.key ? '#0078d4' : '#616161',
              background: 'none', border: 'none', borderBottom: active === tab.key ? '2px solid #0078d4' : '2px solid transparent',
              cursor: 'pointer', marginBottom: -1, transition: 'all 0.15s',
              fontFamily: '"Segoe UI", sans-serif',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Body */}
      {content.body && <p style={{ fontSize: 15, color: '#424242', lineHeight: '22px', margin: '0 0 16px' }}>{content.body}</p>}

      {/* Steps */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {content.steps.map((step, i) => (
          <div key={i}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: step.code ? 8 : 0 }}>
              <span style={{ flexShrink: 0, width: 20, height: 20, borderRadius: '50%', background: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: '#616161', marginTop: 1 }}>{i + 1}</span>
              <span style={{ fontSize: 14, color: '#323130', lineHeight: '22px' }}>{step.text}</span>
            </div>
            {step.code && <div style={{ marginLeft: 30 }}><CopyField value={step.code} /></div>}
          </div>
        ))}
      </div>

    </div>
  );
}

const STEPS = [
  {
    num: '01',
    title: 'Set up the boilerplate',
    body: 'Choose your setup method below. Each path gets you running locally with the repo cloned, dependencies installed, and push access configured.',
    setupButton: true,
    skills: [{ cmd: '/setup', desc: 'Install dependencies, start the app, and configure GitHub access', color: '#0e5c15', bg: '#f1faf1' }],
    resources: null as null | { label: string; href: string }[],
  },
  {
    num: '02',
    title: 'Design & share',
    body: 'Share a product spec, user story, or Figma URL with Claude. It builds the concept directly in the app using Fluent UI components. Iterate freely.',
    body2: 'Most Admin Center experiences use Fluent V8, with some areas migrating to V9. If Claude picks the wrong component, find the right one in the resources and paste its link into the chat — or just tell Claude explicitly, e.g. "Use MessageBar from Fluent V8".',
    body3: 'For each new feature:',
    featureSteps: [
      { text: 'Create a new folder with the feature name.' },
      { text: 'Clone the repo into that folder.', code: CLONE_CMD },
      { text: 'Open the folder in VS Code and run the project.' },
      { text: 'Work on the feature with Claude.' },
      { text: 'Run the publish skill with a new feature name — it automatically creates a branch, deploys, and gives you a shareable preview URL.' },
    ],
    setupButton: false,
    skills: [
      { cmd: '/publish', desc: 'Branch, deploy, and share in one step', color: '#c50f1f', bg: '#fdf1f2' },
      { cmd: './publish.sh', desc: 'For GitHub Copilot users — branch, deploy, and share in one step', color: '#c50f1f', bg: '#fdf1f2' },
    ],
    resources: [
      { label: 'Fluent V9 / V8 Components', href: 'https://react.fluentui.dev' },
      { label: 'MADS', href: 'https://admincontrolsdemoapps.z22.web.core.windows.net/storybook/latest/Storybook/?path=/docs/about--docs' },
      { label: 'MDL2 Icon library', href: 'https://iconcloud.design/browse/Full%20MDL2%20Assets' },
      { label: 'Fluent icons', href: 'https://storybooks.fluentui.dev/react/?path=/docs/icons-catalog--docs' },
      { label: 'Fluent Charts', href: 'https://storybooks.fluentui.dev/react/?path=/docs/charts_charts-areachart--docs' },
    ],
  },
  {
    num: '03',
    title: 'Create a walkthrough',
    optional: true,
    body: 'Add step-by-step annotations to your prototype — ideal for LT reviews. Stakeholders can view freely or follow the guided tour.',
    setupButton: false,
    skills: [{ cmd: '/walkthrough', desc: 'Annotate with a guided step-by-step tour', color: '#835b00', bg: '#fdf8ee' }],
    resources: null as null | { label: string; href: string }[],
  },
  {
    num: '04',
    title: 'Hand off to production',
    body: 'Once stakeholders approve, run /handoff. Claude extracts production-ready components for the engineering team.',
    setupButton: false,
    skills: [{ cmd: '/handoff', desc: 'Extract approved components for engineering', color: '#7719aa', bg: '#f7f0fb' }],
    resources: null as null | { label: string; href: string }[],
  },
];

export const NAV_STEPS = [
  { num: '01', label: 'Set up the boilerplate', href: '#step-01' },
  { num: '02', label: 'Design & share', href: '#step-02' },
  { num: '03', label: 'Create a walkthrough', href: '#step-03' },
  { num: '04', label: 'Hand off to production', href: '#step-04' },
];

function CopyField({ value, mono = true }: { value: string; mono?: boolean }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
    } catch (_) {
      const ta = document.createElement('textarea');
      ta.value = value;
      ta.style.cssText = 'position:fixed;opacity:0;top:0;left:0';
      document.body.appendChild(ta);
      ta.focus();
      ta.select();
      try { document.execCommand('copy'); } catch (_) {}
      document.body.removeChild(ta);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };
  return (
    <div style={{
      display: 'flex', alignItems: 'stretch', flexWrap: 'wrap',
      background: '#f5f5f5', border: '1px solid #e0e0e0',
      borderRadius: 4, overflow: 'hidden',
    }}>
      <span style={{
        flex: 1, padding: '10px 14px', fontSize: 13, color: '#424242',
        fontFamily: mono ? '"Cascadia Code", "Courier New", monospace' : '"Segoe UI", sans-serif',
        whiteSpace: 'normal', wordBreak: 'break-all',
      }}>
        {value}
      </span>
      <button
        onClick={handleCopy}
        style={{
          flexShrink: 0, padding: '10px 18px', fontSize: 13, fontWeight: 600,
          color: copied ? '#107c10' : '#0078d4',
          background: copied ? '#f1faf1' : '#ffffff',
          border: 'none', borderLeft: '1px solid #e0e0e0',
          cursor: 'pointer', transition: 'all 0.15s',
          fontFamily: '"Segoe UI", sans-serif',
        }}
      >
        {copied ? '✓ Copied' : 'Copy'}
      </button>
    </div>
  );
}

function SetupButton() {
  return (
    <div style={{ marginTop: 4 }}>
      <CopyField value={REPO_URL} mono={false} />
    </div>
  );
}

export default function GetStartedContent() {
  const font = '"Segoe UI", "Segoe UI Web (West European)", -apple-system, system-ui, Roboto, "Helvetica Neue", sans-serif';

  return (
    <section id="getting-started" style={{ padding: '0 0 96px', fontFamily: font, color: '#242424', width: '100%' }}>
      {/* Hero header */}
      <div style={{ position: 'relative', minHeight: 260, marginBottom: 40, display: 'flex', alignItems: 'center' }}>
        {/* Image — right side, natural aspect, fades left */}
        <div style={{
          position: 'absolute',
          top: -48, right: -48, bottom: -40,
          width: '65%',
          backgroundImage: 'url(/hero-bg.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center center',
          pointerEvents: 'none',
        }} />
        {/* Fade: right image → white on left */}
        <div style={{
          position: 'absolute',
          top: -48, right: -48, bottom: -40,
          width: '75%',
          background: 'linear-gradient(to right, #ffffff 30%, transparent 70%)',
          pointerEvents: 'none',
        }} />
        {/* Fade to white at bottom */}
        <div style={{
          position: 'absolute',
          bottom: -40, left: 0, right: -48,
          height: 80,
          background: 'linear-gradient(to bottom, transparent, #ffffff)',
          pointerEvents: 'none',
        }} />
        {/* Text content — left side */}
        <div className="gs-hero-text" style={{ position: 'relative' }}>
          <h1 className="gs-hero-h1" style={{ fontWeight: 600, color: '#000000', margin: '0 0 4px' }}>
            Admin Boilerplate
          </h1>
          <p style={{ fontSize: 18, color: '#616161', fontWeight: 600, margin: '0 0 48px' }}>Version 1.0 (Beta)</p>
          <p style={{ fontSize: 20, fontWeight: 400, color: '#242424', lineHeight: '28px', margin: '0 0 28px' }}>
            Quickly prototype specs into concepts, share with stakeholders, validate with customers, and deliver high‑quality production‑ready outcomes.
          </p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <a
              href="https://studious-adventure-j17vp6o.pages.github.io/connectors/"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '10px 20px', borderRadius: 4, fontSize: 14, fontWeight: 600,
                background: '#0078d4', color: '#ffffff', textDecoration: 'none',
                transition: 'background 0.15s',
              }}
              onMouseOver={e => { (e.currentTarget as HTMLAnchorElement).style.background = '#106ebe'; }}
              onMouseOut={e => { (e.currentTarget as HTMLAnchorElement).style.background = '#0078d4'; }}
            >
              Open the app ↗
            </a>
            <a
              href="/about"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '10px 20px', borderRadius: 4, fontSize: 14, fontWeight: 600,
                background: '#ffffff', color: '#323130', textDecoration: 'none',
                border: '1px solid #d1d1d1', transition: 'background 0.15s',
              }}
              onMouseOver={e => { (e.currentTarget as HTMLAnchorElement).style.background = '#f3f2f1'; }}
              onMouseOut={e => { (e.currentTarget as HTMLAnchorElement).style.background = '#ffffff'; }}
            >
              View features
            </a>
          </div>
        </div>
      </div>

      <div>
        {STEPS.map((step, idx) => (
          <section
            key={step.num}
            id={`step-${step.num}`}
            style={{ paddingTop: idx === 0 ? 16 : 40, paddingBottom: 40, borderBottom: idx < STEPS.length - 1 ? '1px solid #f0f0f0' : 'none' }}
          >
            <div className="gs-step-row">
              <div className="gs-step-main">
                <h2 style={{ fontSize: 24, fontWeight: 600, color: '#000000', lineHeight: '32px', margin: '0 0 16px', display: 'flex', alignItems: 'center', gap: 10 }}>
                  {step.title}
                  {(step as any).optional && (
                    <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#a0a0a0', background: '#f5f5f5', border: '1px solid #e0e0e0', borderRadius: 4, padding: '2px 7px', lineHeight: '18px' }}>
                      Optional
                    </span>
                  )}
                </h2>
                <p style={{ fontSize: 16, fontWeight: 400, color: '#1b1a19', lineHeight: '24px', margin: '0 0 16px' }}>
                  {step.body}
                </p>
                {'body2' in step && (step as any).body2 && (
                  <p style={{ fontSize: 16, fontWeight: 400, color: '#1b1a19', lineHeight: '24px', margin: '0 0 16px' }}>
                    {(step as any).body2}
                  </p>
                )}
                {'body3' in step && (step as any).body3 && (
                  <>
                    <p style={{ fontSize: 16, fontWeight: 400, color: '#1b1a19', lineHeight: '24px', margin: '0 0 12px' }}>
                      {(step as any).body3}
                    </p>
                    {'featureSteps' in step && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
                        {((step as any).featureSteps as { text: string; code?: string }[]).map((s, i) => (
                          <div key={i}>
                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: s.code ? 8 : 0 }}>
                              <span style={{ flexShrink: 0, width: 20, height: 20, borderRadius: '50%', background: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: '#616161', marginTop: 2 }}>{i + 1}</span>
                              <span style={{ fontSize: 15, color: '#323130', lineHeight: '22px' }}>{s.text}</span>
                            </div>
                            {s.code && <div style={{ marginLeft: 30 }}><CopyField value={s.code} /></div>}
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}

                {step.setupButton && <SetupTabs />}

                {!step.setupButton && step.skills && (
                  <div style={{ marginTop: 16 }}>
                    <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#a0a0a0', marginBottom: 10 }}>
                      Claude skill
                    </div>
                    {step.skills.map(sk => (
                      <div key={sk.cmd} style={{
                        display: 'inline-flex', alignItems: 'center', gap: 10,
                        background: sk.bg, borderRadius: 6, padding: '10px 14px',
                      }}>
                        <code style={{ fontSize: 13, fontWeight: 700, color: sk.color, whiteSpace: 'nowrap', fontFamily: '"Cascadia Code", "Courier New", monospace' }}>{sk.cmd}</code>
                        <span style={{ fontSize: 13, color: '#616161', lineHeight: '20px' }}>{sk.desc}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {step.resources && (
                <div className="gs-step-resources">
                  <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#a0a0a0', marginBottom: 10 }}>
                    Resources
                  </div>
                  {step.resources.map((r, i) => (
                    <a
                      key={r.label}
                      href={r.href}
                      target="_blank" rel="noopener noreferrer"
                      style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        fontSize: 13, color: '#0f6cbd', textDecoration: 'none',
                        padding: '7px 0',
                      }}
                      onMouseOver={e => (e.currentTarget.style.textDecoration = 'underline')}
                      onMouseOut={e => (e.currentTarget.style.textDecoration = 'none')}
                    >
                      <span>{r.label}</span>
                    </a>
                  ))}
                </div>
              )}
            </div>
          </section>
        ))}
      </div>

      <div style={{ marginTop: 64, paddingTop: 24, borderTop: '1px solid #f0f0f0' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <p style={{ fontSize: 13, color: '#a19f9d', lineHeight: '20px', margin: 0 }}>
            Created with love by Copilot Connectors team · <strong style={{ color: '#8a8886' }}>Connector Admin Boilerplate Version 1.0 (Beta)</strong>
          </p>
        </div>
      </div>
    </section>
  );
}
