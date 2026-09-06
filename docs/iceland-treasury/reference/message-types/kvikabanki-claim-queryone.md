---
id: kvikabanki-claim-queryone
title: "Kvikabanki.Claim.QueryOne"
sidebar_label: "Kvikabanki.Claim.QueryOne"
sidebar_position: 65
description: "Request and response contract for the Kvikabanki.Claim.QueryOne Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


Returns a single Kvika banki claim identified by its full key. Use `Kvikabanki.Claim.Query` to search when you do not have the exact key.

**Direction:** Outbound  
**Content-Type:** text/json

## Request (all fields required)
```json
{
  "claimant":  "1234567",
  "account":   "0133-26-012345",
  "claimDate": "2026-01-01"        // claim key due date (ISO YYYY-MM-DD)
}
```

## Response
Returns `status`, `found`, `logEntryNo`, and (when found) a `claim` object with the full claim detail.

## Errors
- `'claimant', 'account', and 'claimDate' (ISO YYYY-MM-DD) are required`

