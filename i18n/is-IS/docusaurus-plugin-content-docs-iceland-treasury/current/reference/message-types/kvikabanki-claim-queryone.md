---
id: kvikabanki-claim-queryone
title: "Kvikabanki.Claim.QueryOne"
sidebar_label: "Kvikabanki.Claim.QueryOne"
sidebar_position: 65
description: "Beiðni- og svarsamningur fyrir Kvikabanki.Claim.QueryOne Bifrastar-skilaboðagerð."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálpar-codeunit skilaboðagerðarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálpar-codeunitinu í forritinu, ekki þessari skrá.
:::


Skilar a stakan Kvika banki claim identified by its fulla key. Notaðu `Kvikabanki.Claim.Query` til search Þegar you do not have the exact key.

**Stefna:** Outbound  
**Efnisgerð:** text/json

## Beiðni (Allt fields nauðsynlegt)
```json
{
  "claimant":  "1234567",
  "account":   "0133-26-012345",
  "claimDate": "2026-01-01"        // claim key due date (ISO YYYY-MM-DD)
}
```

## Svar
Skilar `status`, `found`, `logEntryNo`, og (Þegar found) a `claim` object með the fulla claim detail.

## Errors
- `'claimant', 'account', and 'claimDate' (ISO YYYY-MM-DD) are required`


