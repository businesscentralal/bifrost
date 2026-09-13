---
id: finance-bankreconciliation-create
title: "Finance.BankReconciliation.Create"
sidebar_label: "Finance.BankReconciliation.Create"
sidebar_position: 35
description: "Beiðni- og svarsamningur fyrir Finance.BankReconciliation.Create Bifröst skilaboðategund."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálparkóða skilaboðategundarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálparkóðanum í forritinu, ekki þessari skrá.
:::


## Dæmi um beiðni
```json
{
  "subject": "BANK-MAIN",
  "data": {
    "statementDate": "2026-05-30"
  }
}
```
Býr til a bank reconciliation fyrir statement Gerð `Bank Reconciliation`, eða reuses an fyrirliggjandi empty reconciliation fyrir the sama bank account.

## Workflow Context
This er the fyrsta step in the bank reconciliation cycle:
1. `Finance.BankReconciliation.Create` -- create eða reuse the reconciliation header (`Bank Acc. Reconciliation` með `Statement Type = Bank Reconciliation`) og import lines í `Bank Acc. Reconciliation Line`.
2. `Finance.BankReconciliation.Match` -- pair statement lines með `Bank Account Ledger Entry` rows. Match stamps the BLE (`Statement No.`, `Statement Line No.`, `Statement Status = Bank Acc. Entry Applied`).
3. `Finance.BankReconciliation.Reset` (valfrjálst) -- clear all match stamps til redo the match plan.
4. `Finance.BankReconciliation.Post` -- run `Bank Acc. Reconciliation Post`, close matched BLEs, og delete the reconciliation header.

This flow does ekki create `Applied Payment Entry` rows. Those exist aðeins fyrir Statement Gerð = `Payment Application`, which er ekki exposed með this extension.

## Yfirlit
- Innkomandi operation.
- Resolves bank account úr `subject` eða request JSON.
- Imports bank statement lines; import failures eru returned as `warning` while `status` stays `Success`.
- ef `statementDate` er omitted og an fyrirliggjandi reconciliation er reused, statement dagsetning er reset til blank (`0D`).

## Identifier Resolution
Bank account er resolved in this order:
1. `subject` as GUID -> Bank Account SystemId
2. `subject` as text -> Bank Account No.
3. JSON keys `bankAccountNo`, `bankAccountId`, `id`, `systemId`, `recordSystemId`.

## Request Fields
- `subject` (Text|Guid, valfrjálst): Bank Account No. eða Bank Account SystemId.
- `data.statementDate` (dagsetning, valfrjálst): statement dagsetning til assign.
- `data.bankAccountNo` (Code[20], valfrjálst): bank account númer fallback þegar subject er empty.
- `data.bankAccountId` / `data.id` / `data.systemId` / `data.recordSystemId` (Guid, valfrjálst): bank account GUID fallback fields.

## Tókst Dæmi um svar
```json
{
  "status": "Success",
  "reused": true,
  "bankAccountNo": "BANK-MAIN",
  "statementNo": "STMT-000123",
  "statementDate": "2026-05-30",
  "systemId": "<guid>",
  "lineCount": 3,
  "warning": "<optional import warning>"
}
```

## Svarreitir
- `status`: `Success` eða `Error`.
- `reused`: `true` þegar an empty reconciliation was reused; `false` þegar a ný one was created.
- `bankAccountNo`: resolved bank account númer.
- `statementNo`: reconciliation statement númer.
- `statementDate`: assigned statement dagsetning, blank þegar reset til `0D`.
- `systemId`: reconciliation SystemId (GUID, no braces).
- `lineCount`: númer of imported reconciliation lines.
- `warning`: valfrjálst import warning text.

## Villa Handling
```json
{
  "status": "Error",
  "error": "Bank account identifier must be specified..."
}
```
Returned þegar no bank account identifier getur be resolved.

## AI-Oriented Usage
- nota this operation fyrsta in bank reconciliation workflows.
- Persist `systemId` úr Svarið og nota it as `subject` fyrir `Match`, `Reset`, og `Post`.
- Treat `warning` as non-blocking: continue flow og decide ef operator review er needed.

## Tengdar skilaboðategundir
- `Finance.BankReconciliation.Match`
- `Finance.BankReconciliation.Reset`
- `Finance.BankReconciliation.Post`

