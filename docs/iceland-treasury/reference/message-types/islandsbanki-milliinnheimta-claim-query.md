---
id: islandsbanki-milliinnheimta-claim-query
title: "Islandsbanki.Milliinnheimta.Claim.Query"
sidebar_label: "Islandsbanki.Milliinnheimta.Claim.Query"
sidebar_position: 50
description: "Request and response contract for the Islandsbanki.Milliinnheimta.Claim.Query Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


Lists intermediary-collection claims for a claimant over a date span (SaekjaKrofur on milliinnheimta.asmx).

**Direction:** Outbound  
**Content-Type:** text/json

## Request
```json
{
  "kennitalaKrofuhafa": "1234567890",  // (optional) claimant
  "dagsetningFra": "2026-01-01",        // (required)
  "dagsetningTil": "2026-12-31"         // (required)
}
```

## Response
```json
{ "status": "Success", "count": 5, "claims": [ { /* Krafa + balances + dagsetningMilliinnheimtu, ... */ } ], "logEntryNo": 60 }
```

