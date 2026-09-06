---
id: finance-bankreconciliation-post
title: "Finance.BankReconciliation.Post"
sidebar_label: "Finance.BankReconciliation.Post"
sidebar_position: 37
description: "Request and response contract for the Finance.BankReconciliation.Post Bifröst message type."
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
Posts the specified bank reconciliation using standard Business Central posting flow.

## Overview
- Inbound operation. Statement Type = `Bank Reconciliation`.
- Resolves reconciliation from `subject` SystemId or request JSON keys.
- Runs codeunit `Bank Acc. Reconciliation Post`.

## Data Effects
Standard BC posting performs all of the following:
- Validates that `Statement Ending Balance` equals the bank account balance after the reconciliation.
- For every matched `Bank Account Ledger Entry`:
  - `Open` -> `false`
  - `Statement Status` -> `Closed`
  - `Statement No.` / `Statement Line No.` remain populated for audit
- Posts G/L entries when reconciliation lines have offsetting accounts.
- Deletes the `Bank Acc. Reconciliation` header and all of its `Bank Acc. Reconciliation Line` rows.
- Writes a `Posted Bank Acc. Reconciliation` history record.

No `Applied Payment Entry` rows are read or written. That table is only used by Statement Type = `Payment Application`.

## Request Fields
- `subject` (Guid, recommended): reconciliation SystemId.
- `data.systemId` / `data.recordSystemId` (Guid, optional): reconciliation GUID fallback fields.
- `data.bankAccountNo` + `data.statementNo` (Code[20], optional): composite-key fallback fields.

## Success Response Example
```json
{
  "status": "Success",
  "bankAccountNo": "BANK-MAIN",
  "statementNo": "STMT-000123",
  "reconciliationSystemId": "<guid>"
}
```

## Posting Gate
Calling this message type requires the `BIFROST GL Post ori` permission set in addition to `BIFROST API ori`. Without it the request returns: `Posting denied: missing 'BIFROST GL Post ori' permission set.`

## Error Handling
- Raises AL error when reconciliation identifier cannot be resolved.
- Raises AL error when posting preconditions are not met by standard posting logic.

Common posting preconditions:
- `Statement Ending Balance` must equal `Total Balance` after the reconciliation. Imbalance is the most common cause of failure.
- Every reconciliation line with a non-zero `Difference` must have a valid offsetting account (G/L or bank account, depending on the line type).
- The user must have posting permission for the bank account`s G/L account and any offsetting accounts.

## AI-Oriented Usage
- Use as the final step after `Create` and `Match` (or `Reset` + `Match`).
- After successful post, the reconciliation header is gone -- subsequent `Match`/`Reset`/`Post` calls against the same `reconciliationSystemId` will fail with "not found".
- Keep `reconciliationSystemId` from the response for audit logs; the posted reconciliation can be looked up via `Posted Bank Acc. Reconciliation` by `Bank Account No.` + `Statement No.`.

## Related Message Types
- `Finance.BankReconciliation.Create`
- `Finance.BankReconciliation.Match`
- `Finance.BankReconciliation.Reset`

