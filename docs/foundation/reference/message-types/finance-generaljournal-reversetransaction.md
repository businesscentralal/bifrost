---
id: finance-generaljournal-reversetransaction
title: "Finance.GeneralJournal.ReverseTransaction"
sidebar_label: "Finance.GeneralJournal.ReverseTransaction"
sidebar_position: 49
description: "Request and response contract for the Finance.GeneralJournal.ReverseTransaction Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


## Overview

Reverses every G/L Entry sharing a given `Transaction No.` (a logical group within a register — typically one journal line and its balancing partner). Resolves the transaction from the message subject, counts the entries up front, then dispatches to BC `Reversal Entry.ReverseTransaction` via the isolated `Gen. Jnl. Reverse Process` codeunit (which sets `SetHideWarningDialogs` first).

**Direction**: Inbound (write — creates reversing G/L entries)  **Content-Type**: `text/json`

**Filter table**: `0` — this is a generic message type that accepts any source. Subject resolution handles both the transaction number directly and a G/L Entry SystemId (the entry's `Transaction No.` is then used).

## Idempotency / Safety Notes

- **Not idempotent.** Sending the same request a second time fails with `Transaction No. {n} has already been reversed.`.
- Use `Finance.GeneralJournal.ReverseRegister` when you want to undo the entire register rather than a single transaction within it.

## Identifier Resolution

The `subject` envelope attribute holds the target. Two forms are accepted:
1. Transaction No. (integer) — e.g. `"123"`. Evaluated with `Evaluate(..., 9)` (culture-invariant).
2. SystemId of **any** G/L Entry (GUID) — the implementation reads that entry's `Transaction No.` and reverses the whole group.

No data body is read.

## Request Parameters

Identification is via the envelope `subject` only — no JSON data fields.

### Request Example
Envelope `subject = "123"` — no data body required.

## Response Shape

### Success
```json
{
  "status": "Success",
  "reversedTransactionNo": 123,
  "entriesReversed": 2
}
```

### Reversal Failure (BC error caught)
```json
{
  "status": "Error",
  "error": "<BC reversal error text>",
  "callstack": "<BC error callstack>"
}
```

### Response Fields

| Field | Type | Notes |
|---|---|---|
| `reversedTransactionNo` | int | The original `Transaction No.` that was reversed. |
| `entriesReversed` | int | `Count()` of G/L Entries that shared that `Transaction No.` (the size of the group BC reversed). |

## Examples (from unit tests)

From `Gen. Journal Reverse Tests` (codeunit 95379):
- `ReverseTransaction_ValidTransaction_ReturnsSuccess` — subject = `Format(TransactionNo)` → `status: "Success"` with `entriesReversed` matching the original group size.
- `ReverseTransaction_SystemIdSubject_ReturnsSuccess` — subject = `Format(GLEntry.SystemId, 0, 4)` → resolves to the entry's `Transaction No.` and reverses the group.
- `ReverseTransaction_EmptySubject_ReturnsError` — subject blank → `Subject must contain the Transaction No. to reverse.`.
- `ReverseTransaction_NonExistent_ReturnsError` — subject `"999999"` → `No G/L entries found for Transaction No. 999999.`.

## Posting Gate
Calling this message type requires the `BIFROST GL Post ori` permission set in addition to `BIFROST API ori`. Without it the request returns: `Posting denied: missing 'BIFROST GL Post ori' permission set.`

## Errors

| Error | Cause |
|---|---|
| `Posting denied: missing 'BIFROST GL Post ori' permission set.` | Caller lacks the `BIFROST GL Post ori` permission set. |
| `Subject must contain the Transaction No. to reverse.` | Subject is empty. |
| `Subject '{subject}' is not a valid Transaction No.` | Subject is neither an integer nor a valid GUID. |
| `No G/L entries found for Transaction No. {n}.` | No `G/L Entry` has that `Transaction No.` (or the GUID does not match any entry). |
| `Transaction No. {n} has already been reversed.` | The transaction has reversing entries; BC will not reverse it again. |
| BC reversal errors | Returned as `{status, error, callstack}`. Common: cannot reverse across closed periods, applied entries blocking reversal. |

## Related Message Types

- `Finance.GeneralJournal.ReverseRegister` — reverse the entire register that contains this transaction.
- `Finance.GeneralJournal.Post` — the message type that produced the entries.

