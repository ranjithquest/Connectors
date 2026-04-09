'use client';

import { useState } from 'react';
import GetStartedContent, { NAV_STEPS } from '@/components/get-started/GetStartedContent';

export default function GetStartedPage() {
  const font = '"Segoe UI", "Segoe UI Web (West European)", -apple-system, system-ui, Roboto, "Helvetica Neue", sans-serif';
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div style={{ minHeight: '100vh', background: '#ffffff', fontFamily: font, color: '#242424' }}>

      {/* Mobile top bar */}
      <div className="gs-mobile-bar" style={{
        display: 'none', position: 'sticky', top: 0, zIndex: 100,
        background: '#ffffff', borderBottom: '1px solid #e0e0e0',
        padding: '12px 20px', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <span style={{ fontSize: 15, fontWeight: 600, color: '#242424' }}>Connector Admin Boilerplate</span>
        <button
          onClick={() => setMenuOpen(o => !o)}
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            fontSize: 20, color: '#242424', padding: '4px 8px', lineHeight: 1,
          }}
          aria-label="Toggle navigation"
        >
          {menuOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Mobile nav drawer */}
      {menuOpen && (
        <div className="gs-mobile-nav" style={{
          display: 'none', position: 'fixed', top: 49, left: 0, right: 0, zIndex: 99,
          background: '#ffffff', borderBottom: '1px solid #e0e0e0',
          padding: '12px 20px 20px',
        }}>
          {NAV_STEPS.map((step) => (
            <a
              key={step.href}
              href={step.href}
              onClick={e => {
                e.preventDefault();
                document.getElementById(`step-${step.num}`)?.scrollIntoView({ behavior: 'smooth' });
                setMenuOpen(false);
              }}
              style={{
                display: 'block', padding: '10px 0',
                fontSize: 14, color: '#484644', textDecoration: 'none',
                borderBottom: '1px solid #f0f0f0',
              }}
            >
              {step.label}
            </a>
          ))}
          <div style={{ marginTop: 12 }}>
            <a href="https://github.com/gim-home/Connectors/tree/main" target="_blank" rel="noopener noreferrer"
              style={{ display: 'block', fontSize: 14, color: '#484644', textDecoration: 'none', padding: '10px 0' }}
            >On GitHub →</a>
            <a href="https://github.com/gim-home/Connectors/blob/main/CONTRIBUTING.md" target="_blank" rel="noopener noreferrer"
              style={{ display: 'block', fontSize: 14, color: '#484644', textDecoration: 'none', padding: '10px 0' }}
            >Contributing guide →</a>
          </div>
        </div>
      )}

      {/* Sidebar blur */}
      <div className="gs-sidebar-bg" style={{
        position: 'fixed', left: 0, top: 0,
        width: 320, height: '100vh',
        background: '#ffffff', borderRight: '1px solid #e0e0e0',
        zIndex: -1,
      }} />

      <div className="gs-layout" style={{ display: 'flex', flexDirection: 'row', gap: 60, padding: '48px 48px 0' }}>

        {/* Sidebar */}
        <aside className="gs-sidebar" style={{ width: 260, flexShrink: 0, position: 'relative' }}>
          <div style={{
            position: 'fixed', left: 0, top: 0,
            width: 320, height: '100vh', overflowY: 'auto',
            padding: '0px 28px 32px 32px',
            display: 'flex', flexDirection: 'column',
            boxSizing: 'border-box',
          }}>
            <div style={{ marginBottom: 4, paddingTop: 48 }}>
              <div
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                style={{ fontSize: 16, fontWeight: 600, color: '#242424', lineHeight: '22px', cursor: 'pointer' }}
              >
                Connector Admin Boilerplate
              </div>
            </div>

            <nav style={{ flex: 1, marginTop: 20 }}>
              {NAV_STEPS.map((step) => (
                <a
                  key={step.href}
                  href={step.href}
                  onClick={e => { e.preventDefault(); document.getElementById(`step-${step.num}`)?.scrollIntoView({ behavior: 'smooth' }); }}
                  style={{
                    display: 'flex', alignItems: 'center',
                    textDecoration: 'none', padding: '6px 0',
                    borderRadius: 8, transition: 'background 0.1s', cursor: 'pointer',
                  }}
                  onMouseOver={e => { e.currentTarget.style.background = '#f5f5f5'; }}
                  onMouseOut={e => { e.currentTarget.style.background = 'transparent'; }}
                >
                  <span style={{ fontSize: 14, fontWeight: 400, color: '#484644', lineHeight: '19px' }}>{step.label}</span>
                </a>
              ))}
            </nav>

            <div style={{ paddingTop: 20, marginTop: 16 }}>
              <a href="https://github.com/gim-home/Connectors/tree/main" target="_blank" rel="noopener noreferrer"
                style={{ display: 'block', fontSize: 14, color: '#484644', textDecoration: 'none', padding: '6px 14px', borderRadius: 8 }}
                onMouseOver={e => { e.currentTarget.style.background = '#f5f5f5'; }}
                onMouseOut={e => { e.currentTarget.style.background = 'transparent'; }}
              >On GitHub →</a>
              <a href="https://github.com/gim-home/Connectors/blob/main/CONTRIBUTING.md" target="_blank" rel="noopener noreferrer"
                style={{ display: 'block', fontSize: 14, color: '#484644', textDecoration: 'none', padding: '6px 14px', borderRadius: 8 }}
                onMouseOver={e => { e.currentTarget.style.background = '#f5f5f5'; }}
                onMouseOut={e => { e.currentTarget.style.background = 'transparent'; }}
              >Contributing guide →</a>
            </div>
          </div>
        </aside>

        <main style={{ flex: 1, minWidth: 0 }}>
          <GetStartedContent />
        </main>

      </div>
    </div>
  );
}
