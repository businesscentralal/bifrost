---
id: islandsbanki-foreignpayment-confirm
title: "Islandsbanki.ForeignPayment.Confirm"
sidebar_label: "Islandsbanki.ForeignPayment.Confirm"
sidebar_position: 46
description: "Request and response contract for the Islandsbanki.ForeignPayment.Confirm Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


Confirms (executes) a registered foreign-payment batch (StadfestaErlendarGreidslur).

**Direction:** Outbound  
**Content-Type:** text/json  
**Access:** Gated — requires the `Isb Foreign Pay Gate` permission set.

## Request
```json
{ "batchNumber": 7788 }   // (required)
```

## Response
```json
{ "status": "Success", "batchNumber": 7788, "logEntryNo": 72 }
```

Review the quote with `ForeignPayment.Rates` before confirming. Use `ForeignPayment.Result` afterwards.

