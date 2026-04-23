'use client';

import React, { useState, useEffect, useCallback } from 'react';

const font = '"Segoe UI Variable", "Segoe UI", -apple-system, system-ui, sans-serif';
const BG = '#f6f3f1';
const TITLE_GRADIENT = 'linear-gradient(90deg, #33302e 36%, #f6f3f1 147%)';
const STATEMENT_GRADIENT = 'linear-gradient(90deg, #d8c8bc 0%, #242424 60%)';

// ─── Slide data ───────────────────────────────────────────────────────────────

type Slide =
  | { type: 'hero'; label: string; title: string }
  | { type: 'content-right'; title: string; body: string; tag?: string; findings?: string[] }
  | { type: 'statement'; label: string; statement: string; sublabel?: string }
  | { type: 'two-column'; title: string; col1: { heading: string; body: string }; col2: { heading: string; body: string } }
  | { type: 'quote'; label: string; quote: string; attribution: string }
  | { type: 'steps'; tag: string; title: string; steps: { label: string; body: string }[]; tourLink?: string }
  | { type: 'compare'; tag: string; title: string; before: { heading: string; items: string[] }; after: { heading: string; items: string[] } }
  | { type: 'flowchart'; tag: string; title: string; before: { heading: string; nodes: Array<string | { phase: string }> }; after: { heading: string; nodes: Array<string | { phase: string }> } }
  | { type: 'email'; connectorName: string; actions: string[] }
  | { type: 'screen'; tag: string; step: string; callout: string; imageUrl: string; tourLink?: string }
  | { type: 'closing'; label: string; title: string; subtitle: string };

const slides: Slide[] = [
  // 1 — Hero
  {
    type: 'hero',
    label: 'COPILOT CONNECTORS · APRIL 2025',
    title: 'Zero\nObserv\u00adability',
  },

  // 2 — Problem: 6 findings + core insight in body
  {
    type: 'content-right',
    tag: 'RESEARCH · 6 FINDINGS · HIGH PRIORITY',
    title: 'The system\nreports.\nThe admin\nguesses.',
    body: 'Admins have no reason to open MAC unless something is wrong — yet the product gives them no signal when things go wrong. Six research findings, all high priority.',
    findings: [
      'H10 — Crawls run 3–4 days with no phase, no %, no ETA',
      'H13 — Connectors disconnect unpredictably with no re-auth alert',
      'H14 — No health dashboard; failures found through user complaints',
      'H8 — No pre-crawl checklist for auth, connectivity, permissions',
      'M3 — No sandbox mode; every test is a full production crawl',
      'M6 — No query testing before pilot; broken search found too late',
    ],
  },

  // 3 — Customer voice
  {
    type: 'quote',
    label: 'CUSTOMER VOICE · EY',
    quote: '"It took many, many days — like 3–4 days to crawl the 13,000 items. You refresh it once, it works. And all of a sudden it goes disconnect."',
    attribution: 'Enterprise Admin, EY',
  },

  // 4 — Our scope: what we are solving
  {
    type: 'content-right',
    tag: 'OUR SCOPE',
    title: 'What\nwe are\nsolving',
    body: 'Setup-time validation (H8, M3) is already solved. We are building the proactive error management layer for what happens after the connector goes live — the chain that keeps admins informed without requiring them to hunt for problems.',
    findings: [
      'Proactive email notification when sync errors are detected',
      'Plain-language error explanation with impact — not raw codes',
      'Guided resolution pointing to both 3P settings and MAC config',
      'Inline actions — fix, retry, or escalate without leaving the page',
    ],
  },

  // Current experience — before state
  {
    type: 'screen',
    tag: 'CURRENT EXPERIENCE · BEFORE',
    step: 'Admin opens MAC manually, navigates to Error tab',
    callout: 'Raw error codes. No guidance. Admin is left to figure it out.',
    imageUrl: '/deck/screen-current.jpg',
  },

  // 7 — Before vs now: setup + ongoing sync flowchart
  {
    type: 'flowchart',
    tag: 'BEFORE VS NOW',
    title: '',
    before: {
      heading: 'Before',
      nodes: [
        'Set up connector',
        'Full crawl runs 3–4 days\nNo progress visible',
        'Connector syncs on schedule',
        'Error occurs silently\n(3P settings change / server down)',
        'No notification sent',
        'Admin manually opens\nYour Connections page',
        'Opens detail panel → Error tab',
        'Sees raw error codes\nNo guidance on what to do',
      ],
    },
    after: {
      heading: 'Now',
      nodes: [
        'Set up connector',
        { phase: 'SOLVED ✓' },
        'Pre-crawl validation\nAdmin fixes issues before crawl starts',
        'Full crawl runs and completes',
        { phase: 'OUR SCOPE →' },
        'Connector syncs on regular intervals',
        'Error detected\n(3P settings change / server down)',
        'Admin notified by email',
        'Admin lands on MAC\nErrors shown as guided actions',
        'System points to both 3P settings\nand MAC connector config to resolve',
      ],
    },
  },

  // 8 — Email notification mockup
  {
    type: 'email',
    connectorName: 'Org Foundry',
    actions: [
      'Connection token has expired — re-authentication required',
      'Sync failure detected — 847 items were not indexed',
      'Scheduled crawl was skipped due to server timeout',
    ],
  },

  // 9 — Our solution: what we are building
  {
    type: 'steps',
    tag: 'OUR SOLUTION · WHAT WE ARE BUILDING',
    title: 'System\nleads.\nAdmin\nsupervises.',
    tourLink: '/connectors?tour=1',
    steps: [
      { label: 'Notify', body: 'Admin receives a proactive email when sync errors are detected — before they have to hunt for problems.' },
      { label: 'Explain', body: 'Error shown in plain language with item impact count — not raw error codes or status flags.' },
      { label: 'Guide', body: 'System points to both the 3P source settings and the MAC connector config — the exact knobs to turn.' },
      { label: 'Act', body: 'Admin fixes, retries, or escalates without leaving the page. Audit trail saved automatically.' },
    ],
  },

];

