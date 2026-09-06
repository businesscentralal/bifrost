---
id: landsbankinn-payment-batch
title: "Landsbankinn.Payment.Batch"
sidebar_label: "Landsbankinn.Payment.Batch"
sidebar_position: 127
description: "Request and response contract for the Landsbankinn.Payment.Batch Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


Submits one or more payment batches to Landsbankinn **asynchronously** via the B2B `DoPayments` call. The response returns a `paymentsId`; use `Landsbankinn.Payment.ResultBatch` to poll for per-line results.

**Direction:** Inbound  
**Content-Type:** text/json

## Use when
- You need to submit one or more payment batches and poll for results later.
- The payment run may take longer than the caller can wait synchronously.
- You need a `paymentsId` that can be stored and queried by a later process.

## STP — Straight Through Processing
STP (Straight Through Processing) batches are **not allowed** by this connector. Any batch whose `nameOfBatch` starts with `STP` (case-insensitive) is rejected with an error before it reaches the bank.

## Approval process
All batches submitted through this connector require manual approval in the online bank before the bank processes them.
- **A-users**: Can create and pay batches that have already been approved by a B-user.
- **B-users**: Can approve batches submitted by others but cannot approve their own batches.
A batch with `NotConfirmed` status must be approved before the bank processes it.

## Request
```json
{
  "batches": [
    {
      "outAccount":           "0133260195661234",   // (required) Landsbankinn source account (no separators)
      "outAccountOwnerId":    "1234567890",          // (optional) kennitala of account owner
      "dateOfForwardPayment": "2026-06-30",          // (optional) ISO date for future payment; defaults to today if omitted
      "nameOfBatch":          "*Salaries June",      // (optional) prefix * = visible to all company users
      "isOneToMany":          true,                  // (recommended) true = one withdrawal per batch
      "rollbackOnError":      false,                 // (optional) true = reject whole batch on first error
      "lines": [
        { /* line object: use kind = Transfer or PaymentSlip */ }
      ]
    }
  ]
}
```

## AI/Agent playbook
Use this sequence when constructing calls programmatically:
General rule: run `Landsbankinn.Account.Verify` for transfer lines and `Landsbankinn.UnpaidInvoice.Query` (optionally followed by `Landsbankinn.PaymentSlip.Query`) for claim/payment-slip lines before submitting `Landsbankinn.Payment.Batch`.
0. **Execution mode defaults to single-call production mode**: create exactly one `Landsbankinn.Payment.Batch` call for one user request unless the user explicitly asks for testing, retries, or multiple batches.
1. Choose `isOneToMany` deliberately: `true` = one total withdrawal from `outAccount` for the sum of all lines; `false` = one withdrawal per line.
2. Set `outAccount` to an Landsbankinn source account without separators.
3. Include one or more line objects in `lines`.
4. Omit `dateOfForwardPayment` for immediate processing; connector defaults it to today.
5. For scheduled processing, set `dateOfForwardPayment` explicitly (ISO `YYYY-MM-DD`).
6. Choose `rollbackOnError` deliberately: `true` = reject/roll back the full batch if any line fails; `false` = keep partial success and inspect the response for which lines failed.
7. Save `paymentsId` + `logEntryNo` from response and poll with `Landsbankinn.Payment.ResultBatch`.

### Production safety guard (must follow)
- Do **not** run exploratory/test submissions against the bank to discover formats in production mode.
- If a required input is ambiguous or likely invalid, stop and ask one targeted clarification question before sending.
- If the bank rejects the request, report the error and wait for user confirmation before retrying.
- Only send additional calls automatically when the user explicitly requested a retry strategy beforehand.
- Always include a unique `subject` and `nameOfBatch` that references the user intent for traceability.

