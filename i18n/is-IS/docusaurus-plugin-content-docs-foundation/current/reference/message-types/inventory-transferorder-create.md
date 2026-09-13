---
id: inventory-transferorder-create
title: "Inventory.TransferOrder.Create"
sidebar_label: "Inventory.TransferOrder.Create"
sidebar_position: 88
description: "Beiðni- og svarsamningur fyrir Inventory.TransferOrder.Create Bifröst skilaboðategund."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálparkóða skilaboðategundarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálparkóðanum í forritinu, ekki þessari skrá.
:::


## Yfirlit
Býr til a ný Transfer Order header (`Transfer Header`) með úr/til locations, posting/shipment/receipt dates, og an valfrjálst `Direct Transfer` flag. **Lines eru ekki created** - add lines afterwards via `Data.Records.Set` on tafla `5741 Transfer Line`.

**Stefna**: Innkomandi  **Efnisgerð**: `text/json`

## Idempotency / Safety
ekki endurtekningarþolið. Every call inserts a ný `Transfer Header` row og consumes one númer úr the Transfer Order No. Series.

## Beiðnibreytur
| Reitur | Gerð | áskilið | Lýsing |
|-------|------|----------|-------------|
| transferFromCode | Code[10] | Yes | Uppruni location. |
| transferToCode | Code[10] | Yes | Destination location. |
| directTransfer | sanngildi | No | þegar `true`, marks header as Direct Transfer (no in-transit step). Sjálfgefið `false`. |
| inTransitCode | Code[10] | áskilið þegar `directTransfer = false` | In-transit location code. |
| postingDate | dagsetning | No | Posting dagsetning. Defaults til `WorkDate()` Ef það er ekki gefið upp eða `0D`. Format `0,9`. |
| shipmentDate | dagsetning | No | Shipment dagsetning. Format `0,9`. |
| receiptDate | dagsetning | No | Receipt dagsetning. Format `0,9`. |
| externalDocumentNo | Code[35] | No | External skjal No. |

## Dæmi um beiðni
```json
{
  "type": "Inventory.TransferOrder.Create",
  "data": {
    "transferFromCode": "BLUE",
    "transferToCode": "RED",
    "inTransitCode": "OUT-LOG",
    "shipmentDate": "2026-05-01",
    "receiptDate": "2026-05-03"
  }
}
```

## Uppbygging svars
```json
{
  "status": "Success",
  "documentNo": "TO000456",
  "systemId": "00000000-0000-0000-0000-000000000000",
  "transferFromCode": "BLUE",
  "transferToCode": "RED",
  "inTransitCode": "OUT-LOG",
  "directTransfer": false,
  "postingDate": "2026-04-15",
  "shipmentDate": "2026-05-01",
  "receiptDate": "2026-05-03",
  "externalDocumentNo": "",
  "statusAfter": "Open"
}
```

| Property | Lýsing |
|----------|-------------|
| status | `Success`. Validation failures nota the Villa envelope. |
| documentNo | ný `Transfer Header.No.` (úr No. Series). |
| systemId | ný header `SystemId` (Format `0,4`). |
| transferFromCode / transferToCode / inTransitCode / directTransfer | Echo eftir BC validation. |
| postingDate / shipmentDate / receiptDate | Format `0,9`. |
| externalDocumentNo | Echo (empty þegar ekki supplied). |
| statusAfter | Always `Open` fyrir newly created orders. |

## Villur
| Villa | Orsök |
|-------|-------|
| `transferFromCode must be specified in the request JSON.` | `transferFromCode` vantar. |
| `transferToCode must be specified in the request JSON.` | `transferToCode` vantar. |
| `inTransitCode must be specified when directTransfer is false.` | `directTransfer != true` og `inTransitCode` empty. |
| (BC validation Villa text) | Unknown location, equal úr/til codes, location lacks Require Shipment/Receipt, etc. |

## Tengdar skilaboðategundir
- `Data.Records.Set` on `Transfer Line` (tafla 5741) - add lines.
- `Inventory.TransferOrder.Release` - release once lines exist.
- `Inventory.TransferOrder.Post` - ship og/eða receive.
- `Inventory.TransferOrder.PreviewPost` - dry run.
- `Inventory.TransferOrder.Statistics` - totals.

