---
id: subscription-renewal-extend
title: "Subscription.Renewal.Extend"
sidebar_label: "Subscription.Renewal.Extend"
sidebar_position: 17
description: "Request and response contract for the Subscription.Renewal.Extend Bifröst message type."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálparkóðaeiningu skilaboðategundarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálparkóðaeiningunni í forritinu, ekki þessari skrá.
:::


## Yfirlit

Extends an existing Subscription (table 8057) onto a viðskiptavinur and/or vendor samningur by
running Microsoft's `Codeunit "Extend Sub. Contract Mgt."`. The Subscription verður already
exist - this message tegund gerir ekki create one. The vara's own standard service commitment
packages eru always applied by Microsoft's kóðiunit; `subscriptionPackageCodes` aðeins adds
further packages beyond those standard ones.

## Færibreytur beiðni

| Parameter | Type | Nauðsynlegt | Lýsing |
| --- | --- | --- | --- |
| subscriptionHeaderNo | Code[20] | Yes | The Subscription to extend. May also be supplied as the message subject. |
| viðskiptavinurContractNo | Code[20] | No | An existing Customer Subscription Contract to extend onto. |
| vendorContractNo | Code[20] | No | An existing Vendor Subscription Contract to extend onto. |
| subscriptionPackageCodes | Array of Code[20] | No | Extra Subscription Package kóðis to apply beyond the vara's standard packages. |
| usageBasedBillingPackageLinesOnly | Boolean | No | Sjálfgefið er false. When true, aðeins usage based billing package línur eru added. |
| supplierReferenceEntryNo | Integer | No | Sjálfgefið er 0. Links the extension to a specific supplier reference Subscription Line entry. |

At least one of `customerContractNo` eða `vendorContractNo` er required.

## Dæmi um beiðni

```json
{
  "subscriptionHeaderNo": "SO000010",
  "customerContractNo": "CC000010",
  "subscriptionPackageCodes": ["SUPPORT"]
}
```

## Snið svars

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

`custContractLine*`/`vendContractLine*` fields eru aðeins present fyrir the side that was
extended. `newSubscriptionLineEntryNos` listar the Subscription Line entries this call
added to the Subscription, regardless of which samningur side they were linked to.

## Villas

| Skilyrði | Skilaboð |
| --- | --- |
| The subscription gerir ekki exist | The Subscription '%1' gerir ekki exist. |
| The viðskiptavinur samningur gerir ekki exist | The Customer Subscription Contract '%1' gerir ekki exist. |
| The vendor samningur gerir ekki exist | The Vendor Subscription Contract '%1' gerir ekki exist. |
| A package kóði gerir ekki exist | The Subscription Package '%1' gerir ekki exist. |
| Neither samningur number was supplied | Beiðnin verður supply at least one of 'viðskiptavinurContractNo' eða 'vendorContractNo'. |

Villas return `{ "status": "Error", "error": "...", "callstack": "..." }` og nothing er written.

## Öryggi

This message tegund writes: it inserts Subscription Lines og Cust./Vend. Sub. Contract
Line færslur. The write runs in an isolated transaction that rolls back on villa, and
Microsoft's completion dialog er suppressed so the call never blocks on notandi input.

## Tengdar skilaboðategundir

- `Subscription.Renewal.CreateQuote`

