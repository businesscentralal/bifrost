---
id: islandsbanki-milliinnheimta-claim-query
title: "Islandsbanki.Milliinnheimta.Claim.Query"
sidebar_label: "Islandsbanki.Milliinnheimta.Claim.Query"
sidebar_position: 50
description: "Beiðni- og svarsamningur fyrir Islandsbanki.Milliinnheimta.Claim.Fyrirspurn Bifrastar-skilaboðagerð."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálpar-codeunit skilaboðagerðarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálpar-codeunitinu í forritinu, ekki þessari skrá.
:::


Lists intermediary-collection claims fyrir a claimant over a date span (SaekjaKrofur on milliinnheimta.asmx).

**Stefna:** Outbound  
**Efnisgerð:** text/json

## Beiðni
```json
{
  "kennitalaKrofuhafa": "1234567890",  // (optional) claimant
  "dagsetningFra": "2026-01-01",        // (required)
  "dagsetningTil": "2026-12-31"         // (required)
}
```

## Svar
```json
{ "status": "Success", "count": 5, "claims": [ { /* Krafa + balances + dagsetningMilliinnheimtu, ... */ } ], "logEntryNo": 60 }
```


