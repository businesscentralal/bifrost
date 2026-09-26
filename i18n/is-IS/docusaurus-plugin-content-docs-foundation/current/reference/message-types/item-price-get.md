---
id: item-price-get
title: "Item.Price.Get"
sidebar_label: "Item.Price.Get"
sidebar_position: 95
description: "Beiðni- og svarsamningur fyrir Item.Price.Get Bifröst skilaboðategund."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálparkóða skilaboðategundarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálparkóðanum í forritinu, ekki þessari skrá.
:::


## Yfirlit

Skilar the best-applicable price list lines fyrir ein eða fleiri items, optionally evaluated against a specific viðskiptamanni (með the viðskiptamanni's VAT/Gen/viðskiptamanni posting groups). The virkt implementation er resolved úr `Bifrost Setup.Item Price Implementation`; Sjálfgefið er `Default Price Impl` (codeunit 65334).

**Stefna**: Útgående (lesa-aðeins)  **Efnisgerð**: `text/json`

## Forgangsröð auðkenna

Items eru resolved via `FindItemRange` (sama precedence as `Item.Availability.Get`). viðskiptamanni er valfrjálst og resolved úr JSON aðeins:
- `customerNo` (viðskiptamanni `No.`)
- `customerId` / `customerRecordId` / `customerSystemId` (viðskiptamanni `SystemId`)

## Beiðnibreytur

| Færibreyta | Gerð | áskilið | Athugasemdir |
|---|---|---|---|
| `itemNo` / `itemId` / `tableView` | strengur / GUID / strengur | Sjá above | vöru selection. |
| `customerNo` / `customerId` / `customerRecordId` / `customerSystemId` | strengur / GUID | No | þegar supplied, evaluates viðskiptamanni-specific best price. |
| `variantCode` | strengur | No | Filters returned lines til a single variant. |
| `requestedDeliveryDate` | dagsetning | No | Format 9. Sjálfgefið: `WorkDate`. notað as the price-list line dagsetning filter. |
| `quantity` | tugabrot | No | Quantity fyrir tier evaluation. Sjálfgefið: `1` (a `0` Gildi er treated as `1`). |

### Dæmi um beiðni
```json
{
  "itemNo": "1896-S",
  "customerNo": "10000",
  "quantity": 5,
  "requestedDeliveryDate": "2026-02-15"
}
```

## Uppbygging svars

### Tókst
```json
{
  "status": "Success",
  "priceListLines": [
    {
      "priceListCode": "RETAIL",
      "lineNo": 10000,
      "itemNo": "1896-S",
      "unitOfMeasureCode": "PCS",
      "qtyPerUnitOfMeasure": 1,
      "minimumQuantity": 0,
      "amountType": "Price",
      "unitPrice": 1000.00,
      "unitPriceExclVAT": 1000.00,
      "unitPriceInclVAT": 1240.00,
      "lineDiscountPct": 0,
      "vatPct": 24,
      "baseUnitOfMeasure": "PCS",
      "itemSystemId": "11111111-2222-3333-4444-555555555555"
    }
  ]
}
```

### Svarreitir

| Reitur | Uppruni |
|---|---|
| `unitPrice` | Raw price-list `Unit Price`. |
| `unitPriceExclVAT` / `unitPriceInclVAT` | Derived via `Price Calculation`: excludes/includes VAT according til the price-list line. |
| `vatPct` | úr `VAT Posting Setup` fyrir the resolved VAT Bus./Prod. groups. |
| `startingDate` / `endingDate` | Emitted aðeins þegar the price-list line specifies validity dates. |

þegar a viðskiptamanni er supplied, the lines come úr `Sales Price Buffer.AddBestPriceForCustomer`. án a viðskiptamanni, lines come úr `PopulateFromQuery` (extended price calc enabled) eða `AddItemCardPrice` (legacy).

## Dæmi (úr einingaprófum)

úr `Item Price Calculation Tests` (`test/test/Sales/ItemPriceCalculationTests.Codeunit.al`) — covers single vöru, multi-vöru via `tableView`, með/án viðskiptamanni, quantity tiers, variants, og the VAT/posting-group validation Villur below.

## Villur

| Villa | Orsök |
|---|---|
| `No items found matching the specified criteria.` | `FindItemRange` produced an empty set. |
| `VAT Bus. Posting Gr. (Price) must have a value in Sales & Receivables Setup.` | `Sales & Receivables Setup."VAT Bus. Posting Gr. (Price)"` er blank — pricing getur ekki be evaluated. |
| `Customer not found or invalid. Please provide a valid customerNo, customerId, customerRecordId, or customerSystemId in the request.` | viðskiptamanni key was supplied but did ekki match a `Customer` færsla. |
| `Customer {no} must have a VAT Bus. Posting Group.` | Resolved viðskiptamanni er vantar `VAT Bus. Posting Group`. |
| `Customer {no} must have a Gen. Bus. Posting Group.` | Resolved viðskiptamanni er vantar `Gen. Bus. Posting Group`. |
| `Customer {no} must have a Customer Posting Group.` | Resolved viðskiptamanni er vantar `Customer Posting Group`. |

## Tengdar skilaboðategundir

- `Item.Availability.Get` — availability of the sama vöru set.
- `Customer.SalesHistory.Get` — items recently sold til a viðskiptamanni.

## Villur og viðvaranir
Villur og viðvaranir fylgja sameiginlega sniðinu - sjá [Villur og viðvaranir](/foundation/reference/errors/).

