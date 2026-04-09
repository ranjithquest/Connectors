'use client';

const font = '"Segoe UI", "Segoe UI Web (West European)", -apple-system, system-ui, Roboto, "Helvetica Neue", sans-serif';

export default function AboutPage() {
  return (
    <div style={{
      minHeight: '100vh',
      background: '#f0eef8',
      backgroundImage: 'url(/img-op2.png)',
      backgroundSize: 'cover',
      backgroundPosition: 'center center',
      fontFamily: font,
      display: 'flex',
      alignItems: 'center',
      padding: '48px 10% 48px 8%',
      position: 'relative',
    }}>
      {/* Gradient fade: opaque white on left, transparent on right */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(to right, rgba(245,243,255,0.95) 30%, rgba(245,243,255,0.6) 60%, transparent 85%)',
      }} />

      <div style={{ maxWidth: 420, width: '100%', textAlign: 'left', position: 'relative' }}>

        <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#8b85c1', marginBottom: 16 }}>
          Copilot Connectors Team
        </div>

        <h1 style={{ fontSize: 48, fontWeight: 600, color: '#0f0e1a', lineHeight: '58px', margin: '0 0 12px' }}>
          Admin<br />Boilerplate
        </h1>

        <p style={{ fontSize: 18, color: '#a19f9d', margin: '0 0 8px', fontWeight: 400 }}>
          V1.0 Beta
        </p>

        <p style={{ fontSize: 16, color: '#484644', lineHeight: '26px', margin: '0 0 36px', maxWidth: 340 }}>
          Prototype specs into concepts, validate with stakeholders, and ship production‑ready outcomes — fast.
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
