'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useEffect, useRef, useState, useCallback } from 'react';

const font = '"Segoe UI", -apple-system, sans-serif';

export const TOUR_STEPS = [
  {
    n: 1,
    tag: '1 OF 4',
    title: 'Error surfaces proactively',
    rationale: 'The connections page shows "Action required" — the admin arrives here directly from the email notification, already knowing which connector needs attention.',
    targetAttr: 'connector-row-azure-devops',
    nextClickAttr: 'connector-row-azure-devops', // click the Action required button to open panel
  },
  {
    n: 2,
    tag: '2 OF 4',
    title: 'Plain language. Not raw codes.',
    rationale: 'The edit panel opens on the right. Navigate to the Error tab to see what went wrong in plain language — not raw error codes.',
    targetAttr: 'error-tab',
    nextClickAttr: 'error-tab', // click the Error tab
  },
  {
    n: 3,
    tag: '3 OF 4',
    title: 'Guided resolution. Both sides.',
    rationale: 'Root cause explained in plain language. Step-by-step actions shown for both the MAC connector settings and the 3P system side. Admin fixes without leaving the page.',
    targetAttr: 'error-content',
    nextClickAttr: null,
  },
  {
    n: 4,
    tag: '4 OF 4',
    title: 'Error cleared. Loop closed.',
    rationale: 'After fixing and syncing, the connector returns to healthy status. If the error recurs, the system detects it automatically and sends a new notification.',
    targetAttr: null,
    nextClickAttr: null,
  },
];

type Placement = 'top' | 'bottom' | 'left' | 'right';

interface BubblePos {
  top: number;
  left: number;
  placement: Placement;
  arrowLeft?: number;
  arrowTop?: number;
}

const BUBBLE_W = 300;
const BUBBLE_H_EST = 160; // rough estimate for placement calculation
const ARROW = 8; // arrow size

function calcPosition(rect: DOMRect): BubblePos {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const margin = 12;

  const elementCenterX = rect.left + rect.width / 2;
  const isRightSide = elementCenterX > vw * 0.55;

  // If element is on the right side of the screen, prefer left placement
  if (isRightSide && rect.left - BUBBLE_W - ARROW - margin > margin) {
    const top = Math.min(Math.max(rect.top + rect.height / 2 - BUBBLE_H_EST / 2, margin), vh - BUBBLE_H_EST - margin);
    return {
      top,
      left: rect.left - BUBBLE_W - ARROW - margin,
      placement: 'left',
      arrowTop: rect.top + rect.height / 2 - top,
    };
  }

  // Prefer below, then above, then right, then left
  if (rect.bottom + BUBBLE_H_EST + ARROW + margin < vh) {
    const left = Math.min(Math.max(elementCenterX - BUBBLE_W / 2, margin), vw - BUBBLE_W - margin);
    return { top: rect.bottom + ARROW + margin, left, placement: 'bottom', arrowLeft: elementCenterX - left };
  }
  if (rect.top - BUBBLE_H_EST - ARROW - margin > 0) {
    const left = Math.min(Math.max(elementCenterX - BUBBLE_W / 2, margin), vw - BUBBLE_W - margin);
    return { top: rect.top - BUBBLE_H_EST - ARROW - margin, left, placement: 'top', arrowLeft: elementCenterX - left };
  }
  if (rect.right + BUBBLE_W + ARROW + margin < vw) {
    const top = Math.min(Math.max(rect.top + rect.height / 2 - BUBBLE_H_EST / 2, margin), vh - BUBBLE_H_EST - margin);
    return { top, left: rect.right + ARROW + margin, placement: 'right', arrowTop: rect.top + rect.height / 2 - top };
  }
  const top = Math.min(Math.max(rect.top + rect.height / 2 - BUBBLE_H_EST / 2, margin), vh - BUBBLE_H_EST - margin);
  return { top, left: rect.left - BUBBLE_W - ARROW - margin, placement: 'left', arrowTop: rect.top + rect.height / 2 - top };
}

