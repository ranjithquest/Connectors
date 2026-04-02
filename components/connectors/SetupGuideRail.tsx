'use client';

import React, { useState, useRef } from 'react';
import { ChevronDownIcon } from '@fluentui/react-icons-mdl2';

export interface GuideSection {
  id: string;
  title: string;
  defaultOpen?: boolean;
  content: React.ReactNode;
}

interface SetupGuideRailProps {
  sections: GuideSection[];
  activeSection?: string;
  accordionRefsCallback?: (refs: Record<string, HTMLDivElement | null>) => void;
}

// Helper to detect dark mode for inline style overrides
function useDarkMode(): boolean {
  const [dark, setDark] = React.useState(false);
  React.useEffect(() => {
    const mql = window.matchMedia('(prefers-color-scheme: dark)');
    const update = () => setDark(document.documentElement.classList.contains('dark') || mql.matches);
    update();
    const observer = new MutationObserver(update);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    mql.addEventListener('change', update);
    return () => { observer.disconnect(); mql.removeEventListener('change', update); };
  }, []);
  return dark;
}

export default function SetupGuideRail({ sections, activeSection, accordionRefsCallback }: SetupGuideRailProps) {
  const isDark = useDarkMode();
  const [openId, setOpenId] = useState<string | null>(
    activeSection ?? sections.find((s) => s.defaultOpen)?.id ?? null
  );
  const accordionRefs = useRef<Record<string, HTMLDivElement | null>>({});

  React.useEffect(() => {
    if (activeSection) setOpenId(activeSection);
  }, [activeSection]);

  React.useEffect(() => {
    accordionRefsCallback?.(accordionRefs.current);
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {sections.map((s) => {
        const isOpen = openId === s.id;
        const isHighlighted = activeSection === s.id;
        return (
          <React.Fragment key={s.id}>
            <div
              ref={(el) => { accordionRefs.current[s.id] = el; }}
              style={{ display: 'flex', flexDirection: 'column', borderTop: `1px solid ${isHighlighted ? (isDark ? '#479ef5' : '#0078d4') : (isDark ? '#3d3d3d' : '#e1e1e1')}` }}
            >
              <button
                className="flex items-center justify-between w-full h-8 bg-transparent text-left"
                style={{ padding: 0, border: 'none', cursor: 'pointer' }}
                onClick={() => setOpenId(isOpen ? null : s.id)}
              >
                <span
                  style={{
                    fontSize: 13,
                    color: isHighlighted
                      ? (isDark ? '#479ef5' : '#0078d4')
                      : (activeSection && !isHighlighted)
                        ? (isDark ? '#707070' : '#a19f9d')
                        : (isDark ? '#f5f5f5' : '#323130'),
                    fontWeight: isHighlighted || isOpen ? 600 : 400,
                    flex: 1,
                  }}
                >
                  {s.title}
                </span>
                <ChevronDownIcon
                  style={{
                    fontSize: 12,
                    flexShrink: 0,
                    transition: 'transform 0.2s',
                    transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                    color: isHighlighted
                      ? (isDark ? '#479ef5' : '#0078d4')
                      : (activeSection && !isHighlighted)
                        ? (isDark ? '#555555' : '#c8c6c4')
                        : (isDark ? '#adadad' : '#605e5c'),
                  }}
                />
              </button>
            </div>

            {isOpen && s.content && (
              <div>{s.content}</div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
