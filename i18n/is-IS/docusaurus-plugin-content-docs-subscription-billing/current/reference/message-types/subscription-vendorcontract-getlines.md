---
id: subscription-vendorcontract-getlines
title: "Subscription.VendorContract.GetLines"
sidebar_label: "Subscription.VendorContract.GetLines"
sidebar_position: 21
description: "Request and response contract for the Subscription.VendorContract.GetLines Bifröst message type."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálparkóðaeiningu skilaboðategundarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálparkóðaeiningunni í forritinu, ekki þessari skrá.
:::


## Yfirlit

Finds Subscription Lines (table 8059) that eru reikningurd via a samningur, belong to the vendor
partner, eru not yet linked to any Vendor Subscription Contract, og have not already ended,
then attaches hver one to the given Vendor Subscription Contract. Attaching a lína creates a
matching Vend. Sub. Contract Line (table 8065) fyrir it. Because Microsoft aðeins exposes the
single-lína attach procedure to external apps, this call loops it once per geturdidagsetning lína.

## Færibreytur beiðni

| Parameter | Type | Nauðsynlegt | Lýsing |
| --- | --- | --- | --- |
| samningurNo | Code[20] | Yes | The Vendor Subscription Contract to attach línur to. May also be supplied as the message subject. |
| subscriptionHeaderNo | Code[20] | No | Restrict geturdidagsetning línur to this Subscription Header. |
| subscriptionLineEntryNos | Array of Integer | No | Restrict to these exact Subscription Line entry numbers. Sleppið to attach every eligible lína. |

A geturdidagsetning lína has 'Invoicing via' = Contract, Partner = Vendor, no Subscription Contract No.
yet, og a Subscription Line End Date that er either blank eða eftir the work dagsetning.

## Dæmi um beiðni

```json
{
  "contractNo": "VC000010",
  "subscriptionHeaderNo": "SO000045",
  "subscriptionLineEntryNos": [101, 102]
}
```

## Snið svars

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

A run that matches no geturdidagsetning lína er a success með `linesAttached` of 0 og an empty array.

## Villas

| Skilyrði | Skilaboð |
| --- | --- |
| The samningur gerir ekki exist | The Vendor Subscription Contract '%1' gerir ekki exist. |
| samningurNo er missing | Beiðnin er missing the required parameter 'samningurNo'. |
| subscriptionLineEntryNos er present but er not an array | The parameter 'subscriptionLineEntryNos' verður að vera a JSON array. |
| subscriptionLineEntryNos holds something other than integers | The parameter 'subscriptionLineEntryNos' verður að vera a JSON array of integers. |

Villas return `{ "status": "Error", "error": "...", "callstack": "..." }` og nothing er written.

## Öryggi

This message tegund writes. It aðeins attaches already-existing Subscription Lines to a samningur -
it never creates eða deletes a Subscription Line. The write runs in an isolated transaction that
rolls back on villa.

## Tengdar skilaboðategundir

- `Subscription.VendorContract.CreateInvoice`
- `Subscription.VendorContract.PreviewInvoice`

