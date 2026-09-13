---
id: landsbankinn-claimtemplate-create
title: "Landsbankinn.ClaimTemplate.Create"
sidebar_label: "Landsbankinn.ClaimTemplate.Create"
sidebar_position: 105
description: "Beiðni- og svarsamningur fyrir Landsbankinn.ClaimTemplate.Create Bifrastar-skilaboðagerð."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálpar-codeunit skilaboðagerðarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálpar-codeunitinu í forritinu, ekki þessari skrá.
:::


Býr til a new claim template (kröfusniðmát) at Landsbankinn.

API reference: https://developers.landsbankinn.er/docs/documentation-external-claimtemplates/1/routes/ClaimTemplates/post

## Beiðni
Beiðnin body er a ClaimTemplateCreation object. Pass the entire JSON body as Beiðnin.

### nauðsynlegt fields
| Reitur | Gerð | Lýsing |
|---|---|---|
| `type` | string | Template Gerð. **primaryCollection** (default invoicing), **secondaryCollection** (auto-created fyrir moved claims), **optionalCollection** (voluntary greiðslur). |
| `depositingAccountBban` | string (5-14) | BBAN of the depositing reikningur. Determines currency. Cannot change currency eftir creation. verður að be open fyrir deposits. |
| `withdrawalAccountBban` | string (5-14) | BBAN of the service-fee withdrawal reikningur. verður að be at Landsbankinn. |

### valfrjálst fields
| Reitur | Gerð | Default | Lýsing |
|---|---|---|---|
| `name` | string (0-60) | Category code Heiti | Display Heiti. ISO 8859-1 chars Aðeins. Allowed punctuation: . , - _ |
| `claimantNationalId` | string (10-11) | Caller's kennitala | Owner of the template. Immutable eftir creation. |
| `categoryCode` | string (exactly 2) | "37" (Reikningur) | Textalykill — affects direct debit mandates. Immutable eftir creation. |
| `claimantStatementEndToEndId` | string | — | Short reference on bank statement. Values: **dueDate** (0DDMMYY), **billNumber**, **claimNumber** (last 6 digits). |
| `claimantStatementExtendedReferenceType` | string | — | 16-char reference on bank statement. Values: **referenceNumber**, **customerNumber**, **compositeClaimNumber**, **payorId**, **dueDate**. |
| `additionalDepositingAccounts` | object | — | Advanced deposit routing: separate BBANs fyrir fees, interest, costs. Contains principalDeduction rules. |
| `newClaimPresets` | object | — | Default settings fyrir new claims: partial greiðslur, greiðsla sequence, notifications, fees, discounts, default charges, secondary collection. |

### Immutable eftir creation
`type`, `claimantNationalId`, `categoryCode`, `branchId` (always "0133"), `currency` (frá depositing reikningur).

## Dæmi
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

## Svar
Skilar **202 Accepted** með the new template ID:
```json
{ "id": "884", "logEntryNo": 123 }
```


