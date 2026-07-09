'use client';

import { useState, useMemo, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { SearchBox, Pivot, PivotItem, Text, CommandBar, type ICommandBarItemProps } from '@fluentui/react';
import {
  DataGrid, DataGridHeader, DataGridHeaderCell, DataGridBody, DataGridRow, DataGridCell,
  createTableColumn, TableColumnDefinition, Badge, Tooltip, PresenceBadge, FluentProvider, webLightTheme, webDarkTheme,
  Skeleton, SkeletonItem, Button, Tag, Menu, MenuTrigger, MenuPopover, MenuList, MenuItem,
  Table, TableHeader, TableHeaderCell as FluentTableHeaderCell, TableRow as FluentTableRow,
} from '@fluentui/react-components';
import { CONNECTORS } from '@/lib/mock-data';
import type { Connector } from '@/lib/types';
import ConnectorDetailPanel from '@/components/connectors/ConnectorDetailPanel';
import EditPanel from '@/components/connectors/EditPanel';
import {
  RefreshIcon, AddIcon, FilterIcon,
  MoreVerticalIcon, InfoIcon,
  ErrorBadgeIcon,
  CircleAdditionIcon, PageArrowRightIcon,
} from '@fluentui/react-icons-mdl2';
import { CONNECTOR_CATALOG, CATEGORIES, type ConnectorCatalogItem } from '@/lib/gallery-data';
import SetupPanel from '@/components/connectors/SetupPanel';
import ISVPanel, { CONNECTOR_DETAILS } from '@/components/connectors/ISVPanel';
import TourOverlay from '@/components/tour/TourOverlay';

// ── Shared helpers ────────────────────────────────────────────────────────────

function StatusBadge({ status, blockerCount }: { status: string; blockerCount: number }) {
  if (blockerCount > 0) {
    return (
      <span className="flex items-center gap-1.5 text-[13px] text-[#a80000]">
        <PresenceBadge status="busy" size="small" />
        3 Needs action
      </span>
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
      Active
    </span>
  );
}

// ── Connections-tab helpers ───────────────────────────────────────────────────

function ConnectionsLogo({ type, logoUrl }: { type: string; logoUrl?: string }) {
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

function formatElapsed(s: number): string {
  const d = Math.floor(s / 86400);
  const h = Math.floor((s % 86400) / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  if (d > 0) return `${d}d ${h}h ${m}m ${sec}s`;
  if (h > 0) return `${h}h ${m}m ${sec}s`;
  if (m > 0) return `${m}m ${sec}s`;
  return `${sec}s`;
}

function SyncingElapsedCell({ startedAt }: { startedAt: string }) {
  const [elapsed, setElapsed] = useState(Math.floor((Date.now() - new Date(startedAt).getTime()) / 1000));
  useEffect(() => {
    const id = setInterval(() => setElapsed(Math.floor((Date.now() - new Date(startedAt).getTime()) / 1000)), 1000);
    return () => clearInterval(id);
  }, [startedAt]);
  return (
    <span className="text-[13px] text-[#605e5c] dark:text-[#adadad]">
      {formatElapsed(elapsed)}
    </span>
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

function StructureFilterChip({ label, options }: { label: string; options: string[] }) {
  return (
    <Menu positioning="below-start">
      <MenuTrigger disableButtonEnhancement>
        <Button appearance="outline" shape="circular" size="small">
          {label}
        </Button>
      </MenuTrigger>
      <MenuPopover>
        <MenuList>
          {options.map((option) => (
            <MenuItem key={`${label}-${option}`}>
              {option}
            </MenuItem>
          ))}
        </MenuList>
      </MenuPopover>
    </Menu>
  );
}

// ── Gallery-tab helpers ───────────────────────────────────────────────────────

function GalleryLogo({ color, initials, logoUrl, logoBg }: { color: string; initials: string; logoUrl?: string; logoBg?: string }) {
  const [imgFailed, setImgFailed] = useState(false);

  if (logoUrl && !imgFailed) {
    return (
      <div
        className="shrink-0 w-12 h-12 rounded-[4px] overflow-hidden flex items-center justify-center"
        style={{ backgroundColor: logoBg ?? '#ffffff' }}
      >
        <img
          src={logoUrl}
          alt={initials}
          className="w-full h-full object-contain"
          onError={() => setImgFailed(true)}
        />
      </div>
    );
  }
  return (
    <div
      className="shrink-0 w-12 h-12 rounded-[4px] flex items-center justify-center text-white text-[13px] font-semibold"
      style={{ backgroundColor: color }}
    >
      {initials}
    </div>
  );
}

function ConnectorTile({ connector, onAdd, onSelect, selected }: {
  connector: ConnectorCatalogItem;
  onAdd: (name: string) => void;
  onSelect: (c: ConnectorCatalogItem) => void;
  selected: boolean;
}) {
  return (
    <div
      className="bg-white dark:bg-[#141414] border rounded-[4px] flex items-center gap-3 p-4 transition-all border-transparent dark:border-[#3d3d3d] [box-shadow:0px_2px_4px_0px_rgba(0,0,0,0.14),0px_0px_2px_0px_rgba(0,0,0,0.12)] hover:[box-shadow:0px_4px_8px_0px_rgba(0,0,0,0.14),0px_0px_2px_0px_rgba(0,0,0,0.12)] dark:hover:border-[#525252] dark:hover:bg-[#1f1f1f]"
    >
      <GalleryLogo color={connector.logoColor} initials={connector.logoInitials} logoUrl={connector.logoUrl} logoBg={connector.logoBg} />
      <div className="flex-1 min-w-0 flex flex-col gap-1">
        <p className="text-[14px] font-semibold leading-5 text-[#242424] dark:text-[#d6d6d6] truncate">{connector.name}</p>
        <p className="text-[12px] leading-4 text-[#616161] dark:text-[#adadad] truncate">{connector.publisher}</p>
        <p className="text-[12px] leading-4 text-[#616161] dark:text-[#adadad] truncate">{connector.description}</p>
      </div>
      <button
        onClick={() => CONNECTOR_DETAILS[connector.id] ? onSelect(connector) : onAdd(connector.name)}
        className="shrink-0 px-3 py-[5px] text-[14px] font-semibold text-[#242424] dark:text-[#d6d6d6] bg-white dark:bg-transparent border border-[#d1d1d1] dark:border-[#4d4d4d] rounded-[4px] hover:bg-[#f5f5f5] dark:hover:bg-[#ffffff1a] dark:hover:border-[#606060] transition-colors whitespace-nowrap"
      >
        Add
      </button>
    </div>
  );
}

function SectionGrid({ connectors, onAdd, onSelect, selectedId }: {
  connectors: ConnectorCatalogItem[];
  onAdd: (name: string) => void;
  onSelect: (c: ConnectorCatalogItem) => void;
  selectedId: string | null;
}) {
  return (
    <>
      <style>{`
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
      <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-4">
        {connectors.map((c, i) => (
          <div
            key={c.id}
            style={{
              animation: 'slideDown 0.25s ease both',
              animationDelay: `${Math.min(i * 30, 300)}ms`,
            }}
          >
            <ConnectorTile connector={c} onAdd={onAdd} onSelect={onSelect} selected={selectedId === c.id} />
          </div>
        ))}
      </div>
    </>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

function ConnectorsPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tourParam = searchParams.get('tour');
  const showWalkthroughTag = Boolean(tourParam);

  // Tab state
  const [tab, setTab] = useState<'connections' | 'gallery'>('connections');

  // Connections-tab state
  const [connectors, setConnectors] = useState<Connector[]>(CONNECTORS);
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>('lastSyncAt');
  const [sortAsc, setSortAsc] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [selectedConnector, setSelectedConnector] = useState<Connector | null>(null);
  const [editConnector, setEditConnector] = useState<Connector | null>(null);
  const [openToAuth, setOpenToAuth] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1280);
  useEffect(() => { setMounted(true); }, []);
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  const gridSize = windowWidth < 900 ? 'small' : 'medium';

  // Gallery-tab state
  const [gallerySearch, setGallerySearch] = useState('');
  const [galleryFilter, setGalleryFilter] = useState<'all' | 'recommended'>('all');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [setupType, setSetupType] = useState<string | null>(null);

  const commandItems: ICommandBarItemProps[] = [
    {
      key: 'addConnection',
      text: 'Add Connection',
      iconProps: { iconName: 'Add' },
      onClick: () => {
        setTab('gallery');
      },
    },
    {
      key: 'refreshConnections',
      text: 'Refresh',
      iconProps: { iconName: 'Refresh' },
      onClick: () => {},
    },
  ];

  const commandFarItems: ICommandBarItemProps[] = [
    {
      key: 'chooseColumns',
      text: 'Choose columns',
      iconProps: { iconName: 'ColumnOptions' },
      onClick: () => {},
    },
  ];
  const [selectedGalleryConnector, setSelectedGalleryConnector] = useState<ConnectorCatalogItem | null>(null);

  useEffect(() => {
    const update = () => setIsDark(document.documentElement.classList.contains('dark'));
    update();
    const observer = new MutationObserver(update);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(t);
  }, []);

  // Connections tab logic
  function handleSort(key: SortKey) {
    if (sortKey === key) setSortAsc((v) => !v);
    else { setSortKey(key); setSortAsc(true); }
  }

  const filtered = useMemo(() =>
    connectors.filter((c) =>
      c.displayName.toLowerCase().includes(search.toLowerCase()) ||
      c.connectorType.toLowerCase().includes(search.toLowerCase())
    ),
    [connectors, search]
  );

  const sorted = useMemo(() =>
    [...filtered].sort((a, b) => {
      // User-created connectors always float to the top
      if (a.userCreated && !b.userCreated) return -1;
      if (!a.userCreated && b.userCreated) return 1;
      const av = (a[sortKey] ?? '') as string;
      const bv = (b[sortKey] ?? '') as string;
      return sortAsc ? av.localeCompare(bv) : bv.localeCompare(av);
    }),
    [filtered, sortKey, sortAsc]
  );

  const columnSizingOptions = {
    connectorType: { minWidth: 620, defaultWidth: 760 },
    displayName: { minWidth: 180, defaultWidth: 220 },
    healthStatus: { minWidth: 180, defaultWidth: 220 },
    type: { minWidth: 120, defaultWidth: 150 },
    lastSyncAt: { minWidth: 180, defaultWidth: 220 },
  };

  const columns: TableColumnDefinition<Connector>[] = [
    createTableColumn<Connector>({
      columnId: 'connectorType',
      renderHeaderCell: () => <span className="font-semibold">Connection name</span>,
      renderCell: (item) => (
        <div className="flex items-center gap-2 min-w-0 w-full relative pr-10">
          <ConnectionsLogo type={item.connectorType} logoUrl={item.logoUrl} />
          <span className="text-[14px] truncate">{item.displayName}</span>
          {(item.blockerCount + item.warningCount) > 0 && (
            <button
              className="flex items-center gap-1.5 text-[12px] text-[#a80000] flex-shrink-0 ml-3 hover:underline cursor-pointer bg-transparent border-none p-0"
              onClick={(e) => { e.stopPropagation(); setEditConnector(item); }}
              data-tour-badge={item.id === 'azure-devops' ? 'true' : undefined}
              data-tour={item.id === 'azure-devops' ? 'connector-row-azure-devops' : undefined}
            >
              <PresenceBadge status="busy" size="extra-small" style={{ width: 8, height: 8 }} />
              3 Needs action
            </button>
          )}
          <button
            className="absolute right-1 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center rounded hover:bg-[#edebe9] dark:hover:bg-[#333333] text-[#605e5c] dark:text-[#adadad] transition-all"
            onClick={(e) => { e.stopPropagation(); setOpenMenu(openMenu === item.id ? null : item.id); }}
          >
            <MoreVerticalIcon style={{ fontSize: 16 }} />
          </button>
          {openMenu === item.id && (
            <div
              className="absolute right-1 top-[calc(50%+20px)] bg-white dark:bg-[#292929] border border-[#e1e1e1] dark:border-[#444444] rounded-[4px] shadow-[0px_4px_8px_rgba(0,0,0,0.14)] z-50 w-44"
              onClick={(e) => { e.stopPropagation(); setOpenMenu(null); }}
            >
              <button
                onClick={() => setSelectedConnector(item)}
                className="block w-full text-left px-4 py-2 text-[14px] hover:bg-[#f5f5f5] dark:hover:bg-[#383838]"
              >View details</button>
              {item.userCreated && (
                <button
                  onClick={() => setConnectors((prev) => prev.filter((c) => c.id !== item.id))}
                  className="block w-full text-left px-4 py-2 text-[14px] text-[#d13438] hover:bg-[#f5f5f5] dark:hover:bg-[#383838]"
                >Delete</button>
              )}
            </div>
          )}
        </div>
      ),
      compare: (a, b) => a.connectorType.localeCompare(b.connectorType),
    }),
    createTableColumn<Connector>({
      columnId: 'displayName',
      renderHeaderCell: () => 'Display name',
      renderCell: (item) => <span className="text-[14px] truncate">{item.connectorType}</span>,
      compare: (a, b) => a.displayName.localeCompare(b.displayName),
    }),
    createTableColumn<Connector>({
      columnId: 'healthStatus',
      renderHeaderCell: () => 'Connection state',
      renderCell: (item) => <StatusBadge status={item.healthStatus} blockerCount={0} />,
      compare: (a, b) => a.healthStatus.localeCompare(b.healthStatus),
    }),
    createTableColumn<Connector>({
      columnId: 'type',
      renderHeaderCell: () => 'Type',
      renderCell: () => (
        <Tag shape="rounded" appearance="filled" size="small">
          Synced
        </Tag>
      ),
      compare: () => 0,
    }),
    createTableColumn<Connector>({
      columnId: 'lastSyncAt',
      renderHeaderCell: () => 'Last sync time',
      renderCell: (item) => (
        item.healthStatus === 'pending' && item.syncHistory?.[0]?.startedAt
          ? <SyncingElapsedCell startedAt={item.syncHistory[0].startedAt} />
          : <span className="text-[13px] text-[#605e5c] dark:text-[#adadad]">
              {item.userCreated && !item.lastSyncAt ? 'Now' : formatLastSync(item.lastSyncAt)}
            </span>
      ),
      compare: (a, b) => (a.lastSyncAt ?? '').localeCompare(b.lastSyncAt ?? ''),
    }),
  ];

  // Gallery tab logic
  const galleryFiltered = useMemo(() => {
    return CONNECTOR_CATALOG.filter((c) => {
      if (galleryFilter === 'recommended' && !c.recommended) return false;
      if (activeCategory && c.category !== activeCategory) return false;
      if (gallerySearch) {
        const q = gallerySearch.toLowerCase();
        return c.name.toLowerCase().includes(q) || c.description.toLowerCase().includes(q);
      }
      return true;
    });
  }, [gallerySearch, galleryFilter, activeCategory]);

  const recommended = galleryFiltered.filter((c) => c.recommended);
  const byCategory = CATEGORIES.map((cat) => ({
    label: cat,
    items: galleryFiltered.filter((c) => c.category === cat && !c.recommended),
  })).filter((g) => g.items.length > 0);

  const showRecommended = galleryFilter !== 'recommended' && !activeCategory && !gallerySearch && recommended.length > 0;

  if (!mounted) {
    return <div className="min-h-screen bg-white dark:bg-[#141414]" />;
  }

  return (
    <div
      className={`bg-white dark:bg-[#141414] ${tab === 'gallery' ? 'h-screen overflow-hidden flex flex-col' : 'min-h-screen'}`}
      onClick={() => setOpenMenu(null)}
    >
      <Suspense><TourOverlay /></Suspense>

      {/* ── Page header ───────────────────────────────────────────── */}
      <div className="shrink-0 pt-5 pb-0 px-4 sm:px-8 lg:px-12 bg-white dark:bg-[#141414] z-10">
        <nav style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: isDark ? '#c8c6c4' : '#605e5c', marginBottom: 11 }}>
          <span onClick={() => router.push('/')} style={{ cursor: 'pointer', color: isDark ? '#c8c6c4' : '#605e5c' }} onMouseOver={e => (e.currentTarget.style.color = isDark ? '#f5f5f5' : '#0078d4')} onMouseOut={e => (e.currentTarget.style.color = isDark ? '#c8c6c4' : '#605e5c')}>Home</span>
          <span style={{ opacity: 0.5 }}>›</span>
          <span style={{ color: isDark ? '#f5f5f5' : '#323130' }}>Connectors</span>
        </nav>
        <Text
          variant="xxLarge"
          styles={{ root: { fontSize: 28, fontWeight: 700, lineHeight: 'normal', display: 'block', marginBottom: 27, color: isDark ? '#f5f5f5' : undefined } }}
        >
          Connectors
        </Text>
        {showWalkthroughTag && (
          <div style={{ marginBottom: 18 }}>
            <span style={{
              display: 'inline-flex',
              gap: 6,
              alignItems: 'center',
              fontSize: 12,
              fontWeight: 600,
              color: '#107c10',
              background: '#dff6dd',
              borderRadius: 999,
              padding: '6px 12px',
            }}>
              ▶ Walkthrough
            </span>
          </div>
        )}
        <Pivot
          selectedKey={tab}
          onLinkClick={(item) => {
            if (item?.props.itemKey === 'gallery') setTab('gallery');
            else if (item?.props.itemKey === 'connections') setTab('connections');
          }}
          styles={{
            root: { marginLeft: -12 },
            link: { height: 44, padding: '12px', lineHeight: '20px', color: isDark ? '#c8c6c4' : undefined, selectors: { ':hover': { color: isDark ? '#f5f5f5' : undefined, backgroundColor: isDark ? '#2d2d2d' : undefined } } },
            linkIsSelected: { color: isDark ? '#f5f5f5' : undefined, selectors: { '::before': { backgroundColor: isDark ? '#479ef5' : undefined } } },
          }}
        >
          <PivotItem headerText="Gallery" itemKey="gallery" />
          <PivotItem headerText="Your connections" itemKey="connections" />
        </Pivot>
        {tab === 'gallery' && <div className="mt-6 border-b border-[#e1e1e1] dark:border-[#3d3d3d]" />}
      </div>

      {/* ── Tab content ───────────────────────────────────────────── */}

      {tab === 'connections' && (
        <>
          {/* Description — below tabs, above command bar */}
          <div className="pt-8 pb-8 px-4 sm:px-8 lg:px-12 flex items-center justify-between">
            <p className="text-[14px] text-[#605e5c] dark:text-[#adadad]">
              Connect your organization&apos;s data to improve insights and information provided by Copilot, agents, and Microsoft Search.
            </p>
          </div>

          {/* ── Toolbar ───────────────────────────────────────────── */}
          <div className="px-4 sm:px-8 lg:px-12">
            <div className="border-t border-[#edebe9] dark:border-[#333333]">
              <div className="flex flex-col gap-5 pt-2 pb-4">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex-1 min-w-0">
                  <CommandBar
                    items={commandItems}
                    farItems={commandFarItems}
                    styles={{
                      root: {
                        paddingLeft: 0,
                        paddingRight: 0,
                        backgroundColor: 'transparent',
                      },
                      primarySet: { gap: 8 },
                      secondarySet: { gap: 8 },
                    }}
                  />
                </div>
                <div className="flex items-center justify-between lg:justify-end">
                  <SearchBox
                    placeholder="Search"
                    value={search}
                    onChange={(_, v) => setSearch(v ?? '')}
                    onClear={() => setSearch('')}
                    styles={{
                      root: {
                        width: 248,
                        height: 38,
                        backgroundColor: isDark ? '#141414' : '#ffffff',
                        border: isDark ? '1px solid #555' : '1px solid #d1d1d1',
                      },
                      field: { backgroundColor: isDark ? '#141414' : undefined, color: isDark ? '#f5f5f5' : undefined },
                      icon: { color: isDark ? '#adadad' : undefined },
                      clearButton: { color: isDark ? '#adadad' : undefined },
                    }}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <span className={`text-[14px] font-semibold ${isDark ? 'text-[#f5f5f5]' : 'text-[#323130]'}`}>Filters:</span>
                <div className="flex flex-wrap items-center gap-3">
                  <StructureFilterChip label="Connection state" options={['Ready', 'Failed', 'Draft']} />
                  <StructureFilterChip label="Type" options={['MCP', 'Synced']} />
                  <StructureFilterChip label="Connector" options={['ServiceNow', 'Salesforce', 'Jira']} />
                </div>
              </div>
            </div>
            </div>
          </div>

          {/* ── DataGrid (v9) ─────────────────────────────────────────── */}
          <div className="px-4 sm:px-8 lg:px-12 pt-4" onClick={() => setOpenMenu(null)}>
            <FluentProvider theme={isDark ? webDarkTheme : webLightTheme} style={{ background: 'transparent' }}>
              {loading ? (
                <div>
                  {/* Skeleton header */}
                  <Table aria-label="Connections loading header" style={{ width: '100%' }}>
                    <TableHeader>
                      <FluentTableRow>
                        {['Connection name', 'Display name', 'Connection state', 'Type', 'Last sync time'].map((label) => (
                          <FluentTableHeaderCell key={label} style={{ color: isDark ? '#adadad' : '#605e5c', fontSize: 12, fontWeight: 600 }}>
                            {label}
                          </FluentTableHeaderCell>
                        ))}
                      </FluentTableRow>
                    </TableHeader>
                  </Table>
                  {/* Skeleton rows */}
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} style={{ display: 'flex', borderBottom: `1px solid ${isDark ? '#2e2e2e' : '#f3f2f1'}`, minHeight: 48, alignItems: 'center', padding: '0 12px' }}>
                      <Skeleton style={{ flex: 1, paddingRight: 12 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <SkeletonItem shape="circle" size={32} style={{ flexShrink: 0 }} />
                          <SkeletonItem size={16} style={{ width: '60%' }} />
                        </div>
                      </Skeleton>
                      <Skeleton style={{ flex: 1, paddingRight: 12 }}><SkeletonItem size={16} style={{ width: '65%' }} /></Skeleton>
                      <Skeleton style={{ flex: 1, paddingRight: 12 }}><SkeletonItem size={16} style={{ width: '50%' }} /></Skeleton>
                      <Skeleton style={{ flex: 1, paddingRight: 12 }}><SkeletonItem size={16} style={{ width: '35%' }} /></Skeleton>
                      <Skeleton style={{ flex: 1 }}><SkeletonItem size={16} style={{ width: '55%' }} /></Skeleton>
                    </div>
                  ))}
                </div>
              ) : (
                <DataGrid
                  items={sorted}
                  columns={columns}
                  resizableColumns
                  columnSizingOptions={columnSizingOptions}
                  sortable
                  size={gridSize}
                  getRowId={(item) => item.id}
                  style={{ width: '100%' }}
                >
                  <DataGridHeader>
                    <DataGridRow>
                      {(col) => (
                        <DataGridHeaderCell
                          style={{
                            fontWeight: 600,
                            ...(col.columnId === 'connectorType' ? { minWidth: 460, width: 460 } : {}),
                          }}
                        >
                          {col.renderHeaderCell()}
                        </DataGridHeaderCell>
                      )}
                    </DataGridRow>
                  </DataGridHeader>
                  <DataGridBody<Connector>>
                    {({ item }) => (
                      <DataGridRow<Connector>
                        key={item.id}
                        style={{ cursor: 'pointer', minHeight: 48 }}
                        onClick={() => setSelectedConnector(item)}
                      >
                        {(col) => (
                          <DataGridCell
                            style={{
                              minHeight: 48,
                              display: 'flex',
                              alignItems: 'center',
                              ...(col.columnId === 'connectorType' ? { minWidth: 460, width: 460 } : {}),
                            }}
                          >
                            {col.renderCell(item)}
                          </DataGridCell>
                        )}
                      </DataGridRow>
                    )}
                  </DataGridBody>
                </DataGrid>
              )}
            </FluentProvider>
            {sorted.length === 0 && (
              <div className="py-12 text-center text-[14px] text-[#605e5c] dark:text-[#adadad]">
                No connections found.
              </div>
            )}
          </div>
        </>
      )}

      {tab === 'gallery' && (
        <div className="flex flex-1 overflow-hidden flex-col lg:flex-row px-4 sm:px-8 lg:px-12">

          {/* Sidebar — desktop only */}
          <aside className="hidden xl:flex xl:w-[260px] xl:shrink-0 xl:border-r border-[#e1e1e1] dark:border-[#3d3d3d] xl:pt-6 xl:flex-col xl:gap-4 overflow-y-auto overscroll-contain [&::-webkit-scrollbar]:hidden [scrollbar-width:none]" style={{ scrollbarWidth: 'none' }}>

            {/* Search */}
            <div className="pt-4 lg:pt-0 lg:pr-6">
              <SearchBox
                placeholder="Search"
                value={gallerySearch}
                onChange={(_, v) => setGallerySearch(v ?? '')}
                onClear={() => setGallerySearch('')}
                styles={{ root: { width: '100%' } }}
              />
            </div>

            {/* Filter + category chips — vertical list on desktop */}
            <div className="flex lg:flex-col gap-1 overflow-x-auto py-3 lg:py-0 lg:overflow-visible lg:pr-6"
              style={{ scrollbarWidth: 'none' }}>

              <button
                onClick={() => { setGalleryFilter('all'); setActiveCategory(null); }}
                className={`shrink-0 flex items-center h-8 px-3 lg:px-2 lg:w-full text-left text-[14px] rounded-full lg:rounded-none lg:border-l-[3px] transition-colors whitespace-nowrap
                  ${galleryFilter === 'all' && !activeCategory ? 'bg-[#ededed] dark:bg-[#3d3d3d] font-semibold text-[#323130] dark:text-[#f0f0f0] lg:border-l-[#0078d4]' : 'text-[#323130] dark:text-[#d6d6d6] hover:bg-[#f5f5f5] dark:hover:bg-[#2d2d2d] lg:border-l-transparent'}`}
              >
                All
              </button>
              <button
                onClick={() => { setGalleryFilter('recommended'); setActiveCategory(null); }}
                className={`shrink-0 flex items-center h-8 px-3 lg:px-2 lg:w-full text-left text-[14px] rounded-full lg:rounded-none lg:border-l-[3px] transition-colors whitespace-nowrap
                  ${galleryFilter === 'recommended' && !activeCategory ? 'bg-[#ededed] dark:bg-[#3d3d3d] font-semibold text-[#323130] dark:text-[#f0f0f0] lg:border-l-[#0078d4]' : 'text-[#323130] dark:text-[#d6d6d6] hover:bg-[#f5f5f5] dark:hover:bg-[#2d2d2d] lg:border-l-transparent'}`}
              >
                Recommended
              </button>

              {/* Categories label — desktop only */}
              <div className="hidden lg:flex items-center h-[40px] pl-2 border-t border-[#e1e1e1] dark:border-[#3d3d3d] mt-1">
                <span className="text-[14px] font-semibold text-[#323130] dark:text-[#f0f0f0]">Categories</span>
              </div>

              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => { setActiveCategory(cat === activeCategory ? null : cat); setGalleryFilter('all'); }}
                  className={`shrink-0 flex items-center h-8 px-3 lg:px-2 lg:w-full text-left text-[14px] rounded-full lg:rounded-none lg:border-l-[3px] transition-colors whitespace-nowrap
                    ${activeCategory === cat ? 'bg-[#ededed] dark:bg-[#3d3d3d] font-semibold text-[#323130] dark:text-[#f0f0f0] lg:border-l-[#0078d4]' : 'text-[#323130] dark:text-[#d6d6d6] hover:bg-[#f5f5f5] dark:hover:bg-[#2d2d2d] lg:border-l-transparent'}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </aside>

          <main className="flex-1 min-w-0 overflow-y-auto overscroll-contain [&::-webkit-scrollbar]:hidden" style={{ scrollbarWidth: 'none' }}>

            {/* Hero banner */}
            {!gallerySearch && !activeCategory && galleryFilter === 'all' && (
              <div className="lg:mt-6 xl:ml-6 rounded-[4px] overflow-hidden flex flex-row h-[160px] md:h-[210px] lg:h-[256px]"
                style={{ background: 'linear-gradient(162.2deg, rgb(221,218,240) 0%, rgb(232,226,238) 50%, rgb(242,232,228) 100%)' }}>
                {/* Text */}
                <div className="flex flex-col justify-center px-6 sm:px-10 flex-1 min-w-0">
                  <h2 className="text-[15px] sm:text-[19px] lg:text-[22px] font-bold leading-[1.25] mb-2" style={{ color: '#1a1a2e' }}>
                    Power decision-making with your organization&apos;s data
                  </h2>
                  <p className="hidden md:block text-[13px] leading-[20px]" style={{ color: '#323130' }}>
                    Connect your organization&apos;s data to Copilot to give users tailored, relevant, and meaningful insights across their Microsoft apps.
                  </p>
                </div>
                {/* Image — oversized and cropped to fill, matching original scale */}
                <div className="relative w-[55%] h-full overflow-hidden">
                  <img
                    src="https://res.cdn.office.net/admincenter/admin-content/admin/images/udt/catalogbanner-2x.png"
                    alt=""
                    className="absolute w-auto object-contain"
                    style={{ height: '160%', top: '-30%', right: '-2%' }}
                  />
                </div>
              </div>
            )}

            {/* Mobile/medium search + category chips — shown below banner on < xl */}
            <div className="xl:hidden mt-10">
              <SearchBox
                placeholder="Search"
                value={gallerySearch}
                onChange={(_, v) => setGallerySearch(v ?? '')}
                onClear={() => setGallerySearch('')}
                styles={{ root: { width: '100%' } }}
              />
            </div>
            <div className="xl:hidden mt-3 mb-4 flex gap-1 overflow-x-auto py-2" style={{ scrollbarWidth: 'none' }}>
              <button
                onClick={() => { setGalleryFilter('all'); setActiveCategory(null); }}
                className={`shrink-0 flex items-center h-8 px-3 text-[14px] rounded-full transition-colors whitespace-nowrap
                  ${galleryFilter === 'all' && !activeCategory ? 'bg-[#ededed] dark:bg-[#3d3d3d] font-semibold text-[#323130] dark:text-[#f0f0f0]' : 'text-[#323130] dark:text-[#d6d6d6] hover:bg-[#f5f5f5] dark:hover:bg-[#2d2d2d]'}`}
              >
                All
              </button>
              <button
                onClick={() => { setGalleryFilter('recommended'); setActiveCategory(null); }}
                className={`shrink-0 flex items-center h-8 px-3 text-[14px] rounded-full transition-colors whitespace-nowrap
                  ${galleryFilter === 'recommended' && !activeCategory ? 'bg-[#ededed] dark:bg-[#3d3d3d] font-semibold text-[#323130] dark:text-[#f0f0f0]' : 'text-[#323130] dark:text-[#d6d6d6] hover:bg-[#f5f5f5] dark:hover:bg-[#2d2d2d]'}`}
              >
                Recommended
              </button>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => { setActiveCategory(cat === activeCategory ? null : cat); setGalleryFilter('all'); }}
                  className={`shrink-0 flex items-center h-8 px-3 text-[14px] rounded-full transition-colors whitespace-nowrap
                    ${activeCategory === cat ? 'bg-[#ededed] dark:bg-[#3d3d3d] font-semibold text-[#323130] dark:text-[#f0f0f0]' : 'text-[#323130] dark:text-[#d6d6d6] hover:bg-[#f5f5f5] dark:hover:bg-[#2d2d2d]'}`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Connector sections */}
            <div className="pt-4 pb-6 px-2 xl:pl-8 xl:pr-2 xl:pt-8 xl:pb-8 flex flex-col gap-10 xl:gap-12 mb-[120px]">

              {showRecommended && (
                <section>
                  <h2 className="text-[18px] sm:text-[20px] font-semibold text-[#323130] dark:text-[#f0f0f0] mb-4">Recommended</h2>
                  <SectionGrid connectors={recommended} onAdd={setSetupType} onSelect={setSelectedGalleryConnector} selectedId={selectedGalleryConnector?.id ?? null} />
                </section>
              )}

              {galleryFilter === 'recommended' && !gallerySearch && (
                <section>
                  <h2 className="text-[18px] sm:text-[20px] font-semibold text-[#323130] dark:text-[#f0f0f0] mb-4">Recommended</h2>
                  <SectionGrid connectors={recommended} onAdd={setSetupType} onSelect={setSelectedGalleryConnector} selectedId={selectedGalleryConnector?.id ?? null} />
                </section>
              )}

              {activeCategory && (
                <section>
                  <h2 className="text-[18px] sm:text-[20px] font-semibold text-[#323130] dark:text-[#f0f0f0] mb-4">{activeCategory}</h2>
                  {galleryFiltered.length > 0
                    ? <SectionGrid connectors={galleryFiltered} onAdd={setSetupType} onSelect={setSelectedGalleryConnector} selectedId={selectedGalleryConnector?.id ?? null} />
                    : <p className="text-[14px] text-[#605e5c] dark:text-[#9e9d99]">No connectors found.</p>}
                </section>
              )}

              {gallerySearch && (
                <section>
                  <h2 className="text-[18px] sm:text-[20px] font-semibold text-[#323130] dark:text-[#f0f0f0] mb-4">
                    {galleryFiltered.length} result{galleryFiltered.length !== 1 ? 's' : ''} for &ldquo;{gallerySearch}&rdquo;
                  </h2>
                  {galleryFiltered.length > 0
                    ? <SectionGrid connectors={galleryFiltered} onAdd={setSetupType} onSelect={setSelectedGalleryConnector} selectedId={selectedGalleryConnector?.id ?? null} />
                    : <p className="text-[14px] text-[#605e5c] dark:text-[#9e9d99]">No connectors match your search.</p>}
                </section>
              )}

              {!gallerySearch && !activeCategory && galleryFilter === 'all' && byCategory.map(({ label, items }) => (
                <section key={label}>
                  <h2 className="text-[18px] sm:text-[20px] font-semibold text-[#323130] dark:text-[#f0f0f0] mb-4">{label}</h2>
                  <SectionGrid connectors={items} onAdd={setSetupType} onSelect={setSelectedGalleryConnector} selectedId={selectedGalleryConnector?.id ?? null} />
                </section>
              ))}

              <section className="flex items-center gap-4 flex-wrap" style={{ animation: 'slideDown 0.3s ease both', animationDelay: '350ms' }}>
                <span className="text-[14px] text-[#323130] dark:text-[#d6d6d6] mr-1">Didn&apos;t find your connector?</span>
                <a
                  href="https://learn.microsoft.com/en-US/graph/connecting-external-content-build-quickstart"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 h-8 px-1 text-[14px] text-[#323130] dark:text-[#d6d6d6] hover:text-[#106ebe] dark:hover:text-[#6cb8f6] transition-colors"
                >
                  <CircleAdditionIcon style={{ fontSize: 14, color: '#0078d4' }} />
                  Learn to create your connector
                </a>
                <a
                  href="https://aka.ms/GraphConnectorsFeedback"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 h-8 px-1 text-[14px] text-[#323130] dark:text-[#d6d6d6] hover:text-[#106ebe] dark:hover:text-[#6cb8f6] transition-colors"
                >
                  <PageArrowRightIcon style={{ fontSize: 14, color: '#0078d4' }} />
                  Request for a connector
                </a>
              </section>
            </div>
          </main>

        </div>
      )}

      {/* ── Panels (shared) ───────────────────────────────────────── */}

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
      {selectedGalleryConnector && (
        <ISVPanel
          connector={selectedGalleryConnector}
          onAdd={(type) => { setSelectedGalleryConnector(null); setSetupType(type); }}
          onClose={() => setSelectedGalleryConnector(null)}
        />
      )}
      {setupType && (
        <SetupPanel
          connectorType={setupType}
          onClose={() => setSetupType(null)}
          onCreated={(newConnector) => {
            setConnectors((prev) => [newConnector, ...prev]);
          }}
        />
      )}
    </div>
  );
}

export default function ConnectorsPage() {
  return (
    <Suspense fallback={null}>
      <ConnectorsPageContent />
    </Suspense>
  );
}
