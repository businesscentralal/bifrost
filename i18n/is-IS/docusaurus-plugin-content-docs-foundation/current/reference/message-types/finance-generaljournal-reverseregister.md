---
id: finance-generaljournal-reverseregister
title: "Finance.GeneralJournal.ReverseRegister"
sidebar_label: "Finance.GeneralJournal.ReverseRegister"
sidebar_position: 48
description: "Beiðni- og svarsamningur fyrir Finance.GeneralJournal.ReverseRegister Bifröst skilaboðategund."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálparkóða skilaboðategundarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálparkóðanum í forritinu, ekki þessari skrá.
:::


## Yfirlit

Reverses **every** færsla in a posted G/L Register in a single operation. Resolves the target register úr the message subject, then dispatches til BC `Reversal Entry.ReverseRegister` via the isolated `Gen. Jnl. Reverse Process` codeunit (which Stillir `SetHideWarningDialogs` fyrsta). Skilar the original register númer og the færsla range that was reversed.

**Stefna**: Innkomandi (skrifa — Býr til a ný G/L Register containing the reversing færslur)  **Efnisgerð**: `text/json`

**Filter tafla**: `G/L Register` — the skilaboðategund er scoped til G/L Register færslur.

## Athugasemdir um endurtekningar og öryggi

- **ekki endurtekningarþolið.** Sending the sama request a second time fails með `G/L Register {n} has already been reversed.` (BC rejects double reversal).
- Reverses the **entire** register — every G/L færsla og every related bók færsla (viðskiptamanni, birgi, bank, VAT, FA, etc.) created með the original post.
- nota `Finance.GeneralJournal.ReverseTransaction` þegar you aðeins want til reverse a single `Transaction No.` within a register, ekki the whole register.

## Identifier Resolution

The `subject` envelope attribute holds the target. Two forms eru accepted:
1. G/L Register `No.` (heiltala) — e.g. `"42"`. Evaluated með `Evaluate(..., 9)` (culture-invariant).
2. G/L Register `SystemId` (GUID).

No data body er lesa.

## Beiðnibreytur

Identification er via the envelope `subject` aðeins — no JSON data fields.

### Dæmi um beiðni
Envelope `subject = "42"` — no data body áskilið.

## Uppbygging svars

### Tókst
```json
{
  "status": "Success",
  "reversedRegisterNo": 42,
  "fromEntryNo": 1001,
  "toEntryNo": 1006
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
| `reversedRegisterNo` | int | The original register that was reversed (ekki the ný reversing register). |
| `fromEntryNo` / `toEntryNo` | int | G/L færsla range úr the **original** register that was reversed. |

## Dæmi (úr einingaprófum)

úr `Gen. Journal Reverse Tests` (codeunit 95379):
- `ReverseRegister_ValidRegister_ReturnsSuccess` — subject = `Format(RegisterNo)` → `status: "Success"`, response includes the original register númer og the færsla range.
- `ReverseRegister_EmptySubject_ReturnsError` — subject blank → `Subject must contain the G/L Register No. to reverse.`.
- `ReverseRegister_NonNumericSubject_ReturnsError` — subject `"ABC"` → `Subject 'ABC' is not a valid G/L Register No.`.
- `ReverseRegister_NonExistentRegister_ReturnsError` — subject `"999999"` → `G/L Register 999999 not found.`.
- `ReverseRegister_AlreadyReversed_ReturnsError` — re-reverse the sama register → `G/L Register {n} has already been reversed.`.

## Bókunarheimild
Calling this skilaboðategund requires the `BIFROST GL Post ori` heimild set in addition til `BIFROST API ori`. án it Beiðnin Skilar: `Posting denied: missing 'BIFROST GL Post ori' permission set.`

## Villur

| Villa | Orsök |
|---|---|
| `Posting denied: missing 'BIFROST GL Post ori' permission set.` | Kallandi lacks the `BIFROST GL Post ori` heimild set. |
| `Subject must contain the G/L Register No. to reverse.` | Subject er empty. |
| `Subject '{subject}' is not a valid G/L Register No.` | Subject er neither an heiltala nor a gilt GUID. |
| `G/L Register {n} not found.` | No register með that `No.` / `SystemId` exists. |
| `G/L Register {n} has already been reversed.` | The register has reversing færslur; BC mun ekki reverse it again. |
| BC reversal Villur | Returned as `{status, error, callstack}`. Common: getur ekki reverse across lokað periods, applied færslur blocking reversal. |

## Tengdar skilaboðategundir

- `Finance.GeneralJournal.ReverseTransaction` — reverse a single `Transaction No.` rather than the whole register.
- `Finance.GeneralJournal.Post` — the skilaboðategund that produced the register.

