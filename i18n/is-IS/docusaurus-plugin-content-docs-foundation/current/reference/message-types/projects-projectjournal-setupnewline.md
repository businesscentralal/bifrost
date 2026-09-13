---
id: projects-projectjournal-setupnewline
title: "Projects.ProjectJournal.SetupNewLine"
sidebar_label: "Projects.ProjectJournal.SetupNewLine"
sidebar_position: 107
description: "Beiðni- og svarsamningur fyrir Projects.ProjectJournal.SetupNewLine Bifröst skilaboðategund."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálparkóða skilaboðategundarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálparkóðanum í forritinu, ekki þessari skrá.
:::


## Yfirlit
Býr til ein eða fleiri ný project (job) dagbók lines in a batch, pre-populated með BC `SetUpNewLine`. hver line er assigned `Line No.` = síðasta line + 10000 (eða 10000 fyrir an empty batch).

**Stefna**: Innkomandi (writes) · **Efnisgerð**: `text/json`

## Idempotency
ekki endurtekningarþolið — hver call inserts ný lines. Set `clearExistingLines: true` til wipe the batch (`DeleteAll(true)` — triggers fire) áður en inserting.

## Identifier Resolution
Batch er resolved in this order:
1. JSON `templateName` (+ valfrjálst `batchName`)
2. `subject` er a GUID → batch SystemId
3. `subject` contains `|` → `TEMPLATE|BATCH`

## Beiðnibreytur

| Heiti | Gerð | Sjálfgefið | Lýsing |
|---|---|---|---|
| `templateName` | strengur | — | dagbók template Heiti (`Code[10]`). |
| `batchName` | strengur | — | dagbók batch Heiti (`Code[10]`). |
| `noOfLines` | heiltala | 1 | Lines til create. verður að be 1–100. |
| `clearExistingLines` | sanngildi | false | Delete all fyrirliggjandi lines in the batch (með triggers) áður en creating. |
| `fieldNumbers` | int[] | all | Reitur numbers til include in hver line's `fields` block. Omit til return every Reitur. |

## Dæmi um beiðni
```json
{ "templateName": "PROJECT", "batchName": "DEFAULT", "noOfLines": 2, "clearExistingLines": true }
```

## Uppbygging svars
sama færsla shape as `Data.Records.Get`.

| Property | Gerð | Lýsing |
|---|---|---|
| `status` | strengur | Always `"Success"` on Tókst. |
| `noOfRecords` | heiltala | númer of lines created. |
| `result` | fylki | One hlutur per line með `id` (SystemId, no braces), `primaryKey`, og `fields`. |

```json
{
  "status": "Success",
  "noOfRecords": 1,
  "result": [
    {
      "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
      "primaryKey": { "JournalTemplateName": "PROJECT", "JournalBatchName": "DEFAULT", "LineNo_": 10000 },
      "fields": { "PostingDate": "2026-04-15", "DocumentNo_": "PJNL000001", "SourceCode": "JOBJNL" }
    }
  ]
}
```

## Villur

| Message | Orsök |
|---|---|
| `Project journal batch must be identified via subject (TEMPLATE\|BATCH or SystemId) or data parameters (templateName, batchName).` | No identification provided. |
| `Project journal batch {templateName}\|{batchName} not found.` | Batch lookup mistókst. |
| `noOfLines must be between 1 and 100. Received: {noOfLines}.` | Out-of-range `noOfLines`. |

## Tengdar skilaboðategundir
- `Projects.ProjectJournal.Check`
- `Projects.ProjectJournal.Post`
- `Data.Records.Set` — populate fields on the ný line via SystemId.
- `Data.Records.Get` — sama Uppbygging svars.

