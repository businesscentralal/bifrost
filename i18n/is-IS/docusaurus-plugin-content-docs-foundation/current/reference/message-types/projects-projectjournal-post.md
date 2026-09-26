---
id: projects-projectjournal-post
title: "Projects.ProjectJournal.Post"
sidebar_label: "Projects.ProjectJournal.Post"
sidebar_position: 105
description: "Beiðni- og svarsamningur fyrir Projects.ProjectJournal.Post Bifröst skilaboðategund."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálparkóða skilaboðategundarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálparkóðanum í forritinu, ekki þessari skrá.
:::


## Yfirlit
Bókar a project (job) dagbók batch via BC `Job Jnl.-Post Batch` og Skilar the resulting `Job Register` plus aggregate posting statistics. Recommend calling `Projects.ProjectJournal.Check` fyrsta.

**Stefna**: Innkomandi (writes Job bók færslur) · **Efnisgerð**: `text/json`

## Idempotency
ekki endurtekningarþolið. tókst posting consumes the batch lines; reposting mun produce different (eða no) Job bók færslur.

## Identifier Resolution
Batch er resolved in this order:
1. JSON `templateName` (+ valfrjálst `batchName`)
2. `subject` er a GUID → batch SystemId
3. `subject` contains `|` → `TEMPLATE|BATCH`

## Beiðnibreytur

| Heiti | Gerð | Lýsing |
|---|---|---|
| `templateName` | strengur | dagbók template Heiti (`Code[10]`). |
| `batchName` | strengur | dagbók batch Heiti (`Code[10]`). |

## Dæmi um beiðni
```json
{ "templateName": "PROJECT", "batchName": "DEFAULT" }
```

## Uppbygging svars (Tókst)

| Property | Gerð | Lýsing |
|---|---|---|
| `status` | strengur | `"Success"`. |
| `templateName` | strengur | dagbók template Heiti posted. |
| `batchName` | strengur | dagbók batch Heiti posted. |
| `batchDescription` | strengur | Batch Lýsing. |
| `linesPosted` | heiltala | númer of lines in the batch áður en posting (`Count`). |
| `postingDate` | strengur | `Posting Date` of the fyrsta line, formatted XML (`yyyy-MM-dd`). |
| `totalQuantity` | tugabrot | `CalcSums(Quantity)` across posted lines. |
| `totalLineAmount` | tugabrot | `CalcSums("Line Amount")` across posted lines. |
| `jobRegisterNo` | heiltala | `Job Register."No."` created með the posting. |
| `jobRegisterId` | strengur | `Job Register.SystemId` (GUID, no braces). |
| `fromEntryNo` | heiltala | `Job Register."From Entry No."`. |
| `toEntryNo` | heiltala | `Job Register."To Entry No."`. |

```json
{
  "status": "Success",
  "templateName": "PROJECT",
  "batchName": "DEFAULT",
  "batchDescription": "Default project journal",
  "linesPosted": 2,
  "postingDate": "2026-04-15",
  "totalQuantity": 16.0,
  "totalLineAmount": 4800.0,
  "jobRegisterNo": 42,
  "jobRegisterId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "fromEntryNo": 1001,
  "toEntryNo": 1002
}
```

## Uppbygging svars (Posting Mistókst)
Failures úr `Job Jnl.-Post Batch.Run` eru caught og returned as a structured Villa instead of thrown.

```json
{
  "status": "Error",
  "error": "Job No. must have a value in Job Journal Line ...",
  "hint": "..."
}
```

## Bókunarheimild
Calling this skilaboðategund requires the `BIFROST Job Post ori` heimild set in addition til `BIFROST API ori`. án it Beiðnin Skilar: `Posting denied: missing 'BIFROST Job Post ori' permission set.`

## Villur

| Message | Orsök |
|---|---|
| `Posting denied: missing 'BIFROST Job Post ori' permission set.` | Kallandi lacks the `BIFROST Job Post ori` heimild set. |
| `Project journal batch must be identified via subject (TEMPLATE\|BATCH or SystemId) or data parameters (templateName, batchName).` | No identification provided. |
| `Project journal batch {templateName}\|{batchName} not found.` | Batch lookup mistókst. |
| `Project journal batch {templateName}\|{batchName} has no lines to post.` | Batch er empty. |
| `Nothing was posted. Review journal for errors.` | Posting completed but produced no Job Register færsla. |

## Tengdar skilaboðategundir
- `Projects.ProjectJournal.SetupNewLine`
- `Projects.ProjectJournal.Check`

## Villur og viðvaranir
Villur og viðvaranir fylgja sameiginlega sniðinu - sjá [Villur og viðvaranir](/foundation/reference/errors/).

