'use client';

import React, { useState, useEffect, useCallback } from 'react';

const font = '"Segoe UI Variable", "Segoe UI", -apple-system, system-ui, sans-serif';
const BG = '#f6f3f1';

// ─── Slide data ───────────────────────────────────────────────────────────────

type Slide =
  | { type: 'hero'; label: string; title: string }
  | { type: 'content-right'; title: string; body: string; tag?: string; findings?: string[] }
  | { type: 'quote'; label: string; quote: string; attribution: string }
  | { type: 'flowchart'; tag: string; before: { heading: string; nodes: Array<string | { phase: string }> }; after: { heading: string; nodes: Array<string | { phase: string }> } }
  | { type: 'screen'; tag: string; step: string; callout: string; imageUrl: string }
  | { type: 'three-col'; tag: string; title: string; cols: { label: string; color: string; dot: string; items: string[] }[] }
  | { type: 'closing'; label: string; title: string; subtitle: string };

const slides: Slide[] = [
  {
    type: 'hero',
    label: 'COPILOT CONNECTORS · KITE SHAREOUT · APRIL 2026',
    title: 'Actionable\nErrors',
  },
  {
    type: 'content-right',
    tag: 'THE PROBLEM',
    title: 'The connector\nfailed.\nNow what?',
    body: 'When a sync breaks, admins land on a raw error code with no context, no impact statement, and no next step. They open a support ticket, or give up. Either way, content stops surfacing in Copilot — silently.',
    findings: [
      'Error tab shows codes like "403 Forbidden" — no plain language',
      'No indication of what content is affected or how many items',
      'No path to resolution — admin must contact 3P vendor or file a ticket',
      'No proactive signal — admin must check manually to discover failure',
    ],
  },
  {
    type: 'quote',
    label: 'CUSTOMER VOICE · LARGE ENTERPRISE',
    quote: '"I had no idea the connector stopped syncing. Users were searching Copilot and getting nothing back. We only found out because someone complained."',
    attribution: 'IT Admin, Fortune 500',
  },
  {
    type: 'three-col',
    tag: 'OUR DESIGN',
    title: 'A three-tier severity system',
    cols: [
      {
        label: 'Blocker',
        color: '#fde7e9',
        dot: '#c50f1f',
        items: [
          'Sync has stopped completely',
          'No items are being indexed',
          'Immediate action required',
          'e.g. Auth expired, token invalid',
        ],
      },
      {
        label: 'Warning',
        color: '#fff9f0',
        dot: '#d97706',
        items: [
          'Sync runs but with gaps',
          'Some content excluded silently',
          'Workaround available',
          'e.g. User mapping mismatch',
        ],
      },
      {
        label: 'Suggestion',
        color: '#f0fdf4',
        dot: '#16a34a',
        items: [
          'Sync healthy, but improvable',
          'Optional optimisation',
          'Guidance provided inline',
          'e.g. Enable incremental sync',
        ],
      },
    ],
  },
  {
    type: 'screen',
    tag: 'THE DESIGN · CONNECTION HEALTH',
    step: 'Admin lands on connector detail — issues surface immediately',
    callout: 'Each error shows severity, plain-language description, and an inline resolution step.',
    imageUrl: '/deck/screen-ae-detail.png',
  },
  {
    type: 'content-right',
    tag: 'DESIGN DECISIONS',
    title: 'Every error\ntells you\nwhat to do',
    body: 'Three principles shaped every error card: say what broke in plain language, say what impact it has, and give a resolution step that points to the exact setting — in MAC or in the third-party tool.',
    findings: [
      'Plain language title — no HTTP codes, no jargon',
      'Impact sentence — how many items are affected and why it matters',
      'Inline resolution — a single next step, not a documentation link',
      'Dual pointer — points to both MAC config and 3P settings when needed',
    ],
  },
  {
    type: 'flowchart',
    tag: 'BEFORE VS NOW',
    before: {
      heading: 'Before',
      nodes: [
        'Error occurs silently\n(auth expires / server down)',
        'No notification sent',
        'Admin manually opens MAC',
        'Navigates to Error tab',
        'Sees raw HTTP error codes',
        'Opens support ticket\nor gives up',
      ],
    },
    after: {
      heading: 'Now',
      nodes: [
        'Error occurs\n(auth expires / server down)',
        { phase: 'OUR SCOPE →' },
        'Admin notified by email',
        'Lands on Connection health tab',
        'Sees ranked, plain-language issues',
        'Inline resolution step resolves it\nwithout leaving the page',
      ],
    },
  },
  {
    type: 'screen',
    tag: 'THE DESIGN · YOUR CONNECTIONS',
    step: 'Connections list surfaces the "Action required" signal at a glance',
    callout: '"Action required" badge on the row — admin knows before they even open the panel.',
    imageUrl: '/deck/screen-ae-connections.png',
  },
  {
    type: 'closing',
    label: 'COPILOT CONNECTORS · KITE SHAREOUT',
    title: 'Errors that tell you\nwhat to do next.',
    subtitle: 'Prototype live at localhost:3000/connectors',
  },
];

