---
id: islandsbanki-foreignpayment-rates
title: "Islandsbanki.ForeignPayment.Rates"
sidebar_label: "Islandsbanki.ForeignPayment.Rates"
sidebar_position: 47
description: "Beiðni- og svarsamningur fyrir Islandsbanki.ForeignPayment.Rates Bifrastar-skilaboðagerð."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálpar-codeunit skilaboðagerðarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálpar-codeunitinu í forritinu, ekki þessari skrá.
:::


Fetches the rates/quote (og service charges) fyrir a registered foreign-greiðsla batch (SaekjaGengiFyrirBunka).

**Stefna:** Outbound  
**Efnisgerð:** text/json

## Beiðni
```json
{ "batchNumber": 7788 }   // (required) number returned by ForeignPayment.Register
```

## Svar
```json
{ "status": "Success", "batchNumber": 7788, "count": 1,
  "payments": [ { /* ErlendGreidsla + gengiGreidslu, thjonustukostnadur, stadaGreidslu, ... */ } ], "logEntryNo": 71 }
```


