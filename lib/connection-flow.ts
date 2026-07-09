import type { DiagnosticIssue } from '@/lib/types';

export const CONNECTION_VALIDATION_STEPS = [
  'Testing Auth Credentials',
  'Previewing Content',
  'Ensuring Configurations',
] as const;

export function createSetupEditIssues(validationCompletedAt: string | null): [DiagnosticIssue, DiagnosticIssue] {
  const detectedAt = validationCompletedAt ?? new Date().toISOString();

  return [
    {
      id: 'setup-edit-authentication-failed',
      rank: 1,
      severity: 'blocker',
      source: 'connector',
      title: 'Authentication failed',
      description: 'This may happen due of the mimatch of the authentication details you provided.',
      copilotImpact: 'Athentication failed. This will not allow M365 to index data from source.',
      detectedAt,
      connectorTab: 'Setup',
      connectorFieldId: 'auth-credentials',
      recommendedActions: [
        {
          id: 'setup-edit-reauthenticate-credentials',
          label: 'Re-authenticate your credentials',
          where: 'connector',
          steps: [
            { label: 'Open source portal in Incognito mode and check if the credential is working' },
            { label: 'On setup tab, reauthenticate the credentials.', tab: 'Setup' },
            { label: 'Try creating connection again' },
          ],
        },
      ],
    },
    {
      id: 'setup-edit-content-filetype-semantic-label',
      rank: 2,
      severity: 'blocker',
      source: 'servicenow',
      title: "'Filetype' property needs to have semantic label",
      description: 'This may happen when the source have multiple properties which have similar names. So the system cannot detect the correct property.',
      copilotImpact: 'This will index correct property from the source.',
      detectedAt,
      connectorTab: 'Content',
      connectorFieldId: 'manage-properties',
      recommendedActions: [
        {
          id: 'setup-edit-filetype-semantic-label',
          label: 'Add Semantic label to Property "Filetype"',
          where: 'servicenow',
          steps: [
            { label: 'From the source, find the correct label.' },
            { label: 'Go to content tab and open "filetype" property from manage properties table. Add the name as semantic label.', tab: 'Content' },
          ],
        },
      ],
    },
  ];
}