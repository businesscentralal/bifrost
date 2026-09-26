---
id: purchase-quote-makeorder
title: "Purchase.Quote.MakeOrder"
sidebar_label: "Purchase.Quote.MakeOrder"
sidebar_position: 117
description: "Beiðni- og svarsamningur fyrir Purchase.Quote.MakeOrder Bifröst skilaboðategund."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálparkóða skilaboðategundarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálparkóðanum í forritinu, ekki þessari skrá.
:::


## Yfirlit

Converts a Purchase Quote í a Purchase Order using BC codeunit `96 "Purch.-Quote to Order"`.
The Uppruni quote er consumed með the BC conversion routine og a ný Purchase Order header er created.

**Stefna**: Innkomandi (state change)  **Efnisgerð**: `text/json`

## Athugasemdir um endurtekningar og öryggi

- ekki endurtekningarþolið: once converted, the original quote no longer exists, so retrying með the sama `quoteNo` Skilar an Villa.
- The header verður að be of skjal Gerð `Quote`. Other types eru rejected með an Villa.

## Subject Identification Order

sama as other Purchase skjal message types (via `FindPurchaseHeader`).

## Beiðnibreytur

| Færibreyta | Gerð | áskilið | Athugasemdir |
|---|---|---|---|
| `subject` | strengur/GUID | valfrjálst | Quote `No.` eða `Purchase Header.SystemId`. |
| `systemId` / `recordSystemId` / `id` | GUID | Sjá above | `Purchase Header.SystemId` of the quote. |
| `quoteNo` | strengur | Sjá above | Typed `No.` lookup fyrir a Purchase Quote. |

### Dæmi um beiðni
```json
{
  "specversion": "1.0",
  "type": "Purchase.Quote.MakeOrder",
  "source": "MyApp",
  "subject": "PQ-001"
}
```

## Uppbygging svars

### Tókst
```json
{
  "status": "Success",
  "quoteNo": "PQ-001",
  "orderNo": "PO-001",
  "orderSystemId": "a1b2c3d4-1234-1234-1234-123456789012",
  "vendorNo": "10000",
  "vendorName": "Fabrikam, Inc.",
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
| `quoteNo` | Original Purchase Quote `No.` áður en conversion. |
| `orderNo` | ný Purchase Order `No.` returned með `GetPurchOrderHeader`. |
| `orderSystemId` | ný Purchase Order `SystemId`. |

## Villur

| Villa | Orsök |
|---|---|
| skjal identifier vantar | `FindPurchaseHeader` could ekki resolve a header. |
| `Purchase document {no} is not a Quote (actual type: ...).` | skjal Gerð er ekki `Quote`. |
| BC conversion Villur | Bubble up úr `Purch.-Quote to Order` (e.g., vantar birgi data). |

## Tengdar skilaboðategundir

- `Purchase.Document.Create` — create the quote fyrsta.
- `Purchase.BlanketOrder.MakeOrder` — analogous conversion úr a blanket order.
- `Purchase.Document.Release` / `Purchase.Document.Post` — next steps on the resulting order.

## Villur og viðvaranir
Villur og viðvaranir fylgja sameiginlega sniðinu - sjá [Villur og viðvaranir](/foundation/reference/errors/).

