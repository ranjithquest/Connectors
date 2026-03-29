'use client';

import { useState, useMemo, useRef } from 'react';
import type { Connector, DiagnosticIssue } from '@/lib/types';
import {
  WarningSolidIcon,
  ErrorBadgeIcon,
  LightbulbIcon,
  CheckMarkIcon,
  NavigateExternalInlineIcon,
  FilterIcon,
  ChevronDownIcon,
  SettingsIcon,
  OpenInNewTabIcon,
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

// ─── Sub-components ──────────────────────────────────────────────────────────

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

function SourceLabel({ source }: { source: string }) {
  const labels: Record<string, string> = {
    servicenow: 'ServiceNow',
    connector: 'Connector config',
    mismatch: 'Sync mismatch',
    unsupported: 'Unsupported feature',
  };
  return <>{labels[source] ?? source}</>;
}

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
    <div
      className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
      style={{ background: '#0d2137' }}
    >
      <span className="text-[9px] font-bold text-white">{initials}</span>
    </div>
  );
}

// Mini horizontal bar for data rows
function MiniBar({
  label,
  value,
  max,
  color,
}: {
  label: string;
  value: number;
  max: number;
  color: string;
}) {
  const pct = Math.max(4, Math.round((value / max) * 100));
  return (
    <div className="flex items-center gap-2">
      <span
        className="text-[12px] overflow-hidden text-ellipsis whitespace-nowrap flex-shrink-0"
        style={{ color: '#171717', width: 150 }}
      >
        {label}
      </span>
      <div className="flex items-center gap-1 flex-1 min-w-0">
        <div className="flex-1 h-[8px] rounded-full overflow-hidden" style={{ background: '#f0f0f0' }}>
          <div
            className="h-full rounded-full"
            style={{ width: `${pct}%`, background: color }}
          />
        </div>
        <span className="text-[12px] font-semibold flex-shrink-0" style={{ color: '#171717', minWidth: 28, textAlign: 'right' }}>
          {value.toLocaleString()}
        </span>
      </div>
    </div>
  );
}

// Derive per-issue body data
function IssueBody({ issue }: { issue: DiagnosticIssue }) {
  if (issue.id === 'sn-1' || issue.id === 'sn-2' || issue.id === 'sn-acl') {
    // Auth / ACL issues — show impact numbers as a metric
    const metrics: Record<string, { value: string; label: string; trend?: { text: string; negative: boolean } }> = {
      'sn-1': { value: '403', label: 'Auth errors since last sync', trend: { text: '3 syncs failing', negative: true } },
      'sn-2': { value: '0', label: 'articles accessible to Copilot', trend: { text: 'All blocked', negative: true } },
      'sn-acl': { value: '0', label: 'search results for all users', trend: { text: 'Silently failing', negative: true } },
    };
    const m = metrics[issue.id];
    return (
      <div className="flex flex-col gap-1">
        <div className="flex items-end gap-2">
          <span className="text-[28px] font-bold leading-[36px]" style={{ color: '#242424' }}>{m.value}</span>
          {m.trend && (
            <span
              className="flex items-center gap-1 px-1.5 py-0.5 rounded text-[12px] mb-1"
              style={{ background: '#fdf3f4', color: '#c50f1f' }}
            >
              <ErrorBadgeIcon style={{ fontSize: 10 }} />
              {m.trend.text}
            </span>
          )}
        </div>
        <p className="text-[12px]" style={{ color: '#616161' }}>{m.label}</p>
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
        <MiniBar label="ACL-protected articles" value={2840} max={24000} color="linear-gradient(180deg,#637cef,#4760d5)" />
        <MiniBar label="Total articles indexed" value={24000} max={24000} color="linear-gradient(180deg,#00a5af,#008b94)" />
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
        <MiniBar label="HR Confidential" value={1200} max={24000} color="linear-gradient(180deg,#674c8c,#4c3867)" />
        <MiniBar label="Legal Review" value={430} max={24000} color="linear-gradient(180deg,#637cef,#4760d5)" />
      </div>
    );
  }

  if (issue.id === 'sn-5') {
    return (
      <div className="flex flex-col gap-2">
        <div>
          <span className="text-[28px] font-bold leading-[36px]" style={{ color: '#242424' }}>4</span>
          <p className="text-[12px] mt-0.5" style={{ color: '#616161' }}>sync failures due to password rotation risk</p>
        </div>
        <div className="flex items-center gap-1.5 text-[12px] mt-1" style={{ color: '#424242' }}>
          <CheckMarkIcon style={{ fontSize: 12, color: '#107c10' }} />
          OAuth 2.0 available for this connector
        </div>
        <div className="flex items-center gap-1.5 text-[12px]" style={{ color: '#424242' }}>
          <CheckMarkIcon style={{ fontSize: 12, color: '#107c10' }} />
          Migration is non-disruptive
        </div>
      </div>
    );
  }

  if (issue.id === 'sn-6') {
    return (
      <div className="flex flex-col gap-2">
        <div className="flex items-end gap-2">
          <span className="text-[28px] font-bold leading-[36px]" style={{ color: '#242424' }}>47</span>
          <span
            className="flex items-center gap-1 px-1.5 py-0.5 rounded text-[12px] mb-1"
            style={{ background: '#fff9f5', color: '#8a3707' }}
          >
            <WarningSolidIcon style={{ fontSize: 10 }} />
            in 24 h
          </span>
        </div>
        <p className="text-[12px]" style={{ color: '#616161' }}>new articles not yet visible in Copilot</p>
        <MiniBar label="Current crawl lag" value={7} max={7} color="linear-gradient(180deg,#fcce2e,#e8a600)" />
        <MiniBar label="Target lag (days)" value={1} max={7} color="linear-gradient(180deg,#00a5af,#008b94)" />
      </div>
    );
  }

  // Fallback
  return (
    <p className="text-[13px] leading-[18px]" style={{ color: '#616161' }}>{issue.description}</p>
  );
}

