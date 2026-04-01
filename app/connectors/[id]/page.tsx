import { notFound } from 'next/navigation';
import Link from 'next/link';
import { CONNECTORS } from '@/lib/mock-data';

interface Props {
  params: { id: string };
}

const SEVERITY_CONFIG = {
  blocker: { label: 'Blocker', bg: 'bg-[#fdf1f1]', text: 'text-[#a80000]', border: 'border-[#f0c8c8]', dot: 'bg-[#a80000]' },
  warning: { label: 'Warning', bg: 'bg-[#fdf5e8]', text: 'text-[#6b4010]', border: 'border-[#f0d898]', dot: 'bg-[#f0a30a]' },
  suggestion: { label: 'Suggestion', bg: 'bg-[#f0f7ec]', text: 'text-[#2a5a18]', border: 'border-[#c8e0b8]', dot: 'bg-[#107c10]' },
};

function StatusBadge({ status }: { status: string }) {
  if (status === 'error') return (
    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 text-[12px] text-[#a80000] bg-[#fdf1f1] border border-[#f0c8c8] rounded-[2px]">
      <span className="w-1.5 h-1.5 rounded-full bg-[#a80000]" />Error
    </span>
  );
  if (status === 'pending') return (
    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 text-[12px] text-[#0078d4] bg-[#f0f6ff] border border-[#b3d4f5] rounded-[2px]">
      <span className="w-1.5 h-1.5 rounded-full bg-[#0078d4]" />Syncing
    </span>
  );
  return (
    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 text-[12px] text-[#107c10] bg-[#f0f7ec] border border-[#c8e0b8] rounded-[2px]">
      <span className="w-1.5 h-1.5 rounded-full bg-[#107c10]" />Ready
    </span>
  );
}

function formatDate(iso?: string) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

function formatRelative(iso?: string) {
  if (!iso) return '—';
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Few seconds ago';
  if (mins < 60) return `${mins} mins ago`;
  return `${Math.floor(mins / 60)}h ago`;
}

export default function ConnectorHealthPage({ params }: Props) {
  const connector = CONNECTORS.find((c) => c.id === params.id);
  if (!connector) notFound();

  const lastSync = connector.syncHistory[0];

  return (
    <div className="min-h-full bg-white">
      {/* Breadcrumb */}
      <div className="px-8 pt-5">
        <nav className="flex items-center gap-1 text-[12px] text-[#605e5c] mb-4">
          <Link href="/" className="hover:text-[#0078d4]">Home</Link>
          <span>›</span>
          <Link href="/connectors" className="hover:text-[#0078d4]">Connectors</Link>
          <span>›</span>
          <span className="text-[#323130]">{connector.displayName}</span>
        </nav>
      </div>

      {/* Header */}
      <div className="border-b border-[#c8c8c8] px-8 pb-0">
        <div className="flex items-start justify-between pb-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-shrink-0">
              <div className="w-[72px] h-[72px] rounded-[8px] bg-[#284903] flex items-center justify-center">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                  <circle cx="16" cy="16" r="14" fill="white" opacity="0.9" />
                  <circle cx="16" cy="16" r="8" fill="#284903" />
                  <circle cx="16" cy="16" r="4" fill="white" opacity="0.9" />
                </svg>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-[20px] font-bold text-black leading-7">{connector.displayName}</h1>
                <StatusBadge status={connector.healthStatus} />
              </div>
              <p className="text-[14px] text-[#323130] mt-0.5">{connector.connectorType}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/connectors"
              className="px-[19px] py-[6px] text-[14px] font-semibold text-[#323130] bg-[#e8e8e8] rounded-[2px] hover:bg-[#d2d0ce] transition-colors"
            >
              ← Back
            </Link>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex">
          {['Setup', 'Users', 'Content', 'Sync'].map((tab, i) => (
            <button key={tab} disabled={i !== 0}
              className={`pb-2 mr-6 text-[14px] border-b-2 -mb-px ${i === 0 ? 'font-semibold text-[#0078d4] border-[#0078d4]' : 'text-[#a19f9d] border-transparent cursor-not-allowed'}`}>
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex px-8 py-6 gap-8">
        {/* Left: main health content */}
        <div className="flex-1 min-w-0 flex flex-col gap-6">

          {/* Connection health summary */}
          <div>
            <h2 className="text-[16px] font-semibold text-[#323130] mb-4">Connection health</h2>
            <div className="grid grid-cols-4 gap-4">
              {[
                { label: 'Status', value: <StatusBadge status={connector.healthStatus} /> },
                { label: 'Blockers', value: <span className={`text-[20px] font-bold ${connector.blockerCount > 0 ? 'text-[#a80000]' : 'text-[#323130]'}`}>{connector.blockerCount}</span> },
                { label: 'Warnings', value: <span className={`text-[20px] font-bold ${connector.warningCount > 0 ? 'text-[#f0a30a]' : 'text-[#323130]'}`}>{connector.warningCount}</span> },
                { label: 'Suggestions', value: <span className="text-[20px] font-bold text-[#323130]">{connector.suggestionCount}</span> },
              ].map(({ label, value }) => (
                <div key={label} className="border border-[#e1e1e1] rounded-[2px] p-4">
                  <p className="text-[12px] text-[#605e5c] mb-2">{label}</p>
                  {value}
                </div>
              ))}
            </div>
          </div>

          {/* Issues */}
          {connector.issues.length > 0 && (
            <div>
              <h2 className="text-[16px] font-semibold text-[#323130] mb-3">Issues</h2>
              <div className="flex flex-col gap-3">
                {connector.issues.map((issue) => {
                  const cfg = SEVERITY_CONFIG[issue.severity];
                  return (
                    <div key={issue.id} className={`${cfg.bg} border ${cfg.border} rounded-[2px] p-4`}>
                      <div className="flex items-start gap-2 mb-1">
                        <span className={`mt-1.5 w-2 h-2 rounded-full flex-shrink-0 ${cfg.dot}`} />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className={`text-[11px] font-semibold uppercase tracking-wide ${cfg.text}`}>{cfg.label}</span>
                            <span className="text-[14px] font-semibold text-[#323130]">{issue.title}</span>
                          </div>
                          <p className="text-[13px] text-[#484644] leading-5 mb-2">{issue.description}</p>
                          <div className="flex items-start gap-1.5">
                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="mt-0.5 flex-shrink-0 text-[#0078d4]">
                              <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.2" />
                              <path d="M7 6v4M7 4.5v.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                            </svg>
                            <p className="text-[12px] text-[#605e5c] leading-4">{issue.resolution}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Connection details */}
          <div>
            <h2 className="text-[16px] font-semibold text-[#323130] mb-3">Connection details</h2>
            <div className="border border-[#e1e1e1] rounded-[2px] overflow-hidden">
              {[
                { label: 'Connector type', value: connector.connectorType },
                { label: 'Instance URL', value: connector.instanceUrl },
                { label: 'Authentication', value: connector.authMethod === 'oauth2' ? 'OAuth 2.0' : 'Basic Auth' },
                { label: 'User criteria', value: connector.userCriteriaType === 'simple' ? 'Simple' : 'Advanced' },
                { label: 'Created', value: formatDate(connector.createdAt) },
                { label: 'Last sync', value: connector.lastSyncAt ? `${formatDate(connector.lastSyncAt)} (${formatRelative(connector.lastSyncAt)})` : '—' },
              ].map(({ label, value }, i) => (
                <div key={label} className={`flex items-center px-4 py-3 ${i > 0 ? 'border-t border-[#f3f2f1]' : ''}`}>
                  <span className="w-48 flex-shrink-0 text-[13px] font-semibold text-[#323130]">{label}</span>
                  <span className="text-[13px] text-[#484644]">{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Sync history */}
          {connector.syncHistory.length > 0 && (
            <div>
              <h2 className="text-[16px] font-semibold text-[#323130] mb-3">Sync history</h2>
              <table className="w-full border border-[#e1e1e1] rounded-[2px] overflow-hidden">
                <thead>
                  <tr className="bg-[#f9f8f6] border-b border-[#e1e1e1]">
                    {['Started', 'Completed', 'Status', 'Items indexed', 'Errors'].map((col) => (
                      <th key={col} className="px-4 py-2 text-left text-[12px] font-semibold text-[#323130]">{col}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {connector.syncHistory.map((ev, i) => (
                    <tr key={ev.id} className={i > 0 ? 'border-t border-[#f3f2f1]' : ''}>
                      <td className="px-4 py-3 text-[13px] text-[#323130]">{formatDate(ev.startedAt)}</td>
                      <td className="px-4 py-3 text-[13px] text-[#323130]">{formatDate(ev.completedAt)}</td>
                      <td className="px-4 py-3">
                        {ev.status === 'success' && <span className="text-[12px] text-[#107c10] font-semibold">✓ Success</span>}
                        {ev.status === 'partial' && <span className="text-[12px] text-[#f0a30a] font-semibold">⚠ Partial</span>}
                        {ev.status === 'failed' && <span className="text-[12px] text-[#a80000] font-semibold">✗ Failed</span>}
                      </td>
                      <td className="px-4 py-3 text-[13px] text-[#323130]">{ev.itemsIndexed.toLocaleString()}</td>
                      <td className="px-4 py-3 text-[13px]">
                        <span className={ev.errorCount > 0 ? 'text-[#a80000]' : 'text-[#323130]'}>{ev.errorCount}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Right: setup guide steps */}
        <div className="w-64 flex-shrink-0">
          <h2 className="text-[14px] font-bold text-[#323130] mb-4">Setup guide</h2>
          <div className="flex flex-col gap-3">
            {connector.guideSteps.map((step) => (
              <div key={step.step} className="flex items-start gap-2">
                <div className={`w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center text-[11px] font-bold mt-0.5 ${
                  step.status === 'ok' ? 'bg-[#107c10] text-white' :
                  step.status === 'warn' ? 'bg-[#f0a30a] text-white' :
                  'text-[#605e5c]'
                }`}>
                  {step.status === 'ok' ? '✓' : step.status === 'warn' ? '!' : step.step}
                </div>
                <div>
                  <p className="text-[13px] font-semibold text-[#323130] leading-5">{step.title}</p>
                  <p className="text-[12px] text-[#605e5c] leading-4">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
