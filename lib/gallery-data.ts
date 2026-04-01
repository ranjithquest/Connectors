export type ConnectorCatalogItem = {
  id: string;
  name: string;
  publisher: string;
  description: string;
  category: string;
  recommended?: boolean;
  logoColor: string;
  logoInitials: string;
  logoUrl?: string;
  logoBg?: string;
};

export const CATEGORIES = [
  'Created by your org',
  'Collaboration & communication',
  'Content management systems',
  'Customer relationship management',
  'Data visualization',
  'Databases',
  'Developer tool',
  'Files and documents',
  'Human resources & recruiting',
  'IT service management tools',
  'Project management',
  'Sales',
  'Support',
] as const;

const CDN = 'https://res.cdn.office.net/admincenter/admin-content/admin/images/udt/catalog_list';

export const CONNECTOR_CATALOG: ConnectorCatalogItem[] = [
  // Created by your org
  { id: 'custom-connector', name: 'Custom connector', publisher: 'Microsoft', description: 'Build a connector for any data source.', category: 'Created by your org', logoColor: '#6264A7', logoInitials: 'CC', logoUrl: `${CDN}/customconnector_catalogue2.png`, logoBg: '#ffffff' },

  // Collaboration & communication (Recommended)
  { id: 'azure-devops-work-items', name: 'Azure DevOps Work Items', publisher: 'Microsoft', description: 'Seamless issue tracking.', category: 'Collaboration & communication', recommended: true, logoColor: '#0078D4', logoInitials: 'AZ', logoUrl: '/logos/azure-devops.svg', logoBg: '#ffffff' },
  { id: 'jira-cloud', name: 'Jira Cloud', publisher: 'Microsoft', description: 'Project management and issue tracking.', category: 'Collaboration & communication', recommended: true, logoColor: '#0052CC', logoInitials: 'JC', logoUrl: '/logos/jira.svg', logoBg: '#ffffff' },

  // Collaboration & communication
  { id: 'aha-features', name: 'Aha! Features', publisher: 'Microsoft', description: 'Build, capture, and manage roadmaps.', category: 'Collaboration & communication', logoColor: '#E6173F', logoInitials: 'AF', logoUrl: `${CDN}/aha_catalogue2.png`, logoBg: '#ffffff' },
  { id: 'aha-ideas', name: 'Aha! Ideas', publisher: 'Microsoft', description: 'Capture and manage roadmap with copilot.', category: 'Collaboration & communication', logoColor: '#E6173F', logoInitials: 'AI', logoUrl: `${CDN}/aha_catalogue2.png`, logoBg: '#ffffff' },
  { id: 'azure-devops-wiki', name: 'Azure DevOps Wiki', publisher: 'Microsoft', description: 'Seamless discovery of engineering documentation and team processes.', category: 'Collaboration & communication', logoColor: '#0078D4', logoInitials: 'AW', logoUrl: '/logos/azure-devops.svg', logoBg: '#ffffff' },
  { id: 'box', name: 'Box', publisher: 'Box', description: 'Collaborative file storage platform.', category: 'Collaboration & communication', logoColor: '#0061D5', logoInitials: 'BX', logoUrl: `${CDN}/box_catalogue.png`, logoBg: '#ffffff' },
  { id: 'cb-insights', name: 'CB Insights', publisher: 'CB Insights', description: 'Market research for strategic insights.', category: 'Collaboration & communication', logoColor: '#1A1A2E', logoInitials: 'CB', logoUrl: `${CDN}/cbinsights_catalogue2.png`, logoBg: '#ffffff' },
  { id: 'egnyte', name: 'Egnyte', publisher: 'Microsoft', description: 'Workflow automation.', category: 'Collaboration & communication', logoColor: '#00B2A9', logoInitials: 'EG', logoUrl: `${CDN}/egnyte_catalogue2.png`, logoBg: '#ffffff' },
  { id: 'jira-data-center', name: 'Jira Data Center', publisher: 'Microsoft', description: 'Seamless project management and issue tracking.', category: 'Collaboration & communication', logoColor: '#0052CC', logoInitials: 'JD', logoUrl: '/logos/jira.svg', logoBg: '#ffffff' },
  { id: 'miro', name: 'Miro', publisher: 'Microsoft', description: 'Collaborative whiteboarding platform.', category: 'Collaboration & communication', logoColor: '#FFD02F', logoInitials: 'MI', logoUrl: `${CDN}/miro_catalogue2.png`, logoBg: '#ffffff' },
  { id: 'shortcut', name: 'Shortcut', publisher: 'Microsoft', description: 'Seamless project management and issue tracking.', category: 'Collaboration & communication', logoColor: '#7B68EE', logoInitials: 'SC', logoUrl: `${CDN}/shortcut_catalogue2.png`, logoBg: '#ffffff' },
  { id: 'trello', name: 'Trello', publisher: 'Microsoft', description: 'Visual tool for managing projects.', category: 'Collaboration & communication', logoColor: '#0052CC', logoInitials: 'TR', logoUrl: `${CDN}/trello_catalogue2.png`, logoBg: '#ffffff' },

  // Content management systems (Recommended)
  { id: 'confluence-cloud', name: 'Confluence Cloud', publisher: 'Microsoft', description: 'Collaborative documentation and knowledge sharing.', category: 'Content management systems', recommended: true, logoColor: '#0052CC', logoInitials: 'CF', logoUrl: '/logos/confluence.svg', logoBg: '#ffffff' },
  { id: 'enterprise-websites-cloud', name: 'Enterprise websites Cloud', publisher: 'Microsoft', description: 'Internal websites and intranet owned by your organization.', category: 'Content management systems', recommended: true, logoColor: '#107C10', logoInitials: 'EW', logoUrl: '/logos/enterprise-websites.svg', logoBg: '#ffffff' },
  { id: 'servicenow-knowledge', name: 'ServiceNow Knowledge', publisher: 'Microsoft', description: 'IT service management knowledge articles.', category: 'Content management systems', recommended: true, logoColor: '#62D84E', logoInitials: 'SK', logoUrl: '/logos/servicenow.svg', logoBg: '#ffffff' },

  // Content management systems
  { id: 'adobe-experience-manager-assets', name: 'Adobe Experience Manager Assets', publisher: 'Microsoft', description: 'Manage digital assets across your organization.', category: 'Content management systems', logoColor: '#FF0000', logoInitials: 'AA', logoUrl: `${CDN}/adobe_catalogue2.png`, logoBg: '#ffffff' },
  { id: 'adobe-experience-manager-sites', name: 'Adobe Experience Manager Sites', publisher: 'Microsoft', description: 'Manage digital experiences across web properties.', category: 'Content management systems', logoColor: '#FF0000', logoInitials: 'AS', logoUrl: `${CDN}/adobe_catalogue2.png`, logoBg: '#ffffff' },
  { id: 'coda-enterprise', name: 'Coda Enterprise', publisher: 'Microsoft', description: 'Workflow management and team collaboration.', category: 'Content management systems', logoColor: '#E12D2D', logoInitials: 'CE', logoUrl: `${CDN}/coda_catalogue2.png`, logoBg: '#ffffff' },
  { id: 'confluence-on-premises', name: 'Confluence On-premises', publisher: 'Microsoft', description: 'Collaborative documentation and knowledge sharing.', category: 'Content management systems', logoColor: '#0052CC', logoInitials: 'CO', logoUrl: '/logos/confluence.svg', logoBg: '#ffffff' },
  { id: 'enterprise-websites-on-premises', name: 'Enterprise websites On-premises', publisher: 'Microsoft', description: 'Connect to corporate websites and intranet to index and retrieve enterprise web content.', category: 'Content management systems', logoColor: '#107C10', logoInitials: 'EP', logoUrl: '/logos/enterprise-websites.svg', logoBg: '#ffffff' },
  { id: 'guru', name: 'Guru', publisher: 'Microsoft', description: 'Capture, store, and share company knowledge.', category: 'Content management systems', logoColor: '#7B68EE', logoInitials: 'GU', logoUrl: `${CDN}/guru_catalogue2.png`, logoBg: '#ffffff' },
  { id: 'media-wiki', name: 'MediaWiki', publisher: 'Microsoft', description: 'Collaborative content creation and knowledge management.', category: 'Content management systems', logoColor: '#2C5F8A', logoInitials: 'MW', logoUrl: `${CDN}/mediawiki_catalogue2.png`, logoBg: '#ffffff' },
  { id: 'sp-global-ai-ready-data', name: 'S&P Global AI Ready Data', publisher: 'S&P Global', description: 'Market intelligence & editorial insights.', category: 'Content management systems', logoColor: '#1A1A2E', logoInitials: 'SP', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/e/ee/S%26P_Global_logo.svg', logoBg: '#ffffff' },
  { id: 'salesforce-knowledge', name: 'Salesforce Knowledge', publisher: 'Microsoft', description: 'Manage articles and knowledge base content.', category: 'Content management systems', logoColor: '#00A1E0', logoInitials: 'SK', logoUrl: `${CDN}/salesforce_catalogue2.png`, logoBg: '#ffffff' },
  { id: 'sharepoint-server', name: 'SharePoint Server', publisher: 'Microsoft', description: 'Your on-premises SharePoint documents.', category: 'Content management systems', logoColor: '#036C70', logoInitials: 'SS', logoUrl: `${CDN}/sharepoint_catalogue2.png`, logoBg: '#ffffff' },
  { id: 'stack-overflow', name: 'Stack Overflow', publisher: 'Microsoft', description: 'Question and answer platform for technical knowledge sharing.', category: 'Content management systems', logoColor: '#F48024', logoInitials: 'SO', logoUrl: `${CDN}/stackoverflow_catalogue2.png`, logoBg: '#ffffff' },
  { id: 'unily', name: 'Unily', publisher: 'Microsoft', description: 'Digital workplace platform.', category: 'Content management systems', logoColor: '#4B2082', logoInitials: 'UN', logoUrl: `${CDN}/unily_catalogue2.png`, logoBg: '#ffffff' },
  { id: 'veeva-promomats', name: 'Veeva PromoMats', publisher: 'Microsoft', description: 'Manage content for promotions and offers.', category: 'Content management systems', logoColor: '#F26724', logoInitials: 'VP', logoUrl: `${CDN}/veevavault_catalogue2.png`, logoBg: '#ffffff' },
  { id: 'veeva-qualitydocs', name: 'Veeva QualityDocs', publisher: 'Microsoft', description: 'Quality content management.', category: 'Content management systems', logoColor: '#F26724', logoInitials: 'VQ', logoUrl: `${CDN}/veevavault_catalogue2.png`, logoBg: '#ffffff' },
  { id: 'veeva-rim', name: 'Veeva RIM', publisher: 'Microsoft', description: 'Connect with Veeva for RIM content management.', category: 'Content management systems', logoColor: '#F26724', logoInitials: 'VR', logoUrl: `${CDN}/veevavault_catalogue2.png`, logoBg: '#ffffff' },
  { id: 'wordpress-com', name: 'WordPress.com', publisher: 'Microsoft', description: 'Seamlessly build websites.', category: 'Content management systems', logoColor: '#21759B', logoInitials: 'WC', logoUrl: `${CDN}/wordpress_catalogue2.png`, logoBg: '#ffffff' },
  { id: 'wordpress-org', name: 'WordPress.org', publisher: 'Microsoft', description: 'Seamlessly build websites (on-premises).', category: 'Content management systems', logoColor: '#21759B', logoInitials: 'WO', logoUrl: `${CDN}/wordpress_catalogue2.png`, logoBg: '#ffffff' },

  // Customer relationship management
  { id: 'salesforce-crm', name: 'Salesforce CRM', publisher: 'Microsoft', description: 'Customer relationship management.', category: 'Customer relationship management', logoColor: '#00A1E0', logoInitials: 'SF', logoUrl: `${CDN}/salesforce_catalogue2.png`, logoBg: '#ffffff' },

  // Data visualization
  { id: 'tableau-cloud', name: 'Tableau Cloud', publisher: 'Microsoft', description: 'Advanced data visualization and business intelligence.', category: 'Data visualization', logoColor: '#E97627', logoInitials: 'TC', logoUrl: `${CDN}/tableau_catalogue2.png`, logoBg: '#ffffff' },

  // Databases
  { id: 'azure-sql', name: 'Azure SQL', publisher: 'Microsoft', description: 'Relational database with built-in intelligence.', category: 'Databases', logoColor: '#0078D4', logoInitials: 'SQ', logoUrl: `${CDN}/azuresql_catalogue2.png`, logoBg: '#ffffff' },
  { id: 'csv', name: 'CSV', publisher: 'Microsoft', description: 'Integrate with CSV files for importing structured data from comma-separated values format.', category: 'Databases', logoColor: '#107C10', logoInitials: 'CS', logoUrl: `${CDN}/csv_catalogue2.png`, logoBg: '#ffffff' },
  { id: 'datastax', name: 'DataStax', publisher: 'Microsoft', description: 'Real-time data access.', category: 'Databases', logoColor: '#E8521A', logoInitials: 'DS', logoUrl: `${CDN}/datastax_catalogue2.png`, logoBg: '#ffffff' },
  { id: 'microsoft-sql-server', name: 'Microsoft SQL server', publisher: 'Microsoft', description: 'Enterprise data management and analytics.', category: 'Databases', logoColor: '#CC2927', logoInitials: 'MS', logoUrl: `${CDN}/microsoftsql_catalogue2.png`, logoBg: '#ffffff' },
  { id: 'oracle-sql', name: 'Oracle SQL', publisher: 'Microsoft', description: 'Enterprise-grade data management and storage.', category: 'Databases', logoColor: '#F80000', logoInitials: 'OR', logoUrl: `${CDN}/oraclesql_catalogue2.png`, logoBg: '#ffffff' },
  { id: 'postgresql', name: 'PostgreSQL', publisher: 'Microsoft', description: 'Open-source relational database system.', category: 'Databases', logoColor: '#4169E1', logoInitials: 'PG', logoUrl: `${CDN}/postgresql_catalogue2.png`, logoBg: '#ffffff' },

  // Developer tool (Recommended)
  { id: 'github-cloud-knowledge', name: 'GitHub Cloud Knowledge', publisher: 'Microsoft', description: 'Access Markdown and Text-based documentation in GitHub repositories.', category: 'Developer tool', recommended: true, logoColor: '#24292E', logoInitials: 'GH', logoUrl: '/logos/github.svg', logoBg: '#ffffff' },

  // Developer tool
  { id: 'bitbucket-knowledge-cloud', name: 'Bitbucket Knowledge Cloud', publisher: 'Microsoft', description: 'Git repository management and collaboration.', category: 'Developer tool', logoColor: '#0052CC', logoInitials: 'BK', logoUrl: `${CDN}/bitbucket_catalogue2.png`, logoBg: '#ffffff' },
  { id: 'bitbucket-pull-requests-cloud', name: 'Bitbucket Pull Requests Cloud', publisher: 'Microsoft', description: 'Code review and collaboration.', category: 'Developer tool', logoColor: '#0052CC', logoInitials: 'BP', logoUrl: `${CDN}/bitbucket_catalogue2.png`, logoBg: '#ffffff' },
  { id: 'github-cloud-issues', name: 'GitHub Cloud Issues', publisher: 'Microsoft', description: 'Plan projects and track issues using GitHub Issues.', category: 'Developer tool', logoColor: '#24292E', logoInitials: 'GI', logoUrl: '/logos/github.svg', logoBg: '#ffffff' },
  { id: 'github-cloud-pull-requests', name: 'GitHub Cloud Pull Requests', publisher: 'Microsoft', description: 'Collaborate on code reviews with GitHub Pull Requests.', category: 'Developer tool', logoColor: '#24292E', logoInitials: 'GP', logoUrl: '/logos/github.svg', logoBg: '#ffffff' },
  { id: 'github-server-issues', name: 'GitHub Server Issues', publisher: 'Microsoft', description: 'Connect to Github Issues for project planning and issue tracking capabilities.', category: 'Developer tool', logoColor: '#24292E', logoInitials: 'GS', logoUrl: '/logos/github.svg', logoBg: '#ffffff' },
  { id: 'github-server-knowledge', name: 'GitHub Server Knowledge', publisher: 'Microsoft', description: 'Connect to GitHub repositories specifically for accessing Markdown documentation files.', category: 'Developer tool', logoColor: '#24292E', logoInitials: 'GK', logoUrl: '/logos/github.svg', logoBg: '#ffffff' },
  { id: 'github-server-pull-requests', name: 'GitHub Server Pull Requests', publisher: 'Microsoft', description: 'Collaborate on code using GitLab Pull Requests.', category: 'Developer tool', logoColor: '#24292E', logoInitials: 'GR', logoUrl: '/logos/github.svg', logoBg: '#ffffff' },
  { id: 'gitlab-issues-cloud', name: 'GitLab Issues Cloud', publisher: 'Microsoft', description: 'Track project tasks and bugs using GitLab Issues.', category: 'Developer tool', logoColor: '#FC6D26', logoInitials: 'GC', logoUrl: `${CDN}/gitlab_catalogue2.png`, logoBg: '#ffffff' },
  { id: 'gitlab-issues-server', name: 'GitLab Issues Server', publisher: 'Microsoft', description: 'Track issues and manage projects with GitLab Server.', category: 'Developer tool', logoColor: '#FC6D26', logoInitials: 'GL', logoUrl: `${CDN}/gitlab_catalogue2.png`, logoBg: '#ffffff' },
  { id: 'gitlab-knowledge-cloud', name: 'GitLab Knowledge Cloud', publisher: 'Microsoft', description: "Access GitLab's knowledge base for team documentation.", category: 'Developer tool', logoColor: '#FC6D26', logoInitials: 'GK', logoUrl: `${CDN}/gitlab_catalogue2.png`, logoBg: '#ffffff' },
  { id: 'gitlab-knowledge-server', name: 'GitLab Knowledge Server', publisher: 'Microsoft', description: 'Access internal documentation from GitLab Server.', category: 'Developer tool', logoColor: '#FC6D26', logoInitials: 'GV', logoUrl: `${CDN}/gitlab_catalogue2.png`, logoBg: '#ffffff' },
  { id: 'gitlab-merge-requests-cloud', name: 'GitLab Merge Requests Cloud', publisher: 'Microsoft', description: "Integrate with GitLab's merge request functionality for code review and collaboration.", category: 'Developer tool', logoColor: '#FC6D26', logoInitials: 'GM', logoUrl: `${CDN}/gitlab_catalogue2.png`, logoBg: '#ffffff' },
  { id: 'gitlab-merge-requests-server', name: 'GitLab Merge Requests Server', publisher: 'Microsoft', description: "Integrate with GitLab's merge request functionality for code review and collaboration.", category: 'Developer tool', logoColor: '#FC6D26', logoInitials: 'GE', logoUrl: `${CDN}/gitlab_catalogue2.png`, logoBg: '#ffffff' },

  // Files and documents (Recommended)
  { id: 'file-share', name: 'FileShare', publisher: 'Microsoft', description: 'Traditional network file shares for accessing on-premises documents.', category: 'Files and documents', recommended: true, logoColor: '#FFB900', logoInitials: 'FS', logoUrl: '/logos/fileshare.png', logoBg: '#ffffff' },
  { id: 'google-drive', name: 'Google Drive', publisher: 'Microsoft', description: 'File storage and synchronization.', category: 'Files and documents', recommended: true, logoColor: '#4285F4', logoInitials: 'GD', logoUrl: '/logos/google-drive.svg', logoBg: '#ffffff' },

  // Files and documents
  { id: 'azure-data-lake', name: 'ADLS Gen2', publisher: 'Microsoft', description: 'Enterprise-grade hierarchical file system over cloud storage.', category: 'Files and documents', logoColor: '#0078D4', logoInitials: 'DL', logoUrl: `${CDN}/adls_catalogue2.png`, logoBg: '#ffffff' },
  { id: 'amazon-s3', name: 'Amazon S3', publisher: 'Microsoft', description: 'Integration with Amazon S3 for file storage and synchronization.', category: 'Files and documents', logoColor: '#FF9900', logoInitials: 'S3', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/b/bc/Amazon-S3-Logo.svg', logoBg: '#ffffff' },
  { id: 'azure-file-share', name: 'Azure File Share', publisher: 'Microsoft', description: 'Manage file shares in the cloud.', category: 'Files and documents', logoColor: '#0078D4', logoInitials: 'AF', logoUrl: `${CDN}/azurefileshare_catalogue2.png`, logoBg: '#ffffff' },
  { id: 'dropbox', name: 'Dropbox', publisher: 'Microsoft', description: 'File storage, sharing, and collaboration.', category: 'Files and documents', logoColor: '#0061FF', logoInitials: 'DB', logoUrl: `${CDN}/dropbox_catalogue2.png`, logoBg: '#ffffff' },

  // Human resources & recruiting
  { id: '15five-high-fives', name: '15Five High Fives', publisher: 'Microsoft', description: 'Recognize team achievements.', category: 'Human resources & recruiting', logoColor: '#4CAF50', logoInitials: 'HF', logoUrl: `${CDN}/fifteenfive_catalogue2.png`, logoBg: '#ffffff' },
  { id: '15five-priorities', name: '15Five Priorities', publisher: 'Microsoft', description: 'Track and align team objectives.', category: 'Human resources & recruiting', logoColor: '#4CAF50', logoInitials: 'HP', logoUrl: `${CDN}/fifteenfive_catalogue2.png`, logoBg: '#ffffff' },
  { id: 'bamboohr-profiles', name: 'BambooHR Profiles', publisher: 'Microsoft', description: 'Sync BambooHR profiles.', category: 'Human resources & recruiting', logoColor: '#73AC39', logoInitials: 'BH', logoBg: '#ffffff' },
  { id: 'sap-successfactors', name: 'SAP SuccessFactors', publisher: 'Microsoft', description: 'Connect to SAP SuccessFactors.', category: 'Human resources & recruiting', logoColor: '#0FAAFF', logoInitials: 'SA', logoUrl: `${CDN}/sap_catalogue2.png`, logoBg: '#ffffff' },
  { id: 'workday', name: 'Workday', publisher: 'Microsoft', description: 'Securely sync organizational data.', category: 'Human resources & recruiting', logoColor: '#F5821F', logoInitials: 'WD', logoUrl: `${CDN}/workday_catalogue_new.svg`, logoBg: '#ffffff' },

  // IT service management tools (Recommended)
  { id: 'servicenow-catalog', name: 'ServiceNow Catalog', publisher: 'Microsoft', description: 'IT service request management.', category: 'IT service management tools', recommended: true, logoColor: '#62D84E', logoInitials: 'SN', logoUrl: '/logos/servicenow.svg', logoBg: '#ffffff' },
  { id: 'servicenow-tickets', name: 'ServiceNow Tickets', publisher: 'Microsoft', description: 'Customer service ticketing system.', category: 'IT service management tools', recommended: true, logoColor: '#62D84E', logoInitials: 'ST', logoUrl: '/logos/servicenow.svg', logoBg: '#ffffff' },

  // IT service management tools
  { id: 'freshservice', name: 'Freshservice', publisher: 'Microsoft', description: 'Enhance team collaboration.', category: 'IT service management tools', logoColor: '#19A974', logoInitials: 'FR', logoUrl: `${CDN}/freshservice_catalogue2.png`, logoBg: '#ffffff' },
  { id: 'pagerduty-escalation-policies', name: 'PagerDuty Escalation Policies', publisher: 'Microsoft', description: 'Incident escalation policy insights.', category: 'IT service management tools', logoColor: '#06AC38', logoInitials: 'PE', logoUrl: `${CDN}/pagerduty_catalogue2.png`, logoBg: '#ffffff' },
  { id: 'pagerduty-schedules', name: 'PagerDuty Schedules', publisher: 'Microsoft', description: 'Track incident on-call schedules.', category: 'IT service management tools', logoColor: '#06AC38', logoInitials: 'PD', logoUrl: `${CDN}/pagerduty_catalogue2.png`, logoBg: '#ffffff' },

  // Project management
  { id: 'asana', name: 'Asana', publisher: 'Microsoft', description: 'Project management platform.', category: 'Project management', logoColor: '#F06A6A', logoInitials: 'AS', logoUrl: `${CDN}/asana_catalogue2.png`, logoBg: '#ffffff' },
  { id: 'monday-com', name: 'monday.com', publisher: 'Microsoft', description: 'Workflow management and team collaboration.', category: 'Project management', logoColor: '#F62B54', logoInitials: 'MO', logoUrl: `${CDN}/monday_catalogue2.png`, logoBg: '#ffffff' },
  { id: 'smartsheet', name: 'Smartsheet Sheet', publisher: 'Microsoft', description: 'Collaborative project planning and execution.', category: 'Project management', logoColor: '#00A2E0', logoInitials: 'SS', logoUrl: `${CDN}/smartsheet_catalogue2.png`, logoBg: '#ffffff' },

  // Sales (Recommended)
  { id: 'gong', name: 'Gong', publisher: 'Microsoft', description: 'Sales call transcripts to uncover actionable insights.', category: 'Sales', recommended: true, logoColor: '#A259FF', logoInitials: 'GO', logoUrl: '/logos/gong.svg', logoBg: '#ffffff' },

  // Support
  { id: 'zendesk-help', name: 'Zendesk Help Center', publisher: 'Microsoft', description: 'Customer service knowledge base access.', category: 'Support', logoColor: '#00363D', logoInitials: 'ZH', logoUrl: `${CDN}/zendesk_catalogue2.png`, logoBg: '#ffffff' },
  { id: 'zendesk-tickets', name: 'Zendesk Ticket', publisher: 'Microsoft', description: 'Customer support ticketing system.', category: 'Support', logoColor: '#00363D', logoInitials: 'ZD', logoUrl: `${CDN}/zendesk_catalogue2.png`, logoBg: '#ffffff' },
];
