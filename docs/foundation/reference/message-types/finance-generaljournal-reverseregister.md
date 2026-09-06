---
id: finance-generaljournal-reverseregister
title: "Finance.GeneralJournal.ReverseRegister"
sidebar_label: "Finance.GeneralJournal.ReverseRegister"
sidebar_position: 48
description: "Request and response contract for the Finance.GeneralJournal.ReverseRegister Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


## Overview

Reverses **every** entry in a posted G/L Register in a single operation. Resolves the target register from the message subject, then dispatches to BC `Reversal Entry.ReverseRegister` via the isolated `Gen. Jnl. Reverse Process` codeunit (which sets `SetHideWarningDialogs` first). Returns the original register number and the entry range that was reversed.

**Direction**: Inbound (write — creates a new G/L Register containing the reversing entries)  **Content-Type**: `text/json`

**Filter table**: `G/L Register` — the message type is scoped to G/L Register records.

## Idempotency / Safety Notes

- **Not idempotent.** Sending the same request a second time fails with `G/L Register {n} has already been reversed.` (BC rejects double reversal).
- Reverses the **entire** register — every G/L Entry and every related ledger entry (customer, vendor, bank, VAT, FA, etc.) created by the original post.
- Use `Finance.GeneralJournal.ReverseTransaction` when you only want to reverse a single `Transaction No.` within a register, not the whole register.

## Identifier Resolution

The `subject` envelope attribute holds the target. Two forms are accepted:
1. G/L Register `No.` (integer) — e.g. `"42"`. Evaluated with `Evaluate(..., 9)` (culture-invariant).
2. G/L Register `SystemId` (GUID).

No data body is read.

## Request Parameters

Identification is via the envelope `subject` only — no JSON data fields.

### Request Example
Envelope `subject = "42"` — no data body required.

## Response Shape

### Success
```json
{
  "status": "Success",
  "reversedRegisterNo": 42,
  "fromEntryNo": 1001,
  "toEntryNo": 1006
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
| `reversedRegisterNo` | int | The original register that was reversed (not the new reversing register). |
| `fromEntryNo` / `toEntryNo` | int | G/L Entry range from the **original** register that was reversed. |

## Examples (from unit tests)

From `Gen. Journal Reverse Tests` (codeunit 95379):
- `ReverseRegister_ValidRegister_ReturnsSuccess` — subject = `Format(RegisterNo)` → `status: "Success"`, response includes the original register number and the entry range.
- `ReverseRegister_EmptySubject_ReturnsError` — subject blank → `Subject must contain the G/L Register No. to reverse.`.
- `ReverseRegister_NonNumericSubject_ReturnsError` — subject `"ABC"` → `Subject 'ABC' is not a valid G/L Register No.`.
- `ReverseRegister_NonExistentRegister_ReturnsError` — subject `"999999"` → `G/L Register 999999 not found.`.
- `ReverseRegister_AlreadyReversed_ReturnsError` — re-reverse the same register → `G/L Register {n} has already been reversed.`.

## Posting Gate
Calling this message type requires the `BIFROST GL Post ori` permission set in addition to `BIFROST API ori`. Without it the request returns: `Posting denied: missing 'BIFROST GL Post ori' permission set.`

## Errors

| Error | Cause |
|---|---|
| `Posting denied: missing 'BIFROST GL Post ori' permission set.` | Caller lacks the `BIFROST GL Post ori` permission set. |
| `Subject must contain the G/L Register No. to reverse.` | Subject is empty. |
| `Subject '{subject}' is not a valid G/L Register No.` | Subject is neither an integer nor a valid GUID. |
| `G/L Register {n} not found.` | No register with that `No.` / `SystemId` exists. |
| `G/L Register {n} has already been reversed.` | The register has reversing entries; BC will not reverse it again. |
| BC reversal errors | Returned as `{status, error, callstack}`. Common: cannot reverse across closed periods, applied entries blocking reversal. |

## Related Message Types

- `Finance.GeneralJournal.ReverseTransaction` — reverse a single `Transaction No.` rather than the whole register.
- `Finance.GeneralJournal.Post` — the message type that produced the register.

