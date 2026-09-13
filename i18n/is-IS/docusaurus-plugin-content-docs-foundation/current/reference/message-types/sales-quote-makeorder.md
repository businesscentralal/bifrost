---
id: sales-quote-makeorder
title: "Sales.Quote.MakeOrder"
sidebar_label: "Sales.Quote.MakeOrder"
sidebar_position: 128
description: "Beiðni- og svarsamningur fyrir Sales.Quote.MakeOrder Bifröst skilaboðategund."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálparkóða skilaboðategundarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálparkóðanum í forritinu, ekki þessari skrá.
:::


## Yfirlit

Converts a Sales Quote í a Sales Order using BC codeunit `86 "Sales-Quote to Order"`.
The Uppruni quote er consumed með the BC conversion routine (deleted með Sjálfgefið per BC behaviour) og a ný Sales Order header er created.

**Stefna**: Innkomandi (state change)  **Efnisgerð**: `text/json`

## Athugasemdir um endurtekningar og öryggi

- ekki endurtekningarþolið: once converted, the original quote no longer exists, so retrying með the sama `quoteNo` Skilar an Villa.
- The header verður að be of skjal Gerð `Quote`. Other types eru rejected með an Villa.

## Subject Identification Order

sama as other Sales skjal message types (via `FindSalesHeader`).

## Beiðnibreytur

| Færibreyta | Gerð | áskilið | Athugasemdir |
|---|---|---|---|
| `subject` | strengur/GUID | valfrjálst | Quote `No.` (plain text) eða `Sales Header.SystemId` (GUID). |
| `systemId` / `recordSystemId` / `id` | GUID | Sjá above | `Sales Header.SystemId` of the quote. |
| `quoteNo` | strengur | Sjá above | Typed `No.` lookup fyrir a Sales Quote. |

### Dæmi um beiðni
```json
{
  "specversion": "1.0",
  "type": "Sales.Quote.MakeOrder",
  "source": "MyApp",
  "subject": "SQ-001"
}
```

## Uppbygging svars

### Tókst
```json
{
  "status": "Success",
  "quoteNo": "SQ-001",
  "orderNo": "SO-001",
  "orderSystemId": "a1b2c3d4-1234-1234-1234-123456789012",
  "customerNo": "10000",
  "customerName": "Adatum Corporation",
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
| `quoteNo` | Original Sales Quote `No.` áður en conversion. |
| `orderNo` | ný Sales Order `No.` returned með `GetSalesOrderHeader`. |
| `orderSystemId` | ný Sales Order `SystemId` (nota til retrieve the order via `Data.Records.Get`). |
| `customerNo` / `customerName` | Copied úr the ný Sales Order header. |

## Villur

| Villa | Orsök |
|---|---|
| skjal identifier vantar | `FindSalesHeader` could ekki resolve a header. |
| `Sales document {no} is not a Quote (actual type: ...).` | skjal Gerð er ekki `Quote`. |
| BC conversion Villur | Bubble up úr `Sales-Quote to Order` (e.g., vantar viðskiptamanni data, blocked items). |

## Tengdar skilaboðategundir

- `Sales.Document.Create` — create the quote fyrsta.
- `Sales.BlanketOrder.MakeOrder` — analogous conversion úr a blanket order.
- `Sales.Document.Release` / `Sales.Document.Post` — next steps on the resulting order.

