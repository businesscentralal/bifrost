---
id: islandsbanki-claim-create
title: "Islandsbanki.Claim.Create"
sidebar_label: "Islandsbanki.Claim.Create"
sidebar_position: 39
description: "Request and response contract for the Islandsbanki.Claim.Create Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


Creates a single collection claim (StofnaKrofu).

**Direction:** Outbound  
**Content-Type:** text/json  
**Access:** Gated — requires the `Isb Claim Gate` permission set.

## Request
The `claim` object models the IK 1.40 Krafa record. Required: `kennitalaKrofuhafa`, `gjalddagi`,
`nidurfellingardagur`, `kennitalaGreidanda`, `bankanumer`, `hofudbok` (always 66), `krofunumer`,
`upphaed`, `tilvisun` (max 16), `eindagi`. Numeric fee/discount fields default to 0 when omitted.
Pass `-1` in a numeric field to use the claimant's pre-registered preset value.
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

## Response
```json
{ "status": "Success", "logEntryNo": 50 }
```

