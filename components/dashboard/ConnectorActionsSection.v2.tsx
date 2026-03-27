'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import type { Connector, DiagnosticIssue } from '@/lib/types';
import {
  WarningSolidIcon,
  ErrorBadgeIcon,
  LightbulbIcon,
  CheckMarkIcon,
  NavigateExternalInlineIcon,
  ChevronDownIcon,
  CancelIcon,
  PeopleIcon,
  BookmarksIcon,
} from '@fluentui/react-icons-mdl2';

// ─── Types ──────────────────────────────────────────────────────────────────

type FilterTab = 'all' | 'blocker' | 'warning' | 'suggestion';

interface ActionCard {
  issueId: string;
  connectorId: string;
  connectorName: string;
  connectorLogo?: string;
  issue: DiagnosticIssue;
}

// ─── Severity badge ──────────────────────────────────────────────────────────

function SeverityBadge({ severity }: { severity: 'blocker' | 'warning' | 'suggestion' }) {
  if (severity === 'blocker') {
    return (
      <span
        className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[12px] font-semibold whitespace-nowrap"
        style={{ background: '#fde7e9', color: '#a80000', border: '1px solid #f1bbbc' }}
      >
        <ErrorBadgeIcon style={{ fontSize: 12 }} />
        Needs attention
      </span>
    );
  }
  if (severity === 'warning') {
    return (
      <span
        className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[12px] font-semibold whitespace-nowrap"
        style={{ background: '#fff9f5', color: '#8a3707', border: '1px solid #fdcfb4' }}
      >
        <WarningSolidIcon style={{ fontSize: 12 }} />
        Needs attention
      </span>
    );
  }
  return (
    <span
      className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[12px] font-semibold whitespace-nowrap"
      style={{ background: '#ebf3fc', color: '#115ea3', border: '1px solid #c7dff7' }}
    >
      <LightbulbIcon style={{ fontSize: 12 }} />
      Recommendation
    </span>
  );
}

// ─── Connector logo ──────────────────────────────────────────────────────────

function ConnectorLogo({ logoUrl, name }: { logoUrl?: string; name: string }) {
  const initials = name.split(' ').slice(0, 2).map((w) => w[0]).join('');
  if (logoUrl) {
    return (
      <div className="w-5 h-5 rounded overflow-hidden flex-shrink-0">
        <img src={logoUrl} alt={name} className="w-full h-full object-cover" />
      </div>
    );
  }
  return (
    <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: '#0d2137' }}>
      <span className="text-[9px] font-bold text-white">{initials}</span>
    </div>
  );
}

// ─── Source tag ───────────────────────────────────────────────────────────────

function SourceTag({ source }: { source: string }) {
  const labels: Record<string, string> = {
    servicenow: 'ServiceNow',
    connector: 'Connector config',
    mismatch: 'Sync mismatch',
    unsupported: 'Unsupported feature',
  };
  return (
    <span
      className="inline-flex items-center text-[11px] px-1.5 py-0.5 rounded"
      style={{ background: '#f5f5f5', color: '#616161' }}
    >
      {labels[source] ?? source}
    </span>
  );
}

// ─── Mini horizontal bar ─────────────────────────────────────────────────────

function MiniBar({ label, value, max, gradient }: { label: string; value: number; max: number; gradient: string }) {
  const pct = Math.max(4, Math.round((value / max) * 100));
  return (
    <div className="flex items-center gap-2">
      <span className="text-[12px] truncate flex-shrink-0" style={{ color: '#171717', width: 148 }}>{label}</span>
      <div className="flex items-center gap-1 flex-1 min-w-0">
        <div className="flex-1 h-[8px] rounded-full overflow-hidden" style={{ background: '#f0f0f0' }}>
          <div className="h-full rounded-full" style={{ width: `${pct}%`, background: gradient }} />
        </div>
        <span className="text-[12px] font-semibold flex-shrink-0" style={{ color: '#171717', minWidth: 32, textAlign: 'right' }}>
          {value.toLocaleString()}
        </span>
      </div>
    </div>
  );
}

// ─── Issue body (metric + data) ───────────────────────────────────────────────

