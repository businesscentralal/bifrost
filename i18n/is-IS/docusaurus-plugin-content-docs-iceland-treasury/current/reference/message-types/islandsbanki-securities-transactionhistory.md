---
id: islandsbanki-securities-transactionhistory
title: "Islandsbanki.Securities.TransactionHistory"
sidebar_label: "Islandsbanki.Securities.TransactionHistory"
sidebar_position: 57
description: "Beiðni- og svarsamningur fyrir Islandsbanki.Securities.TransactionHistory Bifrastar-skilaboðagerð."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálpar-codeunit skilaboðagerðarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálpar-codeunitinu í forritinu, ekki þessari skrá.
:::


Skilar securities færsla history fyrir an id number over a date span (GetTransactionHistory).

**Stefna:** Outbound  
**Efnisgerð:** text/json

## Beiðni
```json
{
  "idNumber": "1234567890",   // (optional) id number / kennitala
  "dateFrom": "2026-01-01",   // (required)
  "dateTo": "2026-12-31"      // (required)
}
```

## Svar
```json
{ "status": "Success", "count": 8,
  "transactions": [ { "transactionNumber": "...", "ticker": "...", "isin": "...", "tradedate": "...", "nominalValue": "...", "price": "...", "total": "...", ... } ], "logEntryNo": 90 }
```
færslur eru projected faithfully as JSON strings (the bank's raw values).


