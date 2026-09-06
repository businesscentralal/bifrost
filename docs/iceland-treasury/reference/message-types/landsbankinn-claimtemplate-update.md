---
id: landsbankinn-claimtemplate-update
title: "Landsbankinn.ClaimTemplate.Update"
sidebar_label: "Landsbankinn.ClaimTemplate.Update"
sidebar_position: 110
description: "Request and response contract for the Landsbankinn.ClaimTemplate.Update Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


Updates an existing claim template (kröfusniðmát) at Landsbankinn.

API reference: https://developers.landsbankinn.is/docs/documentation-external-claimtemplates/1/routes/ClaimTemplates/%7Bid%7D/put

## Request
Pass `templateId` to identify the template, plus the ClaimTemplateUpdate fields to change.

### Required fields
| Field | Type | Description |
|---|---|---|
| `templateId` | string | The template ID (used in URL, not sent in body). |

### Updatable fields
| Field | Type | Description |
|---|---|---|
| `name` | string (0-60) | Display name. ISO 8859-1, punctuation: . , - _ |
| `status` | string | **active** or **deleted**. Deleted = soft-delete, cannot be re-activated. |
| `depositingAccountBban` | string (5-14) | Must keep same currency as original. |
| `withdrawalAccountBban` | string (5-14) | Must be at Landsbankinn. |
| `claimantStatementEndToEndId` | string | Values: **dueDate**, **billNumber**, **claimNumber**. |
| `claimantStatementExtendedReferenceType` | string | Values: **referenceNumber**, **customerNumber**, **compositeClaimNumber**, **payorId**, **dueDate**. |
| `additionalDepositingAccounts` | object | Advanced deposit routing. |
| `newClaimPresets` | object | Default settings for new claims. |

### Immutable (cannot change after creation)
`type`, `claimantNationalId`, `categoryCode`, `branchId`, `currency`.

## Example
```json
{
  "templateId": "884",
  "name": "Updated Name",
  "status": "active",
  "depositingAccountBban": "013326019507",
  "withdrawalAccountBban": "013326019507"
}
```

## Response
Returns **202 Accepted**:
```json
{ "status": "Accepted", "logEntryNo": 123 }
```

