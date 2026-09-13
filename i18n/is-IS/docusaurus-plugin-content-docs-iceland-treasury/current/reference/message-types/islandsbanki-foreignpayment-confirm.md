---
id: islandsbanki-foreignpayment-confirm
title: "Islandsbanki.ForeignPayment.Confirm"
sidebar_label: "Islandsbanki.ForeignPayment.Confirm"
sidebar_position: 46
description: "Beiðni- og svarsamningur fyrir Islandsbanki.ForeignPayment.Confirm Bifrastar-skilaboðagerð."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálpar-codeunit skilaboðagerðarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálpar-codeunitinu í forritinu, ekki þessari skrá.
:::


Confirms (executes) a registered foreign-greiðsla batch (StadfestaErlendarGreidslur).

**Stefna:** Outbound  
**Efnisgerð:** text/json  
**Access:** Gated — requires the `Isb Foreign Pay Gate` permission set.

## Beiðni
```json
{ "batchNumber": 7788 }   // (required)
```

## Svar
```json
{ "status": "Success", "batchNumber": 7788, "logEntryNo": 72 }
```

Review the quote með `ForeignPayment.Rates` áður en confirming. Notaðu `ForeignPayment.Result` afterwards.


