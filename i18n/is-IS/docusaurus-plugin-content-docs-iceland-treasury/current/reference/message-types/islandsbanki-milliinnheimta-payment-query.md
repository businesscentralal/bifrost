---
id: islandsbanki-milliinnheimta-payment-query
title: "Islandsbanki.Milliinnheimta.Payment.Query"
sidebar_label: "Islandsbanki.Milliinnheimta.Payment.Query"
sidebar_position: 52
description: "Beiðni- og svarsamningur fyrir Islandsbanki.Milliinnheimta.greiðsla.Fyrirspurn Bifrastar-skilaboðagerð."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálpar-codeunit skilaboðagerðarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálpar-codeunitinu í forritinu, ekki þessari skrá.
:::


Lists intermediary-collection greiðslur fyrir a claimant over a date span (SaekjaGreidslur on milliinnheimta.asmx).

**Stefna:** Outbound  
**Efnisgerð:** text/json

## Beiðni
```json
{
  "kennitalaKrofuhafa": "1234567890",  // (optional)
  "dagsetningFra": "2026-01-01",        // (required)
  "dagsetningTil": "2026-12-31"         // (required)
}
```

## Svar
```json
{ "status": "Success", "count": 3, "payments": [ { /* Greidsla fields */ } ], "logEntryNo": 61 }
```


