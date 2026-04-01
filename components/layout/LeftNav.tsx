'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  HomeIcon,
  ContactIcon,
  Devices2Icon,
  GroupIcon,
  AccountManagementIcon,
  PaymentCardIcon,
  AllAppsIcon,
  ShoppingCartIcon,
  ChatBotIcon,
  HeadsetIcon,
  SettingsIcon,
  DeployIcon,
  ReportAddIcon,
  HealthSolidIcon,
  SecurityGroupIcon,
  IDBadgeIcon,
  MailIcon,
  LiveSiteIcon,
  ChatIcon,
  GridViewMediumIcon,
  CustomizeToolbarIcon,
  MoreIcon,
  ChevronDownSmallIcon,
  ChevronRightSmallIcon,
} from '@fluentui/react-icons-mdl2';

function CopilotIcon({ size = 16 }: { size?: number }) {
  return (
    <img src="/copilot-icon-32.png" alt="Copilot" width={size} height={size}
      style={{ objectFit: 'contain' }} />
  );
}

function NavDivider() {
  return (
    <div className="w-full py-1 flex-shrink-0">
      <div className="mx-[10px] h-px bg-[#e1e1e1]" />
    </div>
  );
}

type NavChild = { href: string; label: string };

type NavItem = {
  href: string;
  label: string;
  Icon: React.ComponentType<{ style?: React.CSSProperties }> | null;
  activeFor: string[];
  children?: NavChild[];
};

const NAV_ITEMS_GROUP1: NavItem[] = [
  { href: '/', label: 'Home', Icon: HomeIcon, activeFor: ['/'] },
  {
    href: '/connectors', label: 'Copilot', Icon: null, activeFor: ['/copilot', '/connectors'],
    children: [
      { href: '/copilot/overview', label: 'Overview' },
      { href: '/connectors',       label: 'Connectors' },
      { href: '/copilot/prompts',  label: 'Prompts' },
      { href: '/copilot/billing',  label: 'Billing & usage' },
      { href: '/copilot/settings', label: 'Settings' },
    ],
  },
  { href: '/agents',      label: 'Agents',         Icon: ChatBotIcon,           activeFor: ['/agents'],       children: [] },
  { href: '/users',       label: 'Users',          Icon: ContactIcon,           activeFor: ['/users'],        children: [] },
  { href: '/devices',     label: 'Devices',        Icon: Devices2Icon,          activeFor: ['/devices'],      children: [] },
  { href: '/groups',      label: 'Teams & groups', Icon: GroupIcon,             activeFor: ['/groups'],       children: [] },
  { href: '/roles',       label: 'Roles',          Icon: AccountManagementIcon, activeFor: ['/roles'],        children: [] },
  { href: '/resources',   label: 'Resources',      Icon: AllAppsIcon,           activeFor: ['/resources'],    children: [] },
  { href: '/marketplace', label: 'Marketplace',    Icon: ShoppingCartIcon,      activeFor: ['/marketplace'] },
  { href: '/billing',     label: 'Billing',        Icon: PaymentCardIcon,       activeFor: ['/billing'],      children: [] },
  { href: '/support',     label: 'Support',        Icon: HeadsetIcon,           activeFor: ['/support'],      children: [] },
  { href: '/settings',    label: 'Settings',       Icon: SettingsIcon,          activeFor: ['/settings'],     children: [] },
  { href: '/setup',       label: 'Setup',          Icon: DeployIcon,            activeFor: ['/setup'] },
  { href: '/reports',     label: 'Reports',        Icon: ReportAddIcon,         activeFor: ['/reports'],      children: [] },
  { href: '/health',      label: 'Health',         Icon: HealthSolidIcon,       activeFor: ['/health'],       children: [] },
];

const NAV_ITEMS_GROUP2: NavItem[] = [
  { href: '/security',   label: 'Security',          Icon: SecurityGroupIcon,  activeFor: ['/security'] },
  { href: '/identity',   label: 'Identity',          Icon: IDBadgeIcon,        activeFor: ['/identity'] },
  { href: '/exchange',   label: 'Exchange',          Icon: MailIcon,           activeFor: ['/exchange'] },
  { href: '/sharepoint', label: 'SharePoint',        Icon: LiveSiteIcon,       activeFor: ['/sharepoint'] },
  { href: '/teams',      label: 'Teams',             Icon: ChatIcon,           activeFor: ['/teams'] },
  { href: '/all-admin',  label: 'All admin centers', Icon: GridViewMediumIcon, activeFor: ['/all-admin'] },
];

