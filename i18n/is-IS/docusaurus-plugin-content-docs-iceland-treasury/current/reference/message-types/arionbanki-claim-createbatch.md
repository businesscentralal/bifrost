---
id: arionbanki-claim-createbatch
title: "Arionbanki.Claim.CreateBatch"
sidebar_label: "Arionbanki.Claim.CreateBatch"
sidebar_position: 9
description: "Beiðni- og svarsamningur fyrir Arionbanki.Claim.CreateBatch Bifrastar-skilaboðagerð."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálpar-codeunit skilaboðagerðarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálpar-codeunitinu í forritinu, ekki þessari skrá.
:::


Sendir a batch of Arion banki claims fyrir async creation.
Poll Niðurstaðan með **Arionbanki.Claim.GetOperationResult**.

**Stefna:** Inbound  
**Efnisgerð:** text/json

## Note
`claimDate` er the BC/JSON claim key date og `dueDate` er the final due date. The bank SOAP/XML API uses `ct:DueDate` fyrir the claim key date og `ct:FinalDueDate` fyrir the final due date; do not rename those XML elements Þegar generating bank-integration Dæmi.

## Notað þegar
Notaðu this message fyrir async claim creation Þegar the caller getur poll fyrir the final result later. It accepts the staðlaða claim object fields (see Beiðni schema below).

## Usage notes
Create one batch per user Beiðni, keep each claim object complete, og do not omit positional fields that the bank expects. Normalize claimant og reikningur values til the wire format shown in the Dæmi, preserve `claimDate` og `dueDate` as ISO dates, og always poll `Arionbanki.Claim.GetOperationResult` með the returned `operationId`.
Persist `operationId` og `logEntryNo` frá submit og poll calls as the audit trail fyrir this async Verkflæði.

## Beiðni
```json
{
  "claims": [
    {
      "claimant":    "1234567",
      "account":     "0101-26-123456",
      "claimDate":   "2026-06-15",
      "amount":      15000.00,   // MUST equal the Cust. Ledger Entry "Remaining Amount" FlowField (table 21) - verify the field number in your BC version, do not hardcode it
      "identifier":  "INV-2026-0001",
      "templateCode": "37"
    }
  ]
}
```

Claim objects follow the staðlaða claim schema (claimant, reikningur, claimDate, amount, identifier, dueDate, templateCode, etc.).

### CRITICAL: WCF positional deserialization
The bank uses WCF positional XML deserialization. Ef valfrjálst elements like `identifier` eru omitted, later elements (e.g. `templateCode`) eru misaligned og the bank rejects Beiðnin með misleading errors. Always include `identifier` og `templateCode` in every claim object.

### Amount source (CRITICAL)
The `amount` Reitur verður að equal the Cust. Ledger Entry "Remaining Amount" FlowField (table 21) — this er the invoice total þar á meðal VAT. Do not Notaðu the line amount, original amount, eða any other Reitur. Confirm the exact Reitur number fyrir your BC version með `Help_Fields_Get`/table metadata áður en hardcoding it — Reitur numbers getur differ between versions og a wrong number mun silently read an unrelated Reitur.

### Template Code
The `templateCode` Reitur er nauðsynlegt by the bank. Notaðu "37" (staðlaða claims category) unless instructed otherwise. Fyrirspurn existing claims til verify the correct code fyrir the collection agreement.

## Async flow
Svarið contains `operationId`. Poll `Arionbanki.Claim.GetOperationResult` með that value until `batchStatus` er no longer `InProgress` (terminal states: `Completed`, `CompletedWithErrors`, `NotConfirmed`, `Cancelled`, `OnHold`).

## Svar
Skilar `status`, `operationId`, `batchStatus`, `logEntryNo`, og a `results` array.

## Errors
- `Missing required 'claims' array`
- `Claim entry at index N is invalid`

## Tracking tables Verkflæði

