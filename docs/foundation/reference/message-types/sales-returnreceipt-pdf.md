---
id: sales-returnreceipt-pdf
title: "Sales.ReturnReceipt.Pdf"
sidebar_label: "Sales.ReturnReceipt.Pdf"
sidebar_position: 129
description: "Request and response contract for the Sales.ReturnReceipt.Pdf Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


## Overview

Renders a posted Return Receipt as PDF using the customer-specific BC Report Selection (`S.Ret.Rcpt.` usage). The PDF bytes are returned inline in the response body.

**Direction**: Outbound (read-only)  **Content-Type**: `application/pdf`

## Identifier Resolution Order

First non-empty wins. Subject is mandatory after resolution.
1. `subject` envelope attribute — GUID = `Return Receipt Header.SystemId`, otherwise `No.`.
2. `data.returnReceiptNo` / `data.returnReceiptId`.
3. `data.documentNo` / `data.documentId` (generic aliases).

## Request Parameters

| Parameter | Type | Required | Notes |
|---|---|---|---|
| `returnReceiptNo` | string | See above | Return Receipt Header `No.`. |
| `returnReceiptId` | GUID | See above | Return Receipt Header `SystemId`. |
| `documentNo` / `documentId` | string / GUID | See above | Generic aliases. |

### Request Example
```json
{ "returnReceiptNo": "PS-RR103001" }
```

## Response

Binary PDF content. No JSON envelope — bytes come from `ReportSelections.GetPdfReportForCust` using `Sell-to Customer No.` of the return receipt.

## Examples (from unit tests)

From `Sales Document PDF Tests` (`test/test/Sales/SalesDocumentPDFTests.Codeunit.al`) — verifies the response is a non-empty PDF blob with `%PDF` header for return receipts identified by `No.`, `SystemId`, and the generic aliases.

## Errors

| Error | Cause |
|---|---|
| `Subject parameter is required. Provide the return receipt number or SystemId.` | Subject was blank after resolution. |
| `Return Receipt {subject} not found.` | No `Return Receipt Header` matched. |
| BC report selection errors | Bubble up from `ReportSelections.GetPdfReportForCust` (e.g. no report defined for usage `S.Ret.Rcpt.`). |

## Related Message Types

- `Sales.SalesCreditMemo.Pdf` — posted Sales Credit Memo PDF.
- `Sales.SalesInvoice.Pdf` — posted Sales Invoice PDF.
- `Sales.SalesShipment.Pdf` — posted Sales Shipment PDF.

