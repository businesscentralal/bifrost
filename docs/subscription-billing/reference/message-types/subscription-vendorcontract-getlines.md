---
id: subscription-vendorcontract-getlines
title: "Subscription.VendorContract.GetLines"
sidebar_label: "Subscription.VendorContract.GetLines"
sidebar_position: 21
description: "Request and response contract for the Subscription.VendorContract.GetLines Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


## Overview

Finds Subscription Lines (table 8059) that are invoiced via a contract, belong to the vendor
partner, are not yet linked to any Vendor Subscription Contract, and have not already ended,
then attaches each one to the given Vendor Subscription Contract. Attaching a line creates a
matching Vend. Sub. Contract Line (table 8065) for it. Because Microsoft only exposes the
single-line attach procedure to external apps, this call loops it once per candidate line.

## Request Parameters

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| contractNo | Code[20] | Yes | The Vendor Subscription Contract to attach lines to. May also be supplied as the message subject. |
| subscriptionHeaderNo | Code[20] | No | Restrict candidate lines to this Subscription Header. |
| subscriptionLineEntryNos | Array of Integer | No | Restrict to these exact Subscription Line entry numbers. Omit to attach every eligible line. |

A candidate line has 'Invoicing via' = Contract, Partner = Vendor, no Subscription Contract No.
yet, and a Subscription Line End Date that is either blank or after the work date.

## Request Example

```json
{
  "contractNo": "VC000010",
  "subscriptionHeaderNo": "SO000045",
  "subscriptionLineEntryNos": [101, 102]
}
```

## Response Shape

```json
{
  "status": "Success",
  "contractNo": "VC000010",
  "linesAttached": 2,
  "attachedLines": [
    { "subscriptionLineEntryNo": 101, "contractLineNo": 10000 },
    { "subscriptionLineEntryNo": 102, "contractLineNo": 20000 }
  ]
}
```

A run that matches no candidate line is a success with `linesAttached` of 0 and an empty array.

## Errors

| Condition | Message |
| --- | --- |
| The contract does not exist | The Vendor Subscription Contract '%1' does not exist. |
| contractNo is missing | The request is missing the required parameter 'contractNo'. |
| subscriptionLineEntryNos is present but is not an array | The parameter 'subscriptionLineEntryNos' must be a JSON array. |
| subscriptionLineEntryNos holds something other than integers | The parameter 'subscriptionLineEntryNos' must be a JSON array of integers. |

Errors return `{ "status": "Error", "error": "...", "callstack": "..." }` and nothing is written.

## Safety

This message type writes. It only attaches already-existing Subscription Lines to a contract -
it never creates or deletes a Subscription Line. The write runs in an isolated transaction that
rolls back on error.

## Related Message Types

- `Subscription.VendorContract.CreateInvoice`
- `Subscription.VendorContract.PreviewInvoice`