// ─── Slide renderers ─────────────────────────────────────────────────────────

function HeroSlide({ label, title }: Extract<Slide, { type: 'hero' }>) {
  return (
    <div style={{
      width: '100%', height: '100%',
      position: 'relative', overflowY: 'hidden',
      display: 'flex', flexDirection: 'column',
      padding: '5.5% 6.5%',
      boxSizing: 'border-box',
    }}>
      {/* Section label top-left */}
      <p style={{
        margin: 0,
        fontSize: 'clamp(11px, 1.1vw, 18px)',
        fontWeight: 700,
        letterSpacing: '0.2em',
        textTransform: 'uppercase',
        color: '#242424',
        fontFamily: font,
      }}>
        {label}
      </p>

      {/* Giant gradient title — absolute so it escapes padding and never clips */}
      <p style={{
        position: 'absolute',
        bottom: '4%',
        left: '6.5%',
        right: 0,
        margin: 0,
        fontSize: 'clamp(80px, 13.5vw, 220px)',
        fontWeight: 300,
        lineHeight: 0.9,
        letterSpacing: '-0.05em',
        backgroundImage: TITLE_GRADIENT,
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        fontFamily: font,
        whiteSpace: 'pre-line',
      }}>
        {title}
      </p>
    </div>
  );
}

