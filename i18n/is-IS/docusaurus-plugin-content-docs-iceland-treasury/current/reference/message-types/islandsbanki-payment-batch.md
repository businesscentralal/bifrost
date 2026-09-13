---
id: islandsbanki-payment-batch
title: "Islandsbanki.Payment.Batch"
sidebar_label: "Islandsbanki.Payment.Batch"
sidebar_position: 53
description: "Beiðni- og svarsamningur fyrir Islandsbanki.greiðsla.Batch Bifrastar-skilaboðagerð."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálpar-codeunit skilaboðagerðarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálpar-codeunitinu í forritinu, ekki þessari skrá.
:::


Registers og executes a batch of interbank transfers (SkraGreidslubunka) og Skilar bank batch number.

**Stefna:** Outbound  
**Efnisgerð:** text/json  
**Access:** Gated — requires the `Isb Payment Gate` permission set.

## Beiðni
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

## Svar
```json
{ "status": "Success", "batchNumber": 12345.0, "logEntryNo": 42 }
```

Notaðu the returned `batchNumber` með `Islandsbanki.Payment.Result` til poll execution status.

## Errors
- `Access denied ...` - the caller lacks the `Isb Payment Gate` permission set.
- `Missing required field ...` / `... not in the expected Islandsbanki format ...` - Beiðni validation failed.


