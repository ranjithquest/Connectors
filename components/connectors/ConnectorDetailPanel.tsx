'use client';

import { useState, useEffect } from 'react';
import type { Connector } from '@/lib/types';
import { CommandBarButton } from '@fluentui/react';
import {
  CancelIcon,
  RefreshIcon,
  DeleteIcon,
  CopyIcon,
  InfoIcon,
} from '@fluentui/react-icons-mdl2';

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

function ConnectorLogo({ connectorType, logoUrl }: { connectorType: string; logoUrl?: string }) {
  if (logoUrl) {
    return (
      <div className="w-[56px] h-[56px] flex-shrink-0 rounded-[4px] overflow-hidden flex items-center justify-center">
        <img src={logoUrl} alt={connectorType} className="w-full h-full object-contain" />
      </div>
    );
  }
  const initials = connectorType.split(' ').slice(0, 2).map((w) => w[0]).join('');
  return (
    <div className="w-[56px] h-[56px] flex-shrink-0 rounded-[4px] bg-[#0d2137] flex items-center justify-center">
      <span className="text-[16px] font-bold text-white">{initials}</span>
    </div>
  );
}

interface CabStatCardProps {
  label: string;
  value: string;
  color: string;
}

function CabStatCard({ label, value, color }: CabStatCardProps) {
  return (
    <div className="flex gap-[6px] items-end px-3 rounded-[2px] w-[184px] min-h-[52px]">
      {/* Left color bar */}
      <div className="w-[3px] self-stretch rounded-sm flex-shrink-0" style={{ backgroundColor: color }} />
      <div className="flex flex-col">
        <span className="text-[9px] text-[#323130] dark:text-[#adadad] leading-[13px] whitespace-nowrap">{label}</span>
        <span className="text-[22px] font-bold leading-[28px]" style={{ color }}>{value}</span>
      </div>
    </div>
  );
}

function formatConnectionId(connector: Connector): string {
  // Create a stable connection ID from displayName + numeric id
  const hash = connector.id.replace(/-/g, '').slice(-8).toUpperCase();
  return `${connector.displayName.replace(/\s/g, '')}${hash}`;
}

function getConnectionStats(connector: Connector) {
  // Derive stats from sync history
  const totalIndexed = connector.syncHistory.reduce((sum, e) => sum + e.itemsIndexed, 0);
  const itemsLabel = totalIndexed > 1000000
    ? `${(totalIndexed / 1000000).toFixed(1)}M`
    : totalIndexed > 1000
      ? `${Math.round(totalIndexed / 1000)}k`
      : `${totalIndexed}`;

  // Use seeded-but-varied values per connector
  const seed = connector.id.charCodeAt(0) + connector.id.charCodeAt(1);
  const users = 20 + (seed % 80);
  const groups = 3 + (seed % 20);
  const memberships = groups * (4 + (seed % 8));

  return {
    itemsIndexed: itemsLabel,
    usersIndexed: `${users}k`,
    groupsIndexed: `${groups}k`,
    groupMembershipsIndexed: `${memberships}k`,
  };
}

function getItemErrors(connector: Connector): number {
  return connector.syncHistory.reduce((sum, e) => sum + e.errorCount, 0);
}