function IssueBody({ issue }: { issue: DiagnosticIssue }) {
  if (issue.id === 'sn-1') {
    return (
      <div className="flex flex-col gap-1.5">
        <div className="flex items-end gap-2">
          <span className="text-[28px] font-bold leading-[36px]" style={{ color: '#242424' }}>403</span>
          <span className="flex items-center gap-1 px-1.5 py-0.5 rounded text-[12px] mb-1" style={{ background: '#fdf3f4', color: '#c50f1f' }}>
            <ErrorBadgeIcon style={{ fontSize: 10 }} /> 3 syncs failing
          </span>
        </div>
        <p className="text-[12px]" style={{ color: '#616161' }}>Auth errors — sync blocked since Mar 17</p>
      </div>
    );
  }
  if (issue.id === 'sn-2') {
    return (
      <div className="flex flex-col gap-1.5">
        <div className="flex items-end gap-2">
          <span className="text-[28px] font-bold leading-[36px]" style={{ color: '#242424' }}>0</span>
          <span className="flex items-center gap-1 px-1.5 py-0.5 rounded text-[12px] mb-1" style={{ background: '#fdf3f4', color: '#c50f1f' }}>
            <ErrorBadgeIcon style={{ fontSize: 10 }} /> All blocked
          </span>
        </div>
        <p className="text-[12px]" style={{ color: '#616161' }}>articles accessible to Copilot</p>
      </div>
    );
  }
  if (issue.id === 'sn-acl') {
    return (
      <div className="flex flex-col gap-1.5">
        <div className="flex items-end gap-2">
          <span className="text-[28px] font-bold leading-[36px]" style={{ color: '#242424' }}>0</span>
          <span className="flex items-center gap-1 px-1.5 py-0.5 rounded text-[12px] mb-1" style={{ background: '#fdf3f4', color: '#c50f1f' }}>
            <ErrorBadgeIcon style={{ fontSize: 10 }} /> Silent failure
          </span>
        </div>
        <p className="text-[12px]" style={{ color: '#616161' }}>search results for all users</p>
      </div>
    );
  }
  if (issue.id === 'sn-3') {
    return (
      <div className="flex flex-col gap-2">
        <div>
          <span className="text-[28px] font-bold leading-[36px]" style={{ color: '#242424' }}>~12%</span>
          <p className="text-[12px] mt-0.5" style={{ color: '#616161' }}>of articles may be exposed to wrong users</p>
        </div>
        <MiniBar label="ACL-protected articles" value={2840} max={24000} gradient="linear-gradient(90deg,#637cef,#4760d5)" />
        <MiniBar label="Total articles indexed" value={24000} max={24000} gradient="linear-gradient(90deg,#00a5af,#008b94)" />
      </div>
    );
  }
  if (issue.id === 'sn-4') {
    return (
      <div className="flex flex-col gap-2">
        <div>
          <span className="text-[28px] font-bold leading-[36px]" style={{ color: '#242424' }}>2</span>
          <p className="text-[12px] mt-0.5" style={{ color: '#616161' }}>restricted knowledge bases in crawl scope</p>
        </div>
        <MiniBar label="HR Confidential" value={1200} max={24000} gradient="linear-gradient(90deg,#674c8c,#4c3867)" />
        <MiniBar label="Legal Review" value={430} max={24000} gradient="linear-gradient(90deg,#637cef,#4760d5)" />
      </div>
    );
  }
  if (issue.id === 'sn-5') {
    return (
      <div className="flex flex-col gap-2">
        <div>
          <span className="text-[28px] font-bold leading-[36px]" style={{ color: '#242424' }}>4</span>
          <p className="text-[12px] mt-0.5" style={{ color: '#616161' }}>past sync failures from password rotation</p>
        </div>
        <div className="flex flex-col gap-1 mt-1">
          <div className="flex items-center gap-1.5 text-[12px]" style={{ color: '#424242' }}>
            <CheckMarkIcon style={{ fontSize: 12, color: '#107c10' }} /> OAuth 2.0 available for this connector
          </div>
          <div className="flex items-center gap-1.5 text-[12px]" style={{ color: '#424242' }}>
            <CheckMarkIcon style={{ fontSize: 12, color: '#107c10' }} /> Migration is non-disruptive
          </div>
        </div>
      </div>
    );
  }
  if (issue.id === 'sn-6') {
    return (
      <div className="flex flex-col gap-2">
        <div className="flex items-end gap-2">
          <span className="text-[28px] font-bold leading-[36px]" style={{ color: '#242424' }}>47</span>
          <span className="flex items-center gap-1 px-1.5 py-0.5 rounded text-[12px] mb-1" style={{ background: '#fff9f5', color: '#8a3707' }}>
            <WarningSolidIcon style={{ fontSize: 10 }} /> in last 24 h
          </span>
        </div>
        <p className="text-[12px]" style={{ color: '#616161' }}>new articles not yet visible in Copilot</p>
        <MiniBar label="Current lag (days)" value={7} max={7} gradient="linear-gradient(90deg,#fcce2e,#e8a600)" />
        <MiniBar label="Target lag (days)" value={1} max={7} gradient="linear-gradient(90deg,#00a5af,#008b94)" />
      </div>
    );
  }
  // Fallback
  return <p className="text-[13px] leading-[18px]" style={{ color: '#616161' }}>{issue.description}</p>;
}

