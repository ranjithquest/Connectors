import type { Metadata } from "next";
import "./globals.css";
import TopNav from "@/components/layout/TopNav";
import LeftNav from "@/components/layout/LeftNav";
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
    <html lang="en">
      <body className="antialiased">
        <FluentAppProvider>
          <div className="flex flex-col h-screen overflow-hidden">
            <TopNav />
            <div className="flex flex-1 overflow-hidden bg-white">
              <LeftNav />
              <main className="flex-1 overflow-y-auto bg-white">
                {children}
              </main>
            </div>
          </div>
        </FluentAppProvider>
      </body>
    </html>
  );
}
