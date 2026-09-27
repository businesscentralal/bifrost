---
id: sales-document-create
title: "Sales.Document.Create"
sidebar_label: "Sales.Document.Create"
sidebar_position: 122
description: "Beiðni- og svarsamningur fyrir Sales.Document.Create Bifröst skilaboðategund."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálparkóða skilaboðategundarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálparkóðanum í forritinu, ekki þessari skrá.
:::


## Overview

Creates a sales document for one customer: the header and, when `lines` is sent, its lines in the same call. Without `lines` only the header is created.

The header is inserted with the next number from the No. Series of the document type, then `Sell-to Customer No.` and `Posting Date` are validated, so the customer's defaults (addresses, payment terms, currency, dimensions) are filled in as in the BC page.

**Direction**: Inbound (write)  **Content-Type**: `text/json`

**Not idempotent**: each call creates a new document and uses a number from the No. Series. Retrying after a successful answer creates a second document.

## Identifying the Customer

Resolved by `Argument.FindCustomer`. Every identifier supplied is tried; identifiers that point to different records are refused.
1. `subject`: a GUID is the customer `SystemId`, any other value is the customer `No.`.
2. Request JSON `no`.
3. Request JSON `id`, `systemId` or `recordSystemId`: the customer `SystemId`.

## Request Parameters

| Parameter | Type | Required | Notes |
|---|---|---|---|
| `documentType` | string | Yes | `Quote`, `Order`, `Invoice`, `Credit Memo`, `Blanket Order` or `Return Order`. Case-insensitive. |
| Customer keys | string | Yes | `subject`, `no`, `id`, `systemId` or `recordSystemId`. See above. |
| `postingDate` | date | No | `YYYY-MM-DD`. The work date when omitted. Any other format is an error. |
| `lines` | object[] | No | The document lines, at most 200. See **With lines**. |

## With lines

The call is all-or-nothing. Every line is checked before the header is created, and every problem is reported in one answer, so nothing is created when one line is wrong. An error that BC raises while validating a line also rolls back the whole call: the header and the lines before it are not kept.

- Field names are camelCase. Foundation assigns the line numbers (10000, 20000, ...); do not send `lineNo`.
- A request can contain at most 200 lines.
- The index in an error is 1-based: `lines[1]` is the first line.
- `type` is `Item` when omitted. A `Comment` line needs only `description`.
- Validation order (the order BC validates the fields in): Type, No., Location Code, Variant Code, Unit of Measure Code, Quantity, Unit Price, Line Discount %, Shipment Date, Description.
- A field you leave out keeps its BC default. A field you send overrides it.

| Field | Type | Required | Description |
|---|---|---|---|
| type | Text | No | `Item` (default), `G/L Account`, `Resource`, `Fixed Asset`, `Charge (Item)` or `Comment`. |
| no | Text | Yes, except Comment | Number of `type`. It must exist and not be blocked. |
| locationCode | Text | No | Location code. It must exist. The header location when omitted. |
| variantCode | Text | No | Item variant. It must exist for the item. |
| unitOfMeasureCode | Text | No | Unit of measure of the item. The item's default when omitted. |
| quantity | Decimal | Yes, except Comment | Quantity in `unitOfMeasureCode`. |
| unitPrice | Decimal | No | Unit price. BC fills it from the item or the price list when omitted. |
| lineDiscountPercent | Decimal | No | Line discount %. |
| shipmentDate | Date | No | `YYYY-MM-DD`. The header date when omitted. |
| description | Text | Yes for Comment | Line description. BC fills it from `no` when omitted. |

```json
{
  "type": "Sales.Document.Create",
  "subject": "10000",
  "data": {
    "documentType": "Order",
    "lines": [
      { "type": "Item", "no": "1896-S", "quantity": 2, "unitPrice": 100, "locationCode": "BLUE" },
      { "type": "G/L Account", "no": "8410", "quantity": 1, "unitPrice": 25 },
      { "type": "Comment", "description": "Deliver before noon" }
    ]
  }
}
```

## Without lines

Only the header is created. A second `Sales.Document.Create` call always creates a new document, so send the lines on this call when you have them. Header fields can be changed later with `Data.Records.Set`.

```json
{
  "type": "Sales.Document.Create",
  "subject": "10000",
  "data": { "documentType": "Order", "postingDate": "2026-09-27" }
}
```

