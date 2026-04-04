'use client';

import { useState, useEffect } from 'react';
import type { Connector, DiagnosticIssue } from '@/lib/types';
import {
  ActionButton, CommandBarButton, Panel, PanelType, Pivot, PivotItem, PrimaryButton, DefaultButton,
  Stack, Text, Link, Separator, IconButton,
} from '@fluentui/react';
import type { IPanelStyles } from '@fluentui/react';
import { InfoIcon, ChevronDownIcon, StatusCircleCheckmarkIcon, StatusCircleInnerIcon } from '@fluentui/react-icons-mdl2';
import { DismissRegular } from '@fluentui/react-icons';
import {
  FluentProvider, webLightTheme, webDarkTheme,
  Text as FText, Button, tokens, Badge,
  MessageBar, MessageBarBody, MessageBarTitle, MessageBarActions,
  Card, CardHeader, Divider,
} from '@fluentui/react-components';
import { ConnectorStatusCard, IssueCard, getSyncCycleLabel } from './AdvancedSetupPanel';

interface ConnectorDetailPanelProps {
  connector: Connector;
  onClose: () => void;
  onEdit?: () => void;
}

type TabId = 'details' | 'statistics' | 'error' | 'index-browser';

const TABS: { id: TabId; label: string }[] = [
  { id: 'details', label: 'Details' },
  { id: 'statistics', label: 'Statistics' },
  { id: 'error', label: 'Error' },
  { id: 'index-browser', label: 'Index browser' },
];

// ── Helpers ──────────────────────────────────────────────────────────────────

function syncEventMetrics(ev: { id: string; itemsIndexed: number }) {
  const seed = ev.id.split('').reduce((s, c) => s + c.charCodeAt(0), 0);
  const users = 18 + (seed % 12);
  const groups = 3 + (seed % 6);
  const memberships = groups * (4 + (seed % 5));
  return { items: ev.itemsIndexed, users, groups, memberships };
}

function syncStatusDot(status: string) {
  const map: Record<string, string> = {
    success: '#107c10', partial: '#835b00', failed: '#a80000', running: '#0078d4',
  };
  return map[status] ?? '#605e5c';
}

function formatConnectionId(connector: Connector): string {
  const hash = connector.id.replace(/-/g, '').slice(-8).toUpperCase();
  return `${connector.displayName.replace(/\s/g, '')}${hash}`;
}

function getItemErrors(connector: Connector): number {
  return connector.syncHistory.reduce((sum, e) => sum + e.errorCount, 0);
}

function getConnectionStats(connector: Connector) {
  const totalIndexed = connector.syncHistory.reduce((sum, e) => sum + e.itemsIndexed, 0);
  const itemsLabel = totalIndexed > 1000000
    ? `${(totalIndexed / 1000000).toFixed(1)}M`
    : totalIndexed > 1000 ? `${Math.round(totalIndexed / 1000)}k` : `${totalIndexed}`;
  const seed = connector.id.charCodeAt(0) + connector.id.charCodeAt(1);
  const users = 20 + (seed % 80);
  const groups = 3 + (seed % 20);
  const memberships = groups * (4 + (seed % 8));
  return [
    { label: 'Items indexed', value: itemsLabel, color: '#b68a00' },
    { label: 'Users indexed', value: `${users}k`, color: '#637cef' },
    { label: 'Groups indexed', value: `${groups}k`, color: '#9971c5' },
    { label: 'Group memberships indexed', value: `${memberships}k`, color: '#00a3a5' },
  ];
}

// ── Sub-components ────────────────────────────────────────────────────────────

