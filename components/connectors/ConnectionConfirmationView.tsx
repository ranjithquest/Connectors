'use client';

import React from 'react';
import { Button } from '@fluentui/react-components';
import { CompletedSolidIcon, StatusErrorFullIcon } from '@fluentui/react-icons-mdl2';
import type { DiagnosticIssue } from '@/lib/types';

export type ConfirmationStatus = 'idle' | 'active' | 'success' | 'error';

export interface ConnectionConfirmationStep {
  key: string;
  label: string;
  status: ConfirmationStatus;
}

interface ConnectionConfirmationViewProps {
  title: string;
  actionLabel: string;
  displayName: string;
  connectorName: string;
  logoUrl?: string;
  isDarkMode: boolean;
  containerClassName?: string;
  actionStatus: ConfirmationStatus;
  actionDimmed?: boolean;
  validationStatus: ConfirmationStatus;
  validationSteps: ConnectionConfirmationStep[];
  validationMetaText?: string | null;
  validationHelperText?: string | null;
  validationFooterContent?: React.ReactNode;
  syncStatus: ConfirmationStatus;
  syncDimmed?: boolean;
  syncText: string;
  issues?: DiagnosticIssue[];
  closeLabel?: string;
  closeDisabled?: boolean;
  onClose: () => void;
}

function ConnectorIdentityIcon({ src, name, size }: { src?: string; name: string; size: number }) {
  const [failed, setFailed] = React.useState(false);
  const initials = name.split(' ').slice(0, 2).map((word) => word[0]?.toUpperCase() ?? '').join('');
  const fontSize = size <= 32 ? 10 : 13;

  if (src && !failed) {
    return (
      <div style={{ width: size, height: size, borderRadius: 4, overflow: 'hidden', background: '#ffffff', flexShrink: 0 }}>
        <img src={src} alt={name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} onError={() => setFailed(true)} />
      </div>
    );
  }

  return (
    <div style={{ width: size, height: size, borderRadius: 4, flexShrink: 0, background: '#0d2137', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize, fontWeight: 600 }}>
      {initials}
    </div>
  );
}

function StatusGlyph({ status, isDarkMode }: { status: ConfirmationStatus; isDarkMode: boolean }) {
  if (status === 'error') {
    return <StatusErrorFullIcon style={{ fontSize: 16, color: '#a4373a', flexShrink: 0 }} />;
  }
  if (status === 'success') {
    return <CompletedSolidIcon style={{ fontSize: 16, color: '#107c10', flexShrink: 0 }} />;
  }
  if (status === 'active') {
    return <div style={{ width: 14, height: 14, flexShrink: 0, borderRadius: '50%', border: `2px solid ${isDarkMode ? '#8ec3ff' : '#0078d4'}`, borderTopColor: 'transparent', animation: 'spin 0.8s linear infinite' }} />;
  }
  return <div style={{ width: 14, height: 14, borderRadius: '50%', border: `2px solid ${isDarkMode ? '#8a8886' : '#a19f9d'}`, flexShrink: 0 }} />;
}

function baseTextColor(isDarkMode: boolean, dimmed?: boolean) {
  if (dimmed) return isDarkMode ? '#adadad' : '#605e5c';
  return isDarkMode ? '#f5f5f5' : '#000000';
}

