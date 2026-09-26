---
id: sales-returnreceipt-pdf
title: "Sales.ReturnReceipt.Pdf"
sidebar_label: "Sales.ReturnReceipt.Pdf"
sidebar_position: 129
description: "Beiðni- og svarsamningur fyrir Sales.ReturnReceipt.Pdf Bifröst skilaboðategund."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálparkóða skilaboðategundarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálparkóðanum í forritinu, ekki þessari skrá.
:::


## Yfirlit

Renders a posted Return Receipt as PDF using the viðskiptamanni-specific BC Report Selection (`S.Ret.Rcpt.` usage). The PDF bytes eru returned inline in Svarið body.

**Stefna**: Útgående (lesa-aðeins)  **Efnisgerð**: `application/pdf`

## Forgangsröð auðkenna

fyrsta non-empty wins. Subject er mandatory eftir resolution.
1. `subject` envelope attribute — GUID = `Return Receipt Header.SystemId`, otherwise `No.`.
2. `data.returnReceiptNo` / `data.returnReceiptId`.
3. `data.documentNo` / `data.documentId` (generic aliases).

## Beiðnibreytur

| Færibreyta | Gerð | áskilið | Athugasemdir |
|---|---|---|---|
| `returnReceiptNo` | strengur | Sjá above | Return Receipt Header `No.`. |
| `returnReceiptId` | GUID | Sjá above | Return Receipt Header `SystemId`. |
| `documentNo` / `documentId` | strengur / GUID | Sjá above | Generic aliases. |

### Dæmi um beiðni
```json
{ "returnReceiptNo": "PS-RR103001" }
```

## Response

Binary PDF content. No JSON envelope — bytes come úr `ReportSelections.GetPdfReportForCust` using `Sell-to Customer No.` of the return receipt.

## Dæmi (úr einingaprófum)

úr `Sales Document PDF Tests` (`test/test/Sales/SalesDocumentPDFTests.Codeunit.al`) — verifies Svarið er a non-empty PDF blob með `%PDF` header fyrir return receipts identified með `No.`, `SystemId`, og the generic aliases.

## Villur

| Villa | Orsök |
|---|---|
| `Subject parameter is required. Provide the return receipt number or SystemId.` | Subject was blank eftir resolution. |
| `Return Receipt {subject} not found.` | No `Return Receipt Header` matched. |
| BC report selection Villur | Bubble up úr `ReportSelections.GetPdfReportForCust` (e.g. no report defined fyrir usage `S.Ret.Rcpt.`). |

## Tengdar skilaboðategundir

- `Sales.SalesCreditMemo.Pdf` — posted Sales Credit Memo PDF.
- `Sales.SalesInvoice.Pdf` — posted Sales reikningur PDF.
- `Sales.SalesShipment.Pdf` — posted Sales Shipment PDF.

## Villur og viðvaranir
Villur og viðvaranir fylgja sameiginlega sniðinu - sjá [Villur og viðvaranir](/foundation/reference/errors/).

