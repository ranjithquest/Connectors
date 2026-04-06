export type Severity = 'blocker' | 'warning' | 'suggestion';
export type HealthStatus = 'healthy' | 'degraded' | 'error' | 'pending' | 'unknown';
export type AuthMethod = 'basic' | 'oauth2' | 'none';
export type UserCriteriaType = 'simple' | 'advanced';
export type IssueSource = 'servicenow' | 'connector' | 'mismatch' | 'unsupported';

export interface DiagnosticQuestion {
  id: string;
  question: string;
  options: { value: string; label: string }[];
}

export interface RecommendedActionStep {
  label: string;
  description?: string;
  /** If set, clicking this step navigates to the given tab + field */
  tab?: string;
  fieldId?: string;
  /** If true, this step is an executable action (rendered as a primary action) */
  executable?: boolean;
  confirmationMessage?: string;
}

export interface RecommendedAction {
  id: string;
  label: string;
  where: 'connector' | 'servicenow' | 'external';
  /** Short hint shown below the label */
  hint?: string;
  /** Marks this as the recommended action */
  recommended?: boolean;
  /** Detailed resolution steps shown when the action is expanded */
  steps?: RecommendedActionStep[];
  /**
   * If true, this action can be executed in-place from the card.
   * The UI will show an "Apply" button and simulate/confirm the change.
   */
  executable?: boolean;
  /** Label shown on the apply button, e.g. "Apply", "Run now", "Switch" */
  executeLabel?: string;
  /** Confirmation message shown after execution */
  executeConfirmation?: string;
}

export interface DiagnosticIssue {
  id: string;
  rank: number;
  severity: Severity;
  source: IssueSource;
  title: string;
  description: string;
  detectedAt: string;
  // Auto-resolvable: show inline fix
  resolution?: string;
  resolutionAction?: 'fix-in-connector' | 'fix-in-servicenow' | 'workaround';
  connectorTab?: string;
  connectorFieldId?: string;
  // AI diagnostic: ask questions when Microsoft can't see the root cause
  requiresDiagnostic?: boolean;
  diagnosticQuestions?: DiagnosticQuestion[];
  resolvedAt?: string;
  copilotImpact?: string;
  docsUrl?: string;
  guideSteps?: { step: number; title: string; description: string }[];
  recommendedActions?: RecommendedAction[];
}

export interface SyncEvent {
  id: string;
  startedAt: string;
  completedAt?: string;
  status: 'success' | 'partial' | 'failed' | 'running';
  itemsIndexed: number;
  errorCount: number;
}

export interface GuideStepData {
  step: number;
  title: string;
  description: string;
  status: 'ok' | 'warn' | 'idle';
}

export interface Connector {
  id: string;
  displayName: string;
  connectorType: string;
  logoUrl?: string;
  userCriteriaType: UserCriteriaType;
  instanceUrl: string;
  authMethod: AuthMethod;
  basicUsername?: string;
  basicPassword?: string;
  healthStatus: HealthStatus;
  blockerCount: number;
  warningCount: number;
  suggestionCount: number;
  issues: DiagnosticIssue[];
  guideSteps: GuideStepData[];
  syncHistory: SyncEvent[];
  createdAt: string;
  lastSyncAt?: string;
  userCreated?: boolean;
}

export interface WizardFormState {
  step: 1 | 2 | 3 | 4;
  displayName: string;
  userCriteriaType: UserCriteriaType;
  instanceUrl: string;
  authMethod: AuthMethod;
}
