---
id: landsbankinn-account-list
title: "Landsbankinn.Account.List"
sidebar_label: "Landsbankinn.Account.List"
sidebar_position: 73
description: "Beiðni- og svarsamningur fyrir Landsbankinn.reikningur.Listi Bifrastar-skilaboðagerð."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálpar-codeunit skilaboðagerðarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálpar-codeunitinu í forritinu, ekki þessari skrá.
:::


Lists Allt bank accounts accessible via the system access at Landsbankinn.

**Stefna:** Outbound  
**Efnisgerð:** text/json

## Beiðni
```json
{ "skip": 0, "take": 50 }
```

| Parameter | Gerð | nauðsynlegt | Lýsing |
|---|---|---|---|
| `ownerNationalId` | string | no | Filter accounts by owner kennitala. |
| `skip` | integer | no | Number of færslur til skip (default 0). |
| `take` | integer | no | Number of færslur til return (default Allt). |

## Svar
```json
{
  "data": [...],
  "page": 1,
  "perPage": 50,
  "totalItems": 3,
  "logEntryNo": 123
}
```
`totalItems` er the total number of færslur available at the bank (frá `X-Paging-TotalItems` header).

## Leiðbeiningar fyrir gervigreind/umboð
Notaðu this til discover which accounts eru available áður en querying færslur.

## Validation rules (frá Landsbankinn API spec)
- **BBAN**: 5-14 chars, pattern `^\d{1,4}-?\d{1,2}-?\d{1,6}$`. Output: always 12 digits, no hyphens.
- **Kennitala**: 10-11 chars, pattern `^\d{6}-?\d{4}$`. Output: always 10 digits, no hyphen.


