'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CONNECTORS } from '@/lib/mock-data';
import type { AuthMethod, UserCriteriaType } from '@/lib/types';

const AUTH_OPTIONS = [
  { value: 'basic', label: 'Basic Auth' },
  { value: 'oauth2', label: 'OAuth 2.0' },
];

const SETUP_TABS = ['Setup', 'Users', 'Content', 'Sync'] as const;

const GUIDANCE_SECTIONS = [
  {
    id: 'setup',
    title: 'Simple/Advanced setup',
    defaultOpen: true,
    content: (
      <div className="text-[12px] text-[#323130] leading-4 flex flex-col gap-4">
        <p>Quick way to setup a connection. Users can create a connection by providing few basic configurations only. All other values are provided default by Microsoft.</p>
        <p>Use advanced setup if you want a setup the connector with your own custom settings. Custom user mapping, add/edit properties, change schedule etc.</p>
      </div>
    ),
  },
  { id: 'display-name', title: 'Connection display name', defaultOpen: false, content: null },
  { id: 'icon-name', title: 'Display icon & name', defaultOpen: false, content: null },
  { id: 'user-criteria', title: 'User criteria setup in ServiceNow', defaultOpen: false, content: null },
  { id: 'instance-url', title: 'ServiceNow Instance URL', defaultOpen: false, content: null },
  { id: 'auth-types', title: 'Authentication types', defaultOpen: false, content: null },
  { id: 'staged-rollout', title: 'Staged rollout', defaultOpen: false, content: null },
  { id: 'troubleshooting', title: 'Troubleshooting', defaultOpen: false, content: null },
];

function FieldLabel({ children, required, info }: { children: React.ReactNode; required?: boolean; info?: boolean }) {
  return (
    <div className="flex items-center gap-1 py-[5px]">
      <span className="text-[12px] text-[#323130]">{children}</span>
      {required && <span className="text-[#a80000] text-[12px]">*</span>}
      {info && (
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="text-[#605e5c] ml-0.5">
          <circle cx="6" cy="6" r="5.5" stroke="currentColor" />
          <path d="M6 5v4M6 3.5v.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
      )}
    </div>
  );
}

function TextField({
  value,
  onChange,
  placeholder,
  valid,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  valid?: boolean;
}) {
  return (
    <div className="relative flex items-center border border-[#8a8886] rounded-[2px] bg-white focus-within:border-[#0078d4]">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="flex-1 px-2 py-[5px] text-[14px] text-[#323130] outline-none bg-transparent placeholder:text-[#9f9f9f]"
      />
      {valid && (
        <span className="pr-2 text-[#107c10] text-[12px] flex-shrink-0">✓</span>
      )}
    </div>
  );
}

