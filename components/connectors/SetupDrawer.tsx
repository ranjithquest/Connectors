'use client';

import React, { useState } from 'react';
import type { Connector, AuthMethod, UserCriteriaType, DiagnosticIssue, IssueSource, SyncEvent } from '@/lib/types';
import { CONNECTOR_CATALOG } from '@/lib/gallery-data';
import {
  SearchIcon, ChromeCloseIcon, EditIcon, SettingsIcon,
  ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon, CheckMarkIcon, InfoIcon,
  OpenInNewWindowIcon, NavigateBackIcon, DiagnosticIcon,
  StatusCircleCheckmarkIcon, ErrorBadgeIcon, StatusCircleSyncIcon,
  WarningSolidIcon, AlertSolidIcon, LightbulbIcon,
  RepairIcon, SyncIcon, AddIcon, DeleteIcon, UploadIcon, RefreshIcon,
} from '@fluentui/react-icons-mdl2';

// ─── Guidance panel ───────────────────────────────────────────────────────────

type GuidanceSection = { id: string; title: string; defaultOpen: boolean; content: React.ReactNode };

const GUIDANCE_SECTIONS: GuidanceSection[] = [
  {
    id: 'icon-name',
    title: 'Source icon and name',
    defaultOpen: false,
    content: (
      <div className="text-[12px] text-[#323130] leading-[16px]">
        Source Icon &amp; name are displayed to the end users on Copilot search
      </div>
    ),
  },
  {
    id: 'display-name', title: 'Connector name', defaultOpen: false,
    content: (
      <div className="text-[12px] text-[#323130] leading-[18px] flex flex-col gap-2">
        <p>The connector name is a unique label used to manage and identify this connection in the admin portal. It is not shown to end users.</p>
        <p>Use a descriptive name that reflects the data source, e.g. <span className="font-semibold">HR Policies – ServiceNow</span>.</p>
      </div>
    ),
  },
  {
    id: 'user-criteria', title: 'User criteria setup in ServiceNow', defaultOpen: false,
    content: (
      <div className="text-[12px] text-[#323130] leading-[18px] flex flex-col gap-2">
        <p><span className="font-semibold">Simple</span> — Restrict access using a single user-criteria rule defined in ServiceNow. Best for most deployments.</p>
        <p><span className="font-semibold">Advanced</span> — Combine multiple user-criteria rules with AND / OR logic for fine-grained access control.</p>
        <p>Ensure matching user criteria exist in your ServiceNow instance before saving.</p>
      </div>
    ),
  },
  {
    id: 'instance-url', title: 'ServiceNow Instance URL', defaultOpen: false,
    content: (
      <div className="text-[12px] text-[#323130] leading-[18px] flex flex-col gap-2">
        <p>Enter the base URL of your ServiceNow instance, e.g. <span className="font-semibold">example.service-now.com</span>.</p>
        <p>Do not include a path or trailing slash. The connector will append the required API endpoints automatically.</p>
        <p>Make sure your instance is reachable from Microsoft's indexing service and that the API user has the necessary roles.</p>
      </div>
    ),
  },
  {
    id: 'auth-types', title: 'Authentication types', defaultOpen: false,
    content: (
      <div className="text-[12px] text-[#323130] leading-[18px] flex flex-col gap-2">
        <p><span className="font-semibold">Basic auth</span> — Authenticate with a ServiceNow username and password. Simple to set up but less secure; rotate credentials regularly.</p>
        <p><span className="font-semibold">OAuth 2.0</span> — Recommended. Uses a client ID and secret to obtain short-lived tokens. Requires an OAuth application record in ServiceNow.</p>
        <p>Credentials are stored encrypted in Microsoft's secure vault and are never exposed in logs.</p>
      </div>
    ),
  },
  {
    id: 'staged-rollout', title: 'Staged rollout', defaultOpen: false,
    content: (
      <div className="text-[12px] text-[#323130] leading-[18px] flex flex-col gap-2">
        <p>Limit who can search indexed content by selecting specific users or groups. Useful for piloting the connector before a broad release.</p>
        <p>Leave this field empty to make content available to all users in your organisation.</p>
        <p>Changes to the rollout list take effect on the next sync cycle.</p>
      </div>
    ),
  },
  {
    id: 'troubleshooting', title: 'Troubleshooting', defaultOpen: false,
    content: (
      <div className="text-[12px] text-[#323130] leading-[18px] flex flex-col gap-2">
        <p>If the connector shows an error, check:</p>
        <ul className="list-disc list-inside flex flex-col gap-1 pl-1">
          <li>The ServiceNow instance URL is correct and reachable.</li>
          <li>The API user has the <span className="font-semibold">snc_read</span> role in ServiceNow.</li>
          <li>OAuth credentials have not expired or been revoked.</li>
          <li>Firewall rules allow outbound traffic from Microsoft's crawl IPs.</li>
        </ul>
        <a href="https://learn.microsoft.com/en-us/microsoftsearch/servicenow-connector" target="_blank" rel="noreferrer" className="text-[#0078d4] hover:underline mt-1">View full troubleshooting guide →</a>
      </div>
    ),
  },
];

const USERS_GUIDANCE_SECTIONS: GuidanceSection[] = [
  {
    id: 'access-permissions', title: 'Access permissions', defaultOpen: false,
    content: (
      <div className="text-[12px] text-[#323130] leading-[18px] flex flex-col gap-2">
        <p><span className="font-semibold">Only people with access to this data source</span> — Respects the access controls already set in ServiceNow. Only users who can see an item in ServiceNow will be able to find it in search results.</p>
        <p><span className="font-semibold">Everyone</span> — All users in your organisation can discover indexed content, regardless of their permissions in ServiceNow. Use this only for publicly available knowledge bases.</p>
      </div>
    ),
  },
  {
    id: 'user-mapping', title: 'User identity mapping', defaultOpen: false,
    content: (
      <div className="text-[12px] text-[#323130] leading-[18px] flex flex-col gap-2">
        <p>The connector maps ServiceNow user identities to Azure AD accounts using the <span className="font-semibold">email address</span> field by default.</p>
        <p>If your ServiceNow users have a different primary identifier, update the mapping field to match — for example, <span className="font-semibold">user_name</span> or a custom attribute.</p>
        <p>Unmapped users will not receive personalised results even if ACL-based access is enabled.</p>
      </div>
    ),
  },
  {
    id: 'external-groups', title: 'External groups', defaultOpen: false,
    content: (
      <div className="text-[12px] text-[#323130] leading-[18px] flex flex-col gap-2">
        <p>External groups allow you to replicate ServiceNow group memberships in Microsoft Search without syncing the full directory.</p>
        <p>Enable this option if your ServiceNow ACLs use groups. The connector will index group membership alongside content and apply it during search-time access checks.</p>
      </div>
    ),
  },
];

const CONTENT_GUIDANCE_SECTIONS: GuidanceSection[] = [
  {
    id: 'include-data', title: 'Include data to index', defaultOpen: false,
    content: (
      <div className="text-[12px] text-[#323130] leading-[18px] flex flex-col gap-2">
        <p>Use query filters to restrict which records are indexed. For example, index only active knowledge articles in the <span className="font-semibold">HR</span> category.</p>
        <p>Filters follow ServiceNow encoded query syntax. Leave empty to index all accessible records.</p>
        <p>Tip: Start with a narrow filter, validate results, then broaden scope incrementally.</p>
      </div>
    ),
  },
  {
    id: 'manage-properties', title: 'Manage properties', defaultOpen: false,
    content: (
      <div className="text-[12px] text-[#323130] leading-[18px] flex flex-col gap-2">
        <p>Properties control which fields from ServiceNow are indexed and surfaced in search results.</p>
        <p>Assign semantic labels — <span className="font-semibold">Title</span>, <span className="font-semibold">URL</span>, <span className="font-semibold">Author</span> — to help Microsoft Search understand the meaning of each field.</p>
        <p>Only properties marked as <span className="font-semibold">Searchable</span> are included in the full-text index. Mark fields as <span className="font-semibold">Retrievable</span> to show them in result cards.</p>
      </div>
    ),
  },
  {
    id: 'result-layout', title: 'Search result layout', defaultOpen: false,
    content: (
      <div className="text-[12px] text-[#323130] leading-[18px] flex flex-col gap-2">
        <p>The result layout determines how indexed items appear in Microsoft Search and Copilot responses.</p>
        <p>Choose an adaptive card template or create a custom layout using the <span className="font-semibold">Result Type Designer</span> in the Microsoft 365 admin centre.</p>
      </div>
    ),
  },
];

const SYNC_GUIDANCE_SECTIONS: GuidanceSection[] = [
  {
    id: 'full-crawl', title: 'Full crawl', defaultOpen: false,
    content: (
      <div className="text-[12px] text-[#323130] leading-[18px] flex flex-col gap-2">
        <p>A full crawl re-indexes every item in the data source from scratch. It ensures the index is fully consistent but uses more resources.</p>
        <p>Schedule full crawls weekly or monthly depending on how frequently your data changes. The first crawl is always a full crawl.</p>
      </div>
    ),
  },
  {
    id: 'incremental-crawl', title: 'Incremental crawl', defaultOpen: false,
    content: (
      <div className="text-[12px] text-[#323130] leading-[18px] flex flex-col gap-2">
        <p>Incremental crawls only index items that have been created, modified, or deleted since the last crawl. They are faster and lighter on both your ServiceNow instance and Microsoft's indexing service.</p>
        <p>Set the frequency based on how time-sensitive your data is — every 15 minutes for high-velocity data, daily for more static content.</p>
      </div>
    ),
  },
  {
    id: 'timezone', title: 'Timezone', defaultOpen: false,
    content: (
      <div className="text-[12px] text-[#323130] leading-[18px] flex flex-col gap-2">
        <p>Set the timezone to match your ServiceNow instance to ensure accurate change-detection timestamps during incremental crawls.</p>
        <p>A mismatch can cause records to be skipped or re-indexed unnecessarily.</p>
      </div>
    ),
  },
];

const TAB_GUIDANCE: Record<string, GuidanceSection[]> = {
  Setup: GUIDANCE_SECTIONS,
  Users: USERS_GUIDANCE_SECTIONS,
  Content: CONTENT_GUIDANCE_SECTIONS,
  Sync: SYNC_GUIDANCE_SECTIONS,
};

function InlineGuidance({ sectionId, active }: { sectionId: string; active?: string }) {
  const section = GUIDANCE_SECTIONS.find((s) => s.id === sectionId);
  if (!section?.content || active !== sectionId) return <div />;
  return (
    <div className="bg-[#f0f6ff] border border-[#c7e0f4] rounded-[4px] px-3 py-3">
      <p className="text-[11px] font-semibold text-[#0078d4] mb-1.5 uppercase tracking-wide">{section.title}</p>
      {section.content}
    </div>
  );
}

function ConnectorIcon({ src, name, size, rounded = '8px' }: { src?: string | null; name: string; size: number; rounded?: string }) {
  const [failed, setFailed] = React.useState(false);
  const initials = name.split(' ').slice(0, 2).map((w) => w[0]?.toUpperCase() ?? '').join('');
  const fontSize = size <= 32 ? 10 : size <= 48 ? 13 : 16;

  if (src && !failed) {
    return (
      <div className="flex-shrink-0 overflow-hidden bg-white" style={{ width: size, height: size, borderRadius: rounded }}>
        <img src={src} alt={name} className="w-full h-full object-contain" onError={() => setFailed(true)} />
      </div>
    );
  }
  return (
    <div className="flex-shrink-0 flex items-center justify-center text-white font-semibold bg-[#0d2137]"
      style={{ width: size, height: size, borderRadius: rounded, fontSize }}>
      {initials}
    </div>
  );
}

