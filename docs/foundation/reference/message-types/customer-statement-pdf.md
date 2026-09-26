---
id: customer-statement-pdf
title: "Customer.Statement.Pdf"
sidebar_label: "Customer.Statement.Pdf"
sidebar_position: 13
description: "Request and response contract for the Customer.Statement.Pdf Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


## Overview

Renders a Customer Statement as PDF via the BC standard `Standard Statement` report (saved with last-used request page parameters). The active implementation is resolved from `Bifrost Setup.Customer Statement Implementation` — default is `Standard Statement Impl` (codeunit 65359).

**Direction**: Both (writes on generation)  **Content-Type**: `application/pdf`

## Side effects

Writes: `Customer."Last Statement No."` is incremented (Report 1316 `Standard Statement`, `OnPostReport`). This call is not side-effect free despite returning a document. Out-of-box behavior; a custom statement implementation may differ.

## Identifier Resolution Order

1. `subject` envelope attribute — GUID = `Customer.SystemId`, otherwise `No.`.
2. `data.customerNo` / `data.customerId` — assigned to Subject during request parsing.

Subject is mandatory after resolution.

## Request Parameters

| Parameter | Type | Required | Notes |
|---|---|---|---|
| `customerNo` | string | See above | Customer `No.` (Code[20]). |
| `customerId` | GUID | See above | Customer `SystemId`. |
| `startDate` | date | No | ISO 8601 (format 9). Default: `today - 30 days`. Invalid value falls back to default. |
| `endDate` | date | No | ISO 8601 (format 9). Default: `today`. Invalid value falls back to default. |
| `dateChoice` | string | No | `"Due Date"` (default) or `"Posting Date"` — controls which date drives statement aging. Comparison is case-insensitive and `"postingdate"` (no space) is also accepted. |

### Request Example
```json
{
  "customerNo": "10000",
  "startDate": "2026-01-01",
  "endDate": "2026-01-31",
  "dateChoice": "Posting Date"
}
```

## Response

Binary PDF content. No JSON envelope. The PDF includes overdue entries, open entries, applied entries, and aging bands per the `Standard Statement` defaults (`PrintEntriesNotDue=true, PrintAllHavingEntries=true, PrintAllHavingBalance=true, PrintReversedEntries=true`).

## Configuration

`Bifrost Setup.Customer Statement Implementation` selects the implementation. Replace the default by adding a value to the `Customer Statement Type` enum implementing the `Customer Statement` interface.

## Examples (from unit tests)

From `Customer Statement PDF Tests` (`test/test/Sales/CustomerStatementPDFTests.Codeunit.al`) — covers subject by customer No., by SystemId, and the `customerNo` / `customerId` aliases with optional date range and `dateChoice`. Asserts the response is a non-empty PDF blob with the `%PDF` header.

## Errors

| Error | Cause |
|---|---|
| `Subject parameter is required. Provide the customer number or SystemId.` | Subject was blank after resolution. |
| `Customer {subject} not found.` | No `Customer` matched the supplied `No.` or `SystemId`. |
| `Invalid date range: start date {start} must be before or equal to end date {end}.` | `startDate` is after `endDate`. |

## Related Message Types

- `Customer.CreditLimit.Get` — credit exposure for the same customer.
- `Customer.SalesHistory.Get` — sales-by-item history.
- `Sales.SalesInvoice.Pdf` — individual posted invoice PDF.

## Errors and warnings
Errors and warnings follow the shared shape - see [Errors and warnings](/foundation/reference/errors/).

