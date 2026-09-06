---
id: arionbanki-foreignpayment-enterbatch
title: "Arionbanki.ForeignPayment.EnterBatch"
sidebar_label: "Arionbanki.ForeignPayment.EnterBatch"
sidebar_position: 22
description: "Request and response contract for the Arionbanki.ForeignPayment.EnterBatch Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


Enters multiple foreign payments in one call.

Direction: Inbound  
Content-Type: text/json

## Request
```json
{
  "payments": [
    { "beneficiaryName": "A", "currencyCode": "EUR", "amount": "100.00" },
    { "beneficiaryName": "B", "currencyCode": "USD", "amount": "250.00" }
  ]
}
```

## Response
Returns one result row per submitted payment with status, ids and optional error details.

