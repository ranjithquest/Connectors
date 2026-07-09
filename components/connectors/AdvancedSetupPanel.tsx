'use client';

import React, { useState, useEffect } from 'react';
import { ChartHoverCard } from '@fluentui/react-charting';
import { Dialog, DialogType, DialogFooter, TextField, Dropdown, ChoiceGroup, Toggle, Checkbox as FluentV8Checkbox, NormalPeoplePicker, Pivot, PivotItem, AnimationStyles, CommandBar, ActionButton } from '@fluentui/react';
import { mergeStyles } from '@fluentui/merge-styles';

const slideInClass = mergeStyles(AnimationStyles.slideDownIn10);
import type { IDropdownOption, IChoiceGroupOption, IPersonaProps } from '@fluentui/react';
import type { Connector, AuthMethod, UserCriteriaType, DiagnosticIssue, IssueSource, SyncEvent, RecommendedAction } from '@/lib/types';
import { CONNECTOR_CATALOG } from '@/lib/gallery-data';
import SetupGuideRail, { type GuideSection } from './SetupGuideRail';
import {
  ChromeCloseIcon, EditIcon, OpenPaneMirroredIcon, SettingsIcon,
  ChevronDownIcon, ChevronUpIcon, ChevronLeftIcon, ChevronRightIcon, CheckMarkIcon, InfoIcon,
  OpenInNewWindowIcon, NavigateBackIcon, DiagnosticIcon,
  ErrorBadgeIcon, StatusCircleSyncIcon,
  AddIcon, UploadIcon, RefreshIcon, CompletedSolidIcon, StatusCircleQuestionMarkIcon, CircleRingIcon, DownloadIcon, MoreIcon,
} from '@fluentui/react-icons-mdl2';
import { PlugConnectedRegular, ChatEmptyRegular } from '@fluentui/react-icons';
import {
  Card,
  CardHeader,
  CardFooter,
  Badge,
  Button,
  ToggleButton,
  Text,
  ProgressBar,
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
  Accordion,
  AccordionItem,
  AccordionHeader,
  AccordionPanel,
  FluentProvider,
  webLightTheme,
  webDarkTheme,
  Skeleton,
  SkeletonItem,
  Dropdown as FluentDropdown,
  Option,
  Spinner,
} from '@fluentui/react-components';
import { OverlayDrawer, DrawerBody } from '@fluentui/react-drawer';
import ConnectionConfirmationView, { type ConnectionConfirmationStep } from './ConnectionConfirmationView';
import { CONNECTION_VALIDATION_STEPS, createSetupEditIssues } from '@/lib/connection-flow';

// ─── Guidance panel ───────────────────────────────────────────────────────────