// ─── Overflow menu ────────────────────────────────────────────────────────────

function OverflowMenu({ onDismiss, onAssign, onMarkKnown }: {
  onDismiss: () => void;
  onAssign: () => void;
  onMarkKnown: () => void;
}) {
  return (
    <div
      className="absolute right-0 top-8 z-30 rounded shadow-lg py-1 min-w-[172px]"
      style={{ background: '#fff', border: '1px solid #e1e1e1', boxShadow: '0 4px 12px rgba(0,0,0,0.12)' }}
    >
      <button
        className="flex items-center gap-2 w-full px-3 py-2 text-[13px] hover:bg-[#f5f5f5] transition-colors text-left"
        style={{ color: '#323130' }}
        onClick={onDismiss}
      >
        <CancelIcon style={{ fontSize: 14, color: '#616161' }} />
        Dismiss
      </button>
      <button
        className="flex items-center gap-2 w-full px-3 py-2 text-[13px] hover:bg-[#f5f5f5] transition-colors text-left"
        style={{ color: '#323130' }}
        onClick={onAssign}
      >
        <PeopleIcon style={{ fontSize: 14, color: '#616161' }} />
        Assign to…
      </button>
      <button
        className="flex items-center gap-2 w-full px-3 py-2 text-[13px] hover:bg-[#f5f5f5] transition-colors text-left"
        style={{ color: '#323130' }}
        onClick={onMarkKnown}
      >
        <BookmarksIcon style={{ fontSize: 14, color: '#616161' }} />
        Mark as known issue
      </button>
    </div>
  );
}

// ─── Action card ──────────────────────────────────────────────────────────────

