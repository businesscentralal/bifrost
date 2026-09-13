---
id: islandsbanki-claim-query
title: "Islandsbanki.Claim.Query"
sidebar_label: "Islandsbanki.Claim.Query"
sidebar_position: 41
description: "Beiðni- og svarsamningur fyrir Islandsbanki.Claim.Fyrirspurn Bifrastar-skilaboðagerð."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálpar-codeunit skilaboðagerðarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálpar-codeunitinu í forritinu, ekki þessari skrá.
:::


Lists claims fyrir a claimant over a due-date span og state (SaekjaKrofur).

**Stefna:** Outbound  
**Efnisgerð:** text/json

## Beiðni
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

## Svar
```json
{ "status": "Success", "count": 12, "claims": [ { /* Krafa + balances */ } ], "logEntryNo": 53 }
```
Notaðu `recordFrom`/`recordTo` til page large result sets.