function GuidanceRail({ highlightSection, accordionRefsCallback, sections = GUIDANCE_SECTIONS }: {
  highlightSection?: string;
  accordionRefsCallback?: (refs: Record<string, HTMLDivElement | null>) => void;
  sections?: GuidanceSection[];
}) {
  const [openSection, setOpenSection] = useState<string | null>(
    sections.find((s) => s.defaultOpen)?.id ?? null
  );
  const accordionRefs = React.useRef<Record<string, HTMLDivElement | null>>({});

  // When a section is highlighted from outside, open it exclusively
  React.useEffect(() => {
    if (highlightSection) setOpenSection(highlightSection);
  }, [highlightSection]);

  // Expose refs to parent after each render
  React.useEffect(() => {
    accordionRefsCallback?.(accordionRefs.current);
  });

  function toggle(id: string) {
    setOpenSection((prev) => (prev === id ? null : id));
  }
  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex items-center justify-between">
        <span className="text-[14px] font-semibold text-[#323130]">Setup guidance</span>
        <a href="https://learn.microsoft.com/en-us/microsoftsearch/connectors-overview" target="_blank" rel="noreferrer"
          className="text-[13px] text-[#0078d4] whitespace-nowrap hover:underline">
          Read docs
        </a>
      </div>
      <div className="flex flex-col">
        {sections.map((section) => {
          const isOpen = openSection === section.id;
          const isHighlighted = highlightSection === section.id;
          return (
            <div key={section.id} ref={(el) => { accordionRefs.current[section.id] = el; }}
              className={`flex flex-col border-t ${isHighlighted ? 'border-[#0078d4]' : 'border-[#e1e1e1]'}`}>
              <button
                className="flex items-center justify-between h-10 w-full text-left"
                onClick={() => toggle(section.id)}
              >
                <span className={`text-[13px] font-semibold ${isHighlighted ? 'text-[#0078d4]' : 'text-[#323130]'}`}>{section.title}</span>
                <ChevronDownIcon style={{ fontSize: 14 }}
                  className={`text-[#605e5c] flex-shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
              </button>
              {isOpen && section.content && (
                <div className="pb-3">{section.content}</div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Health rail (for existing connections) ───────────────────────────────────

const SEVERITY_CONFIG = {
  blocker: { label: 'Blocker', bg: 'bg-[#fdf1f1]', text: 'text-[#a80000]', border: 'border-[#f0c8c8]', dot: 'bg-[#a80000]', badgeBg: 'bg-[#a80000]' },
  warning: { label: 'Blocker', bg: 'bg-[#fdf1f1]', text: 'text-[#a80000]', border: 'border-[#f0c8c8]', dot: 'bg-[#a80000]', badgeBg: 'bg-[#a80000]' },
  suggestion: { label: 'Suggestion', bg: 'bg-[#f0f7ec]', text: 'text-[#2a5a18]', border: 'border-[#c8e0b8]', dot: 'bg-[#107c10]', badgeBg: 'bg-[#107c10]' },
};

const SOURCE_CONFIG: Record<IssueSource, { label: string; bg: string; text: string; icon: React.ReactNode }> = {
  servicenow: {
    label: 'ServiceNow',
    bg: 'bg-[#f0f6ff]',
    text: 'text-[#0052cc]',
    icon: (
      <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
        <circle cx="5" cy="5" r="4.5" stroke="#0052cc" strokeWidth="1" />
        <path d="M3 5h4M5 3v4" stroke="#0052cc" strokeWidth="1" strokeLinecap="round" />
      </svg>
    ),
  },
  connector: {
    label: 'Connector settings',
    bg: 'bg-[#f5f0ff]',
    text: 'text-[#5c2d91]',
    icon: (
      <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
        <circle cx="2.5" cy="5" r="1.5" stroke="#5c2d91" strokeWidth="1" />
        <circle cx="7.5" cy="2.5" r="1.5" stroke="#5c2d91" strokeWidth="1" />
        <circle cx="7.5" cy="7.5" r="1.5" stroke="#5c2d91" strokeWidth="1" />
        <path d="M4 5h2M6 5V2.5M6 5v2.5" stroke="#5c2d91" strokeWidth="1" strokeLinecap="round" />
      </svg>
    ),
  },
  mismatch: {
    label: 'Mismatch',
    bg: 'bg-[#fff4e0]',
    text: 'text-[#8a4f00]',
    icon: (
      <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
        <path d="M5 1L9 9H1L5 1Z" stroke="#8a4f00" strokeWidth="1" strokeLinejoin="round" />
        <path d="M5 4v2M5 7.5v.5" stroke="#8a4f00" strokeWidth="1" strokeLinecap="round" />
      </svg>
    ),
  },
  unsupported: {
    label: 'Not supported',
    bg: 'bg-[#f3f2f1]',
    text: 'text-[#605e5c]',
    icon: (
      <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
        <circle cx="5" cy="5" r="4.5" stroke="#605e5c" strokeWidth="1" />
        <path d="M3 3l4 4M7 3L3 7" stroke="#605e5c" strokeWidth="1" strokeLinecap="round" />
      </svg>
    ),
  },
};

function SourceTag({ source, connectorTab, onNavigate }: { source: IssueSource; connectorTab?: string; onNavigate?: () => void }) {
  const cfg = SOURCE_CONFIG[source];
  const label = (source === 'connector' && connectorTab) ? `${connectorTab} tab` : cfg.label;
  if (source === 'connector' && connectorTab && onNavigate) {
    return (
      <button onClick={(e) => { e.stopPropagation(); onNavigate(); }}
        className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-[2px] text-[10px] font-semibold ${cfg.bg} ${cfg.text} hover:opacity-80 transition-opacity cursor-pointer`}>
        {cfg.icon}
        {label}
      </button>
    );
  }
  return (
    <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-[2px] text-[10px] font-semibold ${cfg.bg} ${cfg.text}`}>
      {cfg.icon}
      {label}
    </span>
  );
}

function StatusBadge({ status }: { status: string }) {
  if (status === 'error') return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] text-[#a80000] bg-[#fdf1f1] border border-[#f0c8c8] rounded-[2px]">
      <span className="w-1.5 h-1.5 rounded-full bg-[#a80000]" />Error
    </span>
  );
  if (status === 'pending') return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] text-[#0078d4] bg-[#f0f6ff] border border-[#b3d4f5] rounded-[2px]">
      <span className="w-1.5 h-1.5 rounded-full bg-[#0078d4]" />Syncing
    </span>
  );
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] text-[#107c10] bg-[#f0f7ec] border border-[#c8e0b8] rounded-[2px]">
      <span className="w-1.5 h-1.5 rounded-full bg-[#107c10]" />Ready
    </span>
  );
}

function DiagnosticFlow({ issue }: { issue: DiagnosticIssue }) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [step, setStep] = useState(0);
  const [escalated, setEscalated] = useState(false);
  const questions = issue.diagnosticQuestions ?? [];
  const currentQ = questions[step];
  const allAnswered = step >= questions.length;

  if (escalated) {
    return (
      <div className="mt-3 flex flex-col gap-2">
        <div className="bg-[#faf9f8] border border-[#d1d1d1] rounded-[8px] p-3 shadow-[0px_2px_4px_rgba(0,0,0,0.14),0px_0px_2px_rgba(0,0,0,0.12)]">
          <p className="text-[12px] font-semibold text-[#242424] mb-1">Escalate to ServiceNow Support</p>
          <p className="text-[12px] text-[#616161] leading-5 mb-2">Share this diagnostic context with their support team:</p>
          <div className="bg-white border border-[#e1e1e1] rounded-[4px] p-2 text-[11px] text-[#323130] font-mono leading-4">
            <p>Issue: {issue.title}</p>
            {Object.entries(answers).map(([qId, ans]) => {
              const q = questions.find(q => q.id === qId);
              return q ? <p key={qId}>{q.question.slice(0, 30)}…: {ans}</p> : null;
            })}
          </div>
          <a href="https://support.servicenow.com" target="_blank" rel="noreferrer"
            className="mt-2 flex items-center gap-1 text-[12px] text-[#0078d4] hover:underline">
            Open ServiceNow Support
            <OpenInNewWindowIcon style={{ fontSize: 10 }} />
          </a>
        </div>
      </div>
    );
  }

  if (allAnswered) {
    return (
      <div className="mt-3 flex flex-col gap-2">
        <p className="text-[12px] text-[#242424] leading-5">
          Based on your answers, this is a custom ACL configuration that Microsoft cannot fully replicate.
          The safest workaround is to restrict the connector scope to knowledge bases that use role-based access only.
        </p>
        <div className="flex items-center gap-2 flex-wrap">
          <button className="px-3 py-1.5 text-[12px] font-semibold bg-[#0078d4] text-white rounded-[4px] hover:bg-[#106ebe] shadow-[0px_1px_2px_rgba(0,0,0,0.14)]">
            Restrict connector scope
          </button>
          <button onClick={() => setEscalated(true)}
            className="px-3 py-1.5 text-[12px] font-semibold text-[#242424] bg-white border border-[#d1d1d1] rounded-[4px] hover:bg-[#f5f5f5] transition-colors shadow-[0px_1px_2px_rgba(0,0,0,0.14)]">
            Escalate to ServiceNow
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-3 flex flex-col gap-2">
      <div className="flex items-center gap-1.5 mb-1">
        <DiagnosticIcon style={{ fontSize: 12 }} className="text-[#0078d4]" />
        <span className="text-[12px] font-semibold text-[#0078d4]">Let&apos;s diagnose this together</span>
      </div>
      <p className="text-[12px] text-[#242424] leading-5">{currentQ.question}</p>
      <div className="flex flex-col gap-1.5">
        {currentQ.options.map((opt) => (
          <button
            key={opt.value}
            onClick={() => {
              setAnswers((prev) => ({ ...prev, [currentQ.id]: opt.label }));
              setStep((s) => s + 1);
            }}
            className="flex items-center gap-2.5 text-left px-3 py-2 text-[12px] text-[#242424] bg-white border border-[#d1d1d1] rounded-[4px] hover:border-[#0078d4] hover:bg-[#f0f6ff] transition-colors shadow-[0px_1px_2px_rgba(0,0,0,0.10)]"
          >
            <span className="w-3.5 h-3.5 rounded-full border-2 border-[#8a8886] flex-shrink-0" />
            {opt.label}
          </button>
        ))}
      </div>
      <p className="text-[10px] text-[#605e5c]">Question {step + 1} of {questions.length}</p>
    </div>
  );
}

function getSyncCycleLabel(detectedAt: string, syncHistory: SyncEvent[]): string {
  const detectedMs = new Date(detectedAt).getTime();
  const sorted = [...syncHistory].sort((a, b) => new Date(a.startedAt).getTime() - new Date(b.startedAt).getTime());
  const match = sorted.find((e) => new Date(e.startedAt).getTime() >= detectedMs) ?? sorted[sorted.length - 1];
  if (!match) return 'unknown sync';
  return new Date(match.startedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) + ' sync';
}

function IssueCard({ issue, onToggle, detectedSyncLabel, isChecked, onCheck, onDismiss }: { issue: DiagnosticIssue; expanded: boolean; onToggle: () => void; onDiagnose?: () => void; detectedSyncLabel?: string; onNavigateToField?: (tab: string, fieldId: string) => void; isChecked?: boolean; onCheck?: () => void; onDismiss?: () => void }) {
  const cfg = SEVERITY_CONFIG[issue.severity];
  const isBlocker = issue.severity === 'blocker' || issue.severity === 'warning';

  return (
    <div
      onClick={onToggle}
      className="bg-white border border-[#e1e1e1] rounded-[8px] px-4 pt-3 pb-3 flex flex-col gap-3 cursor-pointer hover:border-[#c8c6c4] hover:shadow-[0px_2px_8px_rgba(0,0,0,0.08)] transition-all"
    >
      {/* Top row: source label + severity badge */}
      <div className="flex items-center justify-between">
        <SourceTag source={issue.source} connectorTab={issue.connectorTab} />
        <span className={`text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full ${
          issue.severity === 'blocker' ? 'bg-[#fde7e9] text-[#a80000]'
          : issue.severity === 'warning' ? 'bg-[#fff4ce] text-[#7a5200]'
          : 'bg-[#f0f0f0] text-[#616161]'
        }`}>{cfg.label}</span>
      </div>

      {/* Title */}
      <p className="text-[13px] font-semibold text-[#242424] leading-5">{issue.title}</p>

      {/* Impact pill */}
      {issue.copilotImpact && (
        <div className="flex items-center gap-1.5 self-start bg-[#fff8ec] border border-[#f5dfa0] rounded-full px-2 py-0.5">
          <LightbulbIcon style={{ fontSize: 10 }} className="text-[#c87e00] flex-shrink-0" />
          <span className="text-[10px] text-[#7a5200] font-medium">{issue.copilotImpact}</span>
        </div>
      )}

      {/* Footer: detected date + checkbox */}
      <div className="flex items-center justify-between pt-1 border-t border-[#f0f0f0]">
        <span className="text-[10px] text-[#a19f9d]">{detectedSyncLabel ?? '—'}</span>
        {(onCheck || onDismiss) && (
          <button
            onClick={(e) => { e.stopPropagation(); onCheck ? onCheck() : onDismiss?.(); }}
            className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all duration-200 flex-shrink-0 ${
              isChecked ? 'bg-[#107c10] border-[#107c10]' : isBlocker ? 'border-[#c8c6c4] bg-white hover:border-[#0078d4]' : 'border-[#c8c6c4] bg-white hover:border-[#605e5c]'
            }`}
          >
            {isChecked && (
              <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
                <path d="M1 3.5L3.5 6L8 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            )}
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Guide section ────────────────────────────────────────────────────────────

function GuideSection({ steps }: { steps: { step: number; title: string; description: string }[] }) {
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

  const toggleStep = (step: number) => {
    setCompletedSteps((prev) => {
      const next = new Set(prev);
      next.has(step) ? next.delete(step) : next.add(step);
      return next;
    });
  };

  return (
    <div className="flex flex-col gap-3">
      {steps.map(({ step, title, description }) => {
        const done = completedSteps.has(step);
        return (
          <div key={step} className="flex items-start gap-3">
            <button
              onClick={() => toggleStep(step)}
              className={`flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200 mt-0.5 ${
                done ? 'bg-[#107c10] border-[#107c10]' : 'border-[#c8c6c4] bg-white hover:border-[#0078d4]'
              }`}
            >
              {done ? (
                <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
                  <path d="M1 3.5L3.5 6L8 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              ) : (
                <span className="text-[9px] font-bold text-[#605e5c]">{step}</span>
              )}
            </button>
            <div className="flex-1 min-w-0">
              <p className={`text-[12px] font-semibold leading-4 mb-0.5 ${done ? 'text-[#a19f9d] line-through' : 'text-[#242424]'}`}>{title}</p>
              <p className={`text-[11px] leading-4 ${done ? 'text-[#c8c6c4]' : 'text-[#616161]'}`}>{description}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── Issue focused view ───────────────────────────────────────────────────────

function IssueFocusView({ issue, onBack, detectedSyncLabel, onNavigateToField, isChecked, onCheck, onDismiss, currentIndex, total, onPrev, onNext }: {
  issue: DiagnosticIssue; onBack: () => void; detectedSyncLabel?: string;
  onNavigateToField?: (tab: string, fieldId: string) => void;
  isChecked?: boolean; onCheck?: () => void; onDismiss?: () => void;
  currentIndex?: number; total?: number; onPrev?: () => void; onNext?: () => void;
}) {
  const cfg = SEVERITY_CONFIG[issue.severity];
  const isBlocker = issue.severity === 'blocker' || issue.severity === 'warning';
  const handleNavigate = (issue.connectorTab && issue.connectorFieldId && onNavigateToField)
    ? () => onNavigateToField!(issue.connectorTab!, issue.connectorFieldId!)
    : undefined;

  // Where is it happening
  const whereLabel = issue.source === 'connector'
    ? { text: `In connector settings${issue.connectorTab ? ` · ${issue.connectorTab} tab` : ''}`, external: false }
    : issue.source === 'servicenow'
      ? { text: 'In ServiceNow — outside Microsoft', external: true }
      : issue.source === 'mismatch'
        ? { text: 'Mismatch between connector and ServiceNow', external: true }
        : { text: 'Unsupported configuration', external: true };

  return (
    <div className="flex flex-col h-full -mx-6 -mt-6 bg-white">
      {/* Back nav */}
      <div className="px-6 pt-6 flex-shrink-0">
        <button onClick={onBack} className="flex items-center gap-1.5 text-[12px] text-[#605e5c] hover:text-[#242424] transition-colors mb-4 w-fit">
          <NavigateBackIcon style={{ fontSize: 13 }} />
          Connector health
        </button>
      </div>

      {/* Scrollable body */}
      <div className="flex-1 overflow-y-auto">
      <div className="flex flex-col gap-5 px-6 pb-4">

        {/* Header */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`text-[10px] font-bold uppercase tracking-wide ${cfg.text}`}>{cfg.label}</span>
            <SourceTag source={issue.source} connectorTab={issue.connectorTab} onNavigate={handleNavigate} />
            <span className="text-[10px] text-[#a19f9d] ml-auto">{detectedSyncLabel ?? '—'}</span>
          </div>
          <h2 className="text-[15px] font-semibold text-[#242424] leading-snug">{issue.title}</h2>
          <p className="text-[12px] text-[#616161] leading-5">{issue.description}</p>
        </div>

        {/* Impact pill */}
        {issue.copilotImpact && (
          <div className="flex items-center gap-1.5 self-start bg-[#fff8ec] border border-[#f5dfa0] rounded-full px-2.5 py-1">
            <LightbulbIcon style={{ fontSize: 11 }} className="flex-shrink-0 text-[#c87e00]" />
            <span className="text-[11px] text-[#7a5200] font-medium">{issue.copilotImpact}</span>
          </div>
        )}

        {/* Steps */}
        {issue.guideSteps && issue.guideSteps.length > 0 && (
          <GuideSection steps={issue.guideSteps} />
        )}

        {/* AI diagnostic fallback */}
        {issue.requiresDiagnostic && (
          <button className="self-start flex items-center gap-2 px-3 py-1.5 text-[12px] font-semibold text-[#0078d4] border border-[#0078d4] rounded-[4px] hover:bg-[#f0f6ff] transition-colors">
            <DiagnosticIcon style={{ fontSize: 12 }} />
            Let&apos;s diagnose together
          </button>
        )}
      </div>{/* end inner padding div */}
      </div>{/* end scroll container */}

      {/* Footer */}
      <div className="px-6 pt-3 pb-6 border-t border-[#e1e1e1] flex items-center justify-between flex-shrink-0 gap-2">
        <div className="flex items-center gap-2">
          {isBlocker && onCheck && (
            <button
              onClick={onCheck}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-[4px] text-[12px] font-semibold transition-colors ${
                isChecked ? 'bg-[#dff6dd] text-[#107c10] border border-[#a6d8a6]' : 'bg-[#107c10] text-white hover:bg-[#0b5a0b]'
              }`}
            >
              {isChecked ? <StatusCircleCheckmarkIcon style={{ fontSize: 14 }} /> : <CheckMarkIcon style={{ fontSize: 13 }} />}
              {isChecked ? 'Marked as fixed' : 'Mark as fixed'}
            </button>
          )}
          {!isBlocker && onDismiss && (
            <button onClick={() => { onDismiss(); onBack(); }} className="flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-medium text-[#605e5c] bg-white border border-[#d1d1d1] rounded-[4px] hover:bg-[#f5f5f5] transition-colors">
              Dismiss
            </button>
          )}
        </div>
        {total !== undefined && total > 1 && (
          <div className="flex items-center gap-1">
            <span className="text-[11px] text-[#a19f9d] mr-1">{(currentIndex ?? 0) + 1} / {total}</span>
            <button onClick={onPrev} disabled={!onPrev} className="p-1.5 rounded-[4px] border border-[#d1d1d1] bg-white hover:bg-[#f5f5f5] disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
              <ChevronLeftIcon style={{ fontSize: 12 }} className="text-[#323130]" />
            </button>
            <button onClick={onNext} disabled={!onNext} className="p-1.5 rounded-[4px] border border-[#d1d1d1] bg-white hover:bg-[#f5f5f5] disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
              <ChevronRightIcon style={{ fontSize: 12 }} className="text-[#323130]" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Diagnostic drill-down view ───────────────────────────────────────────────

function DiagnosticDrillDown({ issue, onBack, detectedSyncLabel, onNavigateToField }: { issue: DiagnosticIssue; onBack: () => void; detectedSyncLabel?: string; onNavigateToField?: (tab: string, fieldId: string) => void }) {
  const cfg = SEVERITY_CONFIG[issue.severity];
  const handleNavigate = (issue.connectorTab && issue.connectorFieldId && onNavigateToField)
    ? () => onNavigateToField!(issue.connectorTab!, issue.connectorFieldId!)
    : undefined;
  return (
    <div className="flex flex-col h-full">
      {/* Back nav */}
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-[13px] text-[#0078d4] hover:underline mb-5 w-fit"
      >
        <NavigateBackIcon style={{ fontSize: 14 }} />
        Connector health
      </button>

      {/* Issue identity */}
      <div className="flex flex-col gap-2 mb-5 pb-5 border-b border-[#e1e1e1]">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`text-[10px] font-bold uppercase tracking-wide flex-shrink-0 ${cfg.text}`}>{cfg.label}</span>
            <SourceTag source={issue.source} connectorTab={issue.connectorTab} onNavigate={handleNavigate} />
          </div>
          <span className="text-[10px] text-[#a19f9d] flex-shrink-0 whitespace-nowrap">Detected on {detectedSyncLabel ?? '—'}</span>
        </div>
        <h2 className="text-[15px] font-semibold text-[#242424] leading-5">{issue.title}</h2>
        <p className="text-[12px] text-[#616161] leading-5">{issue.description}</p>
      </div>

      {/* Diagnostic flow */}
      <DiagnosticFlow issue={issue} />
    </div>
  );
}

// ─── Health dashboard ──────────────────────────────────────────────────────────

function formatSyncDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

function SyncHealthChart({ connector }: { connector: Connector }) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  if (connector.syncHistory.length === 0) return null;

  const history = [...connector.syncHistory]
    .sort((a, b) => new Date(a.startedAt).getTime() - new Date(b.startedAt).getTime())
    .slice(-6);

  const labelFormat = (d: Date) => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  const syncData = history.map((evt) => {
    const t = new Date(evt.startedAt).getTime();
    const blockerIssues = connector.issues.filter((i) =>
      (i.severity === 'blocker' || i.severity === 'warning') &&
      new Date(i.detectedAt).getTime() <= t &&
      (!i.resolvedAt || new Date(i.resolvedAt).getTime() > t)
    );
    const suggestionIssues = connector.issues.filter((i) =>
      i.severity === 'suggestion' &&
      new Date(i.detectedAt).getTime() <= t &&
      (!i.resolvedAt || new Date(i.resolvedAt).getTime() > t)
    );
    const dotColor = blockerIssues.length > 0 ? '#a80000' : suggestionIssues.length >= 3 ? '#a80000' : suggestionIssues.length > 0 ? '#c87e00' : '#107c10';
    return { date: evt.startedAt, blockerIssues, suggestionIssues, dotColor };
  });

  const W = 320, H = 100, ML = 26, MR = 8, MT = 10, MB = 18;
  const cW = W - ML - MR, cH = H - MT - MB;
  const yTicks = [0, 2, 4, 6];
  const maxY = 6;
  const toY = (val: number) => MT + (1 - Math.min(val, maxY) / maxY) * cH;
  const xStep = history.length > 1 ? cW / (history.length - 1) : 0;
  const pts = syncData.map((d, i) => ({
    x: ML + i * xStep,
    y: toY(d.blockerIssues.length > 0 ? d.blockerIssues.length : d.suggestionIssues.length),
  }));
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-[11px] font-semibold text-[#323130]">Health trend</span>

      <svg width="100%" height={H} viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid meet"
        style={{ overflow: 'visible', cursor: 'default' }}
        onMouseLeave={() => setHoveredIdx(null)}>

        {/* Y-axis grid lines + labels */}
        {yTicks.map((val) => {
          const y = toY(val);
          return (
            <g key={val}>
              <line x1={ML} y1={y} x2={ML + cW} y2={y} stroke="#e1e1e1" strokeWidth="1" strokeDasharray="3,2" />
              <text x={ML - 4} y={y + 3.5} textAnchor="end" fontSize="9" fill="#a19f9d" fontFamily="'Segoe UI', sans-serif">
                {val === 6 ? '6+' : val}
              </text>
            </g>
          );
        })}

        {/* Dots */}
        {syncData.map((d, i) => (
          <g key={i} style={{ cursor: 'pointer' }} onMouseEnter={() => setHoveredIdx(i)}>
            <circle cx={pts[i].x} cy={pts[i].y} r="12" fill="transparent" />
            {hoveredIdx === i ? (
              <>
                <circle cx={pts[i].x} cy={pts[i].y} r="9" fill="white" stroke={d.dotColor} strokeWidth="2.5" />
                <circle cx={pts[i].x} cy={pts[i].y} r="4" fill={d.dotColor} />
              </>
            ) : (
              <circle cx={pts[i].x} cy={pts[i].y} r="6" fill={d.dotColor} stroke="white" strokeWidth="2" />
            )}
          </g>
        ))}

        {/* Tooltip */}
        {hoveredIdx !== null && (() => {
          const d = syncData[hoveredIdx];
          const px = pts[hoveredIdx].x;
          const pad = 10, headerH = 22, rowH = 28;
          const rows = [
            { label: 'Blockers', count: d.blockerIssues.length, color: '#a80000' },
            { label: 'Suggestions', count: d.suggestionIssues.length, color: '#c87e00' },
          ];
          const tH = headerH + rows.length * rowH + pad;
          const tW = 140;
          const tX = px + 12 + tW > W ? px - tW - 12 : px + 12;
          const tY = Math.max(MT, pts[hoveredIdx].y - tH / 2);
          return (
            <g style={{ pointerEvents: 'none' }}>
              <rect x={tX} y={tY} width={tW} height={tH} rx="4" fill="white"
                stroke="#e1e1e1" strokeWidth="1"
                style={{ filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.14))' }} />
              <text x={tX + pad} y={tY + 15} fontSize="10" fill="#605e5c" fontFamily="'Segoe UI', sans-serif">
                {labelFormat(new Date(d.date))}
              </text>
              <line x1={tX} y1={tY + headerH} x2={tX + tW} y2={tY + headerH} stroke="#e1e1e1" strokeWidth="1" />
              {rows.map((row, j) => (
                <g key={j}>
                  <rect x={tX + pad} y={tY + headerH + j * rowH + 6} width="3" height="16" rx="1.5" fill={row.color} />
                  <text x={tX + pad + 9} y={tY + headerH + j * rowH + 15} fontSize="10" fill="#605e5c" fontFamily="'Segoe UI', sans-serif">{row.label}</text>
                  <text x={tX + tW - pad} y={tY + headerH + j * rowH + 15} textAnchor="end" fontSize="13" fontWeight="bold" fill="#323130" fontFamily="'Segoe UI', sans-serif">{row.count}</text>
                </g>
              ))}
            </g>
          );
        })()}

        {/* X-axis baseline + labels */}
        <line x1={ML} y1={MT + cH} x2={ML + cW} y2={MT + cH} stroke="#e1e1e1" strokeWidth="1" />
        {[0, history.length - 1].map((i) => (
          <text key={i} x={pts[i].x} y={H} textAnchor={i === 0 ? 'start' : 'end'}
            fontSize="9" fill="#a19f9d" fontFamily="'Segoe UI', sans-serif">
            {labelFormat(new Date(history[i].startedAt))}
          </text>
        ))}
      </svg>

      {/* Legend */}
      <div className="flex items-center gap-4 pt-2 flex-wrap">
        {[
          { color: '#a80000', label: 'Fix' },
          { color: '#c87e00', label: 'Good' },
          { color: '#107c10', label: 'Healthy' },
        ].map((l) => (
          <div key={l.label} className="flex items-center gap-2">
            <svg width="12" height="12" viewBox="0 0 12 12">
              <rect x="0" y="0" width="12" height="12" rx="2" fill={l.color} />
            </svg>
            <span className="text-[12px] text-[#323130]" style={{ fontFamily: "'Segoe UI', sans-serif" }}>{l.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function HealthRail({ connector, onNavigateToField }: { connector: Connector; onNavigateToField?: (tab: string, fieldId: string) => void }) {
  const [openId, setOpenId] = useState<string | null>(null);
  const [diagnosing, setDiagnosing] = useState<DiagnosticIssue | null>(null);
  const [activeFilter, setActiveFilter] = useState<'all' | 'blocker' | 'suggestion' | 'resolved'>('all');
  // Step-through state
  const [fixModeActive, setFixModeActive] = useState(false);
  const [fixStep, setFixStep] = useState(0);
  // Checklist state
  const [checkedIds, setCheckedIds] = useState<Set<string>>(new Set());
  // Dismissed suggestions
  const [dismissedIds, setDismissedIds] = useState<Set<string>>(new Set());
  // Focused issue view
  const [focusedIssue, setFocusedIssue] = useState<DiagnosticIssue | null>(null);

  if (diagnosing) {
    return <DiagnosticDrillDown issue={diagnosing} onBack={() => setDiagnosing(null)} detectedSyncLabel={getSyncCycleLabel(diagnosing.detectedAt, connector.syncHistory)} onNavigateToField={onNavigateToField} />;
  }

  if (focusedIssue) {
    const allIssues = connector.issues.filter((i) => !i.resolvedAt);
    const focusedIdx = allIssues.findIndex((i) => i.id === focusedIssue.id);
    const isBlocker = focusedIssue.severity === 'blocker' || focusedIssue.severity === 'warning';
    const navigateTo = (issue: DiagnosticIssue) => {
      setFocusedIssue(issue);
      if (issue.connectorTab && issue.connectorFieldId && onNavigateToField) {
        onNavigateToField(issue.connectorTab, issue.connectorFieldId);
      }
    };
    return (
      <IssueFocusView
        issue={focusedIssue}
        onBack={() => setFocusedIssue(null)}
        detectedSyncLabel={getSyncCycleLabel(focusedIssue.detectedAt, connector.syncHistory)}
        onNavigateToField={onNavigateToField}
        isChecked={isBlocker ? checkedIds.has(focusedIssue.id) : dismissedIds.has(focusedIssue.id)}
        onCheck={isBlocker ? () => setCheckedIds((p) => { const n = new Set(p); n.has(focusedIssue.id) ? n.delete(focusedIssue.id) : n.add(focusedIssue.id); return n; }) : undefined}
        onDismiss={!isBlocker ? () => setDismissedIds((p) => { const n = new Set(p); n.add(focusedIssue.id); return n; }) : undefined}
        currentIndex={focusedIdx}
        total={allIssues.length}
        onPrev={focusedIdx > 0 ? () => navigateTo(allIssues[focusedIdx - 1]) : undefined}
        onNext={focusedIdx < allIssues.length - 1 ? () => navigateTo(allIssues[focusedIdx + 1]) : undefined}
      />
    );
  }

  const lastSync = connector.syncHistory[0];
  const blockerTotal = connector.blockerCount + connector.warningCount;
  const activeIssues = connector.issues.filter((i) => !i.resolvedAt);
  const isResolved = (i: DiagnosticIssue) =>
    (i.severity === 'blocker' || i.severity === 'warning') ? checkedIds.has(i.id) : dismissedIds.has(i.id);
  const resolvedIssues = activeIssues.filter(isResolved);
  const unresolvedIssues = activeIssues.filter((i) => !isResolved(i));
  const filteredIssues = activeFilter === 'resolved'
    ? resolvedIssues
    : activeFilter === 'all'
      ? unresolvedIssues
      : activeFilter === 'blocker'
        ? unresolvedIssues.filter((i) => i.severity === 'blocker' || i.severity === 'warning')
        : unresolvedIssues.filter((i) => i.severity === 'suggestion');

  const blockerIssues = activeIssues.filter((i) => i.severity === 'blocker' || i.severity === 'warning');
  const uncheckedBlockers = blockerIssues.filter((i) => !checkedIds.has(i.id));
  const checkedCount = checkedIds.size;

  const healthTier = blockerTotal > 0 ? 'Action required' : 'Healthy';
  const tierConfig = {
    'Action required': { color: '#a80000', bg: '#fde7e9', barFill: 1 },
    'Healthy': { color: '#107c10', bg: '#dff6dd', barFill: 2 },
  }[healthTier];

  const syncStatusLabel =
    lastSync?.status === 'success' ? 'Sync completed' :
    lastSync?.status === 'partial' ? `Sync stopped — fix ${blockerTotal} blocker${blockerTotal !== 1 ? 's' : ''} to continue syncing` :
    'Awaiting first sync';

  // Navigate to a blocker issue
  const navigateTo = (issue: DiagnosticIssue) => {
    setOpenId(issue.id);
    if (issue.connectorTab && issue.connectorFieldId && onNavigateToField) {
      onNavigateToField(issue.connectorTab, issue.connectorFieldId);
    }
  };

  // "Fix next" — jumps to the first unchecked blocker
  const handleFixNext = () => {
    const next = uncheckedBlockers[0];
    if (!next) return;
    const idx = blockerIssues.indexOf(next);
    setFixModeActive(true);
    setFixStep(idx);
    navigateTo(next);
  };

  // Step forward to next unchecked blocker
  const handleNextStep = () => {
    const nextIdx = blockerIssues.findIndex((b, i) => i > fixStep && !checkedIds.has(b.id));
    if (nextIdx === -1) {
      setFixModeActive(false);
      setOpenId(null);
    } else {
      setFixStep(nextIdx);
      navigateTo(blockerIssues[nextIdx]);
    }
  };

  const currentFixIssue = fixModeActive ? (blockerIssues[fixStep] ?? null) : null;

  const toggleChecked = (id: string) => {
    setCheckedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const allFixed = blockerIssues.length > 0 && checkedCount === blockerIssues.length;

  return (
    <div className="flex flex-col gap-5 w-full">

      {/* Combined status + progress card */}
      <div className="rounded-[8px] border border-[#e1e1e1] bg-[#faf9f8] px-4 pt-4 pb-3 flex flex-col gap-3">
        {/* Show badge + label at top only when healthy (no blockers) */}
        {blockerIssues.length === 0 && (
          <>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full self-start" style={{ backgroundColor: tierConfig.bg }}>
              <svg width="11" height="12" viewBox="0 0 11 12" fill="none">
                <rect x="0" y="6" width="4" height="6" rx="0.5" fill={tierConfig.barFill >= 1 ? tierConfig.color : '#d0d0d0'} />
                <rect x="7" y="0" width="4" height="12" rx="0.5" fill={tierConfig.barFill >= 2 ? tierConfig.color : '#d0d0d0'} />
              </svg>
              <span className="text-[13px] font-bold" style={{ color: tierConfig.color }}>{healthTier}</span>
            </div>
            <span className="text-[13px] font-semibold text-[#242424]">{syncStatusLabel}</span>
            <SyncHealthChart connector={connector} />
            {lastSync && (
              <p className="text-[11px] text-[#a19f9d]">Connection using previous sync data now.</p>
            )}
          </>
        )}
        {/* Progress + Fix CTA — inlined into same card when there are blockers */}
        {blockerIssues.length > 0 && (
          <>
            <div className="flex flex-col gap-2">
              {/* Health badge + status label */}
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full" style={{ backgroundColor: tierConfig.bg }}>
                  <svg width="11" height="12" viewBox="0 0 11 12" fill="none">
                    <rect x="0" y="6" width="4" height="6" rx="0.5" fill={tierConfig.barFill >= 1 ? tierConfig.color : '#d0d0d0'} />
                    <rect x="7" y="0" width="4" height="12" rx="0.5" fill={tierConfig.barFill >= 2 ? tierConfig.color : '#d0d0d0'} />
                  </svg>
                  <span className="text-[13px] font-bold" style={{ color: tierConfig.color }}>{healthTier}</span>
                </div>
              </div>
              <span className="text-[13px] font-semibold text-[#242424]">{syncStatusLabel}</span>
              {lastSync && (
                <p className="text-[11px] text-[#a19f9d]">Connection using previous sync data now.</p>
              )}
              <SyncHealthChart connector={connector} />
              <div className="border-t border-[#e1e1e1] -mx-4" />
              {/* Progress */}
              <div className="flex items-center justify-between">
                <span className="text-[12px] font-semibold text-[#242424]">
                  {allFixed ? 'All blockers addressed' : `${checkedCount} of ${blockerIssues.length} blockers fixed`}
                </span>
                {checkedCount > 0 && !allFixed && (
                  <button onClick={() => { setCheckedIds(new Set()); setFixModeActive(false); }} className="text-[11px] text-[#605e5c] hover:text-[#242424] transition-colors">
                    Reset
                  </button>
                )}
              </div>
              <div className="w-full h-1.5 bg-[#edebe9] rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${(checkedCount / blockerIssues.length) * 100}%`,
                    backgroundColor: '#107c10',
                  }}
                />
              </div>
              {/* Fix next / step label */}
              {!allFixed && (
                <div className="flex items-center justify-between mt-0.5">
                  {fixModeActive ? (
                    <>
                      <span className="text-[11px] text-[#605e5c]">
                        Fixing blocker {blockerIssues.filter((_, i) => i <= fixStep).length} of {uncheckedBlockers.length} remaining
                      </span>
                      <button
                        onClick={() => { setFixModeActive(false); setOpenId(null); }}
                        className="text-[11px] text-[#605e5c] hover:text-[#242424] transition-colors"
                      >
                        Exit
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={handleFixNext}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-[4px] text-[12px] font-semibold bg-[#a80000] text-white hover:bg-[#8e0000] transition-colors"
                    >
                      <RepairIcon style={{ fontSize: 13 }} />
                      {checkedCount > 0 ? 'Fix next blocker' : `Fix ${blockerIssues.length} blocker${blockerIssues.length !== 1 ? 's' : ''}`}
                      {checkedCount > 0 && (
                        <span className="ml-0.5 px-1.5 py-0.5 bg-white text-[#a80000] rounded-full text-[10px] font-bold">{uncheckedBlockers.length}</span>
                      )}
                    </button>
                  )}
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Issues section */}
      {activeIssues.length > 0 && (
        <div className="flex flex-col gap-3">

          {/* Filter pills */}
          <div className="flex items-center gap-2 flex-wrap">
            {([
              { key: 'all', label: 'All', count: unresolvedIssues.length },
              { key: 'blocker', label: 'Blockers', count: unresolvedIssues.filter((i) => i.severity === 'blocker' || i.severity === 'warning').length },
              { key: 'suggestion', label: 'Suggestions', count: unresolvedIssues.filter((i) => i.severity === 'suggestion').length },
              { key: 'resolved', label: 'Resolved', count: resolvedIssues.length },
            ] as const).filter((p) => p.key === 'all' || p.key === 'resolved' || p.count > 0).map((pill) => (
              <button
                key={pill.key}
                onClick={() => setActiveFilter(pill.key)}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-medium border transition-colors ${
                  activeFilter === pill.key
                    ? pill.key === 'resolved' ? 'bg-[#107c10] border-[#107c10] text-white' : 'bg-[#0078d4] border-[#0078d4] text-white'
                    : 'bg-white border-[#c8c6c4] text-[#323130] hover:bg-[#f5f5f5]'
                }`}
              >
                {pill.label}
                {pill.key === 'resolved' && resolvedIssues.length > 0 && (
                  <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${activeFilter === 'resolved' ? 'bg-white text-[#107c10]' : 'bg-[#dff6dd] text-[#107c10]'}`}>
                    {resolvedIssues.length}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Issue list with checkboxes */}
          <div className="flex flex-col gap-2">
            {filteredIssues.map((issue) => {
              const isBlocker = issue.severity === 'blocker' || issue.severity === 'warning';
              const isChecked = checkedIds.has(issue.id);
              const isCurrentFix = currentFixIssue?.id === issue.id;
              return (
                <div key={issue.id} className={`transition-opacity ${isChecked ? 'opacity-40' : ''}`}>
                  <div className={`flex flex-col gap-1.5 rounded-[8px] transition-all ${isCurrentFix ? 'ring-2 ring-[#a80000] ring-offset-1' : ''}`}>
                    <IssueCard
                      issue={issue}
                      expanded={false}
                      onToggle={() => { setFocusedIssue(issue); if (issue.connectorTab && issue.connectorFieldId && onNavigateToField) onNavigateToField(issue.connectorTab, issue.connectorFieldId); }}
                      onDiagnose={() => setDiagnosing(issue)}
                      detectedSyncLabel={getSyncCycleLabel(issue.detectedAt, connector.syncHistory)}
                      onNavigateToField={onNavigateToField}
                      isChecked={isBlocker ? isChecked : dismissedIds.has(issue.id)}
                      onCheck={isBlocker ? () => toggleChecked(issue.id) : undefined}
                      onDismiss={!isBlocker ? () => setDismissedIds((p) => { const n = new Set(p); n.add(issue.id); return n; }) : undefined}
                    />
                    {isCurrentFix && !isChecked && (
                      <button
                        onClick={handleNextStep}
                        className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-[6px] text-[12px] font-semibold bg-[#fde7e9] text-[#a80000] hover:bg-[#fbd0d3] transition-colors border border-[#f3aeae]"
                      >
                        {uncheckedBlockers.filter((b) => blockerIssues.indexOf(b) > fixStep).length > 0 ? (
                          <>Next blocker <ChevronRightIcon style={{ fontSize: 12 }} /></>
                        ) : (
                          <>All blockers reviewed — done</>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {connector.issues.length === 0 && (
        <div className="flex flex-col items-center gap-2 py-8 text-center">
          <StatusCircleCheckmarkIcon style={{ fontSize: 32 }} className="text-[#107c10]" />
          <p className="text-[12px] font-semibold text-[#323130]">No issues found</p>
          <p className="text-[11px] text-[#605e5c]">This connection is healthy.</p>
        </div>
      )}
    </div>
  );
}

// ─── Users tab ────────────────────────────────────────────────────────────────

function CollapsibleSection({ title, children, defaultOpen = true }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-[#e1e1e1]">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between py-4 text-left"
      >
        <span className="text-[14px] font-semibold text-[#323130]">{title}</span>
        <ChevronDownIcon style={{ fontSize: 16 }}
          className={`text-[#605e5c] transition-transform flex-shrink-0 ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && <div className="pb-6">{children}</div>}
    </div>
  );
}

function UsersTabContent({ fieldHighlight, fieldRefs }: { fieldHighlight?: string; fieldRefs?: React.MutableRefObject<Record<string, HTMLDivElement | null>> }) {
  const [accessType, setAccessType] = useState<'acl' | 'everyone'>('acl');
  return (
    <div className="max-w-[528px] flex flex-col">
      {/* Access Permissions */}
      <div ref={(el) => { if (fieldRefs) fieldRefs.current['access-permissions'] = el; }} className={`transition-colors duration-500 rounded-[4px] ${fieldHighlight === 'access-permissions' ? 'bg-[#eff6ff] px-2' : ''}`}>
      <CollapsibleSection title="Access Permissions">
        <div className="flex flex-col gap-4">
          {/* Option 1 */}
          <label
            onClick={() => setAccessType('acl')}
            className="flex items-start gap-3 cursor-pointer"
          >
            <div className={`mt-0.5 w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${accessType === 'acl' ? 'border-[#0078d4]' : 'border-[#8a8886]'}`}>
              {accessType === 'acl' && <div className="w-2 h-2 rounded-full bg-[#0078d4]" />}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-[14px] text-[#323130]">Only people with access to this data</span>
                <span className="px-1.5 py-0.5 text-[10px] font-semibold text-[#107c10] bg-[#f0f7ec] border border-[#c8e0b8] rounded-[2px] uppercase tracking-wide">Recommended</span>
              </div>
              <p className="text-[13px] text-[#605e5c] leading-5">Only users in your Access Control List (ACL) will see results from this data source. An ACL specifies which user can access files &amp; other items.</p>
            </div>
          </label>

          {/* Option 2 */}
          <label
            onClick={() => setAccessType('everyone')}
            className="flex items-start gap-3 cursor-pointer"
          >
            <div className={`mt-0.5 w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${accessType === 'everyone' ? 'border-[#0078d4]' : 'border-[#8a8886]'}`}>
              {accessType === 'everyone' && <div className="w-2 h-2 rounded-full bg-[#0078d4]" />}
            </div>
            <div>
              <span className="text-[14px] text-[#323130]">Everyone</span>
              <p className="text-[13px] text-[#605e5c] leading-5 mt-0.5">Everyone in your organisation will see results from this data source.</p>
            </div>
          </label>
        </div>
      </CollapsibleSection>
      </div>

      {/* Map Identities */}
      <CollapsibleSection title="Map Identities">
        <div className="flex flex-col gap-3">
          <p className="text-[13px] text-[#323130] leading-5">
            We have mapped your data source identities using Microsoft Entra IDs. We use both UPN and Mail in Microsoft Entra ID to map to your user&apos;s email in the data source. If you have a different mapping formula, use the custom mapping option below.
          </p>
          <button className="self-start text-[13px] text-[#0078d4] hover:underline">
            Add custom mapping
          </button>
        </div>
      </CollapsibleSection>
    </div>
  );
}

// ─── Content tab ──────────────────────────────────────────────────────────────

const PROPERTIES = [
  { name: 'OrderDescription (Content)', semanticLabel: 'Title', description: 'Lorem ipsum is simply dummy text of the printing and t...' },
  { name: 'Order_URL', semanticLabel: 'URL', description: '-' },
  { name: 'Last_modified_by', semanticLabel: 'Last modified', description: '-' },
  { name: 'Order_initiator', semanticLabel: 'Author', description: 'Lorem ipsum is simply dummy text of the printing and t...' },
  { name: 'CreatedDateTime', semanticLabel: 'Created by', description: '-' },
  { name: 'ModifiedDateTime', semanticLabel: 'Last modified', description: '-' },
  { name: 'Order_description', semanticLabel: '-', description: '-' },
];

function ContentTabContent({ fieldHighlight, fieldRefs }: { fieldHighlight?: string; fieldRefs?: React.MutableRefObject<Record<string, HTMLDivElement | null>> }) {
  return (
    <div className="max-w-[640px] flex flex-col">
      {/* Include data */}
      <div ref={(el) => { if (fieldRefs) fieldRefs.current['include-data'] = el; }} className={`transition-colors duration-500 rounded-[4px] ${fieldHighlight === 'include-data' ? 'bg-[#eff6ff] px-2' : ''}`}>
      <CollapsibleSection title="Include data which you want to index" defaultOpen={false}>
        <p className="text-[13px] text-[#605e5c] leading-5">Configure which data from this source should be indexed by Microsoft Search and Copilot.</p>
      </CollapsibleSection>
      </div>

      {/* Manage Properties */}
      <CollapsibleSection title="Manage Properties" defaultOpen={true}>
        {/* Toolbar */}
        <div className="flex items-center justify-between mb-3">
          <button className="flex items-center gap-1 text-[13px] text-[#0078d4] hover:underline font-semibold">
            <span className="text-[16px] leading-none font-light">+</span>
            Add property
          </button>
          <span className="text-[13px] text-[#605e5c]">{PROPERTIES.length} items</span>
        </div>

        {/* Table */}
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-[#e1e1e1]">
              <th className="text-left py-2 pr-4 text-[12px] font-semibold text-[#323130] w-[200px]">Properties</th>
              <th className="text-left py-2 pr-4 text-[12px] font-semibold text-[#323130] w-[140px]">
                <span className="flex items-center gap-1">
                  Semantic Label
                  <InfoIcon style={{ fontSize: 12 }} className="text-[#605e5c]" />
                </span>
              </th>
              <th className="text-left py-2 pr-4 text-[12px] font-semibold text-[#323130]">
                <span className="flex items-center gap-1">
                  Description
                  <InfoIcon style={{ fontSize: 12 }} className="text-[#605e5c]" />
                </span>
              </th>
              <th className="text-right py-2 text-[12px]">
                <button className="flex items-center gap-1 text-[12px] text-[#0078d4] hover:underline ml-auto">
                  <AddIcon style={{ fontSize: 12 }} />
                  Show all columns
                </button>
              </th>
            </tr>
          </thead>
          <tbody>
            {PROPERTIES.map((prop) => (
              <tr key={prop.name} className="border-b border-[#f3f2f1] hover:bg-[#faf9f8] transition-colors">
                <td className="py-2.5 pr-4 text-[13px] text-[#323130]">{prop.name}</td>
                <td className="py-2.5 pr-4 text-[13px] text-[#323130]">{prop.semanticLabel}</td>
                <td className="py-2.5 pr-4 text-[13px] text-[#605e5c] truncate max-w-[200px]">{prop.description}</td>
                <td className="py-2.5 text-right"></td>
              </tr>
            ))}
          </tbody>
        </table>
      </CollapsibleSection>
    </div>
  );
}

// ─── Sync tab ─────────────────────────────────────────────────────────────────

const TIMEZONES = [
  '(UTC-12:00) International Date Line West',
  '(UTC-11:00) Coordinated Universal Time-11',
  '(UTC-10:00) Hawaii',
  '(UTC-09:00) Alaska',
  '(UTC-08:00) Pacific Time (US & Canada)',
  '(UTC-07:00) Mountain Time (US & Canada)',
  '(UTC-06:00) Central Time (US & Canada)',
  '(UTC-05:00) Eastern Time (US & Canada)',
  '(UTC+00:00) Coordinated Universal Time',
  '(UTC+01:00) Amsterdam, Berlin, Bern, Rome',
  '(UTC+05:30) Chennai, Kolkata, Mumbai, New Delhi',
  '(UTC+08:00) Beijing, Chongqing, Hong Kong',
  '(UTC+09:00) Osaka, Sapporo, Tokyo',
];

function SelectChevron() {
  return <ChevronDownIcon style={{ fontSize: 12 }} className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-[#605e5c]" />;
}

function SyncTabContent({ fieldHighlight, fieldRefs }: { fieldHighlight?: string; fieldRefs?: React.MutableRefObject<Record<string, HTMLDivElement | null>> }) {
  const [timezone, setTimezone] = useState('(UTC-08:00) Pacific Time (US & Canada)');
  const [incrementalOn, setIncrementalOn] = useState(true);
  const [incRecurrence, setIncRecurrence] = useState('Day');
  const [incRunOnce, setIncRunOnce] = useState(false);
  const [incFreq, setIncFreq] = useState('15 minutes');
  const [fullRecurrence, setFullRecurrence] = useState('Week');

  return (
    <div className="max-w-[528px] flex flex-col gap-6">
      {/* Time zone */}
      <div>
        <label className="text-[14px] text-[#323130] block mb-1.5">Time zone</label>
        <div className="relative">
          <select
            value={timezone}
            onChange={(e) => setTimezone(e.target.value)}
            className="w-full appearance-none border border-[#8a8886] rounded-[2px] bg-white px-2 py-[5px] text-[14px] text-[#323130] outline-none focus:border-[#0078d4] pr-7"
          >
            {TIMEZONES.map((tz) => <option key={tz}>{tz}</option>)}
          </select>
          <SelectChevron />
        </div>
      </div>

      {/* Incremental crawl */}
      <div ref={(el) => { if (fieldRefs) fieldRefs.current["crawl-frequency"] = el; }} className={`transition-colors duration-500 rounded-[4px] ${fieldHighlight === 'crawl-frequency' ? 'bg-[#eff6ff] px-2' : ''}`}>
      <CollapsibleSection title="Incremental crawl" defaultOpen={true}>
        <div className="flex flex-col gap-4">
          {/* Toggle */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIncrementalOn((v) => !v)}
              className={`w-10 h-6 rounded-full transition-colors flex items-center px-0.5 flex-shrink-0 ${incrementalOn ? 'bg-[#0078d4]' : 'bg-[#8a8886]'}`}
            >
              <span className={`w-5 h-5 rounded-full bg-white shadow transition-transform ${incrementalOn ? 'translate-x-4' : 'translate-x-0'}`} />
            </button>
            <span className="text-[14px] text-[#323130]">{incrementalOn ? 'On' : 'Off'}</span>
          </div>

          {incrementalOn && (
            <>
              {/* Recurrence */}
              <div>
                <label className="text-[12px] text-[#605e5c] block mb-1.5">Recurrence</label>
                <div className="flex items-stretch gap-0">
                  <div className="flex items-center px-3 py-[5px] text-[14px] text-[#323130] border border-r-0 border-[#8a8886] rounded-l-[2px] bg-[#f3f2f1] flex-shrink-0">
                    Every
                  </div>
                  <div className="relative flex-1">
                    <select
                      value={incRecurrence}
                      onChange={(e) => setIncRecurrence(e.target.value)}
                      className="w-full appearance-none border border-[#8a8886] rounded-r-[2px] bg-white px-2 py-[5px] text-[14px] text-[#323130] outline-none focus:border-[#0078d4] pr-7"
                    >
                      {['Hour', 'Day', 'Week', 'Month'].map((v) => <option key={v}>{v}</option>)}
                    </select>
                    <SelectChevron />
                  </div>
                </div>
              </div>

              {/* Run once */}
              <label className="flex items-center gap-2 cursor-pointer">
                <div
                  onClick={() => setIncRunOnce((v) => !v)}
                  className={`w-4 h-4 rounded-[2px] border flex-shrink-0 flex items-center justify-center cursor-pointer ${incRunOnce ? 'bg-[#0078d4] border-[#0078d4]' : 'border-[#323130] bg-white'}`}
                >
                  {incRunOnce && (
                    <CheckMarkIcon style={{ fontSize: 10 }} className="text-white" />
                  )}
                </div>
                <span className="text-[14px] text-[#323130]">Run once in a day</span>
              </label>

              {/* Frequency */}
              <div>
                <label className="text-[12px] text-[#605e5c] block mb-1.5">Frequency</label>
                <div className="flex items-stretch gap-0">
                  <div className="flex items-center px-3 py-[5px] text-[14px] text-[#323130] border border-r-0 border-[#8a8886] rounded-l-[2px] bg-[#f3f2f1] flex-shrink-0">
                    Every
                  </div>
                  <div className="relative flex-1">
                    <select
                      value={incFreq}
                      onChange={(e) => setIncFreq(e.target.value)}
                      className="w-full appearance-none border border-[#8a8886] rounded-r-[2px] bg-white px-2 py-[5px] text-[14px] text-[#323130] outline-none focus:border-[#0078d4] pr-7"
                    >
                      {['5 minutes', '15 minutes', '30 minutes', '1 hour', '2 hours'].map((v) => <option key={v}>{v}</option>)}
                    </select>
                    <SelectChevron />
                  </div>
                </div>
              </div>

              <button className="text-[14px] text-[#0078d4] hover:underline text-left w-fit">
                Add starting time
              </button>
            </>
          )}
        </div>
      </CollapsibleSection>
      </div>

      {/* Full crawl */}
      <CollapsibleSection title="Full crawl" defaultOpen={true}>
        <div className="flex flex-col gap-4">
          {/* Recurrence */}
          <div>
            <label className="text-[12px] text-[#605e5c] block mb-1.5">Recurrence</label>
            <div className="flex items-stretch gap-0">
              <div className="flex items-center px-3 py-[5px] text-[14px] text-[#323130] border border-r-0 border-[#8a8886] rounded-l-[2px] bg-[#f3f2f1] flex-shrink-0">
                Every
              </div>
              <div className="relative flex-1">
                <select
                  value={fullRecurrence}
                  onChange={(e) => setFullRecurrence(e.target.value)}
                  className="w-full appearance-none border border-[#8a8886] rounded-r-[2px] bg-white px-2 py-[5px] text-[14px] text-[#323130] outline-none focus:border-[#0078d4] pr-7"
                >
                  {['Day', 'Week', 'Month'].map((v) => <option key={v}>{v}</option>)}
                </select>
                <SelectChevron />
              </div>
            </div>
          </div>

          <button className="text-[14px] text-[#0078d4] hover:underline text-left w-fit">
            Add day(s)
          </button>
          <button className="text-[14px] text-[#0078d4] hover:underline text-left w-fit">
            Add starting time
          </button>
        </div>
      </CollapsibleSection>
    </div>
  );
}

// ─── Main drawer ──────────────────────────────────────────────────────────────

interface SetupDrawerProps {
  connectorType?: string;
  existingConnector?: Connector;
  onClose: () => void;
}

const AUTH_OPTIONS = [
  { value: 'basic', label: 'Basic Auth' },
  { value: 'oauth2', label: 'OAuth 2.0' },
];

const SETUP_TABS = ['Setup', 'Users', 'Content', 'Sync'] as const;
type SetupTab = typeof SETUP_TABS[number];

export default function SetupDrawer({ connectorType, existingConnector, onClose }: SetupDrawerProps) {
  const isEdit = !!existingConnector;
  const [typeName, setTypeName] = useState(existingConnector?.connectorType ?? connectorType ?? 'ServiceNow Knowledge');

  // Resolve logo from gallery catalog when no existingConnector logo available
  const catalogItem = CONNECTOR_CATALOG.find(
    (c) => c.name.toLowerCase() === (existingConnector?.connectorType ?? connectorType ?? '').toLowerCase()
  );
  const resolvedLogoUrl = existingConnector?.logoUrl ?? catalogItem?.logoUrl;
  const [activeTab, setActiveTab] = useState<SetupTab>('Setup');
  const [rightRailTab, setRightRailTab] = useState<'health' | 'guide'>(isEdit ? 'health' : 'guide');

  const [editingHeader, setEditingHeader] = useState(false);
  const [editName, setEditName] = useState(existingConnector?.connectorType ?? '');
  const [editIconPreview, setEditIconPreview] = useState<string | null>(null);
  const [guidanceHighlight, setGuidanceHighlight] = useState<string | undefined>(undefined);
  const [fieldHighlight, setFieldHighlight] = useState<string | undefined>(undefined);

  const handleNavigateToField = React.useCallback((tab: string, fieldId: string) => {
    setActiveTab(tab as SetupTab);
    setFieldHighlight(fieldId);
    setRightRailTab('health');
    setTimeout(() => {
      const el = fieldRefs.current[fieldId];
      if (el && formScrollRef.current) {
        const top = el.getBoundingClientRect().top - formScrollRef.current.getBoundingClientRect().top + formScrollRef.current.scrollTop - 24;
        formScrollRef.current.scrollTo({ top, behavior: 'smooth' });
      }
        suppressGuidanceSwitch.current = true;
      setTimeout(() => { suppressGuidanceSwitch.current = false; }, 100);
      // Clear highlight after 2s
      setTimeout(() => setFieldHighlight(undefined), 2000);
    }, 80);
  }, []);
  const fieldRefs = React.useRef<Record<string, HTMLDivElement | null>>({});
  const formScrollRef = React.useRef<HTMLDivElement>(null);
  const railScrollRef = React.useRef<HTMLDivElement>(null);
  const accordionRefsCache = React.useRef<Record<string, HTMLDivElement | null>>({});
  const suppressGuidanceSwitch = React.useRef(false);

  // Sync right rail scroll so open accordion aligns with the focused field
  React.useEffect(() => {
    if (!guidanceHighlight) return;
    const fieldEl = fieldRefs.current[guidanceHighlight];
    const railEl = railScrollRef.current;
    const accordionEl = accordionRefsCache.current[guidanceHighlight];
    if (!fieldEl || !railEl || !accordionEl) return;

    const formScroll = formScrollRef.current;
    const fieldTop = fieldEl.getBoundingClientRect().top - (formScroll?.getBoundingClientRect().top ?? 0) + (formScroll?.scrollTop ?? 0);
    const accordionOffsetInRail = accordionEl.offsetTop;
    railEl.scrollTop = accordionOffsetInRail - fieldTop;
  }, [guidanceHighlight]);

  const [sourceName, setSourceName] = useState(existingConnector?.displayName ?? '');
  const [displayName, setDisplayName] = useState(existingConnector?.displayName ?? '');
  const [userCriteria, setUserCriteria] = useState<UserCriteriaType>(existingConnector?.userCriteriaType ?? 'simple');
  const [instanceUrl, setInstanceUrl] = useState(existingConnector?.instanceUrl ?? '');
  const [authMethod, setAuthMethod] = useState<AuthMethod>(existingConnector?.authMethod ?? 'none');
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [validating, setValidating] = useState(false);
  const [validateProgress, setValidateProgress] = useState(0);
  const [validateDone, setValidateDone] = useState(false);

  function markChanged() { setHasChanges(true); setValidateDone(false); }

  function handleValidate() {
    if (!hasChanges || validating) return;
    setValidating(true);
    setValidateProgress(0);
    setValidateDone(false);
    let pct = 0;
    const interval = setInterval(() => {
      pct += Math.random() * 18 + 6;
      if (pct >= 100) {
        clearInterval(interval);
        setValidateProgress(100);
        setValidateDone(true);
        setValidating(false);
        setHasChanges(false);
      } else {
        setValidateProgress(Math.round(pct));
      }
    }, 300);
  }

  const canCreate = sourceName.trim().length > 0 && displayName.trim().length > 0 &&
    instanceUrl.trim().length > 0 && authMethod !== 'none' && privacyAccepted;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed top-[48px] left-[48px] right-0 bottom-0 bg-black/50 z-40"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="fixed top-[48px] right-0 bottom-0 z-50 flex flex-col overflow-hidden" style={{ width: '80%' }}>
        {/* Content row: form + right rail */}
        <div className="flex flex-1 overflow-hidden">
        {/* Form side */}
        <div className="flex-1 bg-white flex flex-col min-w-0 shadow-2xl">

          {/* Header */}
          <div className="px-8 pt-12">
            {editingHeader ? (
              /* ── Edit mode ── */
              <div className="flex items-start gap-16 pb-6 border-b border-[#e1e1e1] mb-6">

                {/* Left: form */}
                <div className="flex flex-col gap-3 flex-shrink-0 w-[380px]">
                  {/* Icon + hint + buttons */}
                  <label className="block text-[12px] font-semibold text-[#323130] mb-1">Source icon</label>
                  <div className="flex items-center gap-4">
                    <ConnectorIcon src={editIconPreview ?? resolvedLogoUrl} name={editName || typeName} size={64} />
                    <div className="flex flex-col gap-2">
                      <p className="text-[12px] text-[#605e5c]">Min 256×256 px • SVG format preferred</p>
                      <div className="flex items-center gap-2">
                        <label className="flex items-center gap-1.5 h-[32px] px-2 text-[14px] text-[#323130] rounded-[2px] hover:bg-[#f3f2f1] cursor-pointer transition-colors">
                          <UploadIcon style={{ fontSize: 14 }} />
                          Upload
                          <input type="file" accept="image/png,image/svg+xml,image/jpeg" className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) { const reader = new FileReader(); reader.onload = (ev) => setEditIconPreview(ev.target?.result as string); reader.readAsDataURL(file); }
                            }} />
                        </label>
                        <button onClick={() => setEditIconPreview(null)}
                          className="flex items-center gap-1.5 h-[32px] px-2 text-[14px] text-[#323130] rounded-[2px] hover:bg-[#f3f2f1] transition-colors">
                          <RefreshIcon style={{ fontSize: 14 }} />
                          Reset
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Source name */}
                  <div>
                    <label className="block text-[12px] font-semibold text-[#323130] mb-1">
                      Source name <span className="text-[#a80000]">*</span>
                    </label>
                    <div className="flex items-center border border-[#8a8886] rounded-[2px] bg-white focus-within:border-[#0078d4]">
                      <input
                        type="text"
                        value={editName}
                        autoFocus
                        onChange={(e) => setEditName(e.target.value)}
                        className="flex-1 px-2 py-[5px] text-[14px] text-[#323130] outline-none bg-transparent"
                      />
                      <ChevronDownIcon style={{ fontSize: 12 }} className="mr-2 text-[#605e5c] flex-shrink-0" />
                    </div>
                  </div>

                  {/* Save / Cancel */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => { setTypeName(editName); setEditingHeader(false); setGuidanceHighlight(undefined); markChanged(); }}
                      className="h-[32px] px-4 text-[14px] font-semibold bg-[#0078d4] text-white rounded-[2px] hover:bg-[#106ebe] transition-colors"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => { setEditName(existingConnector?.connectorType || typeName); setEditIconPreview(null); setEditingHeader(false); setGuidanceHighlight(undefined); }}
                      className="h-[32px] px-4 text-[14px] font-semibold text-[#323130] border border-[#8a8886] rounded-[2px] bg-white hover:bg-[#f3f2f1] transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>

                {/* Live preview */}
                <div className="flex-shrink-0 w-[220px]">
                  <p className="text-[13px] font-semibold text-[#323130] mb-3">Live preview</p>
                  <div className="border border-[#e1e1e1] rounded-[4px] bg-[#faf9f8] p-4 flex flex-col gap-3">
                    <div className="self-start flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#c8c6c4] rounded-full shadow-[0px_1px_2px_rgba(0,0,0,0.1)]">
                      <span className="text-[13px] text-[#323130]">All Sources</span>
                      <ChevronDownIcon style={{ fontSize: 10 }} className="text-[#605e5c]" />
                    </div>
                    <div className="flex items-center gap-2.5 px-1">
                      <ConnectorIcon src={editIconPreview ?? resolvedLogoUrl} name={editName || typeName} size={28} rounded="4px" />
                      <span className="text-[14px] text-[#323130] truncate">{editName || typeName}</span>
                    </div>
                  </div>
                </div>

              </div>
            ) : (
              /* ── View mode: normal header ── */
              <div className="flex items-start gap-4 pb-4">
                <ConnectorIcon src={editIconPreview ?? resolvedLogoUrl} name={typeName} size={64} />
                <div className="flex flex-col gap-0.5">
                  <h1 className="text-[20px] font-bold text-[#323130] leading-7">{typeName}</h1>
                  <button
                      onClick={() => {
                        setEditName(existingConnector?.connectorType || typeName);
                        setEditIconPreview(null);
                        setEditingHeader(true);
                        if (!suppressGuidanceSwitch.current) setRightRailTab('guide');
                        setGuidanceHighlight('icon-name');
                      }}
                      className="flex items-center gap-1 text-[13px] mt-0.5 w-fit hover:opacity-80"
                    >
                      <span className="text-[#323130]">Source name &amp; icon</span>
                      <EditIcon style={{ fontSize: 12 }} className="text-[#0078d4]" />
                    </button>
                </div>
              </div>
            )}

            {/* Tabs */}
            <div className="flex items-center justify-between mt-6">
              <div className="flex">
                {SETUP_TABS.map((tab) => (
                  <button key={tab}
                    onClick={() => { setActiveTab(tab); setGuidanceHighlight(undefined); setFieldHighlight(undefined); }}
                    className={`pb-2 mr-6 text-[14px] border-b-2 -mb-px transition-colors ${
                      activeTab === tab
                        ? 'font-semibold text-[#0078d4] border-[#0078d4]'
                        : 'text-[#323130] border-transparent hover:text-[#0078d4]'
                    }`}>
                    {tab}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Form body */}
          <div ref={formScrollRef} className="flex-1 overflow-y-auto px-8 pt-12 pb-6">
            {activeTab === 'Users' && <UsersTabContent fieldHighlight={fieldHighlight} fieldRefs={fieldRefs} />}
            {activeTab === 'Content' && <ContentTabContent fieldHighlight={fieldHighlight} fieldRefs={fieldRefs} />}
            {activeTab === 'Sync' && <SyncTabContent fieldHighlight={fieldHighlight} fieldRefs={fieldRefs} />}
            {activeTab !== 'Users' && activeTab !== 'Content' && activeTab !== 'Sync' && <div className="max-w-[528px] flex flex-col gap-6">

              {/* Connection name */}
              <div ref={(el) => { fieldRefs.current['display-name'] = el; }}>
                <p className="text-[14px] font-semibold text-[#323130] mb-1">Enter a unique name to manage this connection</p>
                <label className="flex items-center gap-1 text-[12px] text-[#323130] py-[5px]">
                  Connection name <span className="text-[#a80000]">*</span>
                  <InfoIcon style={{ fontSize: 12 }} className="text-[#605e5c]" />
                </label>
                <div className="relative flex items-center border border-[#8a8886] rounded-[2px] bg-white focus-within:border-[#0078d4]">
                  <input type="text" value={displayName} onChange={(e) => { setDisplayName(e.target.value); setSourceName(e.target.value); markChanged(); }}
                    onFocus={() => { setGuidanceHighlight('display-name'); if (!suppressGuidanceSwitch.current) setRightRailTab('guide'); }}
                    className="flex-1 px-2 py-[5px] text-[14px] text-[#323130] outline-none bg-transparent placeholder:text-[#9f9f9f]" />
                  {displayName && <span className="pr-2 text-[#107c10] text-[12px]">✓</span>}
                </div>
              </div>

              {/* User criteria */}
              <div ref={(el) => { fieldRefs.current['user-criteria'] = el; }}>
                <p className="text-[14px] font-semibold text-[#323130] mb-1">User criteria setup in ServiceNow</p>
                <div className="flex items-center gap-6">
                  {(['simple', 'advanced'] as UserCriteriaType[]).map((v) => (
                    <label key={v} className="flex items-center gap-2 cursor-pointer">
                      <div
                        onClick={() => { setUserCriteria(v); markChanged(); setGuidanceHighlight('user-criteria'); if (!suppressGuidanceSwitch.current) setRightRailTab('guide'); }}
                        className={`w-4 h-4 rounded-full border-2 flex items-center justify-center cursor-pointer ${userCriteria === v ? 'border-[#0078d4]' : 'border-[#8a8886]'}`}
                      >
                        {userCriteria === v && <div className="w-2 h-2 rounded-full bg-[#0078d4]" />}
                      </div>
                      <span className="text-[14px] text-[#323130] capitalize">{v}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Instance URL */}
              <div ref={(el) => { fieldRefs.current['instance-url'] = el; }}>
                <p className="text-[14px] font-semibold text-[#323130] mb-1">Provide basic information about your ServiceNow instance</p>
                <label className="flex items-center gap-1 text-[12px] text-[#323130] py-[5px]">
                  ServiceNow instance URL <span className="text-[#a80000]">*</span>
                </label>
                <div className="flex items-stretch border border-[#605e5c] rounded-[2px] bg-white focus-within:border-[#0078d4]">
                  <div className="bg-[#f3f2f1] px-[10px] flex items-center border-r border-[#605e5c]">
                    <span className="text-[14px] text-[#605e5c]">https://</span>
                  </div>
                  <input type="text" value={instanceUrl.replace(/^https?:\/\//, '')}
                    onChange={(e) => { setInstanceUrl(e.target.value ? `https://${e.target.value}` : ''); markChanged(); }}
                    onFocus={() => { setGuidanceHighlight('instance-url'); if (!suppressGuidanceSwitch.current) setRightRailTab('guide'); }}
                    placeholder="example.servicenow.com"
                    className="flex-1 px-2 py-[5px] text-[14px] text-[#323130] outline-none placeholder:text-[#9f9f9f]" />
                </div>
              </div>

              {/* Authentication */}
              <div ref={(el) => { fieldRefs.current['auth-types'] = el; }} className={`transition-colors duration-500 rounded-[4px] ${fieldHighlight === 'auth-types' ? 'bg-[#eff6ff] px-2' : ''}`}>
                <p className="text-[14px] font-semibold text-[#323130] mb-1">Authenticate your ServiceNow instance</p>
                <label className="flex items-center gap-1 text-[12px] text-[#323130] py-[5px]">
                  Authentication type <span className="text-[#a80000]">*</span>
                </label>
                <div className="relative">
                  <select value={authMethod === 'none' ? '' : authMethod} onChange={(e) => { setAuthMethod((e.target.value || 'none') as AuthMethod); markChanged(); }}
                    onFocus={() => { setGuidanceHighlight('auth-types'); if (!suppressGuidanceSwitch.current) setRightRailTab('guide'); }}
                    className="w-full appearance-none border border-[#605e5c] rounded-[2px] bg-white px-2 py-[5px] text-[14px] text-[#605e5c] outline-none focus:border-[#0078d4] cursor-pointer">
                    <option value="">Select</option>
                    {AUTH_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                  <ChevronDownIcon style={{ fontSize: 12 }} className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-[#605e5c]" />
                </div>
              </div>

              {/* Staged rollout */}
              <div ref={(el) => { fieldRefs.current['staged-rollout'] = el; }}>
                <p className="text-[14px] font-semibold text-[#323130] mb-1">Staged rollout</p>
                <label className="flex items-center gap-1 text-[12px] text-[#323130] py-[5px]">
                  Select users and user groups <span className="text-[#a80000]">*</span>
                  <InfoIcon style={{ fontSize: 12 }} className="text-[#605e5c]" />
                </label>
                <div className="flex items-center border border-[#8a8886] rounded-[2px] bg-white focus-within:border-[#0078d4]">
                  <SearchIcon style={{ fontSize: 16 }} className="ml-2 text-[#0078d4]" />
                  <input type="text" placeholder="Search" onFocus={() => { setGuidanceHighlight('staged-rollout'); if (!suppressGuidanceSwitch.current) setRightRailTab('guide'); }} className="flex-1 px-2 py-[5px] text-[14px] text-[#605e5c] outline-none placeholder:text-[#605e5c]" />
                </div>
              </div>

              {/* Privacy notice */}
              <div>
                <div className="flex items-start gap-2">
                  <div onClick={() => setPrivacyAccepted(!privacyAccepted)}
                    className={`mt-0.5 w-5 h-5 rounded-[2px] border flex-shrink-0 cursor-pointer flex items-center justify-center ${privacyAccepted ? 'bg-[#0078d4] border-[#0078d4]' : 'border-[#323130] bg-white'}`}>
                    {privacyAccepted && (
                      <CheckMarkIcon style={{ fontSize: 10 }} className="text-white" />
                    )}
                  </div>
                  <div>
                    <span className="text-[14px] font-semibold text-[#323130]">Privacy notice</span>
                    {' '}<span className="text-[#a80000]">*</span>
                    <p className="text-[12px] text-[#484644] leading-4 mt-0.5">
                      By using this Copilot connector, you agree to the{' '}
                      <a href="https://learn.microsoft.com/en-us/microsoftsearch/terms-of-use" target="_blank" rel="noreferrer" className="text-[#0078d4]">
                        Copilot connectors: Terms of use
                      </a>. You as data controller authorize Microsoft to create an index of third-party data in your Microsoft 365 tenant.
                    </p>
                  </div>
                </div>
              </div>

            </div>}
          </div>

        </div>

        {/* Right rail */}
        <div className="w-[360px] flex-shrink-0 bg-[#faf9f8] border-l border-[#e1e1e1] flex flex-col overflow-hidden">
          {/* Tabs — only show Connector health tab in edit mode */}
          {isEdit && existingConnector ? (
            <div className="flex px-6 flex-shrink-0 pt-12 border-b border-[#e1e1e1]">
              {(['health', 'guide'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setRightRailTab(tab)}
                  className={`pb-2 mr-6 text-[14px] border-b-2 -mb-px transition-colors ${
                    rightRailTab === tab
                      ? 'font-semibold text-[#0078d4] border-[#0078d4]'
                      : 'text-[#323130] border-transparent hover:text-[#0078d4]'
                  }`}
                >
                  {tab === 'health' ? 'Connector health' : 'Setup guidance'}
                </button>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-between px-6 pt-12 pb-4 flex-shrink-0">
              <span className="text-[14px] font-semibold text-[#323130]">Setup guidance</span>
              <a href="https://learn.microsoft.com/en-us/microsoftsearch/connectors-overview" target="_blank" rel="noreferrer"
                className="text-[13px] text-[#0078d4] whitespace-nowrap hover:underline">
                Read detailed documentation
              </a>
            </div>
          )}
          <div ref={railScrollRef} className="flex-1 overflow-y-auto px-6 pt-6 pb-6">
            {isEdit && existingConnector && rightRailTab === 'health'
              ? <HealthRail connector={existingConnector} onNavigateToField={handleNavigateToField} />
              : <GuidanceRail
                  highlightSection={guidanceHighlight}
                  accordionRefsCallback={(refs) => { accordionRefsCache.current = refs; }}
                  sections={TAB_GUIDANCE[activeTab] ?? GUIDANCE_SECTIONS}
                />
            }
          </div>
        </div>
        </div>{/* end content row */}

        {/* Footer — full width, above right rail */}
        <div className="border-t border-[#e1e1e1] px-8 py-4 flex items-center justify-between flex-shrink-0 bg-white z-10">
          <div className="flex items-center gap-3">
            <button disabled={!canCreate}
              className={`px-[19px] py-[6px] text-[14px] font-semibold rounded-[2px] transition-colors ${canCreate ? 'bg-[#0078d4] text-white hover:bg-[#106ebe]' : 'bg-[#0078d4] text-white opacity-40 cursor-not-allowed'}`}>
              {isEdit ? 'Save' : 'Create'}
            </button>
            {isEdit && (
              validating ? (
                <div className="flex items-center gap-2 min-w-[160px]">
                  <div className="flex-1 h-1.5 bg-[#e1e1e1] rounded-full overflow-hidden">
                    <div className="h-full bg-[#0078d4] rounded-full transition-all duration-300" style={{ width: `${validateProgress}%` }} />
                  </div>
                  <span className="text-[11px] text-[#605e5c] flex-shrink-0">{validateProgress}%</span>
                </div>
              ) : validateDone ? (
                <span className="flex items-center gap-1.5 text-[12px] text-[#107c10]">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <circle cx="7" cy="7" r="7" fill="#107c10" />
                    <path d="M4 7l2 2 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Validated
                </span>
              ) : (
                <button
                  onClick={handleValidate}
                  disabled={!hasChanges}
                  className={`px-[19px] py-[6px] text-[14px] font-semibold rounded-[2px] border transition-colors ${hasChanges ? 'border-[#0078d4] text-[#0078d4] hover:bg-[#f0f6fc]' : 'border-[#c8c6c4] text-[#a19f9d] cursor-not-allowed'}`}
                >
                  Validate
                </button>
              )
            )}
          </div>
          <div className="flex items-center gap-4">
            <button disabled className="px-[19px] py-[6px] text-[14px] font-semibold text-[#a1a1a1] bg-[#ededed] rounded-[2px] cursor-not-allowed">
              Save and close
            </button>
            <button onClick={onClose} className="px-[19px] py-[6px] text-[14px] font-semibold text-[#323130] bg-[#e8e8e8] rounded-[2px] hover:bg-[#d2d0ce] transition-colors">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
