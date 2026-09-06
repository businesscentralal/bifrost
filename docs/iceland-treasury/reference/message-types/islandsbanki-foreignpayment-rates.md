---
id: islandsbanki-foreignpayment-rates
title: "Islandsbanki.ForeignPayment.Rates"
sidebar_label: "Islandsbanki.ForeignPayment.Rates"
sidebar_position: 47
description: "Request and response contract for the Islandsbanki.ForeignPayment.Rates Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


Fetches the rates/quote (and service charges) for a registered foreign-payment batch (SaekjaGengiFyrirBunka).

**Direction:** Outbound  
**Content-Type:** text/json

## Request
```json
{ "batchNumber": 7788 }   // (required) number returned by ForeignPayment.Register
```

## Response
```json
{ "status": "Success", "batchNumber": 7788, "count": 1,
  "payments": [ { /* ErlendGreidsla + gengiGreidslu, thjonustukostnadur, stadaGreidslu, ... */ } ], "logEntryNo": 71 }
```