## Response Shape

The header in the `Data.Records.Get` shape. With `lines`, the answer also has `lines` and `totals`.

```json
{
  "status": "Success",
  "noOfRecords": 1,
  "result": [
    {
      "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
      "primaryKey": { "DocumentType": "Order", "No_": "<assigned no.>" },
      "fields": { "DocumentType": "Order", "No_": "<assigned no.>", "SelltoCustomerNo_": "10000", "PostingDate": "2026-09-27", "Status": "Open" }
    }
  ],
  "lines": [
    { "lineNo": 10000, "type": "Item", "no": "1896-S", "description": "ATHENS Desk", "quantity": 2, "unitOfMeasureCode": "PCS", "unitPrice": 100, "lineAmount": 200 }
  ],
  "totals": { "amount": 225, "amountIncludingVAT": 281.25, "quantity": 3 }
}
```

| Property | Description |
|---|---|
| `status` | `Success`. |
| `noOfRecords` | Always `1`. |
| `result[0]` | The new Sales Header: `id` (SystemId), `primaryKey` (`DocumentType`, `No_`) and every field in `fields`. Names follow the `Data.Records.Get` rules. |
| `lines[]` | Only with `lines`: each created line with `lineNo`, `type`, `no`, `description`, `quantity`, `unitOfMeasureCode`, `unitPrice` and `lineAmount`. |
| `totals` | Only with `lines`: `amount`, `amountIncludingVAT` and `quantity` of the document. |

## Errors

| Code | Error | Cause |
|---|---|---|
| `MissingParameter` | `documentType is required in request JSON. Expected: Quote, Order, Invoice, Credit Memo, Blanket Order, Return Order.` | `documentType` was not sent. |
| `InvalidParameter` | `Invalid document type {value}. Expected: Quote, Order, Invoice, Credit Memo, Blanket Order, Return Order.` | `documentType` is not one of the names. |
| `MissingParameter` | `Customer identifier is missing. Pass it as the subject, or as one of: no, id, systemId, recordSystemId.` | No customer identifier. |
| `RecordNotFound` | `Customer "{value}" was not found (from {subject or key}).` | The identifier matches no customer; `parameter` and `received` name it. |
| `ConflictingIdentifiers` | `The identifiers in {a} and {b} point to different records.` | Two identifiers resolve to different records. |
| `InvalidParameterFormat` | `"{value}" is not a valid GUID (from {key}).` | A SystemId that cannot be read. |
| `InvalidParameterFormat` | `Parameter "postingDate" has value "{value}", which is not a valid Date. Expected YYYY-MM-DD.` | `postingDate` is not an ISO date. |
| `InvalidLine` | `{n} problem(s) in lines. Nothing was created.` | The pre-check found problems. `errors[]` lists each one with `parameter` `lines[n].<field>`: `MissingParameter` (`<field> is required.`), `InvalidParameterFormat` (not a number or not a date), `InvalidParameter` (not a valid option), `RecordNotFound` (the item, account or other record does not exist) or `PreconditionFailed` (it is blocked). With one problem, that problem is the answer and there is no `errors[]`. |
| `BusinessCentralError` | `lines[n].<field>: <BC error>` | BC rejected a value while validating line `n`. `parameter` is `lines[n].<field>`. Nothing was created, not even the header. |
| `LimitExceeded` | `A request can contain at most 200 lines. Received: {n}.` | More than 200 lines. `received` is the count, `expected` is `200`. |
| `InvalidParameterFormat` | `lines must be an array.` | `lines` is not a JSON array. |
| `BusinessCentralError` | (BC error text) | BC rejected the header, for example a blocked customer. |

## Typical Workflow

1. `Sales.Document.Create` with `lines`.
2. `Sales.Document.Release`: release the document.
3. `Sales.Document.PreviewPost`: optional, see the entries without posting.
4. `Sales.Document.Post`: post it.

## Related Message Types

- `Sales.Document.Release` / `Sales.Document.Reopen`: change the status.
- `Sales.Document.PreviewPost` / `Sales.Document.Post`: simulate or post.
- `Sales.Document.Statistics`: read the totals.
- `Data.Records.Set`: change header fields. Lines belong on `Sales.Document.Create`.

## Errors and warnings
Errors and warnings follow the shared shape - see [Errors and warnings](/foundation/reference/errors/).

