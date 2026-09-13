---
id: arionbanki-claim-getoperationresult
title: "Arionbanki.Claim.GetOperationResult"
sidebar_label: "Arionbanki.Claim.GetOperationResult"
sidebar_position: 10
description: "Beiðni- og svarsamningur fyrir Arionbanki.Claim.GetOperationResult Bifrastar-skilaboðagerð."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálpar-codeunit skilaboðagerðarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálpar-codeunitinu í forritinu, ekki þessari skrá.
:::


Polls Niðurstaðan of a previous async batch ClaimService operation.
Notaðu this eftir calling CreateBatch, AlterBatch, CancelBatch eða MarkBatchForSecCollection.

**Stefna:** Inbound  
**Efnisgerð:** text/json

## Note
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

Allt tracking Uppfærir eru handled **sjálfkrafa** by the code. You do NOT need til write tracking færslur manually eftir polling. Just Kallaðu á this message Gerð og read Svarið.

What the code does on each Kallaðu á:

1. **Uppfærir batch** (table 10036174): Sets `Batch Status`, `Last Polled At`, increments `Poll Count`, sets `Result Log Entry No.`.
2. **On terminal status** (`Completed`, `CompletedWithErrors`, `NotConfirmed`, `Cancelled`): Sets `Completed At` on the batch.
3. **Uppfærir headers** (table 10036172): fyrir each result row, sets:
   - `Status` = Confirmed Ef the claim succeeded
   - `Status` = Rejected + `Error Text` Ef the claim failed
   - `Last Modified At` = now
4. **Reverses failed claim lines** (table 10036173): Sets `Reversed` = true fyrir rejected claims eða non-success batch outcomes.

### Polling Verkflæði

1. Kallaðu á `Arionbanki.Claim.GetOperationResult` með the `operationId`.
2. Check Svar `batchStatus`:
   - `InProgress` → wait a few seconds, then poll again.
   - Any other value → terminal. Report the per-claim results til the user.
3. No manual data writes needed — Allt tracking er done.

### Verifying tracking state eftir completion:

- `get_records` on table 10036174 "Arion Claim Batch" filtered by `Operation Id` til see batch status og timestamps.
- `get_records` on table 10036172 "Arion Claim Header" filtered by `Batch Entry No.` til see per-claim final status (Confirmed/Rejected).
- `get_records` on table 10036173 "Arion Claim Line" filtered by `Claim Entry No.` til see Ef lines were reversed.

## Troubleshooting - outbound HTTP blocked
Ef a Kallaðu á fails með `The outbound HTTP call to Arion banki was blocked by the Business Central environment...`, this er a security control, not a bug. Do not enable `Allow HttpClient Requests` eða add outbound allowlist entries based on this help text. Contact your Business Central administrator eða Origo support so they getur verify the correct outbound Endapunktur og apply the change through the normal extension/security review process.


