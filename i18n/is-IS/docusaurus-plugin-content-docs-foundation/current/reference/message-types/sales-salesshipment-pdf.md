---
id: sales-salesshipment-pdf
title: "Sales.SalesShipment.Pdf"
sidebar_label: "Sales.SalesShipment.Pdf"
sidebar_position: 136
description: "Beiðni- og svarsamningur fyrir Sales.SalesShipment.Pdf Bifröst skilaboðategund."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálparkóða skilaboðategundarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálparkóðanum í forritinu, ekki þessari skrá.
:::


## Yfirlit

Renders a posted Sales Shipment as PDF using the viðskiptamanni-specific BC Report Selection (`S.Shipment` usage). The PDF bytes eru returned inline in Svarið body.

**Stefna**: Útgående (lesa-aðeins)  **Efnisgerð**: `application/pdf`

## Forgangsröð auðkenna

fyrsta non-empty wins. Subject er mandatory eftir resolution.
1. `subject` envelope attribute — GUID = `Sales Shipment Header.SystemId`, otherwise `No.`.
2. `data.shipmentNo` / `data.shipmentId`.
3. `data.documentNo` / `data.documentId` (generic aliases).

## Beiðnibreytur

| Færibreyta | Gerð | áskilið | Athugasemdir |
|---|---|---|---|
| `shipmentNo` | strengur | Sjá above | Sales Shipment Header `No.`. |
| `shipmentId` | GUID | Sjá above | Sales Shipment Header `SystemId`. |
| `documentNo` / `documentId` | strengur / GUID | Sjá above | Generic aliases. |

### Dæmi um beiðni
```json
{ "shipmentNo": "PS-SHIP103001" }
```

## Response

Binary PDF content. No JSON envelope — bytes come úr `ReportSelections.GetPdfReportForCust` using `Sell-to Customer No.` of the shipment.

## Dæmi (úr einingaprófum)

úr `Sales Document PDF Tests` (`test/test/Sales/SalesDocumentPDFTests.Codeunit.al`) — verifies Svarið er a non-empty PDF blob með `%PDF` header fyrir shipments identified með `No.`, `SystemId`, og the generic aliases.

## Villur

| Villa | Orsök |
|---|---|
| `Subject parameter is required. Provide the shipment number or SystemId.` | Subject was blank eftir resolution. |
| `Sales Shipment {subject} not found.` | No `Sales Shipment Header` matched. |
| BC report selection Villur | Bubble up úr `ReportSelections.GetPdfReportForCust` (e.g. no report defined fyrir usage `S.Shipment`). |

## Tengdar skilaboðategundir

- `Sales.SalesInvoice.Pdf` — posted Sales reikningur PDF.
- `Sales.ReturnReceipt.Pdf` — posted Return Receipt PDF.
- `Sales.SalesCreditMemo.Pdf` — posted Sales Credit Memo PDF.

## Villur og viðvaranir
Villur og viðvaranir fylgja sameiginlega sniðinu - sjá [Villur og viðvaranir](/foundation/reference/errors/).

