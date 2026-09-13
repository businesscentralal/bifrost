---
id: sales-document-post
title: "Sales.Document.Post"
sidebar_label: "Sales.Document.Post"
sidebar_position: 123
description: "Beiðni- og svarsamningur fyrir Sales.Document.Post Bifröst skilaboðategund."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálparkóða skilaboðategundarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálparkóðanum í forritinu, ekki þessari skrá.
:::


## Yfirlit

Bókar a Sales Header með running BC codeunit `Sales-Post` með `SetHideValidationDialog(true)`. eftir posting it discovers the newly created posted skjöl (reikningur / Credit Memo / Shipment / Return Receipt) með snapshotting `Last Posting No.` / `Last Shipping No.` / `Last Return Receipt No.` áður en posting og looking them up afterwards, með `Pre-Assigned No.` / `Order No.` / `Return Order No.` keys as fallback.

**Stefna**: Innkomandi (state change)  **Efnisgerð**: `text/json`

> ⚠️ **Ship og reikningur flags eru ekki set automatically via the API.**
> Unlike the BC UI (which defaults til "Ship og reikningur" þegar you click Post), the API Les `Ship` og `Invoice` exactly as stored on the header.
> Orders created via API have both flags `false` með Sjálfgefið. You **verður að** set them með `Data.Records.Set` áður en calling this skilaboðategund, eða posting mun silently produce no posted skjöl.
> Sjá **áskilið Pre-Flight** below.

## Athugasemdir um endurtekningar og öryggi

- ekki endurtekningarþolið: hver tókst call Býr til bók færslur og posted skjöl.
- All BC standard posting validation runs (Ship/reikningur/Receive flags on the header, númer series availability, dimensions, ...). BC Villur eru returned as `status: Error` með the BC `GetLastErrorText()` message.
- Pre-flight: refuses headers með no `Sales Line` rows.

## Subject Identification Order

sama as `Sales.Document.Release` (via `FindSalesHeader`).

## Beiðnibreytur

| Færibreyta | Gerð | áskilið | Athugasemdir |
|---|---|---|---|
| `systemId` / `recordSystemId` / `id` | GUID | Sjá above | `Sales Header.SystemId`. |
| `orderNo` / `quoteNo` / `invoiceNo` / `creditMemoNo` / `blanketOrderNo` / `returnOrderNo` | strengur | Sjá above | Typed `No.` lookup. |

Ship/reikningur flags eru taken úr the header itself; this call does ekki override them.

## áskilið Pre-Flight: Ship og reikningur Flags

The BC UI Stillir `Ship = true` og `Invoice = true` implicitly þegar the user clicks **Post**. The API does **ekki** — it Les whatever er stored on the `Sales Header` færsla. fyrir orders created via `Data.Records.Set` eða hvaða `Sales.*` skilaboðategund, both flags Sjálfgefið til `false`.

**Consequence:** calling `Sales.Document.Post` án setting these flags mun succeed (status: Tókst) but produce **no posted skjöl** — the order remains opið og no bók færslur eru created. This er the most common silent Mistókst þegar posting via API.

**áskilið two-step pattern (sequential — do ekki parallelize):**

**Step 1 — Set flags on the header**
```json
{
  "type": "Data.Records.Set",
  "tableName": "Sales Header",
  "primaryKey": { "DocumentType": 1, "No_": "PS-ORD103001" },
  "fields": { "Ship": true, "Invoice": true }
}
```

**Step 2 — Post**
```json
{ "type": "Sales.Document.Post", "orderNo": "PS-ORD103001" }
```

| Flag | Reitur No. | Meaning | Sjálfgefið fyrir API-created orders |
|---|---|---|---|
| `Ship` | 75 | Create a Posted Shipment | `false` |
| `Invoice` | 76 | Create a Posted reikningur | `false` |

fyrir Return Orders, the equivalent flag er `Receive` (Reitur 79) instead of `Ship`. Set it the sama way áður en posting.

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
  "postedDocuments": [
    {
      "type": "Posted Sales Invoice",
      "no": "PS-INV103001",
      "recordSystemId": "11111111-2222-3333-4444-555555555555",
      "postingDate": "2026-01-15",
      "amount": 5000.00,
      "amountIncludingVAT": 6200.00,
      "custLedgerEntryNo": 12345
    },
    {
      "type": "Posted Sales Shipment",
      "no": "PS-SHIP103001",
      "recordSystemId": "...",
      "postingDate": "2026-01-15"
    }
  ]
}
```

### Mistókst
```json
{ "status": "Error", "error": "...", "callstack": "..." }
```

### Svarreitir

| Reitur | Uppruni |
|---|---|
| `documentNo` | The pre-posting `Sales Header."No."` — the unposted skjal er removed eftir a tókst post but the pre-assigned númer er preserved fyrir traceability. |
| `postedDocuments[].type` | One of `Posted Sales Invoice`, `Posted Sales Credit Memo`, `Posted Sales Shipment`, `Posted Return Receipt`. |
| `postedDocuments[]` shape | Order → reikningur + Shipment. reikningur → reikningur. Credit Memo → Credit Memo. Return Order → Credit Memo + Return Receipt. |
| `custLedgerEntryNo` | Emitted on reikningur/Credit Memo færslur þegar a `Cust. Ledger Entry` exists. |

## Dæmi (úr einingaprófum)

úr `Sales Document Post Tests` (`test/test/Sales/SalesDocumentPostTests.Codeunit.al`) — covers Order/reikningur/Credit Memo/Return Order posting, verifies `postedDocuments[]` færslur og `custLedgerEntryNo` linkage, og exercises BC Villur (no lines, vantar posting dagsetning).

## Bókunarheimild
Calling this skilaboðategund requires the `BIFROST GL Post ori` heimild set in addition til `BIFROST API ori`. án it Beiðnin Skilar: `Posting denied: missing 'BIFROST GL Post ori' permission set.`

## Villur

| Villa | Orsök |
|---|---|
| `Posting denied: missing 'BIFROST GL Post ori' permission set.` | Kallandi lacks the `BIFROST GL Post ori` heimild set. |
| `Document identifier must be specified in subject field or request JSON (systemId, recordSystemId, id, orderNo, quoteNo, invoiceNo, creditMemoNo, blanketOrderNo, returnOrderNo).` | `FindSalesHeader` could ekki resolve a header. |
| `Sales document {no} has no lines to post.` | Header has no `Sales Line` rows. |
| BC posting Villur | Bubble up úr `Sales-Post` (e.g. vantar posting dagsetning, ógilt dimensions, viðskiptamanni blocked). |
| `status: Success` but `postedDocuments` er empty | `Ship` og/eða `Invoice` flags on the header eru `false`. Run the two-step pre-flight in **áskilið Pre-Flight** above áður en posting. |

## Tengdar skilaboðategundir

- `Sales.Document.PreviewPost` — preview the sama posting án committing.
- `Sales.Document.Release` — áskilið áður en posting ef `Status = Open`.
- `Sales.SalesInvoice.Pdf` / `Sales.SalesCreditMemo.Pdf` / `Sales.SalesShipment.Pdf` / `Sales.ReturnReceipt.Pdf` — fetch a PDF of the resulting posted skjal með `no`.

