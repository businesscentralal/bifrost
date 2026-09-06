---
id: arionbanki-claim-cancelbatch
title: "Arionbanki.Claim.CancelBatch"
sidebar_label: "Arionbanki.Claim.CancelBatch"
sidebar_position: 8
description: "Request and response contract for the Arionbanki.Claim.CancelBatch Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


Submits a batch of Arion banki claim keys for async cancellation.
Poll the result with **Arionbanki.Claim.GetOperationResult**.

**Direction:** Inbound  
**Content-Type:** text/json

## Note
Use `claimDate` for the BC/JSON claim key date and `dueDate` for the BC/JSON final due date. The bank SOAP/XML API still uses `ct:DueDate` for the claim key date and `ct:FinalDueDate` for the final due date; do not rename those XML elements when generating bank-integration examples.

## Use when
Use this message to cancel many claims asynchronously by key. Each key object must contain `claimant`, `account`, and `claimDate`.

### XML namespace note (internal)
The `<ClaimKey>` element in the SOAP body is in the **Claims** namespace (no `ct:` prefix), not the ClaimTypes namespace. Its children (`Claimant`, `Account`, `DueDate`) are in the ClaimTypes (`ct:`) namespace. This is handled by the builder automatically.

## Request
```json
{
  "keys": [
    {
      "claimant": "1234567",
      "account":  "0101-26-123456",
      "claimDate":  "2026-06-15"
    }
  ]
}
```

## Response
Returns `status`, `operationId`, `batchStatus`, `logEntryNo`, and a `results` array.
Poll `Arionbanki.Claim.GetOperationResult` with `operationId` when `batchStatus` is `InProgress`.

## Tracking workflow

### Pre-call steps

1. **Identify claims to cancel**: Query table 10036172 "Arion Claim Header" to find headers with matching claim key (ClaimantNo_, ClaimAccount, ClaimDate). Only cancel claims with Status = Confirmed or Submitted.
2. **Call CancelBatch**: Send this message type with the keys array.

### Post-call steps

1. **Poll GetOperationResult**: Call `Arionbanki.Claim.GetOperationResult` with the returned `operationId` until `batchStatus` is terminal (Completed, CompletedWithErrors, etc.).
2. **Update header status**: For each successfully cancelled claim, update table 10036172 "Arion Claim Header" to set `Status` = Cancelled.
3. **Verify cancellation**: Optionally call `Arionbanki.Claim.Query` to confirm the claim no longer appears in the bank.

### Key differences from Create/Alter

- Cancel uses `"keys"` (not `"claims"`) — only the claim key fields are needed.
- No `amount`, `identifier`, `templateCode`, or other claim body fields are required.
- After cancellation, the claim disappears from QueryClaims results entirely.

## Errors
- `Missing required 'keys' array`
- `Key entry at index N is invalid`

## Troubleshooting - outbound HTTP blocked
If a call fails with `The outbound HTTP call to Arion banki was blocked by the Business Central environment...`, this is a security control, not a bug. Do not enable `Allow HttpClient Requests` or add outbound allowlist entries based on this help text. Contact your Business Central administrator or Origo support so they can verify the correct outbound endpoint and apply the change through the normal extension/security review process.

