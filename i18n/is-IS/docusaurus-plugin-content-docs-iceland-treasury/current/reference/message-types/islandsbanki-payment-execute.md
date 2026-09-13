---
id: islandsbanki-payment-execute
title: "Islandsbanki.Payment.Execute"
sidebar_label: "Islandsbanki.Payment.Execute"
sidebar_position: 54
description: "Beiðni- og svarsamningur fyrir Islandsbanki.greiðsla.Execute Bifrastar-skilaboðagerð."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálpar-codeunit skilaboðagerðarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálpar-codeunitinu í forritinu, ekki þessari skrá.
:::


Executes a previously registered greiðsla batch by number (StofnaGreidslubunka).

**Stefna:** Outbound  
**Efnisgerð:** text/json  
**Access:** Gated — requires the `Isb Payment Gate` permission set.

## Beiðni
```json
{ "batchNumber": 12345 }   // (required)
```

## Svar
```json
{ "status": "Success", "batchNumber": 12345, "logEntryNo": 44 }
```

Notaðu `Islandsbanki.Payment.Result` afterwards til confirm per-greiðsla execution status.


