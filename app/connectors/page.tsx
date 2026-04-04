'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { SearchBox } from '@fluentui/react';
import { Badge, Tooltip, MessageBar, MessageBarBody, MessageBarTitle, MessageBarActions, Button as FButton, FluentProvider, webLightTheme, webDarkTheme } from '@fluentui/react-components';
import { WarningFilled, DismissRegular } from '@fluentui/react-icons';
import { CONNECTORS } from '@/lib/mock-data';
import type { Connector } from '@/lib/types';
import ConnectorDetailPanel from '@/components/connectors/ConnectorDetailPanel';
import EditPanel from '@/components/connectors/EditPanel';
import {
  RefreshIcon, AddIcon, FilterIcon,
  SortUpIcon, SortDownIcon, SortIcon,
  MoreVerticalIcon, InfoIcon,
  ErrorBadgeIcon, WarningSolidIcon,
  DeleteIcon,
} from '@fluentui/react-icons-mdl2';

function StatusBadge({ status, blockerCount }: { status: string; blockerCount: number }) {
  if (blockerCount > 0) {
    return (
      <Tooltip content="Action required" relationship="label"><Badge appearance="ghost" color="danger" size="large" shape="circular" icon={<WarningFilled fontSize={16} />} /></Tooltip>
    );
  }
  if (status === 'error') return (
    <span className="flex items-center gap-1.5 text-[13px] text-[#a80000]">
      <ErrorBadgeIcon style={{ fontSize: 14 }} />
      Error
    </span>
  );
  if (status === 'pending') return (
    <span className="flex items-center gap-1.5 text-[13px] text-[#323130]">
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <circle cx="7" cy="7" r="7" fill="#0078d4" />
        <path d="M7 3.5A3.5 3.5 0 0 1 10.5 7" stroke="white" strokeWidth="1.3" strokeLinecap="round" fill="none"/>
        <path d="M7 10.5A3.5 3.5 0 0 1 3.5 7" stroke="white" strokeWidth="1.3" strokeLinecap="round" fill="none"/>
        <path d="M10.5 7l-1.2-.8M10.5 7l-.8 1.2" stroke="white" strokeWidth="1.1" strokeLinecap="round"/>
        <path d="M3.5 7l1.2.8M3.5 7l.8-1.2" stroke="white" strokeWidth="1.1" strokeLinecap="round"/>
      </svg>
      Syncing
    </span>
  );
  return (
    <span className="flex items-center gap-1.5 text-[13px] text-[#107c10]">
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <circle cx="7" cy="7" r="7" fill="#107c10" />
        <path d="M4 7l2 2 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
      Ready
    </span>
  );
}

function ConnectorLogo({ type, logoUrl }: { type: string; logoUrl?: string }) {
  const initials = type.split(' ').slice(0, 2).map((w) => w[0]).join('');
  if (logoUrl) {
    return (
      <div className="w-8 h-8 flex-shrink-0 rounded-[4px] overflow-hidden">
        <img src={logoUrl} alt={type} className="w-full h-full object-cover" />
      </div>
    );
  }
  return (
    <div className="w-8 h-8 rounded-full bg-[#0d2137] flex items-center justify-center flex-shrink-0">
      <span className="text-[11px] font-bold text-white">{initials}</span>
    </div>
  );
}

