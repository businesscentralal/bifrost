---
id: subscription-vendorcontract-previewinvoice
title: "Subscription.VendorContract.PreviewInvoice"
sidebar_label: "Subscription.VendorContract.PreviewInvoice"
sidebar_position: 22
description: "Request and response contract for the Subscription.VendorContract.PreviewInvoice Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


## Overview

Shows what `Subscription.VendorContract.CreateInvoice` would bill for a vendor subscription
contract, without keeping anything and without ever creating a document. The due
Subscription Lines are handed to the same ad-hoc billing proposal entry point the write
call uses, so the reported lines, periods and amounts reflect what Business Central would
actually produce. The proposal rows built for the preview are read and then deleted again.

## Request Parameters

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| contractNo | Code[20] | Yes | The Vendor Subscription Contract to preview. May also be supplied as the message subject. |
| billingDate | Date | No | Lines due on or before this date are billed. Defaults to the work date. |
| billingToDate | Date | No | Bills complete periods up to this date. Omit to use each line's own billing rhythm. |

Dates use the ISO format `YYYY-MM-DD`. There are no `documentDate`, `postingDate` or
`vendorInvoiceNo` parameters - a preview never creates a document, so nothing about the
document applies.

## Request Example

```json
{
  "contractNo": "VC000010",
  "billingDate": "2026-08-31"
}
```

## Response Shape

```json
{
  "status": "Success",
  "contractNo": "VC000010",
  "billingDate": "2026-08-31",
  "lines": [
    { "subscriptionLineEntryNo": 2001, "billingFrom": "2026-08-01", "billingTo": "2026-08-31", "unitPrice": "49.00", "amount": "49.00" }
  ],
  "wouldBillLineCount": 1,
  "totalAmount": "49.00",
  "preview": true,
  "rollback": true
}
```

A run that finds nothing due is a success with `wouldBillLineCount` of 0 and an empty `lines`
array; `preview` and `rollback` are still `true`.

## Errors

| Condition | Message |
| --- | --- |
| The contract does not exist | The Vendor Subscription Contract '%1' does not exist. |
| contractNo is missing | The request is missing the required parameter 'contractNo'. |
| Another contract has an unfinished ad-hoc proposal | There are %1 pending billing proposal line(s) left over for a different subscription contract ('%2'). Clear or process that proposal before previewing '%3'. |

Errors return `{ "status": "Error", "error": "...", "callstack": "..." }`.

## Safety

Nothing is left behind, but this is not a rolled-back transaction: Microsoft's billing
proposal codeunit commits internally partway through its own run, so an ordinary error-based
rollback would not undo it. Instead, this call notes the last Billing Line entry number
before it does anything, builds the real proposal lines for the contract's due Subscription
Lines with that same entry point, reads back exactly the rows it just created, and then
deletes exactly those rows again - on both the success path and if the proposal call itself
fails partway through. No document is ever created, even temporarily: this call never
reaches the step that turns proposal lines into a purchase document.

## Related Message Types

- `Subscription.VendorContract.CreateInvoice`
- `Subscription.VendorContract.GetLines`