áður en calling this message Gerð, create persistent tracking færslur.
eftir calling, the code sjálfkrafa Býr til the batch færsla (table 10036174) og Uppfærir headers til Submitted. Do not write batch/header status Uppfærir manually eftir a successful Kallaðu á.

### Pre-Kallaðu á steps

1. Read setup: `get_records` on table 289 "greiðsla Aðferð" filtered by `ORI Arion Claim Identifier` &lt;> '' til find the collection agreement. Read `ORI Arion Claim Identifier` og `ORI Arion Last Claim No.` (tableextension 10036152 "Arion greiðsla Aðferð Ext" — these eru the Aðeins two claim-specific fields on greiðsla Aðferð; the disposal/settlement reikningur comes frá the staðlaða `Bal. Account Type`/`Bal. Account No.` fields, not a claim-specific Reitur).
   - `ORI Arion Claim Identifier` = the collection agreement ID sent as the bank-side identifier.
   - `ORI Arion Last Claim No.` = the counter used til assign the next claim number fyrir that greiðsla Aðferð.
   Ef `ORI Arion Last Claim No.` er blank og no prior claim færslur exist fyrir the greiðsla Aðferð, ask the user fyrir the starting claim number áður en creating any færslur.
2. Resolve claimant: `get_records` on table 79 "fyrirtæki Information" til read `Registration No.` — this er the claimant kennitala.
3. Assign claim numbers: fyrir each claim, check Ef a færsla exists in table 10036172 "Arion Claim Header" fyrir the same viðskiptavinur + claim date. Ef yes, assign a new claim number (last + 1). Ef no, reuse the last claim number fyrir that viðskiptavinur. Ef no færslur exist at Allt fyrir this greiðsla Aðferð, ask the user fyrir the starting number.
4. Write header: `set_records` on table 10036172 "Arion Claim Header" með Status = Draft, Allt claim fields, og `Created At` = now.
5. Write lines: `set_records` on table 10036173 "Arion Claim Line" linking the header til viðskiptavinur Ledger Entry No(s). `Amount` og `Remaining Amount at Creation` verður að equal the Cust. Ledger Entry "Remaining Amount" (table 21) — the fulla invoice amount þar á meðal VAT.
6. Kallaðu á CreateBatch: send this message Gerð með the claims array.
7. Update last claim no.: `set_records` on table 289 til update `ORI Arion Last Claim No.` til the highest claim number used.

### Automatic (code handles — do not do manually)

- Batch færsla created: table 10036174 "Arion Claim Batch" er inserted sjálfkrafa með `Operation Id`, `Batch Status`, `Submitted At`, `Request Log Entry No.`, og `Claim Count`.
- Headers updated til Submitted: Allt matching Draft headers Sækja `Status` = Submitted, `Batch Entry No.` linked til the new batch, og `Request Log Entry No.` set.
- Reversal on failure: Ef CreateBatch Skilar an error (no `operationId`), tracking lines on table 10036173 eru sjálfkrafa set til `Reversed` = true.

### Next step eftir CreateBatch succeeds

Kallaðu á **Arionbanki.Claim.GetOperationResult** með the `operationId` frá Svarið until `batchStatus` er terminal. That Kallaðu á also handles Allt tracking Uppfærir sjálfkrafa.

## Finance note
Þegar greiðslur eru received (via QueryPayments), there er finance revenue (interest/collection fees) posted til an income reikningur, og a withholding tax on that revenue posted til an asset reikningur. The specific G/L accounts eru viðskiptavinur-configured.

## Troubleshooting - outbound HTTP blocked
Ef a Kallaðu á fails með `The outbound HTTP call to Arion banki was blocked by the Business Central environment...`, this er a security control, not a bug. Do not enable `Allow HttpClient Requests` eða add outbound allowlist entries based on this help text. Contact your Business Central administrator eða Origo support so they getur verify the correct outbound Endapunktur og apply the change through the normal extension/security review process.