// ─── Error log samples (keyed by issue id) ───────────────────────────────────

const ERROR_LOGS: Record<string, string[]> = {
  'sn-1': [
    '[2026-03-17 06:02:11] POST https://contoso.service-now.com/api/now/table/kb_knowledge → 403 Forbidden',
    '[2026-03-17 06:02:11] Response: {"error":{"message":"User Not Authenticated","detail":"Required to provide Auth information"}}',
    '[2026-03-17 06:02:11] Auth method: Basic — svc-copilot@contoso.com',
    '[2026-03-17 06:02:11] Sync aborted after 0 items indexed',
  ],
  'sn-2': [
    '[2026-03-17 06:02:14] GET https://contoso.service-now.com/api/now/table/kb_knowledge → 200 OK',
    '[2026-03-17 06:02:14] Response: {"result":[]} — empty result set',
    '[2026-03-17 06:02:14] ACL check: snc_read role missing for svc-copilot@contoso.com',
    '[2026-03-17 06:02:14] 0 of 24,000 articles returned — permission denied at row level',
  ],
  'sn-acl': [
    '[2026-03-16 09:15:03] ACL sync initiated for connector hr-policies',
    '[2026-03-16 09:15:04] GET /api/now/table/sys_user_has_role → 200 OK (0 roles returned)',
    '[2026-03-16 09:15:04] WARNING: acl_read role not found on svc-copilot@contoso.com',
    '[2026-03-16 09:15:04] ACL propagation skipped — no permissions to push',
    '[2026-03-16 09:15:04] All 24,000 items marked as inaccessible to all users',
  ],
  'sn-3': [
    '[2026-03-15 08:15:22] Custom ACL script detected on kb_knowledge table',
    '[2026-03-15 08:15:22] Script type: Row-level security (scripted ACL)',
    '[2026-03-15 08:15:22] WARNING: Connector does not evaluate scripted ACLs — bypassing',
    '[2026-03-15 08:15:22] 2,840 articles indexed without ACL validation',
  ],
};

// ─── Recommended actions list ─────────────────────────────────────────────────

