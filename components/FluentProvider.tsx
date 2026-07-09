'use client';

import React from 'react';
import { FluentProvider, webLightTheme, webDarkTheme } from '@fluentui/react-components';
import { initializeIcons } from '@fluentui/react';
import { ThemeProvider } from 'next-themes';

initializeIcons();

function FluentThemeWrapper({ children }: { children: React.ReactNode }) {
  const [isDark, setIsDark] = React.useState(false);
  React.useEffect(() => {
    const update = () => setIsDark(document.documentElement.classList.contains('dark'));
    update();
    const observer = new MutationObserver(update);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);
  return (
    <FluentProvider theme={isDark ? webDarkTheme : webLightTheme}>
      {children}
    </FluentProvider>
  );
}

export default function FluentAppProvider({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" disableTransitionOnChange>
      <FluentThemeWrapper>
        {children}
      </FluentThemeWrapper>
    </ThemeProvider>
  );
}
