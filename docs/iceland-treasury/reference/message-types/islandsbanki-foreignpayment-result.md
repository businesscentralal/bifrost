---
id: islandsbanki-foreignpayment-result
title: "Islandsbanki.ForeignPayment.Result"
sidebar_label: "Islandsbanki.ForeignPayment.Result"
sidebar_position: 49
description: "Request and response contract for the Islandsbanki.ForeignPayment.Result Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


Fetches the result/status of a foreign-payment batch (SaekjaSvarFyrirErlendarGreidslur).

**Direction:** Outbound  
**Content-Type:** text/json

## Request
```json
{ "batchNumber": 7788 }   // (required)
```

## Response
```json
{ "status": "Success", "batchNumber": 7788, "count": 1,
  "payments": [ { /* ErlendGreidsla + stadaGreidslu, dagsFramkvaemd, audkenniHjaBanka, villubod, skuldfaerdUpphaed... */ } ], "logEntryNo": 73 }
```

`stadaGreidslu`: OSTOFNUD | OFRAMKVAEMD | FRAMKVAEMD | VILLA | NIDURFELLD.