function ContentRightSlide({ title, body, tag, findings }: Extract<Slide, { type: 'content-right' }>) {
  return (
    <div style={{
      width: '100%', height: '100%',
      display: 'flex', alignItems: 'flex-start',
      padding: '6% 6.5%',
      gap: '6%',
      boxSizing: 'border-box',
    }}>
      {/* Left: gradient title */}
      <div style={{ flex: '0 0 34%' }}>
        {tag && (
          <p style={{
            margin: '0 0 2.5vw',
            fontSize: 'clamp(10px, 0.9vw, 14px)',
            fontWeight: 700,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: '#888',
            fontFamily: font,
          }}>
            {tag}
          </p>
        )}
        <p style={{
          margin: 0,
          paddingBottom: '0.25em',
          fontSize: 'clamp(42px, 5.5vw, 92px)',
          fontWeight: 300,
          lineHeight: 1.05,
          letterSpacing: '-0.04em',
          backgroundImage: TITLE_GRADIENT,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          fontFamily: font,
          whiteSpace: 'pre-line',
        }}>
          {title}
        </p>
      </div>

      {/* Right: body + findings */}
      <div style={{ flex: 1, paddingTop: tag ? 'calc(0.9vw + 2.5vw + 0.5em)' : 0, display: 'flex', flexDirection: 'column', gap: '6%' }}>
        <p style={{
          margin: 0,
          fontSize: 'clamp(15px, 1.6vw, 26px)',
          lineHeight: 1.55,
          color: '#242424',
          fontFamily: font,
          whiteSpace: 'pre-line',
          fontWeight: 400,
        }}>
          {body}
        </p>

        {findings && findings.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8vw', marginTop: '1.8vw' }}>
            {findings.map((f, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '1vw' }}>
                <span style={{
                  width: 6, height: 6, borderRadius: '50%',
                  background: '#33302e', marginTop: '0.45em', flexShrink: 0,
                }} />
                <span style={{
                  fontSize: 'clamp(12px, 1.2vw, 20px)',
                  color: '#484644',
                  fontFamily: font,
                  lineHeight: 1.5,
                }}>
                  {f}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function StatementSlide({ label, statement, sublabel }: Extract<Slide, { type: 'statement' }>) {
  return (
    <div style={{
      width: '100%', height: '100%',
      background: '#f5f4f2',
      display: 'flex', flexDirection: 'column',
      padding: '5.5% 6.5%',
      boxSizing: 'border-box',
      position: 'relative',
    }}>
      {/* Top label */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4vw' }}>
        <p style={{
          margin: 0,
          fontSize: 'clamp(10px, 0.85vw, 14px)',
          fontWeight: 700,
          letterSpacing: '0.22em',
          textTransform: 'uppercase',
          color: '#a0a0a0',
          fontFamily: font,
        }}>
          {label}
        </p>
        {sublabel && (
          <p style={{
            margin: 0,
            fontSize: 'clamp(12px, 1vw, 17px)',
            fontWeight: 700,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: '#242424',
            fontFamily: font,
          }}>
            {sublabel}
          </p>
        )}
      </div>

      {/* Large statement — centered */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
        <p style={{
          margin: 0,
          maxWidth: '62%',
          fontSize: 'clamp(28px, 4vw, 66px)',
          fontWeight: 600,
          lineHeight: 1.22,
          letterSpacing: '-0.03em',
          textAlign: 'right',
          backgroundImage: STATEMENT_GRADIENT,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          fontFamily: font,
        }}>
          {statement}
        </p>
      </div>
    </div>
  );
}

function TwoColumnSlide({ title, col1, col2 }: Extract<Slide, { type: 'two-column' }>) {
  return (
    <div style={{
      width: '100%', height: '100%',
      display: 'flex', flexDirection: 'column',
      padding: '5.5% 6.5% 6%',
      boxSizing: 'border-box',
      position: 'relative',
    }}>
      {/* Title */}
      <p style={{
        margin: '0 0 auto',
        fontSize: 'clamp(42px, 5.5vw, 90px)',
        fontWeight: 300,
        lineHeight: 1.0,
        letterSpacing: '-0.04em',
        backgroundImage: TITLE_GRADIENT,
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        fontFamily: font,
        whiteSpace: 'pre-line',
      }}>
        {title}
      </p>

      {/* Two columns */}
      <div style={{ display: 'flex', gap: '4%', alignItems: 'flex-start' }}>
        {[col1, col2].map((col, i) => (
          <div key={i} style={{ flex: 1 }}>
            <div style={{
              width: 32, height: 2, background: '#33302e', marginBottom: '1.2vw',
            }} />
            <p style={{
              margin: '0 0 0.8vw',
              fontSize: 'clamp(14px, 1.3vw, 22px)',
              fontWeight: 700,
              color: '#242424',
              fontFamily: font,
              letterSpacing: '-0.01em',
            }}>
              {col.heading}
            </p>
            <p style={{
              margin: 0,
              fontSize: 'clamp(13px, 1.2vw, 19px)',
              lineHeight: 1.6,
              color: '#484644',
              fontFamily: font,
            }}>
              {col.body}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

function QuoteSlide({ label, quote, attribution }: Extract<Slide, { type: 'quote' }>) {
  return (
    <div style={{
      width: '100%', height: '100%',
      background: '#242424',
      display: 'flex', flexDirection: 'column',
      padding: '5.5% 6.5%',
      boxSizing: 'border-box',
    }}>
      <p style={{
        margin: 0,
        fontSize: 'clamp(10px, 0.85vw, 14px)',
        fontWeight: 700,
        letterSpacing: '0.22em',
        textTransform: 'uppercase',
        color: '#888',
        fontFamily: font,
      }}>
        {label}
      </p>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', maxWidth: 900 }}>
        <p style={{
          margin: '0 0 2.5vw',
          fontSize: 'clamp(24px, 3.2vw, 52px)',
          fontWeight: 300,
          lineHeight: 1.3,
          letterSpacing: '-0.02em',
          color: '#f6f3f1',
          fontFamily: font,
        }}>
          {quote}
        </p>
        <p style={{
          margin: 0,
          fontSize: 'clamp(12px, 1.1vw, 18px)',
          color: '#888',
          fontFamily: font,
          letterSpacing: '0.04em',
        }}>
          — {attribution}
        </p>
      </div>
    </div>
  );
}

function ClosingSlide({ label, title, subtitle }: Extract<Slide, { type: 'closing' }>) {
  return (
    <div style={{
      width: '100%', height: '100%',
      display: 'flex', flexDirection: 'column',
      padding: '5.5% 6.5%',
      boxSizing: 'border-box',
    }}>
      <p style={{
        margin: 0,
        fontSize: 'clamp(11px, 1.1vw, 18px)',
        fontWeight: 700,
        letterSpacing: '0.2em',
        textTransform: 'uppercase',
        color: '#242424',
        fontFamily: font,
      }}>
        {label}
      </p>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
        <p style={{
          margin: '0 0 3vw',
          fontSize: 'clamp(32px, 4.5vw, 72px)',
          fontWeight: 300,
          lineHeight: 1.15,
          letterSpacing: '-0.03em',
          backgroundImage: TITLE_GRADIENT,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          fontFamily: font,
          whiteSpace: 'pre-line',
        }}>
          {title}
        </p>
        <p style={{
          margin: 0,
          fontSize: 'clamp(14px, 1.3vw, 22px)',
          color: '#888',
          fontFamily: font,
          letterSpacing: '0.02em',
        }}>
          {subtitle}
        </p>
      </div>
    </div>
  );
}

function StepsSlide({ tag, title, steps, tourLink }: Extract<Slide, { type: 'steps' }>) {
  return (
    <div style={{
      width: '100%', height: '100%',
      display: 'flex', alignItems: 'flex-start',
      padding: '5.5% 6.5%', gap: '6%',
      boxSizing: 'border-box',
    }}>
      {/* Left */}
      <div style={{ flex: '0 0 30%', display: 'flex', flexDirection: 'column' }}>
        <p style={{
          margin: '0 0 2vw',
          fontSize: 'clamp(10px, 0.9vw, 14px)',
          fontWeight: 700, letterSpacing: '0.2em',
          textTransform: 'uppercase', color: '#888', fontFamily: font,
        }}>{tag}</p>
        <p style={{
          margin: 0,
          fontSize: 'clamp(28px, 3.5vw, 58px)',
          fontWeight: 300, lineHeight: 1.05,
          letterSpacing: '-0.04em',
          backgroundImage: TITLE_GRADIENT,
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
          fontFamily: font, whiteSpace: 'pre-line',
        }}>{title}</p>
      </div>

      {/* Steps */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '3%', paddingTop: 'calc(0.9vw + 2vw + 0.5em)' }}>
        {steps.map((step, i) => (
          <div key={i} style={{ display: 'flex', gap: '1.5vw', alignItems: 'flex-start' }}>
            <div style={{
              flexShrink: 0, width: 'clamp(22px, 2vw, 32px)', height: 'clamp(22px, 2vw, 32px)',
              borderRadius: '50%', background: '#33302e',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              marginTop: '0.15em',
            }}>
              <span style={{ color: '#f6f3f1', fontSize: 'clamp(9px, 0.75vw, 12px)', fontWeight: 700, fontFamily: font }}>
                {i + 1}
              </span>
            </div>
            <div>
              <span style={{
                fontSize: 'clamp(12px, 1.1vw, 18px)', fontWeight: 700,
                color: '#242424', fontFamily: font, marginRight: '0.5em',
              }}>
                {step.label}
              </span>
              <span style={{
                fontSize: 'clamp(12px, 1.1vw, 17px)', color: '#484644',
                fontFamily: font, lineHeight: 1.5,
              }}>
                {step.body}
              </span>
            </div>
          </div>
        ))}
        {tourLink && (
          <a
            href={tourLink}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              marginTop: '1vw',
              padding: '6px 14px',
              background: '#0078d4',
              color: '#fff',
              borderRadius: 4,
              fontSize: 'clamp(10px, 0.85vw, 13px)',
              fontWeight: 600,
              fontFamily: font,
              textDecoration: 'none',
              width: 'fit-content',
            }}
          >
            ▶ View live demo
          </a>
        )}
      </div>
    </div>
  );
}

function CompareSlide({ tag, title, before, after }: Extract<Slide, { type: 'compare' }>) {
  return (
    <div style={{
      width: '100%', height: '100%',
      display: 'flex', alignItems: 'flex-start',
      padding: '5.5% 6.5%', gap: '6%',
      boxSizing: 'border-box',
    }}>
      {/* Left title */}
      <div style={{ flex: '0 0 30%' }}>
        <p style={{
          margin: '0 0 2vw',
          fontSize: 'clamp(10px, 0.9vw, 14px)',
          fontWeight: 700, letterSpacing: '0.2em',
          textTransform: 'uppercase', color: '#888', fontFamily: font,
        }}>{tag}</p>
        <p style={{
          margin: 0,
          fontSize: 'clamp(28px, 3.5vw, 58px)',
          fontWeight: 300, lineHeight: 1.05,
          letterSpacing: '-0.04em',
          backgroundImage: TITLE_GRADIENT,
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
          fontFamily: font, whiteSpace: 'pre-line',
        }}>{title}</p>
      </div>

      {/* Two columns */}
      <div style={{ flex: 1, display: 'flex', gap: '4%', paddingTop: 'calc(0.9vw + 2vw + 0.5em)' }}>
        {[before, after].map((col, i) => (
          <div key={i} style={{ flex: 1 }}>
            <div style={{ width: 32, height: 2, background: i === 0 ? '#c0b8b0' : '#33302e', marginBottom: '1.2vw' }} />
            <p style={{
              margin: '0 0 1.2vw',
              fontSize: 'clamp(12px, 1.1vw, 18px)',
              fontWeight: 700, color: i === 0 ? '#888' : '#242424', fontFamily: font,
            }}>{col.heading}</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.7vw' }}>
              {col.items.map((item, j) => (
                <div key={j} style={{ display: 'flex', gap: '0.8vw', alignItems: 'flex-start' }}>
                  <span style={{
                    width: 5, height: 5, borderRadius: '50%', flexShrink: 0,
                    background: i === 0 ? '#c0b8b0' : '#33302e',
                    marginTop: '0.45em',
                  }} />
                  <span style={{
                    fontSize: 'clamp(12px, 1.15vw, 19px)',
                    color: i === 0 ? '#888' : '#242424',
                    fontFamily: font, lineHeight: 1.5,
                  }}>{item}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function FlowchartSlide({ tag, title, before, after }: Extract<Slide, { type: 'flowchart' }>) {
  type Node = string | { phase: string };
  const isPhase = (n: Node): n is { phase: string } => typeof n === 'object';

  // Pre-compute which phase each node belongs to (for the "after" column)
  // Phase tracking: nodes after the last phase label with "SCOPE" in it are "in scope"
  const getScopeMap = (nodes: Node[]) => {
    let currentPhase = 'pre';
    return nodes.map(n => {
      if (isPhase(n)) {
        if (n.phase.includes('SCOPE')) currentPhase = 'scope';
        else currentPhase = 'solved';
        return currentPhase;
      }
      return currentPhase;
    });
  };

  const FlowCol = ({ data, dark }: { data: { heading: string; nodes: Node[] }; dark: boolean }) => {
    const scopeMap = dark ? getScopeMap(data.nodes) : null;

    return (
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <p style={{
          margin: '0 0 1.2vw',
          fontSize: 'clamp(10px, 0.8vw, 13px)',
          fontWeight: 700, letterSpacing: '0.18em',
          textTransform: 'uppercase',
          color: dark ? '#33302e' : '#888',
          fontFamily: font,
        }}>{data.heading}</p>

        {data.nodes.map((node, i) => {
          const isLast = i === data.nodes.length - 1;
          const nextIsPhase = !isLast && isPhase(data.nodes[i + 1]);
          const phase = scopeMap ? scopeMap[i] : 'pre';
          const inScope = dark && phase === 'scope';
          const isSolved = dark && phase === 'solved';

          // Colour scheme per state
          const nodeBg = inScope ? '#107c10' : isSolved ? 'rgba(51,48,46,0.06)' : 'rgba(51,48,46,0.05)';
          const nodeBorder = inScope ? 'none' : dark ? '1.5px solid rgba(51,48,46,0.1)' : '1.5px solid rgba(51,48,46,0.2)';
          const nodeText = inScope ? '#ffffff' : dark ? '#484644' : '#484644';
          const arrowColor = inScope ? '#107c10' : 'rgba(51,48,46,0.15)';

          if (isPhase(node)) {
            const isScope = node.phase.includes('SCOPE');
            return (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.6vw', margin: '0.5vw 0' }}>
                <div style={{ flex: 1, height: 1, background: isScope ? '#107c10' : 'rgba(51,48,46,0.12)' }} />
                <span style={{
                  fontSize: 'clamp(8px, 0.65vw, 11px)',
                  fontWeight: 700, letterSpacing: '0.12em',
                  textTransform: 'uppercase', whiteSpace: 'nowrap',
                  color: isScope ? '#107c10' : '#bbb',
                  fontFamily: font,
                }}>{node.phase}</span>
                <div style={{ flex: 1, height: 1, background: isScope ? '#107c10' : 'rgba(51,48,46,0.12)' }} />
              </div>
            );
          }

          return (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
              <div style={{
                width: '100%', boxSizing: 'border-box',
                padding: 'clamp(6px, 0.65vw, 10px) clamp(8px, 0.9vw, 14px)',
                borderRadius: 6, background: nodeBg, border: nodeBorder,
              }}>
                <p style={{
                  margin: 0,
                  fontSize: 'clamp(10px, 0.85vw, 14px)',
                  lineHeight: 1.4, color: nodeText,
                  fontFamily: font, whiteSpace: 'pre-line',
                }}>{node}</p>
              </div>

              {!isLast && !nextIsPhase && (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', paddingLeft: 'clamp(8px, 0.9vw, 14px)' }}>
                  <div style={{ width: 1.5, height: 'clamp(5px, 0.45vw, 8px)', background: arrowColor }} />
                  <div style={{
                    width: 0, height: 0,
                    borderLeft: '3.5px solid transparent', borderRight: '3.5px solid transparent',
                    borderTop: `4px solid ${arrowColor}`, marginLeft: -2.75,
                  }} />
                  <div style={{ width: 1.5, height: 'clamp(5px, 0.45vw, 8px)', background: arrowColor }} />
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div style={{
      width: '100%', height: '100%',
      display: 'flex', flexDirection: 'column',
      padding: '5% 6.5% 5%',
      boxSizing: 'border-box',
    }}>
      {/* Header row */}
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '3%', marginBottom: '3%' }}>
        <p style={{
          margin: 0, flex: '0 0 auto',
          fontSize: 'clamp(10px, 0.85vw, 14px)',
          fontWeight: 700, letterSpacing: '0.18em',
          textTransform: 'uppercase', color: '#888',
          fontFamily: font,
        }}>{tag}</p>
        {title && <p style={{
          margin: 0,
          fontSize: 'clamp(22px, 2.8vw, 46px)',
          fontWeight: 300, lineHeight: 1,
          letterSpacing: '-0.03em',
          backgroundImage: TITLE_GRADIENT,
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
          fontFamily: font, whiteSpace: 'pre-line',
        }}>{title}</p>}
      </div>

      {/* Two flow columns */}
      <div style={{ flex: 1, display: 'flex', gap: '5%', minHeight: 0 }}>
        <FlowCol data={before} dark={false} />

        {/* Divider */}
        <div style={{ width: 1, background: 'rgba(51,48,46,0.1)', flexShrink: 0, alignSelf: 'stretch' }} />

        <FlowCol data={after} dark={true} />
      </div>
    </div>
  );
}

const imgMicrosoftLogo = "https://www.figma.com/api/mcp/asset/a0c9d266-6668-4eed-9640-32f2d1ec057a";
const imgMsazureLogo = "https://www.figma.com/api/mcp/asset/41a17e0c-712c-46ee-aa1b-a805bc6ae2fe";
const imgInfoIcon = "https://www.figma.com/api/mcp/asset/0de699e1-15d8-4b51-8ce4-8786a9313451";

function EmailSlide({ connectorName, actions }: Extract<Slide, { type: 'email' }>) {
  const emailFont = '"Segoe UI", sans-serif';
  return (
    <div style={{
      width: '100%', height: '100%',
      background: '#f3f2f1',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      boxSizing: 'border-box',
    }}>
      {/* Slide label */}
      <p style={{
        position: 'absolute', top: '5%', left: '6.5%',
        margin: 0, fontSize: 'clamp(10px, 0.8vw, 13px)',
        fontWeight: 700, letterSpacing: '0.18em',
        textTransform: 'uppercase', color: '#888',
        fontFamily: font,
      }}>EMAIL NOTIFICATION</p>

      {/* Email card — matches Figma transactional template */}
      <div style={{
        width: 'clamp(320px, 42%, 620px)',
        background: '#ffffff',
        boxShadow: '0 4px 32px rgba(0,0,0,0.12)',
        borderRadius: 2,
        overflow: 'hidden',
        fontFamily: emailFont,
      }}>
        {/* Microsoft logo header */}
        <div style={{ background: '#ffffff', height: 'clamp(44px, 4vw, 64px)', display: 'flex', alignItems: 'center', padding: '0 24px' }}>
          <img src={imgMicrosoftLogo} alt="Microsoft" style={{ height: 'clamp(14px, 1.3vw, 20px)', width: 'auto', display: 'block', objectFit: 'contain' }} />
        </div>

        {/* Email body */}
        <div style={{ padding: 'clamp(16px, 1.8vw, 28px) 24px 0' }}>

          {/* Title */}
          <p style={{
            margin: '0 0 clamp(10px, 1vw, 16px)',
            fontSize: 'clamp(16px, 1.8vw, 26px)',
            fontWeight: 600, color: '#000', lineHeight: 1.3,
          }}>
            Action required: {connectorName}
          </p>

          {/* Body text */}
          <p style={{
            margin: '0 0 clamp(8px, 0.8vw, 12px)',
            fontSize: 'clamp(11px, 0.95vw, 14px)',
            color: '#323130', lineHeight: '20px',
          }}>
            Your connector has encountered errors that are preventing items from being indexed. Please take the following actions:
          </p>

          {/* Bullet list of actions */}
          <ul style={{ margin: '0 0 clamp(14px, 1.4vw, 20px)', paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 'clamp(4px, 0.4vw, 6px)' }}>
            {actions.map((action, i) => (
              <li key={i} style={{
                fontSize: 'clamp(11px, 0.95vw, 14px)',
                color: '#323130', lineHeight: '20px',
              }}>{action}</li>
            ))}
          </ul>

          {/* Buttons */}
          <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 'clamp(16px, 1.8vw, 28px)' }}>
            <button style={{
              background: '#0078d4', color: '#ffffff',
              border: 'none', borderRadius: 2,
              padding: 'clamp(7px, 0.65vw, 10px) clamp(14px, 1.4vw, 20px)',
              fontSize: 'clamp(11px, 0.95vw, 14px)',
              fontWeight: 600, cursor: 'pointer', fontFamily: emailFont,
            }}>
              View in Admin Center
            </button>
            <button style={{
              background: '#ebebeb', color: '#11100f',
              border: 'none', borderRadius: 2,
              padding: 'clamp(7px, 0.65vw, 10px) clamp(14px, 1.4vw, 20px)',
              fontSize: 'clamp(11px, 0.95vw, 14px)',
              fontWeight: 600, cursor: 'pointer', fontFamily: emailFont,
            }}>
              Learn more
            </button>
          </div>
        </div>

        {/* Footer */}
        <div style={{ background: '#f0f0f0', padding: 'clamp(10px, 1vw, 16px) 24px clamp(14px, 1.4vw, 22px)' }}>
          <p style={{ margin: '0 0 4px', fontSize: 'clamp(9px, 0.72vw, 11px)', color: '#006cbe', textDecoration: 'underline', cursor: 'pointer' }}>
            Privacy Statement
          </p>
          <p style={{ margin: '0 0 clamp(6px, 0.7vw, 10px)', fontSize: 'clamp(9px, 0.72vw, 11px)', color: '#484644', lineHeight: 1.5 }}>
            Microsoft Corporation, One Microsoft Way, Redmond, WA 98052 USA
          </p>
          <img src={imgMicrosoftLogo} alt="Microsoft" style={{ height: 'clamp(14px, 1.2vw, 18px)', width: 'auto', display: 'block', objectFit: 'contain' }} />
        </div>
      </div>
    </div>
  );
}

// ─── MAC UI mockup helpers ────────────────────────────────────────────────────

const macFont = '"Segoe UI", Arial, sans-serif';

function MacBadge({ variant }: { variant: 'action' | 'healthy' | 'syncing' }) {
  const cfg = {
    action: { bg: '#FDE7E9', color: '#A80000', label: 'Action required' },
    healthy: { bg: '#DFF6DD', color: '#107C10', label: 'Healthy' },
    syncing: { bg: '#EFF6FC', color: '#0078D4', label: 'Syncing' },
  }[variant];
  return (
    <span style={{ fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 2, background: cfg.bg, color: cfg.color, fontFamily: macFont, whiteSpace: 'nowrap' }}>
      {cfg.label}
    </span>
  );
}

function MacChrome({ children, highlightStep }: { children: React.ReactNode; highlightStep?: string }) {
  return (
    <div style={{ width: '100%', height: '100%', background: '#f3f2f1', display: 'flex', flexDirection: 'column', fontFamily: macFont }}>
      {/* Top bar */}
      <div style={{ height: 36, background: '#0078d4', display: 'flex', alignItems: 'center', padding: '0 16px', gap: 12, flexShrink: 0 }}>
        <div style={{ width: 16, height: 16, background: 'rgba(255,255,255,0.3)', borderRadius: 2 }} />
        <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.9)', fontWeight: 600 }}>Microsoft 365 admin center</span>
        {highlightStep && (
          <div style={{ marginLeft: 'auto', background: 'rgba(255,255,255,0.15)', borderRadius: 2, padding: '2px 10px', fontSize: 10, color: '#fff', fontWeight: 700, letterSpacing: '0.1em' }}>
            {highlightStep}
          </div>
        )}
      </div>
      {/* Content */}
      <div style={{ flex: 1, display: 'flex', minHeight: 0 }}>
        {/* Left nav */}
        <div style={{ width: 48, background: '#ffffff', borderRight: '1px solid #e1dfdd', flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 8, gap: 4 }}>
          {['⊞','⚙','👥','📊','🔒'].map((icon, i) => (
            <div key={i} style={{ width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, borderRadius: 4, background: i === 0 ? '#eff6fc' : 'transparent', cursor: 'pointer' }}>{icon}</div>
          ))}
        </div>
        {children}
      </div>
    </div>
  );
}

function ScreenSlide({ tag, step, callout, imageUrl, tourLink }: Extract<Slide, { type: 'screen' }>) {
  // placeholder shown when image hasn't been dropped in yet
  const placeholder = (
    <div style={{ width: '100%', height: '100%', background: '#f0eef8', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 12 }}>
      <span style={{ fontSize: 'clamp(28px, 3vw, 48px)', opacity: 0.3 }}>🖼</span>
      <p style={{ margin: 0, fontSize: 'clamp(11px, 1vw, 14px)', color: '#888', fontFamily: font }}>Drop screenshot → <code style={{ background: 'rgba(0,0,0,0.06)', padding: '2px 6px', borderRadius: 3 }}>public{imageUrl}</code></p>
    </div>
  );


  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', boxSizing: 'border-box' }}>

      {/* Screenshot container — top 76% */}
      <div style={{
        flex: '0 0 76%',
        position: 'relative',
        margin: '2.5% 4% 0',
        borderRadius: 'clamp(8px, 1vw, 16px)',
        overflow: 'hidden',
        boxShadow: '0 8px 40px rgba(0,0,0,0.16)',
        border: '1px solid #e1dfdd',
        background: '#f0eef8',
      }}>
        <img
          src={imageUrl}
          alt={step}
          style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top left', display: 'block' }}
          onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
        />
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
          <p style={{ margin: 0, fontSize: 'clamp(9px, 0.8vw, 12px)', color: '#bbb', fontFamily: font, textAlign: 'center' }}>
            Drop screenshot → <code style={{ background: 'rgba(0,0,0,0.04)', padding: '1px 4px', borderRadius: 3 }}>public{imageUrl}</code>
          </p>
        </div>
      </div>

      {/* Bottom: compact — tag + title left, rationale right */}
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        padding: '0 5% 0 4%',
        gap: '5%',
        minHeight: 0,
      }}>
        {/* Left: tag + step title (single line, smaller) */}
        <div style={{ flex: '0 0 34%', minWidth: 0 }}>
          <p style={{
            margin: '0 0 3px',
            fontSize: 'clamp(8px, 0.65vw, 10px)',
            fontWeight: 700, letterSpacing: '0.18em',
            textTransform: 'uppercase', color: '#888',
            fontFamily: font,
          }}>{tag}</p>
          <p style={{
            margin: 0,
            fontSize: 'clamp(14px, 1.7vw, 28px)',
            fontWeight: 300, lineHeight: 1.1,
            letterSpacing: '-0.03em',
            backgroundImage: TITLE_GRADIENT,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            fontFamily: font,
            whiteSpace: 'pre-line',
          }}>{step}</p>
        </div>

        {/* Right: rationale — smaller, wraps naturally */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{
            margin: 0,
            fontSize: 'clamp(10px, 0.95vw, 15px)',
            lineHeight: 1.55, color: '#484644',
            fontFamily: font,
          }}>{callout}</p>
          {tourLink && (
            <a
              href={tourLink}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                marginTop: 'clamp(24px, 3vw, 48px)',
                padding: 'clamp(10px, 1vw, 16px) clamp(20px, 2vw, 36px)',
                background: '#0078d4',
                color: '#fff',
                borderRadius: 6,
                fontSize: 'clamp(12px, 1.1vw, 16px)',
                fontWeight: 600,
                fontFamily: font,
                textDecoration: 'none',
                letterSpacing: '0.01em',
              }}
            >
              ▶ View live demo
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

function renderSlide(slide: Slide) {
  switch (slide.type) {
    case 'hero': return <HeroSlide {...slide} />;
    case 'content-right': return <ContentRightSlide {...slide} />;
    case 'statement': return <StatementSlide {...slide} />;
    case 'two-column': return <TwoColumnSlide {...slide} />;
    case 'quote': return <QuoteSlide {...slide} />;
    case 'steps': return <StepsSlide {...slide} />;
    case 'compare': return <CompareSlide {...slide} />;
    case 'flowchart': return <FlowchartSlide {...slide} />;
    case 'email': return <EmailSlide {...slide} />;
    case 'screen': return <ScreenSlide {...slide} />;
    case 'closing': return <ClosingSlide {...slide} />;
  }
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function DeckPage() {
  const [current, setCurrent] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  const go = useCallback((dir: 1 | -1) => {
    setCurrent(c => Math.max(0, Math.min(slides.length - 1, c + dir)));
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === ' ') { e.preventDefault(); go(1); }
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') { e.preventDefault(); go(-1); }
      if (e.key === 'f' || e.key === 'F') toggleFullscreen();
      if (e.key === 'Escape' && isFullscreen) exitFullscreen();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [go, isFullscreen]);

  // Track fullscreen state from browser API
  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handler);
    return () => document.removeEventListener('fullscreenchange', handler);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  const exitFullscreen = () => { if (document.fullscreenElement) document.exitFullscreen(); };

  const isQuote = slides[current].type === 'quote';
  const hudLight = isQuote;

  // Colors for HUD elements
  const hudBg = hudLight ? 'rgba(246,243,241,0.12)' : 'rgba(51,48,46,0.08)';
  const hudColor = hudLight ? '#f6f3f1' : '#33302e';
  const dotActive = hudLight ? '#f6f3f1' : '#33302e';
  const dotInactive = hudLight ? 'rgba(246,243,241,0.25)' : 'rgba(51,48,46,0.2)';

  return (
    <div
      ref={containerRef}
      style={{
        width: '100vw', height: '100vh',
        background: '#111', overflow: 'hidden',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        fontFamily: font,
      }}
    >
      {/* Slide viewport — 16:9 letterboxed */}
      <div style={{
        position: 'relative',
        width: '100%', height: '100%',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {/* Track */}
        <div style={{
          width: '100%', height: '100%',
          position: 'relative', overflow: 'hidden',
        }}>
          {/* All slides laid out horizontally, shifted by current index */}
          <div style={{
            display: 'flex',
            width: `${slides.length * 100}%`,
            height: '100%',
            transform: `translateX(${-current * (100 / slides.length)}%)`,
            transition: 'transform 0.45s cubic-bezier(0.65, 0, 0.35, 1)',
          }}>
            {slides.map((slide, i) => (
              <div
                key={i}
                style={{
                  width: `${100 / slides.length}%`,
                  height: '100%',
                  flexShrink: 0,
                  background: slide.type === 'quote' ? '#242424' : BG,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >
                {/* Inner 16:9 box */}
                <div style={{
                  width: '100%',
                  aspectRatio: '16/9',
                  maxHeight: '100%',
                  maxWidth: 'calc(100vh * 16/9)',
                  position: 'relative', overflow: 'hidden',
                }}>
                  {renderSlide(slide)}
                  {/* Slide number */}
                  <div style={{
                    position: 'absolute', bottom: '4%', right: '4%',
                    fontSize: 'clamp(10px, 0.9vw, 14px)',
                    fontWeight: 700, letterSpacing: '0.1em',
                    color: slide.type === 'quote' ? 'rgba(246,243,241,0.25)' : 'rgba(51,48,46,0.2)',
                    fontFamily: font,
                  }}>
                    {i + 1}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* HUD */}
      <div style={{
        position: 'fixed', bottom: 24, left: 0, right: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        gap: 10, zIndex: 100, pointerEvents: 'none',
      }}>
        {/* Prev */}
        <button onClick={() => go(-1)} disabled={current === 0} aria-label="Previous"
          style={{
            pointerEvents: 'auto', width: 34, height: 34, borderRadius: '50%',
            border: 'none', cursor: 'pointer', background: hudBg, color: hudColor,
            fontSize: 15, display: 'flex', alignItems: 'center', justifyContent: 'center',
            opacity: current === 0 ? 0.25 : 1, transition: 'opacity 0.2s',
            backdropFilter: 'blur(6px)',
          }}>←</button>

        {/* Dots */}
        <div style={{ display: 'flex', gap: 5, pointerEvents: 'auto' }}>
          {slides.map((_, i) => (
            <button key={i} onClick={() => setCurrent(i)} aria-label={`Slide ${i + 1}`}
              style={{
                width: i === current ? 18 : 6, height: 6, borderRadius: 3,
                border: 'none', cursor: 'pointer', padding: 0,
                background: i === current ? dotActive : dotInactive,
                transition: 'width 0.25s, background 0.25s',
              }} />
          ))}
        </div>

        {/* Next */}
        <button onClick={() => go(1)} disabled={current === slides.length - 1} aria-label="Next"
          style={{
            pointerEvents: 'auto', width: 34, height: 34, borderRadius: '50%',
            border: 'none', cursor: 'pointer', background: hudBg, color: hudColor,
            fontSize: 15, display: 'flex', alignItems: 'center', justifyContent: 'center',
            opacity: current === slides.length - 1 ? 0.25 : 1, transition: 'opacity 0.2s',
            backdropFilter: 'blur(6px)',
          }}>→</button>
      </div>

      {/* Counter */}
      <div style={{
        position: 'fixed', bottom: 24, right: 24,
        fontSize: 10, fontWeight: 600, letterSpacing: '0.12em',
        color: hudLight ? 'rgba(246,243,241,0.35)' : 'rgba(51,48,46,0.3)',
        fontFamily: font, transition: 'color 0.3s',
      }}>
        {current + 1} / {slides.length}
      </div>

      {/* Fullscreen toggle */}
      <button
        onClick={toggleFullscreen}
        aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
        title={isFullscreen ? 'Exit fullscreen (F)' : 'Fullscreen (F)'}
        style={{
          position: 'fixed', bottom: 24, left: 24,
          width: 34, height: 34, borderRadius: '50%',
          border: 'none', cursor: 'pointer',
          background: hudBg, color: hudColor,
          fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center',
          backdropFilter: 'blur(6px)', zIndex: 100,
          transition: 'background 0.2s',
        }}
      >
        {isFullscreen ? '⊡' : '⛶'}
      </button>
    </div>
  );
}
