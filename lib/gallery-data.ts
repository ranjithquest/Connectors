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
  'Data visualisation',
  'Databases',
  'Enterprise resource planning',
  'File systems',
  'IT service management tools',
  'Sales & support',
  'Others',
] as const;

export const CONNECTOR_CATALOG: ConnectorCatalogItem[] = [
  // Recommended
  { id: 'azure-devops-work-items', name: 'Azure DevOps work items', publisher: 'Microsoft', description: 'Seamless issue tracking.', category: 'IT service management tools', recommended: true, logoColor: '#0078D4', logoInitials: 'AZ', logoUrl: '/logos/azure-devops.png', logoBg: '#ffffff' },
  { id: 'confluence-cloud', name: 'Confluence cloud', publisher: 'Microsoft', description: 'Collaborative documentation and knowledge base platform.', category: 'Content management systems', recommended: true, logoColor: '#0052CC', logoInitials: 'CF', logoUrl: '/logos/confluence.png', logoBg: '#ffffff' },
  { id: 'enterprise-websites', name: 'Enterprise websites', publisher: 'Microsoft', description: 'Internal websites and intranets owned by your organization.', category: 'Content management systems', recommended: true, logoColor: '#107C10', logoInitials: 'EW', logoUrl: '/logos/enterprise-websites.png', logoBg: '#ffffff' },
  { id: 'file-share', name: 'File share', publisher: 'Microsoft', description: 'Traditional network file shares for accessing organizational files.', category: 'File systems', recommended: true, logoColor: '#FFB900', logoInitials: 'FS' },
  { id: 'github-cloud-knowledge', name: 'Github cloud knowledge', publisher: 'Microsoft', description: 'Collaborate on code reviews with GitHub Pull Requests and issues.', category: 'Collaboration & communication', recommended: true, logoColor: '#24292E', logoInitials: 'GH', logoUrl: '/logos/github.png', logoBg: '#ffffff' },
  { id: 'gong', name: 'Gong', publisher: 'Microsoft', description: 'Sales call transcripts to uncover actionable insights.', category: 'Sales & support', recommended: true, logoColor: '#A259FF', logoInitials: 'GO' },
  { id: 'google-drive', name: 'Google drive', publisher: 'Microsoft', description: 'File storage and synchronization.', category: 'File systems', recommended: true, logoColor: '#4285F4', logoInitials: 'GD', logoUrl: '/logos/google-drive.png', logoBg: '#ffffff' },
  { id: 'jira-cloud', name: 'Jira cloud', publisher: 'Microsoft', description: 'Project management and issue tracking.', category: 'IT service management tools', recommended: true, logoColor: '#0052CC', logoInitials: 'JC', logoUrl: '/logos/jira.png', logoBg: '#ffffff' },
  { id: 'servicenow-catalog', name: 'ServiceNow catalog', publisher: 'Microsoft', description: 'IT service request management.', category: 'IT service management tools', recommended: true, logoColor: '#62D84E', logoInitials: 'SN' },
  { id: 'servicenow-knowledge', name: 'ServiceNow knowledge', publisher: 'Microsoft', description: 'ServiceNow knowledge articles.', category: 'IT service management tools', recommended: true, logoColor: '#62D84E', logoInitials: 'SK' },
  { id: 'servicenow-tickets', name: 'ServiceNow tickets', publisher: 'Microsoft', description: 'Customer service ticketing system.', category: 'IT service management tools', recommended: true, logoColor: '#62D84E', logoInitials: 'ST' },
  { id: 'slack', name: 'Slack', publisher: 'Microsoft', description: 'Messaging platform that enhances team collaboration.', category: 'Collaboration & communication', recommended: true, logoColor: '#4A154B', logoInitials: 'SL', logoUrl: '/logos/slack.png', logoBg: '#ffffff' },

  // Collaboration & communication
  { id: 'asana', name: 'Asana', publisher: 'Microsoft', description: 'Project and task management tool.', category: 'Collaboration & communication', logoColor: '#F06A6A', logoInitials: 'AS', logoUrl: '/logos/asana.png', logoBg: '#ffffff' },
  { id: 'miro', name: 'Miro', publisher: 'Microsoft', description: 'Online collaborative whiteboard platform.', category: 'Collaboration & communication', logoColor: '#FFD02F', logoInitials: 'MI', logoUrl: '/logos/miro.png', logoBg: '#ffffff' },
  { id: 'monday-com', name: 'Monday.com', publisher: 'Microsoft', description: 'Work operating system for teams.', category: 'Collaboration & communication', logoColor: '#F62B54', logoInitials: 'MO', logoUrl: '/logos/monday.png', logoBg: '#ffffff' },
  { id: 'trello', name: 'Trello', publisher: 'Microsoft', description: 'Visual project management boards.', category: 'Collaboration & communication', logoColor: '#0052CC', logoInitials: 'TR', logoUrl: '/logos/trello.png', logoBg: '#ffffff' },
  { id: 'zoom', name: 'Zoom', publisher: 'Microsoft', description: 'Video conferencing and meeting platform.', category: 'Collaboration & communication', logoColor: '#2D8CFF', logoInitials: 'ZM', logoUrl: '/logos/zoom.png', logoBg: '#ffffff' },

  // Content management systems
  { id: 'confluence-on-premises', name: 'Confluence on-premises', publisher: 'Microsoft', description: 'Self-hosted Confluence knowledge base.', category: 'Content management systems', logoColor: '#0052CC', logoInitials: 'CO', logoUrl: '/logos/confluence.png', logoBg: '#ffffff' },
  { id: 'guru', name: 'Guru', publisher: 'Microsoft', description: 'Company wiki and knowledge management.', category: 'Content management systems', logoColor: '#7B68EE', logoInitials: 'GU' },
  { id: 'media-wiki', name: 'MediaWiki', publisher: 'Microsoft', description: 'Open-source wiki software platform.', category: 'Content management systems', logoColor: '#2C5F8A', logoInitials: 'MW' },
  { id: 'seismic', name: 'Seismic', publisher: 'Microsoft', description: 'Sales enablement and content management.', category: 'Content management systems', logoColor: '#00A1E0', logoInitials: 'SE' },
  { id: 'sharepoint-on-premises', name: 'SharePoint on-premises', publisher: 'Microsoft', description: 'Self-hosted SharePoint collaboration platform.', category: 'Content management systems', logoColor: '#036C70', logoInitials: 'SP', logoUrl: '/logos/sharepoint.png', logoBg: '#ffffff' },
  { id: 'stack-overflow', name: 'Stack Overflow', publisher: 'Microsoft', description: 'Q&A platform for developers.', category: 'Content management systems', logoColor: '#F48024', logoInitials: 'SO', logoUrl: '/logos/stackoverflow.png', logoBg: '#ffffff' },
  { id: 'unily', name: 'Unily', publisher: 'Microsoft', description: 'Employee experience platform.', category: 'Content management systems', logoColor: '#4B2082', logoInitials: 'UN' },
  { id: 'wordpress', name: 'WordPress', publisher: 'Microsoft', description: 'Open-source content management system.', category: 'Content management systems', logoColor: '#21759B', logoInitials: 'WP', logoUrl: '/logos/wordpress.png', logoBg: '#ffffff' },

  // Customer relationship management
  { id: 'salesforce', name: 'Salesforce', publisher: 'Microsoft', description: 'Customer relationship management platform.', category: 'Customer relationship management', logoColor: '#00A1E0', logoInitials: 'SF', logoUrl: '/logos/salesforce.png', logoBg: '#ffffff' },

  // Data visualisation
  { id: 'tableau-cloud', name: 'Tableau cloud', publisher: 'Microsoft', description: 'Cloud-based data visualization and analytics.', category: 'Data visualisation', logoColor: '#E97627', logoInitials: 'TC', logoUrl: '/logos/tableau.png', logoBg: '#ffffff' },

  // Databases
  { id: 'azure-data-lake', name: 'Azure Data Lake Storage Gen2', publisher: 'Microsoft', description: 'Scalable data lake for big data analytics.', category: 'Databases', logoColor: '#0078D4', logoInitials: 'DL', logoUrl: '/logos/azure.png', logoBg: '#ffffff' },
  { id: 'azure-sql', name: 'Azure SQL', publisher: 'Microsoft', description: 'Managed relational database in the cloud.', category: 'Databases', logoColor: '#0078D4', logoInitials: 'SQ', logoUrl: '/logos/sql-server.png', logoBg: '#ffffff' },
  { id: 'microsoft-sql-server', name: 'Microsoft SQL Server', publisher: 'Microsoft', description: 'Enterprise relational database management system.', category: 'Databases', logoColor: '#CC2927', logoInitials: 'MS', logoUrl: '/logos/sql-server.png', logoBg: '#ffffff' },
  { id: 'oracle-sql', name: 'Oracle SQL', publisher: 'Microsoft', description: 'Enterprise database management by Oracle.', category: 'Databases', logoColor: '#F80000', logoInitials: 'OR', logoUrl: '/logos/oracle.png', logoBg: '#ffffff' },
  { id: 'postgresql', name: 'PostgreSQL', publisher: 'Microsoft', description: 'Open-source object-relational database system.', category: 'Databases', logoColor: '#4169E1', logoInitials: 'PG', logoUrl: '/logos/postgresql.png', logoBg: '#ffffff' },

  // Enterprise resource planning
  { id: 'sap', name: 'SAP', publisher: 'Microsoft', description: 'Enterprise resource planning software.', category: 'Enterprise resource planning', logoColor: '#0FAAFF', logoInitials: 'SA', logoUrl: '/logos/sap.png', logoBg: '#ffffff' },

  // File systems
  { id: 'box', name: 'Box', publisher: 'Microsoft', description: 'Cloud content management and file sharing.', category: 'File systems', logoColor: '#0061D5', logoInitials: 'BX', logoUrl: '/logos/box.png', logoBg: '#ffffff' },
  { id: 'dropbox', name: 'Dropbox', publisher: 'Microsoft', description: 'Cloud storage and file synchronization.', category: 'File systems', logoColor: '#0061FF', logoInitials: 'DB', logoUrl: '/logos/dropbox.png', logoBg: '#ffffff' },
  { id: 'egnyte', name: 'Egnyte', publisher: 'Microsoft', description: 'Hybrid cloud file management platform.', category: 'File systems', logoColor: '#00B2A9', logoInitials: 'EG', logoUrl: '/logos/egnyte.png', logoBg: '#ffffff' },

  // IT service management tools
  { id: 'azure-devops-wiki', name: 'Azure DevOps wiki', publisher: 'Microsoft', description: 'Team documentation and wiki in Azure DevOps.', category: 'IT service management tools', logoColor: '#0078D4', logoInitials: 'AW', logoUrl: '/logos/azure-devops.png', logoBg: '#ffffff' },
  { id: 'freshservice', name: 'FreshService', publisher: 'Microsoft', description: 'IT service management and helpdesk.', category: 'IT service management tools', logoColor: '#19A974', logoInitials: 'FR' },
  { id: 'gitlab-issues', name: 'GitLab issues', publisher: 'Microsoft', description: 'Issue tracking in GitLab projects.', category: 'IT service management tools', logoColor: '#FC6D26', logoInitials: 'GI', logoUrl: '/logos/gitlab.png', logoBg: '#ffffff' },
  { id: 'jira-data-center', name: 'Jira Data Center', publisher: 'Microsoft', description: 'Self-managed Jira for large enterprises.', category: 'IT service management tools', logoColor: '#0052CC', logoInitials: 'JD', logoUrl: '/logos/jira.png', logoBg: '#ffffff' },
  { id: 'pagerduty-schedules', name: 'PagerDuty schedules', publisher: 'Microsoft', description: 'On-call scheduling and incident management.', category: 'IT service management tools', logoColor: '#06AC38', logoInitials: 'PD', logoUrl: '/logos/pagerduty.png', logoBg: '#ffffff' },
  { id: 'zendesk-tickets', name: 'Zendesk tickets', publisher: 'Microsoft', description: 'Customer support ticketing system.', category: 'IT service management tools', logoColor: '#00363D', logoInitials: 'ZD', logoUrl: '/logos/zendesk.png', logoBg: '#ffffff' },
  { id: 'zendesk-help', name: 'Zendesk help center', publisher: 'Microsoft', description: 'Customer-facing knowledge base articles.', category: 'IT service management tools', logoColor: '#00363D', logoInitials: 'ZH', logoUrl: '/logos/zendesk.png', logoBg: '#ffffff' },

  // Sales & support
  { id: 'workday', name: 'Workday', publisher: 'Microsoft', description: 'Human capital and financial management.', category: 'Sales & support', logoColor: '#F5821F', logoInitials: 'WD', logoUrl: '/logos/workday.png', logoBg: '#ffffff' },

  // Others
  { id: 'csv', name: 'CSV', publisher: 'Microsoft', description: 'Import data from comma-separated value files.', category: 'Others', logoColor: '#107C10', logoInitials: 'CS' },
  { id: 'custom-connector', name: 'Custom connector', publisher: 'Microsoft', description: 'Build a connector for any data source.', category: 'Created by your org', logoColor: '#6264A7', logoInitials: 'CC' },
  { id: 'smartsheet', name: 'Smartsheet', publisher: 'Microsoft', description: 'Collaborative work management platform.', category: 'Others', logoColor: '#00A2E0', logoInitials: 'SS' },
];
