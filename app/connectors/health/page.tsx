'use client';

import Link from 'next/link';
import { CONNECTORS } from '@/lib/mock-data';
import ConnectorActionsSection from '@/components/dashboard/ConnectorActionsSection';

export default function ConnectorHealthPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="pt-3 px-4 sm:px-8 lg:px-12">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1 text-[12px] text-[#616161] mb-4">
          <Link href="/" className="hover:text-[#0078d4] hover:underline">Home</Link>
          <span className="text-[#c8c6c4]">›</span>
          <Link href="/connectors" className="hover:text-[#0078d4] hover:underline">Connectors</Link>
          <span className="text-[#c8c6c4]">›</span>
          <span className="text-[#242424]">Health</span>
        </nav>

        <h1 className="text-[28px] font-bold text-[#323130] leading-[36px] mb-1">Connection health</h1>
        <p className="text-[14px] text-[#605e5c] mb-6">
          Issues and recommendations across your active connections that affect Copilot results.
        </p>

        <ConnectorActionsSection
          connectors={CONNECTORS}
          onSelectConnector={(id) => {
            window.location.href = `/connectors/${id}`;
          }}
        />
      </div>
    </div>
  );
}
