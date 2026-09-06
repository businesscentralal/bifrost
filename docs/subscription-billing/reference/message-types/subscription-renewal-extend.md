---
id: subscription-renewal-extend
title: "Subscription.Renewal.Extend"
sidebar_label: "Subscription.Renewal.Extend"
sidebar_position: 17
description: "Request and response contract for the Subscription.Renewal.Extend Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


## Overview

Extends an existing Subscription (table 8057) onto a customer and/or vendor contract by
running Microsoft's `Codeunit "Extend Sub. Contract Mgt."`. The Subscription must already
exist - this message type does not create one. The item's own standard service commitment
packages are always applied by Microsoft's codeunit; `subscriptionPackageCodes` only adds
further packages beyond those standard ones.

## Request Parameters

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| subscriptionHeaderNo | Code[20] | Yes | The Subscription to extend. May also be supplied as the message subject. |
| customerContractNo | Code[20] | No | An existing Customer Subscription Contract to extend onto. |
| vendorContractNo | Code[20] | No | An existing Vendor Subscription Contract to extend onto. |
| subscriptionPackageCodes | Array of Code[20] | No | Extra Subscription Package codes to apply beyond the item's standard packages. |
| usageBasedBillingPackageLinesOnly | Boolean | No | Defaults to false. When true, only usage based billing package lines are added. |
| supplierReferenceEntryNo | Integer | No | Defaults to 0. Links the extension to a specific supplier reference Subscription Line entry. |

At least one of `customerContractNo` or `vendorContractNo` is required.

## Request Example

```json
{
  "subscriptionHeaderNo": "SO000010",
  "customerContractNo": "CC000010",
  "subscriptionPackageCodes": ["SUPPORT"]
}
```

## Response Shape

```json
{
  "status": "Success",
  "subscriptionHeaderNo": "SO000010",
  "customerContractNo": "CC000010",
  "custContractLineCountBefore": 3,
  "custContractLineCountAfter": 5,
  "custContractLinesCreated": 2,
  "newSubscriptionLineEntryNos": [1044, 1045],
  "newSubscriptionLineCount": 2
}
```

`custContractLine*`/`vendContractLine*` fields are only present for the side that was
extended. `newSubscriptionLineEntryNos` lists the Subscription Line entries this call
added to the Subscription, regardless of which contract side they were linked to.

## Errors

| Condition | Message |
| --- | --- |
| The subscription does not exist | The Subscription '%1' does not exist. |
| The customer contract does not exist | The Customer Subscription Contract '%1' does not exist. |
| The vendor contract does not exist | The Vendor Subscription Contract '%1' does not exist. |
| A package code does not exist | The Subscription Package '%1' does not exist. |
| Neither contract number was supplied | The request must supply at least one of 'customerContractNo' or 'vendorContractNo'. |

Errors return `{ "status": "Error", "error": "...", "callstack": "..." }` and nothing is written.

## Safety

This message type writes: it inserts Subscription Lines and Cust./Vend. Sub. Contract
Line records. The write runs in an isolated transaction that rolls back on error, and
Microsoft's completion dialog is suppressed so the call never blocks on user input.

## Related Message Types

- `Subscription.Renewal.CreateQuote`

