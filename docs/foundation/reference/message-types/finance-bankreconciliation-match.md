---
id: finance-bankreconciliation-match
title: "Finance.BankReconciliation.Match"
sidebar_label: "Finance.BankReconciliation.Match"
sidebar_position: 36
description: "Request and response contract for the Finance.BankReconciliation.Match Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


## Request Example
```json
{
  "subject": "<reconciliation-systemid>",
  "data": {
    "statementLines": [10000, 20000],
    "ledgerEntries": [30000, 40000],
    "strict": true
  }
}
```
Classifies a match mode from the two arrays and applies the match using standard BC routines for Statement Type = `Bank Reconciliation`.

## Overview
- Inbound operation. Statement Type = `Bank Reconciliation`.
- Resolves reconciliation from `subject` SystemId or request JSON keys.
- Mode classification: `Auto`, `0-N`, `1-1`, `1-N`, `N-1`, `N-N-Strict`, `Custom`.
- Strict validation is enforced for `N-N` matching.
- Duplicate-guard: skips a pair when the BLE is already stamped with the same `Statement No.` and `Statement Line No.`.

## Data Effects
For every BLE matched to a statement line, the standard helpers `Match Bank Rec. Lines` and `Bank Acc. Entry Set Recon.-No.` write:
- `Bank Account Ledger Entry."Statement No."` = reconciliation `Statement No.`
- `Bank Account Ledger Entry."Statement Line No."` = matched statement line number
- `Bank Account Ledger Entry."Statement Status"` = `Bank Acc. Entry Applied`
- For 1-N and N-1, additional `Bank Acc. Rec. Match Buffer` rows are written to track multi-entry relations

On each matched `Bank Acc. Reconciliation Line`:
- `Applied Amount` = sum of matched BLE amounts (signed: a -1000 BLE contributes -1000)
- `Applied Entries` = count of matched BLEs
- `Difference` = `Statement Amount` - `Applied Amount`

No `Applied Payment Entry` rows are written. That table is only used by Statement Type = `Payment Application`, which this message type does not support.

## Request Fields
- `subject` (Guid, recommended): reconciliation SystemId.
- `data.systemId` / `data.recordSystemId` (Guid, optional): reconciliation GUID fallback fields.
- `data.bankAccountNo` + `data.statementNo` (Code[20], optional): composite-key fallback fields.
- `data.statementLines` (Integer[], optional): `Bank Acc. Reconciliation Line` `Statement Line No.` values.
- `data.ledgerEntries` (Integer[], optional): `Bank Account Ledger Entry` `Entry No.` values.
- `data.strict` (Boolean, optional): required to be `true` for N-N mode.

## Success Response Example
```json
{
  "status": "Success",
  "mode": "N-N-Strict",
  "strict": true,
  "statementLinesCount": 2,
  "ledgerEntriesCount": 2,
  "bankAccountNo": "BANK-MAIN",
  "statementNo": "STMT-000123",
  "reconciliationSystemId": "<guid>"
}
```

## Mode Rules
- Empty `statementLines` + empty `ledgerEntries` -> `Auto`. Runs `Match Bank Rec. Lines.BankAccReconciliationAutoMatch(BankAccReconciliation, 0)`.
- `statementLines` empty + ledger entries present -> `0-N`.
- 1 statement line + 1 ledger entry -> `1-1`.
- 1 statement line + many ledger entries -> `1-N`. Many BLEs are stamped against the single line.
- Many statement lines + 1 ledger entry -> `N-1`. One BLE is split across many lines via the match buffer.
- Many + many with `strict=true` and equal counts -> `N-N-Strict`. Pairs are formed by array position.
- Other combinations -> `Custom`.

## Error Handling
- Raises AL error when reconciliation identifier cannot be resolved.
- Raises AL error when N-N matching is requested without `strict=true`.
- Raises AL error when strict N-N arrays have different lengths.
- Raises AL error when a referenced statement line or BLE does not exist for the resolved reconciliation.

## AI-Oriented Usage
- Always pass `subject` = `systemId` returned by `Finance.BankReconciliation.Create`.
- Use `strict=true` only when you intentionally send pairwise N-N lists.
- For autopilot matching, send no arrays and inspect returned `mode` + counts -- the response does not list which BLEs matched. To see the result, read `Bank Account Ledger Entry` filtered by reconciliation `Statement No.` or read the lines for updated `Applied Amount` / `Applied Entries`.
- Call this message type repeatedly to add matches; existing stamps are preserved. Use `Reset` first if you need to start over.
- `Applied Payment Entry` is the wrong table to inspect -- it stays empty for Bank Reconciliation flow.

## Related Message Types
- `Finance.BankReconciliation.Create`
- `Finance.BankReconciliation.Reset`
- `Finance.BankReconciliation.Post`