export default function ConnectionConfirmationView({
  title,
  actionLabel,
  displayName,
  connectorName,
  logoUrl,
  isDarkMode,
  containerClassName,
  actionStatus,
  actionDimmed,
  validationStatus,
  validationSteps,
  validationMetaText,
  validationHelperText,
  validationFooterContent,
  syncStatus,
  syncDimmed,
  syncText,
  issues,
  closeLabel = 'Close',
  closeDisabled = false,
  onClose,
}: ConnectionConfirmationViewProps) {
  const borderColor = isDarkMode ? '#3d3d3d' : '#e1e1e1';

  return (
    <>
      <div className={`flex-1 overflow-y-auto bg-white dark:bg-[#212121] ${containerClassName ?? ''}`} style={{ padding: '48px 48px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 32 }}>
          <span style={{ fontSize: 28, fontWeight: 700, lineHeight: '36px', color: isDarkMode ? '#f5f5f5' : '#000000' }}>{title}</span>
        </div>

        <div style={{ maxWidth: 640, display: 'flex', flexDirection: 'column', gap: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', padding: '10px 0', gap: 16, borderBottom: `1px solid ${borderColor}`, opacity: actionDimmed ? 0.6 : 1 }}>
            <div style={{ width: 200, display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
              <StatusGlyph status={actionStatus} isDarkMode={isDarkMode} />
              <span style={{ fontSize: 14, fontWeight: actionStatus === 'active' || actionStatus === 'success' ? 600 : 400, lineHeight: '20px', color: baseTextColor(isDarkMode, actionDimmed) }}>{actionLabel}</span>
            </div>
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'flex-start' }}>
              <ConnectorIdentityIcon src={logoUrl} name={connectorName} size={24} />
              <span style={{ fontSize: 14, fontWeight: 600, lineHeight: '20px', color: actionDimmed ? (isDarkMode ? '#adadad' : '#605e5c') : (isDarkMode ? '#f5f5f5' : '#323130') }}>{displayName}</span>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', padding: '14px 0', borderBottom: `1px solid ${borderColor}` }}>
            <div style={{ display: 'flex', alignItems: 'flex-start' }}>
              <div style={{ minWidth: 200, display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                <StatusGlyph status={validationStatus} isDarkMode={isDarkMode} />
                <span style={{ fontSize: 14, fontWeight: validationStatus === 'active' ? 600 : 400, lineHeight: '20px', color: baseTextColor(isDarkMode) }}>Validating settings</span>
              </div>
              <div style={{ flex: 1, minWidth: 0, paddingLeft: 16 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {validationSteps.map((step) => (
                    <div key={step.key} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <StatusGlyph status={step.status} isDarkMode={isDarkMode} />
                      <span style={{ fontSize: 14, lineHeight: '20px', color: step.status === 'error' ? '#a4373a' : (isDarkMode ? '#adadad' : '#484644') }}>{step.label}</span>
                    </div>
                  ))}
                </div>
                {(validationMetaText || validationHelperText) && (
                  <div style={{ marginTop: 8, minWidth: 0 }}>
                    {validationMetaText && <span style={{ display: 'block', fontSize: 14, lineHeight: '20px', color: isDarkMode ? '#adadad' : '#484644', overflowWrap: 'anywhere' }}>{validationMetaText}</span>}
                    {validationHelperText && <span style={{ display: 'block', marginTop: 2, fontSize: 12, lineHeight: '16px', color: isDarkMode ? '#adadad' : '#605e5c' }}>{validationHelperText}</span>}
                  </div>
                )}
                {validationFooterContent && (
                  <div style={{ display: 'block', width: '100%', marginTop: 16 }}>
                    {validationFooterContent}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', padding: '10px 0', minHeight: 48, gap: 16, borderBottom: `1px solid ${borderColor}`, opacity: syncDimmed ? 0.6 : 1 }}>
            <div style={{ width: 200, display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
              <StatusGlyph status={syncStatus} isDarkMode={isDarkMode} />
              <span style={{ fontSize: 14, fontWeight: syncStatus === 'active' || syncStatus === 'success' ? 600 : 400, lineHeight: '20px', color: baseTextColor(isDarkMode, syncDimmed) }}>Syncing data</span>
            </div>
            <div style={{ flex: 1, minWidth: 0, textAlign: 'left', display: 'flex', justifyContent: 'flex-start' }}>
              <span style={{ display: 'block', fontSize: 14, lineHeight: '20px', color: syncDimmed ? '#8a8886' : (isDarkMode ? '#adadad' : '#484644'), overflowWrap: 'anywhere' }}>{syncText}</span>
            </div>
          </div>
        </div>

        {issues && issues.length > 0 && (
          <div style={{ marginTop: 24 }}>
            {issues.map((issue) => (
              <div key={issue.id} style={{ marginBottom: 16, padding: '16px', backgroundColor: isDarkMode ? '#2d2d2d' : '#fafaf8', border: `1px solid ${borderColor}`, borderRadius: 4 }}>
                <div style={{ display: 'flex', gap: 12, marginBottom: 8 }}>
                  <div style={{ width: 16, height: 16, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <StatusErrorFullIcon style={{ fontSize: 16, color: '#a4373a', flexShrink: 0 }} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: isDarkMode ? '#f5f5f5' : '#323130', marginBottom: 4 }}>{issue.title}</div>
                    <div style={{ fontSize: 12, color: isDarkMode ? '#adadad' : '#605e5c', marginBottom: 8, lineHeight: '16px' }}>{issue.description}</div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: isDarkMode ? '#f5f5f5' : '#323130', marginBottom: 8 }}>Recommended action:</div>
                    {issue.recommendedActions?.map((action) => (
                      <div key={action.id} style={{ fontSize: 12, color: isDarkMode ? '#adadad' : '#605e5c', marginBottom: 8 }}>
                        <div style={{ fontWeight: 600, marginBottom: 4, color: isDarkMode ? '#f5f5f5' : '#323130' }}>{action.label}</div>
                        <ol style={{ marginLeft: 16, marginBottom: 8 }}>
                          {action.steps?.map((step, index) => (
                            <li key={index} style={{ marginBottom: 4, color: isDarkMode ? '#adadad' : '#605e5c' }}>{step.label}</li>
                          ))}
                        </ol>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={{ borderTop: `1px solid ${borderColor}`, padding: '0 32px', height: 64, flexShrink: 0, background: isDarkMode ? '#212121' : '#fff', display: 'flex', alignItems: 'center' }}>
        <Button disabled={closeDisabled} onClick={onClose}>{closeLabel}</Button>
      </div>
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </>
  );
}