function GuidancePanel({ openSections, onToggle }: { openSections: Set<string>; onToggle: (id: string) => void }) {
  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex items-start justify-between">
        <span className="text-[16px] font-bold text-black leading-[22px]">Setup guidance</span>
        <a href="https://learn.microsoft.com/en-us/microsoftsearch/connectors-overview" target="_blank" rel="noreferrer"
          className="text-[14px] text-[#006cbe] whitespace-nowrap">
          Read detailed documentation
        </a>
      </div>
      <div className="flex flex-col gap-5">
        {GUIDANCE_SECTIONS.map((section) => {
          const isOpen = openSections.has(section.id);
          return (
            <div key={section.id} className="flex flex-col">
              <div className="h-px bg-[#e1e1e1] w-full" />
              <button
                className="flex items-center justify-between h-10 w-full text-left"
                onClick={() => onToggle(section.id)}
              >
                <span className="text-[14px] font-semibold text-[#323130]">{section.title}</span>
                <svg
                  width="16" height="16" viewBox="0 0 16 16" fill="none"
                  className={`text-[#605e5c] flex-shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                >
                  <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              {isOpen && section.content && (
                <div className="pb-2">{section.content}</div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function SetupInner() {
  const router = useRouter();
  const params = useSearchParams();

  const sourceName = params.get('sourceName') ?? '';
  const displayName = params.get('displayName') ?? '';
  const userCriteria = (params.get('criteria') ?? 'simple') as UserCriteriaType;
  const instanceUrl = params.get('url') ?? '';
  const authMethod = (params.get('auth') ?? 'none') as AuthMethod;
  const privacyAccepted = params.get('privacy') === '1';

  const [openSections, setOpenSections] = useState<Set<string>>(
    new Set(GUIDANCE_SECTIONS.filter((s) => s.defaultOpen).map((s) => s.id))
  );

  function toggleSection(id: string) {
    setOpenSections((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function buildParams(overrides: Record<string, string>) {
    return new URLSearchParams({
      sourceName, displayName, criteria: userCriteria,
      url: instanceUrl, auth: authMethod,
      privacy: privacyAccepted ? '1' : '0',
      ...overrides,
    }).toString();
  }

  function set(key: string, value: string) {
    router.replace(`/connectors/new?${buildParams({ [key]: value })}`);
  }

  const canCreate = sourceName.trim().length > 0 && displayName.trim().length > 0 &&
    instanceUrl.trim().length > 0 && authMethod !== 'none' && privacyAccepted;

  function handleCreate() {
    if (!canCreate) return;
    const id = displayName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') || `connector-${Date.now()}`;
    if (!CONNECTORS.find((c) => c.id === id)) {
      CONNECTORS.push({
        id, displayName: sourceName, connectorType: 'ServiceNow Knowledge',
        userCriteriaType: userCriteria, instanceUrl, authMethod,
        healthStatus: 'pending', blockerCount: 0, warningCount: 0, suggestionCount: 0,
        issues: [], guideSteps: [], syncHistory: [], createdAt: new Date().toISOString(),
      });
    }
    router.push(`/connectors/${id}`);
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Breadcrumb */}
      <div className="px-8 pt-4 pb-0">
        <nav className="flex items-center gap-1 text-[12px] text-[#605e5c]">
          <Link href="/" className="hover:text-[#0078d4] transition-colors">Home</Link>
          <span className="mx-1">›</span>
          <Link href="/connectors" className="hover:text-[#0078d4] transition-colors">Connectors</Link>
        </nav>
      </div>

      {/* Main two-column layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left content: form */}
        <div className="flex-1 flex flex-col overflow-hidden">

          {/* Header */}
          <div className="border-b border-[#c8c8c8] px-8 pt-4">
            <div className="flex items-start justify-between pb-4">
              <div className="flex items-center gap-4">
                {/* Logo */}
                <div className="w-[64px] h-[64px] rounded-[8px] bg-[#284903] flex items-center justify-center flex-shrink-0 overflow-hidden">
                  <img
                    src="http://localhost:3845/assets/8ea55b65f2f4f34a4a05e79ddc164a85f0b2572d.png"
                    alt="ServiceNow"
                    className="w-full h-full object-cover rounded-[8px]"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                  />
                </div>
                <div className="flex flex-col gap-0.5">
                  <h1 className="text-[20px] font-bold text-[#323130] leading-7">ServiceNow Knowledge</h1>
                  <p className="text-[14px] text-[#605e5c] leading-5">{displayName || 'Connection display name'}</p>
                  <button className="flex items-center gap-1 text-[13px] text-[#0078d4] hover:underline mt-0.5 w-fit">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M8.5 1.5L10.5 3.5L4 10H2V8L8.5 1.5Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
                    </svg>
                    Edit
                  </button>
                </div>
              </div>
              {/* Advanced setup button */}
              <button className="flex items-center gap-1.5 px-3 py-[5px] text-[14px] text-[#323130] hover:bg-[#f5f5f5] rounded-[2px] transition-colors">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-[#605e5c]">
                  <circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.2" />
                  <path d="M8 1v2M8 13v2M1 8h2M13 8h2M3.05 3.05l1.41 1.41M11.54 11.54l1.41 1.41M3.05 12.95l1.41-1.41M11.54 4.46l1.41-1.41" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                </svg>
                Advanced setup
              </button>
            </div>

            {/* Tabs */}
            <div className="flex">
              {SETUP_TABS.map((tab, i) => (
                <button
                  key={tab}
                  disabled={i > 0}
                  className={`pb-2 mr-6 text-[14px] border-b-2 -mb-px transition-colors ${
                    i === 0
                      ? 'font-semibold text-[#0078d4] border-[#0078d4]'
                      : 'text-[#a19f9d] border-transparent cursor-not-allowed'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Form body */}
          <div className="flex-1 overflow-y-auto px-8 py-6">
            <div className="max-w-[528px] flex flex-col gap-6">

              {/* Source name */}
              <div>
                <p className="text-[14px] font-semibold text-[#323130] mb-1 leading-5">
                  Provide a unique name that will be displayed to users in results
                </p>
                <FieldLabel required>Source name</FieldLabel>
                <TextField
                  value={sourceName}
                  onChange={(v) => set('sourceName', v)}
                  valid={sourceName.trim().length > 0}
                />
              </div>

              {/* Connection display name */}
              <div>
                <p className="text-[14px] font-semibold text-[#323130] mb-0 leading-5">
                  Enter a unique name to manage this connection
                </p>
                <FieldLabel required info>Connection display name</FieldLabel>
                <TextField
                  value={displayName}
                  onChange={(v) => set('displayName', v)}
                  valid={displayName.trim().length > 0}
                />
              </div>

              {/* User criteria */}
              <div>
                <p className="text-[14px] font-semibold text-[#323130] mb-2 leading-5">
                  User criteria setup in ServiceNow
                </p>
                <div className="flex gap-4">
                  {(['simple', 'advanced'] as const).map((v) => (
                    <label key={v} className="flex items-center gap-2 cursor-pointer">
                      <div
                        onClick={() => set('criteria', v)}
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center cursor-pointer flex-shrink-0 ${
                          userCriteria === v
                            ? 'border-[#0078d4]'
                            : 'border-[#605e5c]'
                        }`}
                      >
                        {userCriteria === v && (
                          <div className="w-2.5 h-2.5 rounded-full bg-[#0078d4]" />
                        )}
                      </div>
                      <span className="text-[14px] text-[#323130] capitalize">{v}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Instance URL */}
              <div>
                <p className="text-[14px] font-semibold text-[#323130] mb-1 leading-5">
                  Provide basic information about your ServiceNow instance
                </p>
                <FieldLabel required>ServiceNow instance URL</FieldLabel>
                <div className="flex items-stretch border border-[#605e5c] rounded-[2px] bg-white focus-within:border-[#0078d4]">
                  <div className="bg-[#f3f2f1] px-[10px] flex items-center border-r border-[#605e5c] rounded-l-[1px]">
                    <span className="text-[14px] text-[#605e5c] whitespace-nowrap">https://</span>
                  </div>
                  <input
                    type="text"
                    value={instanceUrl.replace(/^https?:\/\//, '')}
                    onChange={(e) => set('url', e.target.value ? `https://${e.target.value}` : '')}
                    placeholder="example.servicenow.com"
                    className="flex-1 px-2 py-[5px] text-[14px] text-[#323130] outline-none placeholder:text-[#9f9f9f]"
                  />
                </div>
              </div>

              {/* Authentication */}
              <div>
                <p className="text-[14px] font-semibold text-[#323130] mb-1 leading-5">
                  Authenticate your ServiceNow instance
                </p>
                <FieldLabel required>Authentication type</FieldLabel>
                <div className="relative">
                  <select
                    value={authMethod === 'none' ? '' : authMethod}
                    onChange={(e) => set('auth', e.target.value || 'none')}
                    className="w-full appearance-none border border-[#605e5c] rounded-[2px] bg-white px-2 py-[5px] text-[14px] text-[#605e5c] outline-none focus:border-[#0078d4] cursor-pointer"
                  >
                    <option value="">Select</option>
                    {AUTH_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none"
                    className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-[#605e5c]">
                    <path d="M2 4L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>

              {/* Staged rollout */}
              <div>
                <p className="text-[14px] font-semibold text-[#323130] mb-1 leading-5">Staged rollout</p>
                <FieldLabel required info>Select users and user groups</FieldLabel>
                <div className="flex items-center border border-[#8a8886] rounded-[2px] bg-white focus-within:border-[#0078d4]">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="ml-2 flex-shrink-0 text-[#0078d4]">
                    <path d="M7 12A5 5 0 107 2a5 5 0 000 10zM14 14l-3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                  <input
                    type="text"
                    placeholder="Search"
                    className="flex-1 px-2 py-[5px] text-[14px] text-[#605e5c] outline-none placeholder:text-[#605e5c]"
                  />
                </div>
              </div>

              {/* Privacy notice */}
              <div className="flex flex-col gap-1">
                <div className="flex items-start gap-2">
                  <div
                    onClick={() => set('privacy', privacyAccepted ? '0' : '1')}
                    className={`mt-0.5 w-5 h-5 rounded-[2px] border flex-shrink-0 cursor-pointer flex items-center justify-center ${
                      privacyAccepted ? 'bg-[#0078d4] border-[#0078d4]' : 'border-[#323130] bg-white'
                    }`}
                  >
                    {privacyAccepted && (
                      <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                        <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </div>
                  <span className="text-[14px] text-[#323130] leading-5">
                    <span className="font-semibold">Privacy notice</span>
                    {' '}
                    <span className="text-[#900]">*</span>
                  </span>
                </div>
                <p className="pl-7 text-[14px] text-[#484644] leading-5">
                  By using this Copilot connector, you agree to the{' '}
                  <a href="https://learn.microsoft.com/en-us/microsoftsearch/terms-of-use"
                    target="_blank" rel="noreferrer" className="text-[#006cbe]">
                    Copilot connectors: Terms of use
                  </a>
                  . You as data controller authorize Microsoft to create an index of third-party data in your Microsoft 365 tenant subject to your configurations. Learn more{' '}
                  <a href="https://learn.microsoft.com/en-us/microsoftsearch/connectors-overview"
                    target="_blank" rel="noreferrer" className="text-[#006cbe]">
                    here
                  </a>.
                </p>
              </div>

            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-[#e1e1e1] px-8 py-4 flex items-center justify-between flex-shrink-0">
            <button
              onClick={handleCreate}
              disabled={!canCreate}
              className={`px-[19px] py-[6px] text-[14px] font-semibold rounded-[2px] transition-colors ${
                canCreate
                  ? 'bg-[#0078d4] text-white hover:bg-[#106ebe]'
                  : 'bg-[#0078d4] text-white opacity-40 cursor-not-allowed'
              }`}
            >
              Create
            </button>
            <div className="flex items-center gap-[18px]">
              <button
                disabled
                className="px-[19px] py-[6px] text-[14px] font-semibold text-[#a1a1a1] bg-[#ededed] rounded-[2px] cursor-not-allowed"
              >
                Save and close
              </button>
              <button
                onClick={() => router.push('/connectors')}
                className="px-[19px] py-[6px] text-[14px] font-semibold text-[#323130] bg-[#e8e8e8] rounded-[2px] hover:bg-[#d2d0ce] transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>

        {/* Right guidance panel */}
        <div className="w-[480px] flex-shrink-0 border-l border-[#e1e1e1] overflow-y-auto px-8 py-8">
          <GuidancePanel openSections={openSections} onToggle={toggleSection} />
        </div>
      </div>
    </div>
  );
}

export default function NewConnectorPage() {
  return (
    <Suspense>
      <SetupInner />
    </Suspense>
  );
}