const BOTTOM_ITEMS = [
  { label: 'Customize navigation', Icon: CustomizeToolbarIcon },
  { label: 'Show all',             Icon: MoreIcon },
];

function renderIconEl(Icon: NavItem['Icon']) {
  if (Icon === null) return <CopilotIcon />;
  return <Icon style={{ fontSize: 16 }} />;
}

// Flyout uses fixed positioning to escape any overflow clipping
function HoverFlyout({ item, anchorEl, onClose }: {
  item: NavItem;
  anchorEl: HTMLElement | null;
  onClose: () => void;
}) {
  const [pos, setPos] = useState<{ top: number } | null>(null);
  const hasChildren = item.children && item.children.length > 0;

  useEffect(() => {
    if (!anchorEl) return;
    const rect = anchorEl.getBoundingClientRect();
    setPos({ top: rect.top });
  }, [anchorEl]);

  if (!pos) return null;

  return (
    <div
      className="fixed z-50 bg-white shadow-[0_2px_8px_rgba(0,0,0,0.15)] border border-[#e1e1e1] min-w-[200px] py-1"
      style={{ left: 48, top: pos.top }}
      onMouseLeave={onClose}
    >
      <div className="px-4 py-2 font-semibold text-[13px] text-[#323130]">{item.label}</div>
      {hasChildren && (
        <>
          <div className="mx-3 h-px bg-[#e1e1e1] mb-1" />
          {item.children!.map((child) => (
            <Link
              key={child.href}
              href={child.href}
              onClick={onClose}
              className="block px-4 py-[6px] text-[13px] text-[#323130] hover:bg-[#f3f2f1]"
            >
              {child.label}
            </Link>
          ))}
        </>
      )}
    </div>
  );
}

function IconRailItem({ item, active }: { item: NavItem; active: boolean }) {
  const [hovered, setHovered] = useState(false);
  const itemRef = useRef<HTMLDivElement>(null);
  const leaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function handleMouseEnter() {
    if (leaveTimer.current) clearTimeout(leaveTimer.current);
    setHovered(true);
  }
  function handleMouseLeave() {
    leaveTimer.current = setTimeout(() => setHovered(false), 80);
  }

  return (
    <div ref={itemRef} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <Link
        href={item.href}
        title={item.label}
        className={`relative w-full h-10 flex items-center justify-center flex-shrink-0 transition-colors ${
          active ? 'bg-white/60 text-[#323130]' : 'text-[#323130] hover:bg-black/[0.06]'
        }`}
      >
        {active && <span className="absolute left-0 top-0 bottom-0 w-[3px] bg-[#0078d4] rounded-r-[2px]" />}
        <span className="flex items-center justify-center w-5 h-5">{renderIconEl(item.Icon)}</span>
      </Link>
      {hovered && (
        <HoverFlyout item={item} anchorEl={itemRef.current} onClose={() => setHovered(false)} />
      )}
    </div>
  );
}