function formatLastSync(date?: string): string {
  if (!date) return '—';
  const d = new Date(date);
  const time = d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  const diff = Date.now() - d.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 2) return `Now · ${time}`;
  if (mins < 60) return `${mins} mins ago · ${time}`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs === 1 ? '1 hour' : `${hrs} hours`} ago · ${time}`;
  const days = Math.floor(hrs / 24);
  if (days === 1) return `Yesterday · ${time}`;
  if (days < 7) return `${days} days ago · ${time}`;
  return `${d.toLocaleDateString('en-US', { day: 'numeric', month: 'short' })} · ${time}`;
}

type SortKey = 'displayName' | 'connectorType' | 'healthStatus' | 'lastSyncAt';

export default function ConnectorsPage() {
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>('connectorType');
  const [sortAsc, setSortAsc] = useState(true);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [selectedConnector, setSelectedConnector] = useState<Connector | null>(null);
  const [editConnector, setEditConnector] = useState<Connector | null>(null);
  const [authBannerDismissed, setAuthBannerDismissed] = useState(false);
  const [openToAuth, setOpenToAuth] = useState(false);
  const [isDark, setIsDark] = useState(false);

  const hrPoliciesConnector = CONNECTORS.find((c) => c.id === 'hr-policies');

  useEffect(() => {
    const update = () => setIsDark(document.documentElement.classList.contains('dark'));
    update();
    const observer = new MutationObserver(update);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  function handleSort(key: SortKey) {
    if (sortKey === key) setSortAsc((v) => !v);
    else { setSortKey(key); setSortAsc(true); }
  }

  const filtered = useMemo(() =>
    CONNECTORS.filter((c) =>
      c.displayName.toLowerCase().includes(search.toLowerCase()) ||
      c.connectorType.toLowerCase().includes(search.toLowerCase())
    ),
    [search]
  );

  const sorted = useMemo(() =>
    [...filtered].sort((a, b) => {
      const av = (a[sortKey] ?? '') as string;
      const bv = (b[sortKey] ?? '') as string;
      return sortAsc ? av.localeCompare(bv) : bv.localeCompare(av);
    }),
    [filtered, sortKey, sortAsc]
  );

  function SortIndicator({ col }: { col: SortKey }) {
    if (sortKey !== col) return <SortIcon style={{ fontSize: 10 }} className="opacity-40 text-[#323130]" />;
    if (sortAsc) return <SortUpIcon style={{ fontSize: 10 }} className="text-[#0078d4]" />;
    return <SortDownIcon style={{ fontSize: 10 }} className="text-[#0078d4]" />;
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#141414]" onClick={() => setOpenMenu(null)}>

      {/* ── Page header ───────────────────────────────────────────── */}
      <div className="pt-3 pb-0 px-4 sm:px-8 lg:px-12">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-1 text-[12px] text-[#616161] dark:text-[#adadad] mb-4">
          <Link href="/" className="hover:text-[#0078d4] dark:hover:text-[#479ef5] hover:underline">Home</Link>
          <span className="text-[#c8c6c4] dark:text-[#555555]">›</span>
          <span className="text-[#242424] dark:text-[#f5f5f5]">Connectors</span>
        </nav>

        {/* Title */}
        <h1 className="text-[28px] font-bold text-[#323130] dark:text-[#f5f5f5] leading-[36px] mb-6">Connectors</h1>

        {/* Tabs — directly below title */}
        <div className="flex">
          <Link
            href="/connectors/gallery"
            className="pb-2 mr-6 text-[14px] text-[#424242] dark:text-[#adadad] border-b-2 border-transparent -mb-px hover:text-[#0078d4] dark:hover:text-[#479ef5] transition-colors"
          >
            Gallery
          </Link>
          <button className="pb-2 mr-6 text-[14px] font-semibold text-[#0078d4] dark:text-[#479ef5] border-b-2 border-[#0078d4] dark:border-[#479ef5] -mb-px">
            Your connections
          </button>
        </div>
      </div>

      {/* Description — below tabs, above command bar */}
      <div className="pt-8 pb-8 px-4 sm:px-8 lg:px-12 flex items-center justify-between">
        <p className="text-[14px] text-[#605e5c] dark:text-[#adadad]">
          Connect your organization&apos;s data to improve insights and information provided by Copilot, agents, and Microsoft Search.
        </p>
        <Link href="/onboarding" className="text-[13px] text-[#0078d4] dark:text-[#479ef5] hover:underline whitespace-nowrap ml-8 flex-shrink-0">
          New here? Get started →
        </Link>
      </div>


{/* ── Command bar ───────────────────────────────────────────── */}
      <div className="px-4 sm:px-8 lg:px-12">
        <div className="border-t border-[#edebe9] dark:border-[#333333]" />
      </div>
      <div className="flex items-center justify-between h-[44px] px-4 sm:px-8 lg:px-12">
        {/* Left actions */}
        <div className="flex items-center h-full">
          <Link
            href="/connectors/gallery"
            className="flex items-center gap-1.5 h-full px-3 text-[14px] text-[#0078d4] dark:text-[#479ef5] font-semibold hover:bg-[#f3f2f1] dark:hover:bg-[#292929] transition-colors"
          >
            <AddIcon style={{ fontSize: 14 }} />
            Add connection
          </Link>
          <button className="flex items-center gap-1.5 h-full px-3 text-[14px] text-[#323130] dark:text-[#f5f5f5] hover:bg-[#f3f2f1] dark:hover:bg-[#292929] transition-colors">
            <RefreshIcon style={{ fontSize: 14 }} />
            Refresh
          </button>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2 h-full">
          <span className="text-[13px] text-[#323130] dark:text-[#f5f5f5]">{sorted.length} items</span>
          <button className="flex items-center gap-1 text-[14px] text-[#323130] dark:text-[#f5f5f5] hover:bg-[#f3f2f1] dark:hover:bg-[#292929] px-2 h-full transition-colors">
            <FilterIcon style={{ fontSize: 14 }} />
            Filter
          </button>
          {/* Search box — Fluent v8 */}
          <SearchBox
            placeholder="Search"
            value={search}
            onChange={(_, v) => setSearch(v ?? '')}
            onClear={() => setSearch('')}
            styles={{ root: { width: 182, height: 26 } }}
          />
        </div>
      </div>

      {/* ── Table ─────────────────────────────────────────────────── */}
      <div className="px-4 sm:px-8 lg:px-12 overflow-x-auto">
        <table className="w-full border-collapse min-w-[480px]">
          <thead>
            <tr className="border-b border-[#edebe9] dark:border-[#333333]">
              <th className="py-0 pr-4 text-left w-1/4">
                <button
                  className="flex items-center gap-1 h-[36px] text-[12px] font-semibold text-[#323130] dark:text-[#f5f5f5] hover:text-[#0078d4] dark:hover:text-[#479ef5] transition-colors"
                  onClick={() => handleSort('connectorType')}
                >
                  Source name
                  <SortIndicator col="connectorType" />
                </button>
              </th>
              <th className="py-0 pr-4 text-left w-1/4">
                <div className="flex items-center gap-1 h-[36px]">
                  <span className="text-[12px] font-semibold text-[#323130] dark:text-[#f5f5f5]">Connection name</span>
                  <InfoIcon style={{ fontSize: 12 }} className="text-[#605e5c] dark:text-[#adadad]" />
                </div>
              </th>
              <th className="py-0 pr-4 text-left w-1/4 hidden sm:table-cell">
                <button
                  className="flex items-center gap-1 h-[36px] text-[12px] font-semibold text-[#323130] dark:text-[#f5f5f5] hover:text-[#0078d4] dark:hover:text-[#479ef5] transition-colors"
                  onClick={() => handleSort('healthStatus')}
                >
                  Connection State
                  <SortIndicator col="healthStatus" />
                </button>
              </th>
              <th className="py-0 text-left w-1/4 hidden md:table-cell">
                <button
                  className="flex items-center gap-1 h-[36px] text-[12px] font-semibold text-[#323130] dark:text-[#f5f5f5] hover:text-[#0078d4] dark:hover:text-[#479ef5] transition-colors"
                  onClick={() => handleSort('lastSyncAt')}
                >
                  Last sync
                  <SortIndicator col="lastSyncAt" />
                </button>
              </th>
            </tr>
          </thead>

          <tbody>
            {sorted.map((connector) => (
              <tr
                key={connector.id}
                className={`border-b border-[#f3f2f1] dark:border-[#2e2e2e] hover:bg-[#faf9f8] dark:hover:bg-[#1f1f1f] transition-colors group cursor-pointer relative ${openMenu === connector.id ? 'z-10' : ''}`}
                onClick={() => setSelectedConnector(connector)}
              >
                {/* Source name */}
                <td className="py-0 pr-4 w-1/4 relative" onClick={(e) => e.stopPropagation()}>
                  <div className="h-12 flex items-center gap-2 min-w-0" onClick={() => setSelectedConnector(connector)}>
                    <ConnectorLogo type={connector.connectorType} logoUrl={connector.logoUrl} />
                    <span className="text-[14px] text-[#323130] dark:text-[#f5f5f5] truncate">{connector.connectorType}</span>
                    {(connector.blockerCount + connector.warningCount) > 0 && (
                      <Tooltip content="Action required" relationship="label"><Badge appearance="ghost" color="danger" size="large" shape="circular" icon={<WarningFilled fontSize={16} />} style={{ flexShrink: 0 }} /></Tooltip>
                    )}
                  </div>
                  {/* Overflow button — right edge of first column */}
                  <button
                    className="absolute right-6 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 w-7 h-7 flex items-center justify-center rounded hover:bg-[#edebe9] dark:hover:bg-[#333333] text-[#605e5c] dark:text-[#adadad] transition-all"
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenMenu(openMenu === connector.id ? null : connector.id);
                    }}
                  >
                    <MoreVerticalIcon style={{ fontSize: 16 }} />
                  </button>
                  {openMenu === connector.id && (
                    <div
                      className="absolute right-6 top-12 bg-white dark:bg-[#292929] border border-[#e1e1e1] dark:border-[#444444] rounded-[4px] shadow-[0px_4px_8px_rgba(0,0,0,0.14)] z-50 w-44"
                      onClick={(e) => { e.stopPropagation(); setOpenMenu(null); }}
                    >
                      <button
                        onClick={() => setSelectedConnector(connector)}
                        className="block w-full text-left px-4 py-2 text-[14px] text-[#323130] dark:text-[#f5f5f5] hover:bg-[#f5f5f5] dark:hover:bg-[#383838]"
                      >
                        View details
                      </button>
                    </div>
                  )}
                </td>

                {/* Connection name */}
                <td className="py-0 pr-4">
                  <div className="h-12 flex items-center gap-2 min-w-0">
                    <span className="text-[14px] text-[#323130] dark:text-[#f5f5f5] truncate">{connector.displayName}</span>
                  </div>
                </td>

                {/* Connection State */}
                <td className="py-0 pr-4 w-1/4 hidden sm:table-cell">
                  <div className="h-12 flex items-center">
                    <StatusBadge status={connector.healthStatus} blockerCount={0} />
                  </div>
                </td>

                {/* Last sync */}
                <td className="py-0 w-1/4 hidden md:table-cell">
                  <div className="h-12 flex items-center text-[13px] text-[#605e5c] dark:text-[#adadad]">
                    {formatLastSync(connector.lastSyncAt)}
                  </div>
                </td>

              </tr>
            ))}

            {sorted.length === 0 && (
              <tr>
                <td colSpan={4} className="py-12 text-center text-[14px] text-[#605e5c] dark:text-[#adadad]">
                  No connections found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {selectedConnector && (
        <ConnectorDetailPanel
          connector={selectedConnector}
          onClose={() => setSelectedConnector(null)}
          onEdit={() => { setEditConnector(selectedConnector); setSelectedConnector(null); }}
        />
      )}
      {editConnector && (
        <EditPanel
          connector={editConnector}
          onClose={() => { setEditConnector(null); setOpenToAuth(false); }}
          initialFieldFocus={openToAuth ? { tab: 'Setup', fieldId: 'auth-credentials' } : undefined}
        />
      )}
    </div>
  );
}
