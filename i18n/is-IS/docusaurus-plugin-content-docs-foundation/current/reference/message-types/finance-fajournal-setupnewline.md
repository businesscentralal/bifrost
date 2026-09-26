---
id: finance-fajournal-setupnewline
title: "Finance.FAJournal.SetupNewLine"
sidebar_label: "Finance.FAJournal.SetupNewLine"
sidebar_position: 43
description: "Beiðni- og svarsamningur fyrir Finance.FAJournal.SetupNewLine Bifröst skilaboðategund."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálparkóða skilaboðategundarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálparkóðanum í forritinu, ekki þessari skrá.
:::


## Yfirlit

Inserts ein eða fleiri ný FA dagbók Line færslur in a batch, hver pre-populated með BC `FA Journal Line.SetUpNewLine`. Line numbering continues at `last Line No. + 10000` (eða `10000` ef the batch er empty). Skilar hver inserted line in the **sama `{id, primaryKey, fields}` shape** notað með `Data.Records.Get`, so Svarið getur be fed directly í `Data.Records.Set` eftir populating business fields.

**Stefna**: Innkomandi (skrifa)  **Efnisgerð**: `text/json`

## Athugasemdir um endurtekningar og öryggi

- **ekki endurtekningarþolið** — hver call appends ný lines. Re-sending the sama request Býr til additional lines unless `clearExistingLines: true` er notað.
- `clearExistingLines: true` runs `DeleteAll(true)` on the batch áður en inserting — destructive og ekki recoverable.
- Defensive: ef `SetUpNewLine` leaves `FA Posting Date = 0D`, the implementation Stillir it til `WorkDate()` áður en insert.

## Batch Identification Order

fyrsta match wins:
1. `data.templateName` (+ valfrjálst `data.batchName`).
2. `subject` envelope attribute er a GUID → batch SystemId.
3. `subject` envelope attribute contains a `|` → `TEMPLATE|BATCH`.

## Beiðnibreytur

| Færibreyta | Gerð | áskilið | Athugasemdir |
|---|---|---|---|
| `templateName` | strengur | Sjá above | FA dagbók template (Code[10]). |
| `batchName` | strengur | No | FA dagbók batch (Code[10]). valfrjálst þegar the template has aðeins one batch. |
| `noOfLines` | int | No | númer of lines til create. Sjálfgefið `1`. verður að be `1..100`. |
| `clearExistingLines` | bool | No | Sjálfgefið `false`. þegar `true`, deletes all fyrirliggjandi lines in the batch (triggers fire) áður en inserting. |
| `fieldNumbers` | int[] | No | Restrict the returned `fields` til these Reitur numbers. Ef það er ekki gefið upp, all non-PK fields eru returned. |

### Dæmi um beiðni
```json
{
  "templateName": "ASSETS",
  "batchName": "DEFAULT",
  "noOfLines": 3,
  "clearExistingLines": true
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
      "primaryKey": { "JournalTemplateName": "ASSETS", "JournalBatchName": "DEFAULT", "LineNo_": 10000 },
      "fields": { "FAPostingDate": "2026-04-15", "DepreciationBookCode": "COMPANY", "FAPostingType": "Acquisition Cost", "SourceCode": "FAJNL" }
    }
  ]
}
```

Reitur names follow the sama normalization rules as `Data.Records.Get` (`.`/`/`/`%`/`"`/`\`/`'` → `_`, strip remaining non-alphanumerics).

## Typical Workflow

1. `Finance.FAJournal.SetupNewLine` — get pre-populated lines með SystemIds.
2. `Data.Records.Set` — populate `FA No.`, `Depreciation Book Code`, `FA Posting Type`, `Amount` (in that order — earlier fields drive validation of later ones).
3. `Finance.FAJournal.Check` — validate.
4. `Finance.FAJournal.Post` — post.

## Villur

| Villa | Orsök |
|---|---|
| `Fixed asset journal batch must be identified via subject (TEMPLATE\|BATCH or SystemId) or data parameters (templateName, batchName).` | No identification was supplied. |
| `Fixed asset journal batch {template}\|{batch} not found.` | Identification did ekki match an fyrirliggjandi batch. |
| `noOfLines must be between 1 and 100. Received: {n}.` | `noOfLines` er `< 1` eða `> 100`. |

## Tengdar skilaboðategundir

- `Finance.FAJournal.Check` — validate the batch.
- `Finance.FAJournal.Post` — post the batch.
- `Data.Records.Set` — populate business fields on the ný lines.
- `Data.Records.Get` — re-lesa lines eftir edits (sama Uppbygging svars).

## Villur og viðvaranir
Villur og viðvaranir fylgja sameiginlega sniðinu - sjá [Villur og viðvaranir](/foundation/reference/errors/).

