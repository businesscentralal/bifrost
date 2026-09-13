---
id: finance-generaljournal-reversetransaction
title: "Finance.GeneralJournal.ReverseTransaction"
sidebar_label: "Finance.GeneralJournal.ReverseTransaction"
sidebar_position: 49
description: "Beiðni- og svarsamningur fyrir Finance.GeneralJournal.ReverseTransaction Bifröst skilaboðategund."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálparkóða skilaboðategundarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálparkóðanum í forritinu, ekki þessari skrá.
:::


## Yfirlit

Reverses every G/L færsla sharing a given `Transaction No.` (a logical group within a register — typically one dagbók line og its balancing partner). Resolves the transaction úr the message subject, counts the færslur up front, then dispatches til BC `Reversal Entry.ReverseTransaction` via the isolated `Gen. Jnl. Reverse Process` codeunit (which Stillir `SetHideWarningDialogs` fyrsta).

**Stefna**: Innkomandi (skrifa — Býr til reversing G/L færslur)  **Efnisgerð**: `text/json`

**Filter tafla**: `0` — this er a generic skilaboðategund that accepts hvaða Uppruni. Subject resolution handles both the transaction númer directly og a G/L færsla SystemId (the færsla's `Transaction No.` er then notað).

## Athugasemdir um endurtekningar og öryggi

- **ekki endurtekningarþolið.** Sending the sama request a second time fails með `Transaction No. {n} has already been reversed.`.
- nota `Finance.GeneralJournal.ReverseRegister` þegar you want til undo the entire register rather than a single transaction within it.

## Identifier Resolution

The `subject` envelope attribute holds the target. Two forms eru accepted:
1. Transaction No. (heiltala) — e.g. `"123"`. Evaluated með `Evaluate(..., 9)` (culture-invariant).
2. SystemId of **hvaða** G/L færsla (GUID) — the implementation Les that færsla's `Transaction No.` og reverses the whole group.

No data body er lesa.

## Beiðnibreytur

Identification er via the envelope `subject` aðeins — no JSON data fields.

### Dæmi um beiðni
Envelope `subject = "123"` — no data body áskilið.

## Uppbygging svars

### Tókst
```json
{
  "status": "Success",
  "reversedTransactionNo": 123,
  "entriesReversed": 2
}
```

### Reversal Mistókst (BC Villa caught)
```json
{
  "status": "Error",
  "error": "<BC reversal error text>",
  "callstack": "<BC error callstack>"
}
```

### Svarreitir

| Reitur | Gerð | Athugasemdir |
|---|---|---|
| `reversedTransactionNo` | int | The original `Transaction No.` that was reversed. |
| `entriesReversed` | int | `Count()` of G/L færslur that shared that `Transaction No.` (the size of the group BC reversed). |

## Dæmi (úr einingaprófum)

úr `Gen. Journal Reverse Tests` (codeunit 95379):
- `ReverseTransaction_ValidTransaction_ReturnsSuccess` — subject = `Format(TransactionNo)` → `status: "Success"` með `entriesReversed` matching the original group size.
- `ReverseTransaction_SystemIdSubject_ReturnsSuccess` — subject = `Format(GLEntry.SystemId, 0, 4)` → resolves til the færsla's `Transaction No.` og reverses the group.
- `ReverseTransaction_EmptySubject_ReturnsError` — subject blank → `Subject must contain the Transaction No. to reverse.`.
- `ReverseTransaction_NonExistent_ReturnsError` — subject `"999999"` → `No G/L entries found for Transaction No. 999999.`.

## Bókunarheimild
Calling this skilaboðategund requires the `BIFROST GL Post ori` heimild set in addition til `BIFROST API ori`. án it Beiðnin Skilar: `Posting denied: missing 'BIFROST GL Post ori' permission set.`

## Villur

| Villa | Orsök |
|---|---|
| `Posting denied: missing 'BIFROST GL Post ori' permission set.` | Kallandi lacks the `BIFROST GL Post ori` heimild set. |
| `Subject must contain the Transaction No. to reverse.` | Subject er empty. |
| `Subject '{subject}' is not a valid Transaction No.` | Subject er neither an heiltala nor a gilt GUID. |
| `No G/L entries found for Transaction No. {n}.` | No `G/L Entry` has that `Transaction No.` (eða the GUID does ekki match hvaða færsla). |
| `Transaction No. {n} has already been reversed.` | The transaction has reversing færslur; BC mun ekki reverse it again. |
| BC reversal Villur | Returned as `{status, error, callstack}`. Common: getur ekki reverse across lokað periods, applied færslur blocking reversal. |

## Tengdar skilaboðategundir

- `Finance.GeneralJournal.ReverseRegister` — reverse the entire register that contains this transaction.
- `Finance.GeneralJournal.Post` — the skilaboðategund that produced the færslur.

