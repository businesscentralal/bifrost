---
id: subscription-import-createcontracts
title: "Subscription.Import.CreateContracts"
sidebar_label: "Subscription.Import.CreateContracts"
sidebar_position: 11
description: "Request and response contract for the Subscription.Import.CreateContracts Bifröst message type."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálparkóðaeiningu skilaboðategundarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálparkóðaeiningunni í forritinu, ekki þessari skrá.
:::


## Yfirlit

Turns staged import rows - Imported Subscription Header (table 8008), Imported Cust. Sub.
Contract (table 8010) og Imported Subscription Line (table 8009) - í real Subscription
Header, Customer Subscription Contract, Subscription Line og Cust. Sub. Contract Line
færslur. The four stages run in a fixed order - headers, then samningar, then línur, then
samningur línur - because hver later stage needs the keys the earlier stages wrote back onto
the staging rows. Only unprocessed rows eru picked up: hver stage filters to its own
'created' flag being false, so calling this again aðeins processes what er still outstanding.
One bad row gerir ekki stop the batch - its villa er færslaed on the staging row og the next
row er still attempted.

## Færibreytur beiðni

| Parameter | Type | Nauðsynlegt | Lýsing |
| --- | --- | --- | --- |
| stages | Array of Text | No | Which stages to run, in any subset of SubscriptionHeaders, CustomerContracts, SubscriptionLines, ContractLines. Sjálfgefið er allir four, always executed in that fixed order regardless of the order given. |

## Dæmi um beiðni

```json
{
  "stages": ["SubscriptionHeaders", "CustomerContracts", "SubscriptionLines", "ContractLines"]
}
```

## Snið svars

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

`processed` er the number of unprocessed rows the stage found; `succeeded` og `failed` split
that count. `key` in `errors` er the staging row's Entry No.. The `errors` array er capped at
the first 50 entries across allir stages - a failed row past that cap er still counted in
`failed` but its detail er not listed; check the staging table in the client fyrir the rest.

## Villas

| Skilyrði | Skilaboð |
| --- | --- |
| An unknown stage heiti er given | '%1' er not a known import stage. |

A row failing to create its Subscription færsla er not itself a call villa - it er reported
inside `stages` og `errors` instead, og the call still returns `"status": "Success"`.

## Öryggi

This message tegund writes. It creates new Subscription Header, Customer Subscription Contract,
Subscription Line og Cust. Sub. Contract Line færslur úr staging rows already present in
the database; it gerir ekki post anything. Each staging row er committed independently as it
is processed, so a failure partway through leaves earlier rows' niðurstöður in place - this call
geturnot be rolled back as a whole once it has started.

## Tengdar skilaboðategundir

- `Subscription.Line.Create`
- `Subscription.Contract.GetLines`

