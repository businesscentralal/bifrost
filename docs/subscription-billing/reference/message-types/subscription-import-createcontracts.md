---
id: subscription-import-createcontracts
title: "Subscription.Import.CreateContracts"
sidebar_label: "Subscription.Import.CreateContracts"
sidebar_position: 11
description: "Request and response contract for the Subscription.Import.CreateContracts Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


## Overview

Turns staged import rows - Imported Subscription Header (table 8008), Imported Cust. Sub.
Contract (table 8010) and Imported Subscription Line (table 8009) - into real Subscription
Header, Customer Subscription Contract, Subscription Line and Cust. Sub. Contract Line
records. The four stages run in a fixed order - headers, then contracts, then lines, then
contract lines - because each later stage needs the keys the earlier stages wrote back onto
the staging rows. Only unprocessed rows are picked up: each stage filters to its own
'created' flag being false, so calling this again only processes what is still outstanding.
One bad row does not stop the batch - its error is recorded on the staging row and the next
row is still attempted.

## Request Parameters

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| stages | Array of Text | No | Which stages to run, in any subset of SubscriptionHeaders, CustomerContracts, SubscriptionLines, ContractLines. Defaults to all four, always executed in that fixed order regardless of the order given. |

## Request Example

```json
{
  "stages": ["SubscriptionHeaders", "CustomerContracts", "SubscriptionLines", "ContractLines"]
}
```

## Response Shape

```json
{
  "status": "Success",
  "stages": [
    { "stage": "SubscriptionHeaders", "processed": 5, "succeeded": 5, "failed": 0 },
    { "stage": "CustomerContracts", "processed": 5, "succeeded": 4, "failed": 1 },
    { "stage": "SubscriptionLines", "processed": 5, "succeeded": 5, "failed": 0 },
    { "stage": "ContractLines", "processed": 5, "succeeded": 4, "failed": 1 }
  ],
  "errors": [
    { "stage": "CustomerContracts", "key": "12", "error": "..." }
  ]
}
```

`processed` is the number of unprocessed rows the stage found; `succeeded` and `failed` split
that count. `key` in `errors` is the staging row's Entry No.. The `errors` array is capped at
the first 50 entries across all stages - a failed row past that cap is still counted in
`failed` but its detail is not listed; check the staging table in the client for the rest.

## Errors

| Condition | Message |
| --- | --- |
| An unknown stage name is given | '%1' is not a known import stage. |

A row failing to create its Subscription record is not itself a call error - it is reported
inside `stages` and `errors` instead, and the call still returns `"status": "Success"`.

## Safety

This message type writes. It creates new Subscription Header, Customer Subscription Contract,
Subscription Line and Cust. Sub. Contract Line records from staging rows already present in
the database; it does not post anything. Each staging row is committed independently as it
is processed, so a failure partway through leaves earlier rows' results in place - this call
cannot be rolled back as a whole once it has started.

## Related Message Types

- `Subscription.Line.Create`
- `Subscription.Contract.GetLines`

