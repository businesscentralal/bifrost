---
id: finance-fajournal-post
title: "Finance.FAJournal.Post"
sidebar_label: "Finance.FAJournal.Post"
sidebar_position: 41
description: "Beiðni- og svarsamningur fyrir Finance.FAJournal.Post Bifröst skilaboðategund."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálparkóða skilaboðategundarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálparkóðanum í forritinu, ekki þessari skrá.
:::


## Yfirlit

Bókar an FA dagbók Batch via BC `FA Jnl.-Post Batch` og Skilar the resulting `FA Register` plus the posting summary. Villur úr the BC posting engine eru caught og returned as `{status, error, callstack}` instead of throwing — the message itself does ekki fail.

**Stefna**: Innkomandi (skrifa — Býr til FA bók færslur)  **Efnisgerð**: `text/json`

## Athugasemdir um endurtekningar og öryggi

- **ekki endurtekningarþolið** — re-posting eftir a tókst post produces `No lines to post` because the batch er now empty.
- Posting clears the batch lines; the `FA Register` carries the audit trail (`fromEntryNo`..`toEntryNo`).
- Recommended workflow: call `Finance.FAJournal.Check` fyrsta og aðeins post þegar `validationResult ∈ {Ready, ReadyWithWarnings}`.

## Batch Identification Order

fyrsta match wins:
1. `data.templateName` (+ valfrjálst `data.batchName`).
2. `subject` envelope attribute er a GUID → batch SystemId.
3. `subject` envelope attribute contains a `|` → `TEMPLATE|BATCH`.

## Beiðnibreytur

| Færibreyta | Gerð | áskilið | Athugasemdir |
|---|---|---|---|
| `templateName` | strengur | Sjá above | FA dagbók template (Code[10]). |
| `batchName` | strengur | No | FA dagbók batch (Code[10]). |

### Dæmi um beiðni
```json
{ "templateName": "ASSETS", "batchName": "DEFAULT" }
```

## Uppbygging svars

### Tókst
```json
{
  "status": "Success",
  "templateName": "ASSETS",
  "batchName": "DEFAULT",
  "batchDescription": "Default FA journal",
  "linesPosted": 3,
  "postingDate": "2026-04-15",
  "totalQuantity": 0.0,
  "totalAmount": 1500.0,
  "faRegisterNo": 42,
  "faRegisterId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "fromEntryNo": 1001,
  "toEntryNo": 1003
}
```

### Posting Mistókst (BC Villa caught)
```json
{
  "status": "Error",
  "error": "FA No. must have a value in FA Journal Line ...",
  "callstack": "<BC error callstack>"
}
```

### Svarreitir

| Reitur | Gerð | Athugasemdir |
|---|---|---|
| `linesPosted` | int | Lines counted áður en posting (i.e. the batch size that was sent through `FA Jnl.-Post Batch`). |
| `postingDate` | strengur | `FA Posting Date` of the fyrsta line (ISO 8601, culture-invariant format 9). |
| `totalQuantity` / `totalAmount` | tugabrot | `CalcSums` across the pre-post lines. |
| `faRegisterNo` | int | ný FA Register `No.`. |
| `faRegisterId` | GUID | FA Register `SystemId` (no braces). |
| `fromEntryNo` / `toEntryNo` | int | FA bók færsla range posted (úr FA Register). |

## Bókunarheimild
Calling this skilaboðategund requires the `BIFROST FA Post ori` heimild set in addition til `BIFROST API ori`. án it Beiðnin Skilar: `Posting denied: missing 'BIFROST FA Post ori' permission set.`

## Villur

| Villa | Orsök |
|---|---|
| `Posting denied: missing 'BIFROST FA Post ori' permission set.` | Kallandi lacks the `BIFROST FA Post ori` heimild set. |
| `Fixed asset journal batch must be identified via subject (TEMPLATE\|BATCH or SystemId) or data parameters (templateName, batchName).` | No identification was supplied. |
| `Fixed asset journal batch {template}\|{batch} not found.` | Identification did ekki match an fyrirliggjandi batch. |
| `Fixed asset journal batch {template}\|{batch} has no lines to post.` | Batch er empty. |
| `Nothing was posted. Review journal for errors.` | `FA Jnl.-Post Batch` returned án producing an FA Register (eða the post-Line No. er 0). |
| BC posting Villur | Returned as `{status, error, callstack}` — `error` er the BC Villa text, `callstack` úr `GetLastErrorCallStack()`. |

## Tengdar skilaboðategundir

- `Finance.FAJournal.SetupNewLine` — create ný FA dagbók lines.
- `Finance.FAJournal.Check` — validate áður en posting.

