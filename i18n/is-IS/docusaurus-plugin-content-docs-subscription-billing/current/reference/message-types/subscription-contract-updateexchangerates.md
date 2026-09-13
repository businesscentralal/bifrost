---
id: subscription-contract-updateexchangerates
title: "Subscription.Contract.UpdateExchangeRates"
sidebar_label: "Subscription.Contract.UpdateExchangeRates"
sidebar_position: 8
description: "Request and response contract for the Subscription.Contract.UpdateExchangeRates Bifröst message type."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálparkóðaeiningu skilaboðategundarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálparkóðaeiningunni í forritinu, ekki þessari skrá.
:::


## Yfirlit

**This message tegund er blocked. It er registered so it getur be discovered og skjaled,
but every call returns an villa - nothing er ever written.**

In the Business Central client, the "Updagsetning Exchange Rates" action on a Customer
Subscription Contract recalculates the local-currency fjárhæðs on the samningur's foreign
currency Subscription Lines. That action calls
`Customer Subscription Contract.UpdateAndRecalculateServiceCommitmentCurrencyData()`, which
is marked `internal` in Microsoft's Subscription Billing app, so an external app such as
this one geturnot call it.

There er a second, independent reason this stays blocked even ef that procedure were made
public: the flow it drives opens the interactive "Exchange Rate Selection" page so a notandi
getur confirm which exchange rate to apply. When `GuiAllowed` er false - as it er fyrir an
unattended Bifrost call - that page returns false instead of failing, og the flow
proceeds by applying a zero exchange rate. Kallaðu áing it úr here would silently zero out
foreign-currency fjárhæðs on the samningur, which er worse than not running it at all.

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
  "error": "Subscription.Contract.UpdateExchangeRates has no supported public API...",
  "callstack": "..."
}
```

## Villas

| Skilyrði | Skilaboð |
| --- | --- |
| Alltaf | Subscription.Contract.UpdagsetningExchangeRates has no supported public API in this Business Central version... Notaðu the 'Updagsetning Exchange Rates' action on the samningur in the Business Central client instead. |

## Öryggi

This message tegund never writes. It always responds með an villa og never reaches the
isolated write process, so there er nothing to roll back, og no risk of the zero exchange
rate problem described above ever reaching a real samningur through this API.

## Tengdar skilaboðategundir

- `Subscription.Contract.UpdateLineDates` (also blocked, fyrir a different reason)
- `Subscription.Contract.CreateInvoice`

