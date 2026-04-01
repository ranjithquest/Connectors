'use client';

import { FluentProvider, webLightTheme, webDarkTheme } from '@fluentui/react-components';
import { initializeIcons } from '@fluentui/react';
import { ThemeProvider, useTheme } from 'next-themes';

initializeIcons();

function FluentThemeWrapper({ children }: { children: React.ReactNode }) {
  const { resolvedTheme } = useTheme();
  return (
    <FluentProvider theme={resolvedTheme === 'dark' ? webDarkTheme : webLightTheme}>
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