const GUIDANCE_SECTIONS: GuideSection[] = [
  {
    id: 'icon-name',
    title: 'Source icon and name',
    defaultOpen: false,
    content: (
      <div className="text-[12px] text-[#323130] dark:text-[#f5f5f5] leading-[16px]">
        Source Icon &amp; name are displayed to the end users on Copilot search
      </div>
    ),
  },
  {
    id: 'display-name', title: 'Connection name', defaultOpen: false,
    content: (
      <div className="text-[12px] text-[#323130] dark:text-[#f5f5f5] leading-[18px] flex flex-col gap-2">
        <p>The connector name is a unique label used to manage and identify this connection in the admin portal. It is not shown to end users.</p>
        <p>Use a descriptive name that reflects the data source, e.g. <span className="font-semibold">HR Policies – ServiceNow</span>.</p>
      </div>
    ),
  },
  {
    id: 'user-criteria', title: 'User criteria setup in ServiceNow', defaultOpen: false,
    content: (
      <div className="text-[12px] text-[#323130] dark:text-[#f5f5f5] leading-[18px] flex flex-col gap-2">
        <p><span className="font-semibold">Simple</span> — Restrict access using a single user-criteria rule defined in ServiceNow. Best for most deployments.</p>
        <p><span className="font-semibold">Advanced</span> — Combine multiple user-criteria rules with AND / OR logic for fine-grained access control.</p>
        <p>Ensure matching user criteria exist in your ServiceNow instance before saving.</p>
      </div>
    ),
  },
  {
    id: 'instance-url', title: 'ServiceNow Instance URL', defaultOpen: false,
    content: (
      <div className="text-[12px] text-[#323130] dark:text-[#f5f5f5] leading-[18px] flex flex-col gap-2">
        <p>Enter the base URL of your ServiceNow instance, e.g. <span className="font-semibold">example.service-now.com</span>.</p>
        <p>Do not include a path or trailing slash. The connector will append the required API endpoints automatically.</p>
        <p>Make sure your instance is reachable from Microsoft's indexing service and that the API user has the necessary roles.</p>
      </div>
    ),
  },
  {
    id: 'auth-types', title: 'Authentication types', defaultOpen: false,
    content: (
      <div className="text-[12px] text-[#323130] dark:text-[#f5f5f5] leading-[18px] flex flex-col gap-2">
        <p><span className="font-semibold">Basic auth</span> — Authenticate with a ServiceNow username and password. Simple to set up but less secure; rotate credentials regularly.</p>
        <p><span className="font-semibold">OAuth 2.0</span> — Recommended. Uses a client ID and secret to obtain short-lived tokens. Requires an OAuth application record in ServiceNow.</p>
        <p>Credentials are stored encrypted in Microsoft's secure vault and are never exposed in logs.</p>
      </div>
    ),
  },
  {
    id: 'staged-rollout', title: 'Staged rollout', defaultOpen: false,
    content: (
      <div className="text-[12px] text-[#323130] dark:text-[#f5f5f5] leading-[18px] flex flex-col gap-2">
        <p>Limit who can search indexed content by selecting specific users or groups. Useful for piloting the connector before a broad release.</p>
        <p>Leave this field empty to make content available to all users in your organisation.</p>
        <p>Changes to the rollout list take effect on the next sync cycle.</p>
      </div>
    ),
  },
  {
    id: 'troubleshooting', title: 'Troubleshooting', defaultOpen: false,
    content: (
      <div className="text-[12px] text-[#323130] dark:text-[#f5f5f5] leading-[18px] flex flex-col gap-2">
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

const USERS_GUIDANCE_SECTIONS: GuideSection[] = [
  {
    id: 'access-permissions', title: 'Access permissions', defaultOpen: false,
    content: (
      <div className="text-[12px] text-[#323130] dark:text-[#f5f5f5] leading-[18px] flex flex-col gap-2">
        <p><span className="font-semibold">Only people with access to this data source</span> — Respects the access controls already set in ServiceNow. Only users who can see an item in ServiceNow will be able to find it in search results.</p>
        <p><span className="font-semibold">Everyone</span> — All users in your organisation can discover indexed content, regardless of their permissions in ServiceNow. Use this only for publicly available knowledge bases.</p>
      </div>
    ),
  },
  {
    id: 'user-mapping', title: 'User identity mapping', defaultOpen: false,
    content: (
      <div className="text-[12px] text-[#323130] dark:text-[#f5f5f5] leading-[18px] flex flex-col gap-2">
        <p>The connector maps ServiceNow user identities to Azure AD accounts using the <span className="font-semibold">email address</span> field by default.</p>
        <p>If your ServiceNow users have a different primary identifier, update the mapping field to match — for example, <span className="font-semibold">user_name</span> or a custom attribute.</p>
        <p>Unmapped users will not receive personalised results even if ACL-based access is enabled.</p>
      </div>
    ),
  },
  {
    id: 'external-groups', title: 'External groups', defaultOpen: false,
    content: (
      <div className="text-[12px] text-[#323130] dark:text-[#f5f5f5] leading-[18px] flex flex-col gap-2">
        <p>External groups allow you to replicate ServiceNow group memberships in Microsoft Search without syncing the full directory.</p>
        <p>Enable this option if your ServiceNow ACLs use groups. The connector will index group membership alongside content and apply it during search-time access checks.</p>
      </div>
    ),
  },
];

const CONTENT_GUIDANCE_SECTIONS: GuideSection[] = [
  {
    id: 'include-data', title: 'Include data to index', defaultOpen: false,
    content: (
      <div className="text-[12px] text-[#323130] dark:text-[#f5f5f5] leading-[18px] flex flex-col gap-2">
        <p>Use query filters to restrict which records are indexed. For example, index only active knowledge articles in the <span className="font-semibold">HR</span> category.</p>
        <p>Filters follow ServiceNow encoded query syntax. Leave empty to index all accessible records.</p>
        <p>Tip: Start with a narrow filter, validate results, then broaden scope incrementally.</p>
      </div>
    ),
  },
  {
    id: 'manage-properties', title: 'Manage properties', defaultOpen: false,
    content: (
      <div className="text-[12px] text-[#323130] dark:text-[#f5f5f5] leading-[18px] flex flex-col gap-2">
        <p>Properties control which fields from ServiceNow are indexed and surfaced in search results.</p>
        <p>Assign semantic labels — <span className="font-semibold">Title</span>, <span className="font-semibold">URL</span>, <span className="font-semibold">Author</span> — to help Microsoft Search understand the meaning of each field.</p>
        <p>Only properties marked as <span className="font-semibold">Searchable</span> are included in the full-text index. Mark fields as <span className="font-semibold">Retrievable</span> to show them in result cards.</p>
      </div>
    ),
  },
  {
    id: 'result-layout', title: 'Search result layout', defaultOpen: false,
    content: (
      <div className="text-[12px] text-[#323130] dark:text-[#f5f5f5] leading-[18px] flex flex-col gap-2">
        <p>The result layout determines how indexed items appear in Microsoft Search and Copilot responses.</p>
        <p>Choose an adaptive card template or create a custom layout using the <span className="font-semibold">Result Type Designer</span> in the Microsoft 365 admin centre.</p>
      </div>
    ),
  },
];

const SYNC_GUIDANCE_SECTIONS: GuideSection[] = [
  {
    id: 'sync-data-rate', title: 'Sync data rate', defaultOpen: false,
    content: (
      <div className="text-[12px] text-[#323130] dark:text-[#f5f5f5] leading-[18px] flex flex-col gap-2">
        <p>Set the maximum number of requests per minute the connector will make to your data source.</p>
        <p>Match this to your data source subscription limit to avoid throttling. Lower values reduce load on your instance but may slow down syncs.</p>
      </div>
    ),
  },
  {
    id: 'timezone', title: 'Timezone', defaultOpen: false,
    content: (
      <div className="text-[12px] text-[#323130] dark:text-[#f5f5f5] leading-[18px] flex flex-col gap-2">
        <p>Set the timezone to match your ServiceNow instance to ensure accurate change-detection timestamps during incremental syncs.</p>
        <p>A mismatch can cause records to be skipped or re-indexed unnecessarily.</p>
      </div>
    ),
  },
  {
    id: 'full-sync', title: 'Full sync', defaultOpen: false,
    content: (
      <div className="text-[12px] text-[#323130] dark:text-[#f5f5f5] leading-[18px] flex flex-col gap-2">
        <p>A full sync re-indexes every item in the data source from scratch. It ensures the index is fully consistent but uses more resources.</p>
        <p>Schedule full syncs weekly or monthly depending on how frequently your data changes. The first sync is always a full sync.</p>
      </div>
    ),
  },
  {
    id: 'incremental-sync', title: 'Incremental sync', defaultOpen: false,
    content: (
      <div className="text-[12px] text-[#323130] dark:text-[#f5f5f5] leading-[18px] flex flex-col gap-2">
        <p>Incremental syncs only index items that have been created, modified, or deleted since the last sync. They are faster and lighter on both your ServiceNow instance and Microsoft's indexing service.</p>
        <p>Set the frequency based on how time-sensitive your data is — every 15 minutes for high-velocity data, daily for more static content.</p>
      </div>
    ),
  },
];

const TAB_GUIDANCE: Record<string, GuideSection[]> = {
  Setup: GUIDANCE_SECTIONS,
  Users: USERS_GUIDANCE_SECTIONS,
  Content: CONTENT_GUIDANCE_SECTIONS,
  Sync: SYNC_GUIDANCE_SECTIONS,
};

type ConnectionValidationState = 'idle' | 'pending' | 'validating' | 'failed' | 'passed' | 'syncing' | 'reflected';
const VALIDATION_STEPS = CONNECTION_VALIDATION_STEPS;
const VALIDATION_STEP_COMPLETE_LABELS = ['Authentication complete', 'Content preview complete', 'Configuration validation complete'] as const;
const VALIDATION_STEP_FAILED_LABELS = ['Authentication failed', 'Content preview complete', 'Configuration validation complete'] as const;

function InlineGuidance({ sectionId, active }: { sectionId: string; active?: string }) {
  const section = GUIDANCE_SECTIONS.find((s) => s.id === sectionId);
  if (!section?.content || active !== sectionId) return <div />;
  return (
    <div className="bg-[#f0f6ff] dark:bg-[#1a2a3a] border border-[#c7e0f4] dark:border-[#2a4a6a] rounded-[4px] px-3 py-3">
      <p className="text-[11px] font-semibold text-[#0078d4] dark:text-[#479ef5] mb-1.5 uppercase tracking-wide">{section.title}</p>
      {section.content}
    </div>
  );
}

function ConnectorIcon({ src, name, size, rounded = '4px' }: { src?: string | null; name: string; size: number; rounded?: string }) {
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

const SEVERITY_CONFIG: Record<'blocker' | 'warning' | 'suggestion', { label: string; text: string }> = {
  blocker: {
    label: 'Blocker',
    text: 'text-[#a80000] dark:text-[#ffb3b3]',
  },
  warning: {
    label: 'Warning',
    text: 'text-[#8a4300] dark:text-[#ffd7b5]',
  },
  suggestion: {
    label: 'Suggestion',
    text: 'text-[#605e5c] dark:text-[#c8c6c4]',
  },
};

const SOURCE_CONFIG: Record<IssueSource, { label: string; icon: React.ReactNode }> = {
  connector: {
    label: 'Connector',
    icon: <PlugConnectedRegular style={{ fontSize: 12 }} />,
  },
  servicenow: {
    label: 'ServiceNow',
    icon: <img src="/servicenow-logo.svg" alt="ServiceNow" style={{ width: 12, height: 12, objectFit: 'contain' }} />,
  },
  mismatch: {
    label: 'ServiceNow',
    icon: <img src="/servicenow-logo.svg" alt="ServiceNow" style={{ width: 12, height: 12, objectFit: 'contain' }} />,
  },
  unsupported: {
    label: 'Unsupported',
    icon: <ErrorBadgeIcon style={{ fontSize: 12 }} />,
  },
};

const sourceBadgeStyle: React.CSSProperties = {
  fontSize: 10,
  fontWeight: 600,
};

function SourceTag({ source, connectorTab, onNavigate }: { source: IssueSource; connectorTab?: string; onNavigate?: () => void }) {
  if (source === 'connector') {
    return (
      <Badge
        appearance="outline"
        color="informative"
        size="small"
        shape="circular"
        icon={<PlugConnectedRegular style={{ fontSize: 12 }} />}
        onClick={onNavigate ? (event: React.MouseEvent) => { event.stopPropagation(); onNavigate(); } : undefined}
        style={{ ...sourceBadgeStyle, cursor: onNavigate ? 'pointer' : 'default' }}
      >
        {connectorTab ? `${connectorTab} tab` : SOURCE_CONFIG.connector.label}
      </Badge>
    );
  }

  if (source === 'servicenow') {
    return (
      <Badge
        appearance="outline"
        color="informative"
        size="small"
        shape="circular"
        icon={<span style={{ display: 'flex', alignItems: 'center' }}>{SOURCE_CONFIG.servicenow.icon}</span>}
        onClick={onNavigate ? (event: React.MouseEvent) => { event.stopPropagation(); onNavigate(); } : undefined}
        style={{ ...sourceBadgeStyle, cursor: onNavigate ? 'pointer' : 'default' }}
      >
        ServiceNow
      </Badge>
    );
  }

  const cfg = SOURCE_CONFIG[source];

  return (
    <Badge
      appearance="outline"
      color="informative"
      size="small"
      shape="circular"
      icon={<span style={{ display: 'flex', alignItems: 'center' }}>{cfg.icon}</span>}
      style={sourceBadgeStyle}
    >
      {cfg.label}
    </Badge>
  );
}

function GuidanceRail({
  highlightSection,
  accordionRefsCallback,
  sections = GUIDANCE_SECTIONS,
}: {
  highlightSection?: string;
  accordionRefsCallback?: (refs: Record<string, HTMLDivElement | null>) => void;
  sections?: GuideSection[];
}) {
  return (
    <SetupGuideRail
      sections={sections}
      activeSection={highlightSection}
      accordionRefsCallback={accordionRefsCallback}
    />
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
        <div className="bg-[#faf9f8] dark:bg-[#1f1f1f] border border-[#d1d1d1] dark:border-[#3d3d3d] rounded-[8px] p-3 shadow-[0px_2px_4px_rgba(0,0,0,0.14),0px_0px_2px_rgba(0,0,0,0.12)]">
          <p className="text-[12px] font-semibold text-[#242424] dark:text-[#f5f5f5] mb-1">Escalate to ServiceNow Support</p>
          <p className="text-[12px] text-[#616161] dark:text-[#adadad] leading-5 mb-2">Share this diagnostic context with their support team:</p>
          <div className="bg-white dark:bg-[#1f1f1f] border border-[#e1e1e1] dark:border-[#3d3d3d] rounded-[4px] p-2 text-[11px] text-[#323130] dark:text-[#f5f5f5] font-mono leading-4">
            <p>Issue: {issue.title}</p>
            {Object.entries(answers).map(([qId, ans]) => {
              const q = questions.find(q => q.id === qId);
              return q ? <p key={qId}>{q.question.slice(0, 30)}…: {ans}</p> : null;
            })}
          </div>
          <a href="https://support.servicenow.com" target="_blank" rel="noreferrer"
            className="mt-2 flex items-center gap-1 text-[12px] text-[#0078d4] dark:text-[#479ef5] hover:underline">
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
        <p className="text-[12px] text-[#242424] dark:text-[#f5f5f5] leading-5">
          Based on your answers, this is a custom ACL configuration that Microsoft cannot fully replicate.
          The safest workaround is to restrict the connector scope to knowledge bases that use role-based access only.
        </p>
        <div className="flex items-center gap-2 flex-wrap">
          <button className="px-3 py-1.5 text-[12px] font-semibold bg-[#0078d4] dark:bg-[#479ef5] text-white rounded-[4px] hover:bg-[#106ebe] dark:hover:bg-[#62abf5] shadow-[0px_1px_2px_rgba(0,0,0,0.14)]">
            Restrict connector scope
          </button>
          <button onClick={() => setEscalated(true)}
            className="px-3 py-1.5 text-[12px] font-semibold text-[#242424] dark:text-[#f5f5f5] bg-white dark:bg-[#212121] border border-[#d1d1d1] dark:border-[#616161] rounded-[4px] hover:bg-[#f5f5f5] dark:hover:bg-[#3d3d3d] transition-colors shadow-[0px_1px_2px_rgba(0,0,0,0.14)]">
            Escalate to ServiceNow
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-3 flex flex-col gap-2">
      <div className="flex items-center gap-1.5 mb-1">
        <DiagnosticIcon style={{ fontSize: 12 }} className="text-[#0078d4] dark:text-[#479ef5]" />
        <span className="text-[12px] font-semibold text-[#0078d4] dark:text-[#479ef5]">Let&apos;s diagnose this together</span>
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
            className="flex items-center gap-2.5 text-left px-3 py-2 text-[12px] text-[#242424] dark:text-[#f5f5f5] bg-white dark:bg-[#212121] border border-[#d1d1d1] dark:border-[#616161] rounded-[4px] hover:border-[#0078d4] dark:hover:border-[#479ef5] hover:bg-[#f0f6ff] dark:hover:bg-[#1a2a3a] transition-colors shadow-[0px_1px_2px_rgba(0,0,0,0.10)]"
          >
            <span className="w-3.5 h-3.5 rounded-full border-2 border-[#8a8886] flex-shrink-0" />
            {opt.label}
          </button>
        ))}
      </div>
      <p className="text-[10px] text-[#605e5c] dark:text-[#adadad]">Question {step + 1} of {questions.length}</p>
    </div>
  );
}

export function getSyncCycleLabel(detectedAt: string, syncHistory: SyncEvent[]): string {
  const detectedMs = new Date(detectedAt).getTime();
  const sorted = [...syncHistory].sort((a, b) => new Date(a.startedAt).getTime() - new Date(b.startedAt).getTime());
  const match = sorted.find((e) => new Date(e.startedAt).getTime() >= detectedMs) ?? sorted[sorted.length - 1];
  if (!match) return 'Unknown';
  return new Date(match.startedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function IssueCard({ issue, onToggle, detectedSyncLabel, isChecked, onCheck, onDismiss, onFix, unseen }: { issue: DiagnosticIssue; expanded: boolean; onToggle: () => void; onDiagnose?: () => void; detectedSyncLabel?: string; onNavigateToField?: (tab: string, fieldId: string) => void; isChecked?: boolean; onCheck?: () => void; onDismiss?: () => void; onFix?: () => void; unseen?: boolean }) {
  const cfg = SEVERITY_CONFIG[issue.severity];
  const isBlocker = issue.severity === 'blocker' || issue.severity === 'warning';
  const [hovered, setHovered] = useState(false);

  return (
    <Card
      onClick={onToggle}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      appearance="outline"
      style={{
        cursor: 'pointer',
        backgroundColor: '#ffffff',
        transition: 'box-shadow 0.15s',
        boxShadow: hovered ? tokens.shadow8 : undefined,
      }}
    >
      {/* Top row: source tag left, need action badge right */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: tokens.spacingHorizontalS, marginBottom: tokens.spacingVerticalS }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
          {issue.connectorTab && (
            <SourceTag source="connector" connectorTab={issue.connectorTab} />
          )}
          {(!issue.connectorTab || issue.source !== 'connector') && (
            <SourceTag source={issue.source} connectorTab={issue.connectorTab} />
          )}
        </div>
        {isBlocker ? (
          <Badge
            appearance="tint"
            color="danger"
            size="medium"
            shape="circular"
          >
            Needs action
          </Badge>
        ) : (
          <Badge
            appearance="ghost"
            color="warning"
            size="medium"
            shape="circular"
          >
            Suggestion
          </Badge>
        )}
      </div>

      <CardHeader
        header={
          <Text weight="semibold" size={300} style={{ color: '#000000' }}>{issue.title}</Text>
        }
        description={issue.copilotImpact
          ? <Text style={{ fontSize: 14, color: tokens.colorNeutralForeground3, marginTop: tokens.spacingVerticalS }}>{issue.copilotImpact}</Text>
          : undefined}
      />

      <CardFooter>
        <span />
        <Text size={200} style={{ color: tokens.colorNeutralForeground3, marginLeft: 'auto' }}>{detectedSyncLabel ?? '—'}</Text>
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

// ─── Recommended-actions helpers (used inside ActionFocusView) ─────────────────

const ISSUE_ERROR_LOGS: Record<string, string[]> = {
  'setup-edit-authentication-failed': [
    '[Validation] Authentication failed during setup edit flow.',
    '[Validation] Connector creation blocked until credentials are re-authenticated.',
    '[Validation] Action required: Update credentials in Setup and retry connection creation.',
  ],
  'setup-edit-content-filetype-semantic-label': [
    '[Validation] Content property mapping check failed during setup edit flow.',
    '[Validation] Property "Filetype" is missing a semantic label required for correct indexing.',
    '[Validation] Action required: Add the correct semantic label from the source in Manage properties.',
  ],
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
  'sn-usermapping': [
    '[2026-03-17 06:02:20] User sync initiated — 312 accounts fetched from ServiceNow',
    '[2026-03-17 06:02:20] Mapping formula: userPrincipalName → sys_user.email',
    '[2026-03-17 06:02:21] WARNING: 47 accounts failed mapping — email domain mismatch (vendor/*.ext.contoso.com)',
    '[2026-03-17 06:02:21] 47 users excluded from connector results — no matching Entra ID identity found',
  ],
  'sn-throttle': [
    '[2026-03-17 06:02:35] Sync initiated — requesting knowledge articles from ServiceNow',
    '[2026-03-17 06:02:35] GET /api/now/table/kb_knowledge?sysparm_limit=500 → 429 Too Many Requests',
    '[2026-03-17 06:02:35] Retry-After: 60s — throttle limit enforced by ServiceNow instance',
    '[2026-03-17 06:02:35] Only 274 of estimated 4,800 articles indexed before throttle cut-off',
  ],
};

function RecommendedActionsTable({ actions, onNavigateToField, onAnyApplied, appliedRowsControlled, onAppliedRowsChange, isSuggestion, onSync }: {
  actions: RecommendedAction[];
  onNavigateToField?: (tab: string, fieldId: string) => void;
  onAnyApplied?: (anyApplied: boolean) => void;
  appliedRowsControlled?: Set<string>;
  onAppliedRowsChange?: (rows: Set<string>) => void;
  isSuggestion?: boolean;
  onSync?: () => void;
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

  const { getRows, selection: { isRowSelected } } = useTableFeatures(
    { columns, items: actions, getRowId: (item) => item.id },
    [useTableSelection({
      selectionMode: 'single',
      selectedItems: expandedRows,
      onSelectionChange: (_e, data) => setExpandedRows(data.selectedItems as Set<string>),
    })]
  );

  const rows = getRows((row) => {
    const hasSteps = !!(row.item.steps && row.item.steps.length > 0);
    const selected = isRowSelected(row.rowId);
    return {
      ...row,
      onClick: (e: React.MouseEvent) => {
        if (!hasSteps) return;
        e.preventDefault();
        setExpandedRows(selected ? new Set() : new Set([String(row.rowId)]));
      },
      onKeyDown: (e: React.KeyboardEvent) => {
        if (!hasSteps) return;
        if (e.key === ' ' || e.key === 'Enter') {
          e.preventDefault();
          setExpandedRows(selected ? new Set() : new Set([String(row.rowId)]));
        }
      },
      selected,
      appearance: (selected ? 'brand' : 'none') as 'brand' | 'none',
    };
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: tokens.spacingVerticalS }}>
      <Table aria-label="Recommended actions" style={{ minWidth: '100%' }}>
      <TableBody>
        {rows.map(({ item, selected, onClick, onKeyDown, appearance }) => {
          const isApplied = appliedRows.has(item.id);
          const hasSteps = !!(item.steps && item.steps.length > 0);
          const isExpanded = hasSteps && selected;
          const badgeTab = item.steps?.find((step) => step.tab)?.tab;
          const showServiceNowBadge = item.where === 'servicenow';

          return (
            <React.Fragment key={item.id}>
              <TableRow
                onClick={onClick}
                onKeyDown={onKeyDown}
                aria-selected={selected}
                appearance={appearance}
                style={{ cursor: hasSteps ? 'pointer' : 'default' }}
              >
                <TableCell style={item.recommended ? { paddingTop: 12, paddingBottom: 16 } : { paddingTop: 12, paddingBottom: 12 }}>
                  <TableCellLayout truncate>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4, overflow: 'visible', flex: 1 }}>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 6, width: '100%' }}>
                        {(badgeTab || showServiceNowBadge) && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                        {badgeTab && (
                          <Badge
                            appearance="outline"
                            color="informative"
                            size="medium"
                            shape="circular"
                            icon={badgeTab === 'ServiceNow'
                              ? <span style={{ display: 'flex', alignItems: 'center' }}>{SOURCE_CONFIG.servicenow.icon}</span>
                              : <PlugConnectedRegular style={{ fontSize: 12 }} />}
                            style={sourceBadgeStyle}
                          >
                            {badgeTab === 'ServiceNow' ? 'ServiceNow' : `${badgeTab} tab`}
                          </Badge>
                        )}
                        {showServiceNowBadge && badgeTab !== 'ServiceNow' && (
                          <Badge
                            appearance="outline"
                            color="informative"
                            size="medium"
                            shape="circular"
                            icon={<span style={{ display: 'flex', alignItems: 'center' }}>{SOURCE_CONFIG.servicenow.icon}</span>}
                            style={sourceBadgeStyle}
                          >
                            ServiceNow
                          </Badge>
                        )}
                          </div>
                        )}
                        <Text size={300} weight="semibold" style={{ color: tokens.colorNeutralForeground1, flex: 1, minWidth: 0 }}>{item.label}</Text>
                      </div>
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
                  <TableCell colSpan={2} style={{ padding: '12px 0 20px 4px' }}>
                    <TableCellLayout>
                      <div className={slideInClass} style={{ display: 'flex', flexDirection: 'column', gap: tokens.spacingVerticalL }}>
                        {item.steps!.map((step, i) => {
                          const isNavigable = !!(step.tab && step.fieldId && onNavigateToField);
                          const stepApplied = isApplied && step.executable;
                          const stepCopy = step.description ?? step.label;
                          return (
                            <div key={i} style={{ display: 'flex', gap: tokens.spacingHorizontalM, alignItems: 'flex-start' }}>
                              <span style={{ flexShrink: 0, width: 20, height: 20, borderRadius: '50%', background: tokens.colorNeutralBackground3, display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 2 }}>
                                <Text size={100} weight="semibold" style={{ color: tokens.colorNeutralForeground2 }}>{i + 1}</Text>
                              </span>
                              <div style={{ flex: 1 }}>
                                {step.executable ? (
                                  stepApplied ? (
                                    <Text size={300} weight="semibold" style={{ color: tokens.colorPaletteGreenForeground2 }}>{step.confirmationMessage ?? step.label}</Text>
                                  ) : (
                                    <button onClick={(e) => { e.stopPropagation(); setAppliedRows(s => new Set(s).add(item.id)); }} style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', textAlign: 'left' }}>
                                      <Text size={300}>{stepCopy}</Text>
                                    </button>
                                  )
                                ) : isNavigable ? (
                                  <button onClick={(e) => { e.stopPropagation(); onNavigateToField!(step.tab!, step.fieldId!); }} style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', textAlign: 'left' }}>
                                    <Text size={300} style={{ color: tokens.colorBrandForeground1, textDecoration: 'underline' }}>{stepCopy}</Text>
                                  </button>
                                ) : (
                                  <Text size={300}>{stepCopy}</Text>
                                )}
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
    </div>
  );
}

function useIssueErrorLog(issueId: string) {
  const logs = ISSUE_ERROR_LOGS[issueId];
  const hasLogs = !!(logs && logs.length > 0);
  return { logs, hasLogs };
}

function ActionFocusView({ issue, onBack, detectedSyncLabel, onNavigateToField, currentIndex, total, onPrev, onNext, isResolved, appliedRows, onAppliedRowsChange, onGoToResolved, style }: {
  issue: DiagnosticIssue; onBack: () => void; detectedSyncLabel?: string;
  onNavigateToField?: (tab: string, fieldId: string) => void;
  currentIndex?: number; total?: number; onPrev?: () => void; onNext?: () => void;
  isResolved?: boolean;
  appliedRows?: Set<string>;
  onAppliedRowsChange?: (rows: Set<string>) => void;
  onGoToResolved?: () => void;
  style?: React.CSSProperties;
}) {
  const cfg = SEVERITY_CONFIG[issue.severity];
  const isBlocker = issue.severity === 'blocker' || issue.severity === 'warning';
  const [anyActionApplied, setAnyActionApplied] = React.useState(false);
  const actionTakenThisSession = React.useRef(false);
  const handleAnyActionApplied = (val: boolean) => {
    if (val) actionTakenThisSession.current = true;
    setAnyActionApplied(val);
  };
  const errorLog = useIssueErrorLog(issue.id);
  const handleDownloadErrorLog = React.useCallback(() => {
    if (!errorLog.logs || errorLog.logs.length === 0) return;
    const content = errorLog.logs.join('\n');
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${issue.id}-error-log.txt`;
    link.click();
    URL.revokeObjectURL(url);
  }, [errorLog.logs, issue.id]);
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
    <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', background: '#ffffff', ...style }}>
      {/* Command strip */}
      <div style={{ flexShrink: 0, height: 48, padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: tokens.spacingHorizontalXS }}>
          <ActionButton
            ariaLabel="Back"
            iconProps={{ iconName: 'Back' }}
            onClick={onBack}
            styles={{ root: { minWidth: 0, padding: '0 8px', height: 28 } }}
          />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: tokens.spacingHorizontalXS }}>
          <ActionButton
            ariaLabel="Previous issue"
            iconProps={{ iconName: 'Up' }}
            onClick={onPrev}
            disabled={!onPrev}
            styles={{ root: { minWidth: 0, padding: '0 8px', height: 28 } }}
          />
          <ActionButton
            ariaLabel="Next issue"
            iconProps={{ iconName: 'Down' }}
            onClick={onNext}
            disabled={!onNext}
            styles={{ root: { minWidth: 0, padding: '0 8px', height: 28 } }}
          />
          {(isResolved || (appliedRows && appliedRows.size > 0)) && (
            <Text size={100} style={{ color: tokens.colorNeutralForeground4, cursor: onGoToResolved ? 'pointer' : 'default', textDecoration: onGoToResolved ? 'underline' : 'none', marginLeft: 6 }} onClick={onGoToResolved}>Resolved</Text>
          )}
        </div>
      </div>

      {/* Scrollable body */}
      <div data-action-focus-body="true" ref={(el) => { if (el) el.scrollTop = 0; }} key={issue.id} style={{ flex: 1, minHeight: 0, overflowY: 'auto' }}>
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100%', boxSizing: 'border-box', padding: '8px 24px 32px' }}>

          {/* Status row: Need action */}
          <div style={{ display: 'flex', alignItems: 'center', gap: tokens.spacingHorizontalS, marginBottom: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: tokens.spacingHorizontalS }}>
              <Badge appearance="tint" color={isBlocker ? 'danger' : 'warning'} size="medium" shape="circular">
                {isBlocker ? 'Needs action' : 'Suggestion'}
              </Badge>
            </div>
          </div>

          {/* Title */}
          <Text as="h2" style={{ fontSize: 20, fontWeight: 700, lineHeight: '28px', margin: '0 0 12px' }}>{issue.title}</Text>

          <Text size={200} style={{ color: tokens.colorNeutralForeground3, display: 'block', marginBottom: 12 }}>{detectedSyncLabel ?? '—'}</Text>

          {/* Description */}
          <Text size={300} style={{ color: tokens.colorNeutralForeground2, lineHeight: '22px', display: 'block', marginBottom: 32 }}>{issue.description}</Text>

          {/* Recommended actions */}
          {issue.recommendedActions && issue.recommendedActions.length > 0 && (
            <div key={issue.id} className={slideInClass} style={{ marginBottom: 0 }}>
              <RecommendedActionsTable actions={issue.recommendedActions} onNavigateToField={onNavigateToField} onAnyApplied={handleAnyActionApplied} appliedRowsControlled={appliedRows} onAppliedRowsChange={onAppliedRowsChange} isSuggestion={issue.severity === 'suggestion'} onSync={() => {}} />
            </div>
          )}

          {/* Footer */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginTop: 'auto', paddingTop: 24, alignItems: 'flex-start' }}>

            {/* Direct log download action — for blockers, at the bottom */}
            {isBlocker && (
              <div style={{ width: '100%' }}>
                <ActionButton
                  onRenderIcon={() => <DownloadIcon style={{ fontSize: 16 }} />}
                  text="Download error log"
                  onClick={handleDownloadErrorLog}
                  disabled={!errorLog.hasLogs}
                />
              </div>
            )}

            <ActionButton
              onRenderIcon={() => <ChatEmptyRegular style={{ fontSize: 16 }} />}
              text="Raise a support ticket"
              onClick={() => window.open('https://support.microsoft.com/en-us/contactus', '_blank', 'noopener,noreferrer')}
            />
          </div>

        </div>
      </div>{/* end scrollable body */}

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
        className="flex items-center gap-1.5 text-[13px] text-[#0078d4] dark:text-[#479ef5] hover:underline mb-5 w-fit"
      >
        <NavigateBackIcon style={{ fontSize: 14 }} />
        Actions
      </button>

      {/* Issue identity */}
      <div className="flex flex-col gap-2 mb-5 pb-5 border-b border-[#e1e1e1] dark:border-[#3d3d3d]">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`text-[10px] font-bold uppercase tracking-wide flex-shrink-0 ${cfg.text}`}>{cfg.label}</span>
            <SourceTag source={issue.source} connectorTab={issue.connectorTab} onNavigate={handleNavigate} />
          </div>
          <span className="text-[10px] text-[#a19f9d] dark:text-[#707070] flex-shrink-0 whitespace-nowrap">Detected on {detectedSyncLabel ?? '—'}</span>
        </div>
        <h2 className="text-[15px] font-semibold text-[#242424] dark:text-[#f5f5f5] leading-5">{issue.title}</h2>
        <p className="text-[12px] text-[#616161] dark:text-[#adadad] leading-5">{issue.description}</p>
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

export function SyncHealthChart({ connector }: { connector: Connector }) {
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
      <span className="text-[11px] font-semibold text-[#323130] dark:text-[#f5f5f5]">Health trend</span>

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
          { color: '#c87e00', label: 'Needs attention' },
          { color: '#a80000', label: 'Fix' },
        ].map((l) => (
          <div key={l.label} className="flex items-center gap-2">
            <svg width="12" height="12" viewBox="0 0 12 12">
              <rect x="0" y="0" width="12" height="12" rx="2" fill={l.color} />
            </svg>
            <span className="text-[12px] text-[#323130] dark:text-[#f5f5f5]" style={{ fontFamily: "'Segoe UI', sans-serif" }}>{l.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ConnectorStatusCard({ connector }: { connector: Connector }) {
  const [trendOpen, setTrendOpen] = useState(false);
  const activeIssues = connector.issues.filter((i) => !i.resolvedAt);
  const blockerIssues = activeIssues.filter((i) => i.severity === 'blocker' || i.severity === 'warning');
  const suggestionIssues = activeIssues.filter((i) => i.severity === 'suggestion');

  return (
    <div>
      {blockerIssues.length === 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <Badge appearance="filled" color="success" size="medium" shape="circular" style={{ alignSelf: 'flex-start', textTransform: 'uppercase', fontSize: 10, fontWeight: 700, letterSpacing: '0.05em' }}>Healthy</Badge>
          <Text weight="semibold" size={400}>No issues detected</Text>
          <ActionStats blockers={0} suggestions={suggestionIssues.length} />
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: tokens.spacingHorizontalS }}>
            <Badge appearance="filled" color="danger" size="medium" shape="circular" style={{ textTransform: 'uppercase', fontSize: 10, fontWeight: 700, letterSpacing: '0.05em', flexShrink: 0 }}>Action required</Badge>
            <Text weight="semibold" size={400}>Syncing blocked</Text>
          </div>
          <div style={{ display: 'flex', alignItems: 'stretch', gap: tokens.spacingHorizontalXL }}>
            <ChartHoverCard Legend={`Blocker${blockerIssues.length !== 1 ? 's' : ''}`} YValue={blockerIssues.length} color={tokens.colorPaletteRedBackground3} styles={{ calloutContentRoot: { background: 'transparent', boxShadow: 'none', border: 'none' } }} />
            {suggestionIssues.length > 0 && <ChartHoverCard Legend={`Suggestion${suggestionIssues.length !== 1 ? 's' : ''}`} YValue={suggestionIssues.length} color={tokens.colorPaletteMarigoldBackground3} styles={{ calloutContentRoot: { background: 'transparent', boxShadow: 'none', border: 'none' } }} />}
          </div>
        </div>
      )}
    </div>
  );
}

export function ActionStats({ blockers, suggestions }: { blockers: number; suggestions: number }) {
  return (
    <div style={{ display: 'flex', alignItems: 'stretch', gap: 24 }}>
      <ChartHoverCard Legend={`Blocker${blockers !== 1 ? 's' : ''}`} YValue={blockers} color={blockers > 0 ? '#a80000' : '#c8c6c4'} styles={{ calloutContentRoot: { background: 'transparent', boxShadow: 'none', border: 'none' } }} />
      <ChartHoverCard Legend={`Suggestion${suggestions !== 1 ? 's' : ''}`} YValue={suggestions} color={suggestions > 0 ? '#c87e00' : '#c8c6c4'} styles={{ calloutContentRoot: { background: 'transparent', boxShadow: 'none', border: 'none' } }} />
    </div>
  );
}

export function ActionRail({ connector, onNavigateToField, onFocusedChange, backTrigger, appliedRowsMap, setAppliedRowsMap, validationIssue }: { connector: Connector; onNavigateToField?: (tab: string, fieldId: string) => void; onFocusedChange?: (focused: boolean) => void; backTrigger?: number; appliedRowsMap: Map<string, Set<string>>; setAppliedRowsMap: React.Dispatch<React.SetStateAction<Map<string, Set<string>>>>; validationIssue?: DiagnosticIssue }) {
  const [openId, setOpenId] = useState<string | null>(null);
  const [trendOpen, setTrendOpen] = useState(false);
  const [diagnosing, setDiagnosing] = useState<DiagnosticIssue | null>(null);
  const [activeFilter, setActiveFilter] = useState<'todo'>('todo');
  const [fixModeActive, setFixModeActive] = useState(false);
  const [fixStep, setFixStep] = useState(0);
  // Checklist state
  const [checkedIds, setCheckedIds] = useState<Set<string>>(new Set());
  const [syncedIds, setSyncedIds] = useState<Set<string>>(new Set());
  const [seenIds, setSeenIds] = useState<Set<string>>(new Set());
  const [syncDialogOpen, setSyncDialogOpen] = useState(false);
  const [syncState, setSyncState] = useState<'idle' | 'saving' | 'validating' | 'syncing'>('idle');
  const [syncElapsed, setSyncElapsed] = useState(0);
  const [syncCurrentIssueId, setSyncCurrentIssueId] = useState<string | null>(null);
  const [syncCompletedCount, setSyncCompletedCount] = useState(0);
  const [syncTotalCount, setSyncTotalCount] = useState(0);
  const syncStartRef = React.useRef<number>(0);
  const syncTargetIds = React.useRef<string[]>([]);
  const syncTimersRef = React.useRef<number[]>([]);

  const clearSyncTimers = React.useCallback(() => {
    syncTimersRef.current.forEach((id) => window.clearTimeout(id));
    syncTimersRef.current = [];
  }, []);

  const getDetectedLabel = React.useCallback((issue: DiagnosticIssue) => {
    if (issue.id.startsWith('setup-edit-')) {
      const detected = new Date(issue.detectedAt);
      if (!Number.isNaN(detected.getTime())) {
        return detected.toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true,
        });
      }
    }
    return getSyncCycleLabel(issue.detectedAt, connector.syncHistory);
  }, [connector.syncHistory]);

  React.useEffect(() => {
    return () => clearSyncTimers();
  }, [clearSyncTimers]);

  const runSyncIssue = React.useCallback((ids: string[], index: number) => {
    if (index >= ids.length) {
      setSyncState('idle');
      setSyncCurrentIssueId(null);
      setSyncCompletedCount(ids.length);
      setActiveFilter('todo');
      return;
    }

    const issueId = ids[index];
    setSyncCurrentIssueId(issueId);
    syncStartRef.current = Date.now();
    setSyncState('validating');

    const validateTimer = window.setTimeout(() => {
      setSyncState('syncing');
      syncStartRef.current = Date.now();

      const syncTimer = window.setTimeout(() => {
        setSyncedIds(prev => {
          const n = new Set(prev);
          n.add(issueId);
          return n;
        });
        setSyncCompletedCount(index + 1);
        runSyncIssue(ids, index + 1);
      }, 1500);

      syncTimersRef.current.push(syncTimer);
    }, 1500);

    syncTimersRef.current.push(validateTimer);
  }, []);

  const handleSyncIssues = (ids: string[]) => {
    clearSyncTimers();
    syncTargetIds.current = ids;
    setSyncState('saving');
    setSyncElapsed(0);
    setSyncCurrentIssueId(null);
    setSyncCompletedCount(0);
    setSyncTotalCount(ids.length);

    const saveTimer = window.setTimeout(() => {
      runSyncIssue(ids, 0);
    }, 1000);

    syncTimersRef.current.push(saveTimer);
  };

  useEffect(() => {
    if (syncState !== 'syncing' && syncState !== 'validating') return;
    const id = setInterval(() => setSyncElapsed(Math.floor((Date.now() - syncStartRef.current) / 1000)), 1000);
    return () => clearInterval(id);
  }, [syncState]);
  const formatSyncElapsed = (s: number) => {
    const m = Math.floor(s / 60); const sec = s % 60;
    if (m > 0) return `${m}m ${sec}s`;
    return `${sec}s`;
  };
  // Dismissed suggestions
  const [dismissedIds, setDismissedIds] = useState<Set<string>>(new Set());
  // Focused issue view
  const [focusedAction, setFocusedAction] = useState<DiagnosticIssue | null>(null);
  const setFocused = (issue: DiagnosticIssue | null) => {
    setFocusedAction(issue);
    onFocusedChange?.(issue !== null);
    if (issue) setSeenIds(prev => { const n = new Set(prev); n.add(issue.id); return n; });
  };
  React.useEffect(() => { if (backTrigger) { setFocused(null); } }, [backTrigger]);

  if (diagnosing) {
    return <DiagnosticDrillDown issue={diagnosing} onBack={() => setDiagnosing(null)} detectedSyncLabel={getDetectedLabel(diagnosing)} onNavigateToField={onNavigateToField} />;
  }

  if (focusedAction) {
    const allIssues = connector.issues.filter((i) => !i.resolvedAt);
    const focusedIdx = allIssues.findIndex((i) => i.id === focusedAction.id);
    const focusedIsResolved = (focusedAction.severity === 'blocker' || focusedAction.severity === 'warning') ? checkedIds.has(focusedAction.id) : dismissedIds.has(focusedAction.id);
    const unresolvedIssues = allIssues.filter((i) =>
      !checkedIds.has(i.id) && !dismissedIds.has(i.id) && (appliedRowsMap.get(i.id)?.size ?? 0) === 0
    );
    const focusedUnresolvedIdx = unresolvedIssues.findIndex((i) => i.id === focusedAction.id);
    const navigateTo = (issue: DiagnosticIssue) => {
      setFocused(issue);
      if (issue.connectorTab && issue.connectorFieldId && onNavigateToField) {
        onNavigateToField(issue.connectorTab, issue.connectorFieldId);
      }
    };
    return (
      <ActionFocusView
        style={{ position: 'absolute', inset: 0 }}
        issue={focusedAction}
        onBack={() => setFocused(null)}
        detectedSyncLabel={getDetectedLabel(focusedAction)}
        onNavigateToField={onNavigateToField}
        currentIndex={focusedUnresolvedIdx >= 0 ? focusedUnresolvedIdx : focusedIdx}
        total={unresolvedIssues.length}
        onPrev={focusedIdx > 0 ? () => navigateTo(allIssues[focusedIdx - 1]) : undefined}
        onNext={focusedIdx < allIssues.length - 1 ? () => navigateTo(allIssues[focusedIdx + 1]) : undefined}
        isResolved={focusedIsResolved}
        appliedRows={appliedRowsMap.get(focusedAction.id) ?? new Set()}
        onAppliedRowsChange={(rows) => setAppliedRowsMap(m => { const n = new Map(m); n.set(focusedAction.id, rows); return n; })}
        onGoToResolved={() => { setFocused(null); }}
      />
    );
  }

  const connectorIssues = connector.issues.filter((i) => !i.resolvedAt && !syncedIds.has(i.id));
  const activeIssues = validationIssue ? [validationIssue, ...connectorIssues] : connectorIssues;
  const isFixed = (i: DiagnosticIssue) =>
    (i.severity === 'blocker' || i.severity === 'warning')
      ? checkedIds.has(i.id) || (appliedRowsMap.get(i.id)?.size ?? 0) > 0
      : dismissedIds.has(i.id) || (appliedRowsMap.get(i.id)?.size ?? 0) > 0;

  const notStarted = activeIssues.filter(i => !isFixed(i)).sort((a, b) => a.rank - b.rank);
  const pendingSync = activeIssues.filter(i => isFixed(i)).sort((a, b) => a.rank - b.rank);

  const resolvedIssues = activeIssues.filter(isFixed);
  const unresolvedIssues = notStarted;

  const blockerIssues = activeIssues.filter((i) => i.severity === 'blocker' || i.severity === 'warning');
  const suggestionIssues = activeIssues.filter((i) => i.severity === 'suggestion');
  const uncheckedBlockers = blockerIssues.filter((i) => !isFixed(i));
  const checkedCount = resolvedIssues.length;
  const totalIssuesCount = activeIssues.length;



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
      if (next.has(id)) next.delete(id); else { next.add(id); }
      return next;
    });
  };

  const allFixed = totalIssuesCount > 0 && notStarted.length === 0 && pendingSync.length === 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>

      {/* Healthy state */}
      {blockerIssues.length === 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <Badge appearance="filled" color="success" size="medium" shape="circular" style={{ alignSelf: 'flex-start', textTransform: 'uppercase', fontSize: 10, fontWeight: 700, letterSpacing: '0.05em' }}>Healthy</Badge>
            <Text weight="semibold" size={400}>No issues detected</Text>
            <ActionStats blockers={0} suggestions={0} />
          </div>
      )}

      {/* Issues section */}
      {activeIssues.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column' }}>

          {/* Group filter pills */}
          <div style={{ display: 'flex', alignItems: 'center', gap: tokens.spacingHorizontalS, marginBottom: 24 }}>
            {([
              { key: 'todo', label: 'Needs action', count: notStarted.length },
            ] as const).map((pill) => (
              <ToggleButton
                key={pill.key}
                shape="circular"
                size="small"
                checked={activeFilter === pill.key}
                onClick={() => setActiveFilter('todo')}
                icon={pill.count > 0 ? (
                  <span style={{
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    width: 18, height: 18, borderRadius: '50%', fontSize: 10, fontWeight: 700,
                    backgroundColor: activeFilter === pill.key ? 'rgba(0,0,0,0.08)' : tokens.colorNeutralBackground3,
                    color: tokens.colorNeutralForeground2,
                  }}>{pill.count}</span>
                ) : undefined}
              >
                {pill.label}
              </ToggleButton>
            ))}
          </div>


          {/* Not started */}
          {(activeFilter === 'todo') && notStarted.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: tokens.spacingVerticalS }}>
              <div className="flex flex-col gap-3">
                {notStarted.map((issue) => {
                  const isBlocker = issue.severity === 'blocker' || issue.severity === 'warning';
                  return (
                    <IssueCard
                      key={issue.id}
                      issue={issue}
                      expanded={false}
                      onToggle={() => { setFocused(issue); if (issue.connectorTab && issue.connectorFieldId && onNavigateToField) onNavigateToField(issue.connectorTab, issue.connectorFieldId); }}
                      onDiagnose={() => setDiagnosing(issue)}
                      detectedSyncLabel={getDetectedLabel(issue)}
                      onNavigateToField={onNavigateToField}
                      isChecked={false}
                      unseen={!seenIds.has(issue.id)}
                      onCheck={isBlocker && !issue.recommendedActions?.length ? () => toggleChecked(issue.id) : undefined}
                      onDismiss={!isBlocker && !issue.recommendedActions?.length ? () => setDismissedIds((p) => { const n = new Set(p); n.add(issue.id); return n; }) : undefined}
                      onFix={isBlocker ? () => { setFixModeActive(true); setFixStep(blockerIssues.indexOf(issue)); navigateTo(issue); } : undefined}
                    />
                  );
                })}
              </div>
            </div>
          )}

          {/* Fixed, pending sync */}
          {pendingSync.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: tokens.spacingVerticalS }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Text size={200} weight="semibold" style={{ color: tokens.colorNeutralForeground3, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Fixed, pending sync · {pendingSync.length}
                </Text>
                <Button
                  onClick={() => handleSyncIssues(pendingSync.map(i => i.id))}
                  disabled={syncState !== 'idle'}
                  style={{ minWidth: 0, height: 26, padding: '0 10px', fontSize: 12 }}
                >
                  {syncState === 'saving'
                    ? 'Saving changes...'
                    : syncState === 'validating'
                      ? `Validating ${Math.min(syncCompletedCount + 1, syncTotalCount)} of ${syncTotalCount} — ${formatSyncElapsed(syncElapsed)}`
                      : syncState === 'syncing'
                        ? `Syncing ${Math.min(syncCompletedCount + 1, syncTotalCount)} of ${syncTotalCount} — ${formatSyncElapsed(syncElapsed)}`
                        : `Sync ${pendingSync.length} fix${pendingSync.length !== 1 ? 'es' : ''}`}
                </Button>
              </div>
              {syncState !== 'idle' && syncCurrentIssueId && (
                <Text size={200} style={{ color: tokens.colorNeutralForeground3 }}>
                  {syncState === 'validating' ? 'Validating action:' : syncState === 'syncing' ? 'Syncing action:' : 'Preparing action:'} {pendingSync.find((i) => i.id === syncCurrentIssueId)?.title ?? syncCurrentIssueId}
                </Text>
              )}
              <div className="flex flex-col gap-3">
                {pendingSync.map((issue) => (
                  <IssueCard
                    key={issue.id}
                    issue={issue}
                    expanded={false}
                    onToggle={() => { setFocused(issue); }}
                    onDiagnose={() => setDiagnosing(issue)}
                    detectedSyncLabel={getSyncCycleLabel(issue.detectedAt, connector.syncHistory)}
                    onNavigateToField={onNavigateToField}
                    isChecked={true}
                  />
                ))}
              </div>
            </div>
          )}


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
          <Button appearance="primary" onClick={() => setSyncDialogOpen(false)}>Sync now</Button>
          <Button onClick={() => setSyncDialogOpen(false)}>Cancel</Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
}

// ─── Users tab ────────────────────────────────────────────────────────────────

function CollapsibleSection({ title, children, defaultOpen = true, open, onOpenChange }: { title: string; children: React.ReactNode; defaultOpen?: boolean; open?: boolean; onOpenChange?: (open: boolean) => void }) {
  const isDark = typeof window !== 'undefined' && document.documentElement.classList.contains('dark');
  const isControlled = open !== undefined;
  return (
    <FluentProvider theme={isDark ? webDarkTheme : webLightTheme} style={{ background: 'transparent' }}>
      <Accordion
        collapsible
        {...(isControlled
          ? { openItems: open ? ['item'] : [], onToggle: () => onOpenChange?.(!open) }
          : { defaultOpenItems: defaultOpen ? ['item'] : [] }
        )}
        style={{ borderTop: '1px solid var(--colorNeutralStroke2)', marginBottom: tokens.spacingVerticalXL }}
      >
        <AccordionItem value="item">
          <AccordionHeader expandIconPosition="end" size="large">
            {title}
          </AccordionHeader>
          <AccordionPanel style={{ paddingTop: tokens.spacingVerticalM, paddingBottom: tokens.spacingVerticalXXL, paddingLeft: tokens.spacingHorizontalL, paddingRight: tokens.spacingHorizontalL, marginLeft: 0 }}>
            {children}
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    </FluentProvider>
  );
}

function UsersTabContent({ fieldHighlight, fieldRefs, onFocusSection, focusFieldId }: { fieldHighlight?: string; fieldRefs?: React.MutableRefObject<Record<string, HTMLDivElement | null>>; onFocusSection?: (id: string) => void; focusFieldId?: string }) {
  const [accessType, setAccessType] = useState<'acl' | 'everyone'>('acl');
  const [openSection, setOpenSection] = useState<string>(focusFieldId === 'user-mapping' ? 'user-mapping' : 'access-permissions');
  const prevFocusFieldId = React.useRef(focusFieldId);
  React.useEffect(() => {
    if (focusFieldId && focusFieldId !== prevFocusFieldId.current) {
      prevFocusFieldId.current = focusFieldId;
      if (focusFieldId === 'user-mapping') setOpenSection('user-mapping');
      else if (focusFieldId === 'access-permissions') setOpenSection('access-permissions');
    }
  }, [focusFieldId]);
  const isDark = typeof window !== 'undefined' && document.documentElement.classList.contains('dark');
  const labelClr = isDark ? '#f5f5f5' : '#323130';
  const descClr = isDark ? '#c8c6c4' : '#605e5c';
  return (
    <div className="max-w-[528px] flex flex-col">
      {/* Access Permissions */}
      <div ref={(el) => { if (fieldRefs) fieldRefs.current['access-permissions'] = el; }} className={`transition-colors duration-500 rounded-[4px] -mx-2 px-2 ${fieldHighlight === 'access-permissions' ? 'bg-[#eff6ff]' : ''}`} onClick={() => onFocusSection?.('access-permissions')}>
      <CollapsibleSection title="Access Permissions" open={openSection === 'access-permissions'} onOpenChange={(o) => setOpenSection(o ? 'access-permissions' : '')}>
        <ChoiceGroup
          selectedKey={accessType}
          options={[
            {
              key: 'acl',
              text: 'Only people with access to this data',
              onRenderLabel: () => (
                <div style={{ paddingLeft: 28 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: tokens.spacingHorizontalS, marginBottom: 2 }}>
                    <span style={{ fontSize: 14, color: labelClr }}>Only people with access to this data</span>
                    <span style={{ padding: '1px 6px', fontSize: 10, fontWeight: 600, color: '#107c10', background: '#f0f7ec', border: '1px solid #c8e0b8', borderRadius: 2, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Recommended</span>
                  </div>
                  <p style={{ fontSize: 13, color: descClr, lineHeight: '20px', margin: 0 }}>Only users in your Access Control List (ACL) will see results from this data source.</p>
                </div>
              ),
            },
            {
              key: 'everyone',
              text: 'Everyone',
              onRenderLabel: () => (
                <div style={{ paddingLeft: 28 }}>
                  <span style={{ fontSize: 14, color: labelClr }}>Everyone</span>
                  <p style={{ fontSize: 13, color: descClr, lineHeight: '20px', margin: '2px 0 0' }}>Everyone in your organisation will see results from this data source.</p>
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
      <div onClick={() => onFocusSection?.('user-mapping')}>
      <CollapsibleSection title="Map Identities" open={openSection === 'user-mapping'} onOpenChange={(o) => setOpenSection(o ? 'user-mapping' : '')}>
        <div className="flex flex-col gap-3">
          <p className="text-[13px] text-[#323130] dark:text-[#f5f5f5] leading-5">
            We have mapped your data source identities using Microsoft Entra IDs. We use both UPN and Mail in Microsoft Entra ID to map to your user&apos;s email in the data source. If you have a different mapping formula, use the custom mapping option below.
          </p>
          <button className="self-start text-[13px] text-[#0078d4] dark:text-[#479ef5] hover:underline">
            Add custom mapping
          </button>
        </div>
      </CollapsibleSection>
      </div>
    </div>
  );
}

// ─── Content tab ──────────────────────────────────────────────────────────────

const PROPERTIES = [
  { name: 'OrderDescription', tag: 'Content', semanticLabel: 'Title', description: 'Lorem ipsum is simply dummy text of the printing and t...' },
  { name: 'Order_URL', semanticLabel: 'URL', description: '-' },
  { name: 'Last_modified_by', semanticLabel: 'Last modified', description: '-' },
  { name: 'Order_initiator', semanticLabel: 'Author', description: 'Lorem ipsum is simply dummy text of the printing and t...' },
  { name: 'CreatedDateTime', semanticLabel: 'Created by', description: '-' },
  { name: 'ModifiedDateTime', semanticLabel: 'Last modified', description: '-' },
  { name: 'Order_description', semanticLabel: '-', description: '-' },
];

function ContentTabContent({ fieldHighlight, fieldRefs, onFocusSection }: { fieldHighlight?: string; fieldRefs?: React.MutableRefObject<Record<string, HTMLDivElement | null>>; onFocusSection?: (id: string) => void }) {
  const isDark = typeof window !== 'undefined' && document.documentElement.classList.contains('dark');
  return (
    <div className="max-w-[640px] flex flex-col">
      {/* Include data */}
      <div ref={(el) => { if (fieldRefs) fieldRefs.current['include-data'] = el; }} className={`transition-colors duration-500 rounded-[4px] -mx-2 px-2 ${fieldHighlight === 'include-data' ? 'bg-[#eff6ff]' : ''}`} onClick={() => onFocusSection?.('include-data')}>
      <CollapsibleSection title="Include data which you want to index" defaultOpen={false}>
        <p className="text-[13px] text-[#605e5c] dark:text-[#c8c6c4] leading-5">Configure which data from this source should be indexed by Microsoft Search and Copilot.</p>
      </CollapsibleSection>
      </div>

      {/* Manage Properties */}
      <div onClick={() => onFocusSection?.('manage-properties')}>
      <CollapsibleSection title="Manage Properties" defaultOpen={true}>
        {/* Content Property */}
        <div style={{ marginBottom: 28 }}>
          <Dropdown
            label="Content Property"
            placeholder="Description"
            options={[
              { key: 'description', text: 'Description' },
              { key: 'body', text: 'Body' },
              { key: 'content', text: 'Content' },
              { key: 'summary', text: 'Summary' },
            ]}
            styles={{ root: { width: '100%' }, label: { fontWeight: 600, fontSize: 13 } }}
          />
        </div>

        {/* Toolbar */}
        <CommandBar
          items={[
            {
              key: 'add',
              text: 'Add property',
              iconProps: { iconName: 'Add' },
              style: { fontSize: 13 },
              buttonStyles: isDark ? { root: { backgroundColor: '#292929', color: '#f5f5f5' }, label: { color: '#f5f5f5' }, icon: { color: '#f5f5f5' }, rootHovered: { backgroundColor: '#3d3d3d' } } : {},
            },
          ]}
          farItems={[
            {
              key: 'count',
              text: `${PROPERTIES.length} items`,
              disabled: true,
              buttonStyles: { root: { fontSize: 12, color: isDark ? '#adadad' : '#605e5c', cursor: 'default', backgroundColor: isDark ? '#212121' : 'transparent' }, rootDisabled: { background: isDark ? '#212121' : 'transparent', color: isDark ? '#adadad' : '#605e5c' } },
            },
          ]}
          styles={{ root: { padding: 0, marginBottom: 8, height: 36, backgroundColor: isDark ? '#212121' : '#ffffff' }, primarySet: { alignItems: 'center', backgroundColor: isDark ? '#212121' : '#ffffff' }, secondarySet: { backgroundColor: isDark ? '#212121' : '#ffffff' } }}
        />

        {/* Table */}
        <FluentProvider theme={typeof window !== 'undefined' && document.documentElement.classList.contains('dark') ? webDarkTheme : webLightTheme} style={{ background: 'transparent' }}>
          <Table size="small" style={{ width: '100%' }}>
            <TableBody>
              {/* Header row */}
              <TableRow style={{ borderBottom: `1px solid ${tokens.colorNeutralStroke2}` }}>
                <TableCell style={{ width: 200, fontWeight: 600, fontSize: 12, color: tokens.colorNeutralForeground1 }}>Properties</TableCell>
                <TableCell style={{ width: 140, fontWeight: 600, fontSize: 12, color: tokens.colorNeutralForeground1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: tokens.spacingHorizontalXS }}>
                    Semantic Label
                    <InfoIcon style={{ fontSize: 12, color: tokens.colorNeutralForeground3 }} />
                  </div>
                </TableCell>
                <TableCell style={{ fontWeight: 600, fontSize: 12, color: tokens.colorNeutralForeground1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: tokens.spacingHorizontalXS }}>
                    Description
                    <InfoIcon style={{ fontSize: 12, color: tokens.colorNeutralForeground3 }} />
                  </div>
                </TableCell>
                <TableCell style={{ textAlign: 'right' }}>
                  <button className="flex items-center gap-1 text-[12px] text-[#0078d4] dark:text-[#479ef5] hover:underline ml-auto">
                    Show all columns
                  </button>
                </TableCell>
              </TableRow>
              {PROPERTIES.map((prop) => (
                <TableRow key={prop.name}>
                  <TableCell style={{ width: 200 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ fontSize: 13, color: tokens.colorNeutralForeground1 }}>{prop.name}</span>
                      {prop.tag && (
                        <Badge appearance="tint" color="brand" size="small" style={{ fontSize: 10, fontWeight: 600 }}>{prop.tag}</Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell style={{ width: 140, fontSize: 13, color: tokens.colorNeutralForeground1 }}>{prop.semanticLabel}</TableCell>
                  <TableCell style={{ fontSize: 13, color: tokens.colorNeutralForeground3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 200 }}>{prop.description}</TableCell>
                  <TableCell />
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </FluentProvider>
      </CollapsibleSection>
      </div>
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


function SyncTabContent({ fieldHighlight, fieldRefs, onFocusSection }: { fieldHighlight?: string; fieldRefs?: React.MutableRefObject<Record<string, HTMLDivElement | null>>; onFocusSection?: (id: string) => void }) {
  const [timezone, setTimezone] = useState('(UTC-08:00) Pacific Time (US & Canada)');
  const [incrementalOn, setIncrementalOn] = useState(true);
  const [incRecurrence, setIncRecurrence] = useState('Day');
  const [incRunOnce, setIncRunOnce] = useState(false);
  const [incFreq, setIncFreq] = useState('15 minutes');
  const [fullRecurrence, setFullRecurrence] = useState('Week');
  const [syncDataRate, setSyncDataRate] = useState('25');

  return (
    <div className="max-w-[528px] flex flex-col gap-6">
      {/* Sync data rate */}
      <div ref={(el) => { if (fieldRefs) fieldRefs.current['sync-data-rate'] = el; }} className={`transition-colors duration-500 rounded-[4px] -mx-2 px-2 ${fieldHighlight === 'sync-data-rate' ? 'bg-[#eff6ff]' : ''}`} onClick={() => onFocusSection?.('sync-data-rate')}>
        <div style={{ paddingLeft: tokens.spacingHorizontalL, paddingRight: tokens.spacingHorizontalL }}>
          <TextField
            label="Sync data rate"
            value={syncDataRate}
            onChange={(_, v) => setSyncDataRate(v ?? '')}
            onFocus={() => onFocusSection?.('sync-data-rate')}
            suffix="/ min"
            styles={{ root: { maxWidth: 200 }, fieldGroup: { width: 140 } }}
            type="number"          />
        </div>
      </div>

      {/* Time zone */}
      <div style={{ marginBottom: tokens.spacingVerticalS, paddingLeft: tokens.spacingHorizontalL, paddingRight: tokens.spacingHorizontalL }}>
        <Dropdown
          label="Time zone"
          selectedKey={timezone}
          options={TIMEZONES.map(tz => ({ key: tz, text: tz }))}
          onChange={(_, opt) => { if (opt) setTimezone(opt.key as string); }}
          onFocus={() => onFocusSection?.('timezone')}
          styles={{ root: { width: '100%' } }}
        />
      </div>

      {/* Full sync */}
      <div>
        <CollapsibleSection title="Full sync" defaultOpen={true}>
          <div className="flex flex-col gap-4" onClick={() => onFocusSection?.('full-sync')}>
            <Dropdown
              label="Recurrence"
              selectedKey={fullRecurrence}
              options={['Day', 'Week', 'Month'].map(v => ({ key: v, text: `Every ${v}` }))}
              onChange={(_, opt) => { if (opt) setFullRecurrence(opt.key as string); }}
              onFocus={() => onFocusSection?.('full-sync')}
              styles={{ root: { width: '100%' } }}
            />
            <button className="text-[14px] text-[#0078d4] dark:text-[#479ef5] hover:underline text-left w-fit">Add day(s)</button>
            <button className="text-[14px] text-[#0078d4] dark:text-[#479ef5] hover:underline text-left w-fit">Add starting time</button>
          </div>
        </CollapsibleSection>
      </div>

      {/* Incremental sync */}
      <div ref={(el) => { if (fieldRefs) fieldRefs.current["sync-frequency"] = el; }} className={`transition-colors duration-500 rounded-[4px] -mx-2 px-2 ${fieldHighlight === 'sync-frequency' ? 'bg-[#eff6ff]' : ''}`}>
        <CollapsibleSection title="Incremental sync" defaultOpen={false}>
          <div className="flex flex-col gap-4" onClick={() => onFocusSection?.('incremental-sync')}>
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
                  onFocus={() => onFocusSection?.('incremental-sync')}
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
                  onFocus={() => onFocusSection?.('incremental-sync')}
                  styles={{ root: { width: '100%' } }}
                />
                <button className="text-[14px] text-[#0078d4] dark:text-[#479ef5] hover:underline text-left w-fit">Add starting time</button>
              </>
            )}
          </div>
        </CollapsibleSection>
      </div>
    </div>
  );
}

// ─── Main drawer ──────────────────────────────────────────────────────────────

interface AdvancedSetupPanelProps {
  connectorType?: string;
  existingConnector?: Connector;
  onClose: () => void;
  onSwitchToSimple?: () => void;
  initialFieldFocus?: { tab: string; fieldId: string };
  embedded?: boolean;
}

const AUTH_OPTIONS = [
  { value: 'basic', label: 'Basic Auth' },
  { value: 'oauth2', label: 'OAuth 2.0' },
];

const SETUP_TABS = ['Setup', 'Users', 'Content', 'Sync'] as const;
type SetupTab = typeof SETUP_TABS[number];

export default function AdvancedSetupPanel({ connectorType, existingConnector, onClose, onSwitchToSimple, initialFieldFocus, embedded }: AdvancedSetupPanelProps) {
  const isEdit = !!existingConnector;
  const isSetupEditFlow = existingConnector?.id?.startsWith('setup-edit-') ?? false;
  const [showSetupEditRail, setShowSetupEditRail] = useState(false);
  const isRailEditMode = isEdit || showSetupEditRail;
  const isEffectiveSetupEditFlow = isSetupEditFlow || showSetupEditRail;
  const [typeName, setTypeName] = useState(existingConnector?.connectorType ?? connectorType ?? 'ServiceNow Knowledge');

  // Resolve logo from gallery catalog when no existingConnector logo available
  const catalogItem = CONNECTOR_CATALOG.find(
    (c) => c.name.toLowerCase() === (existingConnector?.connectorType ?? connectorType ?? '').toLowerCase()
  );
  const resolvedLogoUrl = existingConnector?.logoUrl ?? catalogItem?.logoUrl;
  const [activeTab, setActiveTab] = useState<SetupTab>('Setup');
  const [rightRailTab, setRightRailTab] = useState<'actions' | 'guide'>(isRailEditMode ? 'actions' : 'guide');
  const MIN_CONTENT = 520;
  const MIN_RAIL = 280;
  const RAIL_THRESHOLD = MIN_CONTENT + MIN_RAIL; // 800px
  const panelRef = React.useRef<HTMLDivElement>(null);
  const [railOpen, setRailOpen] = useState(false);
  const [panelWide, setPanelWide] = useState(false);
  useEffect(() => {
    const el = panelRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      const wide = entry.contentRect.width >= RAIL_THRESHOLD;
      setPanelWide(wide);
      setRailOpen(r => wide ? true : r);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const [actionFocused, setHealthFocused] = useState(false);
  const [actionBackTrigger, setHealthBackTrigger] = useState(0);
  // Recommended action applied rows — lifted here so form field edits can auto-apply matching actions
  const [appliedRowsMap, setAppliedRowsMap] = useState<Map<string, Set<string>>>(new Map());
  const [initialLoading, setInitialLoading] = useState(!!embedded);
  React.useEffect(() => {
    if (!embedded) return;
    const t = setTimeout(() => setInitialLoading(false), 600);
    return () => clearTimeout(t);
  }, []);

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
    setRightRailTab('actions');
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

  // Auto-focus a specific field on open (e.g. from Authenticate CTA)
  React.useEffect(() => {
    if (initialFieldFocus) {
      setTimeout(() => handleNavigateToField(initialFieldFocus.tab, initialFieldFocus.fieldId), 300);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
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
  const [authMethod, setAuthMethod] = useState<AuthMethod>(isEffectiveSetupEditFlow ? 'oauth2' : (existingConnector?.authMethod ?? 'none'));
  const [basicUsername, setBasicUsername] = useState(existingConnector?.basicUsername ?? '');
  const [basicPassword, setBasicPassword] = useState(existingConnector?.basicPassword ?? '');
  const [clientId, setClientId] = useState('');
  const [clientSecret, setClientSecret] = useState('');
  const [authorizing, setAuthorizing] = useState(false);
  const credentialsUsernameRef = React.useRef<HTMLInputElement>(null);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const allPeople = [
    { value: 'alex-johnson', name: 'Alex Johnson' },
    { value: 'maria-garcia', name: 'Maria Garcia' },
    { value: 'it-pilot-group', name: 'IT Pilot Group' },
  ];
  const [selectedPeople, setSelectedPeople] = useState<string[]>(isEdit ? ['alex-johnson', 'maria-garcia', 'it-pilot-group'] : []);
  const [managementTeamPeople, setManagementTeamPeople] = useState<string[]>(isEdit ? ['alex-johnson'] : []);
  const [notifyPeople, setNotifyPeople] = useState<string[]>(isEdit ? ['alex-johnson'] : []);
  const [rolloutLimited, setRolloutLimited] = useState(isEdit);
  const [hasChanges, setHasChanges] = useState(false);
  const [creating, setCreating] = useState(false);
  const [created, setCreated] = useState(false);
  const [createProgressStep, setCreateProgressStep] = useState(0);
  const [syncingConfirm, setSyncingConfirm] = useState(false);
  const [syncCompleted, setSyncCompleted] = useState(false);
  const [validationState, setValidationState] = useState<ConnectionValidationState>(isEdit ? 'reflected' : 'idle');
  const [validationStepIndex, setValidationStepIndex] = useState<number>(-1);
  const [validationElapsedSeconds, setValidationElapsedSeconds] = useState<number>(0);
  const [validationCompletedAt, setValidationCompletedAt] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [validationHasErrors, setValidationHasErrors] = useState(false);
  const [validationFailureSequenceStep, setValidationFailureSequenceStep] = useState(0);
  const [configVersion, setConfigVersion] = useState(1);
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(null);
  const [lastReflectedAt, setLastReflectedAt] = useState<string | null>(existingConnector?.lastSyncAt ?? null);
  const validationTimeoutsRef = React.useRef<Array<ReturnType<typeof setTimeout>>>([]);
  const validationStartedAtRef = React.useRef<number | null>(null);
  const shouldShowActionableErrors = catalogItem?.showActionableErrorsOnValidationFailure ?? false;

  const clearValidationTimers = React.useCallback(() => {
    validationTimeoutsRef.current.forEach((t) => clearTimeout(t));
    validationTimeoutsRef.current = [];
  }, []);

  const validationStillActive = createProgressStep <= 3 || validationHasErrors;

  // Setup-edit validation issues (shown in Actions rail when in setup-edit flow)
  const [setupEditValidationIssue, setupEditContentIssue] = React.useMemo(
    () => createSetupEditIssues(validationCompletedAt),
    [validationCompletedAt],
  );

  const setupEditRailConnector = React.useMemo<Connector>(() => ({
    id: `setup-edit-${catalogItem?.id ?? 'connector'}`,
    displayName,
    connectorType: typeName,
    logoUrl: resolvedLogoUrl,
    userCriteriaType: userCriteria,
    instanceUrl,
    authMethod: (authMethod ?? 'none') as Connector['authMethod'],
    basicUsername,
    basicPassword,
    healthStatus: 'error',
    blockerCount: 2,
    warningCount: 0,
    suggestionCount: 0,
    issues: [setupEditValidationIssue, setupEditContentIssue],
    guideSteps: [],
    syncHistory: [],
    createdAt: new Date().toISOString(),
    userCreated: true,
  }), [authMethod, basicPassword, basicUsername, catalogItem?.id, displayName, instanceUrl, resolvedLogoUrl, setupEditContentIssue, setupEditValidationIssue, typeName, userCriteria]);

  // Enhanced connector for ActionRail - includes setup-edit issues when in setup-edit flow
  const connectorForRail = React.useMemo<Connector | undefined>(() => {
    if (!existingConnector) {
      return showSetupEditRail ? setupEditRailConnector : undefined;
    }
    if (!isEffectiveSetupEditFlow) return existingConnector;
    
    return {
      ...existingConnector,
      issues: [setupEditValidationIssue, setupEditContentIssue, ...existingConnector.issues.filter((i) => !i.id.startsWith('setup-edit-'))],
      blockerCount: 2,
    };
  }, [existingConnector, isEffectiveSetupEditFlow, setupEditContentIssue, setupEditRailConnector, setupEditValidationIssue, showSetupEditRail]);

  const railActionCount = connectorForRail
    ? (isEffectiveSetupEditFlow ? 2 : 0) + connectorForRail.issues.filter((i) => !i.resolvedAt && !i.id.startsWith('setup-edit-')).length
    : 0;
  const isReturnedSetupEditMode = showSetupEditRail && !isEdit;
  const shouldShowSetupEditDualButtons = isReturnedSetupEditMode || isSetupEditFlow;
  const primaryFooterLabel = shouldShowSetupEditDualButtons
    ? 'Create'
    : isEdit
      ? 'Save'
      : 'Create';

  React.useEffect(() => () => clearValidationTimers(), [clearValidationTimers]);

  React.useEffect(() => {
    if (validationState !== 'validating' || validationStartedAtRef.current === null) return;
    const id = setInterval(() => {
      const startedAt = validationStartedAtRef.current;
      if (startedAt === null) return;
      setValidationElapsedSeconds(Math.floor((Date.now() - startedAt) / 1000));
    }, 1000);
    return () => clearInterval(id);
  }, [validationState]);

  function markChanged() {
    setHasChanges(true);
    setValidationState('pending');
    setValidationError(null);
    setValidationHasErrors(false);
    setValidationFailureSequenceStep(0);
  }

  const runValidationAndSync = React.useCallback((syncAfterValidation: boolean) => {
    clearValidationTimers();
    setValidationState('validating');
    setValidationCompletedAt(null);
    setValidationError(null);
    setValidationHasErrors(false);
    setValidationFailureSequenceStep(0);
    setValidationStepIndex(0);
    validationStartedAtRef.current = Date.now();
    setValidationElapsedSeconds(0);

    const shouldFailAuth = authMethod === 'basic' && (
      basicUsername.toLowerCase().includes('invalid') ||
      basicUsername.toLowerCase().includes('fail') ||
      basicPassword.toLowerCase().includes('invalid') ||
      basicPassword.toLowerCase().includes('fail')
    );

    const t1 = setTimeout(() => {
      setValidationStepIndex(1);
    }, 1600);
    const t2 = setTimeout(() => {
      setValidationStepIndex(2);
    }, 3200);
    const t3 = setTimeout(() => {
      if (!isEdit && shouldShowActionableErrors) {
        setValidationHasErrors(true);
        setValidationFailureSequenceStep(0);

        const t4 = setTimeout(() => {
          setValidationFailureSequenceStep(1);
        }, 1400);
        const t5 = setTimeout(() => {
          setValidationFailureSequenceStep(2);
        }, 2800);
        const t6 = setTimeout(() => {
          setValidationFailureSequenceStep(3);
          setValidationState('failed');
          setValidationError('Validation issues found');
          setValidationCompletedAt(new Date().toISOString());
        }, 4200);

        validationTimeoutsRef.current.push(t4, t5, t6);
        return;
      }

      if (shouldFailAuth) {
        setValidationHasErrors(true);
        setValidationFailureSequenceStep(3);
        setValidationStepIndex(0);
        setValidationState('failed');
        setValidationError('401 Unauthorized');
        return;
      }
      setValidationState('passed');
      setValidationCompletedAt(new Date().toISOString());
      if (!syncAfterValidation) return;
      const t4 = setTimeout(() => {
        setValidationState('syncing');
      }, 400);
      const t5 = setTimeout(() => {
        setValidationState('reflected');
        setLastReflectedAt(new Date().toISOString());
      }, 2400);
      validationTimeoutsRef.current.push(t4, t5);
    }, 5000);

    validationTimeoutsRef.current.push(t1, t2, t3);
  }, [authMethod, basicPassword, basicUsername, clearValidationTimers, isEdit, shouldShowActionableErrors]);

  const runCreateConfirmationSequence = React.useCallback(() => {
    clearValidationTimers();
    setCreating(false);
    setCreated(false);
    setCreateProgressStep(1);
    setValidationCompletedAt(null);
    setValidationError(null);
    setValidationState('idle');
    setValidationStepIndex(-1);
    setValidationHasErrors(false);
    setValidationFailureSequenceStep(0);

    const t1 = setTimeout(() => setCreateProgressStep(2), 1400);
    const t2 = setTimeout(() => setCreateProgressStep(3), 2800);

    if (shouldShowActionableErrors) {
      const t3 = setTimeout(() => {
        setValidationHasErrors(true);
        setValidationFailureSequenceStep(0);
      }, 1400);
      const t4 = setTimeout(() => {
        setValidationFailureSequenceStep(1);
      }, 2800);
      const t5 = setTimeout(() => {
        setValidationFailureSequenceStep(2);
      }, 4200);
      const t6 = setTimeout(() => {
        setValidationFailureSequenceStep(3);
        setValidationState('failed');
        setValidationError('Validation issues found');
        setValidationCompletedAt(new Date().toISOString());
      }, 5600);

      validationTimeoutsRef.current.push(t1, t2, t3, t4, t5, t6);
      return;
    }

    const t3 = setTimeout(() => {
      setValidationCompletedAt(new Date().toISOString());
      setCreateProgressStep(4);
    }, 4200);
    const t4 = setTimeout(() => {
      setCreateProgressStep(5);
    }, 4600);
    const t5 = setTimeout(() => {
      setCreateProgressStep(6);
      setCreated(true);
    }, 5000);

    validationTimeoutsRef.current.push(t1, t2, t3, t4, t5);
  }, [clearValidationTimers, shouldShowActionableErrors]);

  const handleSaveEdits = React.useCallback((syncAfterSave: boolean) => {
    if (isEdit) {
      if (!hasChanges && !syncAfterSave && validationState !== 'failed') return;
      if (hasChanges) {
        setConfigVersion((v) => v + 1);
        setLastSavedAt(new Date().toISOString());
      }
      setHasChanges(false);
      setValidationState('pending');
      if (syncAfterSave) {
        setSyncingConfirm(true);
        setSyncCompleted(false);
        setTimeout(() => {
          runValidationAndSync(true);
        }, 300);
      }
      return;
    }

    // For new connector creation, show validation confirmation screen
    setSyncingConfirm(true);
    setSyncCompleted(false);
    runCreateConfirmationSequence();
  }, [hasChanges, isEdit, runCreateConfirmationSequence, runValidationAndSync, validationState]);

  const handleSaveSetupEdit = React.useCallback(() => {
    if (!shouldShowSetupEditDualButtons || !hasChanges) return;
    setConfigVersion((v) => v + 1);
    setLastSavedAt(new Date().toISOString());
    setHasChanges(false);
    setValidationState('pending');
  }, [hasChanges, shouldShowSetupEditDualButtons]);

  const handleCreateSetupEdit = React.useCallback(() => {
    if (!shouldShowSetupEditDualButtons || !hasChanges) return;
    setSyncingConfirm(true);
    setSyncCompleted(false);
    runCreateConfirmationSequence();
  }, [hasChanges, runCreateConfirmationSequence, shouldShowSetupEditDualButtons]);

  React.useEffect(() => {
    if (syncingConfirm && validationState === 'reflected') {
      setSyncCompleted(true);
    }
  }, [syncingConfirm, validationState]);

  const validationIssue = React.useMemo<DiagnosticIssue | undefined>(() => {
    if (validationState !== 'failed') return undefined;
    return {
      id: 'validation-auth-failed',
      rank: 0,
      severity: 'blocker',
      source: 'connector',
      title: 'Auth validation failed',
      description: 'We could not validate credentials for the latest saved changes. Sync is blocked until this is fixed.',
      technicalDetail: validationError ?? undefined,
      detectedAt: new Date().toISOString(),
      connectorTab: 'Setup',
      connectorFieldId: 'auth-credentials',
      recommendedActions: [
        {
          id: 'fix-auth-validation',
          label: 'Fix credentials in Setup',
          where: 'connector',
          recommended: true,
          steps: [
            { label: 'Open Setup tab and update username/password.', tab: 'Setup', fieldId: 'auth-credentials' },
            { label: 'Save and sync again to rerun validation.' },
          ],
        },
      ],
    };
  }, [validationError, validationState]);

  const canSyncNow = isEdit && (hasChanges || validationState === 'pending' || validationState === 'failed' || validationState === 'passed');
  const showValidationProgress = isEdit && (validationState === 'validating' || validationState === 'syncing');
  const activeValidationIndex = validationState === 'syncing' ? VALIDATION_STEPS.length : Math.max(0, validationStepIndex);
  const validationProgressValue = validationState === 'syncing' ? 1 : Math.min(1, (activeValidationIndex + 1) / VALIDATION_STEPS.length);

  const canCreate = sourceName.trim().length > 0 && displayName.trim().length > 0 &&
    instanceUrl.trim().length > 0 && authMethod !== 'none' && privacyAccepted;

  const isDarkMode = typeof window !== 'undefined' && document.documentElement.classList.contains('dark');

  const formatValidationElapsed = React.useCallback((seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }, []);

  const calculateValidationRemaining = React.useCallback(() => {
    if (validationState !== 'validating') return null;

    if (validationElapsedSeconds < 1) {
      return `${VALIDATION_STEPS.length} mins remaining`;
    }

    const stepsCompleted = Math.max(1, validationStepIndex + 1);
    const avgSecondsPerStep = Math.ceil(validationElapsedSeconds / stepsCompleted);
    const remainingSteps = Math.max(0, VALIDATION_STEPS.length - stepsCompleted);
    const estimatedRemainingSeconds = remainingSteps * avgSecondsPerStep;
    const mins = Math.max(1, Math.ceil(estimatedRemainingSeconds / 60));

    return `${mins} min${mins > 1 ? 's' : ''} remaining`;
  }, [validationState, validationElapsedSeconds, validationStepIndex]);

  const formatValidationCompletedAt = React.useCallback((value: string | null) => {
    if (!value) return null;
    const completedAt = new Date(value);
    if (Number.isNaN(completedAt.getTime())) return null;
    const timePart = completedAt.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
    const datePart = completedAt.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
    return `Completed at ${timePart}, ${datePart}`;
  }, []);

  const formatValidationTimestamp = React.useCallback((value: string | null) => {
    if (!value) return null;
    const completedAt = new Date(value);
    if (Number.isNaN(completedAt.getTime())) return null;
    const timePart = completedAt.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
    const datePart = completedAt.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
    return `${timePart}, ${datePart}`;
  }, []);

  const confirmationSteps = React.useMemo<ConnectionConfirmationStep[]>(() => {
    if (!isEdit && shouldShowActionableErrors) {
      const failureStage = validationHasErrors ? validationFailureSequenceStep : 0;
      const activeStep = createProgressStep >= 1 && createProgressStep <= 3 ? createProgressStep - 1 : -1;
      const failureActiveStep = validationHasErrors && validationFailureSequenceStep < 3
        ? validationFailureSequenceStep
        : -1;

      return CONNECTION_VALIDATION_STEPS.map((step, idx) => {
        const isCompleted = validationHasErrors
          ? (idx === 1 && failureStage >= 2)
          : (createProgressStep >= 4 || idx < activeStep);
        const isActive = validationHasErrors
          ? ((idx === 0 && failureStage === 0) || (idx === 1 && failureStage === 1) || (idx === 2 && failureStage === 2))
          : ((idx === activeStep && !validationHasErrors) || idx === failureActiveStep);
        const isFailed = validationHasErrors
          ? ((idx === 0 && failureStage >= 1) || (idx === 2 && failureStage >= 3))
          : false;

        let label: string = step;
        if (isFailed && idx === 0) {
          label = 'Test authentication failed';
        } else if (isFailed && idx === 2) {
          label = 'Configuration validation failed';
        } else if (isCompleted) {
          label = idx === 0 ? 'Authentication complete' : idx === 1 ? 'Content preview complete' : 'Configuration validation complete';
        }

        return {
          key: step,
          label,
          status: isFailed ? 'error' : isActive ? 'active' : isCompleted ? 'success' : 'idle',
        };
      });
    }

    return CONNECTION_VALIDATION_STEPS.map((step, idx) => {
      const isCurrentStep = validationState === 'validating' && idx === validationStepIndex;
      const isCompleted = validationState === 'passed' || validationState === 'syncing' || validationState === 'reflected'
        ? true
        : validationState === 'failed'
          ? idx === 1
          : validationState === 'validating' && idx < validationStepIndex;
      const isFailed = validationState === 'failed' && (idx === 0 || idx === 2);

      let label: string = step;
      if (isFailed && idx === 0) {
        label = 'Test authentication failed';
      } else if (isFailed && idx === 2) {
        label = 'Configuration validation failed';
      } else if (isCompleted) {
        label = idx === 0 ? 'Authentication complete' : idx === 1 ? 'Content preview complete' : 'Configuration validation complete';
      }

      return {
        key: step,
        label,
        status: isFailed ? 'error' : isCurrentStep ? 'active' : isCompleted ? 'success' : 'idle',
      };
    });
  }, [createProgressStep, isEdit, shouldShowActionableErrors, validationFailureSequenceStep, validationHasErrors, validationState, validationStepIndex]);

  const createConfirmationMeta = React.useMemo(() => {
    if (validationHasErrors) {
      if (shouldShowActionableErrors && validationFailureSequenceStep < 3) {
        return '8 Mins remaining...';
      }

      return '';
    }

    if (createProgressStep >= 4) {
      return formatValidationCompletedAt(validationCompletedAt) ?? 'Completed';
    }

    if (createProgressStep >= 1 && createProgressStep <= 3) {
      return '8 Mins remaining...';
    }

    return 'Validation has not started';
  }, [createProgressStep, formatValidationCompletedAt, shouldShowActionableErrors, validationCompletedAt, validationFailureSequenceStep, validationHasErrors]);

  const createConfirmationHelper = ((createProgressStep >= 1 && createProgressStep <= 3 && !validationHasErrors) || (validationHasErrors && shouldShowActionableErrors && validationFailureSequenceStep < 3))
    ? 'Validation running in the background. You may close this panel.'
    : null;

  const content = (
    <DrawerBody
      style={{
        padding: 0,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        flex: 1,
      }}
    >
      {syncingConfirm ? (
          <ConnectionConfirmationView
            title={isEdit ? 'Save & sync changes' : 'Creating connection'}
            actionLabel={isEdit ? 'Saving changes' : 'Creating connection'}
            displayName={displayName}
            connectorName={typeName}
            logoUrl={resolvedLogoUrl}
            isDarkMode={isDarkMode}
            containerClassName={slideInClass}
            actionStatus={isEdit
              ? (validationState === 'passed' ? 'active' : validationState === 'syncing' || validationState === 'reflected' ? 'success' : syncCompleted ? 'success' : 'idle')
              : (createProgressStep === 4 && !validationHasErrors ? 'active' : createProgressStep >= 5 && !validationHasErrors ? 'success' : created ? 'success' : 'idle')}
            actionDimmed={isEdit ? (validationState === 'validating' || validationState === 'failed') : (validationStillActive && createProgressStep < 5)}
            validationStatus={isEdit
              ? (validationState === 'failed' ? 'error' : validationState === 'validating' ? 'active' : validationState === 'passed' || validationState === 'syncing' || validationState === 'reflected' ? 'success' : 'idle')
              : (validationHasErrors && shouldShowActionableErrors && validationFailureSequenceStep < 3 ? 'active' : validationHasErrors ? 'error' : createProgressStep >= 1 && createProgressStep <= 3 ? 'active' : createProgressStep >= 4 ? 'success' : 'idle')}
            validationSteps={confirmationSteps}
            validationMetaText={isEdit
              ? (validationState === 'failed' ? null : (validationState === 'validating' || validationState === 'passed') ? (validationCompletedAt ? formatValidationCompletedAt(validationCompletedAt) : '8 Mins remaining...') : null)
              : createConfirmationMeta}
            validationHelperText={isEdit ? (validationState === 'validating' ? 'Validation running in the background. You may close this panel.' : null) : createConfirmationHelper}
            validationFooterContent={!isEdit && validationHasErrors && (!shouldShowActionableErrors || validationFailureSequenceStep >= 3) ? (
              <div style={{ marginTop: 12, marginBottom: 8, maxWidth: 640 }}>
                {formatValidationTimestamp(validationCompletedAt) && (
                  <span style={{ display: 'block', marginBottom: 8, fontSize: 14, lineHeight: '20px', color: isDarkMode ? '#adadad' : '#484644' }}>
                    {`Validation failed at ${formatValidationTimestamp(validationCompletedAt)}`}
                  </span>
                )}
                <span style={{ display: 'block', marginBottom: 10, fontSize: 13, lineHeight: '18px', color: isDarkMode ? '#adadad' : '#484644' }}>
                  Please check and resolve the validation errors before syncing data.
                </span>
                <Button
                  appearance="primary"
                  onClick={() => {
                    clearValidationTimers();
                    setSyncingConfirm(false);
                    setSyncCompleted(false);
                    setCreating(false);
                    setCreateProgressStep(0);
                    setCreated(false);
                    setShowSetupEditRail(true);
                    setRightRailTab('actions');
                    setHealthFocused(false);
                    setHealthBackTrigger((n) => n + 1);
                    setRailOpen(true);
                    setValidationState('pending');
                    setValidationStepIndex(-1);
                    setValidationError(null);
                    setValidationHasErrors(false);
                    setValidationFailureSequenceStep(0);
                  }}
                  style={isDarkMode ? { background: '#479ef5', color: '#000', border: 'none', fontSize: 13 } : { fontSize: 13 }}
                >Back to edit settings</Button>
              </div>
            ) : undefined}
            syncStatus={isEdit
              ? (validationState === 'failed' ? 'idle' : validationState === 'syncing' || validationState === 'reflected' ? 'active' : 'idle')
              : (validationHasErrors ? 'idle' : createProgressStep >= 5 ? 'active' : 'idle')}
            syncDimmed={isEdit ? (validationState === 'validating' || validationState === 'failed') : (validationStillActive || (createProgressStep >= 4 && createProgressStep < 5))}
            syncText={isEdit
              ? (validationState === 'failed' ? 'Indexing did not start because validation failed.' : 'This may take a while and will continue to run in the background')
              : 'This may take a while and will continue to run in the background'}
            issues={isEdit && validationState === 'failed' && isSetupEditFlow ? [setupEditValidationIssue, setupEditContentIssue] : undefined}
            closeDisabled={isEdit ? validationState === 'validating' : false}
            onClose={() => { setSyncingConfirm(false); setSyncCompleted(false); setCreateProgressStep(0); }}
          />
        ) : creating ? (
          <>
            <div className={`flex-1 overflow-y-auto bg-white dark:bg-[#212121] ${slideInClass}`} style={{ padding: '16px 32px 24px' }}>
              {/* Heading */}
              <div style={{ display: 'flex', alignItems: 'center', gap: tokens.spacingHorizontalS, marginBottom: tokens.spacingVerticalXXL }}>
                <CompletedSolidIcon style={{ fontSize: 20, color: created ? '#107c10' : '#c8c6c4' }} />
                <Text size={500} weight="semibold" style={{ color: isDarkMode ? '#f5f5f5' : '#323130' }}>
                  {created ? 'Success' : 'Creating connection...'}
                </Text>
              </div>
              {/* Rows — no outer border, just dividers */}
              <div style={{ maxWidth: 640 }}>
                {/* Row 1 */}
                <div style={{ display: 'flex', alignItems: 'center', padding: '10px 0', borderBottom: `1px solid ${isDarkMode ? '#3d3d3d' : '#e1e1e1'}` }}>
                  <div style={{ width: 200, display: 'flex', alignItems: 'center', gap: tokens.spacingHorizontalS, flexShrink: 0 }}>
                    <CompletedSolidIcon style={{ fontSize: 20, color: created ? '#107c10' : '#c8c6c4', flexShrink: 0 }} />
                    <Text size={300} style={{ color: isDarkMode ? '#f5f5f5' : '#323130' }}>Saving changes</Text>
                  </div>
                  <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: tokens.spacingHorizontalS }}>
                    <ConnectorIcon src={resolvedLogoUrl} name={typeName} size={20} />
                    <Text size={300} style={{ color: isDarkMode ? '#f5f5f5' : '#323130' }}>{displayName}</Text>
                  </div>
                </div>
              </div>
            </div>
            {/* Footer */}
            <div style={{ borderTop: `1px solid ${isDarkMode ? '#3d3d3d' : '#e1e1e1'}`, padding: '0 32px', height: 64, flexShrink: 0, background: isDarkMode ? '#212121' : '#fff', display: 'flex', alignItems: 'center' }}>
              <Button onClick={onClose}>Done</Button>
            </div>
            <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
          </>
        ) : (
        <>
        {/* Content row: form + in-panel right rail */}
        <div ref={panelRef} className="flex flex-row flex-1 overflow-hidden relative" style={{ minHeight: 0 }}>
        {/* Left column: form + footer */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden" style={{ minHeight: 0, minWidth: 0 }}>
        {/* Form side */}
        <div className="flex-1 bg-white dark:bg-[#212121] flex flex-col min-w-0 overflow-hidden" style={{ minHeight: 0 }}>

          {/* Header */}
          <div className="px-8 pt-8">
            {editingHeader ? (
              /* ── Edit mode ── */
              <div className="flex items-start gap-16 pb-6 mb-6">

                {/* Left: form */}
                <div className="flex flex-col gap-3 flex-shrink-0 w-[380px]">
                  {/* Icon + hint + buttons */}
                  <label className="block text-[12px] font-semibold text-[#323130] dark:text-[#f5f5f5] mb-1">Source icon</label>
                  <div className="flex items-center gap-4">
                    <ConnectorIcon src={editIconPreview ?? resolvedLogoUrl} name={editName || typeName} size={64} />
                    <div className="flex flex-col gap-2">
                      <p className="text-[12px] text-[#605e5c] dark:text-[#adadad]">Min 256×256 px • SVG format preferred</p>
                      <div className="flex items-center gap-2">
                        <label className="flex items-center gap-1.5 h-[32px] px-2 text-[14px] text-[#323130] dark:text-[#f5f5f5] rounded-[2px] hover:bg-[#f3f2f1] dark:hover:bg-[#292929] cursor-pointer transition-colors">
                          <UploadIcon style={{ fontSize: 14 }} />
                          Upload
                          <input type="file" accept="image/png,image/svg+xml,image/jpeg" className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) { const reader = new FileReader(); reader.onload = (ev) => setEditIconPreview(ev.target?.result as string); reader.readAsDataURL(file); }
                            }} />
                        </label>
                        <button onClick={() => setEditIconPreview(null)}
                          className="flex items-center gap-1.5 h-[32px] px-2 text-[14px] text-[#323130] dark:text-[#f5f5f5] rounded-[2px] hover:bg-[#f3f2f1] dark:hover:bg-[#292929] transition-colors">
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
                    <Button
                      appearance="primary"
                      onClick={() => { setTypeName(editName); setEditingHeader(false); setGuidanceHighlight(undefined); markChanged(); }}
                    >
                      Save
                    </Button>
                    <Button
                      onClick={() => { setEditName(existingConnector?.connectorType || typeName); setEditIconPreview(null); setEditingHeader(false); setGuidanceHighlight(undefined); }}
                      style={{ background: 'white', border: '1px solid #8a8886', color: '#323130' }}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>

                {/* Live preview */}
                <div className="flex-shrink-0 w-[220px]">
                  <p className="text-[13px] font-semibold text-[#323130] dark:text-[#f5f5f5] mb-3">Live preview</p>
                  <div className="border border-[#e1e1e1] dark:border-[#3d3d3d] rounded-[4px] bg-[#faf9f8] dark:bg-[#1f1f1f] p-4 flex flex-col gap-3">
                    <div className="self-start flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-[#212121] border border-[#c8c6c4] dark:border-[#616161] rounded-full shadow-[0px_1px_2px_rgba(0,0,0,0.1)]">
                      <span className="text-[13px] text-[#323130] dark:text-[#f5f5f5]">All Sources</span>
                      <ChevronDownIcon style={{ fontSize: 10 }} className="text-[#605e5c] dark:text-[#adadad]" />
                    </div>
                    <div className="flex items-center gap-2.5 px-1">
                      <ConnectorIcon src={editIconPreview ?? resolvedLogoUrl} name={editName || typeName} size={28} rounded="4px" />
                      <span className="text-[14px] text-[#323130] dark:text-[#f5f5f5] truncate">{editName || typeName}</span>
                    </div>
                  </div>
                </div>

              </div>
            ) : (
              /* ── View mode: normal header ── */
              <div className="relative flex items-center gap-5 pb-6">
                <ConnectorIcon src={editIconPreview ?? resolvedLogoUrl} name={typeName} size={72} />
                <div className="flex flex-col gap-1">
                  <h1 className="text-[22px] font-bold text-[#323130] leading-7">{typeName}</h1>
                  {isEdit && displayName ? (
                    <p className="text-[14px] text-[#605e5c]">{displayName}</p>
                  ) : !isEdit && (
                    <p className="text-[14px] text-[#605e5c]">Advanced setup</p>
                  )}
                  <button
                    onClick={() => {
                      setEditName(existingConnector?.connectorType || typeName);
                      setEditIconPreview(null);
                      setEditingHeader(true);
                      if (!suppressGuidanceSwitch.current) { setRightRailTab('guide'); setHealthFocused(false); setHealthBackTrigger(n => n + 1); }
                      setGuidanceHighlight('icon-name');
                    }}
                    className="flex items-center gap-1.5 text-[13px] mt-1 w-fit hover:opacity-80"
                  >
                    <EditIcon style={{ fontSize: 13 }} className="text-[#0078d4]" />
                    <span className="text-[#0078d4]">Edit source name &amp; icon</span>
                  </button>
                </div>
                {!isEdit && onSwitchToSimple && (
                  <button
                    onClick={onSwitchToSimple}
                    className="absolute bottom-0 right-0 flex items-center gap-1.5 px-3 py-1 text-[13px] text-[#424242] rounded hover:bg-[#f3f2f1] transition-colors"
                  >
                    <SettingsIcon style={{ fontSize: 14 }} className="text-[#424242]" />
                    Simple setup
                  </button>
                )}
              </div>
            )}

            {/* Tabs */}
            <div className="flex items-center justify-between mt-2">
              {initialLoading ? (
                <FluentProvider theme={isDarkMode ? webDarkTheme : webLightTheme} style={{ background: 'transparent', display: 'flex', gap: tokens.spacingHorizontalS, alignItems: 'center', height: 44, marginLeft: 0 }}>
                  {SETUP_TABS.map((tab) => (
                    <Skeleton key={tab}><SkeletonItem size={16} style={{ width: tab.length * 8 + 16, borderRadius: 2 }} /></Skeleton>
                  ))}
                </FluentProvider>
              ) : (
                <Pivot
                  selectedKey={activeTab}
                  onLinkClick={(item) => {
                    if (item?.props.itemKey) {
                      setActiveTab(item.props.itemKey as SetupTab);
                      setGuidanceHighlight(undefined);
                      setFieldHighlight(undefined);
                    }
                  }}
                  styles={{
                    root: { marginLeft: -12 },
                    link: { height: 44, padding: '12px', lineHeight: '20px', color: isDarkMode ? '#adadad' : undefined, selectors: { ':hover': { color: isDarkMode ? '#f5f5f5' : undefined, backgroundColor: isDarkMode ? '#2d2d2d' : undefined } } },
                    linkIsSelected: { color: isDarkMode ? '#f5f5f5' : undefined, selectors: { '::before': { backgroundColor: isDarkMode ? '#479ef5' : undefined } } },
                  }}
                >
                  {SETUP_TABS.map((tab) => (
                    <PivotItem key={tab} itemKey={tab} headerText={tab} />
                  ))}
                </Pivot>
              )}
            </div>
          </div>

          {/* Form body */}
          <div ref={formScrollRef} className="flex-1 overflow-y-auto px-8 pt-8 pb-6" onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget as Node)) setGuidanceHighlight(undefined); }}>
            {initialLoading ? (
              <FluentProvider theme={isDarkMode ? webDarkTheme : webLightTheme} style={{ background: 'transparent' }}>
                <div style={{ maxWidth: 480, display: 'flex', flexDirection: 'column', gap: 28 }}>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: tokens.spacingVerticalS }}>
                      <Skeleton><SkeletonItem size={12} style={{ width: '30%' }} /></Skeleton>
                      <Skeleton><SkeletonItem size={32} style={{ width: '100%', borderRadius: 2 }} /></Skeleton>
                    </div>
                  ))}
                </div>
              </FluentProvider>
            ) : null}
            <div key={activeTab} className={slideInClass} style={initialLoading ? { display: 'none' } : {}}>
            {activeTab === 'Users' && <UsersTabContent fieldHighlight={fieldHighlight} fieldRefs={fieldRefs} focusFieldId={fieldHighlight} onFocusSection={(id) => { setGuidanceHighlight(id); if (!suppressGuidanceSwitch.current) { setRightRailTab('guide'); setHealthFocused(false); setHealthBackTrigger(n => n + 1); } }} />}
            {activeTab === 'Content' && <ContentTabContent fieldHighlight={fieldHighlight} fieldRefs={fieldRefs} onFocusSection={(id) => { setGuidanceHighlight(id); if (!suppressGuidanceSwitch.current) { setRightRailTab('guide'); setHealthFocused(false); setHealthBackTrigger(n => n + 1); } }} />}
            {activeTab === 'Sync' && <SyncTabContent fieldHighlight={fieldHighlight} fieldRefs={fieldRefs} onFocusSection={(id) => { setGuidanceHighlight(id); if (!suppressGuidanceSwitch.current) { setRightRailTab('guide'); setHealthFocused(false); setHealthBackTrigger(n => n + 1); } }} />}
            {activeTab !== 'Users' && activeTab !== 'Content' && activeTab !== 'Sync' && <div className="max-w-[528px] flex flex-col gap-6">

              {/* Connection name */}
              <div ref={(el) => { fieldRefs.current['display-name'] = el; }}>
                <p className="text-[14px] font-semibold text-[#323130] mb-1">Enter a unique name to manage this connection</p>
                <TextField
                  label="Connection name"
                  required
                  value={displayName}
                  onChange={(_, v) => { setDisplayName(v ?? ''); setSourceName(v ?? ''); markChanged(); }}
                  onFocus={() => { setGuidanceHighlight('display-name'); if (!suppressGuidanceSwitch.current) { setRightRailTab('guide'); setHealthFocused(false); setHealthBackTrigger(n => n + 1); } }}
                  styles={{ root: { width: '100%' } }}
                />
              </div>

              {/* User criteria — ServiceNow only (not ADO, not Miro) */}
              {typeName !== 'ADO' && catalogItem?.id !== 'miro' && (
                <div ref={(el) => { fieldRefs.current['user-criteria'] = el; }}>
                  <p className="text-[14px] font-semibold text-[#323130] mb-1">User criteria setup in ServiceNow</p>
                  <ChoiceGroup
                    selectedKey={userCriteria}
                    options={[
                      { key: 'simple', text: 'Simple' },
                      { key: 'advanced', text: 'Advanced' },
                    ] as IChoiceGroupOption[]}
                    onChange={(_, opt) => { if (opt) { setUserCriteria(opt.key as UserCriteriaType); markChanged(); setGuidanceHighlight('user-criteria'); if (!suppressGuidanceSwitch.current) { setRightRailTab('guide'); setHealthFocused(false); setHealthBackTrigger(n => n + 1); } } }}
                    styles={{ flexContainer: { display: 'flex', gap: 24 } }}
                  />
                </div>
              )}

              {/* Instance URL / Miro Company ID */}
              <div ref={(el) => { fieldRefs.current['instance-url'] = el; }}>
                {catalogItem?.id === 'miro' ? (
                  <>
                    <p className="text-[14px] font-semibold text-[#323130] mb-1">Provide basic information about your URL</p>
                    <TextField
                      label="Company (Organization) ID"
                      required
                      value={instanceUrl}
                      onChange={(_, v) => { setInstanceUrl(v ?? ''); markChanged(); }}
                      onFocus={() => { setGuidanceHighlight('instance-url'); if (!suppressGuidanceSwitch.current) { setRightRailTab('guide'); setHealthFocused(false); setHealthBackTrigger(n => n + 1); } }}
                      placeholder="Miro company id example: 3458764625687941342"
                      styles={{ root: { width: '100%' } }}
                    />
                  </>
                ) : (
                  <>
                    <p className="text-[14px] font-semibold text-[#323130] mb-1">Provide basic information about your {typeName === 'ADO' ? 'ADO' : 'ServiceNow'} instance</p>
                    <TextField
                      label="Instance URL"
                      required
                      prefix="https://"
                      value={instanceUrl.replace(/^https?:\/\//, '')}
                      onChange={(_, v) => { setInstanceUrl(v ? `https://${v}` : ''); markChanged(); }}
                      onFocus={() => { setGuidanceHighlight('instance-url'); if (!suppressGuidanceSwitch.current) { setRightRailTab('guide'); setHealthFocused(false); setHealthBackTrigger(n => n + 1); } }}
                      placeholder="example.servicenow.com"
                      styles={{
                        root: { width: '100%' },
                        ...(isDarkMode ? {
                          prefix: { background: '#3d3d3d', color: '#c8c6c4', borderColor: '#616161' },
                          field: { background: '#212121', color: '#f5f5f5' },
                          fieldGroup: { borderColor: '#616161', background: '#212121', selectors: { ':hover': { borderColor: '#adadad' } } },
                        } : {}),
                      }}
                    />
                  </>
                )}
              </div>

              {/* Authentication */}
              <div ref={(el) => { fieldRefs.current['auth-types'] = el; }} className={`transition-colors duration-500 rounded-[4px] -mx-2 px-2 ${fieldHighlight === 'auth-types' ? 'bg-[#eff6ff]' : ''}`}>
                <p className="text-[14px] font-semibold text-[#323130] mb-1">Authenticate your {catalogItem?.id === 'miro' ? 'Miro' : typeName === 'ADO' ? 'ADO' : 'ServiceNow'} instance</p>

                {catalogItem?.id === 'miro' ? (
                  /* Miro: OAuth 2.0 fixed, Client ID + Secret + Authorize */
                  <div className="flex flex-col gap-3">
                    <TextField
                      label="Authentication type"
                      readOnly
                      value="OAuth 2.0"
                      styles={{ root: { width: '100%' } }}
                    />
                    <div className="flex gap-4">
                      <TextField
                        label="Client ID"
                        required
                        value={clientId}
                        onChange={(_, v) => { setClientId(v ?? ''); markChanged(); }}
                        onFocus={() => { setGuidanceHighlight('auth-types'); if (!suppressGuidanceSwitch.current) { setRightRailTab('guide'); setHealthFocused(false); setHealthBackTrigger(n => n + 1); } }}
                        styles={{ root: { flex: 1 } }}
                      />
                      <TextField
                        label="Client secret"
                        required
                        type="password"
                        canRevealPassword
                        value={clientSecret}
                        onChange={(_, v) => { setClientSecret(v ?? ''); markChanged(); }}
                        onFocus={() => { setGuidanceHighlight('auth-types'); if (!suppressGuidanceSwitch.current) { setRightRailTab('guide'); setHealthFocused(false); setHealthBackTrigger(n => n + 1); } }}
                        styles={{ root: { flex: 1 } }}
                      />
                    </div>
                    <div>
                      <Button
                        appearance="primary"
                        disabled={!clientId.trim() || !clientSecret.trim() || authorizing}
                        onClick={() => {
                          setAuthorizing(true);
                          setTimeout(() => setAuthorizing(false), 3000);
                        }}
                      >
                        {authorizing ? 'Authorizing...' : 'Authorize'}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    <FluentDropdown
                      value={AUTH_OPTIONS.find((option) => option.value === authMethod)?.label ?? 'Select authentication'}
                      selectedOptions={authMethod ? [authMethod] : []}
                      onOptionSelect={(_, data) => {
                        if (!data.optionValue) return;
                        setAuthMethod(data.optionValue as AuthMethod);
                        markChanged();
                      }}
                      onOpenChange={() => {
                        setGuidanceHighlight('auth-types');
                        if (!suppressGuidanceSwitch.current) {
                          setRightRailTab('guide');
                          setHealthFocused(false);
                          setHealthBackTrigger((n) => n + 1);
                        }
                      }}
                    >
                      {AUTH_OPTIONS.map((option) => (
                        <Option key={option.value} value={option.value}>
                          {option.label}
                        </Option>
                      ))}
                    </FluentDropdown>

                    {authMethod === 'basic' && (
                      <>
                        <TextField
                          label="Username"
                          required
                          value={basicUsername}
                          onChange={(_, v) => { setBasicUsername(v ?? ''); markChanged(); }}
                          onFocus={() => { setGuidanceHighlight('auth-types'); if (!suppressGuidanceSwitch.current) { setRightRailTab('guide'); setHealthFocused(false); setHealthBackTrigger(n => n + 1); } }}
                          styles={{ root: { width: '100%' } }}
                        />
                        <TextField
                          label="Password"
                          required
                          type="password"
                          canRevealPassword
                          value={basicPassword}
                          onChange={(_, v) => { setBasicPassword(v ?? ''); markChanged(); }}
                          onFocus={() => { setGuidanceHighlight('auth-types'); if (!suppressGuidanceSwitch.current) { setRightRailTab('guide'); setHealthFocused(false); setHealthBackTrigger(n => n + 1); } }}
                          styles={{ root: { width: '100%' } }}
                        />
                      </>
                    )}

                    {authMethod === 'oauth2' && (
                      <>
                        <TextField
                          label="Client ID"
                          required
                          value={clientId}
                          onChange={(_, v) => { setClientId(v ?? ''); markChanged(); }}
                          onFocus={() => { setGuidanceHighlight('auth-types'); if (!suppressGuidanceSwitch.current) { setRightRailTab('guide'); setHealthFocused(false); setHealthBackTrigger(n => n + 1); } }}
                          styles={{ root: { width: '100%' } }}
                        />
                        <TextField
                          label="Client secret"
                          required
                          type="password"
                          canRevealPassword
                          value={clientSecret}
                          onChange={(_, v) => { setClientSecret(v ?? ''); markChanged(); }}
                          onFocus={() => { setGuidanceHighlight('auth-types'); if (!suppressGuidanceSwitch.current) { setRightRailTab('guide'); setHealthFocused(false); setHealthBackTrigger(n => n + 1); } }}
                          styles={{ root: { width: '100%' } }}
                        />
                        <div>
                          <Button
                            appearance="primary"
                            disabled={!clientId.trim() || !clientSecret.trim() || authorizing}
                            onClick={() => {
                              setAuthorizing(true);
                              setTimeout(() => setAuthorizing(false), 3000);
                            }}
                          >
                            {authorizing ? 'Authorizing...' : 'Authorize'}
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Connection management team */}
              <div>
                <p className="text-[14px] font-semibold text-[#323130]" style={{ marginBottom: tokens.spacingVerticalS }}>Connection management team</p>
                <NormalPeoplePicker
                  selectedItems={managementTeamPeople.map((val) => {
                    const person = allPeople.find((x) => x.value === val);
                    return { key: val, text: person?.name ?? val } as IPersonaProps;
                  })}
                  onResolveSuggestions={(filter: string) =>
                    allPeople
                      .filter((p) => !managementTeamPeople.includes(p.value) && p.name.toLowerCase().includes(filter.toLowerCase()))
                      .map((p) => ({ key: p.value, text: p.name } as IPersonaProps))
                  }
                  onChange={(items?: IPersonaProps[]) => {
                    setManagementTeamPeople((items ?? []).map((i) => i.key as string));
                    markChanged();
                  }}
                  inputProps={{
                    placeholder: 'Select users/groups',
                    onFocus: () => {
                      setGuidanceHighlight('staged-rollout');
                      if (!suppressGuidanceSwitch.current) {
                        setRightRailTab('guide');
                        setHealthFocused(false);
                        setHealthBackTrigger((n) => n + 1);
                      }
                    },
                  }}
                  pickerSuggestionsProps={{ suggestionsHeaderText: 'Suggested people', noResultsFoundText: 'No results found' }}
                  styles={{
                    root: { width: '100%' },
                    ...(isDarkMode
                      ? {
                          text: { background: '#212121', borderColor: '#616161', selectors: { ':hover': { borderColor: '#adadad' }, '::after': { borderColor: '#479ef5' } } },
                          input: { background: '#212121', color: '#f5f5f5', selectors: { '::placeholder': { color: '#8a8886' } } },
                          itemsWrapper: { background: '#212121' },
                        }
                      : {}),
                  }}
                />
              </div>

              {/* Staged rollout */}
              <div ref={(el) => { fieldRefs.current['staged-rollout'] = el; }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: tokens.spacingVerticalM }}>
                  <p className="text-[14px] font-semibold text-[#323130]">Rollout to limited audience</p>
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
                    inputProps={{ placeholder: 'Select users/groups', onFocus: () => { setGuidanceHighlight('staged-rollout'); if (!suppressGuidanceSwitch.current) { setRightRailTab('guide'); setHealthFocused(false); setHealthBackTrigger(n => n + 1); } } }}
                    pickerSuggestionsProps={{ suggestionsHeaderText: 'Suggested people', noResultsFoundText: 'No results found' }}
                    styles={{
                      root: { width: '100%' },
                      ...(isDarkMode ? {
                        text: { background: '#212121', borderColor: '#616161', selectors: { ':hover': { borderColor: '#adadad' }, '::after': { borderColor: '#479ef5' } } },
                        input: { background: '#212121', color: '#f5f5f5', selectors: { '::placeholder': { color: '#8a8886' } } },
                        itemsWrapper: { background: '#212121' },
                      } : {}),
                    }}
                  />
                )}
              </div>

              {/* Privacy notice — create only */}
              {!isEdit && (
                <div className="flex items-start gap-2 pt-6">
                  <div
                    onClick={() => setPrivacyAccepted(v => !v)}
                    className={`mt-0.5 w-5 h-5 rounded-[2px] border flex-shrink-0 cursor-pointer flex items-center justify-center ${
                      privacyAccepted ? 'bg-[#0078d4] border-[#0078d4]' : 'border-[#323130] dark:border-[#adadad] bg-white dark:bg-[#212121]'
                    }`}
                  >
                    {privacyAccepted && (
                      <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                        <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </div>
                  <div>
                    <span className="text-[14px] text-[#323130] dark:text-[#f5f5f5] leading-5 font-semibold">Privacy notice</span>
                    {' '}<span className="text-[#900] text-[14px]">*</span>
                    <p className="text-[14px] text-[#484644] dark:text-[#adadad] leading-5 mt-0">
                      By using this Copilot connector, you agree to the{' '}
                      <a href="https://learn.microsoft.com/en-us/microsoftsearch/terms-of-use" target="_blank" rel="noreferrer" className="text-[#006cbe] hover:underline">
                        Copilot connectors: Terms of use
                      </a>
                      . You as data controller authorize Microsoft to create an index of third-party data in your Microsoft 365 tenant subject to your configurations. Learn more{' '}
                      <a href="https://learn.microsoft.com/en-us/microsoftsearch/connectors-overview" target="_blank" rel="noreferrer" className="text-[#006cbe] hover:underline">
                        here
                      </a>.
                    </p>
                  </div>
                </div>
              )}

            </div>}
            </div>{/* end keyed slide-in wrapper */}
          </div>

        </div>{/* end form side */}

        </div>{/* end left column */}

        {/* Rail expand button — narrow panel only, hidden when rail is open */}
        {!railOpen && !panelWide && <button
          onClick={() => setRailOpen(true)}
          style={{
            position: 'absolute', top: 12, right: 16, zIndex: 50,
            padding: '4px 10px', borderRadius: 4, fontSize: 13,
            display: 'flex', alignItems: 'center', gap: 6,
            background: 'transparent', border: 'none',
            color: '#0078d4', cursor: 'pointer',
          }}
        >
          <OpenPaneMirroredIcon style={{ fontSize: 14 }} />
          {isEdit ? 'Actions & Guide' : 'Setup Guide'}
        </button>}

        {/* Right rail — collapsible in-panel column for narrower widths */}
        {railOpen && !panelWide && (
          <div
            style={{
              display: 'flex', flexDirection: 'column',
              width: 360, flexShrink: 0,
              position: 'relative',
              background: isDarkMode ? '#212121' : '#faf9f8',
              borderLeft: `1px solid ${isDarkMode ? '#3d3d3d' : '#e1e1e1'}`,
              overflow: 'hidden',
            }}
          >
            {/* Rail header + body */}
            {!actionFocused && (
              <button onClick={() => setRailOpen(false)} style={{ position: 'absolute', top: 12, right: 16, zIndex: 1, background: 'none', border: 'none', cursor: 'pointer', padding: 4, display: 'flex', alignItems: 'center', color: isDarkMode ? '#adadad' : '#605e5c' }}>
                <ChromeCloseIcon style={{ fontSize: 12 }} />
              </button>
            )}
              {isRailEditMode && connectorForRail && !actionFocused ? (
              <div data-tour="error-tab">
              <Pivot
                selectedKey={rightRailTab}
                onLinkClick={(item) => {
                  const key = item?.props.itemKey as 'actions' | 'guide';
                  setRightRailTab(key);
                  if (key === 'guide') { setHealthFocused(false); setHealthBackTrigger(n => n + 1); }
                }}
                styles={{
                root: { paddingLeft: 16, paddingTop: 44, paddingBottom: 12, flexShrink: 0 },
                itemContainer: { display: 'none' },
                link: isDarkMode ? { color: '#adadad', selectors: { ':hover': { color: '#f5f5f5', backgroundColor: '#3d3d3d' } } } : {},
                linkIsSelected: isDarkMode ? { color: '#f5f5f5', selectors: { '::before': { backgroundColor: '#479ef5' } } } : {},
              }}
              >
                <PivotItem headerText="Actions" itemCount={railActionCount} itemKey="actions" />
                <PivotItem headerText="Guide" itemKey="guide" />
              </Pivot>
              </div>
            ) : !actionFocused ? (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '48px 24px 16px', flexShrink: 0 }}>
                <span style={{ fontSize: 14, fontWeight: 700, color: isDarkMode ? '#f5f5f5' : '#323130' }}>Guide</span>
                <a href="https://learn.microsoft.com/en-us/microsoft-365/copilot/connectors/servicenow-knowledge-deployment" target="_blank" rel="noreferrer"
                  style={{ fontSize: 13, color: '#0078d4', textDecoration: 'none' }}>
                  Read documentation
                </a>
              </div>
            ) : null}

            {/* Rail body */}
            <div ref={railScrollRef} style={{ flex: 1, minHeight: 0, overflow: (actionFocused && rightRailTab === 'actions') ? 'hidden' : 'auto', padding: (actionFocused && rightRailTab === 'actions') ? 0 : '0 24px 24px', position: 'relative' }}>
              <div key={rightRailTab} className={actionFocused ? undefined : slideInClass} style={actionFocused ? { height: '100%' } : undefined}>
                {isRailEditMode && connectorForRail && rightRailTab === 'actions'
                  ? <div data-tour="error-content"><ActionRail connector={connectorForRail} onNavigateToField={handleNavigateToField} onFocusedChange={setHealthFocused} backTrigger={actionBackTrigger} appliedRowsMap={appliedRowsMap} setAppliedRowsMap={setAppliedRowsMap} validationIssue={validationIssue} /></div>
                  : <GuidanceRail
                      highlightSection={guidanceHighlight}
                      accordionRefsCallback={(refs) => { accordionRefsCache.current = refs; }}
                      sections={TAB_GUIDANCE[activeTab] ?? GUIDANCE_SECTIONS}
                    />
                }
              </div>
            </div>
          </div>
        )}

        {/* Right rail — static side column when panel is wide enough */}
        {panelWide && <div style={{ display: 'flex', flexDirection: 'column', width: 360, flexShrink: 0, background: isDarkMode ? '#212121' : '#faf9f8', borderLeft: `1px solid ${isDarkMode ? '#3d3d3d' : '#e1e1e1'}`, overflow: 'hidden' }}>
          {isRailEditMode && connectorForRail && !actionFocused ? (
            <div data-tour="error-tab">
            <Pivot
              selectedKey={rightRailTab}
              onLinkClick={(item) => {
                const key = item?.props.itemKey as 'actions' | 'guide';
                setRightRailTab(key);
                if (key === 'guide') { setHealthFocused(false); setHealthBackTrigger(n => n + 1); }
              }}
              styles={{
                root: { paddingLeft: 16, paddingTop: 44, paddingBottom: 12, flexShrink: 0 },
                itemContainer: { display: 'none' },
                link: isDarkMode ? { color: '#adadad', selectors: { ':hover': { color: '#f5f5f5', backgroundColor: '#3d3d3d' } } } : {},
                linkIsSelected: isDarkMode ? { color: '#f5f5f5', selectors: { '::before': { backgroundColor: '#479ef5' } } } : {},
              }}
            >
              <PivotItem headerText="Actions" itemCount={railActionCount} itemKey="actions" />
              <PivotItem headerText="Guide" itemKey="guide" />
            </Pivot>
            </div>
          ) : !actionFocused ? (
            <div className="flex items-center justify-between px-6 pt-12 pb-4 flex-shrink-0">
              <span className="text-[14px] font-bold text-[#323130] dark:text-[#f5f5f5]">Guide</span>
              <a href="https://learn.microsoft.com/en-us/microsoft-365/copilot/connectors/servicenow-knowledge-deployment" target="_blank" rel="noreferrer"
                className="text-[13px] text-[#0078d4] dark:text-[#479ef5] whitespace-nowrap hover:underline">
                Read documentation
              </a>
            </div>
          ) : null}
          <div ref={railScrollRef} className="flex-1" style={{ minHeight: 0, overflow: (actionFocused && rightRailTab === 'actions') ? 'hidden' : 'auto', padding: (actionFocused && rightRailTab === 'actions') ? 0 : '24px', position: 'relative' }}>
            <div key={rightRailTab} className={actionFocused ? undefined : slideInClass} style={actionFocused ? { height: '100%' } : undefined}>
              {isRailEditMode && connectorForRail && rightRailTab === 'actions'
                ? <div data-tour="error-content"><ActionRail connector={connectorForRail} onNavigateToField={handleNavigateToField} onFocusedChange={setHealthFocused} backTrigger={actionBackTrigger} appliedRowsMap={appliedRowsMap} setAppliedRowsMap={setAppliedRowsMap} validationIssue={validationIssue} /></div>
                : <GuidanceRail
                    highlightSection={guidanceHighlight}
                    accordionRefsCallback={(refs) => { accordionRefsCache.current = refs; }}
                    sections={TAB_GUIDANCE[activeTab] ?? GUIDANCE_SECTIONS}
                  />
              }
            </div>
          </div>
        </div>}


        </div>{/* end content row */}
        {/* Footer — full width across panel */}
        <div className="border-t border-[#e1e1e1] dark:border-[#3d3d3d] px-8 py-4 flex items-center justify-between flex-shrink-0 bg-white dark:bg-[#212121] z-10">
          <div className="flex items-center gap-3">
            <Button
              appearance="primary"
              disabled={!hasChanges}
              onClick={shouldShowSetupEditDualButtons ? handleCreateSetupEdit : () => handleSaveEdits(false)}
            >
              {primaryFooterLabel}
            </Button>
            {shouldShowSetupEditDualButtons ? (
              <Button
                disabled={!hasChanges}
                onClick={handleSaveSetupEdit}
              >
                Save
              </Button>
            ) : isEdit && (
              <Button
                disabled={!canSyncNow || validationState === 'validating' || validationState === 'syncing'}
                onClick={() => handleSaveEdits(true)}
              >
                {validationState === 'validating' || validationState === 'syncing' ? 'Running...' : 'Save & sync now'}
              </Button>
            )}
          </div>
          <div className="flex items-center gap-4">
            <Button onClick={onClose}>Cancel</Button>
          </div>
        </div>
        </>
        )}
      </DrawerBody>
  );

  if (embedded) return <>{content}</>;

  return (
    <OverlayDrawer
      open
      onOpenChange={(_, { open }) => { if (!open) onClose(); }}
      position="end"
      className="connector-panel-drawer"
      style={{ top: 48, height: 'calc(100% - 48px)', padding: 0, display: 'flex', flexDirection: 'column', backgroundColor: isDarkMode ? '#212121' : '#ffffff' }}
    >
      {content}
    </OverlayDrawer>
  );
}
