---
id: sparisjodir-claim-markbatchforseccollection
title: "Sparisjodir.Claim.MarkBatchForSecCollection"
sidebar_label: "Sparisjodir.Claim.MarkBatchForSecCollection"
sidebar_position: 146
description: "Beiðni- og svarsamningur fyrir Sparisjodir.Claim.MarkBatchForSecCollection Bifrastar-skilaboðagerð."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálpar-codeunit skilaboðagerðarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálpar-codeunitinu í forritinu, ekki þessari skrá.
:::


Sendir a batch of Sparisjóður claim keys fyrir async secondary collection marking.
Poll Niðurstaðan með **Sparisjodir.Claim.GetOperationResult**.

**Stefna:** Inbound  
**Efnisgerð:** text/json

## AI note
Notaðu `claimDate` fyrir the BC/JSON claim key date og `dueDate` fyrir the BC/JSON final due date. The bank SOAP/XML API still uses `ct:DueDate` fyrir the claim key date og `ct:FinalDueDate` fyrir the final due date; do not rename those XML elements Þegar generating bank-integration Dæmi.

## Notað þegar
Notaðu this message til mark many claims fyrir secondary collection asynchronously. Each key object verður að contain `claimant`, `account`, og `claimDate`.

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
Poll `Sparisjodir.Claim.GetOperationResult` með `operationId` fyrir the final per-claim results.

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


