'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';
import {
  HomeIcon,
  ContactIcon,
  Devices3Icon,
  GroupIcon,
  AccountManagementIcon,
  PaymentCardIcon,
  Devices4Icon,
  MarketIcon,
  HeadsetIcon,
  SettingsIcon,
  RepairIcon,
  LineChartIcon,
  HealthIcon,
  SecurityGroupIcon,
  IDBadgeIcon,
  MailIcon,
  GlobeIcon,
  ChatIcon,
  AllAppsIcon,
  EditIcon,
  MoreIcon,
  ChevronDownMedIcon,
  GlobalNavButtonIcon,
} from '@fluentui/react-icons-mdl2';
import { AgentsColor } from '@fluentui/react-icons';

function CopilotIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M11.6696 1.98972C11.469 1.39807 10.9137 1 10.2889 1L9.3884 1C8.6873 1 8.08549 1.49905 7.95572 2.18803L7.02441 7.13282L7.48743 5.54883C7.66914 4.92722 8.23912 4.5 8.88674 4.5L11.7655 4.5L13.01 6.12858L14.118 4.5L13.5658 4.5C12.9411 4.5 12.3858 4.10193 12.1852 3.51027L11.6696 1.98972Z" fill="url(#copi_a)"/>
      <path d="M4.50309 14.0036C4.70167 14.5987 5.25866 15 5.88598 15H7.35221C8.14798 15 8.79674 14.3619 8.80987 13.5662L8.88301 9.13477L8.49768 10.4516C8.31584 11.073 7.74595 11.5 7.09849 11.5L4.20857 11.5L2.97822 10.4147L2.07031 11.5H2.61719C3.24451 11.5 3.80149 11.9013 4.00008 12.4964L4.50309 14.0036Z" fill="url(#copi_b)"/>
      <path d="M10.0004 1H4.16755C2.50102 1 1.50109 3.20235 0.834479 5.40471C0.044714 8.01392 -0.988711 11.5035 2.00105 11.5035H4.69024C5.34194 11.5035 5.91403 11.0727 6.09306 10.4461C6.52129 8.94725 7.32308 6.15282 7.94795 4.04403C8.25428 3.01026 8.50944 2.12243 8.90103 1.56954C9.12058 1.25958 9.48649 1 10.0004 1Z" fill="url(#copi_c)"/>
      <path d="M10.0004 1H4.16755C2.50102 1 1.50109 3.20235 0.834479 5.40471C0.044714 8.01392 -0.988711 11.5035 2.00105 11.5035H4.69024C5.34194 11.5035 5.91403 11.0727 6.09306 10.4461C6.52129 8.94725 7.32308 6.15282 7.94795 4.04403C8.25428 3.01026 8.50944 2.12243 8.90103 1.56954C9.12058 1.25958 9.48649 1 10.0004 1Z" fill="url(#copi_d)"/>
      <path d="M6 15H11.8329C13.4994 15 14.4993 12.7979 15.166 10.5958C15.9557 7.98686 16.9891 4.49765 13.9994 4.49765H11.3102C10.6585 4.49765 10.0864 4.92845 9.90735 5.55505C9.47911 7.05374 8.67734 9.84779 8.05248 11.9563C7.74615 12.99 7.49099 13.8777 7.0994 14.4305C6.87985 14.7405 6.51395 15 6 15Z" fill="url(#copi_e)"/>
      <path d="M6 15H11.8329C13.4994 15 14.4993 12.7979 15.166 10.5958C15.9557 7.98686 16.9891 4.49765 13.9994 4.49765H11.3102C10.6585 4.49765 10.0864 4.92845 9.90735 5.55505C9.47911 7.05374 8.67734 9.84779 8.05248 11.9563C7.74615 12.99 7.49099 13.8777 7.0994 14.4305C6.87985 14.7405 6.51395 15 6 15Z" fill="url(#copi_f)"/>
      <defs>
        <radialGradient id="copi_a" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(13.0851 7.1729) rotate(-128.772) scale(6.41931 6.01261)">
          <stop offset="0.0955758" stopColor="#00AEFF"/>
          <stop offset="0.773185" stopColor="#2253CE"/>
          <stop offset="1" stopColor="#0736C4"/>
        </radialGradient>
        <radialGradient id="copi_b" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(3.30628 11.0661) rotate(51.1538) scale(5.67928 5.53958)">
          <stop stopColor="#FFB657"/>
          <stop offset="0.633728" stopColor="#FF5F3D"/>
          <stop offset="0.923392" stopColor="#C02B3C"/>
        </radialGradient>
        <linearGradient id="copi_c" x1="3.81844" y1="2.2727" x2="4.65052" y2="11.8998" gradientUnits="userSpaceOnUse">
          <stop offset="0.156162" stopColor="#0D91E1"/>
          <stop offset="0.487484" stopColor="#52B471"/>
          <stop offset="0.652394" stopColor="#98BD42"/>
          <stop offset="0.937361" stopColor="#FFC800"/>
        </linearGradient>
        <linearGradient id="copi_d" x1="4.54577" y1="1" x2="5.00014" y2="11.5035" gradientUnits="userSpaceOnUse">
          <stop stopColor="#3DCBFF"/>
          <stop offset="0.246674" stopColor="#0588F7" stopOpacity="0"/>
        </linearGradient>
        <radialGradient id="copi_e" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(14.299 3.46939) rotate(109.281) scale(13.9554 16.7229)">
          <stop offset="0.0661714" stopColor="#8C48FF"/>
          <stop offset="0.5" stopColor="#F2598A"/>
          <stop offset="0.895833" stopColor="#FFB152"/>
        </radialGradient>
        <linearGradient id="copi_f" x1="14.7598" y1="3.85646" x2="14.7539" y2="6.71693" gradientUnits="userSpaceOnUse">
          <stop offset="0.0581535" stopColor="#F8ADFA"/>
          <stop offset="0.708063" stopColor="#A86EDD" stopOpacity="0"/>
        </linearGradient>
      </defs>
    </svg>
  );
}

