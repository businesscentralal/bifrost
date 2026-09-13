---
id: islandsbanki-claim-create
title: "Islandsbanki.Claim.Create"
sidebar_label: "Islandsbanki.Claim.Create"
sidebar_position: 39
description: "Beiðni- og svarsamningur fyrir Islandsbanki.Claim.Create Bifrastar-skilaboðagerð."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálpar-codeunit skilaboðagerðarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálpar-codeunitinu í forritinu, ekki þessari skrá.
:::


Býr til a stakan collection claim (StofnaKrofu).

**Stefna:** Outbound  
**Efnisgerð:** text/json  
**Access:** Gated — requires the `Isb Claim Gate` permission set.

## Beiðni
The `claim` object models the IK 1.40 Krafa færsla. nauðsynlegt: `kennitalaKrofuhafa`, `gjalddagi`,
`nidurfellingardagur`, `kennitalaGreidanda`, `bankanumer`, `hofudbok` (always 66), `krofunumer`,
`upphaed`, `tilvisun` (max 16), `eindagi`. Numeric fee/discount fields default til 0 Þegar omitted.
Pass `-1` in a numeric Reitur til Notaðu the claimant's pre-registered preset value.
```json
{
  "claim": {
    "kennitalaKrofuhafa": "1234567890",
    "gjalddagi": "2026-05-01",
    "nidurfellingardagur": "2026-08-01",
    "kennitalaGreidanda": "0987654321",
    "bankanumer": 515, "hofudbok": 66, "krofunumer": 1001,
    "upphaed": 25000.00, "tilvisun": "INV-1001", "eindagi": "2026-05-15"
    // optional: sedilnumer, vidskiptanumer, mynt, gengistegund, vanskilagjald1/2,
    // afslattur1/2, nafnGreidanda1/2, hreyfingar: [ { "texti": "...", "upphaed": 100 } ], ...
  }
}
```

## Svar
```json
{ "status": "Success", "logEntryNo": 50 }
```


