---
id: sales-salescreditmemo-send
title: "Sales.SalesCreditMemo.Send"
sidebar_label: "Sales.SalesCreditMemo.Send"
sidebar_position: 131
description: "Request and response contract for the Sales.SalesCreditMemo.Send Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


## Purpose

Triggers the BC standard "Send" action on a posted sales credit memo. The action delivers the credit memo to its recipient using whatever channels are configured on the resolved Document Sending Profile: email, printer, disk export, or an electronic document (PEPPOL/EHF/E-invoice) routed through a Document Exchange Service. This is the same action that runs when a user clicks **Send** on the posted sales credit memo page, exposed as a Bifrost so external systems and agents can trigger it without a UI.

Use this message type when an upstream system (an MCP client, a workflow, an AI agent) needs to send a credit memo to the customer right after posting, or to resend it later, without coding the channel logic. Channel selection (email vs print vs e-document) lives entirely in BC configuration via Document Sending Profiles; this message only decides *which* profile to use. Profile resolution and behaviour are identical to `Sales.SalesInvoice.Send`.

**Direction**: Inbound (action)  **Content-Type**: `text/json`

## What Happens When You Call This

1. **Resolve the credit memo** - locate the `Sales Cr.Memo Header` from the request (`creditMemoId` GUID, `creditMemoNo`, or `subject`).
2. **Resolve the profile** - pick a `Document Sending Profile` using the resolution chain below.
3. **Hand off to BC** - call `Sales Cr.Memo Header.SendProfile(DocumentSendingProfile)`. From this point the behaviour is exactly the standard BC Send.
4. **BC dispatches each enabled channel** on the profile:
   - **Printer** - sends the report to the configured printer if `Printer` is enabled.
   - **E-Mail** - renders the report attachment + email body and sends through the configured email account if `E-Mail` is enabled. The `Sent as Email` flag on the header is set on success.
   - **Disk** - writes the report (PDF or electronic document file) to the user's download/temp location if `Disk` is enabled.
   - **Electronic Document** - builds the e-document (PEPPOL / OIOUBL / custom format), hands it to the configured Document Exchange Service (DES), and updates the header tracking fields if `Electronic Document` is enabled.
5. **Return the response** - success envelope with the resolved profile + its source, or an error envelope with the original BC error text and callstack.

## Channel Support When Called via the API

This Bifrost runs on the BC Data Services API surface, which **does not allow client-side callbacks**. That restricts which profile channels actually work when invoked through this message type:

| Channel | Works via API? | Notes |
|---|---|---|
| **E-Mail** | Yes | Sent server-side through the configured email account. |
| **Electronic Document** | Yes | Built and handed to the Document Exchange Service server-side. |
| **Disk** | **No** | Triggers a client-side file-download callback. BC returns: *"Client callbacks are not supported on Microsoft Dynamics 365 Business Central Data Services."* The call is rejected and the wrapper returns it as an `Error` envelope. |
| **Printer** | **No** | Same client-callback restriction as Disk. |

Make sure the resolved profile (`Request` / `Customer` / `Default`) routes only through E-Mail and/or Electronic Document. Disk- or Printer-only profiles will always error when called via this message type, even though they work fine when a user clicks **Send** in the BC client.

## Tracking - Where the Status Lives After Sending

This message type does NOT return delivery confirmation. Delivery is asynchronous (especially for email and electronic documents). After the call returns `Success`, query the `Sales Cr.Memo Header` to inspect what happened:

| Field | Type | What it tells you |
|---|---|---|
| `Sent as Email` | Boolean | `true` once the email channel handed the message to the mail server. |
| `No. Printed` | Integer | Incremented each time the printer channel produced the document. |
| `Document Exchange Status` | Option | Lifecycle of the e-document at the Document Exchange Service: `Not Sent`, `Sent to Document Exchange Service`, `Sent to Recipient`, `Delivered to Recipient`, `Failed Delivery to Recipient`. |
| `Document Exchange Identifier` | Code[50] | The DES-side identifier - used to look up / trace the electronic document in the exchange service portal. |

