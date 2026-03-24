'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { CONNECTOR_CATALOG, CATEGORIES, type ConnectorCatalogItem } from '@/lib/gallery-data';
import SetupDrawer from '@/components/connectors/SetupDrawer';

function ConnectorLogo({ color, initials, logoUrl, logoBg }: { color: string; initials: string; logoUrl?: string; logoBg?: string }) {
  const [imgFailed, setImgFailed] = useState(false);

  if (logoUrl && !imgFailed) {
    return (
      <div
        className="shrink-0 w-12 h-12 rounded flex items-center justify-center overflow-hidden"
        style={{ backgroundColor: logoBg ?? 'transparent' }}
      >
        <img
          src={logoUrl}
          alt={initials}
          className="w-10 h-10 object-contain"
          onError={() => setImgFailed(true)}
        />
      </div>
    );
  }
  return (
    <div
      className="shrink-0 w-12 h-12 rounded flex items-center justify-center text-white text-[13px] font-semibold"
      style={{ backgroundColor: color }}
    >
      {initials}
    </div>
  );
}

function ConnectorTile({ connector, onAdd }: { connector: ConnectorCatalogItem; onAdd: (name: string) => void }) {
  return (
    <div className="bg-white border border-transparent rounded flex items-center gap-3 p-4 shadow-[0px_2px_4px_0px_rgba(0,0,0,0.14),0px_0px_2px_0px_rgba(0,0,0,0.12)] hover:shadow-[0px_4px_8px_0px_rgba(0,0,0,0.16),0px_0px_2px_0px_rgba(0,0,0,0.12)] transition-shadow">
      <ConnectorLogo color={connector.logoColor} initials={connector.logoInitials} logoUrl={connector.logoUrl} logoBg={connector.logoBg} />
      <div className="flex-1 min-w-0">
        <p className="text-[14px] font-semibold text-[#242424] truncate leading-5">{connector.name}</p>
        <p className="text-[12px] text-[#616161] truncate leading-4 mt-0.5">{connector.publisher}</p>
        <p className="text-[12px] text-[#616161] truncate leading-4">{connector.description}</p>
      </div>
      <button
        onClick={() => onAdd(connector.name)}
        className="shrink-0 px-3 py-[5px] text-[14px] font-semibold text-[#242424] bg-white border border-[#d1d1d1] rounded hover:bg-[#f5f5f5] transition-colors whitespace-nowrap"
      >
        Add
      </button>
    </div>
  );
}

function SectionGrid({ connectors, onAdd }: { connectors: ConnectorCatalogItem[]; onAdd: (name: string) => void }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
      {connectors.map((c) => (
        <ConnectorTile key={c.id} connector={c} onAdd={onAdd} />
      ))}
    </div>
  );
}

