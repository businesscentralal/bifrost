---
id: landsbankinn-claimtemplate-update
title: "Landsbankinn.ClaimTemplate.Update"
sidebar_label: "Landsbankinn.ClaimTemplate.Update"
sidebar_position: 110
description: "Beiðni- og svarsamningur fyrir Landsbankinn.ClaimTemplate.Update Bifrastar-skilaboðagerð."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálpar-codeunit skilaboðagerðarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálpar-codeunitinu í forritinu, ekki þessari skrá.
:::


Uppfærir an existing claim template (kröfusniðmát) at Landsbankinn.

API reference: https://developers.landsbankinn.er/docs/documentation-external-claimtemplates/1/routes/ClaimTemplates/%7Bid%7D/put

## Beiðni
Pass `templateId` til identify the template, plus the ClaimTemplateUpdate fields til change.

### nauðsynlegt fields
| Reitur | Gerð | Lýsing |
|---|---|---|
| `templateId` | string | The template ID (used in URL, not sent in body). |

### Updatable fields
| Reitur | Gerð | Lýsing |
|---|---|---|
| `name` | string (0-60) | Display Heiti. ISO 8859-1, punctuation: . , - _ |
| `status` | string | **active** eða **deleted**. Deleted = soft-delete, cannot be re-activated. |
| `depositingAccountBban` | string (5-14) | verður að keep same currency as original. |
| `withdrawalAccountBban` | string (5-14) | verður að be at Landsbankinn. |
| `claimantStatementEndToEndId` | string | Values: **dueDate**, **billNumber**, **claimNumber**. |
| `claimantStatementExtendedReferenceType` | string | Values: **referenceNumber**, **customerNumber**, **compositeClaimNumber**, **payorId**, **dueDate**. |
| `additionalDepositingAccounts` | object | Advanced deposit routing. |
| `newClaimPresets` | object | Default settings fyrir new claims. |

### Immutable (cannot change eftir creation)
`type`, `claimantNationalId`, `categoryCode`, `branchId`, `currency`.

## Dæmi
```json
{
  "templateId": "884",
  "name": "Updated Name",
  "status": "active",
  "depositingAccountBban": "013326019507",
  "withdrawalAccountBban": "013326019507"
}
```

## Svar
Skilar **202 Accepted**:
```json
{ "status": "Accepted", "logEntryNo": 123 }
```