function NavDivider() {
  return (
    <div className="w-full py-1 flex-shrink-0">
      <div className="mx-[10px] h-px bg-[#e1e1e1] dark:bg-[#333333]" />
    </div>
  );
}

type NavChild = { href: string; label: string };

type NavItem = {
  href: string;
  label: string;
  Icon: React.ComponentType<{ style?: React.CSSProperties }> | null | undefined;
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
  { href: '/agents',      label: 'Agents',         Icon: AgentsColor,           activeFor: ['/agents'],       children: [] },
  { href: '/users',       label: 'Users',          Icon: ContactIcon,           activeFor: ['/users'],        children: [] },
  { href: '/devices',     label: 'Devices',        Icon: Devices3Icon,          activeFor: ['/devices'],      children: [] },
  { href: '/groups',      label: 'Teams & groups', Icon: GroupIcon,             activeFor: ['/groups'],       children: [] },
  { href: '/roles',       label: 'Roles',          Icon: AccountManagementIcon, activeFor: ['/roles'],        children: [] },
  { href: '/resources',   label: 'Resources',      Icon: Devices4Icon,          activeFor: ['/resources'],    children: [] },
  { href: '/marketplace', label: 'Marketplace',    Icon: MarketIcon,            activeFor: ['/marketplace'] },
  { href: '/billing',     label: 'Billing',        Icon: PaymentCardIcon,       activeFor: ['/billing'],      children: [] },
  { href: '/support',     label: 'Support',        Icon: HeadsetIcon,           activeFor: ['/support'],      children: [] },
  { href: '/settings',    label: 'Settings',       Icon: SettingsIcon,          activeFor: ['/settings'],     children: [] },
  { href: '/setup',       label: 'Setup',          Icon: RepairIcon,            activeFor: ['/setup'] },
  { href: '/reports',     label: 'Reports',        Icon: LineChartIcon,         activeFor: ['/reports'],      children: [] },
  { href: '/health',      label: 'Health',         Icon: HealthIcon,            activeFor: ['/health'],       children: [] },
];

const NAV_ITEMS_GROUP2: NavItem[] = [
  { href: '/security',   label: 'Security',          Icon: SecurityGroupIcon, activeFor: ['/security'] },
  { href: '/identity',   label: 'Identity',          Icon: IDBadgeIcon,       activeFor: ['/identity'] },
  { href: '/exchange',   label: 'Exchange',          Icon: MailIcon,          activeFor: ['/exchange'] },
  { href: '/sharepoint', label: 'SharePoint',        Icon: GlobeIcon,         activeFor: ['/sharepoint'] },
  { href: '/teams',      label: 'Teams',             Icon: ChatIcon,          activeFor: ['/teams'] },
  { href: '/all-admin',  label: 'All admin centers', Icon: AllAppsIcon,       activeFor: ['/all-admin'] },
];

