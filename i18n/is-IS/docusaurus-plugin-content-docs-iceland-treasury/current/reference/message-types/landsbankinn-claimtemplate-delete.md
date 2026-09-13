---
id: landsbankinn-claimtemplate-delete
title: "Landsbankinn.ClaimTemplate.Delete"
sidebar_label: "Landsbankinn.ClaimTemplate.Delete"
sidebar_position: 106
description: "Beiðni- og svarsamningur fyrir Landsbankinn.ClaimTemplate.Delete Bifrastar-skilaboðagerð."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálpar-codeunit skilaboðagerðarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálpar-codeunitinu í forritinu, ekki þessari skrá.
:::


Eyðir (soft-Eyðir) a claim template at Landsbankinn.

API reference: https://developers.landsbankinn.er/docs/documentation-external-claimtemplates/1/routes/ClaimTemplates/%7Bid%7D/delete

## Important
- Aðeins templates með **no active unpaid claims** getur be deleted.
- Deleted templates eru **soft-deleted** — they remain accessible but cannot be used fyrir new claims.
- Deletion er **irreversible** — deleted templates cannot be re-activated. Create a new template instead.

## Beiðni
```json
{ "templateId": "884" }
```

| Reitur | Gerð | Lýsing |
|---|---|---|
| `templateId` | string | **nauðsynlegt.** The template ID til delete. |

## Svar
Skilar **202 Accepted**:
```json
{ "status": "Deleted", "templateId": "884", "logEntryNo": 123 }
```


