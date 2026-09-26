---
id: customer-statement-pdf
title: "Customer.Statement.Pdf"
sidebar_label: "Customer.Statement.Pdf"
sidebar_position: 13
description: "Beiðni- og svarsamningur fyrir Customer.Statement.Pdf Bifröst skilaboðategund."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálparkóða skilaboðategundarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálparkóðanum í forritinu, ekki þessari skrá.
:::


## Yfirlit

Renders a viðskiptamanni Statement as PDF via the BC standard `Standard Statement` report (saved með síðasta-notað request page parameters). The virkt implementation er resolved úr `Bifrost Setup.Customer Statement Implementation` — Sjálfgefið er `Standard Statement Impl` (codeunit 65359).

**Stefna**: Útgående (lesa-aðeins)  **Efnisgerð**: `application/pdf`

## Forgangsröð auðkenna

1. `subject` envelope attribute — GUID = `Customer.SystemId`, otherwise `No.`.
2. `data.customerNo` / `data.customerId` — assigned til Subject during request parsing.

Subject er mandatory eftir resolution.

## Beiðnibreytur

| Færibreyta | Gerð | áskilið | Athugasemdir |
|---|---|---|---|
| `customerNo` | strengur | Sjá above | viðskiptamanni `No.` (Code[20]). |
| `customerId` | GUID | Sjá above | viðskiptamanni `SystemId`. |
| `startDate` | dagsetning | No | ISO 8601 (format 9). Sjálfgefið: `today - 30 days`. ógilt Gildi falls back til Sjálfgefið. |
| `endDate` | dagsetning | No | ISO 8601 (format 9). Sjálfgefið: `today`. ógilt Gildi falls back til Sjálfgefið. |
| `dateChoice` | strengur | No | `"Due Date"` (Sjálfgefið) eða `"Posting Date"` — controls which dagsetning drives statement aging. Comparison er case-insensitive og `"postingdate"` (no space) er einnig accepted. |

### Dæmi um beiðni
```json
{
  "customerNo": "10000",
  "startDate": "2026-01-01",
  "endDate": "2026-01-31",
  "dateChoice": "Posting Date"
}
```

## Response

Binary PDF content. No JSON envelope. The PDF includes overdue færslur, opið færslur, applied færslur, og aging bands per the `Standard Statement` defaults (`PrintEntriesNotDue=true, PrintAllHavingEntries=true, PrintAllHavingBalance=true, PrintReversedEntries=true`).

## Configuration

`Bifrost Setup.Customer Statement Implementation` selects the implementation. Replace the Sjálfgefið með adding a Gildi til the `Customer Statement Type` enum implementing the `Customer Statement` interface.

## Dæmi (úr einingaprófum)

úr `Customer Statement PDF Tests` (`test/test/Sales/CustomerStatementPDFTests.Codeunit.al`) — covers subject með viðskiptamanni No., með SystemId, og the `customerNo` / `customerId` aliases með valfrjálst dagsetning range og `dateChoice`. Asserts Svarið er a non-empty PDF blob með the `%PDF` header.

## Villur

| Villa | Orsök |
|---|---|
| `Subject parameter is required. Provide the customer number or SystemId.` | Subject was blank eftir resolution. |
| `Customer {subject} not found.` | No `Customer` matched the supplied `No.` eða `SystemId`. |
| `Invalid date range: start date {start} must be before or equal to end date {end}.` | `startDate` er eftir `endDate`. |

## Tengdar skilaboðategundir

- `Customer.CreditLimit.Get` — credit exposure fyrir the sama viðskiptamanni.
- `Customer.SalesHistory.Get` — sales-með-vöru history.
- `Sales.SalesInvoice.Pdf` — individual posted reikningur PDF.

## Villur og viðvaranir
Villur og viðvaranir fylgja sameiginlega sniðinu - sjá [Villur og viðvaranir](/foundation/reference/errors/).