function ActionCard({ card, onAction }: { card: ActionCard; onAction: (card: ActionCard) => void }) {
  const { issue } = card;
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    if (menuOpen) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [menuOpen]);

  const ctaLabel =
    issue.resolutionAction === 'fix-in-servicenow' ? 'Fix in ServiceNow'
    : issue.resolutionAction === 'fix-in-connector' ? 'Fix in connector'
    : issue.resolutionAction === 'workaround' ? 'View workaround'
    : 'View details';

  return (
    <div
      className="flex flex-col rounded-xl overflow-visible flex-shrink-0"
      style={{ background: '#fff', border: '1px solid #d1d1d1', width: '100%', minHeight: 272 }}
    >
      {/* Header */}
      <div className="px-3 pt-3 pb-2">
        <div className="flex items-start gap-2">
          <div className="flex flex-col min-w-0 flex-1">
            <span className="text-[14px] font-semibold leading-[20px] truncate" style={{ color: '#242424' }}>
              {issue.title}
            </span>
            <div className="flex items-center gap-1 mt-0.5">
              <ConnectorLogo logoUrl={card.connectorLogo} name={card.connectorName} />
              <span className="text-[12px]" style={{ color: '#616161' }}>{card.connectorName}</span>
            </div>
          </div>

          <SeverityBadge severity={issue.severity} />

          {/* ··· overflow */}
          <div className="relative flex-shrink-0" ref={menuRef}>
            <button
              className="flex items-center justify-center w-7 h-7 rounded hover:bg-[#f5f5f5] transition-colors"
              style={{ color: '#616161' }}
              onClick={() => setMenuOpen((v) => !v)}
              title="More actions"
            >
              <span style={{ fontSize: 16, letterSpacing: 1.5, lineHeight: 0 }}>···</span>
            </button>
            {menuOpen && (
              <OverflowMenu
                onDismiss={() => setMenuOpen(false)}
                onAssign={() => setMenuOpen(false)}
                onMarkKnown={() => setMenuOpen(false)}
              />
            )}
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 px-3 pb-2">
        <IssueBody issue={issue} />
        <div className="mt-2">
          <SourceTag source={issue.source} />
        </div>
      </div>

      {/* Copilot impact callout */}
      {issue.copilotImpact && (
        <div
          className="mx-3 mb-2 px-2.5 py-2 rounded-md text-[12px] leading-[16px]"
          style={{ background: '#f0f6ff', color: '#115ea3', border: '1px solid #c7dff7' }}
        >
          <span className="font-semibold">Fix this → </span>
          {issue.copilotImpact.replace(/^Fixes this → /, '')}
        </div>
      )}

      {/* Footer */}
      <div className="px-3 py-2.5" style={{ borderTop: '1px solid #f0f0f0' }}>
        <button
          className="flex items-center gap-1.5 px-3 py-[5px] rounded text-[14px] font-semibold hover:bg-[#f5f5f5] transition-colors"
          style={{ color: '#242424', border: '1px solid #d1d1d1', background: '#fff' }}
          onClick={() => onAction(card)}
        >
          {ctaLabel}
          {issue.resolutionAction === 'fix-in-servicenow' && <NavigateExternalInlineIcon style={{ fontSize: 12 }} />}
        </button>
      </div>
    </div>
  );
}

// ─── Connector filter pills ───────────────────────────────────────────────────

function ConnectorPills({
  connectors,
  active,
  onChange,
}: {
  connectors: { id: string; name: string; logo?: string }[];
  active: string | null;
  onChange: (id: string | null) => void;
}) {
  if (connectors.length <= 1) return null;
  return (
    <div className="flex items-center gap-2 flex-wrap">
      <button
        onClick={() => onChange(null)}
        className="flex items-center px-2.5 py-1 rounded-full text-[13px] transition-colors"
        style={
          active === null
            ? { background: '#242424', color: '#fff', fontWeight: 600 }
            : { background: '#f5f5f5', color: '#424242', fontWeight: 400 }
        }
      >
        All connectors
      </button>
      {connectors.map((c) => (
        <button
          key={c.id}
          onClick={() => onChange(c.id)}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[13px] transition-colors"
          style={
            active === c.id
              ? { background: '#242424', color: '#fff', fontWeight: 600 }
              : { background: '#f5f5f5', color: '#424242', fontWeight: 400 }
          }
        >
          <ConnectorLogo logoUrl={c.logo} name={c.name} />
          {c.name}
        </button>
      ))}
    </div>
  );
}

// ─── Main section ─────────────────────────────────────────────────────────────

const FILTER_TABS: { key: FilterTab; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'blocker', label: 'Blockers' },
  { key: 'warning', label: 'Warnings' },
  { key: 'suggestion', label: 'Suggestions' },
];

