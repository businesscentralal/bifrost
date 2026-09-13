---
id: sparisjodir-claim-cancelbatch
title: "Sparisjodir.Claim.CancelBatch"
sidebar_label: "Sparisjodir.Claim.CancelBatch"
sidebar_position: 143
description: "Beiðni- og svarsamningur fyrir Sparisjodir.Claim.CancelBatch Bifrastar-skilaboðagerð."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálpar-codeunit skilaboðagerðarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálpar-codeunitinu í forritinu, ekki þessari skrá.
:::


Sendir a batch of Sparisjóður claim keys fyrir async cancellation.
Poll Niðurstaðan með **Sparisjodir.Claim.GetOperationResult**.

**Stefna:** Inbound  
**Efnisgerð:** text/json

## AI note
Notaðu `claimDate` fyrir the BC/JSON claim key date og `dueDate` fyrir the BC/JSON final due date. The bank SOAP/XML API still uses `ct:DueDate` fyrir the claim key date og `ct:FinalDueDate` fyrir the final due date; do not rename those XML elements Þegar generating bank-integration Dæmi.

## Notað þegar
Notaðu this message til cancel many claims asynchronously by key. Each key object verður að contain `claimant`, `account`, og `claimDate`.

### XML namespace note (internal)
The `<ClaimKey>` element in the SOAP body er in the **Claims** namespace (no `ct:` prefix), not the ClaimTypes namespace. Its children (`Claimant`, `Account`, `DueDate`) eru in the ClaimTypes (`ct:`) namespace. This er handled by the builder sjálfkrafa.

## Beiðni
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

## Svar
Skilar `status`, `operationId`, `batchStatus`, `logEntryNo`, og a `results` array.
Poll `Sparisjodir.Claim.GetOperationResult` með `operationId` Þegar `batchStatus` er `InProgress`.

## Tracking Verkflæði

### Pre-Kallaðu á steps (AI/agent verður að do):

1. **Identify claims til cancel**: Fyrirspurn table 10035922 "Spar Claim Header" til find headers með matching claim key (ClaimantNo_, ClaimAccount, ClaimDate). Aðeins cancel claims með Status = Confirmed eða Submitted.
2. **Kallaðu á CancelBatch**: Send this message Gerð með the keys array.

### Post-Kallaðu á steps (AI/agent verður að do):

1. **Poll GetOperationResult**: Kallaðu á `Sparisjodir.Claim.GetOperationResult` með the returned `operationId` until `batchStatus` er terminal (Completed, CompletedWithErrors, etc.).
2. **Update header status**: fyrir each með góðum árangri cancelled claim, update table 10035922 "Spar Claim Header" til set `Status` = Cancelled.
3. **Verify cancellation**: Optionally Kallaðu á `Sparisjodir.Claim.Query` til confirm the claim no longer appears in the bank.

### Key differences frá Create/Alter

- Cancel uses `"keys"` (not `"claims"`) — Aðeins the claim key fields eru needed.
- No `amount`, `identifier`, `templateCode`, eða other claim body fields eru nauðsynlegt.
- eftir cancellation, the claim disappears frá QueryClaims results entirely.

## Errors
- `Missing required 'keys' array`
- `Key entry at index N is invalid`

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


