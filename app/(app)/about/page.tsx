'use client';

import { useState, useEffect } from 'react';
import {
  SearchBox,
  Dialog, DialogType, DialogFooter, TextField,
} from '@fluentui/react';
import { Button } from '@fluentui/react-components';
import { ChevronDownIcon, ChevronUpIcon } from '@fluentui/react-icons-mdl2';

type NamedLink = { label: string; url: string };

type Feature = {
  name: string;
  branch: string;
  owner: string;
  lastModified: string;
  previewUrl: string | null;
  description?: string;
  decks?: NamedLink[];
  walkthroughs?: NamedLink[];
  needsPublish?: boolean;
};

type LocalBranch = { name: string; needsPublish: boolean };

function toBranchSlug(name: string) {
  return name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function featureNameFromSlug(slug: string): string {
  return slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

const PASTEL_PALETTES: [string, string][] = [
  ['#deeffe', '#0078d4'],
  ['#ede8f5', '#7c4db5'],
  ['#dff6dd', '#107c10'],
  ['#fde7d9', '#c0622a'],
  ['#d0f0f4', '#006e78'],
  ['#f0e6f6', '#a040b8'],
  ['#fffacc', '#8a6e00'],
];

function cardStyle(branch: string): { background: string; patternColor: string } {
  let hash = 0;
  const owner = branch.split('/')[0];
  for (let i = 0; i < owner.length; i++) hash = (hash * 31 + owner.charCodeAt(i)) & 0xffffffff;
  const [bg, accent] = PASTEL_PALETTES[Math.abs(hash) % PASTEL_PALETTES.length];
  return { background: bg, patternColor: accent };
}

function initials(name: string) {
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
}

function FeaturesGrid({ features, currentBranch, ownerSlug, localBranches, search, onSearch, onNewFeature }: { features: Feature[]; currentBranch?: string; ownerSlug?: string; localBranches: LocalBranch[]; search: string; onSearch: (v: string) => void; onNewFeature: () => void }) {
  const [hoveredBranch, setHoveredBranch] = useState<string | null>(null);
  const [expandedBranch, setExpandedBranch] = useState<string | null>(null);

  // Only show the dedicated "Features of your local" section when the user has cloned the repo
  // and is actively working on more than one feature locally. Otherwise (0–1 local branches) the
  // local branch — if any — is folded back into the regular feature grid.
  const showLocalSection = localBranches.length > 1;
  const localBranchNames = localBranches.map(b => b.name);

  const localCards: Feature[] = showLocalSection
    ? localBranches.map(b => {
        const match = features.find(f => f.branch === b.name);
        if (match) return { ...match, needsPublish: b.needsPublish };
        return {
          branch: b.name,
          owner: b.name.includes('/') ? b.name.split('/')[0] : (ownerSlug ?? ''),
          name: featureNameFromSlug(b.name.includes('/') ? b.name.split('/').slice(1).join('/') : b.name),
          lastModified: '',
          previewUrl: null,
          needsPublish: b.needsPublish,
        };
      })
    : [];

  // When the local section is hidden, surface any unpublished current branch in the regular list
  // so the user can still see it.
  const isUnpublished = !showLocalSection && currentBranch && currentBranch !== 'main' && !features.some(f => f.branch === currentBranch) && !localBranchNames.includes(currentBranch);
  const unpublishedCard: Feature | null = isUnpublished ? {
    branch: currentBranch!,
    owner: currentBranch!.split('/')[0],
    name: featureNameFromSlug(currentBranch!.split('/').slice(1).join('/')),
    lastModified: '',
    previewUrl: null,
  } : null;

  // Remote features that aren't already represented in the local section.
  const localBranchSet = new Set(showLocalSection ? localBranchNames : []);
  const remainingFeatures = unpublishedCard ? [unpublishedCard, ...features] : features;
  const remoteOnly = remainingFeatures.filter(f => !localBranchSet.has(f.branch));
  const myCards = remoteOnly.filter(f => ownerSlug && f.owner === ownerSlug);
  const otherCards = remoteOnly.filter(f => !ownerSlug || f.owner !== ownerSlug);


  if (localCards.length === 0 && myCards.length === 0 && otherCards.length === 0) {
    return <p style={{ fontSize: 14, color: '#605e5c', paddingTop: 16 }}>No features found.</p>;
  }

  function renderGrid(cards: Feature[]) {
    return (
      <>
      <style>{`
        .features-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
        @media (max-width: 900px) { .features-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 600px) { .features-grid { grid-template-columns: 1fr; } }
        .feature-tile { display: flex; flex-direction: row; }
        @media (max-width: 600px) { .feature-tile { flex-direction: column; } }
        .feature-thumb { width: 180px; flex-shrink: 0; }
        @media (max-width: 900px) { .feature-thumb { width: 120px; } }
        @media (max-width: 600px) { .feature-thumb { width: 100%; height: 100px; } }
      `}</style>
      <div className="features-grid">
        {cards.map((f, idx) => {
          // TEST ONLY — inject fake decks & walkthroughs on first tile
          if (idx === 0) f = { ...f, decks: [{ label: 'Concept v1', url: '#' }, { label: 'Stakeholder Review', url: '#' }], walkthroughs: [{ label: 'Setup flow', url: '#' }, { label: 'Error resolution', url: '#' }] };
          const isActive = f.branch === currentBranch;
          const isHovered = hoveredBranch === f.branch;
          const isExpanded = expandedBranch === f.branch;
          const { background, patternColor } = cardStyle(f.branch);
          const decks = f.decks ?? [];
          const walkthroughs = f.walkthroughs ?? (f.previewUrl ? [{ label: 'Walkthrough', url: f.previewUrl.replace('/connectors', '/deck') }] : []);
          return (
            <div key={f.branch}
              className="feature-tile"
              onMouseEnter={() => setHoveredBranch(f.branch)}
              onMouseLeave={() => setHoveredBranch(null)}
              style={{
                borderRadius: 8,
                border: isActive ? '2px solid #0078d4' : '1px solid #e1e1e1',
                overflow: 'hidden',
                background: '#fff',
                boxShadow: isActive ? '0 0 0 1px #0078d4' : '0 1px 3px rgba(0,0,0,0.06)',
                minHeight: 96,
              }}>

              {/* Left: thumbnail — directly clickable */}
              <a
                href={isActive ? '/connectors' : (f.previewUrl ?? undefined)}
                target={!isActive && f.previewUrl ? '_blank' : undefined}
                rel="noopener noreferrer"
                onClick={e => { if (!f.previewUrl && !isActive) e.preventDefault(); }}
                className="feature-thumb"
                style={{
                  flexShrink: 0, position: 'relative', display: 'block',
                  background, textDecoration: 'none', overflow: 'hidden',
                  cursor: f.previewUrl || isActive ? 'pointer' : 'default',
                }}
              >
                <div style={{
                  position: 'absolute', inset: 0, pointerEvents: 'none',
                  backgroundImage: `radial-gradient(circle, ${patternColor}28 1.5px, transparent 1.5px)`,
                  backgroundSize: '18px 18px',
                }} />
                {/* Status badge */}
                {isActive && (
                  <span style={{
                    position: 'absolute', top: 8, left: 10,
                    fontSize: 11, fontWeight: 600, color: '#0078d4',
                    background: '#fff', borderRadius: 4, padding: '2px 8px',
                  }}>Active</span>
                )}
                {!f.previewUrl && !isActive && (
                  <span style={{
                    position: 'absolute', top: 8, left: 10,
                    fontSize: 11, fontWeight: 600, color: '#605e5c',
                    background: 'rgba(0,0,0,0.08)', borderRadius: 4, padding: '2px 8px',
                  }}>Not published</span>
                )}
                {/* Hover overlay */}
                {f.previewUrl && isHovered && (
                  <div style={{
                    position: 'absolute', inset: 0,
                    background: 'rgba(0,0,0,0.4)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <span style={{
                      fontSize: 12, fontWeight: 600, color: '#fff',
                      background: 'rgba(255,255,255,0.2)', border: '1.5px solid rgba(255,255,255,0.7)',
                      borderRadius: 6, padding: '5px 12px', backdropFilter: 'blur(4px)',
                    }}>{isActive ? 'Open' : 'Preview'}</span>
                  </div>
                )}
              </a>

              {/* Right: content */}
              <div style={{ flex: 1, padding: '14px 18px', display: 'flex', flexDirection: 'column', gap: 6, minWidth: 0 }}>
                {/* Title + date */}
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                    <span style={{ fontSize: 15, fontWeight: 700, color: '#1b1a19' }}>{f.name}</span>
                    {f.needsPublish && (
                      <span style={{
                        fontSize: 11, fontWeight: 600, color: '#8a6e00',
                        background: '#fff4ce', border: '1px solid #f4e2a0',
                        borderRadius: 4, padding: '1px 8px', lineHeight: '16px',
                      }} title="You have local changes that haven't been published yet. Run /publish in Claude.">
                        Changes not published
                      </span>
                    )}
                  </div>
                  {f.lastModified && (
                    <span style={{ fontSize: 12, color: '#a19f9d', flexShrink: 0 }}>{f.lastModified}</span>
                  )}
                </div>

                {/* Description */}
                {f.description ? (
                  <span style={{ fontSize: 13, color: '#484644', lineHeight: '18px' }}>{f.description}</span>
                ) : (
                  <span style={{ fontSize: 13, color: '#a19f9d', fontStyle: 'italic' }}>No description</span>
                )}

                {/* Bottom row: owner + actions */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 'auto', flexWrap: 'wrap' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div style={{
                      width: 22, height: 22, borderRadius: '50%',
                      background: patternColor,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 9, fontWeight: 700, color: '#fff', flexShrink: 0,
                    }}>{initials(f.owner)}</div>
                    <span style={{ fontSize: 12, color: '#605e5c' }}>{f.owner}</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginLeft: 'auto', flexWrap: 'wrap' }}>
                    {isActive && !f.previewUrl && (
                      <span style={{ fontSize: 12, color: '#605e5c' }}>
                        Run <code style={{ background: '#f3f2f1', borderRadius: 3, padding: '1px 5px' }}>/publish</code> on Claude
                      </span>
                    )}
                    {/* Static count pills */}
                    {decks.length > 0 && (
                      <span style={{ fontSize: 12, fontWeight: 600, color: '#6c4db5', background: '#ede8f5', borderRadius: 4, padding: '3px 10px' }}>
                        📊 {decks.length} Deck{decks.length > 1 ? 's' : ''}
                      </span>
                    )}
                    {walkthroughs.length > 0 && (
                      <span style={{ fontSize: 12, fontWeight: 600, color: '#107c10', background: '#dff6dd', borderRadius: 4, padding: '3px 10px' }}>
                        ▶ {walkthroughs.length} Walkthrough{walkthroughs.length > 1 ? 's' : ''}
                      </span>
                    )}
                    {/* Chevron — visual indicator only */}
                    <span style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      width: 28, height: 28, borderRadius: 4, border: '1px solid #e1e1e1',
                      background: isHovered ? '#f3f2f1' : '#fff',
                      transition: 'background 0.15s',
                    }}>
                      {isHovered
                        ? <ChevronUpIcon style={{ fontSize: 12, color: '#323130' }} />
                        : <ChevronDownIcon style={{ fontSize: 12, color: '#323130' }} />
                      }
                    </span>
                  </div>
                </div>

                {/* Expandable links section — shown on hover */}
                {isHovered && (
                  <div style={{
                    marginTop: 10, paddingTop: 10,
                    borderTop: '1px solid #edebe9',
                    animation: 'slideDown 0.15s ease-out',
                  }}
                  >
                  <style>{`@keyframes slideDown { from { opacity: 0; transform: translateY(-4px); } to { opacity: 1; transform: translateY(0); } }`}</style>
                    {decks.length === 0 && walkthroughs.length === 0 ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                        <span style={{ fontSize: 13, color: '#a19f9d', fontStyle: 'italic' }}>No deck created</span>
                        <button onClick={e => e.stopPropagation()} style={{
                          fontSize: 12, fontWeight: 600, color: '#6c4db5', background: '#ede8f5',
                          border: '1px dashed #b49ad4', borderRadius: 4, padding: '4px 12px', cursor: 'pointer',
                        }}>+ Create deck</button>
                        <button onClick={e => e.stopPropagation()} style={{
                          fontSize: 12, fontWeight: 600, color: '#107c10', background: '#dff6dd',
                          border: '1px dashed #7ec87e', borderRadius: 4, padding: '4px 12px', cursor: 'pointer',
                        }}>+ Create walkthrough</button>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                        {isActive && f.previewUrl && (
                          <a href={f.previewUrl} target="_blank" rel="noopener noreferrer"
                            onClick={e => e.stopPropagation()}
                            style={{
                              fontSize: 12, fontWeight: 600, color: '#0078d4', textDecoration: 'none',
                              background: '#deeffe', borderRadius: 4, padding: '4px 12px',
                              border: '1px solid #b3d7f5',
                            }}>🔗 Preview</a>
                        )}
                        {decks.map((d, i) => (
                          <a key={i} href={d.url} target="_blank" rel="noopener noreferrer"
                            onClick={e => e.stopPropagation()}
                            style={{
                              fontSize: 12, fontWeight: 600, color: '#6c4db5', textDecoration: 'none',
                              background: '#ede8f5', borderRadius: 4, padding: '4px 12px',
                              border: '1px solid #d6ccf0',
                            }}>📊 {d.label}</a>
                        ))}
                        {walkthroughs.map((w, i) => (
                          <a key={i} href={w.url} target="_blank" rel="noopener noreferrer"
                            onClick={e => e.stopPropagation()}
                            style={{
                              fontSize: 12, fontWeight: 600, color: '#107c10', textDecoration: 'none',
                              background: '#dff6dd', borderRadius: 4, padding: '4px 12px',
                              border: '1px solid #bad7ba',
                            }}>▶ {w.label}</a>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
      </>
    );
  }

  const restCards = [...myCards, ...otherCards];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <SearchBox
          placeholder="Search features or people"
          value={search}
          onChange={(_, v) => onSearch(v ?? '')}
          onClear={() => onSearch('')}
          styles={{ root: { width: 280 } }}
        />
        <Button onClick={onNewFeature}>New feature</Button>
      </div>
      {localCards.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <h2 style={{ fontSize: 13, fontWeight: 600, color: '#605e5c', textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0 }}>
            Features on your local
          </h2>
          {renderGrid(localCards)}
        </div>
      )}
      {restCards.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <h2 style={{ fontSize: 13, fontWeight: 600, color: '#605e5c', textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0 }}>
            Published features
          </h2>
          {renderGrid(restCards)}
        </div>
      )}
    </div>
  );
}

export default function AboutPage() {
  const [tab, setTab] = useState<'features' | 'about'>('features');
  const [allFeatures, setAllFeatures] = useState<Feature[]>([]);
  const [loadingBranches, setLoadingBranches] = useState(true);
  const [currentBranch, setCurrentBranch] = useState('');
  const [ownerSlug, setOwnerSlug] = useState('');
  const [localBranches, setLocalBranches] = useState<LocalBranch[]>([]);
  const [search, setSearch] = useState('');
  const [showDialog, setShowDialog] = useState(false);
  const [featureName, setFeatureName] = useState('');
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState('');

  function loadBranches() {
    setLoadingBranches(true);
    const isHosted = typeof window !== 'undefined' && !window.location.hostname.includes('localhost');
    const url = isHosted ? '/branches.json' : '/api/branches/';
    fetch(url)
      .then(r => r.json())
      .then(data => { setAllFeatures(data.features ?? []); setLoadingBranches(false); })
      .catch(() => setLoadingBranches(false));
  }

  useEffect(() => {
    loadBranches();
    const isHosted = typeof window !== 'undefined' && !window.location.hostname.includes('localhost');
    if (!isHosted) {
      fetch('/api/current-branch/').then(r => r.json()).then(d => { setCurrentBranch(d.branch ?? ''); setOwnerSlug(d.ownerSlug ?? ''); }).catch(() => {});
      fetch('/api/local-branches/').then(r => r.json()).then(d => setLocalBranches(d.branches ?? [])).catch(() => {});
    }
  }, []);

  const filtered = allFeatures.filter(f =>
    f.name.toLowerCase().includes(search.toLowerCase()) ||
    f.owner.toLowerCase().includes(search.toLowerCase()) ||
    f.branch.toLowerCase().includes(search.toLowerCase())
  );

  async function handleCreate() {
    if (!featureName.trim()) return;
    setCreating(true);
    setCreateError('');
    try {
      const res = await fetch('/api/branches/create/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: featureName, owner: 'ranjith' }),
      });
      const data = await res.json();
      if (!res.ok) { setCreateError(data.error ?? 'Failed to create branch'); setCreating(false); return; }
      setShowDialog(false);
      setFeatureName('');
      loadBranches();
      alert(`Branch "${data.branch}" created. Check it out in your terminal to start working.`);
    } catch {
      setCreateError('Network error — is the dev server running?');
      setCreating(false);
    }
  }

  const branchPreview = featureName.trim() ? `ranjith/${toBranchSlug(featureName)}` : '';

  const RESOURCES = [
    { label: 'Fluent V9 / V8 Components', href: 'https://react.fluentui.dev' },
    { label: 'MADS', href: 'https://admincontrolsdemoapps.z22.web.core.windows.net/storybook/latest/Storybook/?path=/docs/about--docs' },
    { label: 'MDL2 Icon library', href: 'https://iconcloud.design/browse/Full%20MDL2%20Assets' },
    { label: 'Fluent Icons', href: 'https://storybooks.fluentui.dev/react/?path=/docs/icons-catalog--docs' },
    { label: 'Fluent Charts', href: 'https://storybooks.fluentui.dev/react/?path=/docs/charts_charts-areachart--docs' },
  ];

  return (
    <div className="bg-white dark:bg-[#141414] min-h-screen">

      {/* ── Page title row ── */}
      <div className="px-6 sm:px-10 pt-8 pb-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <p style={{ fontSize: 13, color: '#605e5c', margin: 0 }}>Admin Boilerplate</p>
          <div className="flex items-center gap-2">
            <h1 style={{ fontSize: 24, fontWeight: 600, color: '#1b1a19', margin: 0 }}>V 1.0</h1>
            <span style={{ fontSize: 12, color: '#0078d4', fontWeight: 600, background: '#deeffe', borderRadius: 4, padding: '2px 8px' }}>Beta</span>
          </div>
        </div>
        <a
          href="https://studious-adventure-j17vp6o.pages.github.io/get-started/"
          target="_blank" rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 rounded text-[13px] font-semibold text-white no-underline flex-shrink-0"
          style={{ background: '#0078d4' }}
          onMouseOver={e => (e.currentTarget.style.background = '#106ebe')}
          onMouseOut={e => (e.currentTarget.style.background = '#0078d4')}
        >Get started →</a>
      </div>


      {/* ── Resources panel ── */}
      {tab === 'about' && (
        <div className="px-6 sm:px-10 pb-4">
          <div style={{ background: '#f9f9f9', borderRadius: 8, border: '1px solid #edebe9', padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 8, maxWidth: 400 }}>
            <p style={{ fontSize: 12, fontWeight: 600, color: '#605e5c', textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0 }}>Resources</p>
            {RESOURCES.map(r => (
              <a key={r.label} href={r.href} target="_blank" rel="noopener noreferrer"
                style={{ fontSize: 14, color: '#0078d4', textDecoration: 'none' }}
                onMouseOver={e => (e.currentTarget.style.textDecoration = 'underline')}
                onMouseOut={e => (e.currentTarget.style.textDecoration = 'none')}
              >{r.label}</a>
            ))}
          </div>
        </div>
      )}

      {/* ── Feature grid ── */}
      <div className="px-6 sm:px-10 pb-12">
        {loadingBranches
          ? <p style={{ fontSize: 14, color: '#605e5c', paddingTop: 16 }}>Loading features…</p>
          : <FeaturesGrid features={filtered} currentBranch={currentBranch} ownerSlug={currentBranch ? currentBranch.split('/')[0] : ownerSlug} localBranches={localBranches} search={search} onSearch={setSearch} onNewFeature={() => setShowDialog(true)} />
        }
      </div>

      {/* ── New feature dialog ── */}
      <Dialog
        hidden={!showDialog}
        onDismiss={() => { setShowDialog(false); setFeatureName(''); setCreateError(''); }}
        dialogContentProps={{
          type: DialogType.normal,
          title: 'New feature',
          subText: 'Creates a new branch off main. You can publish it later with /publish.',
        }}
        modalProps={{ isBlocking: false }}
      >
        <TextField
          label="Feature name"
          placeholder="e.g. actionable errors"
          value={featureName}
          onChange={(_, v) => { setFeatureName(v ?? ''); setCreateError(''); }}
          onKeyDown={e => e.key === 'Enter' && handleCreate()}
          autoFocus
          description={branchPreview ? `Branch: ${branchPreview}` : undefined}
          errorMessage={createError}
        />
        <DialogFooter>
          <Button appearance="primary" onClick={handleCreate} disabled={!featureName.trim() || creating}>{creating ? 'Creating…' : 'Create branch'}</Button>
          <Button onClick={() => { setShowDialog(false); setFeatureName(''); setCreateError(''); }}>Cancel</Button>
        </DialogFooter>
      </Dialog>

    </div>
  );
}
