'use client';

import { useState } from 'react';

const SETUP_URL = 'https://raw.githubusercontent.com/gim-home/Connectors/Boilerplate/SETUP.md';

const STEPS = [
  {
    num: '01',
    title: 'Set up the boilerplate',
    body: 'Install VS Code and the Claude Code extension, then paste this link into Claude Code chat to begin.',
    setupButton: true,
    skills: null as null | { cmd: string; desc: string; color: string; bg: string }[],
    resources: null as null | { label: string; href: string }[],
  },
  {
    num: '02',
    title: 'Design concepts',
    body: 'Share a product spec, user story, or Figma URL with Claude. It builds the concept directly in the app using Fluent UI components. Iterate freely.',
    body2: 'Most Admin Center experiences use Fluent V8, with some areas migrating to V9. If Claude picks the wrong component, find the right one in the resources and paste its link into the chat — or just tell Claude explicitly, e.g. "Use MessageBar from Fluent V8".',
    setupButton: false,
    skills: null as null | { cmd: string; desc: string; color: string; bg: string }[],
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
    body: 'Add step-by-step annotations to your prototype — ideal for LT reviews. Stakeholders can view freely or follow the guided tour.',
    setupButton: false,
    skills: [{ cmd: '/walkthrough', desc: 'Annotate with a guided step-by-step tour', color: '#835b00', bg: '#fdf8ee' }],
    resources: null as null | { label: string; href: string }[],
  },
  {
    num: '04',
    title: 'Share with stakeholders',
    body: 'Claude creates a branch, deploys your prototype, and gives you a shareable preview link — ready to send.',
    setupButton: false,
    skills: [{ cmd: '/publish', desc: 'Branch, deploy, and share in one step', color: '#c50f1f', bg: '#fdf1f2' }],
    resources: null as null | { label: string; href: string }[],
  },
  {
    num: '05',
    title: 'Hand off to production',
    body: 'Once stakeholders approve, run /handoff. Claude extracts production-ready components for the engineering team.',
    setupButton: false,
    skills: [{ cmd: '/handoff', desc: 'Extract approved components for engineering', color: '#7719aa', bg: '#f7f0fb' }],
    resources: null as null | { label: string; href: string }[],
  },
];

export const NAV_STEPS = [
  { num: '01', label: 'Set up the boilerplate', href: '#step-01' },
  { num: '02', label: 'Design concepts', href: '#step-02' },
  { num: '03', label: 'Create a walkthrough', href: '#step-03' },
  { num: '04', label: 'Share with stakeholders', href: '#step-04' },
  { num: '05', label: 'Hand off to production', href: '#step-05' },
];

function SetupButton() {
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(SETUP_URL);
    } catch (_) {
      const ta = document.createElement('textarea');
      ta.value = SETUP_URL;
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
    <div style={{ marginTop: 4 }}>
      <div style={{
        display: 'flex', alignItems: 'stretch', flexWrap: 'wrap',
        background: '#f5f5f5', border: '1px solid #e0e0e0',
        borderRadius: 4, overflow: 'hidden',
      }}>
        <span style={{
          flex: 1, padding: '10px 14px', fontSize: 13, color: '#424242',
          fontFamily: '"Cascadia Code", "Courier New", monospace',
          whiteSpace: 'normal', wordBreak: 'break-all',
        }}>
          {SETUP_URL}
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
    </div>
  );
}

export default function GetStartedContent() {
  const font = '"Segoe UI", "Segoe UI Web (West European)", -apple-system, system-ui, Roboto, "Helvetica Neue", sans-serif';

  return (
    <section id="getting-started" style={{ padding: '0 0 96px', fontFamily: font, color: '#242424', width: '100%' }}>
      <h1 style={{ fontSize: 68, fontWeight: 600, color: '#000000', lineHeight: '92px', margin: '0 0 27px' }}>
        Boilerplate
      </h1>
      <div style={{ maxWidth: '60%' }}>
        <p style={{ fontSize: 20, fontWeight: 400, color: '#000000', lineHeight: '28px', margin: '0 0 40px' }}>
          Quickly turn specs into concepts, share with stakeholders, validate with customers, and deliver high‑quality production‑ready outcomes.
        </p>
      </div>

      <div>
        {STEPS.map((step, idx) => (
          <section
            key={step.num}
            id={`step-${step.num}`}
            style={{ paddingTop: idx === 0 ? 16 : 40, paddingBottom: 40, borderBottom: idx < STEPS.length - 1 ? '1px solid #f0f0f0' : 'none' }}
          >
            <div style={{ display: 'flex', gap: 48, alignItems: 'flex-start' }}>
              <div style={{ flex: '0 0 60%' }}>
                <h2 style={{ fontSize: 24, fontWeight: 600, color: '#000000', lineHeight: '32px', margin: '0 0 16px' }}>
                  {step.title}
                </h2>
                <p style={{ fontSize: 16, fontWeight: 400, color: '#1b1a19', lineHeight: '24px', margin: '0 0 16px' }}>
                  {step.body}
                </p>
                {'body2' in step && (step as any).body2 && (
                  <p style={{ fontSize: 16, fontWeight: 400, color: '#1b1a19', lineHeight: '24px', margin: '0 0 24px' }}>
                    {(step as any).body2}
                  </p>
                )}

                {step.setupButton && (
                  <>
                    <SetupButton />
                    <p style={{ fontSize: 16, color: '#1b1a19', margin: '16px 0 0', lineHeight: '24px' }}>
                      Or{' '}<a
                        href="https://github.com/gim-home/Connectors/tree/Boilerplate"
                        target="_blank" rel="noopener noreferrer"
                        style={{ color: '#0f6cbd', textDecoration: 'none' }}
                        onMouseOver={e => (e.currentTarget.style.textDecoration = 'underline')}
                        onMouseOut={e => (e.currentTarget.style.textDecoration = 'none')}
                      >
                        Clone the Boilerplate repo
                      </a>
                      {' '}manually to local.
                    </p>
                  </>
                )}

                {step.skills && (
                  <div>
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
                <div style={{ flex: '1 1 0', minWidth: 0 }}>
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
                        borderBottom: i < step.resources!.length - 1 ? '1px solid #f5f5f5' : 'none',
                      }}
                      onMouseOver={e => (e.currentTarget.style.textDecoration = 'underline')}
                      onMouseOut={e => (e.currentTarget.style.textDecoration = 'none')}
                    >
                      <span>{r.label}</span>
                      <span style={{ opacity: 0.4, fontSize: 12 }}>→</span>
                    </a>
                  ))}
                </div>
              )}
            </div>
          </section>
        ))}
      </div>

      <div style={{ marginTop: 64, paddingTop: 24, borderTop: '1px solid #f0f0f0' }}>
        <p style={{ fontSize: 13, color: '#a19f9d', lineHeight: '20px' }}>
          Created with love by Copilot Connectors team
        </p>
      </div>
    </section>
  );
}