function ConnectorLogo({ connectorType, logoUrl }: { connectorType: string; logoUrl?: string }) {
  if (logoUrl) {
    return (
      <img src={logoUrl} alt={connectorType} style={{ width: 72, height: 72, flexShrink: 0, objectFit: 'contain', borderRadius: 8 }} />
    );
  }
  const initials = connectorType.split(' ').slice(0, 2).map((w) => w[0]).join('');
  return (
    <div style={{ width: 72, height: 72, flexShrink: 0, borderRadius: 1000, background: '#4f6bed', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <span style={{ fontSize: 28, fontWeight: 600, color: '#fff', lineHeight: '36px' }}>{initials}</span>
    </div>
  );
}

function StatBar({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <Stack horizontal tokens={{ childrenGap: 6 }} styles={{ root: { width: 184, minHeight: 52, padding: '0 12px', alignItems: 'flex-end' } }}>
      <div style={{ width: 3, alignSelf: 'stretch', borderRadius: 2, flexShrink: 0, backgroundColor: color }} />
      <Stack tokens={{ childrenGap: 0 }}>
        <Text styles={{ root: { fontSize: 11, color: '#605e5c', whiteSpace: 'nowrap' } }}>{label}</Text>
        <Text variant="xLargePlus" styles={{ root: { color, fontWeight: 700, lineHeight: '28px' } }}>{value}</Text>
      </Stack>
    </Stack>
  );
}

function MetaRow({ col1Label, col1Value, col2Label, col2Value, col1Extra }: {
  col1Label: string; col1Value: React.ReactNode; col2Label: string; col2Value: React.ReactNode; col1Extra?: React.ReactNode;
}) {
  return (
    <Stack horizontal tokens={{ childrenGap: 24 }}>
      <Stack tokens={{ childrenGap: 3 }} styles={{ root: { width: 198 } }}>
        <Text styles={{ root: { fontWeight: '600', fontSize: 14, color: '#323130' } }}>{col1Label}</Text>
        <Text styles={{ root: { fontSize: 14, color: '#484644' } }}>{col1Value}</Text>
        {col1Extra}
      </Stack>
      <Stack tokens={{ childrenGap: 3 }} styles={{ root: { flex: 1 } }}>
        <Text styles={{ root: { fontWeight: '600', fontSize: 14, color: '#323130' } }}>{col2Label}</Text>
        <Text styles={{ root: { fontSize: 14, color: '#484644' } }}>{col2Value}</Text>
      </Stack>
    </Stack>
  );
}

// ── Last sync accordion ───────────────────────────────────────────────────────


// ── ADO health section ────────────────────────────────────────────────────────


function ADOHealthSection({ connector, isDark, onEdit, lastSyncOpen, setLastSyncOpen }: {
  connector: Connector; isDark: boolean; onEdit?: () => void;
  lastSyncOpen: boolean; setLastSyncOpen: (v: boolean) => void;
}) {
  const [issuesExpanded, setIssuesExpanded] = useState(false);

  const activeIssues = connector.issues.filter((i) => !i.resolvedAt).sort((a, b) => a.rank - b.rank);
  const blockers    = activeIssues.filter((i) => i.severity === 'blocker');
  const warnings    = activeIssues.filter((i) => i.severity === 'warning');
  const suggestions = activeIssues.filter((i) => i.severity === 'suggestion');
  const hasProblems = blockers.length > 0 || warnings.length > 0;

  const lastRun = connector.syncHistory[0] ?? null;
  const lastRunMetrics_ = lastRun ? (() => {
    const m = syncEventMetrics(lastRun);
    return [
      { label: 'Items indexed',             value: m.items.toLocaleString(), color: '#b68a00' },
      { label: 'Users indexed',             value: String(m.users),          color: '#637cef' },
      { label: 'Groups indexed',            value: String(m.groups),         color: '#9971c5' },
      { label: 'Group memberships indexed', value: String(m.memberships),    color: '#00a3a5' },
    ];
  })() : [];
  const syncDate = lastRun ? new Date(lastRun.startedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '';
  const syncTime = lastRun ? new Date(lastRun.startedAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : '';
  const syncRelativeLabel = lastRun ? (() => {
    const diff = Math.max(0, Date.now() - new Date(lastRun.startedAt).getTime());
    const mins = Math.floor(diff / 60000);
    const hrs = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    if (days >= 1) return `${days}d ago`;
    if (hrs >= 1) return `${hrs} hr${hrs > 1 ? 's' : ''}`;
    return `${mins} min`;
  })() : '';

  const cardBg     = isDark ? '#1e1e1e' : '#faf9f8';
  const cardBorder = isDark ? '#3d3d3d' : '#edebe9';
  const divider    = isDark ? '#3d3d3d' : '#edebe9';

  const metrics: { label: string; count: number; color: string }[] = [];
  if (blockers.length)    metrics.push({ label: 'Blockers',    count: blockers.length,    color: '#a80000' });
  if (suggestions.length) metrics.push({ label: 'Suggestions', count: suggestions.length, color: '#0078d4' });

  return (
    <FluentProvider theme={isDark ? webDarkTheme : webLightTheme} style={{ background: 'transparent' }}>

      <div>

        {/* ── Row 1+2: Connection Active + Sync details accordion ── */}
        <Stack
          horizontal
          verticalAlign="center"
          horizontalAlign="space-between"
          onClick={() => setLastSyncOpen(!lastSyncOpen)}
          styles={{
            root: {
              cursor: 'pointer',
              padding: '24px 0 8px 0',
              selectors: { ':hover': { backgroundColor: isDark ? '#2a2a2a' : '#f3f2f1' } },
            },
          }}
        >
          <Stack horizontal verticalAlign="center" tokens={{ childrenGap: 6 }}>
            {connector.healthStatus === 'pending'
              ? (
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0 }}>
                  <circle cx="7" cy="7" r="7" fill="#0078d4" />
                  <path d="M7 3.5A3.5 3.5 0 0 1 10.5 7" stroke="white" strokeWidth="1.3" strokeLinecap="round" fill="none"/>
                  <path d="M7 10.5A3.5 3.5 0 0 1 3.5 7" stroke="white" strokeWidth="1.3" strokeLinecap="round" fill="none"/>
                  <path d="M10.5 7l-1.2-.8M10.5 7l-.8 1.2" stroke="white" strokeWidth="1.1" strokeLinecap="round"/>
                  <path d="M3.5 7l1.2.8M3.5 7l.8-1.2" stroke="white" strokeWidth="1.1" strokeLinecap="round"/>
                </svg>
              )
              : <StatusCircleInnerIcon style={{ fontSize: 12, color: '#107c10', flexShrink: 0 }} />
            }
            <FText size={300}>{connector.healthStatus === 'pending' ? 'Syncing' : 'Active'}</FText>
          </Stack>
          <Stack horizontal verticalAlign="center" tokens={{ childrenGap: 8 }}>
            {lastRun && (
              <FText size={200} style={{ color: tokens.colorNeutralForeground3, fontSize: 12 }}>
                {connector.healthStatus === 'pending' ? syncRelativeLabel : `Synced on ${syncDate} · ${syncTime}`}
              </FText>
            )}
            <IconButton
              iconProps={{ iconName: lastSyncOpen ? 'ChevronUp' : 'ChevronDown' }}
              styles={{ root: { width: 24, height: 24, color: isDark ? '#8a8886' : '#605e5c' }, icon: { fontSize: 11 } }}
              onClick={(e) => { e.stopPropagation(); setLastSyncOpen(!lastSyncOpen); }}
            />
          </Stack>
        </Stack>

        {lastSyncOpen && lastRun && (
          <Stack tokens={{ childrenGap: 10 }} styles={{ root: { paddingTop: 16, paddingBottom: 12 } }}>
            <Stack horizontal>
              <StatBar label={lastRunMetrics_[0].label} value={lastRunMetrics_[0].value} color={lastRunMetrics_[0].color} />
              <StatBar label={lastRunMetrics_[1].label} value={lastRunMetrics_[1].value} color={lastRunMetrics_[1].color} />
            </Stack>
            <Stack horizontal>
              <StatBar label={lastRunMetrics_[2].label} value={lastRunMetrics_[2].value} color={lastRunMetrics_[2].color} />
              <StatBar label={lastRunMetrics_[3].label} value={lastRunMetrics_[3].value} color={lastRunMetrics_[3].color} />
            </Stack>
          </Stack>
        )}

        <Separator />

        {/* ── Row 3: Sync status + issues accordion ── */}
        <Stack
          horizontal
          verticalAlign="center"
          horizontalAlign="space-between"
          onClick={() => setIssuesExpanded((v) => !v)}
          styles={{
            root: {
              cursor: 'pointer',
              padding: '8px 0 16px 0',
              selectors: { ':hover': { backgroundColor: isDark ? '#2a2a2a' : '#f3f2f1' } },
            },
          }}
        >
          <Badge
            appearance="filled"
            color={hasProblems ? 'danger' : 'success'}
            size="medium"
            shape="circular"
            style={{ textTransform: 'uppercase', fontSize: 10, fontWeight: 700, letterSpacing: '0.05em' }}
          >
            {hasProblems ? 'Action required' : 'Healthy'}
          </Badge>
          <Stack horizontal verticalAlign="center" tokens={{ childrenGap: 8 }}>
            {hasProblems && (
              <FText size={300} weight="semibold" style={{ color: tokens.colorPaletteRedForeground3 }}>
                Syncing blocked
              </FText>
            )}
            <IconButton
              iconProps={{ iconName: issuesExpanded ? 'ChevronUp' : 'ChevronDown' }}
              styles={{ root: { width: 24, height: 24, color: isDark ? '#8a8886' : '#605e5c' }, icon: { fontSize: 11 } }}
              onClick={(e) => { e.stopPropagation(); setIssuesExpanded((v) => !v); }}
            />
          </Stack>
        </Stack>

        {issuesExpanded && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: '8px 0 12px 0' }}>
            {!hasProblems ? (
              <Stack horizontal>
                <StatBar label="Blockers" value="0" color={tokens.colorNeutralStroke1} />
                <StatBar label="Suggestions" value={String(suggestions.length)} color={tokens.colorNeutralStroke1} />
              </Stack>
            ) : (
              <>
                {metrics.length > 0 && (
                  <Stack horizontal styles={{ root: { paddingBottom: 16 } }}>
                    {metrics.map((m) => (
                      <StatBar key={m.label} label={m.label} value={String(m.count)} color={m.color} />
                    ))}
                  </Stack>
                )}
                {activeIssues.map((issue) => (
                  <IssueCard
                    key={issue.id}
                    issue={issue}
                    expanded={false}
                    onToggle={() => onEdit?.()}
                    detectedSyncLabel={getSyncCycleLabel(issue.detectedAt, connector.syncHistory)}
                    onFix={() => onEdit?.()}
                  />
                ))}
              </>
            )}
          </div>
        )}

      </div>

    </FluentProvider>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function ConnectorDetailPanel({ connector, onClose, onEdit }: ConnectorDetailPanelProps) {
  const [activeTab, setActiveTab] = useState<TabId>('details');
  const [copied, setCopied] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [lastSyncOpen, setLastSyncOpen] = useState(false);
  const [authBannerDismissed, setAuthBannerDismissed] = useState(false);

  useEffect(() => {
    const update = () => setIsDark(document.documentElement.classList.contains('dark'));
    update();
    const observer = new MutationObserver(update);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  const connectionId = formatConnectionId(connector);
  const itemErrors = getItemErrors(connector);
  const cabStats = getConnectionStats(connector);
  const updatedAt = connector.lastSyncAt
    ? new Date(connector.lastSyncAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    : '—';
  const isADO = connector.connectorType === 'ADO';
  const showHealthSection = isADO || connector.id === 'hr-policies';
  const isHRPolicies = connector.id === 'hr-policies';

  const lastModified = connector.lastSyncAt
    ? (() => {
        const diff = Date.now() - new Date(connector.lastSyncAt).getTime();
        const mins = Math.floor(diff / 60000);
        if (mins < 60) return `${mins} minutes ago`;
        const hrs = Math.floor(mins / 60);
        if (hrs < 24) return `${hrs} hour${hrs !== 1 ? 's' : ''} ago`;
        return `${Math.floor(hrs / 24)} days ago`;
      })()
    : '—';

  const panelBg = isDark ? '#212121' : '#ffffff';

  const panelStyles: Partial<IPanelStyles> = {
    root: { top: 48 },
    overlay: { backgroundColor: 'rgba(0,0,0,0.2)' },
    main: {
      width: 474,
      backgroundColor: panelBg,
      boxShadow: '0px 3.84px 11.52px 0px rgba(0,0,0,0.18), 0px 20.48px 46.08px 0px rgba(0,0,0,0.22)',
    },
    commands: { padding: 0 },
    navigation: { display: 'block', width: '100%' },
    contentInner: { display: 'flex', flexDirection: 'column', height: '100%' },
    scrollableContent: { flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' },
    content: { padding: 0, flex: 1, overflowY: 'auto' },
    footer: { flexShrink: 0 },
  };

  const labelStyle = { root: { fontWeight: '600', fontSize: 14, color: isDark ? '#f5f5f5' : '#323130' } };
  const valueStyle = { root: { fontSize: 14, color: isDark ? '#adadad' : '#484644' } };

  const renderHeader = () => (
    <Stack styles={{ root: { flexShrink: 0 } }} tokens={{ childrenGap: 0 }}>
      {/* CommandBar — h=48px, close button at right per Figma */}
      <Stack horizontal horizontalAlign="end" verticalAlign="center" styles={{ root: { height: 48, padding: '0 8px', flexShrink: 0, backgroundColor: panelBg } }}>
        <IconButton
          iconProps={{ iconName: 'Cancel' }}
          onClick={onClose}
          styles={{ root: { color: isDark ? '#ffffff' : '#000000', backgroundColor: 'transparent' }, rootHovered: { backgroundColor: isDark ? '#3d3d3d' : '#f3f2f1' } }}
        />
      </Stack>
      {/* Header body — pt=16px px=32px */}
    <Stack styles={{ root: { padding: '16px 32px 0' } }} tokens={{ childrenGap: 0 }}>
      {/* Persona header — pb-[48px] per spec */}
      <Stack horizontal tokens={{ childrenGap: 16 }} verticalAlign="start" styles={{ root: { paddingBottom: 48 } }}>
        <ConnectorLogo connectorType={connector.connectorType} logoUrl={connector.logoUrl} />
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0 }}>
          {/* Name — h=34px container, text offset -4px for line-height optical alignment */}
          <div style={{ height: 34, position: 'relative', width: '100%' }}>
            <Text styles={{ root: { position: 'absolute', top: -4, left: 0, right: 0, fontWeight: 700, fontSize: 20, lineHeight: '28px', color: isDark ? '#f5f5f5' : '#000000', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' } }}>
              {connector.connectorType}
            </Text>
          </div>
          {/* Status — h=30px container, text offset -6px */}
          <div style={{ height: 30, position: 'relative', width: '100%' }}>
            <Text styles={{ root: { position: 'absolute', top: -6, left: 0, right: 0, fontSize: 14, lineHeight: '20px', color: isDark ? '#adadad' : '#323130', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' } }}>
              {connector.displayName}
            </Text>
          </div>
          {/* ActionButtons — h=16px container, buttons at top=-8px left=-8px (overflow within container) */}
          <div style={{ height: 16, position: 'relative', width: '100%', overflow: 'visible' }}>
            <div style={{ position: 'absolute', top: -8, left: -8, display: 'flex' }}>
              <CommandBarButton
                split
                text="Start full sync"
                iconProps={{ iconName: 'Sync' }}
                menuProps={{ items: [{ key: 'incremental', text: 'Incremental sync' }] }}
                styles={{
                  root: { height: 32, padding: '0 8px', ...(isDark ? { background: 'transparent' } : {}) },
                  label: { fontSize: 14, ...(isDark ? { color: '#ffffff' } : {}) },
                  icon: isDark ? { color: '#ffffff' } : {},
                  menuIcon: isDark ? { color: '#ffffff' } : {},
                  rootHovered: isDark ? { background: '#3d3d3d' } : {},
                  splitButtonMenuButton: isDark ? { background: 'transparent' } : {},
                  splitButtonMenuButtonExpanded: isDark ? { background: '#3d3d3d' } : {},
                }}
              />
              <CommandBarButton
                text="Delete"
                iconProps={{ iconName: 'Delete' }}
                styles={{
                  root: { height: 32, padding: '0 8px', ...(isDark ? { background: 'transparent' } : {}) },
                  label: { fontSize: 14, ...(isDark ? { color: '#ffffff' } : {}) },
                  icon: isDark ? { color: '#ffffff' } : {},
                  rootHovered: isDark ? { background: '#3d3d3d' } : {},
                }}
              />
            </div>
          </div>
        </div>
      </Stack>
      {/* Pivot — marginTop=-18 pulls tabs 18px into the pb-48 space above (net 30px gap from profile bottom), marginLeft=-9 aligns first tab text */}
      <div style={{ marginTop: -18, marginLeft: -9 }}>
        <Pivot
          selectedKey={activeTab}
          onLinkClick={(item) => item?.props.itemKey && setActiveTab(item.props.itemKey as TabId)}
          styles={{ root: { display: 'flex' }, link: { fontSize: 14, height: 40, padding: '0 8px' }, linkIsSelected: { fontSize: 14, height: 40, padding: '0 8px' } }}
        >
          {TABS.map((tab) => (
            <PivotItem key={tab.id} itemKey={tab.id} headerText={tab.label} />
          ))}
        </Pivot>
      </div>
    </Stack>
    </Stack>
  );

  const renderFooter = () => (
    <Stack horizontal verticalAlign="center" tokens={{ childrenGap: 8 }} styles={{ root: { height: 64, padding: '0 32px' } }}>
      <PrimaryButton onClick={onEdit}>Edit</PrimaryButton>
    </Stack>
  );

  return (
    <Panel
      isOpen
      onDismiss={onClose}
      type={PanelType.custom}
      customWidth="474px"
      isLightDismiss
      isFooterAtBottom
      hasCloseButton={false}
      styles={panelStyles}
      onRenderHeader={renderHeader}
      onRenderFooter={renderFooter}
    >
      <Stack
        tokens={{ childrenGap: 20 }}
        styles={{ root: { padding: '16px 32px 32px', display: activeTab === 'details' ? 'flex' : 'none' } }}
      >

{/* Health section — ADO only */}
        {showHealthSection && (
          <ADOHealthSection
            connector={connector}
            isDark={isDark}
            onEdit={onEdit}
            lastSyncOpen={lastSyncOpen}
            setLastSyncOpen={setLastSyncOpen}
          />
        )}

        {/* Connection ID */}
        <Stack tokens={{ childrenGap: 4 }}>
          <Text styles={labelStyle}>Connection ID</Text>
          <Stack horizontal verticalAlign="center" tokens={{ childrenGap: 4 }}>
            <Text styles={valueStyle}>{connectionId}</Text>
            <IconButton
              iconProps={{ iconName: 'Copy' }}
              title={copied ? 'Copied!' : 'Copy'}
              onClick={() => {
                navigator.clipboard.writeText(connectionId).catch(() => {});
                setCopied(true);
                setTimeout(() => setCopied(false), 1500);
              }}
              styles={{ root: { width: 20, height: 20 }, icon: { fontSize: 11, color: '#0078d4' } }}
            />
          </Stack>
        </Stack>

        {/* Connection stats — non-ADO only */}
        {!showHealthSection && (
          <Stack tokens={{ childrenGap: 8 }}>
            <Stack horizontal horizontalAlign="space-between" verticalAlign="center">
              <Stack horizontal verticalAlign="center" tokens={{ childrenGap: 6 }}>
                <Text styles={labelStyle}>Connection stats</Text>
                <InfoIcon style={{ fontSize: 10, color: '#605e5c' }} />
                <Text variant="xSmall" styles={{ root: { color: '#484644' } }}>Updated at {updatedAt}</Text>
              </Stack>
              <Link styles={{ root: { fontSize: 14 } }}>
                <Stack horizontal verticalAlign="center" tokens={{ childrenGap: 4 }}>
                  <SyncIcon style={{ fontSize: 11 }} />
                  <span>Refresh</span>
                </Stack>
              </Link>
            </Stack>
            <Stack tokens={{ childrenGap: 12 }}>
              <Stack horizontal>
                <StatBar label={cabStats[0].label} value={cabStats[0].value} color={cabStats[0].color} />
                <StatBar label={cabStats[1].label} value={cabStats[1].value} color={cabStats[1].color} />
              </Stack>
              <Stack horizontal>
                <StatBar label={cabStats[2].label} value={cabStats[2].value} color={cabStats[2].color} />
                <StatBar label={cabStats[3].label} value={cabStats[3].value} color={cabStats[3].color} />
              </Stack>
            </Stack>
          </Stack>
        )}


        {/* Description */}
        <Stack tokens={{ childrenGap: 4 }}>
          <Text styles={labelStyle}>Description</Text>
          <Text styles={valueStyle}>
            {`Connector for ${connector.connectorType} — providing search and Copilot access to ${connector.displayName} content.`}
          </Text>
          <Link styles={{ root: { fontSize: 14 } }}>Edit description</Link>
        </Stack>

        {/* Metadata row 1 */}
        <MetaRow
          col1Label="Item errors" col1Value={String(itemErrors)}
          col2Label="User and groups errors" col2Value="—"
        />

        {/* Metadata row 2 */}
        <MetaRow
          col1Label="Data source" col1Value={connector.instanceUrl.replace(/^https?:\/\//, '')}
          col2Label="Permissions" col2Value="Visible only to people with access to this data source"
        />

        {/* Metadata row 3 */}
        <MetaRow
          col1Label="Schema"
          col1Value="19 properties added"
          col1Extra={<Link styles={{ root: { fontSize: 14 } }}>Edit schema</Link>}
          col2Label="Last modified at"
          col2Value={lastModified}
        />
      </Stack>
    </Panel>
  );
}
