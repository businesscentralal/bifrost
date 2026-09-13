---
id: islandsbanki-payment-result
title: "Islandsbanki.Payment.Result"
sidebar_label: "Islandsbanki.Payment.Result"
sidebar_position: 55
description: "Beiðni- og svarsamningur fyrir Islandsbanki.greiðsla.Result Bifrastar-skilaboðagerð."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálpar-codeunit skilaboðagerðarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálpar-codeunitinu í forritinu, ekki þessari skrá.
:::


Fetches the status/result of a greiðsla batch by number (SaekjaGreidslubunkasvar).

**Stefna:** Outbound  
**Efnisgerð:** text/json

## Beiðni
```json
{ "batchNumber": 12345 }   // (required) the number returned by Islandsbanki.Payment.Batch
```

## Svar
```json
{
  "status": "Success",
  "batchNumber": 12345,
  "result": {
    "heiti": "...", "bunkanumer": "12345",
    "millifaerslur": [ { "stada": "FRAMKVAEMD", "dagsetningFramkvaemdar": "...", "villubod": "", ... } ],
    "cGiro": [ ... ], "abGiro": [ ... ], "greidslusedlar": [ ... ]
  },
  "logEntryNo": 43
}
```

### Notes
- Each per-greiðsla result carries `stada` (FRAMKVAEMD | VILLA | OFRAMKVAEMD | BAKFAERD), `dagsetningFramkvaemdar` og `villubod` (error text).
- Result fields eru projected faithfully as JSON strings (the bank's raw values).


