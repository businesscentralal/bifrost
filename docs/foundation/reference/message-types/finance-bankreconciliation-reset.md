---
id: finance-bankreconciliation-reset
title: "Finance.BankReconciliation.Reset"
sidebar_label: "Finance.BankReconciliation.Reset"
sidebar_position: 38
description: "Request and response contract for the Finance.BankReconciliation.Reset Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


## Request Example
```json
{
  "subject": "<reconciliation-systemid>",
  "data": {}
}
```
Clears every match on every line of the reconciliation by invoking the standard BC helper `Match Bank Rec. Lines.RemoveMatchesFromRecLines`.

## Overview
- Inbound operation. Statement Type = `Bank Reconciliation`.
- Resolves reconciliation from `subject` SystemId or request JSON keys.
- Counts lines with at least one stamped Bank Account Ledger Entry (BLE), then calls `Match Bank Rec. Lines.RemoveMatchesFromRecLines` once for the filtered line set.

## Data Effects
For every BLE previously stamped by `Match`:
- `Bank Account Ledger Entry."Statement No."` -> blank
- `Bank Account Ledger Entry."Statement Line No."` -> 0
- `Bank Account Ledger Entry."Statement Status"` -> `Open`
- Any `Bank Acc. Rec. Match Buffer` rows for the line are removed

For each affected `Bank Acc. Reconciliation Line`:
- `Applied Amount` -> 0
- `Applied Entries` -> 0
- `Difference` -> `Statement Amount`

No `Applied Payment Entry` rows are read or written. That table is only used by Statement Type = `Payment Application`, which this message type does not support.

## Request Fields
- `subject` (Guid, recommended): reconciliation SystemId.
- `data.systemId` / `data.recordSystemId` (Guid, optional): reconciliation GUID fallback fields.
- `data.bankAccountNo` + `data.statementNo` (Code[20], optional): composite-key fallback fields.

## Success Response Example
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

## Response Fields
- `status`: always `Success`.
- `mode`: always `ResetAll`.
- `resetLineCount`: number of reconciliation lines that had at least one stamped BLE before reset. `0` means there were no matches to clear.
- `bankAccountNo`, `statementNo`, `reconciliationSystemId`: resolved reconciliation identity.

## Error Handling
- Raises AL error when reconciliation identifier cannot be resolved.

## AI-Oriented Usage
- Use when the match plan needs to be redone. Reset is idempotent; calling it on a reconciliation with no matches returns `resetLineCount: 0` and is safe.
- After `Reset`, the reconciliation is ready for new `Match` calls; existing lines and BLE list are unchanged.
- To verify externally, query `Bank Account Ledger Entry` filtered by the reconciliation`s `Statement No.` -- it should return zero rows after a successful reset.

## Related Message Types
- `Finance.BankReconciliation.Create`
- `Finance.BankReconciliation.Match`
- `Finance.BankReconciliation.Post`