export default function GalleryPage() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'recommended'>('all');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [setupType, setSetupType] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const filtered = useMemo(() => {
    return CONNECTOR_CATALOG.filter((c) => {
      if (filter === 'recommended' && !c.recommended) return false;
      if (activeCategory && c.category !== activeCategory) return false;
      if (search) {
        const q = search.toLowerCase();
        return c.name.toLowerCase().includes(q) || c.description.toLowerCase().includes(q);
      }
      return true;
    });
  }, [search, filter, activeCategory]);

  const recommended = filtered.filter((c) => c.recommended);
  const byCategory = CATEGORIES.map((cat) => ({
    label: cat,
    items: filtered.filter((c) => c.category === cat && !c.recommended),
  })).filter((g) => g.items.length > 0);

  const showRecommended = filter !== 'recommended' && !activeCategory && recommended.length > 0;

  return (
    <div className="min-h-screen bg-white">

      {/* Page header */}
      <div className="pt-3 pb-0 bg-white px-4 sm:px-8 lg:px-12">
        <nav className="flex items-center gap-1 text-[12px] text-[#616161] mb-4">
          <Link href="/" className="hover:text-[#0078d4] hover:underline">Home</Link>
          <span className="text-[#c8c6c4]">›</span>
          <Link href="/connectors" className="hover:text-[#0078d4] hover:underline">Connectors</Link>
          <span className="text-[#c8c6c4]">›</span>
          <span className="text-[#242424]">Gallery</span>
        </nav>

        <h1 className="text-[24px] sm:text-[28px] font-bold text-[#323130] leading-[36px] mb-6">Connectors</h1>

        <div className="flex">
          <Link href="/connectors/gallery" className="pb-2 mr-6 text-[14px] font-semibold text-[#0078d4] border-b-2 border-[#0078d4]">
            Gallery
          </Link>
          <Link href="/connectors" className="pb-2 mr-6 text-[14px] text-[#424242] hover:text-[#0078d4] border-b-2 border-transparent transition-colors">
            Your connections
          </Link>
        </div>
      </div>
      <div className="border-b border-[#e1e1e1] mx-4 sm:mx-8 lg:mx-12 mt-6" />

      {/* Main layout */}
      <div className="flex flex-col lg:flex-row px-4 sm:px-8 lg:px-12">

        {/* Sidebar */}
        <aside className="lg:w-[260px] lg:shrink-0 lg:border-r border-[#e1e1e1] lg:pt-6 lg:pb-6 lg:flex lg:flex-col lg:gap-4">

          {/* Search */}
          <div className="pt-4 lg:pt-0 lg:pr-6">
            <div className="flex items-center gap-2 border border-[#605e5c] rounded-[2px] px-2 py-[5px] bg-white">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0 text-[#0078d4]">
                <path d="M10.5 10.5L14 14M6.5 12C3.46243 12 1 9.53757 1 6.5C1 3.46243 3.46243 1 6.5 1C9.53757 1 12 3.46243 12 6.5C12 9.53757 9.53757 12 6.5 12Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              <input
                type="text"
                placeholder="Search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1 text-[14px] text-[#605e5c] outline-none placeholder-[#605e5c] bg-transparent"
              />
            </div>
          </div>

          {/* Filter + category chips — horizontal scroll on mobile, vertical list on desktop */}
          <div className="flex lg:flex-col gap-1 overflow-x-auto py-3 lg:py-0 lg:overflow-visible lg:pr-6"
            style={{ scrollbarWidth: 'none' }}>

            <button
              onClick={() => { setFilter('all'); setActiveCategory(null); }}
              className={`shrink-0 flex items-center h-8 px-3 lg:px-2 lg:w-full text-left text-[14px] rounded-full lg:rounded-none transition-colors whitespace-nowrap
                ${filter === 'all' && !activeCategory ? 'bg-[#ededed] font-semibold text-[#323130]' : 'text-[#323130] hover:bg-[#f5f5f5]'}`}
            >
              All
            </button>
            <button
              onClick={() => { setFilter('recommended'); setActiveCategory(null); }}
              className={`shrink-0 flex items-center h-8 px-3 lg:px-2 lg:w-full text-left text-[14px] rounded-full lg:rounded-none transition-colors whitespace-nowrap
                ${filter === 'recommended' && !activeCategory ? 'bg-[#ededed] font-semibold text-[#323130]' : 'text-[#323130] hover:bg-[#f5f5f5]'}`}
            >
              Recommended
            </button>

            {/* Categories label — desktop only */}
            <div className="hidden lg:flex items-center h-[40px] pl-2 border-t border-[#e1e1e1] mt-1">
              <span className="text-[14px] font-semibold text-[#323130]">Categories</span>
            </div>

            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => { setActiveCategory(cat === activeCategory ? null : cat); setFilter('all'); }}
                className={`shrink-0 flex items-center h-8 px-3 lg:px-2 lg:w-full text-left text-[14px] rounded-full lg:rounded-none transition-colors whitespace-nowrap
                  ${activeCategory === cat ? 'bg-[#ededed] font-semibold text-[#323130]' : 'text-[#323130] hover:bg-[#f5f5f5]'}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </aside>

        {/* Content */}
        <main className="flex-1 min-w-0">

          {/* Hero banner */}
          {!search && !activeCategory && filter === 'all' && (
            <div className="mt-4 lg:mt-6 lg:mx-6 rounded-[4px] relative overflow-hidden h-[160px] sm:h-[210px] lg:h-[256px]"
              style={{ background: 'linear-gradient(162.2deg, rgb(221,218,240) 0%, rgb(232,226,238) 50%, rgb(242,232,228) 100%)' }}>
              <div className="absolute right-0 top-0 h-full w-[65%] overflow-hidden">
                <img src="/banner-copilot.png" alt="" className="absolute h-[180%] w-auto object-contain"
                  style={{ top: '-40%', right: '-5%', transform: 'scaleX(-1)' }} />
              </div>
              <div className="relative z-10 flex h-full flex-col justify-center px-6 sm:px-10 max-w-[460px]">
                <h2 className="text-[15px] sm:text-[19px] lg:text-[22px] font-bold text-[#1a1a2e] leading-[1.25] mb-2">
                  Power decision-making with your organization&apos;s data
                </h2>
                <p className="hidden sm:block text-[13px] text-[#323130] leading-[20px]">
                  Connect your organization&apos;s data to Copilot to give users tailored, relevant, and meaningful insights across their Microsoft apps.
                </p>
              </div>
              <div className="absolute z-10" style={{ left: '42%', top: '50%', transform: 'translate(-50%, -50%)' }}>
                <img src="/copilot-icon-48.png" alt="Copilot"
                  className="w-[40px] h-[40px] sm:w-[52px] sm:h-[52px] lg:w-[64px] lg:h-[64px]"
                  style={{ objectFit: 'contain', mixBlendMode: 'multiply' }} />
              </div>
            </div>
          )}

          {/* Connector sections */}
          <div className="py-6 lg:px-8 lg:py-8 flex flex-col gap-10 lg:gap-12">

            {showRecommended && (
              <section>
                <h2 className="text-[18px] sm:text-[20px] font-semibold text-[#323130] mb-4">Recommended</h2>
                <SectionGrid connectors={recommended} onAdd={setSetupType} />
              </section>
            )}

            {filter === 'recommended' && (
              <section>
                <h2 className="text-[18px] sm:text-[20px] font-semibold text-[#323130] mb-4">Recommended</h2>
                <SectionGrid connectors={recommended} onAdd={setSetupType} />
              </section>
            )}

            {activeCategory && (
              <section>
                <h2 className="text-[18px] sm:text-[20px] font-semibold text-[#323130] mb-4">{activeCategory}</h2>
                {filtered.length > 0
                  ? <SectionGrid connectors={filtered} onAdd={setSetupType} />
                  : <p className="text-[14px] text-[#605e5c]">No connectors found.</p>}
              </section>
            )}

            {search && (
              <section>
                <h2 className="text-[18px] sm:text-[20px] font-semibold text-[#323130] mb-4">
                  {filtered.length} result{filtered.length !== 1 ? 's' : ''} for &ldquo;{search}&rdquo;
                </h2>
                {filtered.length > 0
                  ? <SectionGrid connectors={filtered} onAdd={setSetupType} />
                  : <p className="text-[14px] text-[#605e5c]">No connectors match your search.</p>}
              </section>
            )}

            {!search && !activeCategory && filter === 'all' && byCategory.map(({ label, items }) => (
              <section key={label}>
                <h2 className="text-[18px] sm:text-[20px] font-semibold text-[#323130] mb-4">{label}</h2>
                <SectionGrid connectors={items} onAdd={setSetupType} />
              </section>
            ))}
          </div>
        </main>
      </div>

      {setupType && (
        <SetupDrawer connectorType={setupType} onClose={() => setSetupType(null)} />
      )}
    </div>
  );
}
