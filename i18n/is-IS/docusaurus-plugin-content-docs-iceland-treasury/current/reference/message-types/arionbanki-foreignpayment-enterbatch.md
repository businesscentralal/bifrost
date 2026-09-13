---
id: arionbanki-foreignpayment-enterbatch
title: "Arionbanki.ForeignPayment.EnterBatch"
sidebar_label: "Arionbanki.ForeignPayment.EnterBatch"
sidebar_position: 22
description: "Beiðni- og svarsamningur fyrir Arionbanki.ForeignPayment.EnterBatch Bifrastar-skilaboðagerð."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálpar-codeunit skilaboðagerðarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálpar-codeunitinu í forritinu, ekki þessari skrá.
:::


Enters multiple foreign greiðslur in one Kallaðu á.

Stefna: Inbound  
Efnisgerð: text/json

## Beiðni
```json
{
  "payments": [
    { "beneficiaryName": "A", "currencyCode": "EUR", "amount": "100.00" },
    { "beneficiaryName": "B", "currencyCode": "USD", "amount": "250.00" }
  ]
}
```

## Svar
Skilar one result row per submitted greiðsla með status, ids og valfrjálst error details.


