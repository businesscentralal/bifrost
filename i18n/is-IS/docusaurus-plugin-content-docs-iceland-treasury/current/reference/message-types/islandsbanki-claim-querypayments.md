---
id: islandsbanki-claim-querypayments
title: "Islandsbanki.Claim.QueryPayments"
sidebar_label: "Islandsbanki.Claim.QueryPayments"
sidebar_position: 42
description: "Beiðni- og svarsamningur fyrir Islandsbanki.Claim.QueryPayments Bifrastar-skilaboðagerð."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálpar-codeunit skilaboðagerðarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálpar-codeunitinu í forritinu, ekki þessari skrá.
:::


Lists the greiðslur received against one claim (SaekjaGreidsluKrofu).

**Stefna:** Outbound  
**Efnisgerð:** text/json

## Beiðni
```json
{
  "kennitalaKrofuhafa": "1234567890",  // (optional)
  "banki": 515,                         // (required)
  "hofudbok": 66,                       // (required)
  "krofunumer": 1001,                   // (required)
  "gjalddagi": "2026-05-01"             // (required)
}
```

## Svar
```json
{ "status": "Success", "count": 2, "payments": [ { /* Greidsla fields */ } ], "logEntryNo": 54 }
```


