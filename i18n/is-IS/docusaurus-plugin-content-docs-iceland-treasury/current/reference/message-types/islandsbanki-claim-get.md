---
id: islandsbanki-claim-get
title: "Islandsbanki.Claim.Get"
sidebar_label: "Islandsbanki.Claim.Get"
sidebar_position: 40
description: "Beiðni- og svarsamningur fyrir Islandsbanki.Claim.Sækja Bifrastar-skilaboðagerð."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálpar-codeunit skilaboðagerðarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálpar-codeunitinu í forritinu, ekki þessari skrá.
:::


Fetches a stakan claim by identity, með current balances (SaekjaKrofu → uppreiknuð krafa).

**Stefna:** Outbound  
**Efnisgerð:** text/json

## Beiðni
```json
{
  "kennitalaKrofuhafa": "1234567890",  // (optional) claimant
  "banki": 515,                         // (required)
  "hofudbok": 66,                       // (required) always 66 for claims
  "krofunumer": 1001,                   // (required)
  "gjalddagi": "2026-05-01"             // (required) due date
}
```

## Svar
```json
{ "status": "Success", "claim": { /* all Krafa fields + eftirstodvar, stada, uppaedTilGreidsluIDag, ... */ }, "logEntryNo": 52 }
```
Claim fields eru projected faithfully as JSON strings (the bank's raw values).


