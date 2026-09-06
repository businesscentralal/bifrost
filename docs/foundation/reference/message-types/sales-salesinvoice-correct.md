---
id: sales-salesinvoice-correct
title: "Sales.SalesInvoice.Correct"
sidebar_label: "Sales.SalesInvoice.Correct"
sidebar_position: 133
description: "Request and response contract for the Sales.SalesInvoice.Correct Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


## Overview

Cancels a posted sales invoice and creates a new editable sales invoice draft pre-populated with the same lines.
Wraps BC codeunit `Correct Posted Sales Invoice`.`CancelPostedInvoiceCreateNewInvoice`.

**Direction**: Inbound (write)  **Content-Type**: `text/json`

## Posting Gate

The same G/L posting gate as `Sales.Document.Post` is enforced. Bifrost Setup must allow G/L posting for the calling identity.

## Process Flow

1. Resolve the posted sales invoice from `subject` or request JSON (see Identifier Resolution below).
2. Assert the G/L posting gate; abort with an error response if the caller is not allowed to post.
3. Run BC `CancelPostedInvoiceCreateNewInvoice` in an isolated `Codeunit.Run` so any BC error is caught and returned as JSON with the full callstack.
4. BC posts a cancelling sales credit memo, fully applies it to the original invoice, and creates a new draft `Sales Header` (Document Type = Invoice) copied from the original.
5. Look up the cancelling credit memo through the BC `Cancelled Document` link table (Source ID = `Sales Invoice Header`, Cancelled Doc. No. = original invoice).
6. Return the original invoice, the cancelling credit memo, and the new draft invoice as a single JSON response.

## Identifier Resolution Order

1. `subject` envelope attribute — GUID = `Sales Invoice Header.SystemId`, otherwise `No.`.
2. Request JSON: `systemId` / `recordSystemId` / `id` (GUID), `invoiceNo` / `no` / `documentNo` (text).

## Request Parameters

| Parameter | Type | Required | Notes |
|---|---|---|---|
| `invoiceNo` | string | See above | Posted Sales Invoice `No.`. |
| `invoiceId` (alias `id`/`systemId`) | GUID | See above | Posted Sales Invoice `SystemId`. |

### Request Example
```json
{ "invoiceNo": "PS-INV103001" }
```

## Response

```json
{
  "status": "Success",
  "originalInvoiceNo": "PS-INV103001",
  "originalInvoiceId": "11111111-1111-1111-1111-111111111111",
  "customerNo": "C10000",
  "customerName": "Adatum",
  "cancellingCreditMemo": { "no": "PS-CRM200", "id": "22222222-2222-2222-2222-222222222222" },
  "newDraftInvoice": { "no": "S-INV1101", "id": "33333333-3333-3333-3333-333333333333", "documentType": "Invoice" }
}
```

## Output Documents

After a successful call three documents exist:

| Role | BC Table | Identifier in Response |
|---|---|---|
| Original posted invoice (now flagged Cancelled) | `Sales Invoice Header` | `originalInvoiceId` / `originalInvoiceNo` |
| Cancelling sales credit memo (posted, fully applied) | `Sales Cr.Memo Header` | `cancellingCreditMemo.id` / `cancellingCreditMemo.no` |
| New editable draft invoice | `Sales Header` (Document Type = Invoice) | `newDraftInvoice.id` / `newDraftInvoice.no` |

### Linkage

- The original invoice carries `Cancelled = true` and `Canceled By Cr. Memo No.` = the cancelling credit memo number.
- The cancelling credit memo has `Applies-to Doc. Type = Invoice` and `Applies-to Doc. No.` = the original invoice number.
- A row in the BC `Cancelled Document` table also pairs the two: `Source ID` = `Sales Invoice Header` table number, `Cancelled Doc. No.` = original invoice, `Cancelled By Doc. No.` = cancelling credit memo.
- The new draft invoice has no field-level FK to the original; the only link is through this response payload (`newDraftInvoice.no` / `.id`).

## Fetching the Resulting Documents with Data.Records.Get

Each `id` in the response is the `SystemId` of the BC record. Use them with `Data.Records.Get` to retrieve the full record JSON.

Fetch the new draft invoice header:
```json
{
  "type": "Data.Records.Get",
  "data": {
    "tableName": "Sales Header",
    "tableView": "WHERE(SystemId=CONST(33333333-3333-3333-3333-333333333333))"
  }
}
```

Fetch the cancelling credit memo header:
```json
{
  "type": "Data.Records.Get",
  "data": {
    "tableName": "Sales Cr.Memo Header",
    "tableView": "WHERE(No.=CONST(PS-CRM200))"
  }
}
```

Fetch the lines of the new draft invoice (use `newDraftInvoice.no` from the response):
```json
{
  "type": "Data.Records.Get",
  "data": {
    "tableName": "Sales Line",
    "tableView": "WHERE(Document Type=CONST(Invoice),Document No.=CONST(S-INV1101))"
  }
}
```

Fetch the cancelling credit memo lines:
```json
{
  "type": "Data.Records.Get",
  "data": {
    "tableName": "Sales Cr.Memo Line",
    "tableView": "WHERE(Document No.=CONST(PS-CRM200))"
  }
}
```

Inspect the cancellation link directly:
```json
{
  "type": "Data.Records.Get",
  "data": {
    "tableName": "Cancelled Document",
    "tableView": "WHERE(Source ID=CONST(112),Cancelled Doc. No.=CONST(PS-INV103001))"
  }
}
```

## Posting Gate
Calling this message type requires the `BIFROST GL Post ori` permission set in addition to `BIFROST API ori`. Without it the request returns: `Posting denied: missing 'BIFROST GL Post ori' permission set.`

## Errors

| Error | Cause |
|---|---|
| `Posting denied: missing 'BIFROST GL Post ori' permission set.` | Caller lacks the `BIFROST GL Post ori` permission set. |
| `Posted sales invoice identifier must be specified ...` | No identifier in `subject` or request JSON. |
| `You cannot cancel this posted sales invoice ...` | BC blocks correction (already cancelled / corrective entries closed / paid). |
| Posting period / dimension / customer ledger errors | Bubble up from BC posting framework with full callstack. |

## Related Message Types

- `Sales.SalesInvoice.Cancel` — cancel only, no new draft.
- `Sales.Document.Post` — post the new draft once edited.
- `Data.Records.Get` — fetch full record data for the documents listed above.
- `Purchase.PurchaseInvoice.Correct` — purchase counterpart.