export default function ConnectorDetailPanel({ connector, onClose, onEdit }: ConnectorDetailPanelProps) {
  const [activeTab, setActiveTab] = useState<TabId>('details');
  const [copied, setCopied] = useState(false);
  const [isDark, setIsDark] = useState(false);
  useEffect(() => {
    const update = () => setIsDark(document.documentElement.classList.contains('dark'));
    update();
    const observer = new MutationObserver(update);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  const connectionId = formatConnectionId(connector);
  const stats = getConnectionStats(connector);
  const itemErrors = getItemErrors(connector);

  function handleCopy() {
    navigator.clipboard.writeText(connectionId).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  const lastSync = connector.lastSyncAt
    ? new Date(connector.lastSyncAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    : '—';

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

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-x-0 bottom-0 z-40 bg-black/20"
        style={{ top: 48 }}
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className="fixed top-[48px] right-0 z-50 bg-white dark:bg-[#212121] flex flex-col"
        style={{
          height: 'calc(100vh - 48px)',
          width: 474,
          boxShadow: '0px 3.84px 11.52px 0px rgba(0,0,0,0.18), 0px 20.48px 46.08px 0px rgba(0,0,0,0.22)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Header (fixed) ─────────────────────────────── */}
        <div className="flex-shrink-0 bg-white dark:bg-[#212121]">

          {/* Command bar */}
          <div className="flex items-center justify-end h-[38px] px-[6px] gap-[6px]">
            <button
              className="w-8 h-8 flex items-center justify-center rounded hover:bg-[#f3f2f1] dark:hover:bg-[#292929] text-[#323130] dark:text-[#f5f5f5] transition-colors"
              title="Refresh"
            >
              <RefreshIcon style={{ fontSize: 14 }} />
            </button>
            <button
              className="w-8 h-8 flex items-center justify-center rounded hover:bg-[#f3f2f1] dark:hover:bg-[#292929] text-[#323130] dark:text-[#f5f5f5] transition-colors"
              title="Close"
              onClick={onClose}
            >
              <CancelIcon style={{ fontSize: 14 }} />
            </button>
          </div>

          {/* Connector info row */}
          <div className="px-6 pb-3">
            <div className="flex items-start gap-[14px]">
              <ConnectorLogo connectorType={connector.connectorType} logoUrl={connector.logoUrl} />
              <div className="flex flex-col gap-[2px] pt-[2px]">
                <span className="text-[16px] font-bold text-black dark:text-[#f5f5f5] leading-[22px]">
                  {connector.connectorType}
                </span>
                <span className="text-[12px] text-[#323130] dark:text-[#adadad] leading-[16px]">
                  {connector.displayName}
                </span>

                {/* Action buttons */}
                <div className="flex items-center gap-0 mt-[10px]">
                  <CommandBarButton
                    split
                    text="Start full sync"
                    iconProps={{ iconName: 'Sync' }}
                    menuProps={{ items: [{ key: 'incremental', text: 'Incremental sync' }] }}
                    styles={{
                      root: { height: 28, padding: '0 8px', ...(isDark ? { background: 'transparent', borderColor: '#666666' } : {}) },
                      label: { fontSize: 12, ...(isDark ? { color: '#ffffff' } : {}) },
                      icon: isDark ? { color: '#ffffff' } : {},
                      menuIcon: isDark ? { color: '#ffffff' } : {},
                      rootHovered: isDark ? { background: '#3d3d3d' } : {},
                      splitButtonMenuButton: isDark ? { background: 'transparent', borderColor: '#666666' } : {},
                      splitButtonMenuButtonExpanded: isDark ? { background: '#3d3d3d' } : {},
                    }}
                  />
                  <CommandBarButton
                    text="Delete"
                    iconProps={{ iconName: 'Delete' }}
                    styles={{
                      root: { height: 28, padding: '0 8px', ...(isDark ? { background: 'transparent', borderColor: '#666666' } : {}) },
                      label: { fontSize: 12, ...(isDark ? { color: '#ffffff' } : {}) },
                      icon: isDark ? { color: '#ffffff' } : {},
                      rootHovered: isDark ? { background: '#3d3d3d' } : {},
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex items-end gap-[2px] px-6">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={[
                  'flex items-center px-[6px] h-[32px] text-[11px] transition-colors whitespace-nowrap',
                  activeTab === tab.id
                    ? 'font-semibold text-[#323130] dark:text-[#f5f5f5] border-b-[2px] border-[#0078d4] dark:border-[#479ef5]'
                    : 'text-[#323130] dark:text-[#adadad] font-normal hover:text-[#0078d4] dark:hover:text-[#479ef5]',
                ].join(' ')}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* ── Scrollable content ─────────────────────────── */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden">
          <div className="px-6 pt-4 pb-6 flex flex-col gap-4">

            {/* Connection ID */}
            <div className="flex flex-col gap-[4px]">
              <span className="text-[11px] font-semibold text-[#323130] dark:text-[#f5f5f5] leading-[16px]">Connection ID</span>
              <div className="flex items-center gap-1">
                <span className="text-[11px] text-[#484644] dark:text-[#adadad] leading-[16px]">{connectionId}</span>
                <button
                  onClick={handleCopy}
                  className="w-4 h-4 flex items-center justify-center text-[#0078d4] dark:text-[#479ef5] hover:text-[#004e8c] dark:hover:text-[#62abf5] transition-colors flex-shrink-0"
                  title={copied ? 'Copied!' : 'Copy'}
                >
                  <CopyIcon style={{ fontSize: 12 }} />
                </button>
              </div>
            </div>

            {/* Connection stats */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-[3px]">
                    <span className="text-[11px] font-semibold text-[#323130] dark:text-[#f5f5f5] leading-[16px]">Connection stats</span>
                    <InfoIcon style={{ fontSize: 10 }} className="text-[#323130] dark:text-[#f5f5f5]" />
                  </div>
                  <span className="text-[9px] text-[#484644] dark:text-[#adadad] leading-[13px]">Updated at {lastSync}</span>
                </div>
                <button className="flex items-center gap-1 text-[11px] text-[#0078d4] dark:text-[#479ef5] hover:text-[#004e8c] dark:hover:text-[#62abf5] px-1 transition-colors">
                  <RefreshIcon style={{ fontSize: 11 }} />
                  Refresh
                </button>
              </div>

              {/* CAB stat cards — 2x2 grid */}
              <div className="flex flex-col gap-4">
                <div className="flex gap-2">
                  <CabStatCard label="Items indexed" value={stats.itemsIndexed} color="#b68a00" />
                  <CabStatCard label="Users indexed" value={stats.usersIndexed} color="#637cef" />
                </div>
                <div className="flex gap-2">
                  <CabStatCard label="Groups indexed" value={stats.groupsIndexed} color="#9971c5" />
                  <CabStatCard label="Group memberships indexed" value={stats.groupMembershipsIndexed} color="#00a3a5" />
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="h-px bg-[#e1e1e1] dark:bg-[#3d3d3d]" />

            {/* Description */}
            <div className="flex flex-col gap-[3px]">
              <span className="text-[11px] font-semibold text-[#323130] dark:text-[#f5f5f5] leading-[13px]">Description</span>
              <p className="text-[11px] text-[#484644] dark:text-[#adadad] leading-[13px]">
                {`Connector for ${connector.connectorType} — providing search and Copilot access to ${connector.displayName} content.`}
              </p>
              <button className="text-left text-[11px] text-[#0078d4] dark:text-[#479ef5] hover:underline w-fit mt-1">
                Edit description
              </button>
            </div>

            {/* Metadata pairs — row 1 */}
            <div className="flex gap-6">
              <div className="flex flex-col gap-[3px] w-[198px]">
                <span className="text-[11px] font-semibold text-[#323130] dark:text-[#f5f5f5] leading-[16px]">Item errors</span>
                <span className="text-[11px] text-[#484644] dark:text-[#adadad] leading-[16px]">{itemErrors}</span>
              </div>
              <div className="flex flex-col gap-[3px] flex-1">
                <span className="text-[11px] font-semibold text-[#323130] dark:text-[#f5f5f5] leading-[16px]">User and groups errors</span>
                <span className="text-[11px] text-[#484644] dark:text-[#adadad] leading-[16px]">—</span>
              </div>
            </div>

            {/* Metadata pairs — row 2 */}
            <div className="flex gap-6">
              <div className="flex flex-col gap-[3px] w-[198px]">
                <span className="text-[11px] font-semibold text-[#323130] dark:text-[#f5f5f5] leading-[16px]">Data source</span>
                <span className="text-[11px] text-[#484644] dark:text-[#adadad] leading-[16px] break-all">
                  {connector.instanceUrl.replace(/^https?:\/\//, '')}
                </span>
              </div>
              <div className="flex flex-col gap-[3px] flex-1">
                <span className="text-[11px] font-semibold text-[#323130] dark:text-[#f5f5f5] leading-[16px]">Permissions</span>
                <span className="text-[11px] text-[#484644] dark:text-[#adadad] leading-[16px]">
                  Visible only to people with access to this data source
                </span>
              </div>
            </div>

            {/* Metadata pairs — row 3 */}
            <div className="flex gap-6">
              <div className="flex flex-col gap-[3px] w-[198px]">
                <span className="text-[11px] font-semibold text-[#323130] dark:text-[#f5f5f5] leading-[16px]">Schema</span>
                <span className="text-[11px] text-[#484644] dark:text-[#adadad] leading-[16px]">19 properties added</span>
                <button className="text-left text-[11px] text-[#0078d4] dark:text-[#479ef5] hover:underline w-fit">
                  Edit schema
                </button>
              </div>
              <div className="flex flex-col gap-[3px] flex-1">
                <span className="text-[11px] font-semibold text-[#323130] dark:text-[#f5f5f5] leading-[16px]">Last modified at</span>
                <span className="text-[11px] text-[#484644] dark:text-[#adadad] leading-[16px]">{lastModified}</span>
              </div>
            </div>

          </div>
        </div>

        {/* ── Footer ─────────────────────────────────────── */}
        <div className="flex-shrink-0 border-t border-[#e1e1e1] dark:border-[#3d3d3d] px-6 h-[52px] flex items-center gap-2 bg-white dark:bg-[#212121]">
          <button
            onClick={onEdit}
            className="h-[28px] px-4 bg-[#0078d4] dark:bg-[#479ef5] text-white text-[13px] font-semibold rounded-[2px] hover:bg-[#106ebe] dark:hover:bg-[#62abf5] transition-colors"
          >
            Edit
          </button>
        </div>
      </div>
    </>
  );
}
