---
id: islandsbanki-claim-cancel
title: "Islandsbanki.Claim.Cancel"
sidebar_label: "Islandsbanki.Claim.Cancel"
sidebar_position: 38
description: "Beiðni- og svarsamningur fyrir Islandsbanki.Claim.Cancel Bifrastar-skilaboðagerð."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálpar-codeunit skilaboðagerðarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálpar-codeunitinu í forritinu, ekki þessari skrá.
:::


Cancels a collection claim (FellaKrofu).

**Stefna:** Outbound  
**Efnisgerð:** text/json  
**Access:** Gated — requires the `Isb Claim Gate` permission set.

## Beiðni
Supply a `claim` object identifying the claim (same shape as Claim.Create). The identity
fields — `kennitalaKrofuhafa`, `bankanumer`, `hofudbok`, `krofunumer`, `gjalddagi`,
`nidurfellingardagur`, `kennitalaGreidanda`, `upphaed`, `tilvisun`, `eindagi` — eru nauðsynlegt by the schema.
```json
{ "claim": { "kennitalaKrofuhafa": "1234567890", "bankanumer": 515, "hofudbok": 66,
             "krofunumer": 1001, "gjalddagi": "2026-05-01", "nidurfellingardagur": "2026-08-01",
             "kennitalaGreidanda": "0987654321", "upphaed": 25000.00, "tilvisun": "INV-1001",
             "eindagi": "2026-05-15" } }
```

## Svar
```json
{ "status": "Success", "logEntryNo": 51 }
```


