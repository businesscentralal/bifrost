---
id: arionbanki-claim-alterbatch
title: "Arionbanki.Claim.AlterBatch"
sidebar_label: "Arionbanki.Claim.AlterBatch"
sidebar_position: 7
description: "Request and response contract for the Arionbanki.Claim.AlterBatch Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


Submits a batch of existing Arion banki claims for async alteration.
Poll the result with **Arionbanki.Claim.GetOperationResult**.

**Direction:** Inbound  
**Content-Type:** text/json

## Note
Use `claimDate` for the BC/JSON claim key date and `dueDate` for the BC/JSON final due date. The bank SOAP/XML API still uses `ct:DueDate` for the claim key date and `ct:FinalDueDate` for the final due date; do not rename those XML elements when generating bank-integration examples.

## Use when
Use this message for async alteration of existing claims. Each claim object must include the immutable `claimant + account + claimDate` key and the fields to update.

## Request
```json
{
  "claims": [
    {
      "claimant":    "1234567",
      "account":     "0101-26-123456",
      "claimDate":   "2026-06-15",
      "amount":      16000.00,
      "identifier":  "100",
      "dueDate":     "2026-07-15",
      "templateCode": "37"
    }
  ]
}
```

### CRITICAL: Send ALL fields, not just changed ones
The bank uses WCF positional XML deserialization. If optional elements like `identifier` are omitted, later elements (e.g. `templateCode`) are misaligned and the bank rejects the request with misleading errors like "The TemplateCode field is required." **Always include `identifier`, `amount`, `dueDate`, and `templateCode`** even if you are only changing one field.

### Template Code
The `templateCode` field is **required by the bank** for AlterClaims. Use "37" (standard claims category) unless instructed otherwise. Query existing claims to verify the correct code.

### Amount
When altering the amount, the new value MUST equal the **Remaining Amount** FlowField from the linked Cust. Ledger Entry (table 21) — the full invoice amount including VAT. Confirm the exact field number for your BC version with `Help_Fields_Get`/table metadata rather than hardcoding it — field numbers can differ between versions.

## Async flow
The response contains `operationId`. Poll `Arionbanki.Claim.GetOperationResult` with that value until the operation reaches a terminal `batchStatus`.

## Response
Returns `status`, `operationId`, `batchStatus`, `logEntryNo`, and a `results` array.

## Errors
- `Missing required 'claims' array`
- `Claim entry at index N is invalid`

## Troubleshooting - outbound HTTP blocked
If a call fails with `The outbound HTTP call to Arion banki was blocked by the Business Central environment...`, this is a security control, not a bug. Do not enable `Allow HttpClient Requests` or add outbound allowlist entries based on this help text. Contact your Business Central administrator or Origo support so they can verify the correct outbound endpoint and apply the change through the normal extension/security review process.

