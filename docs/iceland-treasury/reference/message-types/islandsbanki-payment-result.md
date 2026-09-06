---
id: islandsbanki-payment-result
title: "Islandsbanki.Payment.Result"
sidebar_label: "Islandsbanki.Payment.Result"
sidebar_position: 55
description: "Request and response contract for the Islandsbanki.Payment.Result Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


Fetches the status/result of a payment batch by number (SaekjaGreidslubunkasvar).

**Direction:** Outbound  
**Content-Type:** text/json

## Request
```json
{ "batchNumber": 12345 }   // (required) the number returned by Islandsbanki.Payment.Batch
```

## Response
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
- Each per-payment result carries `stada` (FRAMKVAEMD | VILLA | OFRAMKVAEMD | BAKFAERD), `dagsetningFramkvaemdar` and `villubod` (error text).
- Result fields are projected faithfully as JSON strings (the bank's raw values).

