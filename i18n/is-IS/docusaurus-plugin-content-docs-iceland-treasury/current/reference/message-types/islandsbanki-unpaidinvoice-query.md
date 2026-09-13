---
id: islandsbanki-unpaidinvoice-query
title: "Islandsbanki.UnpaidInvoice.Query"
sidebar_label: "Islandsbanki.UnpaidInvoice.Query"
sidebar_position: 59
description: "Beiðni- og svarsamningur fyrir Islandsbanki.UnpaidInvoice.Fyrirspurn Bifrastar-skilaboðagerð."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálpar-codeunit skilaboðagerðarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálpar-codeunitinu í forritinu, ekki þessari skrá.
:::


Lists the unpaid items owed by a kennitala at Islandsbanki (SaekjaOgreiddaReikninga):
claims, giro slips, promissory notes og bills of exchange.

**Stefna:** Outbound  
**Efnisgerð:** text/json

## Notað þegar
- You need the outstanding items a viðskiptavinur/payer owes áður en paying eða reconciling.

## Beiðni
```json
{
  "kennitala": "1234567890"            // (required) national ID of the payer
}
```

## Svar
```json
{
  "status": "Success",
  "kennitala": "1234567890",
  "counts": { "claims": 2, "giroSlips": 0, "promissoryNotes": 0, "billsOfExchange": 0 },
  "claims": [ { "banki": "133", "hofudbok": "26", "krofunumer": "...", "gjalddagi": "...", "upphaedTilGreidslu": "...", ... } ],
  "giroSlips": [ ... ],
  "promissoryNotes": [ ... ],
  "billsOfExchange": [ ... ],
  "logEntryNo": 42
}
```

### Svar Reitur notes
- Each array element er a faithful projection of the bank's færsla: every Reitur the bank Skilar er included as a JSON string property (Icelandic Reitur Heiti, first letter lower-cased), so amounts og dates eru the bank's raw text. Parse them on the consumer side.
- The four item types carry different fields. Common keys include `banki`, `hofudbok`, `gjalddagi`, `upphaedTilGreidslu`, `kennitalaKrofuhafa`, `kennitalaGreidanda`.
- Empty arrays mean the payer owes nothing of that Gerð — a normal result, not an error.

## Errors
- `Missing required 'kennitala'` - the `kennitala` property er missing.

## Troubleshooting - outbound HTTP blocked
Ef a Kallaðu á fails með `The outbound HTTP call to Islandsbanki was blocked ...`, enable **Allow HttpClient Requests** fyrir the extension in Extension Management, og allow `https://ws.isb.is` Ef your environment uses an Endapunktur allowlist.


