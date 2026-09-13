---
id: islandsbanki-foreignpayment-result
title: "Islandsbanki.ForeignPayment.Result"
sidebar_label: "Islandsbanki.ForeignPayment.Result"
sidebar_position: 49
description: "Beiðni- og svarsamningur fyrir Islandsbanki.ForeignPayment.Result Bifrastar-skilaboðagerð."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálpar-codeunit skilaboðagerðarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálpar-codeunitinu í forritinu, ekki þessari skrá.
:::


Fetches Niðurstaðan/status of a foreign-greiðsla batch (SaekjaSvarFyrirErlendarGreidslur).

**Stefna:** Outbound  
**Efnisgerð:** text/json

## Beiðni
```json
{ "batchNumber": 7788 }   // (required)
```

## Svar
```json
{ "status": "Success", "batchNumber": 7788, "count": 1,
  "payments": [ { /* ErlendGreidsla + stadaGreidslu, dagsFramkvaemd, audkenniHjaBanka, villubod, skuldfaerdUpphaed... */ } ], "logEntryNo": 73 }
```

`stadaGreidslu`: OSTOFNUD | OFRAMKVAEMD | FRAMKVAEMD | VILLA | NIDURFELLD.


