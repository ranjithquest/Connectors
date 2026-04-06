import TopNav from "@/components/layout/TopNav";
import LeftNav from "@/components/layout/LeftNav";
import ScrollbarManager from "@/components/layout/ScrollbarManager";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <ScrollbarManager />
      <TopNav />
      <div className="flex flex-1 overflow-hidden" style={{ backgroundColor: 'var(--bg)' }}>
        <LeftNav />
        <main className="flex-1 overflow-y-auto" style={{ backgroundColor: 'var(--bg)' }}>
          {children}
        </main>
      </div>
    </div>
  );
}
