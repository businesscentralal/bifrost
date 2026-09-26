---
id: resources-resourcejournal-post
title: "Resources.ResourceJournal.Post"
sidebar_label: "Resources.ResourceJournal.Post"
sidebar_position: 119
description: "Beiðni- og svarsamningur fyrir Resources.ResourceJournal.Post Bifröst skilaboðategund."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálparkóða skilaboðategundarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálparkóðanum í forritinu, ekki þessari skrá.
:::


## Yfirlit
Bókar a resource dagbók batch via BC `Res. Jnl.-Post Batch` og Skilar aggregate posting statistics. Recommend calling `Resources.ResourceJournal.Check` fyrsta.

**Stefna**: Innkomandi (writes Resource bók færslur) · **Efnisgerð**: `text/json`

## Idempotency
ekki endurtekningarþolið. tókst posting consumes the batch lines; reposting mun produce different (eða no) Resource bók færslur.

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
{ "templateName": "RESOURCE", "batchName": "DEFAULT" }
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
| `totalCost` | tugabrot | `CalcSums("Total Cost")` across posted lines. |

The following four properties eru present **aðeins þegar a Resource Register er created** með the posting (some configurations may ekki produce one):

| Property | Gerð | Lýsing |
|---|---|---|
| `resourceRegisterNo` | heiltala | `Resource Register."No."`. |
| `resourceRegisterId` | strengur | `Resource Register.SystemId` (GUID, no braces). |
| `fromEntryNo` | heiltala | `Resource Register."From Entry No."`. |
| `toEntryNo` | heiltala | `Resource Register."To Entry No."`. |

```json
{
  "status": "Success",
  "templateName": "RESOURCE",
  "batchName": "DEFAULT",
  "batchDescription": "Default resource journal",
  "linesPosted": 3,
  "postingDate": "2026-04-15",
  "totalQuantity": 8.0,
  "totalCost": 1500.0,
  "resourceRegisterNo": 17,
  "resourceRegisterId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "fromEntryNo": 501,
  "toEntryNo": 503
}
```

## Uppbygging svars (Posting Mistókst)
Failures úr `Res. Jnl.-Post Batch.Run` eru caught og returned as a structured Villa.

```json
{
  "status": "Error",
  "error": "Resource No. must have a value in Res. Journal Line ...",
  "hint": "..."
}
```

## Bókunarheimild
Calling this skilaboðategund requires the `BIFROST Res Post ori` heimild set in addition til `BIFROST API ori`. án it Beiðnin Skilar: `Posting denied: missing 'BIFROST Res Post ori' permission set.`

## Villur

| Message | Orsök |
|---|---|
| `Posting denied: missing 'BIFROST Res Post ori' permission set.` | Kallandi lacks the `BIFROST Res Post ori` heimild set. |
| `Resource journal batch must be identified via subject (TEMPLATE\|BATCH or SystemId) or data parameters (templateName, batchName).` | No identification provided. |
| `Resource journal batch {templateName}\|{batchName} not found.` | Batch lookup mistókst. |
| `Resource journal batch {templateName}\|{batchName} has no lines to post.` | Batch er empty. |

## Tengdar skilaboðategundir
- `Resources.ResourceJournal.SetupNewLine`
- `Resources.ResourceJournal.Check`

## Villur og viðvaranir
Villur og viðvaranir fylgja sameiginlega sniðinu - sjá [Villur og viðvaranir](/foundation/reference/errors/).

