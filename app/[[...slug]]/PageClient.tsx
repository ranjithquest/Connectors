'use client';
import { useRef, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Persona, PersonaSize } from '@fluentui/react';

const CARDS = [
  {
    key: 'health',
    depth: 1.0,
    pos: { top: '8%', right: '3%' },
    width: 230,
    content: (
      <div className="flex flex-col gap-2 p-3">
        <div className="flex items-center justify-between">
          <span className="text-[12px] font-semibold text-[#242424]">Connector health</span>
          <span className="text-[10px] font-semibold text-white bg-[#107c10] px-1.5 py-0.5 rounded-full">Healthy</span>
        </div>
        <div className="flex flex-col gap-1.5">
          {[['Items ingested', '1,204,330'], ['Last crawl', '2 hours ago'], ['Active users', '842']].map(([label, val]) => (
            <div key={label} className="flex items-center justify-between">
              <span className="text-[11px] text-[#616161]">{label}</span>
              <span className="text-[11px] font-semibold text-[#242424]">{val}</span>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    key: 'activity',
    depth: 0.55,
    pos: { top: '42%', right: '24%' },
    width: 210,
    content: (
      <div className="flex flex-col gap-2 p-3">
        <span className="text-[12px] font-semibold text-[#242424]">Recent activity</span>
        <div className="flex flex-col gap-1.5">
          {[
            { dot: '#0078d4', text: 'Crawl completed' },
            { dot: '#107c10', text: 'Schema validated' },
            { dot: '#ffb900', text: 'Warning: 3 errors' },
          ].map(({ dot, text }) => (
            <div key={text} className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: dot }} />
              <span className="text-[11px] text-[#323130]">{text}</span>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    key: 'action',
    depth: 0.28,
    pos: { bottom: '8%', right: '5%' },
    width: 196,
    content: (
      <div className="flex items-start gap-2.5 p-3">
        <div className="w-8 h-8 rounded bg-[#eff6fc] flex items-center justify-center shrink-0">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M8 1.5a6.5 6.5 0 1 1 0 13 6.5 6.5 0 0 1 0-13zm0 5.25a.75.75 0 0 0-.75.75v3.25a.75.75 0 0 0 1.5 0V7.5A.75.75 0 0 0 8 6.75zm0-2.5a.875.875 0 1 0 0 1.75.875.875 0 0 0 0-1.75z" fill="#0078d4" />
          </svg>
        </div>
        <div className="min-w-0">
          <p className="text-[12px] font-semibold text-[#242424] leading-4">Recommended action</p>
          <p className="text-[11px] text-[#616161] leading-4 mt-0.5">Enable incremental crawls to reduce load.</p>
        </div>
      </div>
    ),
  },
];

function ParallaxBanner() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  const onMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = wrapRef.current?.getBoundingClientRect();
    if (!rect) return;
    const mx = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const my = ((e.clientY - rect.top) / rect.height - 0.5) * 2;

    if (rafRef.current !== null) return;
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null;
      cardRefs.current.forEach((el, i) => {
        if (!el) return;
        const d = CARDS[i].depth;
        el.style.transform = `translate(${mx * 30 * d}px, ${my * 18 * d}px)`;
      });
    });
  }, []);

  const onMouseLeave = useCallback(() => {
    cardRefs.current.forEach((el) => {
      if (el) el.style.transform = 'translate(0px, 0px)';
    });
  }, []);

  return (
    <div
      ref={wrapRef}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      className="rounded-2xl overflow-hidden relative select-none cursor-default"
      style={{ height: 340 }}
    >
      {/* Background image */}
      <img
        src="/fluent-banner.webp"
        alt=""
        className="absolute inset-0 w-full h-full object-cover"
        draggable={false}
      />
      {/* Subtle overlay so cards read clearly */}
      <div className="absolute inset-0" style={{ background: 'rgba(255,255,255,0.08)' }} />

      {/* Floating cards */}
      {CARDS.map((card, i) => (
        <div
          key={card.key}
          ref={(el) => { cardRefs.current[i] = el; }}
          className="absolute"
          style={{
            ...card.pos,
            width: card.width,
            transition: 'transform 0.14s cubic-bezier(0.22,0.61,0.36,1)',
            willChange: 'transform',
            zIndex: Math.round(card.depth * 10),
          }}
        >
          <div
            className="bg-white rounded-[10px]"
            style={{
              boxShadow: `0 ${4 + card.depth * 10}px ${10 + card.depth * 20}px rgba(0,0,0,${0.08 + card.depth * 0.08})`,
            }}
          >
            {card.content}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function BoilerplatePage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string[] | undefined;

  useEffect(() => {
    if (!slug || slug.length === 0) {
      router.replace('/connectors');
    }
  }, [slug, router]);

  if (!slug || slug.length === 0) return null;

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-48px)] px-10 py-12">
      <div className="max-w-3xl w-full">
        <h1 className="text-[40px] font-bold text-[#111] dark:text-[#f5f5f5] mb-4 leading-tight">
          Boilerplate
        </h1>
        <p className="text-[16px] text-[#323130] dark:text-[#adadad] leading-relaxed mb-5 max-w-xl">
          This template was created just for you to quickly prototype. Please connect with the{' '}
          <strong>Connectors Design team</strong> to add any pages on this.
        </p>
        <div className="mb-6 flex items-center gap-4">
          <span className="text-[13px] text-[#605e5c] dark:text-[#adadad]">Contact:</span>
          <Persona text="Ranjith Ravi" size={PersonaSize.size32} hidePersonaDetails={false} />
          <Persona text="Rohan Baruah" size={PersonaSize.size32} hidePersonaDetails={false} />
        </div>
        <ParallaxBanner />
      </div>
    </div>
  );
}
