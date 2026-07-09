'use client';

import { useState } from 'react';
import { ChevronDown, ExternalLink } from 'lucide-react';
import type { DiagnosticIssue } from '@/lib/types';
import HealthPanel from '@/components/rail/HealthPanel';

interface WizardRailProps {
  issues: DiagnosticIssue[];
}

const GUIDANCE_SECTIONS = [
  {
    id: 'setup-mode',
    title: 'Simple/Advanced setup',
    content: 'Simple setup provides a quick way to connect using default Microsoft-managed values. Advanced setup lets you customise properties, schedule syncs, and configure mappings.',
  },
  {
    id: 'display-name',
    title: 'Connection display name',
    content: 'The connection display name is an internal identifier used to manage this connection in the admin centre. It is not visible to end users.',
  },
  {
    id: 'icon-name',
    title: 'Display icon & name',
    content: 'The source name and icon appear in Copilot search results so users can identify where a result comes from. Choose a name that matches how your organisation refers to this system.',
  },
  {
    id: 'user-criteria',
    title: 'User criteria setup in ServiceNow',
    content: 'Simple mode uses ServiceNow roles for access control. Choose Advanced only if your organisation uses scripted ACLs or custom user criteria that go beyond role-based permissions.',
  },
  {
    id: 'instance-url',
    title: 'ServiceNow Instance URL',
    content: 'Enter the full URL of your ServiceNow instance, for example https://contoso.service-now.com. Do not include a trailing slash or path.',
  },
  {
    id: 'auth-types',
    title: 'Authentication types',
    content: 'Basic Auth uses a username and password. OAuth 2.0 is recommended for production environments as it supports token refresh and does not require storing credentials directly.',
  },
  {
    id: 'staged-rollout',
    title: 'Staged rollout',
    content: 'Limit the connector to specific users or groups during initial rollout. You can expand access at any time from the connection settings after creation.',
  },
  {
    id: 'troubleshooting',
    title: 'Troubleshooting',
    content: "If the connection fails to sync, verify that the service account has the required ServiceNow roles (kb_reader, snc_internal) and that the instance URL is reachable from Microsoft's network.",
  },
];

function AccordionSection({ title, content }: { title: string; content: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-[var(--border)] last:border-b-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-[11px] px-[14px] text-left gap-2 hover:bg-[var(--bg)] transition-colors"
      >
        <span className="text-[12px] font-medium text-[var(--text-primary)] leading-[1.4]">{title}</span>
        <ChevronDown
          size={14}
          className={`flex-shrink-0 text-[var(--text-tertiary)] transition-transform duration-150 ${open ? 'rotate-180' : ''}`}
        />
      </button>
      {open && (
        <div className="px-[14px] pb-[12px]">
          <p className="text-[11.5px] text-[var(--text-secondary)] leading-[1.6]">{content}</p>
        </div>
      )}
    </div>
  );
}

function SetupGuidancePanel() {
  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="px-[14px] py-[13px] flex items-center justify-between border-b border-[var(--border)] flex-shrink-0">
        <span className="text-[12px] font-semibold text-[var(--text-primary)]">Setup guidance</span>
        <a
          href="#"
          className="text-[11px] text-[var(--accent)] underline underline-offset-2 flex items-center gap-[3px] hover:opacity-70 transition-opacity"
        >
          Read detailed documentation
          <ExternalLink size={10} />
        </a>
      </div>
      <div className="flex-1 overflow-y-auto">
        {GUIDANCE_SECTIONS.map((s) => (
          <AccordionSection key={s.id} title={s.title} content={s.content} />
        ))}
      </div>
    </div>
  );
}

export default function WizardRail({ issues }: WizardRailProps) {
  const [active, setActive] = useState<'guide' | 'health'>('guide');

  return (
    <div className="flex flex-col h-full">
      {/* Tab bar */}
      <div className="flex border-b border-[var(--border)] bg-[var(--surface)] flex-shrink-0">
        {(['guide', 'health'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActive(tab)}
            className={`flex-1 py-[13px] px-2 text-[11.5px] font-medium text-center cursor-pointer transition-all leading-[1.3] select-none border-b-2 -mb-px ${
              active === tab
                ? 'text-[var(--text-primary)] border-[var(--text-primary)]'
                : 'text-[var(--text-tertiary)] border-transparent hover:text-[var(--text-secondary)]'
            }`}
          >
            {tab === 'guide' ? 'Setup guidance' : 'Connector health'}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-hidden">
        {active === 'guide' ? (
          <SetupGuidancePanel />
        ) : (
          <div className="p-[14px] h-full overflow-y-auto">
            <HealthPanel issues={issues} />
          </div>
        )}
      </div>
    </div>
  );
}
