---
id: sales-salesshipment-pdf
title: "Sales.SalesShipment.Pdf"
sidebar_label: "Sales.SalesShipment.Pdf"
sidebar_position: 136
description: "Request and response contract for the Sales.SalesShipment.Pdf Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


## Overview

Renders a posted Sales Shipment as PDF using the customer-specific BC Report Selection (`S.Shipment` usage). The PDF bytes are returned inline in the response body.

**Direction**: Outbound (read-only)  **Content-Type**: `application/pdf`

## Identifier Resolution Order

First non-empty wins. Subject is mandatory after resolution.
1. `subject` envelope attribute — GUID = `Sales Shipment Header.SystemId`, otherwise `No.`.
2. `data.shipmentNo` / `data.shipmentId`.
3. `data.documentNo` / `data.documentId` (generic aliases).

## Request Parameters

| Parameter | Type | Required | Notes |
|---|---|---|---|
| `shipmentNo` | string | See above | Sales Shipment Header `No.`. |
| `shipmentId` | GUID | See above | Sales Shipment Header `SystemId`. |
| `documentNo` / `documentId` | string / GUID | See above | Generic aliases. |

### Request Example
```json
{ "shipmentNo": "PS-SHIP103001" }
```

## Response

Binary PDF content. No JSON envelope — bytes come from `ReportSelections.GetPdfReportForCust` using `Sell-to Customer No.` of the shipment.

## Examples (from unit tests)

From `Sales Document PDF Tests` (`test/test/Sales/SalesDocumentPDFTests.Codeunit.al`) — verifies the response is a non-empty PDF blob with `%PDF` header for shipments identified by `No.`, `SystemId`, and the generic aliases.

## Errors

| Error | Cause |
|---|---|
| `Subject parameter is required. Provide the shipment number or SystemId.` | Subject was blank after resolution. |
| `Sales Shipment {subject} not found.` | No `Sales Shipment Header` matched. |
| BC report selection errors | Bubble up from `ReportSelections.GetPdfReportForCust` (e.g. no report defined for usage `S.Shipment`). |

## Related Message Types

- `Sales.SalesInvoice.Pdf` — posted Sales Invoice PDF.
- `Sales.ReturnReceipt.Pdf` — posted Return Receipt PDF.
- `Sales.SalesCreditMemo.Pdf` — posted Sales Credit Memo PDF.

