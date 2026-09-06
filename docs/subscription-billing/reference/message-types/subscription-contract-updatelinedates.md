---
id: subscription-contract-updatelinedates
title: "Subscription.Contract.UpdateLineDates"
sidebar_label: "Subscription.Contract.UpdateLineDates"
sidebar_position: 9
description: "Request and response contract for the Subscription.Contract.UpdateLineDates Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


## Overview

**This message type is blocked. It is registered so it can be discovered and documented,
but every call returns an error - nothing is ever written.**

In the Business Central client, the "Update Subscription Line Dates" action on a Customer
Subscription Contract rolls forward the term start and end dates on the contract's
Subscription Lines. That action calls
`Customer Subscription Contract.UpdateServicesDates()`, which in turn calls
`Subscription Header.UpdateServicesDates()` and codeunit 8058
"Update Sub. Lines Term. Dates". All three are marked `internal` (the codeunit is
`Access = Internal`) in Microsoft's Subscription Billing app, so an external app such as
this one cannot call them, and there is no other supported route to the same result.

Re-implementing the date rollover logic independently was considered and rejected: the
rules for term dates, billing rhythms and renewal interact in ways that are easy to get
subtly wrong, and a divergent implementation could corrupt customer contracts in a way
that is hard to detect and hard to undo.

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
  "error": "Subscription.Contract.UpdateLineDates has no supported public API...",
  "callstack": "..."
}
```

## Errors

| Condition | Message |
| --- | --- |
| Always | Subscription.Contract.UpdateLineDates has no supported public API in this Business Central version... Run the 'Update Subscription Line Dates' action on the contract in the Business Central client instead, or schedule Microsoft's own job queue entry for the batch job that does this in bulk. |

## Safety

This message type never writes. It always responds with an error and never reaches the
isolated write process, so there is nothing to roll back.

## Related Message Types

- `Subscription.Contract.UpdateExchangeRates` (also blocked, for a different reason)
- `Subscription.Contract.CreateInvoice`

