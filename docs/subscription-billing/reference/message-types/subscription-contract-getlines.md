---
id: subscription-contract-getlines
title: "Subscription.Contract.GetLines"
sidebar_label: "Subscription.Contract.GetLines"
sidebar_position: 6
description: "Request and response contract for the Subscription.Contract.GetLines Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


## Overview

Attaches Subscription Lines that are not yet on any contract to a customer Subscription
Contract. The candidate lines are exactly the ones Microsoft's own "Get Subscription Lines"
action on the contract page would offer: invoiced via contract, not yet on a contract,
owned by a customer, and not already fully expired.

## Request Parameters

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| contractNo | Code[20] | Yes | The Customer Subscription Contract to attach lines to. May also be supplied as the message subject. |
| subscriptionHeaderNo | Code[20] | No | Restricts the candidates to lines on one Subscription. |
| subscriptionLineEntryNos | Integer[] | No | Restricts the candidates to these Subscription Line entry numbers. |

## Request Example

```json
{
  "contractNo": "CC000010",
  "subscriptionHeaderNo": "SUB000010"
}
```

## Response Shape

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

A candidate line is skipped, rather than causing an error, when its Subscription's
End-User Customer No. does not match the contract's Sell-to Customer No. `linesSkipped`
counts these. A run that matches no candidates at all is still a success, with
`linesAttached` of 0.

## Errors

| Condition | Message |
| --- | --- |
| The contract does not exist | The Customer Subscription Contract '%1' does not exist. |
| subscriptionLineEntryNos is present but is not an array | The parameter 'subscriptionLineEntryNos' must be a JSON array. |

Errors return `{ "status": "Error", "error": "...", "callstack": "..." }` and nothing is written.

## Safety

This message type writes. It only attaches existing Subscription Lines to the contract -
no Subscription Line is created and nothing is billed. The write runs in an isolated
transaction that rolls back on error.

## Related Message Types

- `Subscription.Line.Create`
- `Subscription.Contract.CreateInvoice`

