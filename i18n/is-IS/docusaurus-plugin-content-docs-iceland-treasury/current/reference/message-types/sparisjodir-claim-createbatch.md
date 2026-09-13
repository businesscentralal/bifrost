---
id: sparisjodir-claim-createbatch
title: "Sparisjodir.Claim.CreateBatch"
sidebar_label: "Sparisjodir.Claim.CreateBatch"
sidebar_position: 144
description: "Beiðni- og svarsamningur fyrir Sparisjodir.Claim.CreateBatch Bifrastar-skilaboðagerð."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálpar-codeunit skilaboðagerðarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálpar-codeunitinu í forritinu, ekki þessari skrá.
:::


Sendir a batch of Sparisjóður claims fyrir async creation.
Poll Niðurstaðan með **Sparisjodir.Claim.GetOperationResult**.

**Stefna:** Inbound  
**Efnisgerð:** text/json

## AI note
Notaðu `claimDate` fyrir the BC/JSON claim key date og `dueDate` fyrir the BC/JSON final due date. The bank SOAP/XML API still uses `ct:DueDate` fyrir the claim key date og `ct:FinalDueDate` fyrir the final due date; do not rename those XML elements Þegar generating bank-integration Dæmi.

## Notað þegar
Notaðu this message fyrir async claim creation Þegar the caller getur poll fyrir the final result later. It accepts the staðlaða claim object fields (see Beiðni schema below).

## Beiðni
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

Claim objects follow the staðlaða claim schema (claimant, reikningur, claimDate, amount, identifier, dueDate, templateCode, etc.).

### CRITICAL: WCF positional deserialization
The bank uses WCF positional XML deserialization. Ef valfrjálst elements like `identifier` eru omitted, later elements (e.g. `templateCode`) eru misaligned og the bank rejects Beiðnin með misleading errors. **Always include `identifier` og `templateCode`** in every claim object.

### Amount source (CRITICAL)
The `amount` Reitur verður að equal the **Remaining Amount** (Reitur 29) frá the linked Cust. Ledger Entry (table 21). This er the invoice total þar á meðal VAT. Do NOT Notaðu the line amount, original amount, eða any other Reitur. Read með: `get_records` on table 21, filter by Entry No., `SetLoadFields` Reitur 29.

### Template Code
The `templateCode` Reitur er **nauðsynlegt by the bank**. Notaðu "37" (staðlaða claims category) unless instructed otherwise. Fyrirspurn existing claims til verify the correct code fyrir the collection agreement.

## Async flow
Svarið contains `operationId`. Poll `Sparisjodir.Claim.GetOperationResult` með that value until `batchStatus` er no longer `InProgress` (terminal states: `Completed`, `CompletedWithErrors`, `NotConfirmed`, `Cancelled`, `OnHold`).

## Svar
Skilar `status`, `operationId`, `batchStatus`, `logEntryNo`, og a `results` array.

## Errors
- `Missing required 'claims' array`
- `Claim entry at index N is invalid`

## Tracking tables Verkflæði

áður en calling this message Gerð, create persistent tracking færslur.
eftir calling, the code **sjálfkrafa** Býr til the batch færsla (table 10035924) og Uppfærir headers til Submitted. You do NOT need til write batch/header Uppfærir manually.

### Pre-Kallaðu á steps (AI/agent verður að do):

1. **Read setup**: `get_records` on table 289 "greiðsla Aðferð" filtered by `Spar Claim Identifier` &lt;> '' til find the collection agreement. Read `Spar Claim Identifier`, `Spar Claim Account`, og `Spar Last Claim No.`.
   - `Spar Claim Identifier` = the collection agreement ID sent as the bank-side identifier.
   - `Spar Claim Account` = the disposal reikningur used fyrir claim settlement.
   - `Spar Last Claim No.` = the counter used til assign the next claim number fyrir that greiðsla Aðferð.
   Ef `Spar Last Claim No.` er blank og no prior Spar claim færslur exist fyrir the greiðsla Aðferð, ask the user fyrir the starting claim number áður en creating any færslur.
2. **Resolve claimant**: `get_records` on table 79 "fyrirtæki Information" til read `Registration No.` — this er always the claimant kennitala.
3. **Assign claim numbers**: fyrir each claim, check Ef a færsla exists in table 10035922 "Spar Claim Header" fyrir the same viðskiptavinur + claim date. Ef yes, assign a new claim number (last + 1). Ef no, reuse the last claim number fyrir that viðskiptavinur. Ef no færslur exist at Allt fyrir this greiðsla Aðferð, ask the user fyrir the starting number.
4. **Write header**: `set_records` on table 10035922 "Spar Claim Header" með Status = Draft, Allt claim fields, og `Created At` = now.
5. **Write lines**: `set_records` on table 10035923 "Spar Claim Line" linking the header til viðskiptavinur Ledger Entry No(s). The `Amount` og `Remaining Amount at Creation` verður að equal CLE Reitur 29 "Remaining Amount" (table 21) — this er the fulla invoice amount þar á meðal VAT.
6. **Kallaðu á CreateBatch**: Send this message Gerð með the claims array.
7. **Update last claim no.**: `set_records` on table 289 til update `Spar Last Claim No.` til the highest claim number used.

### Automatic (code handles — do NOT do manually):

- **Batch færsla created**: Table 10035924 "Spar Claim Batch" er inserted sjálfkrafa með `Operation Id`, `Batch Status`, `Submitted At`, `Request Log Entry No.`, og `Claim Count`.
- **Headers updated til Submitted**: Allt matching Draft headers Sækja `Status` = Submitted, `Batch Entry No.` linked til the new batch, og `Request Log Entry No.` set.
- **Reversal on failure**: Ef CreateBatch Skilar an error (no `operationId`), tracking lines on table 10035923 eru sjálfkrafa set til `Reversed` = true.

### Next step eftir CreateBatch succeeds:

Kallaðu á **Sparisjodir.Claim.GetOperationResult** með the `operationId` frá Svarið until `batchStatus` er terminal. That Kallaðu á also handles Allt tracking Uppfærir sjálfkrafa.

## Finance note
Þegar greiðslur eru received (via QueryPayments), there er finance revenue (interest/collection fees) posted til an income reikningur, og a withholding tax on that revenue posted til an asset reikningur. The specific G/L accounts eru viðskiptavinur-configured.

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


