---
id: finance-bankreconciliation-create
title: "Finance.BankReconciliation.Create"
sidebar_label: "Finance.BankReconciliation.Create"
sidebar_position: 35
description: "Request and response contract for the Finance.BankReconciliation.Create Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


## Request Example
```json
{
  "subject": "BANK-MAIN",
  "data": {
    "statementDate": "2026-05-30"
  }
}
```
Creates a bank reconciliation for statement type `Bank Reconciliation`, or reuses an existing empty reconciliation for the same bank account.

## Workflow Context
This is the first step in the bank reconciliation cycle:
1. `Finance.BankReconciliation.Create` -- create or reuse the reconciliation header (`Bank Acc. Reconciliation` with `Statement Type = Bank Reconciliation`) and import lines into `Bank Acc. Reconciliation Line`.
2. `Finance.BankReconciliation.Match` -- pair statement lines with `Bank Account Ledger Entry` rows. Match stamps the BLE (`Statement No.`, `Statement Line No.`, `Statement Status = Bank Acc. Entry Applied`).
3. `Finance.BankReconciliation.Reset` (optional) -- clear all match stamps to redo the match plan.
4. `Finance.BankReconciliation.Post` -- run `Bank Acc. Reconciliation Post`, close matched BLEs, and delete the reconciliation header.

This flow does not create `Applied Payment Entry` rows. Those exist only for Statement Type = `Payment Application`, which is not exposed by this extension.

## Overview
- Inbound operation.
- Resolves bank account from `subject` or request JSON.
- Imports bank statement lines; import failures are returned as `warning` while `status` stays `Success`.
- If `statementDate` is omitted and an existing reconciliation is reused, statement date is reset to blank (`0D`).

## Identifier Resolution
Bank account is resolved in this order:
1. `subject` as GUID -> Bank Account SystemId
2. `subject` as text -> Bank Account No.
3. JSON keys `bankAccountNo`, `bankAccountId`, `id`, `systemId`, `recordSystemId`.

## Request Fields
- `subject` (Text|Guid, optional): Bank Account No. or Bank Account SystemId.
- `data.statementDate` (Date, optional): statement date to assign.
- `data.bankAccountNo` (Code[20], optional): bank account number fallback when subject is empty.
- `data.bankAccountId` / `data.id` / `data.systemId` / `data.recordSystemId` (Guid, optional): bank account GUID fallback fields.

## Success Response Example
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

## Response Fields
- `status`: `Success` or `Error`.
- `reused`: `true` when an empty reconciliation was reused; `false` when a new one was created.
- `bankAccountNo`: resolved bank account number.
- `statementNo`: reconciliation statement number.
- `statementDate`: assigned statement date, blank when reset to `0D`.
- `systemId`: reconciliation SystemId (GUID, no braces).
- `lineCount`: number of imported reconciliation lines.
- `warning`: optional import warning text.

## Error Handling
```json
{
  "status": "Error",
  "error": "Bank account identifier must be specified..."
}
```
Returned when no bank account identifier can be resolved.

## AI-Oriented Usage
- Use this operation first in bank reconciliation workflows.
- Persist `systemId` from the response and use it as `subject` for `Match`, `Reset`, and `Post`.
- Treat `warning` as non-blocking: continue flow and decide if operator review is needed.

## Related Message Types
- `Finance.BankReconciliation.Match`
- `Finance.BankReconciliation.Reset`
- `Finance.BankReconciliation.Post`

