---
id: sales-salescreditmemo-pdf
title: "Sales.SalesCreditMemo.Pdf"
sidebar_label: "Sales.SalesCreditMemo.Pdf"
sidebar_position: 130
description: "Request and response contract for the Sales.SalesCreditMemo.Pdf Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


## Overview

Renders a posted Sales Credit Memo as PDF using the customer-specific BC Report Selection (`S.Cr.Memo` usage). The PDF bytes are returned inline in the response body.

**Direction**: Outbound (read-only)  **Content-Type**: `application/pdf`

## Identifier Resolution Order

First non-empty wins. Subject is mandatory after resolution.
1. `subject` envelope attribute — GUID = `Sales Cr.Memo Header.SystemId`, otherwise `No.`.
2. `data.creditMemoNo` / `data.creditMemoId`.
3. `data.documentNo` / `data.documentId` (generic aliases).

## Request Parameters

| Parameter | Type | Required | Notes |
|---|---|---|---|
| `creditMemoNo` | string | See above | Sales Cr.Memo Header `No.`. |
| `creditMemoId` | GUID | See above | Sales Cr.Memo Header `SystemId`. |
| `documentNo` / `documentId` | string / GUID | See above | Generic aliases. |

### Request Example
```json
{ "creditMemoNo": "PS-CM103001" }
```

## Response

Binary PDF content. No JSON envelope — bytes come from `ReportSelections.GetPdfReportForCust` using `Sell-to Customer No.` of the credit memo.

## Examples (from unit tests)

From `Sales Document PDF Tests` (`test/test/Sales/SalesDocumentPDFTests.Codeunit.al`) — verifies the response is a non-empty PDF blob with `%PDF` header for credit memos identified by `No.`, `SystemId`, and the generic aliases.

## Errors

| Error | Cause |
|---|---|
| `Subject parameter is required. Provide the credit memo number or SystemId.` | Subject was blank after resolution. |
| `Sales Credit Memo {subject} not found.` | No `Sales Cr.Memo Header` matched. |
| BC report selection errors | Bubble up from `ReportSelections.GetPdfReportForCust` (e.g. no report defined for usage `S.Cr.Memo`). |

## Related Message Types

- `Sales.SalesInvoice.Pdf` — posted Sales Invoice PDF.
- `Sales.ReturnReceipt.Pdf` — posted Return Receipt PDF.
- `Sales.SalesShipment.Pdf` — posted Sales Shipment PDF.

