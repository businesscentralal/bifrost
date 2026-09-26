---
id: sales-document-statistics
title: "Sales.Document.Statistics"
sidebar_label: "Sales.Document.Statistics"
sidebar_position: 127
description: "Request and response contract for the Sales.Document.Statistics Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


## Overview

Computes header totals and VAT breakdown for an unposted Sales Header — the same numbers shown in the BC Statistics page. Uses `Sales Line.CalcVATAmountLines(QtyType::General, ...)` and rounds via `Currency."Amount Rounding Precision"`.

**Direction**: Outbound (read-only)  **Content-Type**: `text/json`

## Subject Identification Order

Same as `Sales.Document.Release` (via `FindSalesHeader`).

## Request Parameters

| Parameter | Type | Required | Notes |
|---|---|---|---|
| `systemId` / `recordSystemId` / `id` | GUID | See above | `Sales Header.SystemId`. |
| `orderNo` / `quoteNo` / `invoiceNo` / `creditMemoNo` / `blanketOrderNo` / `returnOrderNo` | string | See above | Typed `No.` lookup. |

### Request Example
```json
{ "orderNo": "PS-ORD103001" }
```

## Response Shape

### Success
```json
{
  "status": "Success",
  "documentType": "Order",
  "documentNo": "PS-ORD103001",
  "customerNo": "10000",
  "customerName": "Adatum Corporation",
  "currencyCode": "EUR",
  "documentDate": "2026-01-15",
  "order": {
    "amount": 5000.00,
    "lineDiscountAmount": 100.00,
    "invoiceDiscountAmount": 50.00,
    "totalExclVAT": 4850.00,
    "vatAmount": 1164.00,
    "totalInclVAT": 6014.00,
    "quantity": 10,
    "totalWeight": 25.5,
    "totalVolume": 0.4,
    "noOfVATLines": 1
  },
  "vat_totals": [
    {
      "vatIdentifier": "VAT24",
      "vatPct": 24,
      "lineAmount": 5000.00,
      "vatBase": 4850.00,
      "vatAmount": 1164.00,
      "amountInclVAT": 6014.00
    }
  ]
}
```

### Response Fields

| Field | Source |
|---|---|
| `currencyCode` | `Sales Header."Currency Code"`, or `General Ledger Setup."LCY Code"` when blank. |
| `documentDate` | `Sales Header."Order Date"`. |
| `totalWeight` / `totalVolume` | Sum of `(Gross Weight × Quantity)` / `(Unit Volume × Quantity)` across lines. |
| `vat_totals` | One entry per `VAT Amount Line` (per VAT Identifier). |

## Examples (from unit tests)

From `Sales Doc Statistics Tests` (`test/test/Sales/SalesDocStatisticsTests.Codeunit.al`) — covers totals for Order/Invoice/Credit Memo/Return Order/Blanket Order/Quote, multi-VAT-rate lines, line and invoice discounts, and FCY headers.

## Errors

| Error | Cause |
|---|---|
| `Sales Header identifier is missing. Pass it as the subject, or as one of: systemId, recordSystemId, id, orderNo, quoteNo, invoiceNo, creditMemoNo, blanketOrderNo, returnOrderNo.` (`MissingParameter`) | No identifier in `subject` or the request JSON. |
| `Sales Header "{value}" was not found (from {subject or key}).` (`RecordNotFound`) | An identifier was given but matches no record; `parameter` and `received` name it. Every identifier supplied is tried. |
| `Sales Header "{value}" matches more than one document. Pass it as one of: {keys}.` (`AmbiguousRecord`) | A plain subject matches several document types; send it in the key of the type you mean. |
| `The identifiers in {a} and {b} point to different records.` (`ConflictingIdentifiers`) | Two identifiers were given that resolve to different records. |
| `"{value}" is not a valid GUID` / `integer` `(from {key}).` (`InvalidParameterFormat`) | A SystemId or entry number that cannot be read. |

## Related Message Types

- `Sales.Document.PreviewPost` — predicted G/L impact of posting.
- `Data.Records.Get` — raw `Sales Header` and `Sales Line` records.

## Errors and warnings
Errors and warnings follow the shared shape - see [Errors and warnings](/foundation/reference/errors/).

