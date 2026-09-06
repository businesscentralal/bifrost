---
id: islandsbanki-payment-execute
title: "Islandsbanki.Payment.Execute"
sidebar_label: "Islandsbanki.Payment.Execute"
sidebar_position: 54
description: "Request and response contract for the Islandsbanki.Payment.Execute Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


Executes a previously registered payment batch by number (StofnaGreidslubunka).

**Direction:** Outbound  
**Content-Type:** text/json  
**Access:** Gated — requires the `Isb Payment Gate` permission set.

## Request
```json
{ "batchNumber": 12345 }   // (required)
```

## Response
```json
{ "status": "Success", "batchNumber": 12345, "logEntryNo": 44 }
```

Use `Islandsbanki.Payment.Result` afterwards to confirm per-payment execution status.

