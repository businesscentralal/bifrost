---
id: sparisjodir-claim-getoperationresult
title: "Sparisjodir.Claim.GetOperationResult"
sidebar_label: "Sparisjodir.Claim.GetOperationResult"
sidebar_position: 145
description: "Beiðni- og svarsamningur fyrir Sparisjodir.Claim.GetOperationResult Bifrastar-skilaboðagerð."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálpar-codeunit skilaboðagerðarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálpar-codeunitinu í forritinu, ekki þessari skrá.
:::


Polls Niðurstaðan of a previous async batch ClaimService operation.
Notaðu this eftir calling CreateBatch, AlterBatch, CancelBatch, ReCreateBatch eða MarkBatchForSecCollection.

**Stefna:** Inbound  
**Efnisgerð:** text/json

## AI note
Notaðu `claimDate` fyrir the BC/JSON claim key date og `dueDate` fyrir the BC/JSON final due date. The bank SOAP/XML API still uses `ct:DueDate` fyrir the claim key date og `ct:FinalDueDate` fyrir the final due date; do not rename those XML elements Þegar generating bank-integration Dæmi.

## Notað þegar
Notaðu this message eftir an async claim operation Skilar `operationId`. It Sækir the current aggregate status og per-claim result rows fyrir the submitted operation.

## Beiðni
```json
{
  "operationId": "abc123-..."
}
```

## Svar
Skilar `status`, `operationId`, `batchStatus`, `logEntryNo`, og a `results` array.

| `batchStatus` | Meaning |
|---|---|
| `InProgress` | Operation er still running at the bank. Continue polling. |
| `Completed` | Allt items succeeded. |
| `CompletedWithErrors` | Some items failed; inspect per-claim result rows. |
| `NotConfirmed` | Operation not yet confirmed by the bank. |
| `Cancelled` | Operation was cancelled. |
| `OnHold` | Operation on hold (e.g. future-dated). |

Each result contains: `claimKey`, `success`, `errorCode`, `errorMessage`.
Continue polling while `batchStatus` er `InProgress`; stop Þegar it reaches one of the other values.

## Errors
- `Missing required 'operationId'`

## Tracking tables update (automatic)

Allt tracking Uppfærir eru handled **sjálfkrafa** by the code. The AI/agent does NOT need til write tracking færslur manually eftir polling. Just Kallaðu á this message Gerð og read Svarið.

What the code does on each Kallaðu á:

1. **Uppfærir batch** (table 10035924): Sets `Batch Status`, `Last Polled At`, increments `Poll Count`, sets `Result Log Entry No.`.
2. **On terminal status** (`Completed`, `CompletedWithErrors`, `NotConfirmed`, `Cancelled`): Sets `Completed At` on the batch.
3. **Uppfærir headers** (table 10035922): fyrir each result row, sets:
   - `Status` = Confirmed Ef the claim succeeded
   - `Status` = Rejected + `Error Text` Ef the claim failed
   - `Last Modified At` = now
4. **Reverses failed claim lines** (table 10035923): Sets `Reversed` = true fyrir rejected claims eða non-success batch outcomes.

### Polling Verkflæði fyrir AI/agent:

1. Kallaðu á `Sparisjodir.Claim.GetOperationResult` með the `operationId`.
2. Check Svar `batchStatus`:
   - `InProgress` → wait a few seconds, then poll again.
   - Any other value → terminal. Report the per-claim results til the user.
3. No manual data writes needed — Allt tracking er done.

### Verifying tracking state eftir completion:

- `get_records` on table 10035924 "Spar Claim Batch" filtered by `Operation Id` til see batch status og timestamps.
- `get_records` on table 10035922 "Spar Claim Header" filtered by `Batch Entry No.` til see per-claim final status (Confirmed/Rejected).
- `get_records` on table 10035923 "Spar Claim Line" filtered by `Claim Entry No.` til see Ef lines were reversed.

## Troubleshooting - outbound HTTP blocked
Ef a Kallaðu á fails með `The outbound HTTP call to Sparisjóður was blocked by the Business Central environment...`, verify permission til change `Allow HttpClient Requests` og then enable it in Extension Management.

### Check permission áður en changing the setting
- Verify you have permission til update table **NAV App Setting** (AppID = 0FB9B76C-D2BE-462D-B026-D490D0724164) og til manage extension settings.
- Ef you do not have permission, ask a BC administrator til perform the change.

### Steps til resolve
1. Open **Extension Management** in Business Central.
2. Find **Bifrost Spar Banki** og open **Extension Settings**.
3. Turn on **Allow HttpClient Requests**.
4. Ef your environment uses an Endapunktur allowlist, allow `https://<bank>-iobs.heimabanki.is`.


