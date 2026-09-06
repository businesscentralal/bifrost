---
id: islandsbanki-claim-querypayments
title: "Islandsbanki.Claim.QueryPayments"
sidebar_label: "Islandsbanki.Claim.QueryPayments"
sidebar_position: 42
description: "Request and response contract for the Islandsbanki.Claim.QueryPayments Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


Lists the payments received against one claim (SaekjaGreidsluKrofu).

**Direction:** Outbound  
**Content-Type:** text/json

## Request
```json
{
  "kennitalaKrofuhafa": "1234567890",  // (optional)
  "banki": 515,                         // (required)
  "hofudbok": 66,                       // (required)
  "krofunumer": 1001,                   // (required)
  "gjalddagi": "2026-05-01"             // (required)
}
```

## Response
```json
{ "status": "Success", "count": 2, "payments": [ { /* Greidsla fields */ } ], "logEntryNo": 54 }
```

