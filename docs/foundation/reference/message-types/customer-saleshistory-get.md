---
id: customer-saleshistory-get
title: "Customer.SalesHistory.Get"
sidebar_label: "Customer.SalesHistory.Get"
sidebar_position: 12
description: "Request and response contract for the Customer.SalesHistory.Get Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


## Overview

Returns the items a customer has ordered in a given date range, aggregated per item/variant/UoM via the `Customer Sales History` query.

**Direction**: Outbound (read-only)  **Content-Type**: `application/json`

Note: this implementation sets `Content Type` to `application/json` rather than the `text/json` value used by most other message types.

## Identifier Resolution Order

1. `subject` envelope attribute — GUID = `Customer.SystemId`, otherwise `No.`.
2. `data.customerNo` (alias).

## Request Parameters

| Parameter | Type | Required | Notes |
|---|---|---|---|
| `customerNo` | string | Yes (or via subject) | Customer `No.`. |
| `fromDate` | date | Yes | Format 9 (ISO 8601). Lower bound on `Sales Invoice Line."Posting Date"`. |
| `toDate` | date | No | Default: `Today`. Upper bound on posting date. |

### Request Example
```json
{
  "customerNo": "10000",
  "fromDate": "2025-01-01",
  "toDate": "2025-12-31"
}
```

## Response Shape

### Success
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

### Response Fields

| Field | Source |
|---|---|
| `noOfOrders` | Count of distinct invoice lines for the item in range (from the query, not unique sales orders). |
| `baseUOMDescription` | `Unit of Measure.Description` for the item base UoM (looked up per row). |

## Examples (from unit tests)

From `Customer Sales History Tests` (`test/test/Sales/CustomerSalesHistoryTests.Codeunit.al`) — covers subject by customer No., JSON `customerNo`, default `toDate`, missing required parameter, and customer-not-found.

## Errors

| Error | Cause |
|---|---|
| `Required parameter "fromDate" is missing.` | `fromDate` not supplied (or unparseable). |
| `Customer {no} not found.` | No `Customer` matched the supplied identifier. |

## Related Message Types

- `Customer.CreditLimit.Get` — credit exposure for the same customer.
- `Customer.Statement.Pdf` — customer statement PDF.
- `Item.Price.Get` — current pricing for the items returned here.

