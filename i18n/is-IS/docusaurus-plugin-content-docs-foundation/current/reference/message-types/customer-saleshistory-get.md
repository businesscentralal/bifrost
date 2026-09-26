---
id: customer-saleshistory-get
title: "Customer.SalesHistory.Get"
sidebar_label: "Customer.SalesHistory.Get"
sidebar_position: 12
description: "Beiðni- og svarsamningur fyrir Customer.SalesHistory.Get Bifröst skilaboðategund."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálparkóða skilaboðategundarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálparkóðanum í forritinu, ekki þessari skrá.
:::


## Yfirlit

Skilar the items a viðskiptamanni has ordered in a given dagsetning range, aggregated per vöru/variant/UoM via the `Customer Sales History` query.

**Stefna**: Útgående (lesa-aðeins)  **Efnisgerð**: `application/json`

Note: this implementation Stillir `Content Type` til `application/json` rather than the `text/json` Gildi notað með most other message types.

## Forgangsröð auðkenna

1. `subject` envelope attribute — GUID = `Customer.SystemId`, otherwise `No.`.
2. `data.customerNo` (alias).

## Beiðnibreytur

| Færibreyta | Gerð | áskilið | Athugasemdir |
|---|---|---|---|
| `customerNo` | strengur | Yes (eða via subject) | viðskiptamanni `No.`. |
| `fromDate` | dagsetning | Yes | Format 9 (ISO 8601). Lower bound on `Sales Invoice Line."Posting Date"`. |
| `toDate` | dagsetning | No | Sjálfgefið: `Today`. Upper bound on posting dagsetning. |

### Dæmi um beiðni
```json
{
  "customerNo": "10000",
  "fromDate": "2025-01-01",
  "toDate": "2025-12-31"
}
```

## Uppbygging svars

### Tókst
```json
{
  "status": "Success",
  "noOfRecords": 2,
  "customerNo": "10000",
  "customerName": "Adatum Corporation",
  "fromDate": "2025-01-01",
  "toDate": "2025-12-31",
  "salesHistory": [
    {
      "itemNo": "1896-S",
      "variantCode": "",
      "description": "ATHENS Desk",
      "baseUnitOfMeasure": "PCS",
      "baseUOMDescription": "Piece",
      "noOfOrders": 3
    }
  ]
}
```

### Svarreitir

| Reitur | Uppruni |
|---|---|
| `noOfOrders` | Count of distinct reikningur lines fyrir the vöru in range (úr the query, ekki unique sales orders). |
| `baseUOMDescription` | `Unit of Measure.Description` fyrir the vöru base UoM (looked up per row). |

## Dæmi (úr einingaprófum)

úr `Customer Sales History Tests` (`test/test/Sales/CustomerSalesHistoryTests.Codeunit.al`) — covers subject með viðskiptamanni No., JSON `customerNo`, Sjálfgefið `toDate`, vantar áskilið Færibreyta, og viðskiptamanni-ekki-fannst.

## Villur

| Villa | Orsök |
|---|---|
| `Required parameter "fromDate" is missing.` | `fromDate` ekki supplied (eða unparseable). |
| `Customer {no} not found.` | No `Customer` matched the supplied identifier. |

## Tengdar skilaboðategundir

- `Customer.CreditLimit.Get` — credit exposure fyrir the sama viðskiptamanni.
- `Customer.Statement.Pdf` — viðskiptamanni statement PDF.
- `Item.Price.Get` — current pricing fyrir the items returned here.

## Villur og viðvaranir
Villur og viðvaranir fylgja sameiginlega sniðinu - sjá [Villur og viðvaranir](/foundation/reference/errors/).

