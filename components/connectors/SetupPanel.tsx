'use client';

import React, { useState, useEffect } from 'react';
function useDarkMode(): boolean {
  const [dark, setDark] = React.useState(false);
  React.useEffect(() => {
    const mql = window.matchMedia('(prefers-color-scheme: dark)');
    const update = () => setDark(document.documentElement.classList.contains('dark') || mql.matches);
    update();
    const observer = new MutationObserver(update);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    mql.addEventListener('change', update);
    return () => { observer.disconnect(); mql.removeEventListener('change', update); };
  }, []);
  return dark;
}
import { PrimaryButton, DefaultButton, TextField, Dropdown, Toggle, Link, Text, AnimationStyles } from '@fluentui/react';
import { mergeStyles } from '@fluentui/merge-styles';
import { FluentProvider, webLightTheme, webDarkTheme, Skeleton, SkeletonItem } from '@fluentui/react-components';

const slideInClass = mergeStyles(AnimationStyles.slideDownIn10);
import type { IDropdownOption } from '@fluentui/react';
import { EditIcon, SettingsIcon, CompletedSolidIcon, InfoIcon, ChromeCloseIcon, OpenPaneMirroredIcon } from '@fluentui/react-icons-mdl2';
import { CONNECTOR_CATALOG } from '@/lib/gallery-data';
import AdvancedSetupPanel from './AdvancedSetupPanel';
import SetupGuideRail, { type GuideSection } from './SetupGuideRail';
import { OverlayDrawer, DrawerBody } from '@fluentui/react-drawer';

// ─── ConnectorIcon ─────────────────────────────────────────────────────────────

function ConnectorIcon({ src, name, size }: { src?: string | null; name: string; size: number }) {
  const [failed, setFailed] = React.useState(false);
  const initials = name.split(' ').slice(0, 2).map((w) => w[0]?.toUpperCase() ?? '').join('');
  const fontSize = size <= 32 ? 10 : size <= 48 ? 13 : 16;
  if (src && !failed) {
    return (
      <div className="flex-shrink-0 overflow-hidden bg-white" style={{ width: size, height: size, borderRadius: 8 }}>
        <img src={src} alt={name} className="w-full h-full object-contain" onError={() => setFailed(true)} />
      </div>
    );
  }
  return (
    <div className="flex-shrink-0 flex items-center justify-center text-white font-semibold bg-[#0d2137]"
      style={{ width: size, height: size, borderRadius: 8, fontSize }}>
      {initials}
    </div>
  );
}

// ─── Guide sections ────────────────────────────────────────────────────────────

const GUIDE_SECTIONS: GuideSection[] = [
  {
    id: 'source-icon',
    title: 'Source icon and name',
    content: (
      <>
        <Text variant="small" styles={{ root: { color: '#323130', lineHeight: '18px', display: 'block' } }}>
          The source icon and name are shown to end users in Copilot search results. Use a recognisable logo and a short, descriptive name so users know which system the result came from.
        </Text>
        <Text variant="small" styles={{ root: { color: '#323130', lineHeight: '18px', display: 'block', marginTop: 8 } }}>
          Supported formats: PNG or SVG, max 1 MB, recommended size 64 × 64 px.
        </Text>
      </>
    ),
  },
  {
    id: 'setup-mode',
    title: 'Simple/Advanced setup',
    content: (
      <>
        <Text variant="small" styles={{ root: { color: '#323130', lineHeight: '18px', display: 'block' } }}>
          <Text variant="small" styles={{ root: { fontWeight: 600 } }}>Simple</Text>
          {' — '}Configure the most common settings to get your connector running quickly. Recommended for most deployments.
        </Text>
        <Text variant="small" styles={{ root: { color: '#323130', lineHeight: '18px', display: 'block', marginTop: 8 } }}>
          <Text variant="small" styles={{ root: { fontWeight: 600 } }}>Advanced</Text>
          {' — '}Fine-tune crawl schedules, access control rules, content filters, and property mappings. Switch at any time from the connector header.
        </Text>
      </>
    ),
  },
  {
    id: 'display-name',
    title: 'Connection name',
    content: (
      <>
        <Text variant="small" styles={{ root: { color: '#323130', lineHeight: '18px', display: 'block' } }}>
          Connection name is a unique identifier for this connection that helps you manage multiple connections of the same type in the admin portal. It is not visible to end users.
        </Text>
        <Text variant="small" styles={{ root: { color: '#323130', lineHeight: '18px', display: 'block', marginTop: 8 } }}>
          Use a descriptive name, e.g. <Text variant="small" styles={{ root: { fontWeight: 600 } }}>GitHub Issues – Engineering</Text>.{' '}
          <Link href="#">Learn more</Link>
        </Text>
      </>
    ),
  },
  {
    id: 'instance-url',
    title: 'Instance URL',
    content: (
      <>
        <Text variant="small" styles={{ root: { color: '#323130', lineHeight: '18px', display: 'block' } }}>
          Enter the base URL of your connector instance, e.g. <Text variant="small" styles={{ root: { fontWeight: 600 } }}>example.service-now.com</Text>.
        </Text>
        <Text variant="small" styles={{ root: { color: '#323130', lineHeight: '18px', display: 'block', marginTop: 8 } }}>
          Do not include a path or trailing slash. The connector will append the required API endpoints automatically. Ensure the instance is reachable from Microsoft's indexing service.
        </Text>
      </>
    ),
  },
  {
    id: 'auth',
    title: 'Authentication types',
    content: (
      <>
        <Text variant="small" styles={{ root: { color: '#323130', lineHeight: '18px', display: 'block' } }}>
          <Text variant="small" styles={{ root: { fontWeight: 600 } }}>OAuth 2.0</Text>
          {' — '}Recommended. Uses a client ID and secret to obtain short-lived tokens.
        </Text>
        <Text variant="small" styles={{ root: { color: '#323130', lineHeight: '18px', display: 'block', marginTop: 8 } }}>
          <Text variant="small" styles={{ root: { fontWeight: 600 } }}>Basic auth</Text>
          {' — '}Authenticate with a username and password. Simple but less secure; rotate credentials regularly.
        </Text>
        <Text variant="small" styles={{ root: { color: '#323130', lineHeight: '18px', display: 'block', marginTop: 8 } }}>
          Credentials are stored encrypted and never exposed in logs.
        </Text>
      </>
    ),
  },
  {
    id: 'troubleshooting',
    title: 'Troubleshooting',
    content: (
      <>
        <Text variant="small" styles={{ root: { color: '#323130', lineHeight: '18px', display: 'block' } }}>
          If the connector shows an error, check:
        </Text>
        <ul style={{ margin: '8px 0 0 16px', padding: 0, listStyleType: 'disc' }}>
          {[
            'The instance URL is correct and reachable.',
            'The API user has the required roles.',
            'OAuth credentials have not expired or been revoked.',
            'Firewall rules allow outbound traffic from Microsoft\'s sync IPs.',
          ].map((item) => (
            <li key={item} style={{ marginBottom: 4 }}>
              <Text variant="small" styles={{ root: { color: '#323130', lineHeight: '18px' } }}>{item}</Text>
            </li>
          ))}
        </ul>
        <Link href="https://learn.microsoft.com/en-us/microsoftsearch/connectors-overview" styles={{ root: { display: 'block', marginTop: 8 } }}>
          View full troubleshooting guide →
        </Link>
      </>
    ),
  },
];

