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
      alignItems: 'flex-start',
      paddingTop: '15vh',
      padding: '15vh 10% 48px 8%',
      position: 'relative',
    }}>
      {/* Gradient fade: opaque white on left, transparent on right */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(to right, rgba(255,255,255,1) 35%, rgba(255,255,255,0.7) 55%, transparent 80%)',
      }} />

      <div style={{ maxWidth: 420, width: '100%', textAlign: 'left', position: 'relative' }}>

<p style={{ fontSize: 18, color: '#616161', margin: '0 0 8px', fontWeight: 400 }}>
          Admin Boilerplate
        </p>

        <h1 style={{ fontSize: 68, fontWeight: 600, color: '#0f0e1a', lineHeight: '82px', margin: '0 0 48px' }}>
          V 1.0 (Beta)
        </h1>

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

        {/* Resources */}
        <div style={{ marginTop: 40 }}>
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#a0a0a0', marginBottom: 12 }}>Resources</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[
              { label: 'Fluent V9 / V8 Components', href: 'https://react.fluentui.dev' },
              { label: 'MADS', href: 'https://admincontrolsdemoapps.z22.web.core.windows.net/storybook/latest/Storybook/?path=/docs/about--docs' },
              { label: 'MDL2 Icon library', href: 'https://iconcloud.design/browse/Full%20MDL2%20Assets' },
              { label: 'Fluent Icons', href: 'https://storybooks.fluentui.dev/react/?path=/docs/icons-catalog--docs' },
              { label: 'Fluent Charts', href: 'https://storybooks.fluentui.dev/react/?path=/docs/charts_charts-areachart--docs' },
            ].map(r => (
              <a key={r.label} href={r.href} target="_blank" rel="noopener noreferrer"
                style={{ fontSize: 14, color: '#0078d4', textDecoration: 'none' }}
                onMouseOver={e => (e.currentTarget.style.textDecoration = 'underline')}
                onMouseOut={e => (e.currentTarget.style.textDecoration = 'none')}
              >{r.label}</a>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
