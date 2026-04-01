'use client';

import React, { useState } from 'react';
import { PrimaryButton, ActionButton, DefaultButton, Dialog, DialogType, DialogFooter, TextField, Dropdown, ChoiceGroup, Toggle, Checkbox as FluentV8Checkbox, NormalPeoplePicker } from '@fluentui/react';
import type { IDropdownOption, IChoiceGroupOption, IPersonaProps } from '@fluentui/react';
import type { Connector, AuthMethod, UserCriteriaType, DiagnosticIssue, IssueSource, SyncEvent, RecommendedAction } from '@/lib/types';
import { CONNECTOR_CATALOG } from '@/lib/gallery-data';
import {
  ChromeCloseIcon, EditIcon,
  ChevronDownIcon, ChevronUpIcon, ChevronLeftIcon, ChevronRightIcon, CheckMarkIcon, InfoIcon, BackIcon,
  OpenInNewWindowIcon, NavigateBackIcon, DiagnosticIcon,
  StatusCircleCheckmarkIcon, ErrorBadgeIcon, StatusCircleSyncIcon,
  WarningSolidIcon, AlertSolidIcon,
  AddIcon, UploadIcon, RefreshIcon,
} from '@fluentui/react-icons-mdl2';
import {
  Card,
  CardHeader,
  CardFooter,
  Badge,
  Button,
  ToggleButton,
  Text,
  ProgressBar,
  Checkbox,
  MessageBar,
  MessageBarBody,
  tokens,
  Table,

  TableBody,
  TableRow,
  TableCell,
  TableCellLayout,
  useTableFeatures,
  createTableColumn,
  useTableSelection,
} from '@fluentui/react-components';

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
          <li>Firewall rules allow outbound traffic from Microsoft's sync IPs.</li>
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
    id: 'full-sync', title: 'Full sync', defaultOpen: false,
    content: (
      <div className="text-[12px] text-[#323130] leading-[18px] flex flex-col gap-2">
        <p>A full sync re-indexes every item in the data source from scratch. It ensures the index is fully consistent but uses more resources.</p>
        <p>Schedule full syncs weekly or monthly depending on how frequently your data changes. The first sync is always a full sync.</p>
      </div>
    ),
  },
  {
    id: 'incremental-sync', title: 'Incremental sync', defaultOpen: false,
    content: (
      <div className="text-[12px] text-[#323130] leading-[18px] flex flex-col gap-2">
        <p>Incremental syncs only index items that have been created, modified, or deleted since the last sync. They are faster and lighter on both your ServiceNow instance and Microsoft's indexing service.</p>
        <p>Set the frequency based on how time-sensitive your data is — every 15 minutes for high-velocity data, daily for more static content.</p>
      </div>
    ),
  },
  {
    id: 'timezone', title: 'Timezone', defaultOpen: false,
    content: (
      <div className="text-[12px] text-[#323130] leading-[18px] flex flex-col gap-2">
        <p>Set the timezone to match your ServiceNow instance to ensure accurate change-detection timestamps during incremental syncs.</p>
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
        <span />
        <a href="https://learn.microsoft.com/en-us/microsoft-365/copilot/connectors/servicenow-knowledge-deployment" target="_blank" rel="noreferrer"
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
    bg: 'bg-[#f3f2f1]',
    text: 'text-[#605e5c]',
    icon: <img src="/servicenow-logo.svg" alt="ServiceNow" style={{ width: 12, height: 12, objectFit: 'contain', display: 'block' }} />,
  },
  connector: {
    label: 'Connector settings',
    bg: 'bg-[#f3f2f1]',
    text: 'text-[#605e5c]',
    icon: (
      <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
        <circle cx="2.5" cy="5" r="1.5" stroke="#605e5c" strokeWidth="1" />
        <circle cx="7.5" cy="2.5" r="1.5" stroke="#605e5c" strokeWidth="1" />
        <circle cx="7.5" cy="7.5" r="1.5" stroke="#605e5c" strokeWidth="1" />
        <path d="M4 5h2M6 5V2.5M6 5v2.5" stroke="#605e5c" strokeWidth="1" strokeLinecap="round" />
      </svg>
    ),
  },
  mismatch: {
    label: 'Setup tab',
    bg: 'bg-[#f3f2f1]',
    text: 'text-[#605e5c]',
    icon: (
      <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
        <path d="M5 1L9 9H1L5 1Z" stroke="#605e5c" strokeWidth="1" strokeLinejoin="round" />
        <path d="M5 4v2M5 7.5v.5" stroke="#605e5c" strokeWidth="1" strokeLinecap="round" />
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

  if (source === 'mismatch') {
    return (
      <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        <Badge appearance="filled" color="subtle" size="small" shape="circular"
          onClick={onNavigate ? (e: React.MouseEvent) => { e.stopPropagation(); onNavigate(); } : undefined}
          style={{ cursor: onNavigate ? 'pointer' : 'default', fontSize: 10, fontWeight: 600 }}>
          Setup tab
        </Badge>
        <Badge appearance="filled" color="subtle" size="small" shape="circular"
          icon={<span style={{ display: 'flex', alignItems: 'center' }}>{SOURCE_CONFIG.servicenow.icon}</span>}
          style={{ fontSize: 10, fontWeight: 600 }}>
          ServiceNow
        </Badge>
      </span>
    );
  }

  return (
    <Badge
      appearance="filled"
      color="subtle"
      size="small"
      shape="circular"
      icon={source === 'connector' ? undefined : <span style={{ display: 'flex', alignItems: 'center' }}>{cfg.icon}</span>}
      onClick={onNavigate ? (e: React.MouseEvent) => { e.stopPropagation(); onNavigate(); } : undefined}
      style={{ cursor: onNavigate ? 'pointer' : 'default', fontSize: 10, fontWeight: 600 }}
    >
      {label}
    </Badge>
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

function IssueCard({ issue, onToggle, detectedSyncLabel, isChecked, onCheck, onDismiss, onFix }: { issue: DiagnosticIssue; expanded: boolean; onToggle: () => void; onDiagnose?: () => void; detectedSyncLabel?: string; onNavigateToField?: (tab: string, fieldId: string) => void; isChecked?: boolean; onCheck?: () => void; onDismiss?: () => void; onFix?: () => void }) {
  const cfg = SEVERITY_CONFIG[issue.severity];
  const isBlocker = issue.severity === 'blocker' || issue.severity === 'warning';
  const [hovered, setHovered] = useState(false);

  return (
    <Card
      onClick={onToggle}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      appearance="filled"
      style={{
        cursor: 'pointer',
        borderColor: hovered ? tokens.colorBrandStroke1 : tokens.colorNeutralStroke1,
        boxShadow: hovered ? tokens.shadow8 : tokens.shadow4,
        transition: 'box-shadow 0.15s, border-color 0.15s',
      }}
    >
      {/* Top row: checkbox + severity badge + source tag */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div onClick={(e) => e.stopPropagation()} style={isChecked ? {
          ['--colorCompoundBrandBackground' as string]: '#107c10',
          ['--colorCompoundBrandBackgroundHover' as string]: '#107c10',
          ['--colorCompoundBrandBackgroundPressed' as string]: '#0e6b0e',
        } : undefined}>
          <Checkbox
            checked={isChecked}
            onChange={(e) => { if (!onCheck && !onDismiss) return; e.stopPropagation(); onCheck ? onCheck() : onDismiss?.(); }}
            shape="circular"
            style={(!onCheck && !onDismiss) ? { pointerEvents: 'none' } : undefined}
          />
        </div>
        <Badge
          appearance={isBlocker ? 'tint' : 'outline'}
          color={isBlocker ? 'danger' : 'warning'}
          size="small"
          shape="circular"
          style={{ textTransform: 'uppercase', fontSize: 10, fontWeight: 700, letterSpacing: '0.05em' }}
        >
          {isBlocker ? cfg.label : 'Suggestion'}
        </Badge>
        <SourceTag source={issue.source} connectorTab={issue.connectorTab} />
      </div>

      <CardHeader
        header={<Text weight="semibold" size={300}>{issue.title}</Text>}
        description={issue.copilotImpact
          ? <Text size={200} style={{ color: tokens.colorNeutralForeground3 }}>{issue.copilotImpact}</Text>
          : undefined}
      />

      <CardFooter>
        {onFix && !isChecked ? (
          <Button
            appearance="outline"
            size="small"
            onClick={(e) => { e.stopPropagation(); onFix(); }}
            style={{ opacity: hovered ? 1 : 0, transition: 'opacity 0.15s', fontSize: 11 }}
          >
            View
          </Button>
        ) : <span />}
        <Text size={100} style={{ color: tokens.colorNeutralForeground4, marginLeft: 'auto' }}>{detectedSyncLabel ?? '—'}</Text>
      </CardFooter>
    </Card>
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

// ─── Recommended-actions helpers (used inside IssueFocusView) ─────────────────

const ISSUE_ERROR_LOGS: Record<string, string[]> = {
  'sn-1': [
    '[2026-03-17 06:02:11] POST https://contoso.service-now.com/api/now/table/kb_knowledge → 403 Forbidden',
    '[2026-03-17 06:02:11] Response: {"error":{"message":"User Not Authenticated","detail":"Required to provide Auth information"}}',
    '[2026-03-17 06:02:11] Auth method: Basic — svc-copilot@contoso.com',
    '[2026-03-17 06:02:11] Sync aborted after 0 items indexed',
  ],
  'sn-2': [
    '[2026-03-17 06:02:14] GET https://contoso.service-now.com/api/now/table/kb_knowledge → 200 OK',
    '[2026-03-17 06:02:14] Response: {"result":[]} — empty result set',
    '[2026-03-17 06:02:14] ACL check: snc_read role missing for svc-copilot@contoso.com',
    '[2026-03-17 06:02:14] 0 of 24,000 articles returned — permission denied at row level',
  ],
  'sn-acl': [
    '[2026-03-16 09:15:03] ACL sync initiated for connector hr-policies',
    '[2026-03-16 09:15:04] GET /api/now/table/sys_user_has_role → 200 OK (0 roles returned)',
    '[2026-03-16 09:15:04] WARNING: acl_read role not found on svc-copilot@contoso.com',
    '[2026-03-16 09:15:04] ACL propagation skipped — no permissions to push',
    '[2026-03-16 09:15:04] All 24,000 items marked as inaccessible to all users',
  ],
  'sn-3': [
    '[2026-03-15 08:15:22] Custom ACL script detected on kb_knowledge table',
    '[2026-03-15 08:15:22] Script type: Row-level security (scripted ACL)',
    '[2026-03-15 08:15:22] WARNING: Connector does not evaluate scripted ACLs — bypassing',
    '[2026-03-15 08:15:22] 2,840 articles indexed without ACL validation',
  ],
};

function RecommendedActionsTable({ actions, onNavigateToField, onAnyApplied, appliedRowsControlled, onAppliedRowsChange, isSuggestion }: {
  actions: RecommendedAction[];
  onNavigateToField?: (tab: string, fieldId: string) => void;
  onAnyApplied?: (anyApplied: boolean) => void;
  appliedRowsControlled?: Set<string>;
  onAppliedRowsChange?: (rows: Set<string>) => void;
  isSuggestion?: boolean;
}) {
  const [appliedRowsInternal, setAppliedRowsInternal] = useState<Set<string>>(new Set());
  const appliedRows = appliedRowsControlled ?? appliedRowsInternal;
  const setAppliedRows = (updater: (s: Set<string>) => Set<string>) => {
    const next = updater(appliedRows);
    if (onAppliedRowsChange) onAppliedRowsChange(next);
    else setAppliedRowsInternal(next);
  };
  const prevAnyApplied = React.useRef(false);
  React.useEffect(() => {
    const anyApplied = appliedRows.size > 0;
    if (anyApplied !== prevAnyApplied.current) {
      prevAnyApplied.current = anyApplied;
      onAnyApplied?.(anyApplied);
    }
  }, [appliedRows, onAnyApplied]);
  const [expandedRows, setExpandedRows] = React.useState<Set<string>>(() => new Set());

  const columns = [
    createTableColumn<RecommendedAction>({ columnId: 'label' }),
    createTableColumn<RecommendedAction>({ columnId: 'expand' }),
  ];

  const { getRows, selection: { toggleRow, isRowSelected } } = useTableFeatures(
    { columns, items: actions, getRowId: (item) => item.id },
    [useTableSelection({
      selectionMode: 'multiselect',
      selectedItems: expandedRows,
      onSelectionChange: (_e, data) => setExpandedRows(data.selectedItems as Set<string>),
    })]
  );

  const rows = getRows((row) => {
    const hasSteps = !!(row.item.steps && row.item.steps.length > 0);
    const selected = isRowSelected(row.rowId);
    return {
      ...row,
      onClick: (e: React.MouseEvent) => { if (hasSteps) toggleRow(e, row.rowId); },
      onKeyDown: (e: React.KeyboardEvent) => { if (e.key === ' ' && hasSteps) { e.preventDefault(); toggleRow(e, row.rowId); } },
      selected,
      appearance: (selected ? 'brand' : 'none') as 'brand' | 'none',
    };
  });

  return (
    <Table aria-label="Recommended actions" style={{ minWidth: '100%' }}>
      <TableBody>
        {rows.map(({ item, selected, onClick, onKeyDown, appearance }) => {
          const isApplied = appliedRows.has(item.id);
          const hasSteps = !!(item.steps && item.steps.length > 0);
          const isExpanded = hasSteps && selected;

          return (
            <React.Fragment key={item.id}>
              <TableRow
                onClick={onClick}
                onKeyDown={onKeyDown}
                aria-selected={selected}
                appearance={appearance}
                style={{ cursor: hasSteps ? 'pointer' : 'default' }}
              >
                <TableCell style={{ width: 28, padding: '12px 0' }}>
                  <span style={isApplied ? {
                    ['--colorCompoundBrandBackground' as string]: tokens.colorPaletteGreenBackground3,
                    ['--colorCompoundBrandBackgroundHover' as string]: tokens.colorPaletteGreenBackground3,
                    ['--colorCompoundBrandBackgroundPressed' as string]: tokens.colorPaletteGreenBackground3,
                    ['--colorNeutralForegroundOnBrand' as string]: '#ffffff',
                  } : undefined}>
                    <Checkbox
                      checked={isApplied}
                      onChange={(e) => { e.stopPropagation(); setAppliedRows(s => { const n = new Set(s); isApplied ? n.delete(item.id) : n.add(item.id); return n; }); }}
                      onClick={(e) => e.stopPropagation()}
                      shape="circular"
                    />
                  </span>
                </TableCell>
                <TableCell>
                  <TableCellLayout truncate>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                      <Text size={300} weight="semibold" style={{ color: tokens.colorBrandForeground1 }}>{item.label}</Text>
                      {item.recommended && (
                        <Badge appearance="tint" color="success" size="small" shape="circular" style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Recommended</Badge>
                      )}
                    </div>
                  </TableCellLayout>
                </TableCell>
                <TableCell style={{ width: 36 }}>
                  <TableCellLayout>
                    {hasSteps && (isExpanded
                      ? <ChevronUpIcon style={{ fontSize: 12, color: tokens.colorNeutralForeground3 }} />
                      : <ChevronDownIcon style={{ fontSize: 12, color: tokens.colorNeutralForeground3 }} />)}
                  </TableCellLayout>
                </TableCell>
              </TableRow>

              {isExpanded && (
                <TableRow appearance="none">
                  <TableCell colSpan={3} style={{ padding: '4px 0 20px 4px' }}>
                    <TableCellLayout>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        {item.steps!.map((step, i) => {
                          const isNavigable = !!(step.tab && step.fieldId && onNavigateToField);
                          const stepApplied = isApplied && step.executable;
                          return (
                            <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                              <span style={{ flexShrink: 0, width: 20, height: 20, borderRadius: '50%', background: stepApplied ? tokens.colorPaletteGreenBackground3 : tokens.colorNeutralBackground3, display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 2 }}>
                                {stepApplied
                                  ? <StatusCircleCheckmarkIcon style={{ fontSize: 12, color: tokens.colorPaletteGreenForeground2 }} />
                                  : <Text size={100} weight="semibold" style={{ color: tokens.colorNeutralForeground2 }}>{i + 1}</Text>
                                }
                              </span>
                              <div style={{ display: 'flex', flexDirection: 'column', gap: 3, flex: 1 }}>
                                {step.executable ? (
                                  stepApplied ? (
                                    <Text size={300} weight="semibold" style={{ color: tokens.colorPaletteGreenForeground2 }}>{step.confirmationMessage ?? step.label}</Text>
                                  ) : (
                                    <button onClick={(e) => { e.stopPropagation(); setAppliedRows(s => new Set(s).add(item.id)); }} style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', textAlign: 'left' }}>
                                      <Text size={300} weight="semibold">{step.label}</Text>
                                    </button>
                                  )
                                ) : isNavigable ? (
                                  <button onClick={(e) => { e.stopPropagation(); onNavigateToField!(step.tab!, step.fieldId!); }} style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', textAlign: 'left' }}>
                                    <Text size={300} weight="semibold" style={{ color: tokens.colorBrandForeground1, textDecoration: 'underline' }}>{step.label}</Text>
                                  </button>
                                ) : (
                                  <Text size={300} weight="semibold">{step.label}</Text>
                                )}
                                {step.description && <Text size={200} style={{ color: tokens.colorNeutralForeground3 }}>{step.description}</Text>}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </TableCellLayout>
                  </TableCell>
                </TableRow>
              )}
            </React.Fragment>
          );
        })}
        {isSuggestion && (() => {
          const isDismissed = appliedRows.has('__dismiss__');
          return (
            <TableRow key="__dismiss__" style={{ cursor: 'pointer' }} onClick={() => setAppliedRows(s => { const n = new Set(s); isDismissed ? n.delete('__dismiss__') : n.add('__dismiss__'); return n; })}>
              <TableCell style={{ width: 28, padding: '12px 0' }}>
                <span style={isDismissed ? {
                  ['--colorCompoundBrandBackground' as string]: tokens.colorPaletteGreenBackground3,
                  ['--colorCompoundBrandBackgroundHover' as string]: tokens.colorPaletteGreenBackground3,
                  ['--colorCompoundBrandBackgroundPressed' as string]: tokens.colorPaletteGreenBackground3,
                  ['--colorNeutralForegroundOnBrand' as string]: '#ffffff',
                } : undefined}>
                  <Checkbox
                    checked={isDismissed}
                    onChange={(e) => e.stopPropagation()}
                    onClick={(e) => e.stopPropagation()}
                    shape="circular"
                    style={{ pointerEvents: 'none' }}
                  />
                </span>
              </TableCell>
              <TableCell colSpan={2}>
                <TableCellLayout>
                  <Text size={300} weight="semibold" style={{ color: tokens.colorBrandForeground1 }}>Dismiss suggestion</Text>
                </TableCellLayout>
              </TableCell>
            </TableRow>
          );
        })()}
      </TableBody>
    </Table>
  );
}

function useIssueErrorLog(issueId: string) {
  const [open, setOpen] = React.useState(false);
  const logs = ISSUE_ERROR_LOGS[issueId];
  const hasLogs = !!(logs && logs.length > 0);
  return { open, setOpen, logs, hasLogs };
}

function IssueErrorLogPanel({ logs, open }: { logs: string[]; open: boolean }) {
  if (!open) return null;
  return (
    <div style={{ borderRadius: 6, background: '#1e1e1e', padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: 4, overflowX: 'auto' }}>
      {logs.map((line, i) => (
        <span key={i} style={{ fontSize: 10, lineHeight: '16px', whiteSpace: 'pre', fontFamily: 'monospace', color: '#d4d4d4' }}>{line}</span>
      ))}
    </div>
  );
}

function IssueFocusView({ issue, onBack, detectedSyncLabel, onNavigateToField, currentIndex, total, onPrev, onNext, isResolved, appliedRows, onAppliedRowsChange, onGoToResolved }: {
  issue: DiagnosticIssue; onBack: () => void; detectedSyncLabel?: string;
  onNavigateToField?: (tab: string, fieldId: string) => void;
  currentIndex?: number; total?: number; onPrev?: () => void; onNext?: () => void;
  isResolved?: boolean;
  appliedRows?: Set<string>;
  onAppliedRowsChange?: (rows: Set<string>) => void;
  onGoToResolved?: () => void;
}) {
  const cfg = SEVERITY_CONFIG[issue.severity];
  const isBlocker = issue.severity === 'blocker' || issue.severity === 'warning';
  const [anyActionApplied, setAnyActionApplied] = React.useState(false);
  const errorLog = useIssueErrorLog(issue.id);
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
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: tokens.colorNeutralBackground1 }}>
      {/* CommandBar — 48px, matches DetailPanelV2 header pattern */}
      <div style={{ flexShrink: 0, height: 48, padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Button
          appearance="subtle"
          icon={<BackIcon style={{ fontSize: 14 }} />}
          onClick={onBack}
          size="small"
          style={{ padding: '0 4px', minWidth: 0, color: tokens.colorNeutralForeground2 }}
        />
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {total !== undefined && total > 1 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              {isResolved || (appliedRows && appliedRows.size > 0)
                ? <Text size={100} style={{ color: tokens.colorNeutralForeground4, cursor: onGoToResolved ? 'pointer' : 'default', textDecoration: onGoToResolved ? 'underline' : 'none' }} onClick={onGoToResolved}>Resolved</Text>
                : <Text size={100} style={{ color: tokens.colorNeutralForeground4 }}>{(currentIndex ?? 0) + 1} / {total} Actions</Text>
              }
              <Button appearance="subtle" size="small" icon={<ChevronLeftIcon style={{ fontSize: 12 }} />} onClick={onPrev} disabled={!onPrev} />
              <Button appearance="subtle" size="small" icon={<ChevronRightIcon style={{ fontSize: 12 }} />} onClick={onNext} disabled={!onNext} />
            </div>
          )}
        </div>
      </div>

      {/* Header area — title + meta */}
      <div style={{ flexShrink: 0, padding: '16px 24px 12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 8 }}>
          <Badge appearance={isBlocker ? 'tint' : 'outline'} color={isBlocker ? 'danger' : 'warning'} size="small" shape="circular"
            style={{ textTransform: 'uppercase', fontSize: 10, fontWeight: 700, letterSpacing: '0.05em' }}>
            {isBlocker ? cfg.label : 'Suggestion'}
          </Badge>
          <SourceTag source={issue.source} connectorTab={issue.connectorTab} onNavigate={handleNavigate} />
        </div>
        <Text as="h2" style={{ fontSize: 20, fontWeight: 700, lineHeight: '28px', color: '#000000', margin: 0 }}>{issue.title}</Text>
        <Text size={200} style={{ color: tokens.colorNeutralForeground4, display: 'block', marginTop: 4 }}>{detectedSyncLabel ?? '—'}</Text>
      </div>

      {/* Scrollable body */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20, padding: '16px 24px' }}>

          {/* Description + show response */}
          <div>
            <Text size={300} style={{ color: tokens.colorNeutralForeground2, lineHeight: '20px', display: 'block' }}>{issue.description}</Text>
            {errorLog.hasLogs && (
              <div style={{ marginTop: 8 }}>
                <Button appearance="transparent" size="small" onClick={() => errorLog.setOpen(v => !v)}
                  style={{ padding: 0, minWidth: 0, alignSelf: 'flex-start' }}>
                  <Text size={200} weight="semibold">Show response</Text>
                  <ChevronDownIcon style={{ fontSize: 10, marginLeft: 2, transition: 'transform 0.2s', transform: errorLog.open ? 'rotate(180deg)' : 'rotate(0deg)' }} />
                </Button>
                {errorLog.open && <div style={{ marginTop: 8 }}><IssueErrorLogPanel logs={errorLog.logs!} open={errorLog.open} /></div>}
              </div>
            )}
          </div>

          {/* Impact message bar */}
          {issue.copilotImpact && (() => {
            const isWarning = issue.severity === 'suggestion';
            const intent = anyActionApplied ? 'success' : isWarning ? 'warning' : 'error';
            return (
              <MessageBar intent={intent} layout="multiline">
                <MessageBarBody>
                  {anyActionApplied ? <><Text weight="semibold">Copilot unblocked</Text>{' '}Applying this fix will restore Copilot indexing.</> : issue.copilotImpact}
                </MessageBarBody>
              </MessageBar>
            );
          })()}

          {/* Recommended actions */}
          {issue.recommendedActions && issue.recommendedActions.length > 0 && (
            <div>
              <div style={{ marginBottom: 4 }}>
                <Text size={200} weight="semibold" style={{ color: tokens.colorNeutralForeground3, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Recommended actions</Text>
              </div>
              <RecommendedActionsTable actions={issue.recommendedActions} onNavigateToField={onNavigateToField} onAnyApplied={setAnyActionApplied} appliedRowsControlled={appliedRows} onAppliedRowsChange={onAppliedRowsChange} isSuggestion={issue.severity === 'suggestion'} />
            </div>
          )}

          {/* Sync guidance */}
          <div style={{ borderTop: `1px solid ${tokens.colorNeutralStroke2}`, paddingTop: 16 }}>
            <Text size={200} style={{ color: tokens.colorNeutralForeground3, lineHeight: '20px', display: 'block' }}>
              Use <Text size={200} weight="semibold">Sync changes</Text> to apply the fix for this issue immediately, or resolve all issues first and sync once at the end.
            </Text>
          </div>

        </div>
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
          { color: '#107c10', label: 'Healthy' },
          { color: '#c87e00', label: 'Good' },
          { color: '#a80000', label: 'Fix' },
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

function HealthRail({ connector, onNavigateToField, onFocusedChange, backTrigger, appliedRowsMap, setAppliedRowsMap }: { connector: Connector; onNavigateToField?: (tab: string, fieldId: string) => void; onFocusedChange?: (focused: boolean) => void; backTrigger?: number; appliedRowsMap: Map<string, Set<string>>; setAppliedRowsMap: React.Dispatch<React.SetStateAction<Map<string, Set<string>>>> }) {
  const [openId, setOpenId] = useState<string | null>(null);
  const [trendOpen, setTrendOpen] = useState(false);
  const [diagnosing, setDiagnosing] = useState<DiagnosticIssue | null>(null);
  const [activeFilter, setActiveFilter] = useState<'all' | 'blocker' | 'suggestion' | 'resolved'>('blocker');
  const [fixModeActive, setFixModeActive] = useState(false);
  const [fixStep, setFixStep] = useState(0);
  // Checklist state
  const [checkedIds, setCheckedIds] = useState<Set<string>>(new Set());
  const [syncDialogOpen, setSyncDialogOpen] = useState(false);
  // Dismissed suggestions
  const [dismissedIds, setDismissedIds] = useState<Set<string>>(new Set());
  // Focused issue view
  const [focusedIssue, setFocusedIssue] = useState<DiagnosticIssue | null>(null);
  const setFocused = (issue: DiagnosticIssue | null) => { setFocusedIssue(issue); onFocusedChange?.(issue !== null); };
  React.useEffect(() => { if (backTrigger) { setFocused(null); } }, [backTrigger]);

  if (diagnosing) {
    return <DiagnosticDrillDown issue={diagnosing} onBack={() => setDiagnosing(null)} detectedSyncLabel={getSyncCycleLabel(diagnosing.detectedAt, connector.syncHistory)} onNavigateToField={onNavigateToField} />;
  }

  if (focusedIssue) {
    const allIssues = connector.issues.filter((i) => !i.resolvedAt);
    const focusedIdx = allIssues.findIndex((i) => i.id === focusedIssue.id);
    const focusedIsResolved = (focusedIssue.severity === 'blocker' || focusedIssue.severity === 'warning') ? checkedIds.has(focusedIssue.id) : dismissedIds.has(focusedIssue.id);
    const unresolvedIssues = allIssues.filter((i) =>
      !checkedIds.has(i.id) && !dismissedIds.has(i.id) && (appliedRowsMap.get(i.id)?.size ?? 0) === 0
    );
    const focusedUnresolvedIdx = unresolvedIssues.findIndex((i) => i.id === focusedIssue.id);
    const navigateTo = (issue: DiagnosticIssue) => {
      setFocused(issue);
      if (issue.connectorTab && issue.connectorFieldId && onNavigateToField) {
        onNavigateToField(issue.connectorTab, issue.connectorFieldId);
      }
    };
    return (
      <IssueFocusView
        issue={focusedIssue}
        onBack={() => setFocused(null)}
        detectedSyncLabel={getSyncCycleLabel(focusedIssue.detectedAt, connector.syncHistory)}
        onNavigateToField={onNavigateToField}
        currentIndex={focusedUnresolvedIdx >= 0 ? focusedUnresolvedIdx : focusedIdx}
        total={unresolvedIssues.length}
        onPrev={focusedIdx > 0 ? () => navigateTo(allIssues[focusedIdx - 1]) : undefined}
        onNext={focusedIdx < allIssues.length - 1 ? () => navigateTo(allIssues[focusedIdx + 1]) : undefined}
        isResolved={focusedIsResolved}

        appliedRows={appliedRowsMap.get(focusedIssue.id) ?? new Set()}
        onAppliedRowsChange={(rows) => setAppliedRowsMap(m => { const n = new Map(m); n.set(focusedIssue.id, rows); return n; })}
        onGoToResolved={() => { setFocused(null); setActiveFilter('resolved'); }}
      />
    );
  }

  const activeIssues = connector.issues.filter((i) => !i.resolvedAt);
  const isResolved = (i: DiagnosticIssue) =>
    (i.severity === 'blocker' || i.severity === 'warning')
      ? checkedIds.has(i.id) || (appliedRowsMap.get(i.id)?.size ?? 0) > 0
      : dismissedIds.has(i.id) || (appliedRowsMap.get(i.id)?.size ?? 0) > 0;
  const resolvedIssues = activeIssues.filter(isResolved);
  const unresolvedIssues = activeIssues.filter((i) => !isResolved(i));
  const filteredIssues = (activeFilter === 'resolved' ? resolvedIssues : unresolvedIssues)
    .slice().sort((a, b) => a.rank - b.rank);

  const blockerIssues = activeIssues.filter((i) => i.severity === 'blocker' || i.severity === 'warning');
  const uncheckedBlockers = blockerIssues.filter((i) => !checkedIds.has(i.id));
  const checkedCount = resolvedIssues.length;
  const totalIssuesCount = activeIssues.length; // blockers + suggestions



  // Navigate to a blocker issue
  const navigateTo = (issue: DiagnosticIssue) => {
    setOpenId(issue.id);
    setFocused(issue);
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


  const currentFixIssue = fixModeActive ? (blockerIssues[fixStep] ?? null) : null;

  const toggleChecked = (id: string) => {
    setCheckedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const allFixed = totalIssuesCount > 0 && checkedCount === totalIssuesCount;

  return (
    <div className="flex flex-col gap-5 w-full">

      {/* Combined status + progress card */}
      <Card style={{ backgroundColor: tokens.colorNeutralBackground3 }}>
        {/* Healthy state */}
        {blockerIssues.length === 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <Badge appearance="filled" color="success" size="medium" shape="circular" style={{ alignSelf: 'flex-start', textTransform: 'uppercase', fontSize: 10, fontWeight: 700, letterSpacing: '0.05em' }}>Healthy</Badge>
            <Button
              appearance="transparent"
              onClick={() => setTrendOpen((v) => !v)}
              style={{ padding: 0, minWidth: 0, height: 'auto', width: '100%', justifyContent: 'space-between' }}
              icon={<ChevronDownIcon style={{ fontSize: 12, color: tokens.colorNeutralForeground3, transform: trendOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }} />}
              iconPosition="after"
            >
              <Text weight="semibold" size={400}>No issues detected</Text>
            </Button>
            {trendOpen && <SyncHealthChart connector={connector} />}
            {trendOpen && <div style={{ height: 8 }} />}
            {/* Count annotation bar */}
            <div style={{ display: 'flex', alignItems: 'stretch', gap: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ width: 3, borderRadius: 99, backgroundColor: tokens.colorNeutralStroke1, flexShrink: 0, alignSelf: 'stretch' }} />
                <span style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Text size={100} style={{ color: tokens.colorNeutralForeground3 }}>Blockers</Text>
                  <Text weight="bold" size={400}>0</Text>
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ width: 3, borderRadius: 99, backgroundColor: tokens.colorNeutralStroke1, flexShrink: 0, alignSelf: 'stretch' }} />
                <span style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Text size={100} style={{ color: tokens.colorNeutralForeground3 }}>Suggestions</Text>
                  <Text weight="bold" size={400}>0</Text>
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Blockers state */}
        {blockerIssues.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <Badge appearance="filled" color="danger" size="medium" shape="circular" style={{ alignSelf: 'flex-start', textTransform: 'uppercase', fontSize: 10, fontWeight: 700, letterSpacing: '0.05em' }}>Action required</Badge>
            {/* Accordion heading */}
            <Button
              appearance="transparent"
              onClick={() => setTrendOpen((v) => !v)}
              style={{ padding: 0, minWidth: 0, height: 'auto', width: '100%', justifyContent: 'space-between' }}
              icon={<ChevronDownIcon style={{ fontSize: 12, color: tokens.colorNeutralForeground3, transform: trendOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }} />}
              iconPosition="after"
            >
              <Text weight="semibold" size={400}>Connector stopped syncing</Text>
            </Button>

            {trendOpen && <SyncHealthChart connector={connector} />}

            {trendOpen && <div style={{ height: 8 }} />}

            {/* Count annotation bar */}
            <div style={{ display: 'flex', alignItems: 'stretch', gap: 20 }}>
              {blockerIssues.length > 0 && (
                <Button appearance="transparent" onClick={() => !allFixed && setActiveFilter('blocker')} style={{ padding: 0, minWidth: 0, height: 'auto', gap: 8, opacity: allFixed ? 0.4 : 1 }}>
                  <span style={{ width: 3, borderRadius: 99, backgroundColor: allFixed ? tokens.colorNeutralStroke1 : tokens.colorPaletteRedBackground3, flexShrink: 0, alignSelf: 'stretch' }} />
                  <span style={{ display: 'flex', flexDirection: 'column', gap: 2, textAlign: 'left' }}>
                    <Text size={100} style={{ color: tokens.colorNeutralForeground3 }}>Blocker{blockerIssues.length !== 1 ? 's' : ''}</Text>
                    <Text weight="bold" size={400} style={{ color: allFixed ? tokens.colorNeutralForeground3 : undefined }}>{blockerIssues.length}</Text>
                  </span>
                </Button>
              )}
              {(() => {
                const suggestionIssues = activeIssues.filter((i) => i.severity === 'suggestion');
                const allSuggestionsResolved = suggestionIssues.length > 0 && suggestionIssues.every(isResolved);
                return suggestionIssues.length > 0 && (
                  <Button appearance="transparent" onClick={() => !allSuggestionsResolved && setActiveFilter('suggestion')} style={{ padding: 0, minWidth: 0, height: 'auto', gap: 8, opacity: allSuggestionsResolved ? 0.4 : 1 }}>
                    <span style={{ width: 3, borderRadius: 99, backgroundColor: allSuggestionsResolved ? tokens.colorNeutralStroke1 : tokens.colorPaletteMarigoldBackground3, flexShrink: 0, alignSelf: 'stretch' }} />
                    <span style={{ display: 'flex', flexDirection: 'column', gap: 2, textAlign: 'left' }}>
                      <Text size={100} style={{ color: tokens.colorNeutralForeground3 }}>Suggestion{suggestionIssues.length !== 1 ? 's' : ''}</Text>
                      <Text weight="bold" size={400} style={{ color: allSuggestionsResolved ? tokens.colorNeutralForeground3 : undefined }}>{suggestionIssues.length}</Text>
                    </span>
                  </Button>
                );
              })()}
            </div>

            {/* Progress bar */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginTop: 8, marginBottom: 8 }}>
              <Text size={200} style={{ color: tokens.colorNeutralForeground3 }}>
                {allFixed ? 'All actions resolved' : `${checkedCount} of ${totalIssuesCount} Actions`}
              </Text>
              <ProgressBar
                value={checkedCount / totalIssuesCount}
                color="success"
                thickness="large"
              />
            </div>

            {/* Fix / Sync buttons */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              {!allFixed && (
                <PrimaryButton onClick={handleFixNext}>
                  {checkedCount > 0 ? 'Fix next' : 'Fix'}
                </PrimaryButton>
              )}
              <ActionButton onClick={() => setSyncDialogOpen(true)}>Sync changes</ActionButton>
            </div>
          </div>
        )}
      </Card>

      {/* Issues section */}
      {activeIssues.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

          {/* Filter pills */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {([
              { key: 'blocker', label: 'Actions', count: unresolvedIssues.length },
              { key: 'resolved', label: 'Resolved', count: resolvedIssues.length },
            ] as const).map((pill) => (
              <ToggleButton
                key={pill.key}
                shape="circular"
                size="small"
                checked={activeFilter === pill.key}
                onClick={() => setActiveFilter(pill.key)}
                icon={pill.count > 0 ? (
                  <span style={{
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    width: 18, height: 18, borderRadius: '50%', fontSize: 10, fontWeight: 700,
                    backgroundColor: activeFilter === pill.key ? 'rgba(255,255,255,0.25)' : tokens.colorNeutralBackground3,
                    color: activeFilter === pill.key ? 'inherit' : tokens.colorNeutralForeground2,
                  }}>{pill.count}</span>
                ) : undefined}
              >
                {pill.label}
              </ToggleButton>
            ))}
          </div>

          {/* Issue list with checkboxes */}
          <div className="flex flex-col gap-3">
            {filteredIssues.map((issue) => {
              const isBlocker = issue.severity === 'blocker' || issue.severity === 'warning';
              const isChecked = checkedIds.has(issue.id);
              return (
                <div key={issue.id}>
                  <div className="flex flex-col gap-1.5">
                    <IssueCard
                      issue={issue}
                      expanded={false}
                      onToggle={() => { setFocused(issue); if (issue.connectorTab && issue.connectorFieldId && onNavigateToField) onNavigateToField(issue.connectorTab, issue.connectorFieldId); }}
                      onDiagnose={() => setDiagnosing(issue)}
                      detectedSyncLabel={getSyncCycleLabel(issue.detectedAt, connector.syncHistory)}
                      onNavigateToField={onNavigateToField}
                      isChecked={isBlocker ? (isChecked || (appliedRowsMap.get(issue.id)?.size ?? 0) > 0) : (dismissedIds.has(issue.id) || (appliedRowsMap.get(issue.id)?.size ?? 0) > 0)}
                      onCheck={isBlocker && !issue.recommendedActions?.length ? () => toggleChecked(issue.id) : undefined}
                      onDismiss={!isBlocker && !issue.recommendedActions?.length ? () => setDismissedIds((p) => { const n = new Set(p); n.add(issue.id); return n; }) : undefined}
                      onFix={isBlocker ? () => { setFixModeActive(true); setFixStep(blockerIssues.indexOf(issue)); navigateTo(issue); } : undefined}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <Dialog
        hidden={!syncDialogOpen}
        onDismiss={() => setSyncDialogOpen(false)}
        dialogContentProps={{
          type: DialogType.normal,
          title: 'Sync changes',
          subText: 'Syncing will save your changes and run in the background. You can continue working while the sync is in progress.',
        }}
        modalProps={{ isBlocking: false }}
      >
        <DialogFooter>
          <PrimaryButton onClick={() => setSyncDialogOpen(false)}>Sync now</PrimaryButton>
          <DefaultButton onClick={() => setSyncDialogOpen(false)}>Cancel</DefaultButton>
        </DialogFooter>
      </Dialog>
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
      <div ref={(el) => { if (fieldRefs) fieldRefs.current['access-permissions'] = el; }} className={`transition-colors duration-500 rounded-[4px] -mx-2 px-2 ${fieldHighlight === 'access-permissions' ? 'bg-[#eff6ff]' : ''}`}>
      <CollapsibleSection title="Access Permissions">
        <ChoiceGroup
          selectedKey={accessType}
          options={[
            {
              key: 'acl',
              text: 'Only people with access to this data',
              onRenderLabel: () => (
                <div style={{ paddingLeft: 28 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                    <span style={{ fontSize: 14, color: '#323130' }}>Only people with access to this data</span>
                    <span style={{ padding: '1px 6px', fontSize: 10, fontWeight: 600, color: '#107c10', background: '#f0f7ec', border: '1px solid #c8e0b8', borderRadius: 2, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Recommended</span>
                  </div>
                  <p style={{ fontSize: 13, color: '#605e5c', lineHeight: '20px', margin: 0 }}>Only users in your Access Control List (ACL) will see results from this data source.</p>
                </div>
              ),
            },
            {
              key: 'everyone',
              text: 'Everyone',
              onRenderLabel: () => (
                <div style={{ paddingLeft: 28 }}>
                  <span style={{ fontSize: 14, color: '#323130' }}>Everyone</span>
                  <p style={{ fontSize: 13, color: '#605e5c', lineHeight: '20px', margin: '2px 0 0' }}>Everyone in your organisation will see results from this data source.</p>
                </div>
              ),
            },
          ] as IChoiceGroupOption[]}
          onChange={(_, opt) => { if (opt) setAccessType(opt.key as 'acl' | 'everyone'); }}
          styles={{
            flexContainer: { display: 'flex', flexDirection: 'column', gap: 12 },
            root: {
              selectors: {
                '.ms-ChoiceField-field': { alignItems: 'flex-start', paddingTop: 0 },
                '.ms-ChoiceField-field::before': { marginTop: 2 },
                '.ms-ChoiceField-field::after': { marginTop: 2 },
                '.ms-ChoiceField-labelWrapper': { paddingLeft: 0, width: '100%' },
              }
            }
          }}
        />
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
      <div ref={(el) => { if (fieldRefs) fieldRefs.current['include-data'] = el; }} className={`transition-colors duration-500 rounded-[4px] -mx-2 px-2 ${fieldHighlight === 'include-data' ? 'bg-[#eff6ff]' : ''}`}>
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
        <Dropdown
          label="Time zone"
          selectedKey={timezone}
          options={TIMEZONES.map(tz => ({ key: tz, text: tz }))}
          onChange={(_, opt) => { if (opt) setTimezone(opt.key as string); }}
          styles={{ root: { width: '100%' } }}
        />
      </div>

      {/* Incremental sync */}
      <div ref={(el) => { if (fieldRefs) fieldRefs.current["sync-frequency"] = el; }} className={`transition-colors duration-500 rounded-[4px] -mx-2 px-2 ${fieldHighlight === 'sync-frequency' ? 'bg-[#eff6ff]' : ''}`}>
      <CollapsibleSection title="Incremental sync" defaultOpen={true}>
        <div className="flex flex-col gap-4">
          <Toggle
            checked={incrementalOn}
            onChange={(_, checked) => setIncrementalOn(!!checked)}
            onText="On" offText="Off"
            styles={{ root: { marginBottom: 0 } }}
          />
          {incrementalOn && (
            <>
              <Dropdown
                label="Recurrence"
                selectedKey={incRecurrence}
                options={['Hour', 'Day', 'Week', 'Month'].map(v => ({ key: v, text: `Every ${v}` }))}
                onChange={(_, opt) => { if (opt) setIncRecurrence(opt.key as string); }}
                styles={{ root: { width: '100%' } }}
              />
              <FluentV8Checkbox
                label="Run once in a day"
                checked={incRunOnce}
                onChange={(_, checked) => setIncRunOnce(!!checked)}
              />
              <Dropdown
                label="Frequency"
                selectedKey={incFreq}
                options={['5 minutes', '15 minutes', '30 minutes', '1 hour', '2 hours'].map(v => ({ key: v, text: `Every ${v}` }))}
                onChange={(_, opt) => { if (opt) setIncFreq(opt.key as string); }}
                styles={{ root: { width: '100%' } }}
              />
              <button className="text-[14px] text-[#0078d4] hover:underline text-left w-fit">
                Add starting time
              </button>
            </>
          )}
        </div>
      </CollapsibleSection>
      </div>

      {/* Full sync */}
      <CollapsibleSection title="Full sync" defaultOpen={true}>
        <div className="flex flex-col gap-4">
          <Dropdown
            label="Recurrence"
            selectedKey={fullRecurrence}
            options={['Day', 'Week', 'Month'].map(v => ({ key: v, text: `Every ${v}` }))}
            onChange={(_, opt) => { if (opt) setFullRecurrence(opt.key as string); }}
            styles={{ root: { width: '100%' } }}
          />

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
  const [healthFocused, setHealthFocused] = useState(false);
  const [healthBackTrigger, setHealthBackTrigger] = useState(0);
  // Recommended action applied rows — lifted here so form field edits can auto-apply matching actions
  const [appliedRowsMap, setAppliedRowsMap] = useState<Map<string, Set<string>>>(new Map());

  function autoApplyForField(fieldId: string) {
    if (!existingConnector) return;
    setAppliedRowsMap(prev => {
      const next = new Map(prev);
      for (const issue of existingConnector.issues) {
        if (!issue.recommendedActions) continue;
        for (const action of issue.recommendedActions) {
          const matches = action.steps?.some(s => s.fieldId === fieldId) || issue.connectorFieldId === fieldId;
          if (matches) {
            const existing = next.get(issue.id) ?? new Set<string>();
            const updated = new Set(existing);
            updated.add(action.id);
            next.set(issue.id, updated);
          }
        }
      }
      return next;
    });
  }

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
      if (fieldId === 'auth-credentials') {
        setTimeout(() => credentialsUsernameRef.current?.focus(), 150);
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
  const [basicUsername, setBasicUsername] = useState(existingConnector?.basicUsername ?? '');
  const [basicPassword, setBasicPassword] = useState(existingConnector?.basicPassword ?? '');
  const credentialsUsernameRef = React.useRef<HTMLInputElement>(null);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const allPeople = [
    { value: 'alex-johnson', name: 'Alex Johnson' },
    { value: 'maria-garcia', name: 'Maria Garcia' },
    { value: 'it-pilot-group', name: 'IT Pilot Group' },
  ];
  const [selectedPeople, setSelectedPeople] = useState<string[]>(['alex-johnson', 'maria-garcia', 'it-pilot-group']);
  const [rolloutLimited, setRolloutLimited] = useState(false);
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
        className="fixed inset-0 bg-black/50 z-[60]"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="fixed top-[48px] right-0 bottom-0 z-[70] flex flex-col overflow-hidden" style={{ width: '80%' }}>
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
                  <TextField
                    label="Source name"
                    required
                    autoFocus
                    value={editName}
                    onChange={(_, v) => setEditName(v ?? '')}
                    styles={{ root: { width: '100%' } }}
                  />

                  {/* Save / Cancel */}
                  <div className="flex items-center gap-2">
                    <PrimaryButton
                      onClick={() => { setTypeName(editName); setEditingHeader(false); setGuidanceHighlight(undefined); markChanged(); }}
                    >
                      Save
                    </PrimaryButton>
                    <PrimaryButton
                      onClick={() => { setEditName(existingConnector?.connectorType || typeName); setEditIconPreview(null); setEditingHeader(false); setGuidanceHighlight(undefined); }}
                      styles={{ root: { background: 'white', border: '1px solid #8a8886', color: '#323130', selectors: { ':hover': { background: '#f3f2f1' } } } }}
                    >
                      Cancel
                    </PrimaryButton>
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
              <div className="flex items-center gap-5 pb-6 border-b border-[#e1e1e1]">
                <ConnectorIcon src={editIconPreview ?? resolvedLogoUrl} name={typeName} size={72} />
                <div className="flex flex-col gap-1">
                  <h1 className="text-[22px] font-bold text-[#323130] leading-7">{typeName}</h1>
                  {isEdit && displayName && (
                    <p className="text-[14px] text-[#605e5c]">{displayName}</p>
                  )}
                  <button
                    onClick={() => {
                      setEditName(existingConnector?.connectorType || typeName);
                      setEditIconPreview(null);
                      setEditingHeader(true);
                      if (!suppressGuidanceSwitch.current) setRightRailTab('guide');
                      setGuidanceHighlight('icon-name');
                    }}
                    className="flex items-center gap-1.5 text-[13px] mt-1 w-fit hover:opacity-80"
                  >
                    <EditIcon style={{ fontSize: 13 }} className="text-[#0078d4]" />
                    <span className="text-[#0078d4]">Edit source name &amp; icon</span>
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
          <div ref={formScrollRef} className="flex-1 overflow-y-auto px-8 pt-12 pb-6" onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget as Node)) setGuidanceHighlight(undefined); }}>
            {activeTab === 'Users' && <UsersTabContent fieldHighlight={fieldHighlight} fieldRefs={fieldRefs} />}
            {activeTab === 'Content' && <ContentTabContent fieldHighlight={fieldHighlight} fieldRefs={fieldRefs} />}
            {activeTab === 'Sync' && <SyncTabContent fieldHighlight={fieldHighlight} fieldRefs={fieldRefs} />}
            {activeTab !== 'Users' && activeTab !== 'Content' && activeTab !== 'Sync' && <div className="max-w-[528px] flex flex-col gap-6">

              {/* Connection name */}
              <div ref={(el) => { fieldRefs.current['display-name'] = el; }}>
                <p className="text-[14px] font-semibold text-[#323130] mb-2">Enter a unique name to manage this connection</p>
                <TextField
                  label="Connection name"
                  required
                  value={displayName}
                  onChange={(_, v) => { setDisplayName(v ?? ''); setSourceName(v ?? ''); markChanged(); }}
                  onFocus={() => { setGuidanceHighlight('display-name'); if (!suppressGuidanceSwitch.current) setRightRailTab('guide'); }}
                  styles={{ root: { width: '100%' } }}
                />
              </div>

              {/* User criteria — ServiceNow only */}
              {typeName !== 'ADO' && (
                <div ref={(el) => { fieldRefs.current['user-criteria'] = el; }}>
                  <p className="text-[14px] font-semibold text-[#323130] mb-2">User criteria setup in ServiceNow</p>
                  <ChoiceGroup
                    selectedKey={userCriteria}
                    options={[
                      { key: 'simple', text: 'Simple' },
                      { key: 'advanced', text: 'Advanced' },
                    ] as IChoiceGroupOption[]}
                    onChange={(_, opt) => { if (opt) { setUserCriteria(opt.key as UserCriteriaType); markChanged(); setGuidanceHighlight('user-criteria'); if (!suppressGuidanceSwitch.current) setRightRailTab('guide'); } }}
                    styles={{ flexContainer: { display: 'flex', gap: 24 } }}
                  />
                </div>
              )}

              {/* Instance URL */}
              <div ref={(el) => { fieldRefs.current['instance-url'] = el; }}>
                <p className="text-[14px] font-semibold text-[#323130] mb-2">Provide basic information about your {typeName === 'ADO' ? 'ADO' : 'ServiceNow'} instance</p>
                <TextField
                  label="Instance URL"
                  required
                  prefix="https://"
                  value={instanceUrl.replace(/^https?:\/\//, '')}
                  onChange={(_, v) => { setInstanceUrl(v ? `https://${v}` : ''); markChanged(); }}
                  onFocus={() => { setGuidanceHighlight('instance-url'); if (!suppressGuidanceSwitch.current) setRightRailTab('guide'); }}
                  placeholder="example.servicenow.com"
                  styles={{ root: { width: '100%' } }}
                />
              </div>

              {/* Authentication */}
              <div ref={(el) => { fieldRefs.current['auth-types'] = el; }} className={`transition-colors duration-500 rounded-[4px] -mx-2 px-2 ${fieldHighlight === 'auth-types' ? 'bg-[#eff6ff]' : ''}`}>
                <p className="text-[14px] font-semibold text-[#323130] mb-2">Authenticate your {typeName === 'ADO' ? 'ADO' : 'ServiceNow'} instance</p>
                <Dropdown
                  label="Authentication type"
                  required
                  selectedKey={authMethod === 'none' ? null : authMethod}
                  placeholder="Select a method"
                  options={AUTH_OPTIONS.map(o => ({ key: o.value, text: o.label })) as IDropdownOption[]}
                  onChange={(_, opt) => { if (opt) { setAuthMethod(opt.key as AuthMethod); markChanged(); autoApplyForField('auth-types'); } }}
                  onFocus={() => { setGuidanceHighlight('auth-types'); if (!suppressGuidanceSwitch.current) setRightRailTab('guide'); }}
                  styles={{ root: { width: '100%' } }}
                />

                {/* Basic Auth credential inputs */}
                {authMethod === 'basic' && (
                  <div ref={(el) => { fieldRefs.current['auth-credentials'] = el; }} className={`flex flex-col gap-3 mt-3 transition-colors duration-500 rounded-[4px] -mx-2 px-2 py-1 ${fieldHighlight === 'auth-credentials' ? 'bg-[#eff6ff]' : ''}`}>
                    <TextField
                      label="Username"
                      required
                      componentRef={credentialsUsernameRef as React.RefObject<any>}
                      value={basicUsername}
                      onChange={(_, v) => { setBasicUsername(v ?? ''); markChanged(); autoApplyForField('auth-credentials'); }}
                      placeholder="e.g. svc-copilot@contoso.com"
                      styles={{ root: { width: '100%' } }}
                    />
                    <TextField
                      label="Password"
                      required
                      type="password"
                      canRevealPassword
                      value={basicPassword}
                      onChange={(_, v) => { setBasicPassword(v ?? ''); markChanged(); autoApplyForField('auth-credentials'); }}
                      styles={{ root: { width: '100%' } }}
                    />
                  </div>
                )}
              </div>

              {/* Staged rollout */}
              <div ref={(el) => { fieldRefs.current['staged-rollout'] = el; }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                  <p className="text-[14px] font-semibold text-[#323130]">Rollout to limited audience.</p>
                  <Toggle
                    checked={rolloutLimited}
                    onChange={(_, checked) => setRolloutLimited(!!checked)}
                    styles={{ root: { marginBottom: 0 } }}
                  />
                </div>
                {rolloutLimited && (
                  <NormalPeoplePicker
                    selectedItems={selectedPeople.map(val => {
                      const p = allPeople.find(x => x.value === val)!;
                      return { key: val, text: p.name } as IPersonaProps;
                    })}
                    onResolveSuggestions={(filter: string) =>
                      allPeople
                        .filter(p => !selectedPeople.includes(p.value) && p.name.toLowerCase().includes(filter.toLowerCase()))
                        .map(p => ({ key: p.value, text: p.name } as IPersonaProps))
                    }
                    onChange={(items?: IPersonaProps[]) => setSelectedPeople((items ?? []).map(i => i.key as string))}
                    inputProps={{ placeholder: 'Select users/groups', onFocus: () => { setGuidanceHighlight('staged-rollout'); if (!suppressGuidanceSwitch.current) setRightRailTab('guide'); } }}
                    pickerSuggestionsProps={{ suggestionsHeaderText: 'Suggested people', noResultsFoundText: 'No results found' }}
                    styles={{ root: { width: '100%' } }}
                  />
                )}
              </div>

              {/* Privacy notice */}
              <div>
                <FluentV8Checkbox
                  checked={privacyAccepted}
                  onChange={(_, checked) => setPrivacyAccepted(!!checked)}
                  onRenderLabel={() => (
                    <div style={{ marginLeft: 8 }}>
                      <span style={{ fontSize: 14, fontWeight: 600, color: '#323130' }}>Privacy notice</span>
                      {' '}<span style={{ color: '#a80000' }}>*</span>
                      <p style={{ fontSize: 13, color: '#484644', lineHeight: '20px', margin: '4px 0 0' }}>
                        By using this Copilot connector, you agree to the{' '}
                        <a href="https://learn.microsoft.com/en-us/microsoftsearch/terms-of-use" target="_blank" rel="noreferrer" style={{ color: '#0078d4' }}>
                          Copilot connectors: Terms of use
                        </a>. You as data controller authorize Microsoft to create an index of third-party data in your Microsoft 365 tenant subject to your configurations. Learn more{' '}
                        <a href="https://learn.microsoft.com/en-us/microsoftsearch/connectors-overview" target="_blank" rel="noreferrer" style={{ color: '#0078d4' }}>here</a>.
                      </p>
                    </div>
                  )}
                  styles={{ root: { alignItems: 'flex-start' }, checkbox: { marginTop: 2 } }}
                />
              </div>

            </div>}
          </div>

        </div>

        {/* Right rail */}
        <div className="w-[360px] flex-shrink-0 bg-[#faf9f8] border-l border-[#e1e1e1] flex flex-col overflow-hidden">
          {/* Tabs — only show Connector health tab in edit mode, hide when focused */}
          {isEdit && existingConnector && !healthFocused ? (
            <div className="flex px-6 flex-shrink-0 pt-12">
              {(['health', 'guide'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => { setRightRailTab(tab); if (tab === 'guide') { setHealthFocused(false); setHealthBackTrigger(n => n + 1); } }}
                  className={`pb-2 mr-6 text-[14px] border-b-2 -mb-px transition-colors ${
                    rightRailTab === tab
                      ? 'font-semibold text-[#0078d4] border-[#0078d4]'
                      : 'text-[#323130] border-transparent hover:text-[#0078d4]'
                  }`}
                >
                  {tab === 'health' ? 'Actions' : 'Guide'}
                </button>
              ))}
            </div>
          ) : !healthFocused ? (
            <div className="flex items-center justify-between px-6 pt-12 pb-4 flex-shrink-0">
              <span />
              <a href="https://learn.microsoft.com/en-us/microsoft-365/copilot/connectors/servicenow-knowledge-deployment" target="_blank" rel="noreferrer"
                className="text-[13px] text-[#0078d4] whitespace-nowrap hover:underline">
                Read detailed documentation
              </a>
            </div>
          ) : null}
          <div ref={railScrollRef} className="flex-1 overflow-y-auto" style={(healthFocused && rightRailTab === 'health') ? { padding: 0, background: 'white' } : { padding: '24px' }}>
            {isEdit && existingConnector && rightRailTab === 'health'
              ? <HealthRail connector={existingConnector} onNavigateToField={handleNavigateToField} onFocusedChange={setHealthFocused} backTrigger={healthBackTrigger} appliedRowsMap={appliedRowsMap} setAppliedRowsMap={setAppliedRowsMap} />
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
            <PrimaryButton
              disabled={isEdit ? !hasChanges : !canCreate}
              onClick={() => { if (isEdit && hasChanges) { setHasChanges(false); setValidateDone(false); } }}
            >
              {isEdit ? 'Save' : 'Create'}
            </PrimaryButton>
          </div>
          <div className="flex items-center gap-4">
            <PrimaryButton disabled styles={{ root: { background: '#ededed', color: '#a1a1a1', border: 'none' } }}>
              Save and close
            </PrimaryButton>
            <PrimaryButton onClick={onClose} styles={{ root: { background: '#e8e8e8', color: '#323130', border: 'none', selectors: { ':hover': { background: '#d2d0ce' } } } }}>
              Cancel
            </PrimaryButton>
          </div>
        </div>
      </div>
    </>
  );
}
