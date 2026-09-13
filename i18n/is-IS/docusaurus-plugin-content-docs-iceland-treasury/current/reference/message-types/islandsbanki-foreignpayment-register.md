---
id: islandsbanki-foreignpayment-register
title: "Islandsbanki.ForeignPayment.Register"
sidebar_label: "Islandsbanki.ForeignPayment.Register"
sidebar_position: 48
description: "Beiðni- og svarsamningur fyrir Islandsbanki.ForeignPayment.Register Bifrastar-skilaboðagerð."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálpar-codeunit skilaboðagerðarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálpar-codeunitinu í forritinu, ekki þessari skrá.
:::


Registers a batch of foreign (cross-border) greiðslur (SkraErlendarGreidslur) og Skilar bank batch number.

**Stefna:** Outbound  
**Efnisgerð:** text/json  
**Access:** Gated — requires the `Isb Foreign Pay Gate` permission set.

## Beiðni
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

## Svar
```json
{ "status": "Success", "batchNumber": 7788, "logEntryNo": 70 }
```

Flow: Register → `ForeignPayment.Rates` (review quote) → `ForeignPayment.Confirm` → `ForeignPayment.Result`.


