---
id: sales-salesinvoice-cancel
title: "Sales.SalesInvoice.Cancel"
sidebar_label: "Sales.SalesInvoice.Cancel"
sidebar_position: 132
description: "Request and response contract for the Sales.SalesInvoice.Cancel Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


## Overview

Cancels a posted sales invoice by posting a cancelling sales credit memo that auto-applies to the original invoice. No new draft is created.
Wraps BC codeunit `Correct Posted Sales Invoice`.`CancelPostedInvoice`.

**Direction**: Inbound (write)  **Content-Type**: `text/json`

## Posting Gate

The same G/L posting gate as `Sales.Document.Post` is enforced.

## Process Flow

1. Resolve the posted sales invoice from `subject` or request JSON (see Identifier Resolution below).
2. Assert the G/L posting gate; abort with an error response if the caller is not allowed to post.
3. Run BC `CancelPostedInvoice` in an isolated `Codeunit.Run` so any BC error is caught and returned as JSON with the full callstack.
4. BC posts a cancelling sales credit memo and fully applies it to the original invoice; no draft invoice is created.
5. Look up the cancelling credit memo through the BC `Cancelled Document` link table (Source ID = `Sales Invoice Header`, Cancelled Doc. No. = original invoice).
6. Return the original invoice and the cancelling credit memo as a single JSON response.

## Identifier Resolution Order

1. `subject` envelope attribute — GUID = `Sales Invoice Header.SystemId`, otherwise `No.`.
2. Request JSON: `systemId` / `recordSystemId` / `id` (GUID), `invoiceNo` / `no` / `documentNo` (text).

## Request Example
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
  "cancellingCreditMemo": { "no": "PS-CRM200", "id": "22222222-2222-2222-2222-222222222222" }
}
```

## Output Documents

After a successful call two documents exist:

| Role | BC Table | Identifier in Response |
|---|---|---|
| Original posted invoice (now flagged Cancelled) | `Sales Invoice Header` | `originalInvoiceId` / `originalInvoiceNo` |
| Cancelling sales credit memo (posted, fully applied) | `Sales Cr.Memo Header` | `cancellingCreditMemo.id` / `cancellingCreditMemo.no` |

### Linkage

- The original invoice carries `Cancelled = true` and `Canceled By Cr. Memo No.` = the cancelling credit memo number.
- The cancelling credit memo has `Applies-to Doc. Type = Invoice` and `Applies-to Doc. No.` = the original invoice number.
- A row in the BC `Cancelled Document` table also pairs the two: `Source ID` = `Sales Invoice Header` table number, `Cancelled Doc. No.` = original invoice, `Cancelled By Doc. No.` = cancelling credit memo.

## Fetching the Resulting Documents with Data.Records.Get

Each `id` in the response is the `SystemId` of the BC record. Use them with `Data.Records.Get` to retrieve the full record JSON.

Fetch the cancelling credit memo header:
```json
{
  "type": "Data.Records.Get",
  "data": {
    "tableName": "Sales Cr.Memo Header",
    "tableView": "WHERE(SystemId=CONST(22222222-2222-2222-2222-222222222222))"
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

Re-read the original invoice to confirm the cancellation flag:
```json
{
  "type": "Data.Records.Get",
  "data": {
    "tableName": "Sales Invoice Header",
    "tableView": "WHERE(No.=CONST(PS-INV103001))"
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
| `You cannot cancel this posted sales invoice ...` | BC blocks cancellation (already cancelled / paid / has open applications). |

## Related Message Types

- `Sales.SalesInvoice.Correct` — cancel + create new editable draft.
- `Data.Records.Get` — fetch full record data for the documents listed above.
- `Purchase.PurchaseInvoice.Cancel` — purchase counterpart.

