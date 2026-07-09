'use client';

import React, { useState, useCallback, useRef, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

// ─── Constants ────────────────────────────────────────────────────────────────

const FONT = '"Segoe UI Variable", "Segoe UI", -apple-system, system-ui, sans-serif';
const BG = '#f6f3f1';
const TITLE_GRADIENT = 'linear-gradient(90deg, #33302e 36%, #f6f3f1 147%)';
const DARK_BG = '#242424';

// ─── Types ────────────────────────────────────────────────────────────────────

type SlideType = 'hero' | 'content-right' | 'image-right' | 'statement' | 'content-split' | 'quote' | 'two-column';

interface SlideBase { id: string; type: SlideType }

interface HeroSlide extends SlideBase { type: 'hero'; label: string; title: string; bg?: string }
interface ContentRightSlide extends SlideBase { type: 'content-right'; title: string; body: string; body2?: string }
interface ImageRightSlide extends SlideBase { type: 'image-right'; subtitle: string; title: string; body: string; imageUrl: string }
interface StatementSlide extends SlideBase { type: 'statement'; label: string; statement: string }
interface ContentSplitSlide extends SlideBase { type: 'content-split'; title: string; body: string; body2?: string }
interface QuoteSlide extends SlideBase { type: 'quote'; label: string; quote: string; attribution: string }
interface TwoColumnSlide extends SlideBase { type: 'two-column'; title: string; imageUrl: string; col1: string; col2: string }

type Slide = HeroSlide | ContentRightSlide | ImageRightSlide | StatementSlide | ContentSplitSlide | QuoteSlide | TwoColumnSlide;

// ─── Default slide content per template ──────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const TEMPLATES: Record<SlideType, { label: string; defaultSlide: any }> = {
  hero: {
    label: 'Hero title',
    defaultSlide: { type: 'hero', label: 'SECTION TITLE', title: 'Title for presentation' },
  },
  'content-right': {
    label: 'Content + body',
    defaultSlide: { type: 'content-right', title: 'Content title', body: 'This is where your paragraph content will go. You can write quite a bit in this space.', body2: 'Second sentence in a paragraph.' },
  },
  'image-right': {
    label: 'Image right',
    defaultSlide: { type: 'image-right', subtitle: 'Subtitle', title: 'Content title', body: 'This is where your paragraph content will go.', imageUrl: '' },
  },
  statement: {
    label: 'Statement',
    defaultSlide: { type: 'statement', label: 'SECTION TITLE', statement: 'You can write a longer statement right here.' },
  },
  'content-split': {
    label: 'Title + large body',
    defaultSlide: { type: 'content-split', title: 'Content title', body: 'This is where your paragraph content will go. You can write quite a bit in this space.', body2: 'Second sentence in a paragraph.' },
  },
  quote: {
    label: 'Quote (dark)',
    defaultSlide: { type: 'quote', label: 'CUSTOMER VOICE', quote: '"Write a compelling quote from a customer or stakeholder right here."', attribution: 'Name, Company' },
  },
  'two-column': {
    label: 'Two columns',
    defaultSlide: { type: 'two-column', title: 'Content title', imageUrl: '', col1: 'First column of content goes here.', col2: 'Second column of content goes here.' },
  },
};

// ─── Initial deck ─────────────────────────────────────────────────────────────

let _nextId = 1;
function makeId() { return String(_nextId++); }
function makeSlide(type: SlideType): Slide {
  return { id: makeId(), ...TEMPLATES[type].defaultSlide } as Slide;
}

const INITIAL_SLIDES: Slide[] = [
  { id: makeId(), type: 'hero', label: 'COPILOT CONNECTORS RESEARCH', title: 'Welcome' },
  { id: makeId(), type: 'image-right', subtitle: '', title: 'Current experience', body: '', imageUrl: '/deck/screen-current-errors.png' },
];

