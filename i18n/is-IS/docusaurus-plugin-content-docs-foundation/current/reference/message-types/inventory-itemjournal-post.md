---
id: inventory-itemjournal-post
title: "Inventory.ItemJournal.Post"
sidebar_label: "Inventory.ItemJournal.Post"
sidebar_position: 85
description: "Beiðni- og svarsamningur fyrir Inventory.ItemJournal.Post Bifröst skilaboðategund."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálparkóða skilaboðategundarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálparkóðanum í forritinu, ekki þessari skrá.
:::


## Yfirlit
Bókar every line in the specified vöru dagbók batch með invoking BC `Item Jnl.-Post Batch.Run`. On Tókst Skilar batch totals plus the produced vöru Register og vöru bók færsla / Gildi færsla ranges.

**Stefna**: Innkomandi  **Efnisgerð**: `text/json`

## Idempotency / Safety
ekki endurtekningarþolið. tókst posting deletes the Uppruni lines og writes vöru bók færslur, Gildi færslur, og an vöru Register færsla. Re-running on the sama batch Bókar whatever lines remain (eða Skilar an Villa ef none remain). Bókunarvillur eru afturkallaðar og skila `status: "Error"` með kóða `BusinessCentralError`.

## Batch Identification
Resolved in this order:
1. Request JSON `templateName` (+ valfrjálst `batchName`).
2. `subject` parsed as GUID -> batch `SystemId`.
3. `subject` containing `|` -> split í `TEMPLATE|BATCH`.

## Beiðnibreytur
| Reitur | Gerð | áskilið | Lýsing |
|-------|------|----------|-------------|
| templateName | Code[10] | One of the three identification paths verður að succeed | vöru dagbók Template Heiti. |
| batchName | Code[10] | No | vöru dagbók Batch Heiti. Combined með `templateName`. |

## Request Examples
```json
{ "type": "Inventory.ItemJournal.Post", "subject": "ITEM|DEFAULT" }
```
```json
{
  "type": "Inventory.ItemJournal.Post",
  "data": { "templateName": "ITEM", "batchName": "DEFAULT" }
}
```

## Uppbygging svars
```json
{
  "status": "Success",
  "templateName": "ITEM",
  "batchName": "DEFAULT",
  "batchDescription": "Default Journal",
  "linesPosted": 2,
  "postingDate": "2026-04-15",
  "totalQuantity": 30,
  "totalAmount": 0,
  "itemRegisterNo": 1234,
  "itemRegisterId": "<SystemId>",
  "fromEntryNo": 5001,
  "toEntryNo": 5002,
  "fromValueEntryNo": 7001,
  "toValueEntryNo": 7002
}
```

| Property | Lýsing |
|----------|-------------|
| status | `Success` on completed posting; `Error` otherwise. |
| templateName / batchName / batchDescription | Identifying info fyrir the posted batch. |
| linesPosted | númer of dagbók lines that were present immediately áður en posting. |
| postingDate | Posting dagsetning notað fyrir the fyrsta line (Format `0,9`). |
| totalQuantity / totalAmount | Aggregates summed across the posted lines. |
| itemRegisterNo | `No.` of the ný vöru Register row covering this posting. |
| itemRegisterId | `SystemId` of the vöru Register row (Format `0,4`, no braces). |
| fromEntryNo / toEntryNo | Inclusive range of vöru bók færsla `Entry No.` values created. |
| fromValueEntryNo / toValueEntryNo | Inclusive range of Gildi færsla `Entry No.` values created. Zero þegar no Gildi færslur were posted. |

## Dæmi (úr einingaprófum)
- Postable batch via pipe subject -> `Success`, `linesPosted = 2`, `itemRegisterNo > 0`, `toEntryNo - fromEntryNo + 1` equals the original line count.
- SystemId subject (`Format(SystemId, 0, 4)`) -> equivalent `Success` response.
- Data parameters `{ templateName, batchName }` -> equivalent `Success` response.
- Zero-quantity lines -> `Error` með kóða `BusinessCentralError` og bókunarvillu BC.

