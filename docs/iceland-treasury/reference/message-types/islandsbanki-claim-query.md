---
id: islandsbanki-claim-query
title: "Islandsbanki.Claim.Query"
sidebar_label: "Islandsbanki.Claim.Query"
sidebar_position: 41
description: "Request and response contract for the Islandsbanki.Claim.Query Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


Lists claims for a claimant over a due-date span and state (SaekjaKrofur).

**Direction:** Outbound  
**Content-Type:** text/json

## Request
```json
{
  "kennitalaKrofuhafa": "1234567890",  // (optional)
  "audkenni": "...",                    // (optional)
  "gjalddagiFra": "2026-01-01",         // (required)
  "gjalddagiTil": "2026-12-31",         // (required)
  "astand": "ALLAR_KROFUR",             // (optional) ÓGREIDD | GREIDD | NIÐURFELLD | MILLINNHEIMTA | LÖGFRÆÐIINNHEIMTA | ALLAR_KROFUR (default)
  "recordFrom": 1,                      // (optional, default 1)
  "recordTo": 1000                      // (optional, default 1000)
}
```

## Response
```json
{ "status": "Success", "count": 12, "claims": [ { /* Krafa + balances */ } ], "logEntryNo": 53 }
```
Use `recordFrom`/`recordTo` to page large result sets.

