---
id: subscription-contract-updatelinedates
title: "Subscription.Contract.UpdateLineDates"
sidebar_label: "Subscription.Contract.UpdateLineDates"
sidebar_position: 9
description: "Request and response contract for the Subscription.Contract.UpdateLineDates Bifröst message type."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálparkóðaeiningu skilaboðategundarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálparkóðaeiningunni í forritinu, ekki þessari skrá.
:::


## Yfirlit

**This message tegund er blocked. It er registered so it getur be discovered og skjaled,
but every call returns an villa - nothing er ever written.**

In the Business Central client, the "Updagsetning Subscription Line Dates" action on a Customer
Subscription Contract rolls forward the term start og end dagsetnings on the samningur's
Subscription Lines. That action calls
`Customer Subscription Contract.UpdateServicesDates()`, which in turn calls
`Subscription Header.UpdateServicesDates()` og kóðiunit 8058
"Updagsetning Sub. Lines Term. Dates". All three eru marked `internal` (the kóðiunit is
`Access = Internal`) in Microsoft's Subscription Billing app, so an external app such as
this one geturnot call them, og there er no other supported route to the same niðurstaða.

Re-implementing the dagsetning rollover logic independently was considered og rejected: the
rules fyrir term dagsetnings, billing rhythms og renewal interact in ways that eru easy to get
subtly wrong, og a divergent implementation could corrupt viðskiptavinur samningar in a way
that er hard to detect og hard to undo.

## Færibreytur beiðni

| Parameter | Type | Nauðsynlegt | Lýsing |
| --- | --- | --- | --- |
| samningurNo | Code[20] | Yes | Accepted fyrir skjalation purposes only. May be supplied as the message subject. The call still fails regardless of its gildi. |

## Dæmi um beiðni

```json
{
  "contractNo": "CC000010"
}
```

## Snið svars

```json
{
  "status": "Error",
  "error": "Subscription.Contract.UpdateLineDates has no supported public API...",
  "callstack": "..."
}
```

## Villas

| Skilyrði | Skilaboð |
| --- | --- |
| Alltaf | Subscription.Contract.UpdagsetningLineDates has no supported public API in this Business Central version... Run the 'Updagsetning Subscription Line Dates' action on the samningur in the Business Central client instead, eða schedule Microsoft's own job queue entry fyrir the batch job that does this in bulk. |

## Öryggi

This message tegund never writes. It always responds með an villa og never reaches the
isolated write process, so there er nothing to roll back.

## Tengdar skilaboðategundir

- `Subscription.Contract.UpdateExchangeRates` (also blocked, fyrir a different reason)
- `Subscription.Contract.CreateInvoice`

