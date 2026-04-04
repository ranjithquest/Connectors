'use client';
import { WaffleIcon, RingerIcon, SettingsIcon, HelpIcon, BrightnessIcon, ClearNightIcon } from '@fluentui/react-icons-mdl2';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export default function TopNav() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const isDark = mounted && theme === 'dark';

  return (
    <header className="h-[48px] bg-[#1b1a19] flex items-center flex-shrink-0 z-50 relative">
      {/* Left: app launcher waffle + title */}
      <button className="w-12 h-[48px] flex items-center justify-center text-white hover:bg-white/10 transition-colors flex-shrink-0" aria-label="App launcher">
        <WaffleIcon style={{ fontSize: 22 }} />
      </button>
      <span className="text-[16px] font-semibold text-white whitespace-nowrap pl-2 pr-6">
        Microsoft 365 admin center
      </span>

      {/* Center: search — hidden below md, fluid on md+ */}
      <div className="hidden md:flex flex-1 justify-center px-2 md:px-4 min-w-0">
        <div className="w-full max-w-[468px] h-8 bg-[#333] rounded-sm flex items-center gap-2 px-3">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-[#479ef5] flex-shrink-0">
            <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.3" />
            <path d="M11 11l2.5 2.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
          </svg>
          <span className="text-[14px] text-[#d6d6d6]">Search</span>
        </div>
      </div>

      {/* spacer below md so right actions push to the right */}
      <div className="flex-1 md:hidden" />

      {/* Right: actions */}
      <div className="flex items-center flex-shrink-0">
        {/* Search icon — below md only */}
        <button className="md:hidden w-10 h-[48px] flex items-center justify-center text-white hover:bg-white/10 transition-colors" aria-label="Search">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-white">
            <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.3" />
            <path d="M11 11l2.5 2.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
          </svg>
        </button>

        {/* Overflow "..." — below md only */}
        <button className="md:hidden w-10 h-[48px] flex items-center justify-center text-white hover:bg-white/10 transition-colors" aria-label="More">
          <span className="text-[18px] font-bold leading-none tracking-widest">···</span>
        </button>

        {/* Copilot button — md+ only */}
        <button className="hidden md:flex items-center gap-1.5 h-[48px] px-3 hover:bg-white/10 transition-colors" aria-label="Copilot">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M11.6696 1.98972C11.469 1.39807 10.9137 1 10.2889 1L9.3884 1C8.6873 1 8.08549 1.49905 7.95572 2.18803L7.02441 7.13282L7.48743 5.54883C7.66914 4.92722 8.23912 4.5 8.88674 4.5L11.7655 4.5L13.01 6.12858L14.118 4.5L13.5658 4.5C12.9411 4.5 12.3858 4.10193 12.1852 3.51027L11.6696 1.98972Z" fill="url(#tnav_a)"/>
            <path d="M4.50309 14.0036C4.70167 14.5987 5.25866 15 5.88598 15H7.35221C8.14798 15 8.79674 14.3619 8.80987 13.5662L8.88301 9.13477L8.49768 10.4516C8.31584 11.073 7.74595 11.5 7.09849 11.5L4.20857 11.5L2.97822 10.4147L2.07031 11.5H2.61719C3.24451 11.5 3.80149 11.9013 4.00008 12.4964L4.50309 14.0036Z" fill="url(#tnav_b)"/>
            <path d="M10.0004 1H4.16755C2.50102 1 1.50109 3.20235 0.834479 5.40471C0.044714 8.01392 -0.988711 11.5035 2.00105 11.5035H4.69024C5.34194 11.5035 5.91403 11.0727 6.09306 10.4461C6.52129 8.94725 7.32308 6.15282 7.94795 4.04403C8.25428 3.01026 8.50944 2.12243 8.90103 1.56954C9.12058 1.25958 9.48649 1 10.0004 1Z" fill="url(#tnav_c)"/>
            <path d="M10.0004 1H4.16755C2.50102 1 1.50109 3.20235 0.834479 5.40471C0.044714 8.01392 -0.988711 11.5035 2.00105 11.5035H4.69024C5.34194 11.5035 5.91403 11.0727 6.09306 10.4461C6.52129 8.94725 7.32308 6.15282 7.94795 4.04403C8.25428 3.01026 8.50944 2.12243 8.90103 1.56954C9.12058 1.25958 9.48649 1 10.0004 1Z" fill="url(#tnav_d)"/>
            <path d="M6 15H11.8329C13.4994 15 14.4993 12.7979 15.166 10.5958C15.9557 7.98686 16.9891 4.49765 13.9994 4.49765H11.3102C10.6585 4.49765 10.0864 4.92845 9.90735 5.55505C9.47911 7.05374 8.67734 9.84779 8.05248 11.9563C7.74615 12.99 7.49099 13.8777 7.0994 14.4305C6.87985 14.7405 6.51395 15 6 15Z" fill="url(#tnav_e)"/>
            <path d="M6 15H11.8329C13.4994 15 14.4993 12.7979 15.166 10.5958C15.9557 7.98686 16.9891 4.49765 13.9994 4.49765H11.3102C10.6585 4.49765 10.0864 4.92845 9.90735 5.55505C9.47911 7.05374 8.67734 9.84779 8.05248 11.9563C7.74615 12.99 7.49099 13.8777 7.0994 14.4305C6.87985 14.7405 6.51395 15 6 15Z" fill="url(#tnav_f)"/>
            <defs>
              <radialGradient id="tnav_a" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(13.0851 7.1729) rotate(-128.772) scale(6.41931 6.01261)">
                <stop offset="0.0955758" stopColor="#00AEFF"/><stop offset="0.773185" stopColor="#2253CE"/><stop offset="1" stopColor="#0736C4"/>
              </radialGradient>
              <radialGradient id="tnav_b" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(3.30628 11.0661) rotate(51.1538) scale(5.67928 5.53958)">
                <stop stopColor="#FFB657"/><stop offset="0.633728" stopColor="#FF5F3D"/><stop offset="0.923392" stopColor="#C02B3C"/>
              </radialGradient>
              <linearGradient id="tnav_c" x1="3.81844" y1="2.2727" x2="4.65052" y2="11.8998" gradientUnits="userSpaceOnUse">
                <stop offset="0.156162" stopColor="#0D91E1"/><stop offset="0.487484" stopColor="#52B471"/><stop offset="0.652394" stopColor="#98BD42"/><stop offset="0.937361" stopColor="#FFC800"/>
              </linearGradient>
              <linearGradient id="tnav_d" x1="4.54577" y1="1" x2="5.00014" y2="11.5035" gradientUnits="userSpaceOnUse">
                <stop stopColor="#3DCBFF"/><stop offset="0.246674" stopColor="#0588F7" stopOpacity="0"/>
              </linearGradient>
              <radialGradient id="tnav_e" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(14.299 3.46939) rotate(109.281) scale(13.9554 16.7229)">
                <stop offset="0.0661714" stopColor="#8C48FF"/><stop offset="0.5" stopColor="#F2598A"/><stop offset="0.895833" stopColor="#FFB152"/>
              </radialGradient>
              <linearGradient id="tnav_f" x1="14.7598" y1="3.85646" x2="14.7539" y2="6.71693" gradientUnits="userSpaceOnUse">
                <stop offset="0.0581535" stopColor="#F8ADFA"/><stop offset="0.708063" stopColor="#A86EDD" stopOpacity="0"/>
              </linearGradient>
            </defs>
          </svg>
          <span className="hidden lg:inline text-[14px] font-semibold text-white">Copilot</span>
        </button>

        {/* Dark mode toggle — sm+ only */}
        <button
          onClick={() => setTheme(isDark ? 'light' : 'dark')}
          className="hidden md:flex items-center gap-1.5 h-[48px] px-3 text-white hover:bg-white/10 transition-colors text-[13px] font-semibold"
          aria-label="Toggle dark mode"
        >
          {mounted && (isDark
            ? <BrightnessIcon style={{ fontSize: 15 }} />
            : <ClearNightIcon style={{ fontSize: 15 }} />
          )}
          <span className="hidden lg:inline">{mounted ? (isDark ? 'Enable Light mode' : 'Enable Dark mode') : ''}</span>
        </button>

        {/* Notifications — sm+ only */}
        <button className="hidden md:flex w-12 h-[48px] items-center justify-center text-white hover:bg-white/10 transition-colors" aria-label="Notifications">
          <RingerIcon style={{ fontSize: 16 }} />
        </button>

        {/* Settings — sm+ only */}
        <button className="hidden md:flex w-12 h-[48px] items-center justify-center text-white hover:bg-white/10 transition-colors" aria-label="Settings">
          <SettingsIcon style={{ fontSize: 16 }} />
        </button>

        {/* Help — sm+ only */}
        <button className="hidden md:flex w-12 h-[48px] items-center justify-center text-white hover:bg-white/10 transition-colors" aria-label="Help">
          <HelpIcon style={{ fontSize: 16 }} />
        </button>

        {/* Avatar */}
        <button className="w-12 h-[48px] flex items-center justify-center hover:bg-white/10 transition-colors" aria-label="Account manager">
          <div className="w-8 h-8 rounded-full bg-[#5c2d91] flex items-center justify-center text-white text-[13px] font-semibold">
            K
          </div>
        </button>
      </div>
    </header>
  );
}