// ─── Presets (existing decks loaded into editor) ──────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const PRESETS: Record<string, any[]> = {
  'zero-observability': [
    { type: 'hero', label: 'COPILOT CONNECTORS · APRIL 2025', title: 'Zero\nObservability' },
    {
      type: 'content-right',
      title: 'The system\nreports.\nThe admin\nguesses.',
      body: 'Admins have no reason to open MAC unless something is wrong — yet the product gives them no signal when things go wrong. Six research findings, all high priority.',
      body2: 'H10 — Crawls run 3–4 days with no phase, no %, no ETA\nH13 — Connectors disconnect unpredictably with no re-auth alert\nH14 — No health dashboard; failures found through user complaints\nH8 — No pre-crawl checklist for auth, connectivity, permissions',
    },
    {
      type: 'quote',
      label: 'CUSTOMER VOICE · EY',
      quote: '"It took many, many days — like 3–4 days to crawl the 13,000 items. You refresh it once, it works. And all of a sudden it goes disconnect."',
      attribution: 'Enterprise Admin, EY',
    },
    {
      type: 'content-right',
      title: 'What\nwe are\nsolving',
      body: 'Setup-time validation is already solved. We are building the proactive error management layer for what happens after the connector goes live.',
      body2: 'Proactive email notification when sync errors are detected\nPlain-language error explanation with impact — not raw codes\nGuided resolution pointing to both 3P settings and MAC config\nInline actions — fix, retry, or escalate without leaving the page',
    },
    {
      type: 'image-right',
      subtitle: 'CURRENT EXPERIENCE · BEFORE',
      title: 'Admin opens MAC manually',
      body: 'Raw error codes. No guidance. Admin is left to figure it out.',
      imageUrl: '/deck/screen-current.jpg',
    },
    {
      type: 'two-column',
      title: 'Before vs now',
      imageUrl: '',
      col1: 'Set up connector → Full crawl runs 3–4 days with no progress → Error occurs silently → No notification sent → Admin manually opens Your Connections → Sees raw error codes with no guidance.',
      col2: 'Set up connector → Pre-crawl validation → Connector syncs on schedule → Error detected → Admin notified by email → Admin lands on MAC with errors shown as guided actions → System points to both 3P settings and MAC config.',
    },
    {
      type: 'content-split',
      title: 'Email\nnotification',
      body: 'Admin receives a proactive email when sync errors are detected — before they have to hunt for problems.',
      body2: 'Connection token has expired — re-authentication required\nSync failure detected — 847 items were not indexed\nScheduled crawl was skipped due to server timeout',
    },
    {
      type: 'content-split',
      title: 'System\nleads.\nAdmin\nsupervises.',
      body: 'Notify → Admin receives a proactive email when sync errors are detected.\nExplain → Error shown in plain language with item impact count — not raw codes.\nGuide → System points to both the 3P source settings and the MAC connector config.',
      body2: 'Act → Admin fixes, retries, or escalates without leaving the page. Audit trail saved automatically.',
    },
  ],
};

function makePresetSlides(preset: string): Slide[] {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (PRESETS[preset] ?? []).map((s: any) => ({ id: makeId(), ...s } as Slide));
}

// ─── Slide renderers ──────────────────────────────────────────────────────────

function HeroRenderer({ slide }: { slide: HeroSlide }) {
  return (
    <div style={{
      width: '100%', height: '100%', fontFamily: FONT,
      position: 'relative', overflow: 'hidden',
      background: BG,
    }}>
      {/* Background image */}
      <img src="/deck/cover.png" alt="" style={{
        position: 'absolute', inset: 0, width: '100%', height: '100%',
        objectFit: 'cover', objectPosition: 'center', display: 'block',
      }} />
      {/* Overlay for text legibility */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(105deg, rgba(246,243,241,0.88) 0%, rgba(246,243,241,0.65) 45%, rgba(246,243,241,0.15) 100%)',
      }} />
      {/* Label — top left */}
      <div style={{
        position: 'absolute',
        top: '8.6%', left: '4.84%',
        fontSize: 'clamp(7px, 1.4vw, 28px)',
        fontWeight: 700,
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        color: '#000000',
        lineHeight: 1.5,
        whiteSpace: 'nowrap',
      }}>{slide.label}</div>
      {/* Title — lower portion */}
      <div style={{
        position: 'absolute',
        top: '43%', left: '4.84%', right: '4.84%',
        fontSize: 'clamp(28px, 8vw, 155px)',
        fontWeight: 400,
        lineHeight: 1.0,
        letterSpacing: '-0.05em',
        whiteSpace: 'pre-line',
        backgroundImage: 'linear-gradient(90deg, #33302e 0%, #a09890 60%, #f6f3f1 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
      }}>{slide.title}</div>
    </div>
  );
}

