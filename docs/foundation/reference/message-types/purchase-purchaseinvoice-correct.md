---
id: purchase-purchaseinvoice-correct
title: "Purchase.PurchaseInvoice.Correct"
sidebar_label: "Purchase.PurchaseInvoice.Correct"
sidebar_position: 116
description: "Request and response contract for the Purchase.PurchaseInvoice.Correct Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


## Overview

Cancels a posted purchase invoice and creates a new editable purchase invoice draft pre-populated with the same lines.
Wraps BC codeunit `Correct Posted Purch. Invoice`.`CancelPostedInvoiceStartNewInvoice`.

**Direction**: Inbound (write)  **Content-Type**: `text/json`

## Posting Gate

The same G/L posting gate as `Purchase.Document.Post` is enforced.

## Process Flow

1. Resolve the posted purchase invoice from `subject` or request JSON (see Identifier Resolution below).
2. Assert the G/L posting gate; abort with an error response if the caller is not allowed to post.
3. Run BC `CancelPostedInvoiceStartNewInvoice` in an isolated `Codeunit.Run` so any BC error is caught and returned as JSON with the full callstack.
4. BC posts a cancelling purchase credit memo, fully applies it to the original invoice, and creates a new draft `Purchase Header` (Document Type = Invoice) copied from the original.
5. Look up the cancelling credit memo through the BC `Cancelled Document` link table (Source ID = `Purch. Inv. Header`, Cancelled Doc. No. = original invoice).
6. Return the original invoice, the cancelling credit memo, and the new draft invoice as a single JSON response.

## Identifier Resolution Order

1. `subject` envelope attribute — GUID = `Purch. Inv. Header.SystemId`, otherwise `No.`.
2. Request JSON: `systemId` / `recordSystemId` / `id` (GUID), `invoiceNo` / `no` / `documentNo` (text).

## Request Example
```json
{ "invoiceNo": "PP-INV103001" }
```

## Response

```json
{
  "status": "Success",
  "originalInvoiceNo": "PP-INV103001",
  "originalInvoiceId": "11111111-1111-1111-1111-111111111111",
  "vendorNo": "V10000",
  "vendorName": "Fabrikam",
  "cancellingCreditMemo": { "no": "PP-CRM200", "id": "22222222-2222-2222-2222-222222222222" },
  "newDraftInvoice": { "no": "P-INV1101", "id": "33333333-3333-3333-3333-333333333333", "documentType": "Invoice" }
}
```

## Output Documents

After a successful call three documents exist:

| Role | BC Table | Identifier in Response |
|---|---|---|
| Original posted invoice (now flagged Cancelled) | `Purch. Inv. Header` | `originalInvoiceId` / `originalInvoiceNo` |
| Cancelling purchase credit memo (posted, fully applied) | `Purch. Cr. Memo Hdr.` | `cancellingCreditMemo.id` / `cancellingCreditMemo.no` |
| New editable draft invoice | `Purchase Header` (Document Type = Invoice) | `newDraftInvoice.id` / `newDraftInvoice.no` |

### Linkage

- The original invoice carries `Cancelled = true` and `Canceled By Cr. Memo No.` = the cancelling credit memo number.
- The cancelling credit memo has `Applies-to Doc. Type = Invoice` and `Applies-to Doc. No.` = the original invoice number.
- A row in the BC `Cancelled Document` table also pairs the two: `Source ID` = `Purch. Inv. Header` table number, `Cancelled Doc. No.` = original invoice, `Cancelled By Doc. No.` = cancelling credit memo.
- The new draft invoice has no field-level FK to the original; the only link is through this response payload (`newDraftInvoice.no` / `.id`).

## Fetching the Resulting Documents with Data.Records.Get

Each `id` in the response is the `SystemId` of the BC record. Use them with `Data.Records.Get` to retrieve the full record JSON.

Fetch the new draft invoice header:
```json
{
  "type": "Data.Records.Get",
  "data": {
    "tableName": "Purchase Header",
    "tableView": "WHERE(SystemId=CONST(33333333-3333-3333-3333-333333333333))"
  }
}
```

Fetch the cancelling credit memo header:
```json
{
  "type": "Data.Records.Get",
  "data": {
    "tableName": "Purch. Cr. Memo Hdr.",
    "tableView": "WHERE(No.=CONST(PP-CRM200))"
  }
}
```

Fetch the lines of the new draft invoice (use `newDraftInvoice.no` from the response):
```json
{
  "type": "Data.Records.Get",
  "data": {
    "tableName": "Purchase Line",
    "tableView": "WHERE(Document Type=CONST(Invoice),Document No.=CONST(P-INV1101))"
  }
}
```

Fetch the cancelling credit memo lines:
```json
{
  "type": "Data.Records.Get",
  "data": {
    "tableName": "Purch. Cr. Memo Line",
    "tableView": "WHERE(Document No.=CONST(PP-CRM200))"
  }
}
```

Inspect the cancellation link directly:
```json
{
  "type": "Data.Records.Get",
  "data": {
    "tableName": "Cancelled Document",
    "tableView": "WHERE(Source ID=CONST(122),Cancelled Doc. No.=CONST(PP-INV103001))"
  }
}
```

## Posting Gate
Calling this message type requires the `BIFROST GL Post ori` permission set in addition to `BIFROST API ori`. Without it the request returns: `Posting denied: missing 'BIFROST GL Post ori' permission set.`

## Errors

| Error | Cause |
|---|---|
| `Posting denied: missing 'BIFROST GL Post ori' permission set.` | Caller lacks the `BIFROST GL Post ori` permission set. |
| `Posted purchase invoice identifier must be specified ...` | No identifier in `subject` or request JSON. |
| `You cannot cancel this posted purchase invoice ...` | BC blocks correction (already cancelled / paid / has open applications). |
| Posting period / dimension / vendor ledger errors | Bubble up from BC posting framework with full callstack. |
| `{CreditMemoNo} must be approved and released ...` + client callback error | Approval workflow is configured for purchase credit memos. BC internally creates the cancelling credit memo then tries to post it; the approval workflow blocks posting and BC raises a UI confirmation dialog that cannot be rendered in the API/web-service context. **Workaround**: temporarily set `Enabled = false` on the purchase credit memo approval workflow (`Workflow` table, e.g. code `MS-PCMAPW-01`) via `Data.Records.Set` before calling Correct, then re-enable it after. |

## Related Message Types

- `Purchase.PurchaseInvoice.Cancel` — cancel only, no new draft.
- `Purchase.Document.Post` — post the new draft once edited.
- `Data.Records.Get` — fetch full record data for the documents listed above.
- `Sales.SalesInvoice.Correct` — sales counterpart.

