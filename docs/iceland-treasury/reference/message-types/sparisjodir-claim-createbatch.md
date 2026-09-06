---
id: sparisjodir-claim-createbatch
title: "Sparisjodir.Claim.CreateBatch"
sidebar_label: "Sparisjodir.Claim.CreateBatch"
sidebar_position: 144
description: "Request and response contract for the Sparisjodir.Claim.CreateBatch Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


Submits a batch of Sparisjóður claims for async creation.
Poll the result with **Sparisjodir.Claim.GetOperationResult**.

**Direction:** Inbound  
**Content-Type:** text/json

## AI note
Use `claimDate` for the BC/JSON claim key date and `dueDate` for the BC/JSON final due date. The bank SOAP/XML API still uses `ct:DueDate` for the claim key date and `ct:FinalDueDate` for the final due date; do not rename those XML elements when generating bank-integration examples.

## Use when
Use this message for async claim creation when the caller can poll for the final result later. It accepts the standard claim object fields (see Request schema below).

## Request
```json
{
  "claims": [
    {
      "claimant":    "1234567",
      "account":     "0101-26-123456",
      "claimDate":   "2026-06-15",
      "amount":      15000.00,   // MUST be CLE Remaining Amount (field 29 on table 21)
      "identifier":  "INV-2026-0001",
      "templateCode": "37"
    }
  ]
}
```

Claim objects follow the standard claim schema (claimant, account, claimDate, amount, identifier, dueDate, templateCode, etc.).

### CRITICAL: WCF positional deserialization
The bank uses WCF positional XML deserialization. If optional elements like `identifier` are omitted, later elements (e.g. `templateCode`) are misaligned and the bank rejects the request with misleading errors. **Always include `identifier` and `templateCode`** in every claim object.

### Amount source (CRITICAL)
The `amount` field MUST equal the **Remaining Amount** (field 29) from the linked Cust. Ledger Entry (table 21). This is the invoice total including VAT. Do NOT use the line amount, original amount, or any other field. Read with: `get_records` on table 21, filter by Entry No., `SetLoadFields` field 29.

### Template Code
The `templateCode` field is **required by the bank**. Use "37" (standard claims category) unless instructed otherwise. Query existing claims to verify the correct code for the collection agreement.

## Async flow
The response contains `operationId`. Poll `Sparisjodir.Claim.GetOperationResult` with that value until `batchStatus` is no longer `InProgress` (terminal states: `Completed`, `CompletedWithErrors`, `NotConfirmed`, `Cancelled`, `OnHold`).

## Response
Returns `status`, `operationId`, `batchStatus`, `logEntryNo`, and a `results` array.

## Errors
- `Missing required 'claims' array`
- `Claim entry at index N is invalid`

## Tracking tables workflow

Before calling this message type, create persistent tracking records.
After calling, the code **automatically** creates the batch record (table 10035924) and updates headers to Submitted. You do NOT need to write batch/header updates manually.

### Pre-call steps (AI/agent must do):

1. **Read setup**: `get_records` on table 289 "Payment Method" filtered by `Spar Claim Identifier` &lt;> '' to find the collection agreement. Read `Spar Claim Identifier`, `Spar Claim Account`, and `Spar Last Claim No.`.
   - `Spar Claim Identifier` = the collection agreement ID sent as the bank-side identifier.
   - `Spar Claim Account` = the disposal account used for claim settlement.
   - `Spar Last Claim No.` = the counter used to assign the next claim number for that payment method.
   If `Spar Last Claim No.` is blank and no prior Spar claim records exist for the payment method, ask the user for the starting claim number before creating any records.
2. **Resolve claimant**: `get_records` on table 79 "Company Information" to read `Registration No.` — this is always the claimant kennitala.
3. **Assign claim numbers**: For each claim, check if a record exists in table 10035922 "Spar Claim Header" for the same customer + claim date. If yes, assign a new claim number (last + 1). If no, reuse the last claim number for that customer. If no records exist at all for this payment method, ask the user for the starting number.
4. **Write header**: `set_records` on table 10035922 "Spar Claim Header" with Status = Draft, all claim fields, and `Created At` = now.
5. **Write lines**: `set_records` on table 10035923 "Spar Claim Line" linking the header to Customer Ledger Entry No(s). The `Amount` and `Remaining Amount at Creation` MUST equal CLE field 29 "Remaining Amount" (table 21) — this is the full invoice amount including VAT.
6. **Call CreateBatch**: Send this message type with the claims array.
7. **Update last claim no.**: `set_records` on table 289 to update `Spar Last Claim No.` to the highest claim number used.

### Automatic (code handles — do NOT do manually):

- **Batch record created**: Table 10035924 "Spar Claim Batch" is inserted automatically with `Operation Id`, `Batch Status`, `Submitted At`, `Request Log Entry No.`, and `Claim Count`.
- **Headers updated to Submitted**: All matching Draft headers get `Status` = Submitted, `Batch Entry No.` linked to the new batch, and `Request Log Entry No.` set.
- **Reversal on failure**: If CreateBatch returns an error (no `operationId`), tracking lines on table 10035923 are automatically set to `Reversed` = true.

### Next step after CreateBatch succeeds:

Call **Sparisjodir.Claim.GetOperationResult** with the `operationId` from the response until `batchStatus` is terminal. That call also handles all tracking updates automatically.

## Finance note
When payments are received (via QueryPayments), there is finance revenue (interest/collection fees) posted to an income account, and a withholding tax on that revenue posted to an asset account. The specific G/L accounts are customer-configured.

## Troubleshooting - outbound HTTP blocked
If a call fails with `The outbound HTTP call to Sparisjóður was blocked by the Business Central environment...`, verify permission to change `Allow HttpClient Requests` and then enable it in Extension Management.

### Check permission before changing the setting
- Verify you have permission to update table **NAV App Setting** (AppID = 0FB9B76C-D2BE-462D-B026-D490D0724164) and to manage extension settings.
- If you do not have permission, ask a BC administrator to perform the change.

### Steps to resolve
1. Open **Extension Management** in Business Central.
2. Find **Bifrost Spar Banki** and open **Extension Settings**.
3. Turn on **Allow HttpClient Requests**.
4. If your environment uses an endpoint allowlist, allow `https://<bank>-iobs.heimabanki.is`.

