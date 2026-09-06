---
id: islandsbanki-milliinnheimta-payment-query
title: "Islandsbanki.Milliinnheimta.Payment.Query"
sidebar_label: "Islandsbanki.Milliinnheimta.Payment.Query"
sidebar_position: 52
description: "Request and response contract for the Islandsbanki.Milliinnheimta.Payment.Query Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


Lists intermediary-collection payments for a claimant over a date span (SaekjaGreidslur on milliinnheimta.asmx).

**Direction:** Outbound  
**Content-Type:** text/json

## Request
```json
{
  "kennitalaKrofuhafa": "1234567890",  // (optional)
  "dagsetningFra": "2026-01-01",        // (required)
  "dagsetningTil": "2026-12-31"         // (required)
}
```

## Response
```json
{ "status": "Success", "count": 3, "payments": [ { /* Greidsla fields */ } ], "logEntryNo": 61 }
```

