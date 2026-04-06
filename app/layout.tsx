import type { Metadata } from "next";
import "./globals.css";
import FluentAppProvider from "@/components/FluentProvider";

export const metadata: Metadata = {
  title: "Microsoft 365 admin center",
  description: "Manage your Microsoft 365 connectors",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased" suppressHydrationWarning>
        <FluentAppProvider>
          {children}
        </FluentAppProvider>
      </body>
    </html>
  );
}
