---
id: landsbankinn-payment-resultbatch
title: "Landsbankinn.Payment.ResultBatch"
sidebar_label: "Landsbankinn.Payment.ResultBatch"
sidebar_position: 128
description: "Request and response contract for the Landsbankinn.Payment.ResultBatch Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


Queries the result of a previously submitted `Landsbankinn.Payment.Batch` call for **one or all batches** under a `paymentsId`, with optional line-level filtering. Use this when you submitted multiple batches and need a combined status view.

**Direction:** Outbound  
**Content-Type:** text/json

## Use when
- You submitted one or more async payment batches and need a combined or filtered result.
- You want to filter bank results to errors, accepted lines, status rows, or all rows.
- You want to query all batches under one `paymentsId` in a single call.
- You need the confirmed bank response as the basis for creating or updating the payment journal for posting.

## Request
```json
{
  "paymentsId":   "AB-2026-06-30-0001",  // required
  "filterStatus": "GetAll",               // (optional) GetStatus | GetErrors | GetOkay | GetAll
  "batchNo":      0                       // (optional) 0 = all batches; >0 = specific batch
}
```

## Filter behavior
| `filterStatus` | Returns |
|---|---|
| `GetStatus` | Bank batch-status rows only (no line detail). |
| `GetErrors` | Only lines where `isError = true`. |
| `GetOkay` | Only lines where `isError = false`. |
| `GetAll` | All lines returned by the bank. |

`GetError` (singular) is accepted as a compatibility alias and treated as `GetErrors`.

## Response
Same `batches[].lines[]` response shape as this type's own result rows, plus batch-level `dateOfPayment`, `dateOfForwardPayment`, `outAccount`, `outAccountOwnerId`, and per-line claim cost fields.

## AI/Agent playbook
Use this message to reconcile one `paymentsId` at a time. Keep `filterStatus` explicit, use `GetAll` only when the caller wants the full response, and treat `batchNo = 0` as the all-batches view. When the result reaches a terminal status, use the confirmed data to update BC posting or tracking records; do not invent bank amounts or costs.
Persist `logEntryNo` from every poll because it links to raw request/response evidence even when internal tracking tables are protected.

## BatchStatus values
| Status | Meaning |
|---|---|
| `InProgress` | Bank is still processing. Continue polling. |
| `Completed` | All lines executed successfully. |
| `CompletedWithErrors` | Some lines succeeded; some had errors. |
| `NotConfirmed` | Awaiting approval in the online bank (non-STP). |
| `OnHold` | Future payment awaiting its execution date. |
| `Cancelled` | Batch was cancelled before it ran. |

## Claim payments — incurred costs
Lines from claim payments include cost-breakdown fields: `amountDue`, `defaultCosts`, `otherCosts`, `otherDefaultCosts`, `defaultInterest`, `noticeAndPaymentFee`, `discount`.
STP payers pay incurred costs automatically. Non-STP payers receive an error if the confirmed amount differs from the original claim amount.

## Errors
- `Missing required 'paymentsId' in the request`
- `'filterStatus' must be one of: GetStatus, GetErrors, GetOkay, GetAll`

## Tracking tables update

After each poll, update the tracking tables and — on terminal status — follow the normal process: read the confirmed bank response and create or update the payment journal for posting.

1. **For each batch in the response**: look up table 10036064 "Lbi Payment Batch" by `Payments ID`.
2. **Update each batch row**: `set_records` on table 10036064:
   - `Batch Status` = `status` from the result entry
   - `Last Polled At` = now
   - `Poll Count` += 1
   - `Result Log Entry No.` = `logEntryNo` from response (contains the full XML with confirmed amounts and expense breakdowns)
   - If `Batch Status` changed since last poll: update table 10036065 "Lbi Payment Line" `Batch Status` for all lines under the batch entry
3. **On terminal status** (any status except `InProgress`): set `Completed At` = now.
4. **Create payment journal** when status is `Completed` or `CompletedWithErrors` and `Journal Created` = false:
   a. Read line rows: `get_records` on table 10036065 "Lbi Payment Line" filtered by `Batch Entry No.` = the batch `Entry No.`
   b. For each successful (non-error) line, match by `Batch No.` + `Line No.` in the result XML to get the confirmed `amount`.
   c. Create a gen. journal debit line: `Account Type` / `Account No.` for the confirmed amount; set `Applies-to Doc. Type` / `Applies-to Doc. No.` if present.
   d. Create the balancing credit line against `Bank Account No.` from the batch row.
   e. **Expense lines** (claim-type payments with incurred costs): read `defaultCosts`, `otherCosts`, `otherDefaultCosts`, `defaultInterest`, `noticeAndPaymentFee` from the result XML.
      For each non-zero cost, create an additional G/L debit journal line using these accounts:
      - `defaultCosts` + `otherCosts` + `otherDefaultCosts`: prompt for the installation-specific G/L account, unless it is already configured for this installation.
      - `defaultInterest`: prompt for the installation-specific G/L account, unless it is already configured for this installation.
      - `noticeAndPaymentFee`: prompt for the installation-specific G/L account, unless it is already configured for this installation.
      Every installation must define or confirm these expense accounts before the first journal is created. Do not invent account numbers.
      After the user provides them, store them as installation-specific setup so later journals can use the configured accounts without prompting again.
      If the result XML includes withholding tax on claim-payment revenue, ask the user which asset account to use before posting it.
   f. Set `Journal Created` = true on each processed line row and on the batch row.
5. **Error lines**: lines with `isError = true` are skipped for journaling; the error details are in the result XML for user review.
6. **If no expense fields are non-zero**: create the normal payment journal only; no extra expense journal lines are needed.

Continue polling while any batch in the set has `Batch Status` = `InProgress`. Stop when all have reached a terminal status.

## Troubleshooting - outbound HTTP blocked
If a call fails with `The outbound HTTP call to Landsbankinn was blocked by the Business Central environment...`, this is a security control, not a bug. Do not enable `Allow HttpClient Requests` or add outbound allowlist entries based on this help text. Contact your Business Central administrator or Origo support so they can verify the correct outbound endpoint and apply the change through the normal extension/security review process.

