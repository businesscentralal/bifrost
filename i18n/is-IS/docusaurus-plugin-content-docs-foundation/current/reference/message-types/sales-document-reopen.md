---
id: sales-document-reopen
title: "Sales.Document.Reopen"
sidebar_label: "Sales.Document.Reopen"
sidebar_position: 126
description: "Beiðni- og svarsamningur fyrir Sales.Document.Reopen Bifröst skilaboðategund."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálparkóða skilaboðategundarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálparkóðanum í forritinu, ekki þessari skrá.
:::


## Yfirlit

Reopens a released (eða pending-approval) Sales Header so it getur be edited again.
- Released → uses BC codeunit `Sales Manual Reopen` (raises `OnAfterReopenSalesDoc`).
- Pending Approval með no `Approval Entry` rows fyrir the færsla → directly Stillir `Status = Open` og `Modify(true)` (escape hatch fyrir stuck approvals).

**Stefna**: Innkomandi (state change)  **Efnisgerð**: `text/json`

## Athugasemdir um endurtekningar og öryggi

- ekki endurtekningarþolið: re-calling on an already-`Open` skjal Villur.
- The Pending Approval fast path er aðeins taken þegar **no** `Approval Entry` exists fyrir the færsla. ef an virkt approval workflow exists you verður að cancel/approve it via the standard approval message types fyrsta.

## Subject Identification Order

sama as `Sales.Document.Release` (via `FindSalesHeader`).

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
  "statusBefore": "Released",
  "statusAfter": "Open",
  "documentDate": "2026-01-15",
  "amount": 5000.00,
  "amountIncludingVAT": 6200.00
}
```

### Mistókst
```json
{ "status": "Error", "error": "...", "callstack": "..." }
```

### Svarreitir

| Reitur | Uppruni |
|---|---|
| `statusBefore` | The actual prior status (`"Released"` eða `"Pending Approval"`). |
| `documentDate` | `Sales Header."Order Date"`. |

## Dæmi (úr einingaprófum)

úr `Sales Document Reopen Tests` (`test/test/Sales/SalesDocumentReopenTests.Codeunit.al`) — covers released-til-opið across skjal types, the already-opið Villa, og the Pending Approval escape hatch.

## Villur

| Villa | Orsök |
|---|---|
| `Document identifier must be specified in subject field or request JSON (systemId, recordSystemId, id, orderNo, quoteNo, invoiceNo, creditMemoNo, blanketOrderNo, returnOrderNo).` | `FindSalesHeader` could ekki resolve a header. |
| `Sales Document {no} is already open.` | Header `Status` er already `Open`. |
| BC reopen Villur | Bubble up úr `Sales Manual Reopen`. |

## Tengdar skilaboðategundir

- `Sales.Document.Release` — reverse this operation.
- `Sales.Document.Post` — post a released skjal (requires release fyrsta).

