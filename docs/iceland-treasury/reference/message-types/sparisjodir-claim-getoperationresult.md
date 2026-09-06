---
id: sparisjodir-claim-getoperationresult
title: "Sparisjodir.Claim.GetOperationResult"
sidebar_label: "Sparisjodir.Claim.GetOperationResult"
sidebar_position: 145
description: "Request and response contract for the Sparisjodir.Claim.GetOperationResult Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


Polls the result of a previous async batch ClaimService operation.
Use this after calling CreateBatch, AlterBatch, CancelBatch, ReCreateBatch or MarkBatchForSecCollection.

**Direction:** Inbound  
**Content-Type:** text/json

## AI note
Use `claimDate` for the BC/JSON claim key date and `dueDate` for the BC/JSON final due date. The bank SOAP/XML API still uses `ct:DueDate` for the claim key date and `ct:FinalDueDate` for the final due date; do not rename those XML elements when generating bank-integration examples.

## Use when
Use this message after an async claim operation returns `operationId`. It retrieves the current aggregate status and per-claim result rows for the submitted operation.

## Request
```json
{
  "operationId": "abc123-..."
}
```

## Response
Returns `status`, `operationId`, `batchStatus`, `logEntryNo`, and a `results` array.

| `batchStatus` | Meaning |
|---|---|
| `InProgress` | Operation is still running at the bank. Continue polling. |
| `Completed` | All items succeeded. |
| `CompletedWithErrors` | Some items failed; inspect per-claim result rows. |
| `NotConfirmed` | Operation not yet confirmed by the bank. |
| `Cancelled` | Operation was cancelled. |
| `OnHold` | Operation on hold (e.g. future-dated). |

Each result contains: `claimKey`, `success`, `errorCode`, `errorMessage`.
Continue polling while `batchStatus` is `InProgress`; stop when it reaches one of the other values.

## Errors
- `Missing required 'operationId'`

## Tracking tables update (automatic)

All tracking updates are handled **automatically** by the code. The AI/agent does NOT need to write tracking records manually after polling. Just call this message type and read the response.

What the code does on each call:

1. **Updates batch** (table 10035924): Sets `Batch Status`, `Last Polled At`, increments `Poll Count`, sets `Result Log Entry No.`.
2. **On terminal status** (`Completed`, `CompletedWithErrors`, `NotConfirmed`, `Cancelled`): Sets `Completed At` on the batch.
3. **Updates headers** (table 10035922): For each result row, sets:
   - `Status` = Confirmed if the claim succeeded
   - `Status` = Rejected + `Error Text` if the claim failed
   - `Last Modified At` = now
4. **Reverses failed claim lines** (table 10035923): Sets `Reversed` = true for rejected claims or non-success batch outcomes.

### Polling workflow for AI/agent:

1. Call `Sparisjodir.Claim.GetOperationResult` with the `operationId`.
2. Check response `batchStatus`:
   - `InProgress` → wait a few seconds, then poll again.
   - Any other value → terminal. Report the per-claim results to the user.
3. No manual data writes needed — all tracking is done.

### Verifying tracking state after completion:

- `get_records` on table 10035924 "Spar Claim Batch" filtered by `Operation Id` to see batch status and timestamps.
- `get_records` on table 10035922 "Spar Claim Header" filtered by `Batch Entry No.` to see per-claim final status (Confirmed/Rejected).
- `get_records` on table 10035923 "Spar Claim Line" filtered by `Claim Entry No.` to see if lines were reversed.

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

