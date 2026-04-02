'use client';

import React, { useState } from 'react';
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
import { PrimaryButton, DefaultButton, TextField, Dropdown, Checkbox as FluentV8Checkbox, Toggle, Link, Text } from '@fluentui/react';
import type { IDropdownOption } from '@fluentui/react';
import { EditIcon, SettingsIcon } from '@fluentui/react-icons-mdl2';
import { CONNECTOR_CATALOG } from '@/lib/gallery-data';
import AdvancedSetupPanel from './AdvancedSetupPanel';
import SetupGuideRail, { type GuideSection } from './SetupGuideRail';

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
    title: 'Connection display name',
    content: (
      <>
        <Text variant="small" styles={{ root: { color: '#323130', lineHeight: '18px', display: 'block' } }}>
          Connection display name is a unique identifier for this connection that helps you manage multiple connections of the same type in the admin portal. It is not visible to end users.
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

function GuideRail({ activeSection }: { activeSection?: string }) {
  return (
    <div className="h-full flex flex-col bg-white dark:bg-[#1f1f1f]" style={{ minWidth: 320, maxWidth: 360, width: '30%' }}>
      <div style={{ padding: '54px 24px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
        <Text variant="medium" styles={{ root: { fontWeight: 700, color: '#323130' } }}>
          Setup guide
        </Text>
        <Link href="#" styles={{ root: { fontSize: 12, whiteSpace: 'nowrap' } }}>
          Read detailed documentation
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
}

export default function SetupPanel({ connectorType, onClose }: SetupPanelProps) {
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

  const [displayName, setDisplayName] = useState(catalogItem.name);
  const [authMethod, setAuthMethod] = useState<string | null>(null);
  const [instanceUrl, setInstanceUrl] = useState('');
  const [rolloutLimited, setRolloutLimited] = useState(false);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [activeSection, setActiveSection] = useState<string | undefined>(undefined);
  const [showAdvanced, setShowAdvanced] = useState(false);
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
  const canCreate = displayName.trim().length > 0 && authMethod !== null && (!needsInstance || instanceUrl.trim().length > 0) && privacyAccepted;

  if (showAdvanced) {
    return <AdvancedSetupPanel connectorType={connectorType} onClose={onClose} />;
  }

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 z-[60]" onClick={onClose} />

      {/* Panel */}
      <div className="fixed top-[48px] right-0 bottom-0 z-[70] flex flex-col overflow-hidden bg-white dark:bg-[#212121] shadow-2xl" style={{ width: '80%' }}>

        {/* Content row */}
        <div className="flex flex-1 overflow-hidden">

          {/* Form side */}
          <div className="flex-1 bg-white dark:bg-[#212121] flex flex-col min-w-0 overflow-hidden">

            {/* Header */}
            <div className="px-8 pt-8 pb-0 flex-shrink-0">
              <div className="relative pb-5 border-b border-[#e1e1e1] dark:border-[#3d3d3d]">
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
                  </div>
                </div>

                {/* Advanced setup button — near divider */}
                <button
                  onClick={() => setShowAdvanced(true)}
                  className="absolute bottom-[10px] right-0 flex items-center gap-1.5 px-3 py-1 text-[13px] text-[#424242] dark:text-[#adadad] rounded hover:bg-[#f3f2f1] dark:hover:bg-[#292929] transition-colors"
                >
                  <SettingsIcon style={{ fontSize: 14 }} className="text-[#424242] dark:text-[#adadad]" />
                  Advanced setup
                </button>
              </div>
            </div>

            {/* Scrollable form */}
            <div className="flex-1 overflow-y-auto px-8 py-6">
              <div className="max-w-[480px] flex flex-col gap-6">

                {/* 1. Connector name — always present */}
                <div className="flex flex-col gap-2">
                  <p className="text-[14px] font-semibold text-[#323130] dark:text-[#f5f5f5]">Provide a unique name that will be displayed to users in results.</p>
                  <TextField
                    label="Connector name"
                    required
                    value={displayName}
                    onChange={(_, v) => setDisplayName(v ?? '')}
                    onFocus={() => handleFieldFocus('display-name')}
                    onBlur={handleFieldBlur}
                    styles={{ root: { width: '100%' }, ...darkFieldStyles }}
                  />
                </div>

                {/* 2. Instance / org field — connector-specific */}
                {config.instanceSection && (
                  <div className="flex flex-col gap-2">
                    <p className="text-[14px] font-semibold text-[#323130] dark:text-[#f5f5f5]">{config.instanceSection.heading}</p>
                    <TextField
                      label={config.instanceSection.fieldLabel}
                      required
                      placeholder={config.instanceSection.placeholder}
                      value={instanceUrl}
                      onChange={(_, v) => setInstanceUrl(v ?? '')}
                      onFocus={() => handleFieldFocus('instance-url')}
                      onBlur={handleFieldBlur}
                      styles={{ root: { width: '100%' }, ...darkFieldStyles }}
                    />
                  </div>
                )}

                {/* 3. Authentication — connector-specific options */}
                <div className="flex flex-col gap-2">
                  <p className="text-[14px] font-semibold text-[#323130] dark:text-[#f5f5f5]">{config.authHeading ?? `Authenticate your ${catalogItem.name} instance`}</p>
                  <Dropdown
                    label="Authentication type"
                    required
                    placeholder="Select a method"
                    selectedKey={authMethod}
                    options={config.authOptions}
                    onChange={(_, opt) => { if (opt) setAuthMethod(opt.key as string); }}
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
                </div>

                {/* 4. Rollout to limited audience — connector-specific */}
                {config.hasRolloutToggle && (
                  <div className="flex flex-col gap-2">
                    <p className="text-[14px] font-semibold text-[#323130] dark:text-[#f5f5f5]">Rollout to limited audience.</p>
                    <Toggle
                      checked={rolloutLimited}
                      onChange={(_, checked) => setRolloutLimited(!!checked)}
                      styles={{ root: { margin: 0 } }}
                    />
                  </div>
                )}

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

                {/* Notice — always present */}
                <FluentV8Checkbox
                  checked={privacyAccepted}
                  onChange={(_, checked) => setPrivacyAccepted(!!checked)}
                  onRenderLabel={() => (
                    <div style={{ marginLeft: 8 }}>
                      <span style={{ fontSize: 14, fontWeight: 600, color: isDark ? '#f5f5f5' : '#323130' }}>Notice</span>
                      {' '}<span style={{ color: '#a80000' }}>*</span>
                      <p style={{ fontSize: 13, color: isDark ? '#adadad' : '#484644', lineHeight: '20px', margin: '4px 0 0' }}>
                        By enabling this connection, you authorize Microsoft to create an index of third-party data in your Microsoft 365 tenant subject to your configurations. All data that is indexed by your connection is subject to the{' '}
                        <a href="https://learn.microsoft.com/en-us/microsoftsearch/terms-of-use" style={{ color: isDark ? '#479ef5' : '#0078d4' }}>
                          Microsoft Services Agreement
                        </a>
                        . Learn more{' '}
                        <a href="https://learn.microsoft.com/en-us/microsoftsearch/connectors-overview" style={{ color: isDark ? '#479ef5' : '#0078d4' }}>
                          here
                        </a>.
                      </p>
                    </div>
                  )}
                  styles={{ root: { alignItems: 'flex-start' }, checkbox: { marginTop: 2 } }}
                />
              </div>
            </div>
          </div>

          {/* Vertical divider */}
          <div className="w-px bg-[#e1e1e1] dark:bg-[#3d3d3d] flex-shrink-0" />

          {/* Guide rail */}
          <GuideRail activeSection={activeSection} />
        </div>

        {/* Footer */}
        <div className="border-t border-[#e1e1e1] dark:border-[#3d3d3d] px-8 py-3 flex items-center justify-between flex-shrink-0 bg-white dark:bg-[#212121]">
          <div className="flex items-center gap-3">
            <PrimaryButton disabled={!canCreate} styles={isDark ? { root: { background: '#479ef5', color: '#000', border: 'none', selectors: { ':hover': { background: '#62abf5' }, ':disabled': { background: '#2a3a4a', color: '#555', border: 'none' } } } } : {}}>Create</PrimaryButton>
          </div>
          <div className="flex items-center gap-3">
            <PrimaryButton disabled styles={{ root: isDark ? { background: '#2a3a4a', color: '#555', border: 'none' } : { background: '#ededed', color: '#a1a1a1', border: 'none' } }}>
              Save and close
            </PrimaryButton>
            <DefaultButton onClick={onClose} styles={isDark ? { root: { background: '#292929', color: '#f5f5f5', borderColor: '#616161', selectors: { ':hover': { background: '#383838', color: '#f5f5f5' } } } } : {}}>Cancel</DefaultButton>
          </div>
        </div>
      </div>
    </>
  );
}
