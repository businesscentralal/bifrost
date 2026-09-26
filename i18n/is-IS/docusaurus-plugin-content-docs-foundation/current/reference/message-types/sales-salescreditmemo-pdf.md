---
id: sales-salescreditmemo-pdf
title: "Sales.SalesCreditMemo.Pdf"
sidebar_label: "Sales.SalesCreditMemo.Pdf"
sidebar_position: 130
description: "Beiðni- og svarsamningur fyrir Sales.SalesCreditMemo.Pdf Bifröst skilaboðategund."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálparkóða skilaboðategundarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálparkóðanum í forritinu, ekki þessari skrá.
:::


## Yfirlit

Renders a posted Sales Credit Memo as PDF using the viðskiptamanni-specific BC Report Selection (`S.Cr.Memo` usage). The PDF bytes eru returned inline in Svarið body.

**Stefna**: Útgående (lesa-aðeins)  **Efnisgerð**: `application/pdf`

## Forgangsröð auðkenna

fyrsta non-empty wins. Subject er mandatory eftir resolution.
1. `subject` envelope attribute — GUID = `Sales Cr.Memo Header.SystemId`, otherwise `No.`.
2. `data.creditMemoNo` / `data.creditMemoId`.
3. `data.documentNo` / `data.documentId` (generic aliases).

## Beiðnibreytur

| Færibreyta | Gerð | áskilið | Athugasemdir |
|---|---|---|---|
| `creditMemoNo` | strengur | Sjá above | Sales Cr.Memo Header `No.`. |
| `creditMemoId` | GUID | Sjá above | Sales Cr.Memo Header `SystemId`. |
| `documentNo` / `documentId` | strengur / GUID | Sjá above | Generic aliases. |

### Dæmi um beiðni
```json
{ "creditMemoNo": "PS-CM103001" }
```

## Response

Binary PDF content. No JSON envelope — bytes come úr `ReportSelections.GetPdfReportForCust` using `Sell-to Customer No.` of the credit memo.

## Dæmi (úr einingaprófum)

úr `Sales Document PDF Tests` (`test/test/Sales/SalesDocumentPDFTests.Codeunit.al`) — verifies Svarið er a non-empty PDF blob með `%PDF` header fyrir credit memos identified með `No.`, `SystemId`, og the generic aliases.

## Villur

| Villa | Orsök |
|---|---|
| `Subject parameter is required. Provide the credit memo number or SystemId.` | Subject was blank eftir resolution. |
| `Sales Credit Memo {subject} not found.` | No `Sales Cr.Memo Header` matched. |
| BC report selection Villur | Bubble up úr `ReportSelections.GetPdfReportForCust` (e.g. no report defined fyrir usage `S.Cr.Memo`). |

## Tengdar skilaboðategundir

- `Sales.SalesInvoice.Pdf` — posted Sales reikningur PDF.
- `Sales.ReturnReceipt.Pdf` — posted Return Receipt PDF.
- `Sales.SalesShipment.Pdf` — posted Sales Shipment PDF.

## Villur og viðvaranir
Villur og viðvaranir fylgja sameiginlega sniðinu - sjá [Villur og viðvaranir](/foundation/reference/errors/).

