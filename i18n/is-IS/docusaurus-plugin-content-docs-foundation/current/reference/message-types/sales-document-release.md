---
id: sales-document-release
title: "Sales.Document.Release"
sidebar_label: "Sales.Document.Release"
sidebar_position: 125
description: "Beiðni- og svarsamningur fyrir Sales.Document.Release Bifröst skilaboðategund."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálparkóða skilaboðategundarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálparkóðanum í forritinu, ekki þessari skrá.
:::


## Yfirlit

Releases an opið Sales Header með running BC codeunit `Release Sales Document` með `SetHideValidationDialog(true)`. Skilar the skjal's status transition og basic header context.

**Stefna**: Innkomandi (state change)  **Efnisgerð**: `text/json`

## Athugasemdir um endurtekningar og öryggi

- ekki endurtekningarþolið: re-calling on an already-`Released` skjal Villur. There er no "release ef opið" mode.
- Standard BC release validation runs (Sell-til viðskiptamanni No., Bill-til viðskiptamanni No., Posting dagsetning, Currency, Dimensions, ...). hvaða validation Mistókst aborts the release og er returned as an Villa response.

## Subject Identification Order

Via `FindSalesHeader`. Subject er tried fyrsta, then request JSON:
1. `subject` — GUID = `Sales Header.SystemId`, otherwise `No.` (assumed `Document Type::Order`).
2. JSON `systemId` / `recordSystemId` / `id` — `Sales Header.SystemId`.
3. JSON `orderNo` / `quoteNo` / `invoiceNo` / `creditMemoNo` / `blanketOrderNo` / `returnOrderNo` — typed lookup með skjal Gerð + No.

## Beiðnibreytur

| Færibreyta | Gerð | áskilið | Athugasemdir |
|---|---|---|---|
| `systemId` / `recordSystemId` / `id` | GUID | Sjá above | `Sales Header.SystemId`. |
| `orderNo` / `quoteNo` / `invoiceNo` / `creditMemoNo` / `blanketOrderNo` / `returnOrderNo` | strengur | Sjá above | Typed `No.` lookup. |

### Dæmi um beiðni
```json
{ "orderNo": "PS-ORD103001" }
```

## Uppbygging svars

### Tókst
```json
{
  "status": "Success",
  "documentType": "Order",
  "documentNo": "PS-ORD103001",
  "customerNo": "10000",
  "customerName": "Adatum Corporation",
  "statusBefore": "Open",
  "statusAfter": "Released",
  "documentDate": "2026-01-15",
  "amount": 5000.00,
  "amountIncludingVAT": 6200.00
}
```

### Mistókst
```json
{ "status": "Error", "code": "BusinessCentralError", "error": "...", "hint": "..." }
```

### Svarreitir

| Reitur | Uppruni |
|---|---|
| `statusBefore` | Always `"Open"` — the precondition fyrir a tókst call. |
| `documentDate` | `Sales Header."Order Date"`. |
| `amount` / `amountIncludingVAT` | Header FlowFields (CalcFields). |

## Dæmi (úr einingaprófum)

úr `Sales Document Release Tests` (`test/test/Sales/SalesDocumentReleaseTests.Codeunit.al`) — covers release of Order/reikningur/Credit Memo/Return Order/Blanket Order/Quote, the already-released Villa, og BC validation failures bubbled as `status: Error`.

## Villur

| Villa | Orsök |
|---|---|
| `Sales Header identifier is missing. Pass it as the subject, or as one of: systemId, recordSystemId, id, orderNo, quoteNo, invoiceNo, creditMemoNo, blanketOrderNo, returnOrderNo.` (`MissingParameter`); gefið en fannst ekki: `Sales Header "{value}" was not found (from {subject or key}).` (`RecordNotFound`) | `FindSalesHeader` could ekki resolve a header. |
| `Sales Document {no} is already released.` | Header `Status` er already `Released`. |
| BC release/validation Villur | Bubble up úr `Release Sales Document` (e.g. vantar posting dagsetning, blocked viðskiptamanni). |

## Tengdar skilaboðategundir

- `Sales.Document.Reopen` — reverse this operation.
- `Sales.Document.Post` — post a released skjal.
- `Sales.Document.PreviewPost` — preview the posting án committing.

## Villur og viðvaranir
Villur og viðvaranir fylgja sameiginlega sniðinu - sjá [Villur og viðvaranir](/foundation/reference/errors/).

