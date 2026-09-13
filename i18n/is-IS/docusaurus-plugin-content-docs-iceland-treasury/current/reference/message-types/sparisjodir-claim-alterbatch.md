---
id: sparisjodir-claim-alterbatch
title: "Sparisjodir.Claim.AlterBatch"
sidebar_label: "Sparisjodir.Claim.AlterBatch"
sidebar_position: 142
description: "Beiðni- og svarsamningur fyrir Sparisjodir.Claim.AlterBatch Bifrastar-skilaboðagerð."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálpar-codeunit skilaboðagerðarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálpar-codeunitinu í forritinu, ekki þessari skrá.
:::


Sendir a batch of existing Sparisjóður claims fyrir async alteration.
Poll Niðurstaðan með **Sparisjodir.Claim.GetOperationResult**.

**Stefna:** Inbound  
**Efnisgerð:** text/json

## AI note
Notaðu `claimDate` fyrir the BC/JSON claim key date og `dueDate` fyrir the BC/JSON final due date. The bank SOAP/XML API still uses `ct:DueDate` fyrir the claim key date og `ct:FinalDueDate` fyrir the final due date; do not rename those XML elements Þegar generating bank-integration Dæmi.

## Notað þegar
Notaðu this message fyrir async alteration of existing claims. Each claim object verður að include the immutable `claimant + account + claimDate` key og the fields til update.

## Beiðni
```json
{
  "claims": [
    {
      "claimant":    "1234567",
      "account":     "0101-26-123456",
      "claimDate":   "2026-06-15",
      "amount":      16000.00,
      "identifier":  "100",
      "dueDate":     "2026-07-15",
      "templateCode": "37"
    }
  ]
}
```

### CRITICAL: Send Allt fields, not just changed ones
The bank uses WCF positional XML deserialization. Ef valfrjálst elements like `identifier` eru omitted, later elements (e.g. `templateCode`) eru misaligned og the bank rejects Beiðnin með misleading errors like "The TemplateCode Reitur er nauðsynlegt." **Always include `identifier`, `amount`, `dueDate`, og `templateCode`** even Ef you eru Aðeins changing one Reitur.

### Template Code
The `templateCode` Reitur er **nauðsynlegt by the bank** fyrir AlterClaims. Notaðu "37" (staðlaða claims category) unless instructed otherwise. Fyrirspurn existing claims til verify the correct code.

### Amount
Þegar altering the amount, the new value verður að equal the **Remaining Amount** (Reitur 29) frá the linked Cust. Ledger Entry (table 21). This er the fulla invoice amount þar á meðal VAT.

## Async flow
Svarið contains `operationId`. Poll `Sparisjodir.Claim.GetOperationResult` með that value until the operation reaches a terminal `batchStatus`.

## Svar
Skilar `status`, `operationId`, `batchStatus`, `logEntryNo`, og a `results` array.

## Errors
- `Missing required 'claims' array`
- `Claim entry at index N is invalid`

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


