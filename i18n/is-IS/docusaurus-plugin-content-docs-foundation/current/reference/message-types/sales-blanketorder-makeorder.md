---
id: sales-blanketorder-makeorder
title: "Sales.BlanketOrder.MakeOrder"
sidebar_label: "Sales.BlanketOrder.MakeOrder"
sidebar_position: 121
description: "Beiðni- og svarsamningur fyrir Sales.BlanketOrder.MakeOrder Bifröst skilaboðategund."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálparkóða skilaboðategundarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálparkóðanum í forritinu, ekki þessari skrá.
:::


## Yfirlit

Converts a Sales Blanket Order í a Sales Order using BC codeunit `87 "Blanket Sales Order to Order"`.
The blanket order er preserved; aðeins the lines flagged fyrir conversion eru turned í a ný Sales Order.

**Stefna**: Innkomandi (state change)  **Efnisgerð**: `text/json`

## Athugasemdir um endurtekningar og öryggi

- ekki endurtekningarþolið: hver call Býr til a ný Sales Order fyrir the convertible lines on the blanket order.
- The header verður að be of skjal Gerð `Blanket Order`. Other types eru rejected með an Villa.
- BC requires at least one line með `Qty. to Ship` (eða equivalent) > 0; otherwise the conversion Villur.

## Subject Identification Order

sama as other Sales skjal message types (via `FindSalesHeader`).

## Beiðnibreytur

| Færibreyta | Gerð | áskilið | Athugasemdir |
|---|---|---|---|
| `subject` | strengur/GUID | valfrjálst | Blanket Order `No.` eða `Sales Header.SystemId`. |
| `systemId` / `recordSystemId` / `id` | GUID | Sjá above | `Sales Header.SystemId` of the blanket order. |
| `blanketOrderNo` | strengur | Sjá above | Typed `No.` lookup fyrir a Sales Blanket Order. |

### Dæmi um beiðni
```json
{
  "specversion": "1.0",
  "type": "Sales.BlanketOrder.MakeOrder",
  "source": "MyApp",
  "subject": "SBO-001"
}
```

## Uppbygging svars

### Tókst
```json
{
  "status": "Success",
  "blanketOrderNo": "SBO-001",
  "orderNo": "SO-002",
  "orderSystemId": "a1b2c3d4-1234-1234-1234-123456789012",
  "customerNo": "10000",
  "customerName": "Adatum Corporation",
  "documentDate": "2026-01-15",
  "orderDate": "2026-01-15"
}
```

### Mistókst
```json
{ "status": "Error", "code": "BusinessCentralError", "error": "...", "hint": "..." }
```

### Svarreitir

| Reitur | Uppruni |
|---|---|
| `blanketOrderNo` | Original Sales Blanket Order `No.`. |
| `orderNo` | ný Sales Order `No.` returned með `GetSalesOrderHeader`. |
| `orderSystemId` | ný Sales Order `SystemId`. |
| `customerNo` | Sell-til viðskiptamanni No. copied úr the ný Sales Order header. |
| `customerName` | Sell-til viðskiptamanni Heiti copied úr the ný Sales Order header. |
| `documentDate` | skjal dagsetning on the ný Sales Order (Format 0,9). |
| `orderDate` | Order dagsetning on the ný Sales Order (Format 0,9). |

## Qty. til Ship Behaviour

BC aðeins converts lines where `Qty. to Ship > 0`. þegar you add a Sales Line með a `Quantity`, BC automatically Stillir `Qty. to Ship = Quantity` með Sjálfgefið — so freshly created lines eru immediately convertible án additional setup. eftir conversion, the blanket order line's `Qty. to Ship` er reset til 0 og `Quantity Shipped` increases. til create another release order úr the sama blanket line, set `Qty. to Ship` again via `Data.Records.Set` áður en calling `Sales.BlanketOrder.MakeOrder` a second time.

## Villur

| Villa | Orsök |
|---|---|
| skjal identifier vantar | `FindSalesHeader` could ekki resolve a header. |
| `Sales document {no} is not a Blanket Order (actual type: ...).` | skjal Gerð er ekki `Blanket Order`. |
| `Nothing to create` eða related | No lines have a Qty. til Ship > 0; set up lines fyrsta. |
| BC conversion Villur | Bubble up úr `Blanket Sales Order to Order`. |

## Tengdar skilaboðategundir

- `Sales.Document.Create` — create the blanket order fyrsta.
- `Sales.Quote.MakeOrder` — analogous conversion úr a quote.
- `Sales.Document.Release` / `Sales.Document.Post` — next steps on the resulting order.

## Villur og viðvaranir
Villur og viðvaranir fylgja sameiginlega sniðinu - sjá [Villur og viðvaranir](/foundation/reference/errors/).

