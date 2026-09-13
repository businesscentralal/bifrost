---
id: finance-generaljournal-post
title: "Finance.GeneralJournal.Post"
sidebar_label: "Finance.GeneralJournal.Post"
sidebar_position: 46
description: "Beiðni- og svarsamningur fyrir Finance.GeneralJournal.Post Bifröst skilaboðategund."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálparkóða skilaboðategundarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálparkóðanum í forritinu, ekki þessari skrá.
:::


## Yfirlit

Bókar a Gen. dagbók Batch via BC `Gen. Jnl.-Post Batch` og Skilar the resulting `G/L Register` plus the posting summary. Villur úr the BC posting engine eru caught og returned as `{status, error, callstack}` instead of throwing — the message itself does ekki fail.

**Stefna**: Innkomandi (skrifa — Býr til G/L, viðskiptamanni/birgi/bank/employee, VAT, FA, og hvaða other bók færslur the BC posting routine emits)  **Efnisgerð**: `text/json`

## Athugasemdir um endurtekningar og öryggi

- **ekki endurtekningarþolið** — `Gen. Jnl.-Post Batch` clears the dagbók lines on Tókst, so re-posting the sama batch Skilar `No lines to post`.
- The batch færsla itself survives the post; aðeins the lines eru removed.
- Recommended workflow: call `Finance.GeneralJournal.Check` fyrsta og aðeins post þegar `validationResult ∈ {Ready, ReadyWithWarnings}`. fyrir high-risk batches, nota `Finance.GeneralJournal.PreviewPost` til inspect the færslur that would be created.

## Batch Identification Order

fyrsta match wins:
1. `data.templateName` (+ valfrjálst `data.batchName`).
2. `subject` envelope attribute er a GUID → batch SystemId.
3. `subject` envelope attribute contains a `|` → `TEMPLATE|BATCH`.

## Beiðnibreytur

| Færibreyta | Gerð | áskilið | Athugasemdir |
|---|---|---|---|
| `templateName` | strengur | Sjá above | Gen. dagbók template (Code[10]). |
| `batchName` | strengur | No | Gen. dagbók batch (Code[10]). |

### Dæmi um beiðni
```json
{ "templateName": "GENERAL", "batchName": "DEFAULT" }
```

## Uppbygging svars

### Tókst
```json
{
  "status": "Success",
  "templateName": "GENERAL",
  "batchName": "DEFAULT",
  "batchDescription": "Default Journal Batch",
  "linesPosted": 6,
  "postingDate": "2026-04-15",
  "totalAmount": 0.0,
  "totalAmountLCY": 0.0,
  "glRegisterNo": 42,
  "glRegisterId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "fromEntryNo": 1001,
  "toEntryNo": 1006,
  "fromVATEntryNo": 501,
  "toVATEntryNo": 502
}
```

### Posting Mistókst (BC Villa caught)
```json
{
  "status": "Error",
  "error": "<BC posting error text>",
  "callstack": "<BC error callstack>"
}
```

### Svarreitir

| Reitur | Gerð | Athugasemdir |
|---|---|---|
| `linesPosted` | int | Lines counted áður en posting. |
| `postingDate` | strengur | `Posting Date` of the fyrsta line (ISO 8601, culture-invariant format 9). |
| `totalAmount` / `totalAmountLCY` | tugabrot | `CalcSums` across the pre-post lines. fyrir a balanced dagbók both eru `0.0`. |
| `glRegisterNo` | int | ný G/L Register `No.`. |
| `glRegisterId` | GUID | G/L Register `SystemId` (no braces). |
| `fromEntryNo` / `toEntryNo` | int | G/L færsla range úr the ný register. |
| `fromVATEntryNo` / `toVATEntryNo` | int | VAT færsla range úr the ný register. `0` þegar no VAT færslur were created. |

## Dæmi (úr einingaprófum)

úr `Gen. Journal Post Tests` (codeunit, Sjá `test/test/Finance/GenJournalPostTests.Codeunit.al`):
- `FinanceGeneralJournalPost_BalancedBatch_ReturnsSuccess` — subject = `"GENERAL|DEFAULT"` með balanced lines → `status: "Success"` og a populated G/L Register.
- `FinanceGeneralJournalPost_SystemIdSubject_ReturnsSuccess` — subject = batch `SystemId` (`Format(SystemId, 0, 4)`).
- `FinanceGeneralJournalPost_DataParameters_ReturnsSuccess` — data = `{ "templateName": "GENERAL", "batchName": "DEFAULT" }`.
- `FinanceGeneralJournalPost_NonExistentBatch_ReturnsError` — subject = `"GENERAL|NONEXISTENT"` → `Journal batch GENERAL|NONEXISTENT not found.`.
- `FinanceGeneralJournalPost_EmptySubjectNoData_ReturnsError` — vantar identification.

## Bókunarheimild
Calling this skilaboðategund requires the `BIFROST GL Post ori` heimild set in addition til `BIFROST API ori`. án it Beiðnin Skilar: `Posting denied: missing 'BIFROST GL Post ori' permission set.`

## Villur

| Villa | Orsök |
|---|---|
| `Posting denied: missing 'BIFROST GL Post ori' permission set.` | Kallandi lacks the `BIFROST GL Post ori` heimild set. |
| `Journal batch must be identified via subject (TEMPLATE\|BATCH or SystemId) or data parameters (templateName, batchName).` | No identification was supplied. |
| `Journal batch {template}\|{batch} not found.` | Identification did ekki match an fyrirliggjandi batch. |
| `Journal batch {template}\|{batch} has no lines to post.` | Batch er empty. |
| `Nothing was posted. Review journal for errors.` | `Gen. Jnl.-Post Batch` returned án producing a G/L Register. |
| BC posting Villur | Returned as `{status, error, callstack}` — `error` er the BC Villa text, `callstack` úr `GetLastErrorCallStack()`. |

## Tengdar skilaboðategundir

- `Finance.GeneralJournal.SetupNewLine` — create ný dagbók lines.
- `Finance.GeneralJournal.Check` — validate áður en posting.
- `Finance.GeneralJournal.PreviewPost` — simulate the post án committing.
- `Finance.GeneralJournal.ReverseRegister` — reverse the G/L Register produced með this post.

