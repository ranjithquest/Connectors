'use client';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { BrightnessIcon, ClearNightIcon } from '@fluentui/react-icons-mdl2';

export default function ThemeBar() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const isDark = mounted && theme === 'dark';

  if (!mounted) return null;

  return (
    <button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className="fixed top-[60px] right-4 z-40 flex items-center gap-1.5 px-3 py-1.5 text-[13px] font-semibold text-[#323130] dark:text-[#d6d6d6] hover:underline transition-colors"
      aria-label="Toggle dark mode"
    >
      {isDark
        ? <BrightnessIcon style={{ fontSize: 15 }} />
        : <ClearNightIcon style={{ fontSize: 15 }} />
      }
      <span>{isDark ? 'Enable Light mode' : 'Enable Dark mode'}</span>
    </button>
  );
}
