---
id: arionbanki-claim-createbatch
title: "Arionbanki.Claim.CreateBatch"
sidebar_label: "Arionbanki.Claim.CreateBatch"
sidebar_position: 9
description: "Request and response contract for the Arionbanki.Claim.CreateBatch Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


Submits a batch of Arion banki claims for async creation.
Poll the result with **Arionbanki.Claim.GetOperationResult**.

**Direction:** Inbound  
**Content-Type:** text/json

## Note
`claimDate` is the BC/JSON claim key date and `dueDate` is the final due date. The bank SOAP/XML API uses `ct:DueDate` for the claim key date and `ct:FinalDueDate` for the final due date; do not rename those XML elements when generating bank-integration examples.

## Use when
Use this message for async claim creation when the caller can poll for the final result later. It accepts the standard claim object fields (see Request schema below).

## Usage notes
Create one batch per user request, keep each claim object complete, and do not omit positional fields that the bank expects. Normalize claimant and account values to the wire format shown in the examples, preserve `claimDate` and `dueDate` as ISO dates, and always poll `Arionbanki.Claim.GetOperationResult` with the returned `operationId`.
Persist `operationId` and `logEntryNo` from submit and poll calls as the audit trail for this async workflow.

## Request
```json
{
  "claims": [
    {
      "claimant":    "1234567",
      "account":     "0101-26-123456",
      "claimDate":   "2026-06-15",
      "amount":      15000.00,   // MUST equal the Cust. Ledger Entry "Remaining Amount" FlowField (table 21) - verify the field number in your BC version, do not hardcode it
      "identifier":  "INV-2026-0001",
      "templateCode": "37"
    }
  ]
}
```

Claim objects follow the standard claim schema (claimant, account, claimDate, amount, identifier, dueDate, templateCode, etc.).

### CRITICAL: WCF positional deserialization
The bank uses WCF positional XML deserialization. If optional elements like `identifier` are omitted, later elements (e.g. `templateCode`) are misaligned and the bank rejects the request with misleading errors. Always include `identifier` and `templateCode` in every claim object.

### Amount source (CRITICAL)
The `amount` field MUST equal the Cust. Ledger Entry "Remaining Amount" FlowField (table 21) — this is the invoice total including VAT. Do not use the line amount, original amount, or any other field. Confirm the exact field number for your BC version with `Help_Fields_Get`/table metadata before hardcoding it — field numbers can differ between versions and a wrong number will silently read an unrelated field.

### Template Code
The `templateCode` field is required by the bank. Use "37" (standard claims category) unless instructed otherwise. Query existing claims to verify the correct code for the collection agreement.

## Async flow
The response contains `operationId`. Poll `Arionbanki.Claim.GetOperationResult` with that value until `batchStatus` is no longer `InProgress` (terminal states: `Completed`, `CompletedWithErrors`, `NotConfirmed`, `Cancelled`, `OnHold`).

## Response
Returns `status`, `operationId`, `batchStatus`, `logEntryNo`, and a `results` array.

## Errors
- `Missing required 'claims' array`
- `Claim entry at index N is invalid`

## Tracking tables workflow

Before calling this message type, create persistent tracking records.
After calling, the code automatically creates the batch record (table 10036174) and updates headers to Submitted. Do not write batch/header status updates manually after a successful call.

### Pre-call steps

1. Read setup: `get_records` on table 289 "Payment Method" filtered by `ORI Arion Claim Identifier` &lt;> '' to find the collection agreement. Read `ORI Arion Claim Identifier` and `ORI Arion Last Claim No.` (tableextension 10036152 "Arion Payment Method Ext" — these are the only two claim-specific fields on Payment Method; the disposal/settlement account comes from the standard `Bal. Account Type`/`Bal. Account No.` fields, not a claim-specific field).
   - `ORI Arion Claim Identifier` = the collection agreement ID sent as the bank-side identifier.
   - `ORI Arion Last Claim No.` = the counter used to assign the next claim number for that payment method.
   If `ORI Arion Last Claim No.` is blank and no prior claim records exist for the payment method, ask the user for the starting claim number before creating any records.
2. Resolve claimant: `get_records` on table 79 "Company Information" to read `Registration No.` — this is the claimant kennitala.
3. Assign claim numbers: for each claim, check if a record exists in table 10036172 "Arion Claim Header" for the same customer + claim date. If yes, assign a new claim number (last + 1). If no, reuse the last claim number for that customer. If no records exist at all for this payment method, ask the user for the starting number.
4. Write header: `set_records` on table 10036172 "Arion Claim Header" with Status = Draft, all claim fields, and `Created At` = now.
5. Write lines: `set_records` on table 10036173 "Arion Claim Line" linking the header to Customer Ledger Entry No(s). `Amount` and `Remaining Amount at Creation` must equal the Cust. Ledger Entry "Remaining Amount" (table 21) — the full invoice amount including VAT.
6. Call CreateBatch: send this message type with the claims array.
7. Update last claim no.: `set_records` on table 289 to update `ORI Arion Last Claim No.` to the highest claim number used.

### Automatic (code handles — do not do manually)

- Batch record created: table 10036174 "Arion Claim Batch" is inserted automatically with `Operation Id`, `Batch Status`, `Submitted At`, `Request Log Entry No.`, and `Claim Count`.
- Headers updated to Submitted: all matching Draft headers get `Status` = Submitted, `Batch Entry No.` linked to the new batch, and `Request Log Entry No.` set.
- Reversal on failure: if CreateBatch returns an error (no `operationId`), tracking lines on table 10036173 are automatically set to `Reversed` = true.

### Next step after CreateBatch succeeds

Call **Arionbanki.Claim.GetOperationResult** with the `operationId` from the response until `batchStatus` is terminal. That call also handles all tracking updates automatically.

## Finance note
When payments are received (via QueryPayments), there is finance revenue (interest/collection fees) posted to an income account, and a withholding tax on that revenue posted to an asset account. The specific G/L accounts are customer-configured.

## Troubleshooting - outbound HTTP blocked
If a call fails with `The outbound HTTP call to Arion banki was blocked by the Business Central environment...`, this is a security control, not a bug. Do not enable `Allow HttpClient Requests` or add outbound allowlist entries based on this help text. Contact your Business Central administrator or Origo support so they can verify the correct outbound endpoint and apply the change through the normal extension/security review process.

