---
id: islandsbanki-payment-validate
title: "Islandsbanki.Payment.Validate"
sidebar_label: "Islandsbanki.Payment.Validate"
sidebar_position: 56
description: "Request and response contract for the Islandsbanki.Payment.Validate Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


Validates (error-checks) a payment batch by number without executing it (VilluprofaGreidslubunka).

**Direction:** Outbound  
**Content-Type:** text/json

## Request
```json
{ "batchNumber": 12345 }   // (required)
```

## Response
Same `result` shape as `Islandsbanki.Payment.Result`: per-payment `stada` and `villubod` (error text), so you can catch problems before execution.

