---
id: islandsbanki-foreignpayment-register
title: "Islandsbanki.ForeignPayment.Register"
sidebar_label: "Islandsbanki.ForeignPayment.Register"
sidebar_position: 48
description: "Request and response contract for the Islandsbanki.ForeignPayment.Register Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


Registers a batch of foreign (cross-border) payments (SkraErlendarGreidslur) and returns the bank batch number.

**Direction:** Outbound  
**Content-Type:** text/json  
**Access:** Gated — requires the `Isb Foreign Pay Gate` permission set.

## Request
```json
{
  "heitiBunka": "March FX run",          // (optional) batch name
  "kennitalaVidskiptavinar": "...",      // (optional) customer kennitala
  "payments": [
    {
      "kennitalaGreidanda": "1234567890",  // (required) payer kennitala
      "nafnGreidanda": "...",              // (required) payer name
      "myntGreidslu": "EUR",               // (required) ISO 4217 currency
      "erlendFjarhaed": 1000.00,           // (required) foreign amount
      "nafnVidtakanda": "...",             // (required) beneficiary name
      "landVidtakanda": "DE",              // (required) ISO 3166 country
      "reikningsnumerVidtakanda": "DE89...", // (required) IBAN/account, max 34
      "payerAccount": "0515-26-123456",    // (required) debit account
      "costAccount": "0515-26-123456",     // (required) charges account
      "flokkunarlykill": 11,               // (required) CBI classification key
      "sendaFax": false, "sendaTolvupost": true,
      // optional: swiftNumerVidtakanda, heitiBankaVidtakanda, skyringUt1..4,
      // heimilisfangVidtakanda1/2, borgVidtakanda, audkenniHjaFyrirtaeki, netfang... 
    }
  ]
}
```

## Response
```json
{ "status": "Success", "batchNumber": 7788, "logEntryNo": 70 }
```

Flow: Register → `ForeignPayment.Rates` (review quote) → `ForeignPayment.Confirm` → `ForeignPayment.Result`.