function RecommendedActions({ issue, onAction }: { issue: DiagnosticIssue; onAction: () => void }) {
  const actions = issue.recommendedActions;
  if (!actions || actions.length === 0) {
    // Fallback to single CTA
    const label =
      issue.resolutionAction === 'fix-in-servicenow' ? 'Fix in ServiceNow'
      : issue.resolutionAction === 'fix-in-connector' ? 'Fix in connector'
      : 'View details';
    return (
      <button
        className="flex items-center gap-1.5 px-3 py-[5px] rounded text-[14px] font-semibold hover:bg-[#f5f5f5] transition-colors"
        style={{ color: '#242424', border: '1px solid #d1d1d1', background: '#fff' }}
        onClick={onAction}
      >
        {label}
      </button>
    );
  }

  return (
    <div className="flex flex-col gap-1">
      {actions.map((action) => {
        const isExternal = action.where === 'external';
        const isServiceNow = action.where === 'servicenow';
        return (
          <button
            key={action.id}
            className="flex items-start gap-2 w-full px-2 py-1.5 rounded text-left hover:bg-[#f5f5f5] transition-colors group"
            onClick={onAction}
          >
            <span
              className="flex-shrink-0 mt-0.5 w-5 h-5 flex items-center justify-center rounded"
              style={{
                background: isServiceNow ? '#f0f4ff' : isExternal ? '#f5f5f5' : '#f0f6ff',
                color: isServiceNow ? '#4760d5' : isExternal ? '#616161' : '#0078d4',
              }}
            >
              {isExternal
                ? <OpenInNewTabIcon style={{ fontSize: 11 }} />
                : isServiceNow
                ? <NavigateExternalInlineIcon style={{ fontSize: 11 }} />
                : <SettingsIcon style={{ fontSize: 11 }} />}
            </span>
            <div className="flex flex-col min-w-0">
              <span className="text-[13px] font-semibold leading-[18px] group-hover:underline" style={{ color: '#242424' }}>
                {action.label}
              </span>
              {action.hint && (
                <span className="text-[11px] leading-[14px]" style={{ color: '#888' }}>
                  {action.hint}
                </span>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
}

// ─── Action Card ─────────────────────────────────────────────────────────────

function ActionCard({
  card,
  onAction,
}: {
  card: ActionCard;
  onAction: (card: ActionCard) => void;
}) {
  const { issue } = card;
  const [logOpen, setLogOpen] = useState(false);
  const logs = ERROR_LOGS[issue.id];

  return (
    <div
      className="flex flex-col rounded-xl overflow-hidden flex-shrink-0"
      style={{ background: '#ffffff', border: '1px solid #d1d1d1', width: '100%', minHeight: 268 }}
    >
      {/* Header */}
      <div className="flex flex-col px-3 pt-3 pb-2">
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
          <button
            className="flex items-center justify-center rounded w-7 h-7 flex-shrink-0 hover:bg-[#f5f5f5]"
            style={{ color: '#616161' }}
            title="More actions"
          >
            <span style={{ fontSize: 18, lineHeight: '0', letterSpacing: 1 }}>···</span>
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 px-3 pb-2">
        <IssueBody issue={issue} />
        <div className="mt-2">
          <span
            className="inline-flex items-center text-[11px] px-1.5 py-0.5 rounded"
            style={{ background: '#f5f5f5', color: '#616161' }}
          >
            <SourceLabel source={issue.source} />
          </span>
        </div>
      </div>

      {/* Copilot impact callout */}
      {issue.copilotImpact && (
        <div
          className="mx-3 mb-2 px-2 py-1.5 rounded text-[12px] leading-[16px]"
          style={{ background: '#f0f6ff', color: '#115ea3', border: '1px solid #c7dff7' }}
        >
          <span className="font-semibold">Fix this → </span>
          {issue.copilotImpact.replace(/^Fixes this → /, '')}
        </div>
      )}

      {/* Error log — expert toggle */}
      {logs && (
        <div className="mx-3 mb-2">
          <button
            className="flex items-center gap-1 text-[12px] hover:underline"
            style={{ color: '#616161' }}
            onClick={() => setLogOpen((v) => !v)}
          >
            <ChevronDownIcon
              style={{ fontSize: 10, transform: logOpen ? 'rotate(0deg)' : 'rotate(-90deg)', transition: 'transform 0.15s' }}
            />
            {logOpen ? 'Hide' : 'View'} error log
          </button>
          {logOpen && (
            <div
              className="mt-1.5 rounded p-2 text-[11px] leading-[16px] font-mono overflow-x-auto"
              style={{ background: '#1e1e1e', color: '#d4d4d4', maxHeight: 120, overflowY: 'auto' }}
            >
              {logs.map((line, i) => (
                <div key={i} style={{ color: line.includes('WARNING') || line.includes('ERROR') ? '#f48771' : '#d4d4d4' }}>
                  {line}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Recommended actions */}
      <div className="px-3 py-2.5" style={{ borderTop: '1px solid #f0f0f0' }}>
        <p className="text-[11px] font-semibold uppercase tracking-wide mb-1.5" style={{ color: '#a19f9d' }}>
          Recommended actions
        </p>
        <RecommendedActions issue={issue} onAction={() => onAction(card)} />
      </div>
    </div>
  );
}

// ─── Section ─────────────────────────────────────────────────────────────────

const FILTER_TABS: { key: FilterTab; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'blocker', label: 'Blockers' },
  { key: 'warning', label: 'Warnings' },
  { key: 'suggestion', label: 'Suggestions' },
];

export default function ConnectorActionsSection({
  connectors,
  onSelectConnector,
}: {
  connectors: Connector[];
  onSelectConnector?: (connectorId: string) => void;
}) {
  const [activeFilter, setActiveFilter] = useState<FilterTab>('blocker');
  const [expanded, setExpanded] = useState(true);

  // Derive all action cards across connectors
  const allCards = useMemo<ActionCard[]>(() => {
    const cards: ActionCard[] = [];
    for (const connector of connectors) {
      const activeIssues = connector.issues.filter(
        (i) => !i.resolvedAt && i.rank > 0
      );
      for (const issue of activeIssues) {
        cards.push({
          issueId: issue.id,
          connectorId: connector.id,
          connectorName: connector.displayName,
          connectorLogo: connector.logoUrl,
          issue,
        });
      }
    }
    // Sort: blockers first, then warnings, then suggestions
    const order = { blocker: 0, warning: 1, suggestion: 2 };
    return cards.sort((a, b) => order[a.issue.severity] - order[b.issue.severity] || a.issue.rank - b.issue.rank);
  }, [connectors]);

  const filtered = useMemo(
    () =>
      activeFilter === 'all'
        ? allCards
        : allCards.filter((c) => c.issue.severity === activeFilter),
    [allCards, activeFilter]
  );

  // Counts per severity for badge display
  const counts = useMemo(
    () => ({
      blocker: allCards.filter((c) => c.issue.severity === 'blocker').length,
      warning: allCards.filter((c) => c.issue.severity === 'warning').length,
      suggestion: allCards.filter((c) => c.issue.severity === 'suggestion').length,
    }),
    [allCards]
  );

  if (allCards.length === 0) return null;

  return (
    <section className="mb-8">
      {/* Section header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <h2
              className="text-[20px] font-semibold leading-[28px]"
              style={{ color: '#242424' }}
            >
              Top actions for your connections
            </h2>
            <button
              className="flex items-center justify-center w-6 h-6 hover:bg-[#f3f2f1] rounded transition-colors"
              style={{ color: '#424242' }}
              onClick={() => setExpanded((v) => !v)}
              title={expanded ? 'Collapse' : 'Expand'}
            >
              <ChevronDownIcon
                style={{
                  fontSize: 14,
                  transform: expanded ? 'rotate(0deg)' : 'rotate(-90deg)',
                  transition: 'transform 0.15s',
                }}
              />
            </button>
          </div>

          {/* Filter tabs */}
          {expanded && (
            <div className="flex items-center gap-2">
              {FILTER_TABS.map((tab) => {
                const count =
                  tab.key === 'all'
                    ? allCards.length
                    : counts[tab.key as 'blocker' | 'warning' | 'suggestion'];
                const active = activeFilter === tab.key;
                return (
                  <button
                    key={tab.key}
                    onClick={() => setActiveFilter(tab.key)}
                    className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[14px] font-semibold transition-colors"
                    style={
                      active
                        ? {
                            background: '#ebf3fc',
                            color: '#115ea3',
                            border: '1px solid #0f6cbd',
                          }
                        : {
                            background: 'transparent',
                            color: '#424242',
                            border: '1px solid #d1d1d1',
                          }
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
          )}
        </div>

        {expanded && (
          <button
            className="flex items-center gap-1 text-[14px] font-semibold hover:underline mt-1"
            style={{ color: '#0078d4' }}
          >
            <FilterIcon style={{ fontSize: 12 }} />
            Filter
          </button>
        )}
      </div>

      {/* Cards grid */}
      {expanded && (
        <>
          <div
            className="grid gap-4"
            style={{
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            }}
          >
            {filtered.map((card) => (
              <ActionCard
                key={`${card.connectorId}-${card.issueId}`}
                card={card}
                onAction={(c) => onSelectConnector?.(c.connectorId)}
              />
            ))}
          </div>

          {/* See all footer */}
          <div className="mt-4 flex justify-center">
            <button
              className="text-[14px] font-semibold hover:underline"
              style={{ color: '#0078d4' }}
            >
              See all {allCards.length} actions
            </button>
          </div>
        </>
      )}
    </section>
  );
}
