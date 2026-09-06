---
id: landsbankinn-claimtemplate-create
title: "Landsbankinn.ClaimTemplate.Create"
sidebar_label: "Landsbankinn.ClaimTemplate.Create"
sidebar_position: 105
description: "Request and response contract for the Landsbankinn.ClaimTemplate.Create Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


Creates a new claim template (kröfusniðmát) at Landsbankinn.

API reference: https://developers.landsbankinn.is/docs/documentation-external-claimtemplates/1/routes/ClaimTemplates/post

## Request
The request body is a ClaimTemplateCreation object. Pass the entire JSON body as the request.

### Required fields
| Field | Type | Description |
|---|---|---|
| `type` | string | Template type. **primaryCollection** (default invoicing), **secondaryCollection** (auto-created for moved claims), **optionalCollection** (voluntary payments). |
| `depositingAccountBban` | string (5-14) | BBAN of the depositing account. Determines currency. Cannot change currency after creation. Must be open for deposits. |
| `withdrawalAccountBban` | string (5-14) | BBAN of the service-fee withdrawal account. Must be at Landsbankinn. |

### Optional fields
| Field | Type | Default | Description |
|---|---|---|---|
| `name` | string (0-60) | Category code name | Display name. ISO 8859-1 chars only. Allowed punctuation: . , - _ |
| `claimantNationalId` | string (10-11) | Caller's kennitala | Owner of the template. Immutable after creation. |
| `categoryCode` | string (exactly 2) | "37" (Reikningur) | Textalykill — affects direct debit mandates. Immutable after creation. |
| `claimantStatementEndToEndId` | string | — | Short reference on bank statement. Values: **dueDate** (0DDMMYY), **billNumber**, **claimNumber** (last 6 digits). |
| `claimantStatementExtendedReferenceType` | string | — | 16-char reference on bank statement. Values: **referenceNumber**, **customerNumber**, **compositeClaimNumber**, **payorId**, **dueDate**. |
| `additionalDepositingAccounts` | object | — | Advanced deposit routing: separate BBANs for fees, interest, costs. Contains principalDeduction rules. |
| `newClaimPresets` | object | — | Default settings for new claims: partial payments, payment sequence, notifications, fees, discounts, default charges, secondary collection. |

### Immutable after creation
`type`, `claimantNationalId`, `categoryCode`, `branchId` (always "0133"), `currency` (from depositing account).

## Example
```json
{
  "type": "primaryCollection",
  "name": "Reikningar",
  "claimantNationalId": "5501011234",
  "categoryCode": "37",
  "depositingAccountBban": "013326019507",
  "withdrawalAccountBban": "013326019507",
  "claimantStatementEndToEndId": "claimNumber",
  "claimantStatementExtendedReferenceType": "referenceNumber"
}
```

## Response
Returns **202 Accepted** with the new template ID:
```json
{ "id": "884", "logEntryNo": 123 }
```

