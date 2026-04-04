import { notFound } from 'next/navigation';
import Link from 'next/link';
import { CONNECTORS } from '@/lib/mock-data';

export function generateStaticParams() {
  return CONNECTORS.map((c) => ({ id: c.id }));
}
import Breadcrumb from '@/components/layout/Breadcrumb';
import Badge from '@/components/ui/Badge';
import Card from '@/components/ui/Card';
import { CheckCircle, AlertCircle, AlertTriangle, Loader } from 'lucide-react';

interface Props {
  params: { id: string };
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

const severityStyles = {
  blocker: { card: 'bg-[var(--red-bg)] border-[var(--red-border)]', title: 'text-[var(--red-text)]', badge: 'bg-[#F7C1C1] text-[var(--red-text)]', desc: 'text-[var(--red-mid)]', action: 'bg-[var(--red-action-bg)] border-l-[var(--red-mid)] text-[var(--red-text)]', actionLabel: 'text-[var(--red-mid)]', label: 'Blocker' },
  warning: { card: 'bg-[var(--amber-bg)] border-[var(--amber-border)]', title: 'text-[var(--amber-text)]', badge: 'bg-[#FAC775] text-[var(--amber-text)]', desc: 'text-[var(--amber-mid)]', action: 'bg-[var(--amber-action-bg)] border-l-[var(--amber-mid)] text-[var(--amber-text)]', actionLabel: 'text-[var(--amber-mid)]', label: 'Workaround' },
  suggestion: { card: 'bg-[var(--green-bg)] border-[var(--green-border)]', title: 'text-[var(--green-text)]', badge: 'bg-[#C0DD97] text-[var(--green-text)]', desc: 'text-[var(--green-mid)]', action: 'bg-[var(--green-action-bg)] border-l-[var(--green-mid)] text-[var(--green-text)]', actionLabel: 'text-[var(--green-mid)]', label: 'How to' },
};

const syncStatusConfig = {
  success: { icon: CheckCircle, color: 'text-[var(--green-mid)]', label: 'Success' },
  partial: { icon: AlertTriangle, color: 'text-[var(--amber-mid)]', label: 'Partial' },
  failed: { icon: AlertCircle, color: 'text-[var(--red-mid)]', label: 'Failed' },
  running: { icon: Loader, color: 'text-[var(--text-tertiary)]', label: 'Running' },
};

export default function DiagnosticsPage({ params }: Props) {
  const connector = CONNECTORS.find((c) => c.id === params.id);
  if (!connector) notFound();

  const resolved = connector.issues.filter((i) => i.resolvedAt);
  const open = connector.issues.filter((i) => !i.resolvedAt);

  return (
    <div className="min-h-screen bg-[var(--bg)] py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <Breadcrumb crumbs={[
          { label: 'Home', href: '/' },
          { label: 'Connectors', href: '/connectors' },
          { label: connector.displayName, href: `/connectors/${connector.id}` },
          { label: 'Diagnostics' },
        ]} />

        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-[22px] font-medium text-[var(--text-primary)] tracking-tight">Diagnostics</h1>
            <p className="text-[13px] text-[var(--text-secondary)] mt-0.5">{connector.displayName}</p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant={connector.healthStatus} />
            <Link href={`/connectors/${connector.id}`} className="px-5 py-[9px] text-[13px] font-medium bg-transparent border border-[var(--border-mid)] text-[var(--text-secondary)] rounded-lg hover:bg-[var(--surface)] transition-all">
              ← Back to connector
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { label: 'Open blockers', value: connector.blockerCount, color: 'text-[var(--red-text)]' },
            { label: 'Warnings', value: connector.warningCount, color: 'text-[var(--amber-text)]' },
            { label: 'Suggestions', value: connector.suggestionCount, color: 'text-[var(--text-secondary)]' },
          ].map((s) => (
            <Card key={s.label} className="text-center">
              <div className={`text-[28px] font-medium tracking-tight mb-1 ${s.color}`}>{s.value}</div>
              <div className="text-[12px] text-[var(--text-secondary)]">{s.label}</div>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-6">
          {/* Open issues */}
          <div>
            <h2 className="text-[13px] font-medium text-[var(--text-primary)] mb-3 tracking-[-0.01em]">Open issues</h2>
            {open.length === 0 ? (
              <Card><p className="text-[12px] text-[var(--text-secondary)]">No open issues.</p></Card>
            ) : (
              <div className="space-y-3">
                {open.map((issue) => {
                  const s = severityStyles[issue.severity];
                  return (
                    <div key={issue.id} className={`rounded-xl border p-4 ${s.card}`}>
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`text-[9px] font-medium font-mono px-1.5 py-px rounded-full ${s.badge}`}>{s.label}</span>
                        <span className={`text-[13px] font-medium ${s.title}`}>{issue.title}</span>
                      </div>
                      <p className={`text-[11.5px] leading-[1.55] mb-3 ${s.desc}`}>{issue.description}</p>
                      <div className={`text-[11px] leading-[1.5] px-3 py-2 rounded-lg border-l-2 ${s.action}`}>
                        <div className={`text-[9px] font-medium font-mono tracking-[0.07em] uppercase mb-1 ${s.actionLabel}`}>{s.label}</div>
                        {issue.resolution}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Sync log */}
          <div>
            <h2 className="text-[13px] font-medium text-[var(--text-primary)] mb-3 tracking-[-0.01em]">Sync log</h2>
            <Card noPadding>
              {connector.syncHistory.length === 0 ? (
                <div className="px-5 py-4 text-[12px] text-[var(--text-secondary)]">No sync events yet.</div>
              ) : (
                connector.syncHistory.map((ev, i) => {
                  const cfg = syncStatusConfig[ev.status];
                  const Icon = cfg.icon;
                  return (
                    <div key={ev.id} className={`px-5 py-3 flex items-center gap-3 ${i < connector.syncHistory.length - 1 ? 'border-b border-[var(--border)]' : ''}`}>
                      <Icon size={14} className={`flex-shrink-0 ${cfg.color}`} />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-px">
                          <span className={`text-[11px] font-medium font-mono ${cfg.color}`}>{cfg.label}</span>
                          {ev.itemsIndexed > 0 && <span className="text-[11px] text-[var(--text-tertiary)]">{ev.itemsIndexed.toLocaleString()} items indexed</span>}
                          {ev.errorCount > 0 && <span className="text-[11px] text-[var(--red-mid)]">{ev.errorCount} error{ev.errorCount > 1 ? 's' : ''}</span>}
                        </div>
                        <div className="text-[11px] text-[var(--text-tertiary)]">{formatDate(ev.startedAt)}</div>
                      </div>
                    </div>
                  );
                })
              )}
            </Card>

            {resolved.length > 0 && (
              <div className="mt-6">
                <h2 className="text-[13px] font-medium text-[var(--text-primary)] mb-3 tracking-[-0.01em]">Resolved issues</h2>
                <div className="space-y-2">
                  {resolved.map((issue) => (
                    <div key={issue.id} className="flex items-center gap-3 py-2 border-b border-[var(--border)] last:border-0">
                      <CheckCircle size={14} className="text-[var(--green-mid)] flex-shrink-0" />
                      <div>
                        <div className="text-[12px] font-medium text-[var(--text-primary)]">{issue.title}</div>
                        <div className="text-[11px] text-[var(--text-tertiary)]">Resolved {issue.resolvedAt ? formatDate(issue.resolvedAt) : ''}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