export default function ConnectorActionsSectionV2({
  connectors,
  onSelectConnector,
}: {
  connectors: Connector[];
  onSelectConnector?: (connectorId: string) => void;
}) {
  const [activeFilter, setActiveFilter] = useState<FilterTab>('blocker');
  const [activeConnector, setActiveConnector] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(true);

  const allCards = useMemo<ActionCard[]>(() => {
    const cards: ActionCard[] = [];
    for (const connector of connectors) {
      for (const issue of connector.issues) {
        if (!issue.resolvedAt && issue.rank > 0) {
          cards.push({
            issueId: issue.id,
            connectorId: connector.id,
            connectorName: connector.displayName,
            connectorLogo: connector.logoUrl,
            issue,
          });
        }
      }
    }
    const order = { blocker: 0, warning: 1, suggestion: 2 };
    return cards.sort(
      (a, b) => order[a.issue.severity] - order[b.issue.severity] || a.issue.rank - b.issue.rank
    );
  }, [connectors]);

  const filtered = useMemo(() => {
    let cards = activeFilter === 'all' ? allCards : allCards.filter((c) => c.issue.severity === activeFilter);
    if (activeConnector) cards = cards.filter((c) => c.connectorId === activeConnector);
    return cards;
  }, [allCards, activeFilter, activeConnector]);

  const counts = useMemo(() => ({
    blocker: allCards.filter((c) => c.issue.severity === 'blocker').length,
    warning: allCards.filter((c) => c.issue.severity === 'warning').length,
    suggestion: allCards.filter((c) => c.issue.severity === 'suggestion').length,
  }), [allCards]);

  const connectorList = useMemo(() =>
    connectors
      .filter((c) => c.issues.some((i) => !i.resolvedAt && i.rank > 0))
      .map((c) => ({ id: c.id, name: c.displayName, logo: c.logoUrl })),
    [connectors]
  );

  if (allCards.length === 0) return null;

  return (
    <section className="mb-8">
      {/* Section header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <h2 className="text-[20px] font-semibold leading-[28px]" style={{ color: '#242424' }}>
            Top actions for your connections
          </h2>
          <button
            className="flex items-center justify-center w-6 h-6 hover:bg-[#f3f2f1] rounded transition-colors"
            style={{ color: '#424242' }}
            onClick={() => setExpanded((v) => !v)}
            title={expanded ? 'Collapse' : 'Expand'}
          >
            <ChevronDownIcon
              style={{ fontSize: 14, transform: expanded ? 'rotate(0deg)' : 'rotate(-90deg)', transition: 'transform 0.15s' }}
            />
          </button>
        </div>

        {expanded && (
          <button className="text-[14px] font-semibold hover:underline mt-0.5" style={{ color: '#0078d4' }}>
            See all {allCards.length} actions
          </button>
        )}
      </div>

      {expanded && (
        <>
          {/* Filter row */}
          <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
            {/* Severity tabs */}
            <div className="flex items-center gap-2 flex-wrap">
              {FILTER_TABS.map((tab) => {
                const count = tab.key === 'all' ? allCards.length : counts[tab.key as 'blocker' | 'warning' | 'suggestion'];
                const active = activeFilter === tab.key;
                return (
                  <button
                    key={tab.key}
                    onClick={() => setActiveFilter(tab.key)}
                    className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[14px] font-semibold transition-colors"
                    style={
                      active
                        ? { background: '#ebf3fc', color: '#115ea3', border: '1px solid #0f6cbd' }
                        : { background: 'transparent', color: '#424242', border: '1px solid #d1d1d1' }
                    }
                  >
                    {tab.label}
                    {count > 0 && (
                      <span
                        className="text-[11px] font-bold px-1 rounded-full"
                        style={
                          active
                            ? { background: '#c7dff7', color: '#115ea3' }
                            : tab.key === 'blocker'
                            ? { background: '#fde7e9', color: '#a80000' }
                            : tab.key === 'warning'
                            ? { background: '#fff9f5', color: '#8a3707' }
                            : { background: '#f0f0f0', color: '#424242' }
                        }
                      >
                        {count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Connector pills */}
            <ConnectorPills connectors={connectorList} active={activeConnector} onChange={setActiveConnector} />
          </div>

          {/* Cards grid */}
          <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(288px, 1fr))' }}>
            {filtered.map((card) => (
              <ActionCard
                key={`${card.connectorId}-${card.issueId}`}
                card={card}
                onAction={(c) => onSelectConnector?.(c.connectorId)}
              />
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="py-10 text-center text-[14px]" style={{ color: '#616161' }}>
              No issues in this category.
            </div>
          )}
        </>
      )}
    </section>
  );
}
