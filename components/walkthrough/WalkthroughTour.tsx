'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { Stack, Text } from '@fluentui/react';
import { Button } from '@fluentui/react-components';

export type WalkthroughStep = {
  id: string;
  target: string;
  title: string;
  body: string;
  placement?: 'top' | 'bottom' | 'left' | 'right';
};

interface Props {
  steps: WalkthroughStep[];
}

export default function WalkthroughTour({ steps }: Props) {
  const searchParams = useSearchParams();
  const isTour = searchParams?.get('tour') === 'true';

  const [active, setActive] = useState(0);
  const [rect, setRect] = useState<DOMRect | null>(null);
  const [dismissed, setDismissed] = useState(false);

  const updateRect = useCallback(() => {
    if (!isTour || dismissed || steps.length === 0) return;
    const el = document.querySelector(steps[active]?.target);
    if (el) setRect(el.getBoundingClientRect());
  }, [isTour, dismissed, active, steps]);

  useEffect(() => {
    updateRect();
    window.addEventListener('resize', updateRect);
    window.addEventListener('scroll', updateRect, true);
    return () => {
      window.removeEventListener('resize', updateRect);
      window.removeEventListener('scroll', updateRect, true);
    };
  }, [updateRect]);

  if (!isTour || dismissed || steps.length === 0) return null;

  const step = steps[active];
  const placement = step.placement ?? 'bottom';

  // Tooltip position relative to the target element
  const tooltipStyle: React.CSSProperties = { position: 'fixed', zIndex: 9999, width: 280 };
  if (rect) {
    if (placement === 'bottom') { tooltipStyle.top = rect.bottom + 12; tooltipStyle.left = rect.left; }
    else if (placement === 'top') { tooltipStyle.top = rect.top - 148; tooltipStyle.left = rect.left; }
    else if (placement === 'right') { tooltipStyle.top = rect.top; tooltipStyle.left = rect.right + 12; }
    else { tooltipStyle.top = rect.top; tooltipStyle.left = rect.left - 292; }
  } else {
    tooltipStyle.top = '50%'; tooltipStyle.left = '50%'; tooltipStyle.transform = 'translate(-50%, -50%)';
  }

  return (
    <>
      {/* Dimmed overlay */}
      <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 9998, pointerEvents: 'none' }} />

      {/* Highlight ring around target */}
      {rect && (
        <div style={{
          position: 'fixed',
          top: rect.top - 4, left: rect.left - 4,
          width: rect.width + 8, height: rect.height + 8,
          border: '2px solid #0078d4', borderRadius: 6,
          boxShadow: '0 0 0 4px rgba(0,120,212,0.25)',
          zIndex: 9999, pointerEvents: 'none',
        }} />
      )}

      {/* Step number badge on target */}
      {rect && (
        <div style={{
          position: 'fixed',
          top: rect.top - 14, left: rect.left - 14,
          width: 24, height: 24, borderRadius: '50%',
          background: '#0078d4', color: '#fff',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 11, fontWeight: 700, zIndex: 10000,
        }}>
          {active + 1}
        </div>
      )}

      {/* Tooltip card */}
      <div style={{
        ...tooltipStyle,
        background: '#ffffff',
        border: '1px solid #e1e1e1',
        borderRadius: 8,
        boxShadow: '0px 8px 24px rgba(0,0,0,0.18)',
        padding: 16,
        pointerEvents: 'all',
      }}>
        <Stack tokens={{ childrenGap: 6 }}>
          {/* Header */}
          <Stack horizontal horizontalAlign="space-between" verticalAlign="center">
            <Text styles={{ root: { fontSize: 11, color: '#605e5c', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' } }}>
              Step {active + 1} of {steps.length}
            </Text>
            <button
              onClick={() => setDismissed(true)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 16, color: '#605e5c', lineHeight: 1, padding: 0 }}
            >
              ×
            </button>
          </Stack>

          <Text styles={{ root: { fontSize: 14, fontWeight: 600, color: '#323130' } }}>{step.title}</Text>
          <Text styles={{ root: { fontSize: 13, color: '#484644', lineHeight: '18px' } }}>{step.body}</Text>

          {/* Navigation */}
          <Stack horizontal tokens={{ childrenGap: 8 }} styles={{ root: { marginTop: 4 } }}>
            {active > 0 && (
              <Button size="small" appearance="outline" onClick={() => setActive((v) => v - 1)}>Back</Button>
            )}
            {active < steps.length - 1 ? (
              <Button size="small" appearance="primary" onClick={() => setActive((v) => v + 1)}>Next →</Button>
            ) : (
              <Button size="small" appearance="primary" onClick={() => setDismissed(true)}>Done</Button>
            )}
          </Stack>
        </Stack>
      </div>
    </>
  );
}
