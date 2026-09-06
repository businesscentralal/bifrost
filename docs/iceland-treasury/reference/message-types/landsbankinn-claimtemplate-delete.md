---
id: landsbankinn-claimtemplate-delete
title: "Landsbankinn.ClaimTemplate.Delete"
sidebar_label: "Landsbankinn.ClaimTemplate.Delete"
sidebar_position: 106
description: "Request and response contract for the Landsbankinn.ClaimTemplate.Delete Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


Deletes (soft-deletes) a claim template at Landsbankinn.

API reference: https://developers.landsbankinn.is/docs/documentation-external-claimtemplates/1/routes/ClaimTemplates/%7Bid%7D/delete

## Important
- Only templates with **no active unpaid claims** can be deleted.
- Deleted templates are **soft-deleted** — they remain accessible but cannot be used for new claims.
- Deletion is **irreversible** — deleted templates cannot be re-activated. Create a new template instead.

## Request
```json
{ "templateId": "884" }
```

| Field | Type | Description |
|---|---|---|
| `templateId` | string | **Required.** The template ID to delete. |

## Response
Returns **202 Accepted**:
```json
{ "status": "Deleted", "templateId": "884", "logEntryNo": 123 }
```