## Bókunarheimild
Calling this skilaboðategund requires the `BIFROST ItemPost ori` heimild set in addition til `BIFROST API ori`. án it Beiðnin Skilar: `Posting denied: missing 'BIFROST ItemPost ori' permission set.`

## Villur
| Villa | Orsök |
|-------|-------|
| `Posting denied: missing 'BIFROST ItemPost ori' permission set.` | Kallandi lacks the `BIFROST ItemPost ori` heimild set. |
| `Item journal batch must be identified via subject (TEMPLATE\|BATCH or SystemId) or data parameters (templateName, batchName).` | None of the three identification paths produced a Gildi. |
| `Item journal batch {templateName}\|{batchName} not found.` | Batch lookup returned no færsla. |
| `Item journal batch {templateName}\|{batchName} has no lines to post.` | Identified batch contained zero `Item Journal Line` rows. |
| `Nothing was posted. Review journal for errors.` | `Item Jnl.-Post Batch.Run` completed án producing hvaða vöru bók færsla rows. |
| (BC posting Villa text) | `Item Jnl.-Post Batch.Run` threw. The original Villa er surfaced in `error` með kóða `BusinessCentralError`. |

## Operational Athugasemdir — Populating Lines via Data.Records.Set

`SetupNewLine` inserts lines via `Insert(true)` (triggers run), but `Data.Records.Set` writes via `Modify` **án** calling `OnValidate`. Therefore, þegar using `Data.Records.Set` til populate a dagbók line, supply every derived Reitur manually:

- **`InventoryPostingGroup`** — úr the vöru's `Inventory Posting Group` Reitur.
- **`Gen_Prod_PostingGroup`** — úr the vöru's `Gen. Prod. Posting Group` Reitur.
- **`Gen_Bus_PostingGroup`** — verður að be supplied alongside `Gen_Prod_PostingGroup`. BC looks up `General Posting Setup` using both fields til find the inventory adjustment G/L accounts. Omitting `Gen_Bus_PostingGroup` causes a "General Posting Setup does ekki exist" Villa at posting time even þegar `Gen_Prod_PostingGroup` er correct.
- **`UnitCost`** — úr the vöru's `Unit Cost` Reitur (eða síðasta direct cost).

### Physical Inventory Template (RAUNBIRGÐI)

Lines created með the BC "Calculate Inventory" function have `Phys_Inventory = true`. These lines eru **locked** — hvaða attempt til modify them via `Data.Records.Set` fails með "Raunbirgðir verður að be equal til 'Nei'" (Physical Inventory verður að equal 'No'). aðeins lines með `Phys_Inventory = false` getur be modified via `Data.Records.Set`.

fyrir regular adjustment lines (where `Phys_Inventory = false`) in a Physical Inventory template, setting `EntryType` til a Gildi other than what the template allows may trigger the reverse Villa ("Raunbirgðir verður að be equal til 'Já'"). The safe approach er:
1. Leave `EntryType` at its Sjálfgefið (`SetUpNewLine` initialises it úr the síðasta line eða template; fyrir a fresh empty batch it defaults til `Purchase`).
2. Set `ItemNo_`, `Quantity` (positive fyrir additions), `InventoryPostingGroup`, `Gen_Bus_PostingGroup`, `Gen_Prod_PostingGroup`, `UnitCost`, `DocumentNo_`.
3. Run `Inventory.ItemJournal.Check` til confirm `validationResult = "Ready"` áður en posting.

## Tengdar skilaboðategundir
- `Inventory.ItemJournal.SetupNewLine` - create lines.
- `Inventory.ItemJournal.Check` - validate áður en posting.

## Villur og viðvaranir
Villur og viðvaranir fylgja sameiginlega sniðinu - sjá [Villur og viðvaranir](/foundation/reference/errors/).