const REAL_ROUTES = new Set(['/connectors', '/boilerplate', '/get-started']);
function isRealRoute(href: string) {
  return REAL_ROUTES.has(href) || href.startsWith('/connectors/');
}

const BOTTOM_ITEMS = [
  { label: 'Customize navigation', Icon: EditIcon },
  { label: 'Show all',             Icon: MoreIcon },
];

function renderIconEl(Icon: NavItem['Icon']) {
  if (Icon === null) return <CopilotIcon size={16} />;
  if (!Icon) return null;
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
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const isDark = mounted && resolvedTheme === 'dark';
  const flyoutBg = isDark ? '#292929' : '#f3f2f1';
  const textPrimary = isDark ? 'text-white' : 'text-[#323130]';
  const hoverBg = isDark ? 'hover:bg-white/[0.08]' : 'hover:bg-[#f3f2f1]';

  useEffect(() => {
    if (!anchorEl) return;
    const rect = anchorEl.getBoundingClientRect();
    setPos({ top: rect.top });
  }, [anchorEl]);

  if (!pos) return null;

  return (
    <div
      className="fixed z-50 shadow-[0_2px_8px_rgba(0,0,0,0.15)] border border-[#e1e1e1] dark:border-[#3d3d3d] min-w-[200px] py-1"
      style={{ backgroundColor: flyoutBg, left: 48, top: pos.top }}
      onMouseLeave={onClose}
    >
      <div className={`px-4 py-2 font-semibold text-[13px] ${textPrimary}`}>{item.label}</div>
      {hasChildren && (
        <>
          <div className={`mx-3 h-px mb-1 ${isDark ? 'bg-[#333333]' : 'bg-[#e1e1e1]'}`} />
          {item.children!.map((child) => (
            <Link
              key={child.href}
              href={child.href}
              onClick={!isRealRoute(child.href) ? (e) => e.preventDefault() : onClose}
              className={`block px-4 py-[6px] text-[13px] ${textPrimary} ${hoverBg}`}
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
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const isDark = mounted && resolvedTheme === 'dark';
  const textColor = isDark ? 'text-white' : 'text-[#323130]';
  const hoverBg = isDark ? 'hover:bg-white/[0.08]' : 'hover:bg-black/[0.06]';

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
        onClick={!isRealRoute(item.href) ? (e) => e.preventDefault() : undefined}
        className={`relative w-full h-10 flex items-center justify-center flex-shrink-0 transition-colors ${textColor} ${
          active ? '' : hoverBg
        }`}
      >
        {active && <span className="absolute bg-[#0078d4]" style={{ left: 4, top: 8, width: 4, height: 24 }} />}
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
  const navRef = useRef<HTMLElement>(null);
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const isDark = mounted && resolvedTheme === 'dark';
  const navBg = isDark ? '#212121' : '#f3f2f1';
  const flyoutBg = isDark ? '#292929' : '#f3f2f1';
  const hoverBg = isDark ? 'hover:bg-white/[0.08]' : 'hover:bg-black/[0.06]';
  const hoverBgMed = isDark ? 'hover:bg-white/[0.08]' : 'hover:bg-[#edebe9]';
  const textPrimary = isDark ? 'text-white' : 'text-[#323130]';
  const textSecondary = isDark ? 'text-[#adadad]' : 'text-[#605e5c]';

  // Auto-open any menu whose child path matches the current pathname
  const defaultOpen = new Set(
    [...NAV_ITEMS_GROUP1, ...NAV_ITEMS_GROUP2]
      .filter(item => item.children?.some(c => pathname === c.href || pathname.startsWith(c.href + '/')))
      .map(item => item.href)
  );
  const [openMenus, setOpenMenus] = useState<Set<string>>(defaultOpen.size > 0 ? defaultOpen : new Set(['/connectors']));

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

  function renderExpandedItem(item: NavItem) {
    const active = isActive(item.activeFor);
    const hasChildren = item.children && item.children.length > 0;
    const isOpen = openMenus.has(item.href);
    const anyChildActive = hasChildren && item.children!.some(
      c => pathname === c.href || pathname.startsWith(c.href + '/')
    );

    return (
      <div key={item.href}>
        <Link
          href={item.href}
          onClick={hasChildren ? (e) => { e.preventDefault(); toggleMenu(item.href); } : (!isRealRoute(item.href) ? (e) => e.preventDefault() : undefined)}
          className={`relative flex items-center w-full h-10 px-3 gap-3 text-[13px] transition-colors ${textPrimary} ${hoverBg} ${
            active ? 'font-semibold' : ''
          }`}
        >
          {active && !anyChildActive && <span className="absolute" style={{ left: 4, top: 8, width: 4, height: 24, backgroundColor: '#0078d4' }} />}
          <span className="flex items-center justify-center w-5 h-5 flex-shrink-0">
            {renderIconEl(item.Icon)}
          </span>
          <span className="flex-1">{item.label}</span>
          {hasChildren && (
            <span
              className={`${textSecondary} transition-transform duration-200`}
              style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', display: 'flex' }}
            >
              <ChevronDownMedIcon style={{ fontSize: 12 }} />
            </span>
          )}
        </Link>
        {hasChildren && isOpen && item.children!.map((child) => {
          const childActive = pathname === child.href || pathname.startsWith(child.href + '/');
          return (
            <Link
              key={child.href}
              href={child.href}
              onClick={!isRealRoute(child.href) ? (e) => e.preventDefault() : undefined}
              className={`relative flex items-center w-full h-9 pl-11 pr-3 text-[13px] transition-colors ${textPrimary} ${
                childActive ? `font-semibold ${isDark ? 'bg-white/[0.08]' : 'bg-black/[0.06]'}` : hoverBg
              }`}
            >
              {childActive && <span className="absolute" style={{ left: 4, top: '50%', transform: 'translateY(-50%)', width: 4, height: 24, backgroundColor: '#0078d4' }} />}
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
        className="left-nav nav-scroll flex-shrink-0 flex flex-col overflow-y-auto overflow-x-hidden border-r border-[#e1e1e1] dark:border-[#333333]"
        style={{ width: 280, backgroundColor: navBg }}
      >
        <button
          onClick={() => setExpanded(false)}
          className={`w-full h-12 flex items-center gap-3 px-3 flex-shrink-0 ${textPrimary} ${hoverBgMed} transition-colors`}
        >
          <GlobalNavButtonIcon style={{ fontSize: 16 }} />
        </button>

        {NAV_ITEMS_GROUP1.map(renderExpandedItem)}

        <NavDivider />

        <div className="px-3 pt-2 pb-1">
          <span className={`text-[11px] font-semibold ${textSecondary} uppercase tracking-wide`}>Admin centers</span>
        </div>
        {NAV_ITEMS_GROUP2.map(renderExpandedItem)}

        <div className="mt-auto">
          <NavDivider />
          {BOTTOM_ITEMS.map(({ label, Icon }) => (
            <button key={label} className={`flex items-center w-full h-10 px-3 gap-3 text-[13px] ${textPrimary} ${hoverBgMed} transition-colors`}>
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
      className="left-nav nav-scroll w-12 flex-shrink-0 flex flex-col overflow-y-auto"
      style={{ backgroundColor: navBg }}
    >
      <button
        onClick={() => setExpanded(true)}
        className={`w-full h-10 flex items-center justify-center flex-shrink-0 ${textPrimary} ${hoverBg} transition-colors`}
      >
        <GlobalNavButtonIcon style={{ fontSize: 16 }} />
      </button>

      {NAV_ITEMS_GROUP1.map((item) => item.Icon !== undefined ? (
        <IconRailItem key={item.href} item={item} active={isActive(item.activeFor)} />
      ) : null)}

      <div className="w-full py-1 flex-shrink-0">
        <div className={`mx-[10px] h-px ${isDark ? 'bg-[#333333]' : 'bg-[#c8c8c8]'}`} />
      </div>

      {NAV_ITEMS_GROUP2.map((item) => (
        <IconRailItem key={item.href} item={item} active={isActive(item.activeFor)} />
      ))}

      <div className="mt-auto">
        <div className="w-full py-1 flex-shrink-0">
          <div className={`mx-[10px] h-px ${isDark ? 'bg-[#333333]' : 'bg-[#c8c8c8]'}`} />
        </div>
        {BOTTOM_ITEMS.map(({ label, Icon }) => (
          <button key={label} title={label} className={`w-full h-10 flex items-center justify-center ${textPrimary} ${hoverBg} transition-colors`}>
            <Icon style={{ fontSize: 16 }} />
          </button>
        ))}
      </div>
    </nav>
  );
}
