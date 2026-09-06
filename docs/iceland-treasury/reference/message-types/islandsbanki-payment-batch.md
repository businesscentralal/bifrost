---
id: islandsbanki-payment-batch
title: "Islandsbanki.Payment.Batch"
sidebar_label: "Islandsbanki.Payment.Batch"
sidebar_position: 53
description: "Request and response contract for the Islandsbanki.Payment.Batch Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


Registers and executes a batch of interbank transfers (SkraGreidslubunka) and returns the bank batch number.

**Direction:** Outbound  
**Content-Type:** text/json  
**Access:** Gated — requires the `Isb Payment Gate` permission set.

## Request
```json
{
  "name": "April vendor run",          // (optional) batch name, max 50 chars
  "debitTextKey": "...",               // (required) TextalykillUttektar
  "debitAccount": "0133-26-019507",    // (required) withdrawal account
  "ownerKennitala": "1234567890",      // (required) withdrawal account owner
  "transfers": [                        // (required) at least one
    {
      "creditAccount": "0310-26-000336", // (required) recipient account
      "recipientKennitala": "...",       // (required)
      "amount": 1000.00,                 // (required)
      "textKey": "...",                  // (required) Textalykill
      "reference": "...",                // (optional, max 7) Tilvisun
      "payerExplanation": "...",         // (optional)
      "recipientExplanation": "...",     // (optional)
      "recipientEmail": "...",           // (optional)
      "debitDate": "2026-04-01",         // (optional) omit = execute immediately
      "payerReceipt": "EKKI_SENDA",      // (optional) EKKI_SENDA | SENDA_I_BREFPOSTI
      "recipientReceipt": "EKKI_SENDA",  // (optional) EKKI_SENDA | SENDA_I_BREFPOSTI | SENDA_I_TOLVUPOSTI | SENDA_I_TOLVUPOSTI_OG_BREFPOSTI
      "accountingReference": "..."       // (optional) TilvisunBokhaldskerfis
    }
  ]
}
```

## Response
```json
{ "status": "Success", "batchNumber": 12345.0, "logEntryNo": 42 }
```

Use the returned `batchNumber` with `Islandsbanki.Payment.Result` to poll execution status.

## Errors
- `Access denied ...` - the caller lacks the `Isb Payment Gate` permission set.
- `Missing required field ...` / `... not in the expected Islandsbanki format ...` - request validation failed.

