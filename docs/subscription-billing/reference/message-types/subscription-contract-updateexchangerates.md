---
id: subscription-contract-updateexchangerates
title: "Subscription.Contract.UpdateExchangeRates"
sidebar_label: "Subscription.Contract.UpdateExchangeRates"
sidebar_position: 8
description: "Request and response contract for the Subscription.Contract.UpdateExchangeRates Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


## Overview

**This message type is blocked. It is registered so it can be discovered and documented,
but every call returns an error - nothing is ever written.**

In the Business Central client, the "Update Exchange Rates" action on a Customer
Subscription Contract recalculates the local-currency amounts on the contract's foreign
currency Subscription Lines. That action calls
`Customer Subscription Contract.UpdateAndRecalculateServiceCommitmentCurrencyData()`, which
is marked `internal` in Microsoft's Subscription Billing app, so an external app such as
this one cannot call it.

There is a second, independent reason this stays blocked even if that procedure were made
public: the flow it drives opens the interactive "Exchange Rate Selection" page so a user
can confirm which exchange rate to apply. When `GuiAllowed` is false - as it is for an
unattended Bifrost call - that page returns false instead of failing, and the flow
proceeds by applying a zero exchange rate. Calling it from here would silently zero out
foreign-currency amounts on the contract, which is worse than not running it at all.

## Request Parameters

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| contractNo | Code[20] | Yes | Accepted for documentation purposes only. May be supplied as the message subject. The call still fails regardless of its value. |

## Request Example

```json
{
  "contractNo": "CC000010"
}
```

## Response Shape

```json
{
  "status": "Error",
  "error": "Subscription.Contract.UpdateExchangeRates has no supported public API...",
  "callstack": "..."
}
```

## Errors

| Condition | Message |
| --- | --- |
| Always | Subscription.Contract.UpdateExchangeRates has no supported public API in this Business Central version... Use the 'Update Exchange Rates' action on the contract in the Business Central client instead. |

## Safety

This message type never writes. It always responds with an error and never reaches the
isolated write process, so there is nothing to roll back, and no risk of the zero exchange
rate problem described above ever reaching a real contract through this API.

## Related Message Types

- `Subscription.Contract.UpdateLineDates` (also blocked, for a different reason)
- `Subscription.Contract.CreateInvoice`