### Preflight checks before send
- Transfer lines: verify destination account exists with `Landsbankinn.Account.Verify` using `recipientAccount` + `recipientAccountOwnerId`.
- Claim/payment-slip lines: resolve the claim via `Landsbankinn.UnpaidInvoice.Query`, then use those keys for `recipientAccount`, claimant kennitala, and due-date semantics.
- For payment-slip keys, treat claim `gjalddagi` as the claim key date; `eindagi` is payment deadline and may differ.
- Normalize all account numbers to digits only (remove separators and spaces).
- Normalize kennitala values to digits only (remove hyphens/spaces).
- Normalize numeric amounts to integer JSON numbers (example: `10714`, not `10.714` text).
- Normalize dates to ISO `YYYY-MM-DD` before send (example: `2026-06-24`, not `24.06.2026`).
- For mixed batches, verify whether the business expects one total withdrawal or one withdrawal per line, then set `isOneToMany` accordingly.
- Decide whether partial success is acceptable; if yes, use `rollbackOnError = false` and read line-level results from the response/polling flow.
- Validate transfer references against bank max length (keep short; e.g. `TRF1M`).
- Confirm payment slip `recipientAccount` uses bank-accepted claim account format.
- Confirm line count in payload equals requested operations (for this scenario: one batch with two lines).

### Claim account format note (payment slip)
- Send `recipientAccount` as digits only; do not include separators.
- Keep leading zeros exactly as present after normalization.
- If the bank rejects a claim account format, stop and ask the user to re-confirm the exact slip account before retrying.

### Transfer line (`kind = Transfer`)
Use for account-to-account transfer. Required fields in practice:
- `recipientAccount` (destination account)
- `amount`
- Optional but recommended: `recipientAccountOwnerId`, `recipientReference`, `description`, `bookingId`

```json
{
  "kind": "Transfer",
  "recipientAccount": "031026009009",
  "recipientAccountOwnerId": "1102713369",
  "recipientReference": "TEST-200",
  "amount": 200,
  "description": "Transfer test 200 ISK",
  "bookingId": "XFER200"
}
```

### Payment slip line (`kind = PaymentSlip`)
Use for claim/slip payments. **Runtime mapping is validated**: JSON `PaymentSlip` maps to wire element `Claim` in PaymentTypes 2013.
Use the JSON contract below; do not emit raw SOAP XML from agents.
JSON fields map to bank Claim XML as follows:
- `recipientAccount` -> `Claim/Account`
- `recipientAccountOwnerId` -> `Claim/Claimant`
- `personId` -> `Claim/PayorID`
- `dueDate` -> `Claim/DueDate`
- `isDeposit` -> `Claim/IsDeposit`

```json
{
  "kind": "PaymentSlip",
  "recipientAccount": "000166320770",
  "recipientAccountOwnerId": "6811023020",
  "personId": "4112032630",
  "dueDate": "2026-06-15",
  "isDeposit": false,
  "amount": 432640,
  "description": "Stadgreidsluskattur",
  "bookingId": "320770"
}
```

### Full mixed-batch example (transfer + payment slip)
```json
{
  "batches": [
    {
      "outAccount": "031026000336",
      "outAccountOwnerId": "4112032630",
      "nameOfBatch": "*TEST Mixed Batch",
      "isOneToMany": true,
      "rollbackOnError": false,
      "lines": [
        {
          "kind": "PaymentSlip",
          "recipientAccount": "000166320770",
          "recipientAccountOwnerId": "6811023020",
          "personId": "4112032630",
          "dueDate": "2026-06-15",
          "isDeposit": false,
          "amount": 432640,
          "description": "Stadgreidsluskattur",
          "bookingId": "320770"
        },
        {
          "kind": "Transfer",
          "recipientAccount": "031026009009",
          "recipientAccountOwnerId": "1102713369",
          "recipientReference": "TEST-200",
          "amount": 200,
          "description": "Transfer test 200 ISK",
          "bookingId": "XFER200"
        }
      ]
    }
  ]
}
```

### One request = one submission example
For a request like "create one batch with two lines", the agent must send exactly one `Landsbankinn.Payment.Batch` call containing both lines.
Do not split into separate test calls for transfer and payment slip unless the user explicitly asks for that behavior.

