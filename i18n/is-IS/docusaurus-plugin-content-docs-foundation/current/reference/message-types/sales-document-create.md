---
id: sales-document-create
title: "Sales.Document.Create"
sidebar_label: "Sales.Document.Create"
sidebar_position: 122
description: "Beiðni- og svarsamningur fyrir Sales.Document.Create Bifröst skilaboðategund."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálparkóða skilaboðategundarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálparkóðanum í forritinu, ekki þessari skrá.
:::


## Yfirlit

Býr til a ný (header-aðeins) Sales Header fyrir a given viðskiptamanni og skjal Gerð. The header er `Insert(true)` then validates `Sell-to Customer No.` og `Posting Date`. The full inserted færsla er returned in the `Data.Records.Get` shape so downstream calls getur immediately add lines eða modify fields.

**Stefna**: Innkomandi (state change)  **Efnisgerð**: `text/json`

## Athugasemdir um endurtekningar og öryggi

- ekki endurtekningarþolið: hver call inserts a ný header með a fresh `No.` úr the relevant númer series.
- No lines eru created — nota a follow-up call til add `Sales Line` færslur.

## viðskiptamanni Forgangsröð úrlausnar

Via `Argument.FindCustomer` — Subject fyrsta, then JSON:
1. `subject` — GUID = `Customer.SystemId`, otherwise `Customer.No.`.
2. JSON `no`.
3. JSON `id` / `systemId` / `recordSystemId` — `Customer.SystemId`.

## Beiðnibreytur

| Færibreyta | Gerð | áskilið | Athugasemdir |
|---|---|---|---|
| `documentType` | strengur | **Yes** | One of: `Quote`, `Order`, `Invoice`, `Credit Memo`, `Blanket Order`, `Return Order`. Matched case-insensitively against `Enum::"Sales Document Type".Names()`. |
| viðskiptamanni keys | — | Yes (Subject eða JSON) | Sjá Forgangsröð úrlausnar. |
| `postingDate` | dagsetning | No | Format 9. Sjálfgefið: `WorkDate`. |

### Dæmi um beiðni
```json
{
  "documentType": "Order",
  "no": "10000",
  "postingDate": "2026-01-15"
}
```

## Uppbygging svars

### Tókst

Skilar the inserted Sales Header in `Data.Records.Get` shape — `noOfRecords: 1` með a single `result[]` færsla containing every accessible Reitur (subject til `Bifrost Field Access` skrifa-takmörkun rules).

```json
{
  "status": "Success",
  "noOfRecords": 1,
  "result": [
    {
      "tableName": "Sales Header",
      "tableNo": 36,
      "DocumentType": "Order",
      "No_": "PS-ORD103001",
      "SelltoCustomerNo_": "10000",
      "PostingDate": "2026-01-15"
    }
  ]
}
```

JSON Reitur names follow the standard `RemoveNonAlphaNumericCharacters` rule (e.g. `No.` → `No_`, `Sell-to Customer No.` → `SelltoCustomerNo_`, `Balance (LCY)` → `BalanceLCY`).

## Dæmi (úr einingaprófum)

úr `Sales Document Create Tests` (`test/test/Sales/SalesDocumentCreateTests.Codeunit.al`) — covers hver `documentType` Gildi, viðskiptamanni með `no`/`subject`/SystemId, custom `postingDate`, the vantar-`documentType` Villa og the ógilt-`documentType` Villa.

## Villur

| Villa | Orsök |
|---|---|
| `Customer identifier must be specified in subject field or request JSON (no, id, systemId, recordSystemId).` | `FindCustomer` could ekki resolve a viðskiptamanni. |
| `documentType is required in request JSON. Expected: Quote, Order, Invoice, Credit Memo, Blanket Order, Return Order.` | `documentType` vantar eða empty. |
| `Invalid document type '{value}'. Expected: Quote, Order, Invoice, Credit Memo, Blanket Order, Return Order.` | `documentType` supplied but did ekki match hvaða enum Heiti. |
| BC validation Villur | Bubble up úr header Reitur validation (e.g. blocked viðskiptamanni, ógilt posting dagsetning). |

## Tengdar skilaboðategundir

- `Data.Records.Set` — add `Sales Line` rows til the ný header.
- `Sales.Document.Release` / `Sales.Document.Post` — downstream lifecycle.

