'use client';

const font = '"Segoe UI", "Segoe UI Web (West European)", -apple-system, system-ui, Roboto, "Helvetica Neue", sans-serif';

export default function AboutPage() {
  return (
    <div style={{
      minHeight: '100vh',
      background: '#faf9f8',
      backgroundImage: 'url(/img-op2.png)',
      backgroundSize: 'cover',
      backgroundPosition: 'center center',
      fontFamily: font,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 48,
      position: 'relative',
    }}>
      {/* overlay so text stays readable */}
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.55)' }} />
      <div style={{ maxWidth: 480, width: '100%', textAlign: 'center', position: 'relative' }}>

        <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#a19f9d', marginBottom: 12 }}>
          Copilot Connectors Team
        </div>

        <h1 style={{ fontSize: 40, fontWeight: 600, color: '#000000', lineHeight: '52px', margin: '0 0 8px' }}>
          Admin Boilerplate
        </h1>

        <p style={{ fontSize: 16, color: '#a19f9d', margin: '0 0 40px' }}>
          V1.0 Beta
        </p>

        <a
          href="https://studious-adventure-j17vp6o.pages.github.io/get-started/"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '10px 24px', borderRadius: 4, fontSize: 14, fontWeight: 600,
            background: '#0078d4', color: '#ffffff', textDecoration: 'none',
            transition: 'background 0.15s',
          }}
          onMouseOver={e => { (e.currentTarget as HTMLAnchorElement).style.background = '#106ebe'; }}
          onMouseOut={e => { (e.currentTarget as HTMLAnchorElement).style.background = '#0078d4'; }}
        >
          Get started →
        </a>

      </div>
    </div>
  );
}
