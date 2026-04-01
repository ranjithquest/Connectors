'use client';

import React, { useState } from 'react';
import { PrimaryButton, DefaultButton, TextField, Dropdown, Checkbox as FluentV8Checkbox, ActionButton, Link, Text } from '@fluentui/react';
import type { IDropdownOption } from '@fluentui/react';
import { EditIcon, ChevronDownIcon, SettingsIcon } from '@fluentui/react-icons-mdl2';
import { CONNECTOR_CATALOG } from '@/lib/gallery-data';
import SetupDrawer from './SetupDrawer';

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

// ─── Guide Rail ────────────────────────────────────────────────────────────────

const GUIDE_SECTIONS: { id: string; title: string; content: React.ReactNode }[] = [
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
  const [openId, setOpenId] = useState<string | null>(activeSection ?? 'display-name');

  React.useEffect(() => {
    if (activeSection) setOpenId(activeSection);
  }, [activeSection]);

  return (
    <div className="h-full flex flex-col bg-white" style={{ minWidth: 320, maxWidth: 360, width: '30%' }}>
      {/* Header — 54px top = pt-8 (32px) + half of 72px icon – half of text line-height, aligning with connector title */}
      <div style={{ padding: '54px 24px 8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
        <Text variant="medium" styles={{ root: { fontWeight: 700, color: '#323130' } }}>
          Setup guidance
        </Text>
        <Link href="#" styles={{ root: { fontSize: 12, whiteSpace: 'nowrap' } }}>
          Read detailed documentation
        </Link>
      </div>

      {/* Sections — flex-col gap-16px matching Figma */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '0 24px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        {GUIDE_SECTIONS.map((s) => {
          const isOpen = openId === s.id;
          const isHighlighted = activeSection === s.id;
          return (
            <React.Fragment key={s.id}>
              {/* Collapsible row — blue top border + blue title when form field is focused (matches SetupDrawer) */}
              <div style={{ display: 'flex', flexDirection: 'column', borderTop: `1px solid ${isHighlighted ? '#0078d4' : '#e1e1e1'}` }}>
                <ActionButton
                  styles={{
                    root: { width: '100%', padding: 0, height: 32, minWidth: 0, background: 'transparent' },
                    flexContainer: { width: '100%', flexDirection: 'row-reverse', justifyContent: 'space-between' },
                    label: {
                      fontSize: 13,
                      color: isHighlighted ? '#0078d4' : isOpen ? '#323130' : '#a19f9d',
                      fontWeight: isHighlighted || isOpen ? 600 : 400,
                      margin: 0,
                      textAlign: 'left',
                      flex: 1,
                    },
                    icon: { margin: 0, flexShrink: 0 },
                  }}
                  onRenderIcon={() => (
                    <ChevronDownIcon
                      style={{ fontSize: 12, transition: 'transform 0.2s', transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', color: isHighlighted ? '#0078d4' : '#605e5c' }}
                    />
                  )}
                  onClick={() => setOpenId(isOpen ? null : s.id)}
                >
                  {s.title}
                </ActionButton>
              </div>

              {/* Expanded content block — sibling in gap-16 flex, matching Figma node structure */}
              {isOpen && s.content && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <Text variant="smallPlus" styles={{ root: { fontWeight: 600, color: '#323130' } }}>
                    {s.title}
                  </Text>
                  <div>{s.content}</div>
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}

// ─── Auth options ──────────────────────────────────────────────────────────────

const AUTH_OPTIONS: IDropdownOption[] = [
  { key: 'oauth', text: 'OAuth 2.0' },
  { key: 'basic', text: 'Basic authentication' },
  { key: 'apikey', text: 'API key' },
  { key: 'windows', text: 'Windows authentication' },
];

// ─── Main component ────────────────────────────────────────────────────────────

interface SimpleSetupDrawerProps {
  connectorType: string;
  onClose: () => void;
}

export default function SimpleSetupDrawer({ connectorType, onClose }: SimpleSetupDrawerProps) {
  const catalogItem = CONNECTOR_CATALOG.find(
    (c) => c.name.toLowerCase() === connectorType.toLowerCase()
  ) ?? CONNECTOR_CATALOG[0];

  const [displayName, setDisplayName] = useState(catalogItem.name);
  const [authMethod, setAuthMethod] = useState<string | null>(null);
  const [instanceUrl, setInstanceUrl] = useState('');
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('display-name');
  const [showAdvanced, setShowAdvanced] = useState(false);

  const canCreate = displayName.trim().length > 0 && authMethod !== null && privacyAccepted;

  if (showAdvanced) {
    return <SetupDrawer connectorType={connectorType} onClose={onClose} />;
  }

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 z-[60]" onClick={onClose} />

      {/* Panel */}
      <div className="fixed top-[48px] right-0 bottom-0 z-[70] flex flex-col overflow-hidden bg-white shadow-2xl" style={{ width: '80%' }}>

        {/* Content row */}
        <div className="flex flex-1 overflow-hidden">

          {/* Form side */}
          <div className="flex-1 bg-white flex flex-col min-w-0 overflow-hidden">

            {/* Header */}
            <div className="px-8 pt-8 pb-0 flex-shrink-0">
              <div className="relative pb-5 border-b border-[#e1e1e1]">
                <div className="flex items-center gap-5">
                  <ConnectorIcon src={catalogItem.logoUrl} name={catalogItem.name} size={72} />
                  <div className="flex flex-col gap-1 flex-1 min-w-0">
                    <h1 className="text-[22px] font-bold text-[#323130] leading-7">{catalogItem.name}</h1>
                    <button
                      onClick={() => {}}
                      className="flex items-center gap-1.5 text-[13px] mt-0.5 w-fit hover:opacity-80"
                    >
                      <EditIcon style={{ fontSize: 13 }} className="text-[#0078d4]" />
                      <span className="text-[#0078d4]">Edit source name &amp; icon</span>
                    </button>
                  </div>
                </div>

                {/* Advanced setup button — near divider */}
                <button
                  onClick={() => setShowAdvanced(true)}
                  className="absolute bottom-[10px] right-0 flex items-center gap-1.5 px-3 py-1 text-[13px] text-[#424242] rounded hover:bg-[#f3f2f1] transition-colors"
                >
                  <SettingsIcon style={{ fontSize: 14 }} className="text-[#424242]" />
                  Advanced setup
                </button>
              </div>
            </div>

            {/* Scrollable form */}
            <div className="flex-1 overflow-y-auto px-8 py-6">
              <div className="max-w-[480px] flex flex-col gap-6">

                {/* Connection display name */}
                <div className="flex flex-col gap-2">
                  <p className="text-[14px] font-semibold text-[#323130]">Enter a unique name to manage this connection</p>
                  <TextField
                    label="Connection display name"
                    required
                    value={displayName}
                    onChange={(_, v) => setDisplayName(v ?? '')}
                    onFocus={() => setActiveSection('display-name')}
                    styles={{ root: { width: '100%' } }}
                  />
                </div>

                {/* Authentication */}
                <div className="flex flex-col gap-2">
                  <p className="text-[14px] font-semibold text-[#323130]">Authenticate your {catalogItem.name} instance</p>
                  <Dropdown
                    label="Authentication type"
                    required
                    placeholder="Select"
                    selectedKey={authMethod}
                    options={AUTH_OPTIONS}
                    onChange={(_, opt) => { if (opt) setAuthMethod(opt.key as string); }}
                    onFocus={() => setActiveSection('auth')}
                    styles={{ root: { width: '100%' } }}
                  />
                </div>

                {/* Instance URL / Org */}
                <div className="flex flex-col gap-2">
                  <p className="text-[14px] font-semibold text-[#323130]">Enter the organisation</p>
                  <TextField
                    label="Organisation name"
                    required
                    placeholder="Enter the organisation name"
                    value={instanceUrl}
                    onChange={(_, v) => setInstanceUrl(v ?? '')}
                    onFocus={() => setActiveSection('instance-url')}
                    styles={{ root: { width: '100%' } }}
                  />
                </div>

                {/* Auth instruction */}
                <p className="text-[13px] text-[#323130] leading-5">
                  Please{' '}
                  <a href="#" className="text-[#0078d4] hover:underline">
                    install the Microsoft 365 Copilot {catalogItem.name} App
                  </a>{' '}
                  on your organisation before authorisation.
                </p>

                {/* Privacy notice */}
                <FluentV8Checkbox
                  checked={privacyAccepted}
                  onChange={(_, checked) => setPrivacyAccepted(!!checked)}
                  onRenderLabel={() => (
                    <div style={{ marginLeft: 8 }}>
                      <span style={{ fontSize: 14, fontWeight: 600, color: '#323130' }}>Privacy notice</span>
                      {' '}<span style={{ color: '#a80000' }}>*</span>
                      <p style={{ fontSize: 13, color: '#484644', lineHeight: '20px', margin: '4px 0 0' }}>
                        By using this Copilot connector, you agree to the{' '}
                        <a href="https://learn.microsoft.com/en-us/microsoftsearch/terms-of-use" style={{ color: '#0078d4' }}>
                          Copilot connectors: Terms of use
                        </a>
                        . You as data controller authorize Microsoft to create an index of third-party data in your Microsoft 365 tenant subject to your configurations. Learn more{' '}
                        <a href="https://learn.microsoft.com/en-us/microsoftsearch/connectors-overview" style={{ color: '#0078d4' }}>
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
          <div className="w-px bg-[#e1e1e1] flex-shrink-0" />

          {/* Guide rail */}
          <GuideRail activeSection={activeSection} />
        </div>

        {/* Footer */}
        <div className="border-t border-[#e1e1e1] px-8 py-3 flex items-center justify-between flex-shrink-0 bg-white">
          <div className="flex items-center gap-3">
            <PrimaryButton disabled={!canCreate}>Create</PrimaryButton>
          </div>
          <div className="flex items-center gap-3">
            <PrimaryButton disabled styles={{ root: { background: '#ededed', color: '#a1a1a1', border: 'none' } }}>
              Save and close
            </PrimaryButton>
            <DefaultButton onClick={onClose}>Cancel</DefaultButton>
          </div>
        </div>
      </div>
    </>
  );
}