function GuideRail({ activeSection, open, onToggle }: { activeSection?: string; open: boolean; onToggle: () => void }) {
  if (!open) return null;
  return (
    <div className="flex h-full flex-col bg-white dark:bg-[#1f1f1f]" style={{ minWidth: 280, maxWidth: 360, width: '30%', borderLeft: '1px solid #e1e1e1' }}>
      <div style={{ padding: '54px 24px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
        <Text variant="medium" styles={{ root: { fontWeight: 700, color: '#323130' } }}>
          Setup guide
        </Text>
        <Link href="#" styles={{ root: { fontSize: 12, whiteSpace: 'nowrap' } }}>
          Read documentation
        </Link>
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: '0 24px 24px' }}>
        <SetupGuideRail sections={GUIDE_SECTIONS} activeSection={activeSection} />
      </div>
    </div>
  );
}

// ─── Per-connector setup config ────────────────────────────────────────────────

type ConnectorSetupConfig = {
  /** Section heading + field for the "instance / organisation" block */
  instanceSection: {
    heading: string;
    fieldLabel: string;
    placeholder: string;
  } | null;
  /** Override for the auth section heading (defaults to "Authenticate your {name} instance") */
  authHeading?: string;
  /** Available auth methods for this connector */
  authOptions: IDropdownOption[];
  /** Whether to show the "Rollout to limited audience" toggle */
  hasRolloutToggle?: boolean;
  /** Install-app instruction note. null = hide the note */
  installNote: string | null;
};

const DEFAULT_AUTH_OPTIONS: IDropdownOption[] = [
  { key: 'oauth', text: 'OAuth 2.0' },
  { key: 'basic', text: 'Basic authentication' },
  { key: 'apikey', text: 'API key' },
  { key: 'windows', text: 'Windows authentication' },
];

