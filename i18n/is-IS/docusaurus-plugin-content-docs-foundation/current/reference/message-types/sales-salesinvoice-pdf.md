---
id: sales-salesinvoice-pdf
title: "Sales.SalesInvoice.Pdf"
sidebar_label: "Sales.SalesInvoice.Pdf"
sidebar_position: 134
description: "Beiðni- og svarsamningur fyrir Sales.SalesInvoice.Pdf Bifröst skilaboðategund."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálparkóða skilaboðategundarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálparkóðanum í forritinu, ekki þessari skrá.
:::


## Yfirlit

Renders a posted Sales reikningur as PDF using the viðskiptamanni-specific BC Report Selection (`S.Invoice` usage). The PDF bytes eru returned inline in Svarið body.

**Stefna**: Útgående (lesa-aðeins)  **Efnisgerð**: `application/pdf`

## Forgangsröð auðkenna

fyrsta non-empty wins. Subject er mandatory eftir resolution — ef it er still blank Beiðnin Villur.
1. `subject` envelope attribute — GUID = `Sales Invoice Header.SystemId`, otherwise `No.`.
2. `data.invoiceNo` / `data.invoiceId`.
3. `data.documentNo` / `data.documentId` (generic aliases).

## Beiðnibreytur

| Færibreyta | Gerð | áskilið | Athugasemdir |
|---|---|---|---|
| `invoiceNo` | strengur | Sjá above | Sales reikningur Header `No.` (Code[20]). |
| `invoiceId` | GUID | Sjá above | Sales reikningur Header `SystemId`. |
| `documentNo` | strengur | Sjá above | Generic alias fyrir `invoiceNo`. |
| `documentId` | GUID | Sjá above | Generic alias fyrir `invoiceId`. |

### Dæmi um beiðni
```json
{ "invoiceNo": "PS-INV103001" }
```

## Response

Binary PDF content. No JSON envelope — `Content Type` er `application/pdf` og the bytes come úr `ReportSelections.GetPdfReportForCust` using the viðskiptamanni of the reikningur (`Sell-to Customer No.`) so viðskiptamanni-specific report layouts apply.

## Dæmi (úr einingaprófum)

úr `Sales Document PDF Tests` (`test/test/Sales/SalesDocumentPDFTests.Codeunit.al`) — verifies Svarið er a non-empty PDF blob með `%PDF` header fyrir posted reikningar identified með `No.`, `SystemId`, og the `documentNo`/`documentId` aliases.

## Villur

| Villa | Orsök |
|---|---|
| `Subject parameter is required. Provide the invoice number or SystemId.` | Subject was blank eftir resolution. |
| `Sales Invoice {subject} not found.` | No `Sales Invoice Header` matched the supplied `No.` eða `SystemId`. |
| BC report selection Villur | Bubble up úr `ReportSelections.GetPdfReportForCust` (e.g. no report defined fyrir usage `S.Invoice`). |

## Tengdar skilaboðategundir

- `Sales.SalesCreditMemo.Pdf` — posted Sales Credit Memo PDF.
- `Sales.SalesShipment.Pdf` — posted Sales Shipment PDF.
- `Sales.ReturnReceipt.Pdf` — posted Return Receipt PDF.
- `Customer.Statement.Pdf` — viðskiptamanni statement PDF.

## Villur og viðvaranir
Villur og viðvaranir fylgja sameiginlega sniðinu - sjá [Villur og viðvaranir](/foundation/reference/errors/).

