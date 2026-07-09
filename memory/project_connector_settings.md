---
name: Connector-specific setup fields
description: Each gallery connector has unique source-specific setup fields + shared common fields (connection name, rollout to limited audience)
type: project
---

Each connector in the gallery has its own unique setup fields. These are defined in `SETUP_CONFIGS` in `components/connectors/SetupPanel.tsx` (keyed by `ConnectorCatalogItem.id`).

**Why:** Connectors connect to different data sources with different auth models and instance identifiers — a one-size-fits-all form doesn't work.

**How to apply:** Whenever adding or editing a connector's setup fields, update **both**:
1. `SETUP_CONFIGS` in `components/connectors/SetupPanel.tsx` — simple setup flow
2. The corresponding section in `components/connectors/AdvancedSetupPanel.tsx` — advanced setup flow
3. The **Edit Panel** (EditPanel / ConnectorDetailPanel edit mode) — must mirror the same fields so existing connectors can be updated

## Miro (`id: 'miro'`)
- **Instance field**: "Company (Organization) ID" — numeric ID, placeholder: `Miro company id example: 3458764625687941342`
- **Instance heading**: "Provide basic information about your URL"
- **Auth heading**: "Authenticate your Miro instance"
- **Auth options**: OAuth 2.0 only
- **Rollout toggle**: yes
- **Install note**: install the Microsoft 365 Copilot Miro App