/** Keyed by ConnectorCatalogItem.id */
const SETUP_CONFIGS: Record<string, ConnectorSetupConfig> = {
  'azure-devops-work-items': {
    instanceSection: {
      heading: 'Provide basic information about your ADO instance',
      fieldLabel: 'Azure DevOps organization',
      placeholder: 'Example: fabrikam',
    },
    authHeading: 'Authenticate your AzureDevOps instance',
    authOptions: [
      { key: 'federated', text: 'Federated Credential (Recommended)' },
      { key: 'entra', text: 'Microsoft Entra ID' },
      { key: 'ado-provider', text: 'Azure DevOps Provider (retiring soon)' },
    ],
    hasRolloutToggle: true,
    installNote: null,
  },
  'bamboohr-profiles': {
    instanceSection: {
      heading: 'Provide basic information about your BambooHR URL',
      fieldLabel: 'BambooHR URL',
      placeholder: 'Example: https://contoso.bamboohr.com',
    },
    authHeading: 'Authenticate your BambooHR instance',
    authOptions: [
      { key: 'oauth2', text: 'OAuth 2.0' },
    ],
    hasRolloutToggle: false,
    installNote: null,
  },
  'workday': {
    instanceSection: {
      heading: 'Set up Workday connection',
      fieldLabel: 'Workday web services URL',
      placeholder: 'Example: https://wd2-impl-services1.workday.com',
    },
    authHeading: 'Provide Workday credentials',
    authOptions: [
      { key: 'certificate', text: 'Certificate (Workday OAuth 2.0)' },
    ],
    hasRolloutToggle: false,
    installNote: null,
  },
  'sap-successfactors': {
    instanceSection: {
      heading: 'Set up SAP SuccessFactors connection',
      fieldLabel: 'DataCenter URL',
      placeholder: 'Example: https://api4.successfactors.com',
    },
    authHeading: 'Choose how to connect to SAP SuccessFactors',
    authOptions: [
      { key: 'direct', text: 'Connect directly using a certificate' },
      { key: 'middleware', text: 'Connect through middleware' },
    ],
    hasRolloutToggle: false,
    installNote: null,
  },
  'salesforce-knowledge': {
    instanceSection: {
      heading: 'Provide basic information about your Salesforce Knowledge URL',
      fieldLabel: 'Salesforce Knowledge URL',
      placeholder: 'Example: https://contoso.com',
    },
    authHeading: 'Authenticate your Salesforce Knowledge instance',
    authOptions: [
      { key: 'oauth2', text: 'OAuth 2.0' },
    ],
    hasRolloutToggle: true,
    installNote: null,
  },
  'salesforce-crm': {
    instanceSection: {
      heading: 'Provide basic information about your Salesforce instance',
      fieldLabel: 'Your SalesForce Instance URL',
      placeholder: 'Example: https://yourdomainname.my.salesforce.com',
    },
    authHeading: 'Authenticate your Salesforce instance',
    authOptions: [
      { key: 'oauth2', text: 'OAuth 2.0' },
    ],
    hasRolloutToggle: true,
    installNote: null,
  },
  'zendesk-help': {
    instanceSection: {
      heading: 'Provide basic information about your Zendesk Help Center instance',
      fieldLabel: 'Zendesk Help Center URL',
      placeholder: 'Example: https://contoso.zendesk.com',
    },
    authHeading: 'Authenticate your Zendesk Help Center instance',
    authOptions: [
      { key: 'oauth2', text: 'OAuth 2.0' },
    ],
    hasRolloutToggle: true,
    installNote: null,
  },
  'zendesk-tickets': {
    instanceSection: {
      heading: 'Provide basic information about your URL',
      fieldLabel: 'Instance URL',
      placeholder: 'Example: https://contoso.zendesk.com',
    },
    authHeading: 'Authenticate your Zendesk Ticket instance',
    authOptions: [
      { key: 'oauth2', text: 'OAuth 2.0' },
    ],
    hasRolloutToggle: true,
    installNote: null,
  },
  'confluence-cloud': {
    instanceSection: {
      heading: 'Provide basic information about your Confluence instance',
      fieldLabel: 'Confluence URL',
      placeholder: 'Example: https://contoso.atlassian.net',
    },
    authHeading: 'Authenticate your Confluence instance',
    authOptions: [
      { key: 'basic', text: 'Basic' },
      { key: 'oauth2', text: 'OAuth 2.0' },
    ],
    hasRolloutToggle: true,
    installNote: null,
  },
  'enterprise-websites-cloud': {
    instanceSection: {
      heading: 'Enter URLs to include sites',
      fieldLabel: 'URLs',
      placeholder: 'https://www.example.com',
    },
    authHeading: 'Authenticate your Website instance',
    authOptions: [
      { key: 'none', text: 'None' },
      { key: 'basic', text: 'Basic' },
      { key: 'oidc', text: 'OIDC Client Credentials (Any identity provider)' },
      { key: 'siteminder', text: 'Site Minder' },
      { key: 'oauth2cc', text: 'OAuth 2.0 Client Credentials' },
    ],
    hasRolloutToggle: true,
    installNote: null,
  },
  'servicenow-knowledge': {
    instanceSection: {
      heading: 'Provide basic information about your ServiceNow instance',
      fieldLabel: 'ServiceNow URL',
      placeholder: 'Example: https://contoso.service-now.com',
    },
    authHeading: 'Authenticate your ServiceNow instance',
    authOptions: [
      { key: 'federated', text: 'Federated Credential (Recommended)' },
      { key: 'basic', text: 'Basic' },
      { key: 'oauth2', text: 'OAuth 2.0' },
      { key: 'entra-oidc', text: 'Microsoft Entra ID OIDC' },
    ],
    hasRolloutToggle: true,
    installNote: null,
  },
  'jira-cloud': {
    instanceSection: {
      heading: 'Provide basic information about your Jira instance',
      fieldLabel: 'Jira URL',
      placeholder: 'Example: https://<your-jira-site-name>.atlassian.net',
    },
    authHeading: 'Authenticate your Jira instance',
    authOptions: [
      { key: 'basic', text: 'Basic' },
      { key: 'oauth2', text: 'OAuth 2.0' },
    ],
    hasRolloutToggle: true,
    installNote: null,
  },
  'file-share': {
    instanceSection: {
      heading: 'Add & validate source folder path(s)',
      fieldLabel: 'Data sources (example: \\\\file_path\\one)',
      placeholder: 'Enter file share paths or other data sources, one per line.',
    },
    authHeading: 'Authenticate your Fileshare instance',
    authOptions: [
      { key: 'windows', text: 'Windows' },
    ],
    hasRolloutToggle: true,
    installNote: null,
  },
  'google-drive': {
    instanceSection: {
      heading: 'Provide basic information about your Google Drive instance.',
      fieldLabel: 'Google App Domain',
      placeholder: 'Example: contoso.com',
    },
    authHeading: 'Authenticate your Google Drive instance',
    authOptions: [
      { key: 'google-sa', text: 'Google Service Account' },
    ],
    hasRolloutToggle: true,
    installNote: null,
  },
  'github-cloud-knowledge': {
    instanceSection: {
      heading: 'Enter the organization',
      fieldLabel: 'Organization name',
      placeholder: 'Enter the organization name',
    },
    authHeading: 'Authenticate your GitHub instance',
    authOptions: [
      { key: 'oauth', text: 'OAuth (Recommended)' },
      { key: 'custom-user', text: 'Customized GitHub App (on behalf of user)' },
      { key: 'custom-install', text: 'Customized GitHub App (installation)' },
    ],
    hasRolloutToggle: true,
    installNote: 'Install the Microsoft 365 Copilot GitHub App on your organization before authorization.',
  },
  'github-cloud-issues': {
    instanceSection: {
      heading: 'Enter the organization',
      fieldLabel: 'Organization name',
      placeholder: 'Enter the organization name',
    },
    authHeading: 'Authenticate your GitHub instance',
    authOptions: [
      { key: 'oauth', text: 'OAuth (Recommended)' },
      { key: 'custom-user', text: 'Customized GitHub App (on behalf of user)' },
      { key: 'custom-install', text: 'Customized GitHub App (installation)' },
    ],
    hasRolloutToggle: true,
    installNote: 'Install the Microsoft 365 Copilot GitHub App on your organization before authorization.',
  },
  'github-cloud-pull-requests': {
    instanceSection: {
      heading: 'Enter the organization',
      fieldLabel: 'Organization name',
      placeholder: 'Enter the organization name',
    },
    authHeading: 'Authenticate your GitHub instance',
    authOptions: [
      { key: 'oauth', text: 'OAuth (Recommended)' },
      { key: 'custom-user', text: 'Customized GitHub App (on behalf of user)' },
      { key: 'custom-install', text: 'Customized GitHub App (installation)' },
    ],
    hasRolloutToggle: true,
    installNote: 'Install the Microsoft 365 Copilot GitHub App on your organization before authorization.',
  },
  'github-server-knowledge': {
    instanceSection: {
      heading: 'Provide basic information about your URL',
      fieldLabel: 'Instance URL',
      placeholder: 'Example: https://xxx.com',
    },
    authHeading: 'Authenticate your GitHub instance',
    authOptions: [
      { key: 'github-app-user', text: 'GitHub App (on behalf of a user)' },
    ],
    hasRolloutToggle: true,
    installNote: null,
  },
  'github-server-issues': {
    instanceSection: {
      heading: 'Provide basic information about your URL',
      fieldLabel: 'Instance URL',
      placeholder: 'Example: https://xxx.com',
    },
    authHeading: 'Authenticate your GitHub instance',
    authOptions: [
      { key: 'github-app-user', text: 'GitHub App (on behalf of a user)' },
    ],
    hasRolloutToggle: true,
    installNote: null,
  },
  'github-server-pull-requests': {
    instanceSection: {
      heading: 'Provide basic information about your URL',
      fieldLabel: 'Instance URL',
      placeholder: 'Example: https://xxx.com',
    },
    authHeading: 'Authenticate your GitHub instance',
    authOptions: [
      { key: 'github-app-user', text: 'GitHub App (on behalf of a user)' },
    ],
    hasRolloutToggle: true,
    installNote: null,
  },
  'servicenow-catalog': {
    instanceSection: {
      heading: 'Provide basic information about your ServiceNow instance',
      fieldLabel: 'ServiceNow URL',
      placeholder: 'Example: https://contoso.service-now.com',
    },
    authHeading: 'Authenticate your ServiceNow instance',
    authOptions: [
      { key: 'federated', text: 'Federated Credential (Recommended)' },
      { key: 'basic', text: 'Basic' },
      { key: 'oauth2', text: 'OAuth 2.0' },
      { key: 'entra-oidc', text: 'Microsoft Entra ID OIDC' },
    ],
    hasRolloutToggle: true,
    installNote: null,
  },
  'servicenow-tickets': {
    instanceSection: {
      heading: 'Provide basic information about your ServiceNow instance',
      fieldLabel: 'ServiceNow URL',
      placeholder: 'Example: https://contoso.service-now.com',
    },
    authHeading: 'Authenticate your ServiceNow instance',
    authOptions: [
      { key: 'federated', text: 'Federated Credential (Recommended)' },
      { key: 'basic', text: 'Basic' },
      { key: 'oauth2', text: 'OAuth 2.0' },
      { key: 'entra-oidc', text: 'Microsoft Entra ID OIDC' },
    ],
    hasRolloutToggle: true,
    installNote: null,
  },
  'gong': {
    instanceSection: null,
    authHeading: 'Authenticate your Gong instance',
    authOptions: [
      { key: 'oauth2', text: 'OAuth 2.0' },
    ],
    hasRolloutToggle: true,
    installNote: null,
  },
  'azure-devops-wiki': {
    instanceSection: {
      heading: 'Provide basic information about your ADO instance',
      fieldLabel: 'Azure DevOps organization',
      placeholder: 'Example: fabrikam',
    },
    authHeading: 'Authenticate your AzureDevOps instance',
    authOptions: [
      { key: 'federated', text: 'Federated Credential (Recommended)' },
      { key: 'entra', text: 'Microsoft Entra ID' },
      { key: 'ado-provider', text: 'Azure DevOps Provider (retiring soon)' },
    ],
    hasRolloutToggle: true,
    installNote: null,
  },
  'jira-data-center': {
    instanceSection: {
      heading: 'Provide basic information about your Jira instance',
      fieldLabel: 'Jira URL',
      placeholder: 'Example: https://jira.contoso.com',
    },
    authHeading: 'Authenticate your Jira instance',
    authOptions: [
      { key: 'basic', text: 'Basic' },
      { key: 'oauth2', text: 'OAuth 2.0' },
    ],
    hasRolloutToggle: true,
    installNote: null,
  },
  'confluence-on-premises': {
    instanceSection: {
      heading: 'Provide basic information about your Confluence instance',
      fieldLabel: 'Confluence URL',
      placeholder: 'Example: https://confluence.contoso.com',
    },
    authHeading: 'Authenticate your Confluence instance',
    authOptions: [
      { key: 'basic', text: 'Basic' },
      { key: 'oauth2', text: 'OAuth 2.0' },
    ],
    hasRolloutToggle: true,
    installNote: null,
  },
  'enterprise-websites-on-premises': {
    instanceSection: {
      heading: 'Enter URLs to include sites',
      fieldLabel: 'URLs',
      placeholder: 'https://www.example.com',
    },
    authHeading: 'Authenticate your Website instance',
    authOptions: [
      { key: 'none', text: 'None' },
      { key: 'basic', text: 'Basic' },
      { key: 'windows', text: 'Windows' },
      { key: 'kerberos', text: 'Kerberos' },
    ],
    hasRolloutToggle: true,
    installNote: null,
  },
};