Use `Data.Records.Get` (table 114 `Sales Cr.Memo Header`) to retrieve these fields after sending. The `Document Exchange Status` value is updated asynchronously by the DES connector job queue.

Sent-email history (subject, recipients, attachment, timestamp) is recorded by the BC base app in the `Sent Email` / `Email Outbox` tables and is reachable from the posted credit memo via standard navigation.

## Profile Resolution Order

1. **Request override** - `documentSendingProfile` in the request body. Must exist in the `Document Sending Profile` table; otherwise the call errors. Use this for one-off resends through a non-default channel without changing the customer master.
2. **Customer profile** - `Customer."Document Sending Profile"` for the credit memo's Sell-to Customer. This is the normal, per-customer routing.
3. **System default** - the first `Document Sending Profile` with `Default = true`. Acts as the safety net when neither override nor customer profile is set.

If none of the three resolves, the call errors with `No Document Sending Profile resolved for customer {No} and no system default profile exists.`

The `documentSendingProfileSource` field in the success response tells you which of the three was used (`Request` / `Customer` / `Default`).

## Subject Identification Order

1. `subject` envelope attribute - GUID = `Sales Cr.Memo Header.SystemId`, otherwise `No.`.
2. Request JSON: `creditMemoNo` / `creditMemoId` (resolved into the subject via `ResolveDocumentSubject`).

## Request Parameters

| Field | Type | Required | Description |
|---|---|---|---|
| `creditMemoNo` | string | One of these or `subject` | Sales Cr.Memo Header `No.`. |
| `creditMemoId` | GUID | One of these or `subject` | Sales Cr.Memo Header `SystemId`. |
| `documentSendingProfile` | Code[20] | No | One-time override profile code; must exist. |

## Request Example
```json
{ "creditMemoNo": "PSC-001", "documentSendingProfile": "EMAIL" }
```

## Response Shape - Success

```json
{
  "status": "Success",
  "documentType": "PostedSalesCreditMemo",
  "documentNo": "PSC-001",
  "documentId": "22222222-2222-2222-2222-222222222222",
  "customerNo": "C10000",
  "customerName": "Adatum",
  "documentSendingProfileCode": "EMAIL",
  "documentSendingProfileSource": "Request",
  "message": "Document sent successfully."
}
```

A `Success` response means BC accepted the send call and dispatched all enabled channels without throwing. It does NOT guarantee end-to-end delivery - query the tracking fields above for that.

## Response Shape - Failure

```json
{
  "status": "Error",
  "error": "<message>",
  "callstack": "<callstack>"
}
```

## Response Fields

| Field | Type | Description |
|---|---|---|
| `documentType` | string | Always `PostedSalesCreditMemo`. |
| `documentNo` | string | Sales Cr.Memo Header `No.`. |
| `documentId` | GUID | Sales Cr.Memo Header `SystemId`. |
| `customerNo` | Code[20] | Sell-to Customer No. on the credit memo. |
| `customerName` | Text[100] | Sell-to Customer Name on the credit memo. |
| `documentSendingProfileCode` | Code[20] | The resolved profile code that was used. |
| `documentSendingProfileSource` | string | `Request`, `Customer`, or `Default` - where the resolved profile came from. |
| `message` | string | Status message. |

## Errors

| Trigger | Error |
|---|---|
| Missing identifier | `Subject parameter is required. Provide the credit memo number or SystemId.` |
| Credit memo not found | `Sales Credit Memo {No} not found.` |
| Override profile missing | `Document Sending Profile "{Code}" not found.` |
| Customer profile dangling | `Document Sending Profile "{Code}" referenced by customer {No} does not exist.` |
| No profile and no default | `No Document Sending Profile resolved for customer {No} and no system default profile exists.` |
| Any BC SendProfile error | Original BC error text (e.g. missing email account, missing report selection, electronic document validation failure). |

## Related Message Types

- `Sales.SalesInvoice.Send` - same behaviour for posted sales invoices.
- `Data.Records.Get` (table 114) - read back `Sent as Email`, `Document Exchange Status`, `Document Exchange Identifier` to confirm delivery state.
- `Data.Records.Get` (table 60 `Document Sending Profile`) - inspect which channels a given profile enables.