// ─── Slide renderers ──────────────────────────────────────────────────────────

function HeroSlide({ label, title }: Extract<Slide, { type: 'hero' }>) {
  return (
    <div style={{ width: '100%', height: '100%', background: BG, padding: '5% 6%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', fontFamily: font }}>
      <div style={{ fontSize: 'clamp(9px, 1vw, 13px)', fontWeight: 600, letterSpacing: '0.14em', color: '#7a7671', textTransform: 'uppercase' }}>
        {label}
      </div>
      <div style={{ fontSize: 'clamp(52px, 9.5vw, 112px)', fontWeight: 200, lineHeight: 1.0, color: '#242424', letterSpacing: '-0.02em', whiteSpace: 'pre-line' }}>
        {title}
      </div>
      <div style={{ height: 1 }} />
    </div>
  );
}

function ContentRightSlide({ tag, title, body, findings }: Extract<Slide, { type: 'content-right' }>) {
  return (
    <div style={{ width: '100%', height: '100%', background: BG, padding: '6% 6%', display: 'flex', gap: '8%', alignItems: 'flex-start', fontFamily: font }}>
      <div style={{ flex: '0 0 38%' }}>
        {tag && (
          <div style={{ fontSize: 'clamp(8px, 0.85vw, 11px)', fontWeight: 600, letterSpacing: '0.14em', color: '#7a7671', textTransform: 'uppercase', marginBottom: '6%' }}>
            {tag}
          </div>
        )}
        <div style={{ fontSize: 'clamp(28px, 5.2vw, 60px)', fontWeight: 200, lineHeight: 1.05, color: '#242424', letterSpacing: '-0.02em', whiteSpace: 'pre-line' }}>
          {title}
        </div>
      </div>
      <div style={{ flex: 1, paddingTop: tag ? 'calc(clamp(8px, 0.85vw, 11px) + 6%)' : '0' }}>
        <p style={{ fontSize: 'clamp(12px, 1.35vw, 18px)', lineHeight: 1.6, color: '#33302e', margin: '0 0 5% 0', fontWeight: 300 }}>
          {body}
        </p>
        {findings && (
          <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '2.5%' }}>
            {findings.map((f, i) => (
              <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 'clamp(10px, 1.1vw, 14px)', color: '#33302e', lineHeight: 1.5 }}>
                <span style={{ marginTop: '0.4em', width: 5, height: 5, borderRadius: '50%', background: '#7a7671', flexShrink: 0 }} />
                {f}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function QuoteSlide({ label, quote, attribution }: Extract<Slide, { type: 'quote' }>) {
  return (
    <div style={{ width: '100%', height: '100%', background: '#242424', padding: '6% 7%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', fontFamily: font }}>
      <div style={{ fontSize: 'clamp(8px, 0.85vw, 11px)', fontWeight: 600, letterSpacing: '0.14em', color: 'rgba(246,243,241,0.4)', textTransform: 'uppercase' }}>
        {label}
      </div>
      <div style={{ fontSize: 'clamp(20px, 3.4vw, 42px)', fontWeight: 200, lineHeight: 1.4, color: '#f6f3f1', letterSpacing: '-0.01em', maxWidth: '78%' }}>
        {quote}
      </div>
      <div style={{ fontSize: 'clamp(10px, 1vw, 13px)', color: 'rgba(246,243,241,0.5)', fontWeight: 300 }}>
        — {attribution}
      </div>
    </div>
  );
}

function ThreeColSlide({ tag, title, cols }: Extract<Slide, { type: 'three-col' }>) {
  return (
    <div style={{ width: '100%', height: '100%', background: BG, padding: '5.5% 6%', display: 'flex', flexDirection: 'column', gap: '5%', fontFamily: font }}>
      <div>
        <div style={{ fontSize: 'clamp(8px, 0.85vw, 11px)', fontWeight: 600, letterSpacing: '0.14em', color: '#7a7671', textTransform: 'uppercase', marginBottom: '1.5%' }}>
          {tag}
        </div>
        <div style={{ fontSize: 'clamp(20px, 3.2vw, 38px)', fontWeight: 200, color: '#242424', letterSpacing: '-0.02em' }}>
          {title}
        </div>
      </div>
      <div style={{ flex: 1, display: 'flex', gap: '3%' }}>
        {cols.map((col, i) => (
          <div key={i} style={{ flex: 1, background: col.color, borderRadius: 10, padding: '5% 6%', display: 'flex', flexDirection: 'column', gap: '5%' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: col.dot, flexShrink: 0 }} />
              <div style={{ fontSize: 'clamp(10px, 1.1vw, 14px)', fontWeight: 600, color: '#242424', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                {col.label}
              </div>
            </div>
            <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8%' }}>
              {col.items.map((item, j) => (
                <li key={j} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 'clamp(10px, 1.05vw, 13px)', color: '#33302e', lineHeight: 1.45 }}>
                  <span style={{ marginTop: '0.35em', width: 4, height: 4, borderRadius: '50%', background: col.dot, flexShrink: 0, opacity: 0.6 }} />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

function ScreenSlide({ tag, step, callout, imageUrl }: Extract<Slide, { type: 'screen' }>) {
  return (
    <div style={{ width: '100%', height: '100%', background: BG, padding: '5% 5% 2% 5%', display: 'flex', flexDirection: 'column', gap: '3%', fontFamily: font }}>
      <div style={{ fontSize: 'clamp(8px, 0.85vw, 11px)', fontWeight: 600, letterSpacing: '0.14em', color: '#7a7671', textTransform: 'uppercase' }}>
        {tag}
      </div>
      <div style={{ flex: 1, position: 'relative', borderRadius: 8, overflow: 'hidden', boxShadow: '0 4px 32px rgba(36,36,36,0.13)' }}>
        <img src={imageUrl} alt={step} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top left', display: 'block' }} />
      </div>
      <div style={{ display: 'flex', gap: '4%', alignItems: 'flex-start' }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 'clamp(13px, 1.6vw, 20px)', fontWeight: 300, color: '#242424', lineHeight: 1.3, letterSpacing: '-0.01em' }}>
            {step}
          </div>
        </div>
        <div style={{ flex: 1, fontSize: 'clamp(10px, 1vw, 13px)', color: '#7a7671', lineHeight: 1.5, fontWeight: 300 }}>
          {callout}
        </div>
      </div>
    </div>
  );
}

function FlowchartSlide({ tag, before, after }: Extract<Slide, { type: 'flowchart' }>) {
  const NODE_BG = '#e8e4e0';
  const NODE_BG_NOW = '#166534';
  const NODE_TEXT = '#242424';
  const NODE_TEXT_NOW = '#ffffff';

  return (
    <div style={{ width: '100%', height: '100%', background: BG, padding: '5% 6%', display: 'flex', flexDirection: 'column', gap: '4%', fontFamily: font }}>
      <div style={{ fontSize: 'clamp(8px, 0.85vw, 11px)', fontWeight: 600, letterSpacing: '0.14em', color: '#7a7671', textTransform: 'uppercase' }}>
        {tag}
      </div>
      <div style={{ flex: 1, display: 'flex', gap: '4%' }}>
        {/* Before */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '2%' }}>
          <div style={{ fontSize: 'clamp(9px, 0.9vw, 11px)', fontWeight: 700, letterSpacing: '0.12em', color: '#7a7671', textTransform: 'uppercase', marginBottom: '1%' }}>
            {before.heading}
          </div>
          {before.nodes.map((node, i) => (
            <React.Fragment key={i}>
              <div style={{ background: NODE_BG, borderRadius: 6, padding: '3% 4%', fontSize: 'clamp(9px, 0.95vw, 12px)', color: NODE_TEXT, lineHeight: 1.4, whiteSpace: 'pre-line' }}>
                {typeof node === 'string' ? node : null}
              </div>
              {i < before.nodes.length - 1 && (
                <div style={{ textAlign: 'center', fontSize: 10, color: '#7a7671', lineHeight: 1 }}>↓</div>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Divider */}
        <div style={{ width: 1, background: 'rgba(51,48,46,0.1)', flexShrink: 0 }} />

        {/* After */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '2%' }}>
          <div style={{ fontSize: 'clamp(9px, 0.9vw, 11px)', fontWeight: 700, letterSpacing: '0.12em', color: '#166534', textTransform: 'uppercase', marginBottom: '1%' }}>
            {after.heading}
          </div>
          {after.nodes.map((node, i) => {
            if (typeof node === 'object' && 'phase' in node) {
              return (
                <React.Fragment key={i}>
                  <div style={{ textAlign: 'center', fontSize: 'clamp(7px, 0.75vw, 9px)', fontWeight: 700, letterSpacing: '0.1em', color: '#166534', textTransform: 'uppercase', padding: '1% 0' }}>
                    {node.phase}
                  </div>
                  {i < after.nodes.length - 1 && <div style={{ textAlign: 'center', fontSize: 10, color: '#166534', lineHeight: 1 }}>↓</div>}
                </React.Fragment>
              );
            }
            return (
              <React.Fragment key={i}>
                <div style={{ background: NODE_BG_NOW, borderRadius: 6, padding: '3% 4%', fontSize: 'clamp(9px, 0.95vw, 12px)', color: NODE_TEXT_NOW, lineHeight: 1.4, whiteSpace: 'pre-line' }}>
                  {node as string}
                </div>
                {i < after.nodes.length - 1 && (
                  <div style={{ textAlign: 'center', fontSize: 10, color: '#166534', lineHeight: 1 }}>↓</div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function ClosingSlide({ label, title, subtitle }: Extract<Slide, { type: 'closing' }>) {
  return (
    <div style={{ width: '100%', height: '100%', background: '#242424', padding: '5% 6%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', fontFamily: font }}>
      <div style={{ fontSize: 'clamp(8px, 0.85vw, 11px)', fontWeight: 600, letterSpacing: '0.14em', color: 'rgba(246,243,241,0.35)', textTransform: 'uppercase' }}>
        {label}
      </div>
      <div>
        <div style={{ fontSize: 'clamp(30px, 5.8vw, 68px)', fontWeight: 200, lineHeight: 1.1, color: '#f6f3f1', letterSpacing: '-0.02em', whiteSpace: 'pre-line', marginBottom: '3%' }}>
          {title}
        </div>
        <div style={{ fontSize: 'clamp(10px, 1.1vw, 14px)', color: 'rgba(246,243,241,0.4)', fontWeight: 300 }}>
          {subtitle}
        </div>
      </div>
      <div style={{ height: 1 }} />
    </div>
  );
}

function renderSlide(slide: Slide) {
  switch (slide.type) {
    case 'hero': return <HeroSlide {...slide} />;
    case 'content-right': return <ContentRightSlide {...slide} />;
    case 'quote': return <QuoteSlide {...slide} />;
    case 'three-col': return <ThreeColSlide {...slide} />;
    case 'screen': return <ScreenSlide {...slide} />;
    case 'flowchart': return <FlowchartSlide {...slide} />;
    case 'closing': return <ClosingSlide {...slide} />;
  }
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ActionableErrorsDeckPage() {
  const [current, setCurrent] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  const go = useCallback((dir: 1 | -1) => {
    setCurrent(c => Math.max(0, Math.min(slides.length - 1, c + dir)));
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === ' ') { e.preventDefault(); go(1); }
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') { e.preventDefault(); go(-1); }
      if (e.key === 'f' || e.key === 'F') containerRef.current?.requestFullscreen?.();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [go]);

  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handler);
    return () => document.removeEventListener('fullscreenchange', handler);
  }, []);

  const isQuote = slides[current].type === 'quote' || slides[current].type === 'closing';
  const hudBg = isQuote ? 'rgba(246,243,241,0.12)' : 'rgba(51,48,46,0.08)';
  const hudColor = isQuote ? '#f6f3f1' : '#33302e';
  const dotActive = isQuote ? '#f6f3f1' : '#33302e';
  const dotInactive = isQuote ? 'rgba(246,243,241,0.25)' : 'rgba(51,48,46,0.2)';

  return (
    <div
      ref={containerRef}
      style={{ width: '100vw', height: '100vh', background: '#111', overflow: 'hidden', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: font }}
    >
      <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden' }}>
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
                  background: (slide.type === 'quote' || slide.type === 'closing') ? '#242424' : BG,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >
                <div style={{ width: '100%', aspectRatio: '16/9', maxHeight: '100%', maxWidth: 'calc(100vh * 16/9)', position: 'relative', overflow: 'hidden' }}>
                  {renderSlide(slide)}
                  <div style={{
                    position: 'absolute', bottom: '4%', right: '4%',
                    fontSize: 'clamp(10px, 0.9vw, 14px)', fontWeight: 700, letterSpacing: '0.1em',
                    color: (slide.type === 'quote' || slide.type === 'closing') ? 'rgba(246,243,241,0.25)' : 'rgba(51,48,46,0.2)',
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
      <div style={{ position: 'fixed', bottom: 24, left: 0, right: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, zIndex: 100, pointerEvents: 'none' }}>
        <button onClick={() => go(-1)} disabled={current === 0}
          style={{ pointerEvents: 'auto', width: 34, height: 34, borderRadius: '50%', border: 'none', cursor: 'pointer', background: hudBg, color: hudColor, fontSize: 15, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: current === 0 ? 0.25 : 1, backdropFilter: 'blur(6px)' }}>
          ←
        </button>
        <div style={{ display: 'flex', gap: 5, pointerEvents: 'auto' }}>
          {slides.map((_, i) => (
            <button key={i} onClick={() => setCurrent(i)}
              style={{ width: i === current ? 18 : 6, height: 6, borderRadius: 3, border: 'none', cursor: 'pointer', padding: 0, background: i === current ? dotActive : dotInactive, transition: 'width 0.25s, background 0.25s' }} />
          ))}
        </div>
        <button onClick={() => go(1)} disabled={current === slides.length - 1}
          style={{ pointerEvents: 'auto', width: 34, height: 34, borderRadius: '50%', border: 'none', cursor: 'pointer', background: hudBg, color: hudColor, fontSize: 15, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: current === slides.length - 1 ? 0.25 : 1, backdropFilter: 'blur(6px)' }}>
          →
        </button>
      </div>

      <div style={{ position: 'fixed', bottom: 24, right: 24, fontSize: 10, fontWeight: 600, letterSpacing: '0.12em', color: isQuote ? 'rgba(246,243,241,0.35)' : 'rgba(51,48,46,0.3)', fontFamily: font }}>
        {current + 1} / {slides.length}
      </div>

      <button
        onClick={() => containerRef.current?.requestFullscreen?.()}
        style={{ position: 'fixed', bottom: 24, left: 24, width: 34, height: 34, borderRadius: '50%', border: 'none', cursor: 'pointer', background: hudBg, color: hudColor, fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(6px)', zIndex: 100 }}
      >
        ⛶
      </button>
    </div>
  );
}
