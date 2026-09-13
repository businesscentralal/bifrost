---
id: item-availability-get
title: "Item.Availability.Get"
sidebar_label: "Item.Availability.Get"
sidebar_position: 94
description: "Beiðni- og svarsamningur fyrir Item.Availability.Get Bifröst skilaboðategund."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálparkóða skilaboðategundarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálparkóðanum í forritinu, ekki þessari skrá.
:::


## Yfirlit

Skilar calculated vöru availability per location: inventory, reservations, gross requirement, scheduled receipts, planned receipts, og `availableQuantity = inventory - qtyReserved + scheduledReceipt + plannedOrderReceipt - grossRequirement`. The virkt implementation er resolved úr `Bifrost Setup.Item Availability Implementation`; Sjálfgefið er `Calculated Quantity Impl` (codeunit 65333).

**Stefna**: Útgående (lesa-aðeins)  **Efnisgerð**: `text/json`

## Forgangsröð auðkenna

Items eru resolved as a *range* (the call iterates the resulting set). fyrsta non-empty wins:
1. `subject` envelope attribute — GUID = `Item.SystemId`, otherwise `Item.No.`.
2. `data.itemNo`.
3. `data.itemId` / `data.id` / `data.systemId` / `data.recordSystemId` — `Item.SystemId`.
4. `data.tableView` — raw `Item.SetView` strengur.
5. Fallback: `Item.Blocked = false`.

## Beiðnibreytur

| Færibreyta | Gerð | áskilið | Athugasemdir |
|---|---|---|---|
| `itemNo` / `itemId` / `tableView` | strengur / GUID / strengur | Sjá above | vöru selection. |
| `requestedDeliveryDate` | dagsetning | No | Format 9. Sjálfgefið: `WorkDate`. notað as the dagsetning cutoff fyrir requirements/receipts. |
| `locationFilter` | strengur | No | BC filter expression applied til `Location.Code`. Sjálfgefið: per-vöru `Item."Location Filter"`. |
| `variantCode` | strengur | No | Restricts færslur til a single variant. |

### Dæmi um beiðni
```json
{
  "itemNo": "1896-S",
  "locationFilter": "BLUE|YELLOW",
  "requestedDeliveryDate": "2026-02-15"
}
```

## Uppbygging svars

### Tókst
```json
{
  "status": "Success",
  "items": [
    {
      "itemNo": "1896-S",
      "itemDescription": "ATHENS Desk",
      "baseUnitOfMeasure": "PCS",
      "requestedDeliveryDate": "2026-02-15",
      "availability": [
        {
          "locationCode": "BLUE",
          "inventory": 50,
          "qtyReserved": 5,
          "grossRequirement": 10,
          "scheduledReceipt": 20,
          "plannedOrderReceipt": 0,
          "availableQuantity": 55
        }
      ]
    }
  ]
}
```

### Svarreitir

| Reitur | Uppruni |
|---|---|
| `inventory` | `Item Ledger Entry.CalcSums(Quantity)` fyrir the vöru/variant/location. |
| `qtyReserved` | `Reservation Entry.CalcSums(Quantity)` negated. |
| `grossRequirement` | Sum of demand: Sales Lines + Job Planning + Assembly Lines (+ Service Lines og Prod Order Components þegar the Premium Experience er enabled). |
| `scheduledReceipt` | Sum of supply: Purchase Lines + Assembly Header + Innkomandi Transfer Lines (+ Prod Order Lines þegar Premium er enabled). |
| `plannedOrderReceipt` | Planning worksheet receipts. |
| `availableQuantity` | `inventory - qtyReserved + scheduledReceipt + plannedOrderReceipt - grossRequirement`. |

Locations marked `Use As In-Transit` eru excluded. Locations með zero activity fyrir the vöru eru omitted úr Svarið. þegar no `locationFilter` er supplied an additional færsla fyrir the blank location code er appended.

## Configuration

Alternative implementation: `Physical Inventory Impl` (codeunit 65332) Skilar aðeins physical inventory og reservations. Switch via `Bifrost Setup.Item Availability Implementation`.

## Dæmi (úr einingaprófum)

úr `Item Availability Tests` (`test/test/Sales/ItemAvailabilityTests.Codeunit.al`) — exercises vöru-með-No., vöru-með-SystemId, `locationFilter`, `variantCode`, requested delivery dagsetning, og the inventory/reservation/requirement aggregation paths.

## Villur

| Villa | Orsök |
|---|---|
| `No items found matching the specified criteria.` | `FindItemRange` produced an empty set. |

## Tengdar skilaboðategundir

- `Item.Price.Get` — pricing fyrir the sama vöru/viðskiptamanni.
- `Data.Records.Get` — raw `Item` færsla.