export default function TourOverlay() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const tourParam = searchParams.get('tour');
  const stepN = tourParam ? parseInt(tourParam, 10) : null;
  const step = stepN ? TOUR_STEPS.find(s => s.n === stepN) : null;

  const [collapsed, setCollapsed] = useState(false);
  const [exited, setExited] = useState(false);
  const [bubblePos, setBubblePos] = useState<BubblePos | null>(null);
  const [dragPos, setDragPos] = useState<{ x: number; y: number } | null>(null);
  const bubbleRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const dragOffset = useRef({ x: 0, y: 0 });

  // Reset collapsed state and drag position when step changes
  useEffect(() => { setCollapsed(false); setDragPos(null); }, [stepN]);

  // Drag handlers
  const onMouseDown = useCallback((e: React.MouseEvent) => {
    if (!bubbleRef.current) return;
    dragging.current = true;
    const rect = bubbleRef.current.getBoundingClientRect();
    dragOffset.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    e.preventDefault();
  }, []);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!dragging.current) return;
      setDragPos({ x: e.clientX - dragOffset.current.x, y: e.clientY - dragOffset.current.y });
    };
    const onUp = () => { dragging.current = false; };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => { window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp); };
  }, []);

  // Inject global keyframes once into <head>
  useEffect(() => {
    const STYLE_ID = '__tour_styles__';
    if (!document.getElementById(STYLE_ID)) {
      const s = document.createElement('style');
      s.id = STYLE_ID;
      s.textContent = `
        @keyframes tourPulse {
          0%   { transform: scale(0.5); opacity: 0.8; }
          70%  { transform: scale(2.8); opacity: 0; }
          100% { transform: scale(0.5); opacity: 0; }
        }
        [data-tour-active="true"] {
          position: relative !important;
          z-index: 9999998 !important;
        }
      `;
      document.head.appendChild(s);
    }
    return () => { document.getElementById('__tour_styles__')?.remove(); };
  }, []);

  // Spotlight the target element + inject pulsating dot + compute bubble position
  useEffect(() => {
    if (!step?.targetAttr) {
      setBubblePos(null);
      return;
    }
    const PULSE_ID = '__tour_pulse__';
    const targetAttr = step.targetAttr;
    const nextStepN = TOUR_STEPS.find(s => s.n === step.n + 1)?.n ?? null;

    let targetEl: HTMLElement | null = null;
    let rafId: number;
    let intervalId: ReturnType<typeof setInterval>;
    let active = true;

    const handleTargetClick = () => {
      if (nextStepN) router.replace(`${pathname}?tour=${nextStepN}`);
    };

    const attachDot = (el: HTMLElement) => {
      targetEl = el;
      el.setAttribute('data-tour-active', 'true');
      el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      el.addEventListener('click', handleTargetClick);

      // For error-tab, find the "Actions" button inside the pivot for positioning
      const dotAnchor: HTMLElement =
        targetAttr === 'error-tab'
          ? (Array.from(el.querySelectorAll('button')).find(b => b.textContent?.trim().startsWith('Actions')) as HTMLElement ?? el)
          : el;

      const rect = dotAnchor.getBoundingClientRect();
      setBubblePos(calcPosition(rect));

      document.getElementById(PULSE_ID)?.remove();
      const dot = document.createElement('div');
      dot.id = PULSE_ID;
      dot.style.cssText = `
        position: fixed;
        width: 20px; height: 20px;
        border-radius: 50%;
        background: #0078d4;
        z-index: 10000000;
        pointer-events: none;
        animation: tourPulse 1.4s ease-out infinite;
      `;
      document.body.appendChild(dot);

      const track = () => {
        if (!active) return;
        const r = dotAnchor.getBoundingClientRect();
        dot.style.top = `${r.top + r.height / 2 - 10}px`;
        dot.style.left = `${r.left + r.width / 2 - 10}px`;
        rafId = requestAnimationFrame(track);
      };
      track();
    };

    // Poll every 200ms until element appears (up to 4s)
    let attempts = 0;
    intervalId = setInterval(() => {
      attempts++;
      const el = document.querySelector(`[data-tour="${targetAttr}"]`) as HTMLElement | null;
      if (el) {
        clearInterval(intervalId);
        attachDot(el);
      } else if (attempts > 20) {
        clearInterval(intervalId);
      }
    }, 200);

    return () => {
      active = false;
      clearInterval(intervalId);
      cancelAnimationFrame(rafId);
      targetEl?.removeEventListener('click', handleTargetClick);
      document.querySelectorAll('[data-tour-active]').forEach(e => e.removeAttribute('data-tour-active'));
      const existingDot = document.getElementById(PULSE_ID) as any;
      existingDot?.remove();
      setBubblePos(null);
    };
  }, [step?.targetAttr, step?.n, router, pathname]);

  const go = useCallback((n: number | null, fromStep?: typeof TOUR_STEPS[0]) => {
    // If moving forward and current step has a click action, trigger it first
    if (n && fromStep?.nextClickAttr) {
      const el = document.querySelector(`[data-tour="${fromStep.nextClickAttr}"]`) as HTMLElement | null;
      el?.click();
    }
    if (!n) router.replace(pathname);
    else router.replace(`${pathname}?tour=${n}`);
  }, [router, pathname]);

  if (!step) return null;

  const prev = TOUR_STEPS.find(s => s.n === stepN! - 1) ?? null;
  const next = TOUR_STEPS.find(s => s.n === stepN! + 1) ?? null;

  // ── Collapsed state: floating icon button fixed top-right ─────────────────
  if (collapsed) {
    return (
      <button
        onClick={() => setCollapsed(false)}
        title="Open tour annotation"
        style={{
          position: 'fixed', zIndex: 9999999,
          bottom: 24, left: 24,
          width: 40, height: 40,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #0078d4 0%, #00a4ef 100%)',
          border: 'none',
          cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 0 8px 3px #f2502260, 0 0 16px 5px #00a4ef60, 0 0 24px 7px #7fba0060, 0 0 32px 9px #ffb90060',
          fontFamily: font,
        }}
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="10" cy="10" r="9" stroke="white" strokeWidth="1.5" fill="none"/>
          <text x="10" y="14.5" textAnchor="middle" fontSize="12" fontWeight="700" fill="white" fontFamily="Segoe UI, sans-serif">i</text>
        </svg>
      </button>
    );
  }

  // ── Position: dragged > coach mark > fallback ─────────────────────────────
  const posStyle: React.CSSProperties = dragPos
    ? { top: dragPos.y, left: dragPos.x }
    : bubblePos
      ? { top: bubblePos.top, left: bubblePos.left }
      : { bottom: 24, left: 24 };

  // No arrow when dragged away from target
  const placement = dragPos ? null : (bubblePos?.placement ?? null);

  // Arrow styles (only when coach mark positioned, not when dragged)
  const arrowStyle = ((): React.CSSProperties => {
    if (!placement) return { display: 'none' };
    const base: React.CSSProperties = {
      position: 'absolute',
      width: 0, height: 0,
      pointerEvents: 'none',
    };
    const arrowLeft = bubblePos?.arrowLeft ?? BUBBLE_W / 2;
    const arrowTop = bubblePos?.arrowTop ?? BUBBLE_H_EST / 2;
    if (placement === 'bottom') return { ...base, top: -ARROW, left: Math.max(8, Math.min(arrowLeft - ARROW, BUBBLE_W - 24)), borderLeft: `${ARROW}px solid transparent`, borderRight: `${ARROW}px solid transparent`, borderBottom: `${ARROW}px solid #0f1923` };
    if (placement === 'top') return { ...base, bottom: -ARROW, left: Math.max(8, Math.min(arrowLeft - ARROW, BUBBLE_W - 24)), borderLeft: `${ARROW}px solid transparent`, borderRight: `${ARROW}px solid transparent`, borderTop: `${ARROW}px solid #12263a` };
    if (placement === 'right') return { ...base, left: -ARROW, top: Math.max(8, arrowTop - ARROW), borderTop: `${ARROW}px solid transparent`, borderBottom: `${ARROW}px solid transparent`, borderRight: `${ARROW}px solid #0f1923` };
    return { ...base, right: -ARROW, top: Math.max(8, arrowTop - ARROW), borderTop: `${ARROW}px solid transparent`, borderBottom: `${ARROW}px solid transparent`, borderLeft: `${ARROW}px solid #12263a` };
  })();

  // Inner arrow (white fill, slightly inset)
  const arrowInnerStyle = ((): React.CSSProperties => {
    const base: React.CSSProperties = { position: 'absolute', width: 0, height: 0, pointerEvents: 'none' };
    if (!placement) return { ...base, display: 'none' };
    const arrowLeft = bubblePos?.arrowLeft ?? BUBBLE_W / 2;
    const arrowTop = bubblePos?.arrowTop ?? BUBBLE_H_EST / 2;
    const innerArrow = ARROW - 1;
    if (placement === 'bottom') return { ...base, display: 'none' };
    if (placement === 'top') return { ...base, display: 'none' };
    if (placement === 'right') return { ...base, display: 'none' };
    return { ...base, display: 'none' };
  })();

  // ── Coach mark bubble ─────────────────────────────────────────────────────
  return (
    <div
      ref={bubbleRef}
      style={{
        position: 'fixed', zIndex: 9999999,
        ...posStyle,
        width: BUBBLE_W,
        background: 'linear-gradient(145deg, #0f1923 0%, #12263a 100%)',
        borderRadius: 12,
        boxShadow: '0 0 0 1px rgba(255,255,255,0.08), 0 8px 32px rgba(0,0,0,0.5), 0 0 0 4px rgba(0,120,212,0.15)',
        border: 'none',
        fontFamily: font,
        userSelect: 'none',
      }}
    >
      {/* Arrow */}
      <div style={arrowStyle} />
      <div style={arrowInnerStyle} />

      {/* Header — drag handle */}
      <div onMouseDown={onMouseDown} style={{ cursor: 'grab', padding: '10px 14px 6px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <span style={{ fontSize: 9, color: '#479ef5', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
          {step.tag}
        </span>
        <button onClick={() => setCollapsed(true)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', fontSize: 14, cursor: 'pointer', padding: '0 2px', lineHeight: 1 }}>✕</button>
      </div>

      {/* Body */}
      <div style={{ padding: '2px 14px 14px' }}>
        <p style={{ margin: '0 0 6px', fontSize: 13, fontWeight: 600, color: '#ffffff', lineHeight: 1.35 }}>
          {step.title}
        </p>
        <p style={{ margin: 0, fontSize: 12, color: 'rgba(255,255,255,0.6)', lineHeight: 1.6 }}>
          {step.rationale}
        </p>
      </div>

      {/* Divider */}
      <div style={{ height: 1, background: 'rgba(255,255,255,0.08)', margin: '0 14px' }} />

      {/* Footer nav */}
      <div style={{ display: 'flex', alignItems: 'center', padding: '10px 14px', gap: 6 }}>
        <button
          onClick={() => go(prev?.n ?? null)}
          disabled={!prev}
          style={{
            flex: '0 0 auto', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: 6, color: prev ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.25)',
            fontSize: 11, fontWeight: 600, cursor: prev ? 'pointer' : 'default',
            padding: '5px 12px', fontFamily: font,
          }}
        >← Back</button>
        <span style={{ flex: 1, textAlign: 'center', fontSize: 10, color: 'rgba(255,255,255,0.3)' }}>
          {stepN} / {TOUR_STEPS.length}
        </span>
        {next ? (
          <button onClick={() => go(next.n, step)} style={{ flex: '0 0 auto', background: '#0078d4', border: 'none', borderRadius: 6, color: '#fff', fontSize: 11, fontWeight: 600, cursor: 'pointer', padding: '5px 12px', fontFamily: font }}>
            Next →
          </button>
        ) : (
          <button onClick={() => go(null)} style={{ flex: '0 0 auto', background: '#107c10', border: 'none', borderRadius: 6, color: '#fff', fontSize: 11, fontWeight: 600, cursor: 'pointer', padding: '5px 12px', fontFamily: font }}>
            Done ✓
          </button>
        )}
      </div>
    </div>
  );
}
