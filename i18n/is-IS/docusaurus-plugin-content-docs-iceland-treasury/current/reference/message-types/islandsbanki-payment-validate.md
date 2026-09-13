---
id: islandsbanki-payment-validate
title: "Islandsbanki.Payment.Validate"
sidebar_label: "Islandsbanki.Payment.Validate"
sidebar_position: 56
description: "Beiðni- og svarsamningur fyrir Islandsbanki.greiðsla.Validate Bifrastar-skilaboðagerð."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálpar-codeunit skilaboðagerðarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálpar-codeunitinu í forritinu, ekki þessari skrá.
:::


Staðfestir (error-checks) a greiðsla batch by number without executing it (VilluprofaGreidslubunka).

**Stefna:** Outbound  
**Efnisgerð:** text/json

## Beiðni
```json
{ "batchNumber": 12345 }   // (required)
```

## Svar
Same `result` shape as `Islandsbanki.Payment.Result`: per-greiðsla `stada` og `villubod` (error text), so you getur catch problems áður en execution.


