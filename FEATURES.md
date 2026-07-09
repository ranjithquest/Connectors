# Feature Registry

A living list of concept branches. To resume a feature, check out its branch and ask your coding assistant to continue.

---

## Features

### item-deletion
| | |
|---|---|
| **Branch** | `ranjith/item-deletion` |
| **Status** | In progress |
| **Preview** | https://studious-adventure-j17vp6o.pages.github.io/ranjith/item-deletion/connectors |
| **Description** | User-created connector deletion from the connections list. Also includes auth expired banner on the Your Connections page and connector detail panel (Details tab), with Re-authenticate and View errors actions. |
| **Key files** | `app/(app)/connectors/page.tsx`, `components/connectors/ConnectorDetailPanel.tsx`, `components/connectors/AuthExpiredBanner.tsx` |

---

### actionable-errors
| | |
|---|---|
| **Branch** | `ranjith/actionable-errors` |
| **Status** | In progress |
| **Preview** | — |
| **Description** | Error tab in the connector detail panel showing actionable issues — each error card has severity badge, title, description, Copilot impact, and recommended fix actions the user can take (re-authenticate, check permissions, retry sync, etc.). |
| **Key files** | `components/connectors/ConnectorDetailPanel.tsx`, `lib/mock-data.ts` |

---

## How to resume a feature

1. Check out the branch: `git checkout <branch>`
2. Tell Copilot: *"Resume the [feature-name] feature"*
3. Copilot will read this file and pick up where you left off.
