---
id: finance-bankreconciliation-reset
title: "Finance.BankReconciliation.Reset"
sidebar_label: "Finance.BankReconciliation.Reset"
sidebar_position: 38
description: "Beiðni- og svarsamningur fyrir Finance.BankReconciliation.Reset Bifröst skilaboðategund."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálparkóða skilaboðategundarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálparkóðanum í forritinu, ekki þessari skrá.
:::


## Dæmi um beiðni
```json
{
  "subject": "<reconciliation-systemid>",
  "data": {}
}
```
Clears every match on every line of the reconciliation með invoking the standard BC helper `Match Bank Rec. Lines.RemoveMatchesFromRecLines`.

## Yfirlit
- Innkomandi operation. Statement Gerð = `Bank Reconciliation`.
- Resolves reconciliation úr `subject` SystemId eða request JSON keys.
- Counts lines með at least one stamped Bank Account bók færsla (BLE), then calls `Match Bank Rec. Lines.RemoveMatchesFromRecLines` once fyrir the filtered line set.

## Data Effects
fyrir every BLE previously stamped með `Match`:
- `Bank Account Ledger Entry."Statement No."` -> blank
- `Bank Account Ledger Entry."Statement Line No."` -> 0
- `Bank Account Ledger Entry."Statement Status"` -> `Open`
- hvaða `Bank Acc. Rec. Match Buffer` rows fyrir the line eru removed

fyrir hver affected `Bank Acc. Reconciliation Line`:
- `Applied Amount` -> 0
- `Applied Entries` -> 0
- `Difference` -> `Statement Amount`

No `Applied Payment Entry` rows eru lesa eða written. That tafla er aðeins notað með Statement Gerð = `Payment Application`, which this skilaboðategund does ekki support.

## Request Fields
- `subject` (Guid, recommended): reconciliation SystemId.
- `data.systemId` / `data.recordSystemId` (Guid, valfrjálst): reconciliation GUID fallback fields.
- `data.bankAccountNo` + `data.statementNo` (Code[20], valfrjálst): composite-key fallback fields.

## Tókst Dæmi um svar
```json
{
  "status": "Success",
  "mode": "ResetAll",
  "resetLineCount": 3,
  "bankAccountNo": "BANK-MAIN",
  "statementNo": "STMT-000123",
  "reconciliationSystemId": "<guid>"
}
```

## Svarreitir
- `status`: always `Success`.
- `mode`: always `ResetAll`.
- `resetLineCount`: númer of reconciliation lines that had at least one stamped BLE áður en reset. `0` means there were no matches til clear.
- `bankAccountNo`, `statementNo`, `reconciliationSystemId`: resolved reconciliation identity.

## Villa Handling
- Raises AL Villa þegar reconciliation identifier getur ekki be resolved.

## AI-Oriented Usage
- nota þegar the match plan needs til be redone. Reset er endurtekningarþolið; calling it on a reconciliation með no matches Skilar `resetLineCount: 0` og er safe.
- eftir `Reset`, the reconciliation er ready fyrir ný `Match` calls; fyrirliggjandi lines og BLE list eru unchanged.
- til verify externally, query `Bank Account Ledger Entry` filtered með the reconciliation`s `Statement No.` -- it should return zero rows eftir a tókst reset.

## Tengdar skilaboðategundir
- `Finance.BankReconciliation.Create`
- `Finance.BankReconciliation.Match`
- `Finance.BankReconciliation.Post`

## Villur og viðvaranir
Villur og viðvaranir fylgja sameiginlega sniðinu - sjá [Villur og viðvaranir](/foundation/reference/errors/).

