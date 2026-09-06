---
id: islandsbanki-claim-get
title: "Islandsbanki.Claim.Get"
sidebar_label: "Islandsbanki.Claim.Get"
sidebar_position: 40
description: "Request and response contract for the Islandsbanki.Claim.Get Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


Fetches a single claim by identity, with current balances (SaekjaKrofu → uppreiknuð krafa).

**Direction:** Outbound  
**Content-Type:** text/json

## Request
```json
{
  "kennitalaKrofuhafa": "1234567890",  // (optional) claimant
  "banki": 515,                         // (required)
  "hofudbok": 66,                       // (required) always 66 for claims
  "krofunumer": 1001,                   // (required)
  "gjalddagi": "2026-05-01"             // (required) due date
}
```

## Response
```json
{ "status": "Success", "claim": { /* all Krafa fields + eftirstodvar, stada, uppaedTilGreidsluIDag, ... */ }, "logEntryNo": 52 }
```
Claim fields are projected faithfully as JSON strings (the bank's raw values).

