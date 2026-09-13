---
id: purchase-blanketorder-makeorder
title: "Purchase.BlanketOrder.MakeOrder"
sidebar_label: "Purchase.BlanketOrder.MakeOrder"
sidebar_position: 108
description: "Beiðni- og svarsamningur fyrir Purchase.BlanketOrder.MakeOrder Bifröst skilaboðategund."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálparkóða skilaboðategundarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálparkóðanum í forritinu, ekki þessari skrá.
:::


## Yfirlit

Converts a Purchase Blanket Order í a Purchase Order using BC codeunit `97 "Blanket Purch. Order to Order"`.
The blanket order er preserved; aðeins the lines flagged fyrir conversion eru turned í a ný Purchase Order.

**Stefna**: Innkomandi (state change)  **Efnisgerð**: `text/json`

## Athugasemdir um endurtekningar og öryggi

- ekki endurtekningarþolið: hver call Býr til a ný Purchase Order fyrir the convertible lines on the blanket order.
- The header verður að be of skjal Gerð `Blanket Order`. Other types eru rejected með an Villa.
- BC requires at least one line með `Qty. to Receive` (eða equivalent) > 0; otherwise the conversion Villur.

## Subject Identification Order

sama as other Purchase skjal message types (via `FindPurchaseHeader`).

## Beiðnibreytur

| Færibreyta | Gerð | áskilið | Athugasemdir |
|---|---|---|---|
| `subject` | strengur/GUID | valfrjálst | Blanket Order `No.` eða `Purchase Header.SystemId`. |
| `systemId` / `recordSystemId` / `id` | GUID | Sjá above | `Purchase Header.SystemId` of the blanket order. |
| `blanketOrderNo` | strengur | Sjá above | Typed `No.` lookup fyrir a Purchase Blanket Order. |

### Dæmi um beiðni
```json
{
  "specversion": "1.0",
  "type": "Purchase.BlanketOrder.MakeOrder",
  "source": "MyApp",
  "subject": "PBO-001"
}
```

## Uppbygging svars

### Tókst
```json
{
  "status": "Success",
  "blanketOrderNo": "PBO-001",
  "orderNo": "PO-002",
  "orderSystemId": "a1b2c3d4-1234-1234-1234-123456789012",
  "vendorNo": "10000",
  "vendorName": "Fabrikam, Inc.",
  "documentDate": "2026-01-15",
  "orderDate": "2026-01-15"
}
```

### Mistókst
```json
{ "status": "Error", "error": "...", "callstack": "..." }
```

### Svarreitir

| Reitur | Uppruni |
|---|---|
| `blanketOrderNo` | Original Purchase Blanket Order `No.`. |
| `orderNo` | ný Purchase Order `No.` returned með `GetPurchOrderHeader`. |
| `orderSystemId` | ný Purchase Order `SystemId`. |
| `vendorNo` | Buy-úr birgi No. copied úr the ný Purchase Order header. |
| `vendorName` | Buy-úr birgi Heiti copied úr the ný Purchase Order header. |
| `documentDate` | skjal dagsetning on the ný Purchase Order (Format 0,9). |
| `orderDate` | Order dagsetning on the ný Purchase Order (Format 0,9). |

## Qty. til Receive Behaviour

BC aðeins converts lines where `Qty. to Receive > 0`. þegar you add a Purchase Line með a `Quantity`, BC automatically Stillir `Qty. to Receive = Quantity` með Sjálfgefið — so freshly created lines eru immediately convertible án additional setup. eftir conversion, the blanket order line's `Qty. to Receive` er reset til 0 og `Quantity Received` increases. til create another release order úr the sama blanket line, set `Qty. to Receive` again via `Data.Records.Set` áður en calling `Purchase.BlanketOrder.MakeOrder` a second time.

## Villur

| Villa | Orsök |
|---|---|
| skjal identifier vantar | `FindPurchaseHeader` could ekki resolve a header. |
| `Purchase document {no} is not a Blanket Order (actual type: ...).` | skjal Gerð er ekki `Blanket Order`. |
| `Nothing to create` eða related | No lines have a Qty. til Receive > 0. |
| BC conversion Villur | Bubble up úr `Blanket Purch. Order to Order`. |

## Tengdar skilaboðategundir

- `Purchase.Document.Create` — create the blanket order fyrsta.
- `Purchase.Quote.MakeOrder` — analogous conversion úr a quote.
- `Purchase.Document.Release` / `Purchase.Document.Post` — next steps on the resulting order.