function ContentRightRenderer({ slide }: { slide: ContentRightSlide }) {
  return (
    <div style={{ width: '100%', height: '100%', background: BG, fontFamily: FONT, padding: '5% 5%', display: 'flex', gap: '6%', alignItems: 'flex-start' }}>
      <div style={{ flex: '0 0 36%' }}>
        <div style={{ fontSize: 'clamp(20px, 5vw, 66px)', fontWeight: 200, lineHeight: 1.05, letterSpacing: '-0.03em', whiteSpace: 'pre-line', backgroundImage: TITLE_GRADIENT, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>{slide.title}</div>
      </div>
      <div style={{ flex: 1, paddingTop: '0.5%' }}>
        <div style={{ fontSize: 'clamp(11px, 1.6vw, 22px)', lineHeight: 1.55, color: '#242424', fontWeight: 300, whiteSpace: 'pre-line' }}>{slide.body}</div>
        {slide.body2 && <div style={{ fontSize: 'clamp(11px, 1.6vw, 22px)', lineHeight: 1.55, color: '#242424', fontWeight: 300, marginTop: '1em' }}>{slide.body2}</div>}
      </div>
    </div>
  );
}

function ImageRightRenderer({ slide }: { slide: ImageRightSlide }) {
  return (
    <div style={{ width: '100%', height: '100%', background: BG, fontFamily: FONT, padding: '5% 5%', display: 'flex', gap: '4%', alignItems: 'flex-start' }}>
      <div style={{ flex: '0 0 38%', display: 'flex', flexDirection: 'column', gap: '4%', height: '100%' }}>
        <div style={{ fontSize: 'clamp(9px, 1.1vw, 15px)', fontWeight: 300, letterSpacing: '-0.01em', color: '#7a7671' }}>{slide.subtitle}</div>
        <div style={{ fontSize: 'clamp(18px, 4vw, 52px)', fontWeight: 200, lineHeight: 1.05, letterSpacing: '-0.02em', backgroundImage: TITLE_GRADIENT, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>{slide.title}</div>
        <div style={{ flex: 1 }} />
        <div style={{ fontSize: 'clamp(10px, 1.3vw, 17px)', lineHeight: 1.6, color: '#242424', fontWeight: 300 }}>{slide.body}</div>
      </div>
      <div style={{ flex: 1, height: '100%', borderRadius: 12, overflow: 'hidden', background: '#e8e4e0' }}>
        {slide.imageUrl
          ? <img src={slide.imageUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain', objectPosition: 'center', display: 'block' }} />
          : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#aaa', fontSize: 13 }}>Image URL</div>
        }
      </div>
    </div>
  );
}

function StatementRenderer({ slide }: { slide: StatementSlide }) {
  return (
    <div style={{ width: '100%', height: '100%', background: '#f6f6f6', fontFamily: FONT, padding: '5% 5%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ fontSize: 'clamp(8px, 1vw, 13px)', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#242424' }}>{slide.label}</div>
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingRight: '5%' }}>
        <div style={{ fontSize: 'clamp(18px, 4.5vw, 58px)', fontWeight: 600, lineHeight: 1.25, letterSpacing: '-0.02em', textAlign: 'right', maxWidth: '55%', backgroundImage: 'linear-gradient(90deg, #d8c8bc 0%, #242424 60%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>{slide.statement}</div>
      </div>
    </div>
  );
}

function BulletList({ text, fontSize }: { text: string; fontSize: string }) {
  const lines = text.split('\n').filter(Boolean);
  const isBullet = lines.some(l => l.trimStart().startsWith('·') || l.trimStart().startsWith('•'));
  if (!isBullet) {
    return <div style={{ fontSize, lineHeight: 1.5, color: '#242424', fontWeight: 300, whiteSpace: 'pre-line' }}>{text}</div>;
  }
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(4px, 0.7vw, 9px)' }}>
      {lines.map((line, i) => {
        const clean = line.replace(/^[\s·•]+/, '');
        return (
          <div key={i} style={{ display: 'flex', gap: 'clamp(6px, 0.8vw, 10px)', alignItems: 'flex-start' }}>
            <div style={{ flexShrink: 0, width: 'clamp(4px, 0.45vw, 6px)', height: 'clamp(4px, 0.45vw, 6px)', borderRadius: '50%', background: '#33302e', marginTop: 'clamp(5px, 0.75vw, 9px)', opacity: 0.45 }} />
            <div style={{ fontSize, lineHeight: 1.5, color: '#242424', fontWeight: 300 }}>{clean}</div>
          </div>
        );
      })}
    </div>
  );
}

function ContentSplitRenderer({ slide }: { slide: ContentSplitSlide }) {
  return (
    <div style={{ width: '100%', height: '100%', background: BG, fontFamily: FONT, padding: '5% 5%', display: 'flex', flexDirection: 'column', gap: '3%' }}>
      <div style={{ fontSize: 'clamp(18px, 5vw, 66px)', fontWeight: 200, lineHeight: 1.05, letterSpacing: '-0.03em', whiteSpace: 'pre-line', backgroundImage: TITLE_GRADIENT, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>{slide.title}</div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '2.5%', justifyContent: 'flex-start', paddingTop: '1%' }}>
        {slide.body && <div style={{ fontSize: 'clamp(11px, 1.8vw, 24px)', lineHeight: 1.45, color: '#605e5c', fontWeight: 400 }}>{slide.body}</div>}
        {slide.body2 && <BulletList text={slide.body2} fontSize='clamp(10px, 1.4vw, 18px)' />}
      </div>
    </div>
  );
}

function QuoteRenderer({ slide }: { slide: QuoteSlide }) {
  return (
    <div style={{ width: '100%', height: '100%', background: DARK_BG, fontFamily: FONT, padding: '5% 6%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <div style={{ fontSize: 'clamp(8px, 0.9vw, 12px)', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(246,243,241,0.4)' }}>{slide.label}</div>
      <div style={{ fontSize: 'clamp(14px, 2.6vw, 34px)', fontWeight: 200, lineHeight: 1.4, color: '#f6f3f1', letterSpacing: '-0.01em', maxWidth: '80%' }}>{slide.quote}</div>
      <div style={{ fontSize: 'clamp(9px, 1vw, 13px)', color: 'rgba(246,243,241,0.45)', fontWeight: 300 }}>— {slide.attribution}</div>
    </div>
  );
}

function TwoColumnRenderer({ slide }: { slide: TwoColumnSlide }) {
  return (
    <div style={{ width: '100%', height: '100%', background: BG, fontFamily: FONT, display: 'flex', flexDirection: 'column' }}>
      {slide.imageUrl
        ? <div style={{ flex: '0 0 55%', overflow: 'hidden', background: '#e8e4e0' }}>
            <img src={slide.imageUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', display: 'block' }} />
          </div>
        : <div style={{ flex: '0 0 55%', background: '#e8e4e0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#aaa', fontSize: 13 }}>Image URL</div>
      }
      <div style={{ flex: 1, padding: '3% 5%', display: 'flex', gap: '4%', alignItems: 'flex-start' }}>
        <div style={{ flex: '0 0 30%', fontSize: 'clamp(14px, 3.5vw, 46px)', fontWeight: 200, lineHeight: 1.05, letterSpacing: '-0.02em', backgroundImage: TITLE_GRADIENT, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>{slide.title}</div>
        <div style={{ flex: 1, fontSize: 'clamp(9px, 1.1vw, 14px)', lineHeight: 1.55, color: '#242424', fontWeight: 300 }}>{slide.col1}</div>
        <div style={{ flex: 1, fontSize: 'clamp(9px, 1.1vw, 14px)', lineHeight: 1.55, color: '#242424', fontWeight: 300 }}>{slide.col2}</div>
      </div>
    </div>
  );
}

function SlideRenderer({ slide, scale = 1 }: { slide: Slide; scale?: number }) {
  const inner = (() => {
    switch (slide.type) {
      case 'hero': return <HeroRenderer slide={slide} />;
      case 'content-right': return <ContentRightRenderer slide={slide} />;
      case 'image-right': return <ImageRightRenderer slide={slide} />;
      case 'statement': return <StatementRenderer slide={slide} />;
      case 'content-split': return <ContentSplitRenderer slide={slide} />;
      case 'quote': return <QuoteRenderer slide={slide} />;
      case 'two-column': return <TwoColumnRenderer slide={slide} />;
    }
  })();
  return inner;
}

// ─── Thumbnail ────────────────────────────────────────────────────────────────

function Thumbnail({ slide, index, selected, onClick, onDelete, onChangeTemplate }: {
  slide: Slide; index: number; selected: boolean; onClick: () => void; onDelete: () => void; onChangeTemplate: () => void;
}) {
  const [hover, setHover] = useState(false);
  const THUMB_W = 168;
  const THUMB_H = 94.5;
  const SCALE = THUMB_W / 1000;

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{ position: 'relative', marginBottom: 8, cursor: 'pointer', flexShrink: 0 }}
    >
      <div style={{
        width: THUMB_W, height: THUMB_H,
        border: selected ? '2px solid #0f6cbd' : hover ? '2px solid #c8c8c8' : '2px solid transparent',
        borderRadius: 8, overflow: 'hidden',
        transition: 'border-color 0.15s',
      }}>
        <div style={{ width: THUMB_W / SCALE, height: THUMB_H / SCALE, transform: `scale(${SCALE})`, transformOrigin: '0 0', pointerEvents: 'none' }}>
          <SlideRenderer slide={slide} />
        </div>
      </div>
      <div style={{ position: 'absolute', bottom: 4, left: 6, fontSize: 9, color: selected ? '#0f6cbd' : '#999', fontFamily: FONT, fontWeight: 600 }}>{index + 1}</div>
      {hover && (
        <>
          <button
            onClick={e => { e.stopPropagation(); onDelete(); }}
            style={{ position: 'absolute', top: 4, right: 4, width: 18, height: 18, borderRadius: '50%', background: 'rgba(0,0,0,0.5)', border: 'none', color: '#fff', fontSize: 11, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', lineHeight: 1 }}
          >✕</button>
          <button
            onClick={e => { e.stopPropagation(); onChangeTemplate(); }}
            title="Change template"
            style={{ position: 'absolute', top: 4, right: 26, height: 18, borderRadius: 4, background: 'rgba(15,108,189,0.85)', border: 'none', color: '#fff', fontSize: 9, fontWeight: 600, padding: '0 5px', cursor: 'pointer', fontFamily: FONT, whiteSpace: 'nowrap' }}
          >Layout</button>
        </>
      )}
    </div>
  );
}

// ─── Edit panel ───────────────────────────────────────────────────────────────

function FieldGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#605e5c', marginBottom: 5, fontFamily: FONT }}>{label}</div>
      {children}
    </div>
  );
}

function TextInput({ value, onChange, multiline, placeholder }: { value: string; onChange: (v: string) => void; multiline?: boolean; placeholder?: string }) {
  const style: React.CSSProperties = {
    width: '100%', boxSizing: 'border-box', padding: '6px 8px',
    fontSize: 13, fontFamily: FONT,
    border: '1px solid #e0e0e0', borderRadius: 4,
    background: '#fafafa', color: '#242424',
    resize: 'vertical', outline: 'none',
    lineHeight: 1.5,
  };
  return multiline
    ? <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={3} style={style} />
    : <input type="text" value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} style={style} />;
}

function EditPanel({ slide, onChange }: { slide: Slide; onChange: (s: Slide) => void }) {
  const upd = (patch: Partial<Slide>) => onChange({ ...slide, ...patch } as Slide);

  return (
    <div style={{ padding: '16px 14px', fontFamily: FONT }}>
      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#0f6cbd', marginBottom: 16 }}>
        {TEMPLATES[slide.type].label}
      </div>

      {slide.type === 'hero' && <>
        <FieldGroup label="Label"><TextInput value={slide.label} onChange={v => upd({ label: v })} placeholder="SECTION TITLE" /></FieldGroup>
        <FieldGroup label="Title"><TextInput value={slide.title} onChange={v => upd({ title: v })} multiline placeholder="Title for presentation" /></FieldGroup>
      </>}

      {slide.type === 'content-right' && <>
        <FieldGroup label="Title"><TextInput value={slide.title} onChange={v => upd({ title: v })} multiline placeholder="Content title" /></FieldGroup>
        <FieldGroup label="Body"><TextInput value={slide.body} onChange={v => upd({ body: v })} multiline placeholder="Main paragraph..." /></FieldGroup>
        <FieldGroup label="Second paragraph"><TextInput value={slide.body2 ?? ''} onChange={v => upd({ body2: v })} multiline placeholder="Optional second paragraph..." /></FieldGroup>
      </>}

      {slide.type === 'image-right' && <>
        <FieldGroup label="Subtitle"><TextInput value={slide.subtitle} onChange={v => upd({ subtitle: v })} placeholder="Subtitle" /></FieldGroup>
        <FieldGroup label="Title"><TextInput value={slide.title} onChange={v => upd({ title: v })} multiline placeholder="Content title" /></FieldGroup>
        <FieldGroup label="Body"><TextInput value={slide.body} onChange={v => upd({ body: v })} multiline placeholder="Body text..." /></FieldGroup>
        <FieldGroup label="Image URL"><TextInput value={slide.imageUrl} onChange={v => upd({ imageUrl: v })} placeholder="https://... or /deck/..." /></FieldGroup>
      </>}

      {slide.type === 'statement' && <>
        <FieldGroup label="Label"><TextInput value={slide.label} onChange={v => upd({ label: v })} placeholder="SECTION TITLE" /></FieldGroup>
        <FieldGroup label="Statement"><TextInput value={slide.statement} onChange={v => upd({ statement: v })} multiline placeholder="Write a longer statement here." /></FieldGroup>
      </>}

      {slide.type === 'content-split' && <>
        <FieldGroup label="Title"><TextInput value={slide.title} onChange={v => upd({ title: v })} multiline placeholder="Content title" /></FieldGroup>
        <FieldGroup label="Body"><TextInput value={slide.body} onChange={v => upd({ body: v })} multiline placeholder="Main paragraph..." /></FieldGroup>
        <FieldGroup label="Second paragraph"><TextInput value={slide.body2 ?? ''} onChange={v => upd({ body2: v })} multiline placeholder="Optional second paragraph..." /></FieldGroup>
      </>}

      {slide.type === 'quote' && <>
        <FieldGroup label="Label"><TextInput value={slide.label} onChange={v => upd({ label: v })} placeholder="CUSTOMER VOICE · COMPANY" /></FieldGroup>
        <FieldGroup label="Quote"><TextInput value={slide.quote} onChange={v => upd({ quote: v })} multiline placeholder='"Write the quote here."' /></FieldGroup>
        <FieldGroup label="Attribution"><TextInput value={slide.attribution} onChange={v => upd({ attribution: v })} placeholder="Name, Company" /></FieldGroup>
      </>}

      {slide.type === 'two-column' && <>
        <FieldGroup label="Title"><TextInput value={slide.title} onChange={v => upd({ title: v })} placeholder="Content title" /></FieldGroup>
        <FieldGroup label="Image URL"><TextInput value={slide.imageUrl} onChange={v => upd({ imageUrl: v })} placeholder="https://... or /deck/..." /></FieldGroup>
        <FieldGroup label="Column 1"><TextInput value={slide.col1} onChange={v => upd({ col1: v })} multiline placeholder="First column..." /></FieldGroup>
        <FieldGroup label="Column 2"><TextInput value={slide.col2} onChange={v => upd({ col2: v })} multiline placeholder="Second column..." /></FieldGroup>
      </>}
    </div>
  );
}

// ─── Template picker modal ────────────────────────────────────────────────────

function TemplatePicker({ onPick, onClose, mode = 'add' }: { onPick: (type: SlideType) => void; onClose: () => void; mode?: 'add' | 'change' }) {
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={onClose}>
      <div style={{ background: '#fff', borderRadius: 10, padding: '24px', width: 560, fontFamily: FONT, boxShadow: '0 16px 48px rgba(0,0,0,0.2)' }} onClick={e => e.stopPropagation()}>
        <div style={{ fontSize: 16, fontWeight: 600, color: '#242424', marginBottom: 16 }}>{mode === 'change' ? 'Change slide layout' : 'Slide layouts'}</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {(Object.keys(TEMPLATES) as SlideType[]).map(type => {
            const PREVIEW_W = 248;
            const PREVIEW_H = 139.5;
            const SCALE = PREVIEW_W / 1000;
            const preview = makeSlide(type);
            return (
              <button key={type} onClick={() => onPick(type)} style={{ background: 'none', border: '2px solid #e0e0e0', borderRadius: 8, padding: 0, cursor: 'pointer', textAlign: 'left', overflow: 'hidden', transition: 'border-color 0.15s' }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = '#0f6cbd')}
                onMouseLeave={e => (e.currentTarget.style.borderColor = '#e0e0e0')}
              >
                <div style={{ width: PREVIEW_W, height: PREVIEW_H, overflow: 'hidden', pointerEvents: 'none' }}>
                  <div style={{ width: PREVIEW_W / SCALE, height: PREVIEW_H / SCALE, transform: `scale(${SCALE})`, transformOrigin: '0 0' }}>
                    <SlideRenderer slide={preview} />
                  </div>
                </div>
                <div style={{ padding: '6px 10px', fontSize: 11, fontWeight: 600, color: '#242424', borderTop: '1px solid #f0f0f0' }}>{TEMPLATES[type].label}</div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── Fullscreen presenter ─────────────────────────────────────────────────────

function Presenter({ slides, onClose }: { slides: Slide[]; onClose: () => void }) {
  const [current, setCurrent] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isFs, setIsFs] = useState(false);

  const go = useCallback((dir: 1 | -1) => setCurrent(c => Math.max(0, Math.min(slides.length - 1, c + dir))), [slides.length]);

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') { e.preventDefault(); go(1); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); go(-1); }
      if (e.key === 'Escape') { if (document.fullscreenElement) document.exitFullscreen(); else onClose(); }
      if (e.key === 'f' || e.key === 'F') containerRef.current?.requestFullscreen?.();
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [go, onClose]);

  useEffect(() => {
    const h = () => setIsFs(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', h);
    return () => document.removeEventListener('fullscreenchange', h);
  }, []);

  const isQuote = slides[current]?.type === 'quote';
  const hudColor = isQuote ? 'rgba(246,243,241,0.6)' : 'rgba(51,48,46,0.5)';
  const hudBg = isQuote ? 'rgba(246,243,241,0.12)' : 'rgba(51,48,46,0.08)';

  return (
    <div id="deck-presenter" ref={containerRef} style={{ position: 'fixed', inset: 0, background: '#000', zIndex: 900, fontFamily: FONT, overflow: 'hidden' }}>
      {/* Close (when not fullscreen) */}
      {!isFs && (
        <button onClick={onClose} style={{ position: 'absolute', top: 16, right: 16, background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: 6, color: '#fff', fontSize: 12, padding: '6px 14px', cursor: 'pointer', fontFamily: FONT, zIndex: 10 }}>
          ✕ Close
        </button>
      )}

      {/* Slide — centred, letterboxed 16:9 */}
      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: slides[current]?.type === 'quote' ? DARK_BG : '#f0efed' }}>
        <div style={{
          width: '100vw',
          height: '56.25vw',  /* 16:9 */
          maxHeight: '100vh',
          maxWidth: 'calc(100vh * 16 / 9)',
          position: 'relative',
          overflow: 'hidden',
        }}>
          {slides[current] && <SlideRenderer slide={slides[current]} />}
        </div>
      </div>

      {/* HUD */}
      <div style={{ position: 'fixed', bottom: 22, left: 0, right: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, zIndex: 20, pointerEvents: 'none' }}>
        <button onClick={() => go(-1)} disabled={current === 0} style={{ pointerEvents: 'auto', width: 32, height: 32, borderRadius: '50%', border: 'none', cursor: 'pointer', background: hudBg, color: hudColor, fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: current === 0 ? 0.2 : 1, backdropFilter: 'blur(6px)' }}>←</button>
        <div style={{ display: 'flex', gap: 5, pointerEvents: 'auto' }}>
          {slides.map((_, i) => (
            <button key={i} onClick={() => setCurrent(i)} style={{ width: i === current ? 18 : 6, height: 6, borderRadius: 3, border: 'none', cursor: 'pointer', padding: 0, background: i === current ? (isQuote ? '#f6f3f1' : '#33302e') : (isQuote ? 'rgba(246,243,241,0.25)' : 'rgba(51,48,46,0.2)'), transition: 'width 0.25s, background 0.25s' }} />
          ))}
        </div>
        <button onClick={() => go(1)} disabled={current === slides.length - 1} style={{ pointerEvents: 'auto', width: 32, height: 32, borderRadius: '50%', border: 'none', cursor: 'pointer', background: hudBg, color: hudColor, fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: current === slides.length - 1 ? 0.2 : 1, backdropFilter: 'blur(6px)' }}>→</button>
      </div>

      {/* Fullscreen toggle */}
      <button onClick={() => document.fullscreenElement ? document.exitFullscreen() : containerRef.current?.requestFullscreen?.()} style={{ position: 'fixed', bottom: 22, left: 22, width: 32, height: 32, borderRadius: '50%', border: 'none', cursor: 'pointer', background: hudBg, color: hudColor, fontSize: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(6px)', zIndex: 20 }}>{isFs ? '⊡' : '⛶'}</button>

      <div style={{ position: 'fixed', bottom: 22, right: 22, fontSize: 10, fontWeight: 600, letterSpacing: '0.12em', color: hudColor }}>{current + 1} / {slides.length}</div>
    </div>
  );
}

// ─── Persistence ─────────────────────────────────────────────────────────────

const STORAGE_KEY = 'connector-admin:decks';

interface SavedDeck { name: string; slides: Slide[]; updatedAt: string }

function loadDecks(): Record<string, SavedDeck> {
  if (typeof window === 'undefined') return {};
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}'); } catch { return {}; }
}

function saveDeck(name: string, slides: Slide[]) {
  if (typeof window === 'undefined') return;
  try {
    const all = loadDecks();
    all[name] = { name, slides, updatedAt: new Date().toISOString() };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  } catch { /* quota exceeded — ignore */ }
}

function listSavedDecks(): SavedDeck[] {
  return Object.values(loadDecks()).sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}
void listSavedDecks; // keep for future use

// ─── Main Editor ──────────────────────────────────────────────────────────────

function DeckEditorInner() {
  const params = useSearchParams();
  const initialName = params.get('name') ?? 'Validation 29 April';
  const conceptName = params.get('concept');

  const preset = params.get('preset');
  const getDefaultSlides = (): Slide[] => {
    if (preset && PRESETS[preset]) return makePresetSlides(preset);
    if (conceptName) {
      return [
        { id: makeId(), type: 'hero', label: 'MAC BOILERPLATE · BY COPILOT CONNECTORS TEAM', title: initialName },
        { id: makeId(), type: 'content-split', title: 'Why\nBoilerplate', body: 'Move from setup → real design impact', body2: '· Real product material — not throwaway prototypes\n· Production-ready UI: components, tokens, micro-interactions\n· Screens → code, seamlessly\n· Natural language → production-ready designs\n· PMs, designers, and engineers building together' },
      ];
    }
    return INITIAL_SLIDES;
  };

  const [slides, setSlides] = useState<Slide[]>(getDefaultSlides);
  const [selectedId, setSelectedId] = useState<string>(() => slides[0].id);

  // Restore from localStorage after mount to avoid SSR/client hydration mismatch
  useEffect(() => {
    const EXPECTED = INITIAL_SLIDES.length;
    const saved = loadDecks()[initialName];
    if (saved?.slides?.length && saved.slides.length >= EXPECTED) {
      setSlides(saved.slides);
      setSelectedId(saved.slides[0].id);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const [showPicker, setShowPicker] = useState<'add' | 'change' | null>(null);
  const [presenting, setPresenting] = useState(false);
  const [deckTitle, setDeckTitle] = useState(initialName);
  const [savedIndicator, setSavedIndicator] = useState(false);

  const selectedSlide = slides.find(s => s.id === selectedId) ?? slides[0];

  const addSlide = (type: SlideType) => {
    const newSlide = makeSlide(type);
    const idx = slides.findIndex(s => s.id === selectedId);
    const next = [...slides];
    next.splice(idx + 1, 0, newSlide);
    setSlides(next);
    setSelectedId(newSlide.id);
    setShowPicker(null);
  };

  const changeTemplate = (type: SlideType) => {
    const defaults = TEMPLATES[type].defaultSlide as Omit<Slide, 'id'>;
    setSlides(s => s.map(sl => sl.id === selectedId ? { ...defaults, id: sl.id } as Slide : sl));
    setShowPicker(null);
  };

  const deleteSlide = (id: string) => {
    if (slides.length <= 1) return;
    const idx = slides.findIndex(s => s.id === id);
    const next = slides.filter(s => s.id !== id);
    setSlides(next);
    setSelectedId(next[Math.min(idx, next.length - 1)].id);
  };

  const updateSlide = (updated: Slide) => {
    setSlides(s => s.map(sl => sl.id === updated.id ? updated : sl));
  };

  // Auto-save to localStorage on every change (debounced 600ms)
  useEffect(() => {
    const t = setTimeout(() => {
      saveDeck(deckTitle, slides);
      setSavedIndicator(true);
      setTimeout(() => setSavedIndicator(false), 1800);
    }, 600);
    return () => clearTimeout(t);
  }, [slides, deckTitle]);

  // Keyboard nav in editor (arrow keys when no input focused)
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        const idx = slides.findIndex(s => s.id === selectedId);
        if (idx < slides.length - 1) setSelectedId(slides[idx + 1].id);
      }
      if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        const idx = slides.findIndex(s => s.id === selectedId);
        if (idx > 0) setSelectedId(slides[idx - 1].id);
      }
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [slides, selectedId]);

  const COL_LEFT = 196;
  const TOP_BAR = 48;

  return (
    <div style={{ width: '100vw', height: '100vh', display: 'flex', flexDirection: 'column', fontFamily: FONT, background: '#f3f3f3', overflow: 'hidden' }}>

      {/* Top bar */}
      <div style={{ height: TOP_BAR, background: '#fff', borderBottom: '1px solid #e8e8e8', display: 'flex', alignItems: 'center', padding: '0 16px', gap: 12, flexShrink: 0 }}>
        <a href="/deck/actionable-errors" style={{ fontSize: 12, color: '#605e5c', textDecoration: 'none', padding: '4px 8px', borderRadius: 4, border: '1px solid #e0e0e0' }}>← Back</a>
        <input
          value={deckTitle}
          onChange={e => setDeckTitle(e.target.value)}
          style={{ flex: 1, fontSize: 14, fontWeight: 500, color: '#242424', border: 'none', background: 'transparent', outline: 'none', fontFamily: FONT }}
        />
        {savedIndicator && (
          <span style={{ fontSize: 11, color: '#107c10', fontWeight: 500, opacity: 1, transition: 'opacity 0.4s' }}>✓ Saved</span>
        )}
        <button
          onClick={() => { document.documentElement.requestFullscreen?.().catch(() => {}); setPresenting(true); }}
          style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 16px', background: '#0f6cbd', border: 'none', borderRadius: 6, fontSize: 13, color: '#fff', cursor: 'pointer', fontFamily: FONT, fontWeight: 600 }}
        >
          ▶ Present
        </button>
      </div>

      {/* Body */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>

        {/* Left: slide list */}
        <div style={{ width: COL_LEFT, background: '#f8f8f8', borderRight: '1px solid #e8e8e8', flexShrink: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div style={{ flex: 1, overflowY: 'auto', padding: '12px 14px' }}>
            {slides.map((slide, i) => (
              <Thumbnail
                key={slide.id}
                slide={slide}
                index={i}
                selected={slide.id === selectedId}
                onClick={() => setSelectedId(slide.id)}
                onDelete={() => deleteSlide(slide.id)}
                onChangeTemplate={() => { setSelectedId(slide.id); setShowPicker('change'); }}
              />
            ))}
          </div>
          {/* Claude note — pinned to bottom, never overlaps thumbnails */}
          <div style={{ padding: '10px 14px', borderTop: '1px solid #e8e8e8', fontSize: 11, color: '#aaa', lineHeight: 1.5, fontFamily: FONT, flexShrink: 0 }}>
            Ask Claude to add or edit slides in this chat.
          </div>
        </div>

        {/* Center: preview */}
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, background: '#e8e8e8', overflow: 'hidden' }}>
          <div style={{ width: '100%', maxWidth: 'min(100%, calc((100vh - 120px) * 16/9))', aspectRatio: '16/9', borderRadius: 32, overflow: 'hidden', boxShadow: '0 4px 24px rgba(0,0,0,0.18)' }}>
            {selectedSlide && <SlideRenderer slide={selectedSlide} />}
          </div>
        </div>
      </div>

      {/* Template picker modal */}
      {showPicker && (
        <TemplatePicker
          mode={showPicker}
          onPick={showPicker === 'change' ? changeTemplate : addSlide}
          onClose={() => setShowPicker(null)}
        />
      )}

      {/* Fullscreen presenter */}
      {presenting && <Presenter slides={slides} onClose={() => setPresenting(false)} />}
    </div>
  );
}

export default function DeckEditorPage() {
  return (
    <Suspense fallback={null}>
      <DeckEditorInner />
    </Suspense>
  );
}
