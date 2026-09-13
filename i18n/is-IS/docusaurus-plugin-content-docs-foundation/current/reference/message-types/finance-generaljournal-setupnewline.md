---
id: finance-generaljournal-setupnewline
title: "Finance.GeneralJournal.SetupNewLine"
sidebar_label: "Finance.GeneralJournal.SetupNewLine"
sidebar_position: 50
description: "Beiðni- og svarsamningur fyrir Finance.GeneralJournal.SetupNewLine Bifröst skilaboðategund."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálparkóða skilaboðategundarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálparkóðanum í forritinu, ekki þessari skrá.
:::


## Yfirlit

Inserts ein eða fleiri ný Gen. dagbók Line færslur in a batch, hver pre-populated með BC `Gen. Journal Line.SetUpNewLine(LastLine, 0, true)` (the `true` flag er `BottomLine`, which er what allows the template / batch til suggest a balancing upphæð eða skjal númer on the trailing line). Line numbering continues at `last Line No. + 10000` (eða `10000` ef the batch er empty). Skilar hver inserted line in the **sama `{id, primaryKey, fields}` shape** notað með `Data.Records.Get`, so Svarið getur be fed directly í `Data.Records.Set` eftir populating business fields.

**Stefna**: Innkomandi (skrifa)  **Efnisgerð**: `text/json`

## Athugasemdir um endurtekningar og öryggi

- **ekki endurtekningarþolið** — hver call appends ný lines. Re-sending the sama request Býr til additional lines unless `clearExistingLines: true` er notað.
- `clearExistingLines: true` runs `DeleteAll(true)` on the batch áður en inserting — destructive og ekki recoverable.
- þegar a No. Series er configured on the batch, BC populates `Document No.` úr the series during `SetUpNewLine`.

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
| `noOfLines` | int | No | númer of lines til create. Sjálfgefið `1`. verður að be `1..100`. |
| `clearExistingLines` | bool | No | Sjálfgefið `false`. þegar `true`, deletes all fyrirliggjandi lines in the batch (triggers fire) áður en inserting. |
| `fieldNumbers` | int[] | No | Restrict the returned `fields` til these Reitur numbers. Ef það er ekki gefið upp, all non-PK fields eru returned. |

### Dæmi um beiðni
```json
{
  "templateName": "GENERAL",
  "batchName": "DEFAULT",
  "noOfLines": 3
}
```

## Uppbygging svars

```json
{
  "status": "Success",
  "noOfRecords": 3,
  "result": [
    {
      "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
      "primaryKey": { "JournalTemplateName": "GENERAL", "JournalBatchName": "DEFAULT", "LineNo_": 10000 },
      "fields": { "PostingDate": "2026-04-15", "AccountType": "G/L Account", "BalAccountType": "G/L Account", "DocumentType": " " }
    }
  ]
}
```

Reitur names follow the sama normalization rules as `Data.Records.Get` (`.`/`/`/`%`/`"`/`\`/`'` → `_`, strip remaining non-alphanumerics).

## Dæmi (úr einingaprófum)

úr `Gen. Jnl. SetupLine Tests` (codeunit 95336):
- `SetupNewLine_PipeSubject_ReturnsSuccessWithNewLine` — subject = `"GENERAL|DEFAULT"`, no data — inserts one line at `LineNo_ = 10000`.
- `SetupNewLine_SystemIdSubject_ReturnsSuccess` — subject = batch `SystemId` (formatted `Format(SystemId, 0, 4)`).
- `SetupNewLine_NoOfLines3_Returns3LinesWithSequentialLineNos` — data = `{ "templateName": "...", "batchName": "...", "noOfLines": 3 }` — produces line numbers `10000`, `20000`, `30000`.
- `SetupNewLine_NoOfLines0_ReturnsError` / `SetupNewLine_NoOfLines101_ReturnsError` — `noOfLines` outside `1..100` er rejected með the `noOfLines must be between 1 and 100` Villa.

## Typical Workflow

1. `Finance.GeneralJournal.SetupNewLine` — get pre-populated lines með SystemIds.
2. `Data.Records.Set` — populate `Account Type` → `Account No.` → `Currency Code` → `Amount` → `Bal. Account Type` → `Bal. Account No.` (earlier fields drive validation of later ones).
3. `Finance.GeneralJournal.Check` — validate.
4. `Finance.GeneralJournal.PreviewPost` — valfrjálst, simulate the post.
5. `Finance.GeneralJournal.Post` — post.

## Villur

| Villa | Orsök |
|---|---|
| `Journal batch must be identified via subject (TEMPLATE\|BATCH or SystemId) or data parameters (templateName, batchName).` | No identification was supplied. |
| `Journal batch {template}\|{batch} not found.` | Identification did ekki match an fyrirliggjandi batch. |
| `noOfLines must be between 1 and 100. Received: {n}.` | `noOfLines` er `< 1` eða `> 100`. |

## Tengdar skilaboðategundir

- `Finance.GeneralJournal.Check` — validate the batch.
- `Finance.GeneralJournal.PreviewPost` — simulate the post án committing.
- `Finance.GeneralJournal.Post` — post the batch.
- `Data.Records.Set` — populate business fields on the ný lines.
- `Data.Records.Get` — re-lesa lines eftir edits (sama Uppbygging svars).