// ─── Main component ────────────────────────────────────────────────────────────

interface SetupPanelProps {
  connectorType: string;
  onClose: () => void;
  onCreated?: (connector: import('@/lib/types').Connector) => void;
}

export default function SetupPanel({ connectorType, onClose, onCreated }: SetupPanelProps) {
  const catalogItem = CONNECTOR_CATALOG.find(
    (c) => c.name.toLowerCase() === connectorType.toLowerCase()
  ) ?? CONNECTOR_CATALOG[0];

  const config: ConnectorSetupConfig = SETUP_CONFIGS[catalogItem.id] ?? {
    instanceSection: { heading: 'Enter the organisation', fieldLabel: 'Organisation name', placeholder: 'Enter the organisation name' },
    authOptions: DEFAULT_AUTH_OPTIONS,
    hasRolloutToggle: false,
    installNote: `install the Microsoft 365 Copilot ${catalogItem.name} App`,
  };

  const isDark = useDarkMode();

  const [hasChanges, setHasChanges] = useState(false);
  function markChanged() { setHasChanges(true); }
  const [displayName, setDisplayName] = useState(catalogItem.name);
  const [authMethod, setAuthMethod] = useState<string | null>(null);
  const [basicUsername, setBasicUsername] = useState('');
  const [basicPassword, setBasicPassword] = useState('');
  const [instanceUrl, setInstanceUrl] = useState('');
  const [rolloutLimited, setRolloutLimited] = useState(false);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [activeSection, setActiveSection] = useState<string | undefined>(undefined);
  // Rail collapses only when panel width can no longer fit both
  // MIN_CONTENT: form fields min width + horizontal padding (~480px fields + 64px padding)
  // MIN_RAIL: minimum rail width before it overlaps content
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
      setRailOpen(r => wide ? true : r); // auto-open when panel grows wide enough
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [created, setCreated] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(t);
  }, []);
  const blurTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleFieldFocus = (section: string) => {
    if (blurTimerRef.current) clearTimeout(blurTimerRef.current);
    setActiveSection(section);
  };

  const handleFieldBlur = () => {
    blurTimerRef.current = setTimeout(() => setActiveSection(undefined), 100);
  };

  const darkFieldStyles = isDark ? {
    field: { background: '#292929', color: '#f5f5f5' },
    fieldGroup: { borderColor: '#616161', background: '#292929', selectors: { ':hover': { borderColor: '#adadad' } } },
    label: { color: '#f5f5f5' },
    subComponentStyles: { label: { root: { color: '#f5f5f5' } } },
  } : {};

  const needsInstance = config.instanceSection !== null;
  const hasCredentials = authMethod !== 'basic' || (basicUsername.trim().length > 0 && basicPassword.trim().length > 0);
  const canCreate = displayName.trim().length > 0 && authMethod !== null && hasCredentials && (!needsInstance || instanceUrl.trim().length > 0) && privacyAccepted;

  return (
      <OverlayDrawer
        open
        onOpenChange={(_, { open }) => { if (!open) onClose(); }}
        position="end"
        className="connector-panel-drawer"
        style={{ top: 48, height: 'calc(100% - 48px)', padding: 0, display: 'flex', flexDirection: 'column' }}
      >
      {creating ? (
        <DrawerBody style={{ padding: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden', flex: 1 }}>
          <div className={`flex-1 overflow-y-auto bg-white dark:bg-[#212121] ${slideInClass}`} style={{ padding: '48px 48px 24px' }}>
            {/* Heading */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 32 }}>
              <CompletedSolidIcon style={{ fontSize: 20, color: created ? '#107c10' : '#c8c6c4' }} />
              <span style={{ fontSize: 28, fontWeight: 700, lineHeight: '36px', color: isDark ? '#f5f5f5' : '#000000' }}>
                {created ? 'Success' : 'Creating connection...'}
              </span>
            </div>
            {/* Rows — no outer border, just dividers */}
            <div style={{ maxWidth: 640, display: 'flex', flexDirection: 'column', gap: 0 }}>
              {/* Row 1: Created connection */}
              <div style={{ display: 'flex', alignItems: 'center', height: 48, gap: 16, borderBottom: `1px solid ${isDark ? '#3d3d3d' : '#e1e1e1'}` }}>
                <div style={{ width: 219, display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                  <CompletedSolidIcon style={{ fontSize: 16, color: created ? '#107c10' : '#c8c6c4', flexShrink: 0 }} />
                  <span style={{ fontSize: 14, lineHeight: '20px', color: isDark ? '#f5f5f5' : '#000000' }}>Created connection</span>
                </div>
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <ConnectorIcon src={catalogItem?.logoUrl} name={catalogItem?.name ?? displayName} size={24} />
                  <span style={{ fontSize: 14, fontWeight: 600, lineHeight: '20px', color: isDark ? '#f5f5f5' : '#323130' }}>{displayName}</span>
                </div>
              </div>
              {/* Row 2: Indexing data */}
              <div style={{ display: 'flex', alignItems: 'center', padding: '0', minHeight: 48, gap: 16, borderBottom: `1px solid ${isDark ? '#3d3d3d' : '#e1e1e1'}` }}>
                <div style={{ width: 219, display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                  <div style={{ width: 16, height: 16, flexShrink: 0, borderRadius: '50%', border: `2px solid ${isDark ? '#3d3d3d' : '#e1e1e1'}`, borderTopColor: '#0078d4', animation: 'spin 0.8s linear infinite' }} />
                  <span style={{ fontSize: 14, lineHeight: '20px', color: isDark ? (created ? '#f5f5f5' : '#707070') : (created ? '#000000' : '#a19f9d') }}>Indexing data</span>
                </div>
                <span style={{ fontSize: 14, lineHeight: '20px', color: isDark ? '#adadad' : '#000000' }}>This may take a while and will continue to run in the background</span>
              </div>
            </div>
          </div>
          {/* Footer */}
          <div style={{ borderTop: `1px solid ${isDark ? '#3d3d3d' : '#e1e1e1'}`, padding: '0 32px', height: 64, flexShrink: 0, background: isDark ? '#212121' : '#fff', display: 'flex', alignItems: 'center' }}>
            <DefaultButton
              onClick={onClose}
              styles={isDark ? { root: { background: '#292929', color: '#f5f5f5', borderColor: '#616161', selectors: { ':hover': { background: '#383838' } } } } : {}}
            >Done</DefaultButton>
          </div>
          <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
        </DrawerBody>
      ) : showAdvanced ? <AdvancedSetupPanel connectorType={connectorType} onClose={onClose} embedded /> : (
      <DrawerBody style={{ padding: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden', flex: 1 }}>

        {/* Content row */}
        <div ref={panelRef} className="flex flex-1 overflow-hidden relative">

          {/* Form side */}
          <div className="flex-1 bg-white dark:bg-[#212121] flex flex-col min-w-0 overflow-hidden">

            {/* Header */}
            <div className="px-8 pt-8 pb-0 flex-shrink-0">
              <div className="relative pb-5 border-b border-[#e1e1e1] dark:border-[#3d3d3d]">
                {loading ? (
                  <FluentProvider theme={isDark ? webDarkTheme : webLightTheme} style={{ background: 'transparent' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                      <Skeleton><SkeletonItem shape="square" size={72} style={{ borderRadius: 8, flexShrink: 0 }} /></Skeleton>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, flex: 1 }}>
                        <Skeleton><SkeletonItem size={20} style={{ width: '40%' }} /></Skeleton>
                        <Skeleton><SkeletonItem size={16} style={{ width: '30%' }} /></Skeleton>
                      </div>
                    </div>
                  </FluentProvider>
                ) : (
                  <div className={slideInClass}>
                    <div className="flex items-center gap-5">
                      <ConnectorIcon src={catalogItem.logoUrl} name={catalogItem.name} size={72} />
                      <div className="flex flex-col gap-1 flex-1 min-w-0">
                        <h1 className="text-[22px] font-bold text-[#323130] dark:text-[#f5f5f5] leading-7">{catalogItem.name}</h1>
                        <button
                          onClick={() => {}}
                          className="flex items-center gap-1.5 text-[13px] mt-0.5 w-fit hover:opacity-80"
                        >
                          <EditIcon style={{ fontSize: 13 }} className="text-[#0078d4] dark:text-[#479ef5]" />
                          <span className="text-[#0078d4] dark:text-[#479ef5]">Edit source name &amp; icon</span>
                        </button>
                        {/* Advanced setup — below edit link on small screens only */}
                        <button
                          onClick={() => { setShowAdvanced(true); }}
                          className="flex lg:hidden items-center gap-1.5 text-[13px] mt-0.5 w-fit text-[#424242] dark:text-[#adadad] hover:opacity-80"
                        >
                          <SettingsIcon style={{ fontSize: 13 }} className="text-[#424242] dark:text-[#adadad]" />
                          Advanced setup
                        </button>
                      </div>
                    </div>
                    {/* Advanced setup — absolute bottom-right on large screens */}
                    <button
                      onClick={() => { setShowAdvanced(true); }}
                      className="hidden lg:flex absolute bottom-0 right-0 items-center gap-1.5 px-3 py-1 text-[13px] text-[#424242] dark:text-[#adadad] rounded hover:bg-[#f3f2f1] dark:hover:bg-[#292929] transition-colors"
                    >
                      <SettingsIcon style={{ fontSize: 14 }} className="text-[#424242] dark:text-[#adadad]" />
                      Advanced setup
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Scrollable form */}
            <div className="flex-1 overflow-y-auto px-8 pt-12 pb-6">
              {loading ? (
                <FluentProvider theme={isDark ? webDarkTheme : webLightTheme} style={{ background: 'transparent' }}>
                  <div style={{ maxWidth: 480, display: 'flex', flexDirection: 'column', gap: 28 }}>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        <Skeleton><SkeletonItem size={12} style={{ width: '30%' }} /></Skeleton>
                        <Skeleton><SkeletonItem size={32} style={{ width: '100%', borderRadius: 2 }} /></Skeleton>
                      </div>
                    ))}
                  </div>
                </FluentProvider>
              ) : (
              <div className={`max-w-[480px] flex flex-col gap-6 ${slideInClass}`}>

                {/* 1. Connector name — always present */}
                <div className="flex flex-col gap-1">
                  <p className="text-[14px] font-semibold text-[#323130] dark:text-[#f5f5f5]">Provide a unique name that will be displayed to users in results.</p>
                  <TextField
                    label="Connector name"
                    required
                    value={displayName}
                    onChange={(_, v) => { setDisplayName(v ?? ''); markChanged(); }}
                    onFocus={() => handleFieldFocus('display-name')}
                    onBlur={handleFieldBlur}
                    styles={{ root: { width: '100%' }, label: { fontWeight: 400, selectors: { '&': { fontWeight: 400 } } }, ...darkFieldStyles }}
                  />
                </div>

                {/* 2. Instance / org field — connector-specific */}
                {config.instanceSection && (
                  <div className="flex flex-col gap-1">
                    <p className="text-[14px] font-semibold text-[#323130] dark:text-[#f5f5f5]">{config.instanceSection.heading}</p>
                    <TextField
                      label={config.instanceSection.fieldLabel}
                      required
                      placeholder={config.instanceSection.placeholder}
                      value={instanceUrl}
                      onChange={(_, v) => { setInstanceUrl(v ?? ''); markChanged(); }}
                      onFocus={() => handleFieldFocus('instance-url')}
                      onBlur={handleFieldBlur}
                      styles={{ root: { width: '100%' }, label: { fontWeight: 400, selectors: { '&': { fontWeight: 400 } } }, ...darkFieldStyles }}
                    />
                  </div>
                )}

                {/* 3. Authentication — connector-specific options */}
                <div className="flex flex-col gap-1">
                  <p className="text-[14px] font-semibold text-[#323130] dark:text-[#f5f5f5]">{config.authHeading ?? `Authenticate your ${catalogItem.name} instance`}</p>
                  <Dropdown
                    label="Authentication type"
                    required
                    placeholder="Select a method"
                    selectedKey={authMethod}
                    options={config.authOptions}
                    onChange={(_, opt) => { if (opt) { setAuthMethod(opt.key as string); markChanged(); } }}
                    onFocus={() => handleFieldFocus('auth')}
                    onBlur={handleFieldBlur}
                    styles={{
                      root: { width: '100%' },
                      title: isDark ? { background: '#292929', color: '#f5f5f5', borderColor: '#616161' } : {},
                      caretDownWrapper: isDark ? { color: '#f5f5f5' } : {},
                      caretDown: isDark ? { color: '#f5f5f5' } : {},
                      dropdownItem: isDark ? { background: '#292929', color: '#f5f5f5', selectors: { ':hover': { background: '#383838', color: '#f5f5f5' } } } : {},
                      dropdownItemSelected: isDark ? { background: '#1a2a3a', color: '#479ef5' } : {},
                      dropdown: isDark ? { selectors: { ':focus::after': { borderColor: '#479ef5' } } } : {},
                      callout: isDark ? { background: '#292929' } : {},
                      label: isDark ? { color: '#f5f5f5' } : {},
                    }}
                  />

                  {/* Basic Auth credential inputs */}
                  {authMethod === 'basic' && (
                    <div className={`flex flex-col gap-3 mt-3 ${slideInClass}`}>
                      <TextField
                        label="Username"
                        required
                        value={basicUsername}
                        onChange={(_, v) => { setBasicUsername(v ?? ''); markChanged(); }}
                        onFocus={() => handleFieldFocus('auth')}
                        onBlur={handleFieldBlur}
                        placeholder="e.g. svc-copilot@contoso.com"
                        styles={{ root: { width: '100%' }, ...darkFieldStyles }}
                      />
                      <TextField
                        label="Password"
                        required
                        type="password"
                        canRevealPassword
                        value={basicPassword}
                        onChange={(_, v) => { setBasicPassword(v ?? ''); markChanged(); }}
                        onFocus={() => handleFieldFocus('auth')}
                        onBlur={handleFieldBlur}
                        styles={{ root: { width: '100%' }, ...darkFieldStyles }}
                      />
                    </div>
                  )}
                </div>

                {/* Install-app note — connector-specific */}
                {config.installNote && (
                  <p className="text-[13px] text-[#323130] dark:text-[#f5f5f5] leading-5">
                    Please{' '}
                    <a href="#" className="text-[#0078d4] dark:text-[#479ef5] hover:underline">
                      install the Microsoft 365 Copilot {catalogItem.name} App
                    </a>{' '}
                    on your organisation before authorisation.
                  </p>
                )}

                {/* Privacy notice */}
                <div className="flex items-start gap-2 pt-6">
                  <div
                    onClick={() => { setPrivacyAccepted(v => !v); markChanged(); }}
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
                    <span className="text-[14px] font-semibold text-[#323130] dark:text-[#f5f5f5] leading-5">Privacy notice</span>
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
              </div>
              )}
            </div>
          </div>

          {/* Expand button — narrow panel only, hidden when rail is open */}
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
            Guide
          </button>}

          {/* Guide rail overlay — narrow panel only */}
          {railOpen && !panelWide && (
            <div style={{
              position: 'absolute', top: 0, right: 0, bottom: 0,
              width: 360, zIndex: 40, display: 'flex', flexDirection: 'column',
              background: isDark ? '#1f1f1f' : '#faf9f8',
              borderLeft: `1px solid ${isDark ? '#3d3d3d' : '#e1e1e1'}`,
              boxShadow: '-4px 0 16px rgba(0,0,0,0.12)',
            }}>
              <button onClick={() => setRailOpen(false)} style={{ position: 'absolute', top: 12, right: 12, background: 'none', border: 'none', cursor: 'pointer', padding: 4, display: 'flex', alignItems: 'center', color: isDark ? '#adadad' : '#605e5c' }}>
                <ChromeCloseIcon style={{ fontSize: 12 }} />
              </button>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '54px 24px 16px', flexShrink: 0 }}>
                <span style={{ fontSize: 14, fontWeight: 700, color: isDark ? '#f5f5f5' : '#323130' }}>Guide</span>
                <a href="#" style={{ fontSize: 12, color: '#0078d4', textDecoration: 'none', whiteSpace: 'nowrap' }}>Read documentation</a>
              </div>
              <div style={{ flex: 1, overflowY: 'auto', padding: '0 24px 24px' }}>
                <SetupGuideRail sections={GUIDE_SECTIONS} activeSection={activeSection} />
              </div>
            </div>
          )}

          {/* Guide rail — static side column when panel is wide enough */}
          {loading && panelWide ? (
            <div style={{ display: 'flex', flexDirection: 'column', minWidth: 280, maxWidth: 360, width: '30%', borderLeft: '1px solid #e1e1e1' }}>
              <div style={{ padding: '54px 24px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
                <FluentProvider theme={isDark ? webDarkTheme : webLightTheme} style={{ background: 'transparent', width: '70%' }}>
                  <Skeleton><SkeletonItem size={16} style={{ width: '100%' }} /></Skeleton>
                </FluentProvider>
              </div>
              <div style={{ flex: 1, overflowY: 'auto', padding: '0 24px 24px' }}>
                <FluentProvider theme={isDark ? webDarkTheme : webLightTheme} style={{ background: 'transparent' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    {Array.from({ length: 6 }).map((_, i) => (
                      <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 8, borderTop: '1px solid #e1e1e1', paddingTop: 8 }}>
                        <Skeleton><SkeletonItem size={16} style={{ width: i % 2 === 0 ? '60%' : '75%' }} /></Skeleton>
                      </div>
                    ))}
                  </div>
                </FluentProvider>
              </div>
            </div>
          ) : panelWide ? (
            <GuideRail activeSection={activeSection} open={railOpen} onToggle={() => setRailOpen(v => !v)} />
          ) : null}
          {/* Re-open button when rail is collapsed on wide panels */}
          {!railOpen && panelWide && (
            <button
              onClick={() => setRailOpen(true)}
              style={{ position: 'absolute', top: 12, right: 16, zIndex: 50, padding: '4px 10px', borderRadius: 4, fontSize: 13, display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', color: '#0078d4', cursor: 'pointer' }}
            >
              <OpenPaneMirroredIcon style={{ fontSize: 14 }} />
              Guide
            </button>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-[#e1e1e1] dark:border-[#3d3d3d] px-8 py-3 flex items-center justify-between flex-shrink-0 bg-white dark:bg-[#212121]">
          {loading ? (
            <FluentProvider theme={isDark ? webDarkTheme : webLightTheme} style={{ background: 'transparent', width: '100%', display: 'flex', justifyContent: 'space-between' }}>
              <Skeleton style={{ display: 'flex', gap: 8 }}>
                <SkeletonItem size={32} style={{ width: 72, borderRadius: 4 }} />
              </Skeleton>
              <Skeleton style={{ display: 'flex', gap: 8 }}>
                <SkeletonItem size={32} style={{ width: 110, borderRadius: 4 }} />
                <SkeletonItem size={32} style={{ width: 72, borderRadius: 4 }} />
              </Skeleton>
            </FluentProvider>
          ) : (
            <>
              <div className="flex items-center gap-3">
                <PrimaryButton
                  disabled={!hasChanges}
                  onClick={() => {
            setCreating(true);
            setTimeout(() => {
              setCreated(true);
              onCreated?.({
                id: `user-${Date.now()}`,
                displayName,
                connectorType,
                logoUrl: catalogItem?.logoUrl,
                userCriteriaType: 'simple',
                instanceUrl,
                authMethod: (authMethod ?? 'oauth2') as import('@/lib/types').AuthMethod,
                basicUsername,
                basicPassword,
                healthStatus: 'pending',
                blockerCount: 0,
                warningCount: 0,
                suggestionCount: 0,
                issues: [],
                guideSteps: [],
                syncHistory: [],
                createdAt: new Date().toISOString(),
                userCreated: true,
              });
            }, 2500);
          }}
                  styles={isDark ? { root: { background: '#479ef5', color: '#000', border: 'none', selectors: { ':hover': { background: '#62abf5' }, ':disabled': { background: '#2a3a4a', color: '#555', border: 'none' } } } } : {}}
                >Create</PrimaryButton>
              </div>
              <div className="flex items-center gap-3">
                <PrimaryButton disabled styles={{ root: isDark ? { background: '#2a3a4a', color: '#555', border: 'none' } : { background: '#ededed', color: '#a1a1a1', border: 'none' } }}>
                  Save and close
                </PrimaryButton>
                <DefaultButton onClick={onClose} styles={isDark ? { root: { background: '#292929', color: '#f5f5f5', borderColor: '#616161', selectors: { ':hover': { background: '#383838', color: '#f5f5f5' } } } } : {}}>Cancel</DefaultButton>
              </div>
            </>
          )}
        </div>
      </DrawerBody>
      )}
      </OverlayDrawer>
  );
}