export default function LeftNav() {
  const pathname = usePathname();
  const [expanded, setExpanded] = useState(false);
  const [openMenus, setOpenMenus] = useState<Set<string>>(new Set(['/connectors']));
  const navRef = useRef<HTMLElement>(null);

  function isActive(activeFor: string[]) {
    return activeFor.some((p) =>
      p === '/' ? pathname === '/' : pathname.startsWith(p)
    );
  }

  function toggleMenu(href: string) {
    setOpenMenus((prev) => {
      const next = new Set(prev);
      next.has(href) ? next.delete(href) : next.add(href);
      return next;
    });
  }

  useEffect(() => {
    if (!expanded) return;
    function handler(e: MouseEvent) {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setExpanded(false);
      }
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [expanded]);

  function renderExpandedItem(item: NavItem) {
    const active = isActive(item.activeFor);
    const hasChildren = item.children && item.children.length > 0;
    const isOpen = openMenus.has(item.href);

    return (
      <div key={item.href}>
        <Link
          href={item.href}
          onClick={hasChildren ? (e) => { e.preventDefault(); toggleMenu(item.href); } : undefined}
          className={`relative flex items-center w-full h-10 px-3 gap-3 text-[13px] transition-colors ${
            active
              ? 'bg-[#edebe9] font-semibold text-[#323130]'
              : 'text-[#323130] hover:bg-[#edebe9]'
          }`}
        >
          {active && <span className="absolute left-0 top-0 bottom-0 w-[3px] bg-[#0078d4] rounded-r-[2px]" />}
          <span className="flex items-center justify-center w-5 h-5 flex-shrink-0">
            {renderIconEl(item.Icon)}
          </span>
          <span className="flex-1">{item.label}</span>
          {hasChildren && (
            <span className="text-[#605e5c]">
              {isOpen
                ? <ChevronDownSmallIcon style={{ fontSize: 12 }} />
                : <ChevronRightSmallIcon style={{ fontSize: 12 }} />}
            </span>
          )}
        </Link>
        {hasChildren && isOpen && item.children!.map((child) => {
          const childActive = pathname === child.href || pathname.startsWith(child.href + '/');
          return (
            <Link
              key={child.href}
              href={child.href}
              className={`relative flex items-center w-full h-9 pl-11 pr-3 text-[13px] transition-colors ${
                childActive ? 'font-semibold text-[#323130] bg-[#edebe9]' : 'text-[#323130] hover:bg-[#edebe9]'
              }`}
            >
              {childActive && <span className="absolute left-0 top-0 bottom-0 w-[3px] bg-[#0078d4] rounded-r-[2px]" />}
              {child.label}
            </Link>
          );
        })}
      </div>
    );
  }

  // ── EXPANDED (push layout) ──────────────────────────────────────────────────
  if (expanded) {
    return (
      <nav
        ref={navRef}
        className="nav-scroll flex-shrink-0 flex flex-col overflow-y-auto overflow-x-hidden border-r border-[#e1e1e1]"
        style={{ width: 280, backgroundColor: '#faf9f8' }}
      >
        <button
          onClick={() => setExpanded(false)}
          className="w-full h-12 flex items-center gap-3 px-3 flex-shrink-0 text-[#323130] hover:bg-[#edebe9] transition-colors"
        >
          <svg width="16" height="12" viewBox="0 0 16 12" fill="none" className="flex-shrink-0">
            <path d="M0 1h16M0 6h16M0 11h16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <span className="text-[13px] font-semibold text-[#323130]">Microsoft 365 admin center</span>
        </button>

        {NAV_ITEMS_GROUP1.map(renderExpandedItem)}

        <NavDivider />

        <div className="px-3 pt-2 pb-1">
          <span className="text-[11px] font-semibold text-[#605e5c] uppercase tracking-wide">Admin centers</span>
        </div>
        {NAV_ITEMS_GROUP2.map(renderExpandedItem)}

        <div className="mt-auto">
          <NavDivider />
          {BOTTOM_ITEMS.map(({ label, Icon }) => (
            <button key={label} className="flex items-center w-full h-10 px-3 gap-3 text-[13px] text-[#323130] hover:bg-[#edebe9] transition-colors">
              <span className="flex items-center justify-center w-5 h-5 flex-shrink-0">
                <Icon style={{ fontSize: 16 }} />
              </span>
              {label}
            </button>
          ))}
        </div>
      </nav>
    );
  }

  // ── COLLAPSED icon rail ─────────────────────────────────────────────────────
  return (
    <nav
      ref={navRef}
      className="nav-scroll w-12 flex-shrink-0 flex flex-col overflow-y-auto"
      style={{ backgroundColor: '#E9E9E9' }}
    >
      <button
        onClick={() => setExpanded(true)}
        className="w-full h-10 flex items-center justify-center flex-shrink-0 text-[#323130] hover:bg-black/[0.06] transition-colors"
      >
        <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
          <path d="M0 1h16M0 6h16M0 11h16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>

      {NAV_ITEMS_GROUP1.map((item) => (
        <IconRailItem key={item.href} item={item} active={isActive(item.activeFor)} />
      ))}

      <div className="w-full py-1 flex-shrink-0">
        <div className="mx-[10px] h-px bg-[#c8c8c8]" />
      </div>

      {NAV_ITEMS_GROUP2.map((item) => (
        <IconRailItem key={item.href} item={item} active={isActive(item.activeFor)} />
      ))}

      <div className="mt-auto">
        <div className="w-full py-1 flex-shrink-0">
          <div className="mx-[10px] h-px bg-[#c8c8c8]" />
        </div>
        {BOTTOM_ITEMS.map(({ label, Icon }) => (
          <button key={label} title={label} className="w-full h-10 flex items-center justify-center text-[#323130] hover:bg-black/[0.06] transition-colors">
            <Icon style={{ fontSize: 16 }} />
          </button>
        ))}
      </div>
    </nav>
  );
}
