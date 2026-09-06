---
id: sales-salesinvoice-pdf
title: "Sales.SalesInvoice.Pdf"
sidebar_label: "Sales.SalesInvoice.Pdf"
sidebar_position: 134
description: "Request and response contract for the Sales.SalesInvoice.Pdf Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


## Overview

Renders a posted Sales Invoice as PDF using the customer-specific BC Report Selection (`S.Invoice` usage). The PDF bytes are returned inline in the response body.

**Direction**: Outbound (read-only)  **Content-Type**: `application/pdf`

## Identifier Resolution Order

First non-empty wins. Subject is mandatory after resolution — if it is still blank the request errors.
1. `subject` envelope attribute — GUID = `Sales Invoice Header.SystemId`, otherwise `No.`.
2. `data.invoiceNo` / `data.invoiceId`.
3. `data.documentNo` / `data.documentId` (generic aliases).

## Request Parameters

| Parameter | Type | Required | Notes |
|---|---|---|---|
| `invoiceNo` | string | See above | Sales Invoice Header `No.` (Code[20]). |
| `invoiceId` | GUID | See above | Sales Invoice Header `SystemId`. |
| `documentNo` | string | See above | Generic alias for `invoiceNo`. |
| `documentId` | GUID | See above | Generic alias for `invoiceId`. |

### Request Example
```json
{ "invoiceNo": "PS-INV103001" }
```

## Response

Binary PDF content. No JSON envelope — `Content Type` is `application/pdf` and the bytes come from `ReportSelections.GetPdfReportForCust` using the customer of the invoice (`Sell-to Customer No.`) so customer-specific report layouts apply.

## Examples (from unit tests)

From `Sales Document PDF Tests` (`test/test/Sales/SalesDocumentPDFTests.Codeunit.al`) — verifies the response is a non-empty PDF blob with `%PDF` header for posted invoices identified by `No.`, `SystemId`, and the `documentNo`/`documentId` aliases.

## Errors

| Error | Cause |
|---|---|
| `Subject parameter is required. Provide the invoice number or SystemId.` | Subject was blank after resolution. |
| `Sales Invoice {subject} not found.` | No `Sales Invoice Header` matched the supplied `No.` or `SystemId`. |
| BC report selection errors | Bubble up from `ReportSelections.GetPdfReportForCust` (e.g. no report defined for usage `S.Invoice`). |

## Related Message Types

- `Sales.SalesCreditMemo.Pdf` — posted Sales Credit Memo PDF.
- `Sales.SalesShipment.Pdf` — posted Sales Shipment PDF.
- `Sales.ReturnReceipt.Pdf` — posted Return Receipt PDF.
- `Customer.Statement.Pdf` — customer statement PDF.

