---
id: kvikabanki-statement-get
title: "Kvikabanki.Statement.Get"
sidebar_label: "Kvikabanki.Statement.Get"
sidebar_position: 70
description: "Beiðni- og svarsamningur fyrir Kvikabanki.Statement.Sækja Bifrastar-skilaboðagerð."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálpar-codeunit skilaboðagerðarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálpar-codeunitinu í forritinu, ekki þessari skrá.
:::


Sækir Kvika banki reikningur statement (the IOBS bank import/export format) fyrir an reikningur over a date span. Allt bank pages eru merged; `skip`/`take` page the merged færsla lines.

**Stefna:** Outbound  
**Efnisgerð:** text/json

## Beiðni
```json
{
  "account":  "0133-26-012345", // required
  "dateFrom": "2026-01-01",     // required (ISO)
  "dateTo":   "2026-01-31",     // required (ISO)
  "skip":     0,                // optional: lines to skip
  "take":     100               // optional: max lines to return (0 = all)
}
```

## Svar
Skilar `status`, a `header` object (reikningur balances og metadata), `totalLines`, `skip`, `take`, `returned`, a `lines` array of færslur, og `logEntryNo`. Each line carries `transactionId`, `transactionDate`, `valueDate`, `amount`, `balance`, `reference`, `category`, `payorId`, og more.

## Errors
- `Missing required 'account' in the request`
- `'dateFrom' and 'dateTo' (ISO YYYY-MM-DD) are required`
- `Kvika banki returned no statement for the supplied account and date span`


