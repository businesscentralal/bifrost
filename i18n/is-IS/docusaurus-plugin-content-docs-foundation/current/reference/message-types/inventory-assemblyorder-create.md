---
id: inventory-assemblyorder-create
title: "Inventory.AssemblyOrder.Create"
sidebar_label: "Inventory.AssemblyOrder.Create"
sidebar_position: 77
description: "Beiðni- og svarsamningur fyrir Inventory.AssemblyOrder.Create Bifröst skilaboðategund."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálparkóða skilaboðategundarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálparkóðanum í forritinu, ekki þessari skrá.
:::


## Yfirlit
Býr til a ný Assembly Order (Assembly Header með `Document Type = Order`) fyrir a parent vöru. The header `No.` er assigned úr the Assembly Order No. Series. með Sjálfgefið the component lines eru refreshed úr the parent vöru BOM via `Item No.` re-validation.

**Stefna**: Innkomandi  **Efnisgerð**: `text/json`

## Idempotency / Safety
ekki endurtekningarþolið. Every call inserts a ný Assembly Order header og consumes one númer úr the Assembly Order No. Series, og (þegar `refreshLines = true`, the Sjálfgefið) re-Býr til component lines úr the BOM.

## Beiðnibreytur
| Reitur | Gerð | áskilið | Lýsing |
|-------|------|----------|-------------|
| itemNo | Code[20] | Yes | Parent (assembled) vöru númer. |
| quantity | tugabrot | Yes | Quantity til assemble. verður að be `> 0`. |
| variantCode | Code[10] | No | vöru variant. |
| locationCode | Code[10] | No | Output location. |
| binCode | Code[20] | No | Output bin within the location. Applied eftir `Quantity`. |
| unitOfMeasureCode | Code[10] | No | UoM of the parent vöru. |
| Lýsing | Text[100] | No | Header Lýsing. |
| postingDate | dagsetning | No | Posting dagsetning. Defaults til `WorkDate()` Ef það er ekki gefið upp eða `0D`. Format `0,9` (`yyyy-MM-dd`). |
| dueDate | dagsetning | No | Due dagsetning. Format `0,9`. |
| startingDate | dagsetning | No | Starting dagsetning. Format `0,9`. |
| endingDate | dagsetning | No | Ending dagsetning. Format `0,9`. |
| quantityToAssemble | tugabrot | No | Initial Gildi fyrir `Quantity to Assemble`. Applied aðeins þegar `> 0`; otherwise BC Sjálfgefið (= `Quantity`) er kept. |
| refreshLines | sanngildi | No | þegar `true` (Sjálfgefið), re-validates `Item No.` eftir the initial validate til refresh component lines úr the BOM. Set `false` til skip the BOM refresh. |

## Dæmi um beiðni
```json
{
  "type": "Inventory.AssemblyOrder.Create",
  "data": {
    "itemNo": "BICYCLE",
    "quantity": 5,
    "locationCode": "BLUE",
    "dueDate": "2026-05-30",
    "refreshLines": true
  }
}
```

## Uppbygging svars
```json
{
  "status": "Success",
  "documentNo": "AO000123",
  "systemId": "00000000-0000-0000-0000-000000000000",
  "itemNo": "BICYCLE",
  "variantCode": "",
  "description": "Bicycle",
  "locationCode": "BLUE",
  "binCode": "",
  "unitOfMeasureCode": "PCS",
  "quantity": 5,
  "quantityToAssemble": 5,
  "postingDate": "2026-04-15",
  "dueDate": "2026-05-30",
  "startingDate": "2026-04-15",
  "endingDate": "2026-05-30",
  "statusAfter": "Open",
  "lineCount": 3
}
```

| Property | Lýsing |
|----------|-------------|
| status | `Success`. Validation failures nota the standard Villa envelope. |
| documentNo | ný `Assembly Header.No.` (úr No. Series). |
| systemId | ný header `SystemId` (Format `0,4`, no braces). |
| itemNo / variantCode / Lýsing / locationCode / binCode / unitOfMeasureCode | Header echo eftir BC validation (may differ úr request ef defaults applied). |
| quantity / quantityToAssemble | Header values eftir validation. |
| postingDate / dueDate / startingDate / endingDate | Format `0,9` (`yyyy-MM-dd`). BC computes the dates ekki supplied skýrt. |
| statusAfter | `Open` (newly created orders eru always opið). |
| lineCount | númer of `Assembly Line` rows. `0` þegar `refreshLines = false`, otherwise the BOM line count. |

## Villur
| Villa | Orsök |
|-------|-------|
| `itemNo must be specified in the request JSON.` | `itemNo` vantar eða empty. |
| `quantity must be specified and greater than 0 in the request JSON.` | `quantity` vantar eða `<= 0`. |
| (BC validation Villa text) | hvaða `Validate` call surfaced an Villa (unknown vöru, ógilt location, vantar BOM, etc.). Caught og returned in `error`. |

## Tengdar skilaboðategundir
- `Inventory.AssemblyOrder.RefreshLines` - refresh BOM lines on an fyrirliggjandi order.
- `Inventory.AssemblyOrder.Release` - release an opið order.
- `Inventory.AssemblyOrder.Post` - post.
- `Inventory.AssemblyOrder.PreviewPost` - dry run.
- `Data.Records.Set` - adjust component lines.

## Villur og viðvaranir
Villur og viðvaranir fylgja sameiginlega sniðinu - sjá [Villur og viðvaranir](/foundation/reference/errors/).

