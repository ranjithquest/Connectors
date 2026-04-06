'use client';

import GetStartedContent, { NAV_STEPS } from '@/components/get-started/GetStartedContent';

export default function GetStartedPage() {
  const font = '"Segoe UI", "Segoe UI Web (West European)", -apple-system, system-ui, Roboto, "Helvetica Neue", sans-serif';

  return (
    <div style={{ minHeight: '100vh', background: '#ffffff', fontFamily: font, color: '#242424' }}>

      {/* Sidebar blur */}
      <div style={{
        position: 'fixed', left: 0, top: 0,
        width: 320, height: '100vh',
        background: '#ffffff', borderRight: '1px solid #e0e0e0',
        zIndex: -1,
      }} />

      <div style={{ display: 'flex', flexDirection: 'row', gap: 60, padding: '48px 48px 0' }}>

        {/* Aside placeholder */}
        <aside style={{ width: 260, flexShrink: 0, position: 'relative' }}>
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
                Copilot Connectors
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
              <a href="https://github.com/gim-home/Connectors/tree/Boilerplate" target="_blank" rel="noopener noreferrer"
                style={{ display: 'block', fontSize: 14, color: '#484644', textDecoration: 'none', padding: '6px 14px', borderRadius: 8 }}
                onMouseOver={e => { e.currentTarget.style.background = '#f5f5f5'; }}
                onMouseOut={e => { e.currentTarget.style.background = 'transparent'; }}
              >On GitHub →</a>
              <a href="https://github.com/gim-home/Connectors/blob/Boilerplate/CONTRIBUTING.md" target="_blank" rel="noopener noreferrer"
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
