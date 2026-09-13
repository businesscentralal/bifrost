---
id: inventory-transferorder-statistics
title: "Inventory.TransferOrder.Statistics"
sidebar_label: "Inventory.TransferOrder.Statistics"
sidebar_position: 93
description: "Beiðni- og svarsamningur fyrir Inventory.TransferOrder.Statistics Bifröst skilaboðategund."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálparkóða skilaboðategundarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálparkóðanum í forritinu, ekki þessari skrá.
:::


## Yfirlit
Skilar Transfer Order line totals - matching what BC Page 5755 "Transfer Statistics" displays. Iterates `Transfer Line` rows where `Derived From Line No. = 0` og aggregates `Quantity`, `Net Weight`, `Gross Weight`, `Unit Volume`, og `Units per Parcel`.

**Stefna**: Innkomandi (lesa-aðeins)  **Efnisgerð**: `text/json`

## Idempotency / Safety
Safe og endurtekningarþolið. No writes occur.

## Order Identification
Standard `Transfer Header` identification:
1. `subject` parsed as GUID -> header `SystemId`.
2. `subject` as text -> header `No.`.
3. Request JSON keys (fyrsta match wins): `systemId`, `recordSystemId`, `id`, `documentNo`, `transferOrderNo`, `no`.

## Beiðnibreytur
None beyond identification.

## Request Examples
```json
{ "type": "Inventory.TransferOrder.Statistics", "subject": "TO000456" }
```
```json
{
  "type": "Inventory.TransferOrder.Statistics",
  "data": { "documentNo": "TO000456" }
}
```

## Uppbygging svars
```json
{
  "status": "Success",
  "documentNo": "TO000456",
  "transferFromCode": "BLUE",
  "transferToCode": "RED",
  "directTransfer": false,
  "statusValue": "Open",
  "postingDate": "2026-04-15",
  "shipmentDate": "2026-05-01",
  "receiptDate": "2026-05-03",
  "totals": {
    "lineCount": 2,
    "quantity": 30,
    "parcels": 3,
    "netWeight": 45,
    "grossWeight": 60,
    "volume": 0.9
  }
}
```

| Property | Lýsing |
|----------|-------------|
| status | `Success`. Lookup failures nota the Villa envelope. |
| documentNo / transferFromCode / transferToCode / directTransfer | Header echo. |
| statusValue | `Open` eða `Released`. Reitur er `statusValue` (ekki `status`) because `status` er reserved fyrir Svarið envelope. |
| postingDate / shipmentDate / receiptDate | Format `0,9`. |
| totals.lineCount | númer of `Transfer Line` rows considered (excludes derived-úr lines). |
| totals.quantity | Sum of `Quantity` across lines. |
| totals.parcels | Sum of `ceil(Quantity / "Units per Parcel")` across lines that have a positive Units per Parcel. |
| totals.netWeight / totals.grossWeight | Sum of `Quantity * Net Weight` / `Quantity * Gross Weight`. |
| totals.volume | Sum of `Quantity * Unit Volume`. |

## Villur
| Villa | Orsök |
|-------|-------|
| `Transfer order identifier must be specified in subject field or request JSON (systemId, recordSystemId, id, documentNo, transferOrderNo, no).` | No identifier supplied eða lookup mistókst. |

## Tengdar skilaboðategundir
- `Inventory.TransferOrder.PreviewPost` - Sjá predicted bók færslur.
- `Inventory.TransferOrder.Post` - ship og/eða receive.

