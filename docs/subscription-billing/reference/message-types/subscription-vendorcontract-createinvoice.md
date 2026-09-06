---
id: subscription-vendorcontract-createinvoice
title: "Subscription.VendorContract.CreateInvoice"
sidebar_label: "Subscription.VendorContract.CreateInvoice"
sidebar_position: 20
description: "Request and response contract for the Subscription.VendorContract.CreateInvoice Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


## Overview

Bills the due Subscription Lines of one Vendor Subscription Contract. The lines whose next
billing date falls on or before the billing date are copied into an ad-hoc billing proposal
(Billing Line rows with a blank Billing Template Code), and that proposal is then turned into
an unposted purchase document. Nothing is posted by this call - post the resulting document
separately once it has been reviewed.

## Request Parameters

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| contractNo | Code[20] | Yes | The Vendor Subscription Contract to bill. May also be supplied as the message subject. |
| billingDate | Date | No | Lines due on or before this date are billed. Defaults to the work date. |
| billingToDate | Date | No | Bills complete periods up to this date. Omit to use each line's own billing rhythm. |
| documentDate | Date | No | Document date stamped on the created document. Defaults to the work date. |
| postingDate | Date | No | Posting date stamped on the created document. Defaults to the work date. |
| vendorInvoiceNo | Text | No | When supplied, stamped onto the 'Vendor Invoice No.' field of every document created by this call. |

Dates use the ISO format `YYYY-MM-DD`.

## Request Example

```json
{
  "contractNo": "VC000010",
  "billingDate": "2026-08-31",
  "vendorInvoiceNo": "INV-2026-0912"
}
```

## Response Shape

```json
{
  "status": "Success",
  "contractNo": "VC000010",
  "billingDate": "2026-08-31",
  "billingLineCount": 3,
  "documents": [
    { "documentType": "Invoice", "documentNo": "PINV-000123" }
  ]
}
```

`billingLineCount` is the number of Subscription Lines that were due and billed. A run that
finds nothing due is a success with `billingLineCount` of 0 and an empty `documents` array.

## Errors

| Condition | Message |
| --- | --- |
| The contract does not exist | The Vendor Subscription Contract '%1' does not exist. |
| contractNo is missing | The request is missing the required parameter 'contractNo'. |
| Another contract has an unfinished ad-hoc proposal | There are %1 pending billing proposal line(s) left over for a different subscription contract ('%2'). Clear or process that proposal before creating an invoice for '%3'. |

Errors return `{ "status": "Error", "error": "...", "callstack": "..." }` and nothing is written.

## Safety

This message type writes, but it never posts. The billing proposal it builds is an ad-hoc,
blank-template proposal shared by the whole company, so this call first checks that no such
proposal lines are left standing for a different contract, and fails rather than sweep up
someone else's pending run. Only one partner type is ever billed by this call. Because
Microsoft's purchase document creation ignores any post flag, the result is always an
unposted purchase document that must be posted separately. The write runs in an isolated
transaction that rolls back on error.

## Related Message Types

- `Subscription.VendorContract.PreviewInvoice`
- `Subscription.VendorContract.GetLines`
- `Subscription.Billing.CreateDocuments`

