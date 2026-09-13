---
id: landsbankinn-account-transactions
title: "Landsbankinn.Account.Transactions"
sidebar_label: "Landsbankinn.Account.Transactions"
sidebar_position: 74
description: "Beiðni- og svarsamningur fyrir Landsbankinn.reikningur.færslur Bifrastar-skilaboðagerð."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálpar-codeunit skilaboðagerðarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálpar-codeunitinu í forritinu, ekki þessari skrá.
:::


Sækir færslur fyrir a specific bankareikningur at Landsbankinn.

**Stefna:** Outbound  
**Efnisgerð:** text/json

## Beiðni
Gefðu upp **one** of `bankAccountNo` eða `bban`:
```json
{
  "bankAccountNo": "SAFN",         // BC Bank Account "No." — resolved and normalized automatically
  "bookingDateFrom": "2025-01-01", // required — ISO date filter start
  "bookingDateTo": "2025-01-31"    // required — ISO date filter end
}
```
eða:
```json
{
  "bban": "0133-26-019566",        // Icelandic BBAN — normalized to 12 digits automatically
  "bookingDateFrom": "2025-01-01",
  "bookingDateTo": "2025-01-31"
}
```

### Upplýsingar um færibreytur
| Parameter | Gerð | nauðsynlegt | Lýsing |
|---|---|---|---|
| `bankAccountNo` | string | one of | The BC bankareikningur "No." Reitur. Tengingin reads the bankareikningur number frá the card og normalizes it til 12-digit BBAN. |
| `bban` | string | one of | Icelandic domestic basic bankareikningur number (BBAN). Accepted input: 12 digits without formatting (e.g. `010905012345`) eða hyphen-separated: 3-4 digit bank code, 1-2 digit ledger code, 1-6 digit reikningur number (e.g. `0109-05-012345` eða `109-5-12345`). Normalized til 12 digits með leading zeros. Length: 5-14 chars. Pattern: `^\d{1,4}-?\d{1,2}-?\d{1,6}$`. |
| `bookingDateFrom` | string | yes | ISO date — start of booking date range. |
| `bookingDateTo` | string | yes | ISO date — end of booking date range. |
| `skip` | integer | no | Number of færslur til skip (default 0). |
| `take` | integer | no | Number of færslur til return (default Allt). |

Ef both `bankAccountNo` og `bban` eru provided, `bankAccountNo` takes precedence.

## Svar
```json
{
  "data": [...],
  "page": 1,
  "perPage": 50,
  "totalItems": 250,
  "logEntryNo": 123
}
```
`totalItems` er the total number of færslur available at the bank (frá `X-Paging-TotalItems` header).

## Leiðbeiningar fyrir gervigreind/umboð
Notaðu `Account.Get` eða `Account.List` til verify reikningur access, then Kallaðu á this með a date range. Both `bookingDateFrom` og `bookingDateTo` eru nauðsynlegt by the bank API.