## Key batch fields
| Field | Notes |
|---|---|
| `isOneToMany` | Controls how the debit happens on `outAccount`: `true` = one total withdrawal for the whole batch sum; `false` = one withdrawal per line. Example: two lines totaling `1010714` with `true` produce one withdrawal for `1010714`. |
| `nameOfBatch` | Default: visible only to the creator. Prefix with `*` to make visible to all company users. |
| `dateOfForwardPayment` | Future payment date. Status becomes `OnHold` until the date arrives. Not supported for account types 36/38. |
| `rollbackOnError` | Controls atomicity: `true` = roll back the entire batch if any line has an error; `false` = keep successful lines and inspect the response/poll result to see which lines failed and which succeeded. |

## Operational evidence and tracking
- Always persist both `paymentsId` and `logEntryNo` from the submit response.
- Polling with `Landsbankinn.Payment.ResultBatch` is the authoritative source for final line outcomes.
- If direct reads of internal tracking tables are blocked in your environment, use the result message types plus request-log linkage.

## Async flow
1. Call `Landsbankinn.Payment.Batch` with one or more batch objects.
2. Store the returned `paymentsId`.
3. Call `Landsbankinn.Payment.ResultBatch` for all batches under the `paymentsId` (with optional filter).
4. Continue polling while `status` is `InProgress`; stop at a terminal status.

## Response
```json
{
  "status": "Success",
  "paymentsId": "AB-2026-06-30-0001",
  "logEntryNo": 42
}
```

The response contains **only** the `paymentsId`. Full per-line results are available via `Landsbankinn.Payment.ResultBatch`.

## BatchStatus values (returned when polling)
| Status | Meaning |
|---|---|
| `InProgress` | Bank is still processing. Keep polling. |
| `Completed` | All lines executed successfully. |
| `CompletedWithErrors` | Some lines succeeded; some had errors. |
| `NotConfirmed` | Awaiting approval in the online bank (non-STP). |
| `OnHold` | Future payment awaiting its execution date. |
| `Cancelled` | Batch was cancelled before it ran. |

## Errors
- `Missing required 'batches' array (must contain at least one batch object)`
- `Invalid batch at index N: <reason>` — raised when a batch entry cannot be parsed.

## Tracking tables workflow

### Before sending
Determine the BC debit-side context for every payment line:
- Which BC account (`Account Type` + `Account No.`) will be debited (Vendor, Customer, G/L Account, or Bank Account).
- Which open ledger entry the payment closes (`Applies-to Doc. Type` + `Applies-to Doc. No.`). Leave blank for payments not applied to a specific document.
- Which BC Bank Account (`Bank Account No.`) matches the Landsbankinn source account (`outAccount`) — this is the credit leg for the journal.

### After receiving the response
1. **Write batch row**: `set_records` on table 10036064 "Lbi Payment Batch":
   - `Payments ID` = `paymentsId` from response
   - `Batch Status` = `InProgress`
   - `Batch Count` = number of batch objects submitted
   - `Line Count` = total payment lines across all batches
   - `Bank Account No.` = the BC Bank Account that corresponds to the Landsbankinn source account
   - `Out Account` = `outAccount` from the batch
   - `Date Of Forward Payment` = `dateOfForwardPayment`, if any
   - `Name Of Batch` = `nameOfBatch`, if any
   - `Submitted At` = now
   - `Request Log Entry No.` = `logEntryNo` from response
2. **Write line rows**: `set_records` on table 10036065 "Lbi Payment Line" — one row per submitted line:
   - `Batch Entry No.` = `Entry No.` from step 1
   - `Batch No.` = 1-based index of the batch within the submission
   - `Line No.` = 1-based index of the line within the batch
   - `Account Type` = BC account type for the debit leg
   - `Account No.` = BC account no. for the debit leg
   - `Applies-to Doc. Type` / `Applies-to Doc. No.` = open entry being paid (if applicable)
3. **Store** the `paymentsId` for later polling with `Landsbankinn.Payment.ResultBatch`.

## Troubleshooting - outbound HTTP blocked
If a call fails with `The outbound HTTP call to Landsbankinn was blocked by the Business Central environment...`, this is a security control, not a bug. Do not enable `Allow HttpClient Requests` or add outbound allowlist entries based on this help text. Contact your Business Central administrator or Origo support so they can verify the correct outbound endpoint and apply the change through the normal extension/security review process.

