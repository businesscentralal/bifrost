---
id: inventory-itemjournal-setupnewline
title: "Inventory.ItemJournal.SetupNewLine"
sidebar_label: "Inventory.ItemJournal.SetupNewLine"
sidebar_position: 87
description: "Beiðni- og svarsamningur fyrir Inventory.ItemJournal.SetupNewLine Bifröst skilaboðategund."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálparkóða skilaboðategundarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálparkóðanum í forritinu, ekki þessari skrá.
:::


## Yfirlit
Býr til ein eða fleiri ný vöru dagbók lines in the specified batch, pre-populated með defaults via BC `Item Journal Line.SetUpNewLine`. hver ný line er assigned the next available `Line No.` (síðasta line + 10000, eða 10000 fyrir an empty batch).

**Stefna**: Innkomandi  **Efnisgerð**: `text/json`

## Idempotency / Safety
ekki endurtekningarþolið. Every call inserts ný rows og may consume numbers úr a No. Series configured on the batch. Retrying eftir Tókst appends additional lines.

þegar `clearExistingLines: true`, every fyrirliggjandi line in the batch er deleted (með triggers, via `DeleteAll(true)`) áður en ný lines eru created. Destructive og unrecoverable.

## Batch Identification
Resolved in this order:
1. Request JSON `templateName` (+ valfrjálst `batchName`).
2. `subject` parsed as GUID -> batch `SystemId`.
3. `subject` containing `|` -> split í `TEMPLATE|BATCH`.

## Beiðnibreytur
| Reitur | Gerð | áskilið | Lýsing |
|-------|------|----------|-------------|
| templateName | Code[10] | One of the three identification paths verður að succeed | vöru dagbók Template Heiti. |
| batchName | Code[10] | No | vöru dagbók Batch Heiti. Combined með `templateName` fyrir lookup. |
| noOfLines | heiltala | No | númer of lines til create. Sjálfgefið `1`. verður að be between `1` og `100` inclusive. |
| clearExistingLines | sanngildi | No | þegar `true`, deletes all fyrirliggjandi lines (með triggers) áður en inserting ný ones. Sjálfgefið `false`. |
| fieldNumbers | heiltala[] | No | Restrict the `fields` hlutur in Svarið til the listed Reitur numbers. Ef það er ekki gefið upp, all fields eru returned. |

## Request Examples
```json
{ "type": "Inventory.ItemJournal.SetupNewLine", "subject": "ITEM|DEFAULT" }
```
```json
{
  "type": "Inventory.ItemJournal.SetupNewLine",
  "data": { "templateName": "ITEM", "batchName": "DEFAULT", "noOfLines": 3 }
}
```

## Uppbygging svars
`Data.Records.Get` shape: one færsla per inserted line.
```json
{
  "status": "Success",
  "noOfRecords": 1,
  "result": [
    {
      "id": "<SystemId>",
      "primaryKey": { "JournalTemplateName": "ITEM", "JournalBatchName": "DEFAULT", "LineNo_": 10000 },
      "fields": { "PostingDate": "2026-04-15", "EntryType": "Purchase", "SourceCode": "ITEMJNL" }
    }
  ]
}
```

| Property | Lýsing |
|----------|-------------|
| status | `Success`. Failures nota the standard Villa envelope. |
| noOfRecords | Equals `noOfLines` úr Beiðnin (eða `1` með Sjálfgefið). |
| result[].id | `SystemId` of the inserted vöru dagbók Line. |
| result[].primaryKey | `JournalTemplateName`, `JournalBatchName`, `LineNo_`. |
| result[].fields | All vöru dagbók Line fields (subject til `fieldNumbers` filter og Reitur lesa takmarkanir). |

## Line Numbering
Empty batch -> fyrsta line = `10000`. fyrirliggjandi lines -> next line = síðasta `Line No.` + `10000`. Multiple lines in one call eru spaced með `10000`.

## SetUpNewLine Defaults
BC populates: `Posting Date` (úr síðasta line eða `WorkDate()`), `Document Date`, `Entry Type` (inherited úr síðasta line), `Document No.` (úr batch No. Series ef configured), `Source Code` (úr template), `Reason Code` (úr batch).

## Dæmi (úr einingaprófum)
- `subject: "ITEM|DEFAULT"` against an empty batch -> `primaryKey.LineNo_ = 10000`, `fields.PostingDate = WorkDate()`.
- sama batch already containing lines `10000` og `20000` -> ný `LineNo_ = 30000`.
- `data: { templateName, batchName, noOfLines: 3 }` -> 3 færslur með `LineNo_ = 10000, 20000, 30000`.
- `data: { ..., fieldNumbers: [5, 6] }` -> `fields` contains exactly two keys.

## Reitur Naming
Response Reitur names follow `RemoveNonAlphaNumericCharacters` of the BC Reitur Heiti: `Line No.` -> `LineNo_`, `Journal Template Name` -> `JournalTemplateName`.

## Villur
| Villa | Orsök |
|-------|-------|
| `Item journal batch must be identified via subject (TEMPLATE\|BATCH or SystemId) or data parameters (templateName, batchName).` | None of the three identification paths produced a Gildi. |
| `Item journal batch {templateName}\|{batchName} not found.` | Batch lookup returned no færsla. |
| `noOfLines must be between 1 and 100. Received: {value}.` | `noOfLines` outside the inclusive range `1..100`. |

## Populating Lines via Data.Records.Set
eftir calling `SetupNewLine`, nota `Data.Records.Set` on tafla `Item Journal Line` til set Reitur values. Because `Data.Records.Set` does ekki call `OnValidate`, every derived Reitur verður að be supplied skýrt:
- `ItemNo_` — vöru númer.
- `Quantity` — verður að be non-zero fyrir posting til succeed.
- `InventoryPostingGroup` — úr the vöru.
- `Gen_Prod_PostingGroup` — úr the vöru.
- `Gen_Bus_PostingGroup` — áskilið alongside `Gen_Prod_PostingGroup`; BC resolves General Posting Setup using both. Omitting causes a "General Posting Setup does ekki exist" Villa at posting time.
- `UnitCost` — úr the vöru (notað til compute upphæð).
- `DocumentNo_` — skjal númer fyrir the bók færslur.

Sjá `Inventory.ItemJournal.Post` help fyrir Physical Inventory template specifics (`Phys_Inventory` locking behaviour).

## Tengdar skilaboðategundir
- `Inventory.ItemJournal.Check` - validate the batch.
- `Inventory.ItemJournal.Post` - post the batch.
- `Data.Records.Set` - populate Reitur values on the ný lines.

## Villur og viðvaranir
Villur og viðvaranir fylgja sameiginlega sniðinu - sjá [Villur og viðvaranir](/foundation/reference/errors/).

