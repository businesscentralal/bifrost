---
id: purchase-document-create
title: "Purchase.Document.Create"
sidebar_label: "Purchase.Document.Create"
sidebar_position: 109
description: "Beiðni- og svarsamningur fyrir Purchase.Document.Create Bifröst skilaboðategund."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálparkóða skilaboðategundarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálparkóðanum í forritinu, ekki þessari skrá.
:::


## Yfirlit
Býr til a ný purchase header fyrir the specified birgi og skjal Gerð. aðeins the header er created — lines verður að be added separately via `Data.Records.Set` on `Purchase Line`.

**Stefna**: Innkomandi  **Efnisgerð**: text/json

## Idempotency / Safety
ekki endurtekningarþolið — hver call inserts a ný Purchase Header og consumes a númer úr the configured No. Series. Retrying eftir a tókst response mun create a duplicate skjal.

## birgi Forgangsröð úrlausnar
Resolved með `Argument.FindVendor`:
1. `subject` parsed as GUID → `Vendor.GetBySystemId`.
2. `subject` as text → `Vendor.Get` með `No.`.
3. Request JSON keys (fyrsta hit wins): `no`, `id` (GUID), `systemId` (GUID), `recordSystemId` (GUID).

## Beiðnibreytur
| Reitur | Gerð | áskilið | Lýsing |
|-------|------|----------|-------------|
| documentType | Text | Yes | One of `Quote`, `Order`, `Invoice`, `Credit Memo`, `Blanket Order`, `Return Order`. Case-insensitive. |
| postingDate | dagsetning | No | ISO dagsetning notað fyrir `Posting Date`. ógilt eða vantar → `WorkDate()`. |

## Dæmi um beiðni
```json
{
  "type": "Purchase.Document.Create",
  "subject": "10000",
  "data": { "documentType": "Order" }
}
```

## Uppbygging svars
Skilar the created header in `Data.Records.Get` shape (one færsla).
```json
{
  "status": "Success",
  "noOfRecords": 1,
  "result": [
    {
      "id": "<systemId>",
      "primaryKey": { "DocumentType": "Order", "No_": "<assigned no.>" },
      "fields": { "DocumentType": "Order", "No_": "<assigned no.>", "BuyfromVendorNo_": "10000", "PostingDate": "2026-03-07", "Status": "Open" }
    }
  ]
}
```

| Property | Lýsing |
|----------|-------------|
| status | Always `Success` fyrir this shape; Villur nota the standard Villa envelope. |
| noOfRecords | Always `1`. |
| result[0].id | SystemId (GUID) of the ný Purchase Header. |
| result[0].primaryKey | `DocumentType` og `No_`. |
| result[0].fields | Every Purchase Header Reitur, unrestricted með `Bifrost Field Access` (creation responses bypass Reitur lesa takmarkanir). |

## Reitur Naming
JSON Reitur names follow `RemoveNonAlphaNumericCharacters` on the BC Reitur Heiti: `No.` → `No_`, `Buy-from Vendor No.` → `BuyfromVendorNo_`, `Amount (LCY)` → `AmountLCY`.

## Villur
| Villa | Orsök |
|-------|-------|
| `documentType is required in request JSON. Expected: Quote, Order, Invoice, Credit Memo, Blanket Order, Return Order.` | `documentType` vantar úr request JSON. |
| `Invalid document type '{value}'. Expected: Quote, Order, Invoice, Credit Memo, Blanket Order, Return Order.` | `documentType` did ekki match hvaða enum Heiti. |
| `Vendor identifier is missing. Pass it as the subject, or as one of: no, id, systemId, recordSystemId.` (`MissingParameter`); gefið en fannst ekki: `Vendor "{value}" was not found (from {subject or key}).` (`RecordNotFound`) | No birgi resolved með `FindVendor`. |

## Tengdar skilaboðategundir
- `Data.Records.Set` — Add lines eða update header fields.
- `Purchase.Document.Release` / `Purchase.Document.Reopen` — Manage status.
- `Purchase.Document.PreviewPost` / `Purchase.Document.Post` — Simulate eða commit posting.
- `Purchase.Document.Statistics` — lesa totals.

## Villur og viðvaranir
Villur og viðvaranir fylgja sameiginlega sniðinu - sjá [Villur og viðvaranir](/foundation/reference/errors/).

