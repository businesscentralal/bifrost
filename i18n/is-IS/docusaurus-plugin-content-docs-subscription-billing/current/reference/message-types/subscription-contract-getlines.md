---
id: subscription-contract-getlines
title: "Subscription.Contract.GetLines"
sidebar_label: "Subscription.Contract.GetLines"
sidebar_position: 6
description: "Request and response contract for the Subscription.Contract.GetLines Bifröst message type."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálparkóðaeiningu skilaboðategundarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálparkóðaeiningunni í forritinu, ekki þessari skrá.
:::


## Yfirlit

Attaches Subscription Lines that eru not yet on any samningur to a viðskiptavinur Subscription
Contract. The geturdidagsetning línur eru exactly the ones Microsoft's own "Get Subscription Lines"
action on the samningur page would offer: reikningurd via samningur, not yet on a samningur,
owned by a viðskiptavinur, og not already fully expired.

## Færibreytur beiðni

| Parameter | Type | Nauðsynlegt | Lýsing |
| --- | --- | --- | --- |
| samningurNo | Code[20] | Yes | The Customer Subscription Contract to attach línur to. May also be supplied as the message subject. |
| subscriptionHeaderNo | Code[20] | No | Restricts the geturdidagsetnings to línur on one Subscription. |
| subscriptionLineEntryNos | Integer[] | No | Restricts the geturdidagsetnings to these Subscription Line entry numbers. |

## Dæmi um beiðni

```json
{
  "contractNo": "CC000010",
  "subscriptionHeaderNo": "SUB000010"
}
```

## Snið svars

```json
{
  "status": "Success",
  "contractNo": "CC000010",
  "linesAttached": 2,
  "attachedLines": [
    { "subscriptionLineEntryNo": 1001, "contractLineNo": 10000 },
    { "subscriptionLineEntryNo": 1002, "contractLineNo": 20000 }
  ],
  "linesSkipped": 1
}
```

A geturdidagsetning lína er skipped, rather than causing an villa, þegar its Subscription's
End-Notaður Customer No. gerir ekki match the samningur's Sell-to Customer No. `linesSkipped`
counts these. A run that matches no geturdidagsetnings at allir er still a success, with
`linesAttached` of 0.

## Villas

| Skilyrði | Skilaboð |
| --- | --- |
| The samningur gerir ekki exist | The Customer Subscription Contract '%1' gerir ekki exist. |
| subscriptionLineEntryNos er present but er not an array | The parameter 'subscriptionLineEntryNos' verður að vera a JSON array. |

Villas return `{ "status": "Error", "error": "...", "callstack": "..." }` og nothing er written.

## Öryggi

This message tegund writes. It aðeins attaches existing Subscription Lines to the samningur -
no Subscription Line er created og nothing er billed. The write runs in an isolated
transaction that rolls back on villa.

## Tengdar skilaboðategundir

- `Subscription.Line.Create`
- `Subscription.Contract.CreateInvoice`

