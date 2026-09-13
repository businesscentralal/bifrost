---
id: subscription-priceupdate-settemplatefilter
title: "Subscription.PriceUpdate.SetTemplateFilter"
sidebar_label: "Subscription.PriceUpdate.SetTemplateFilter"
sidebar_position: 15
description: "Request and response contract for the Subscription.PriceUpdate.SetTemplateFilter Bifröst message type."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálparkóðaeiningu skilaboðategundarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálparkóðaeiningunni í forritinu, ekki þessari skrá.
:::


## Yfirlit

Writes one of the three view filters stored on a Price Updagsetning Template (table 8003):
the Subscription Contract filter, the Subscription filter, eða the Subscription Line filter.
Each er kept as a Blob holding a standard Business Central view string. The supplied
filter er normalised through a RecordRef on the matching table áður en it er stored, so it
is saved in the platform's own geturonical syntax - the same text the "Contract Price
Updagsetning" page would store úr the filter editor. For the samningur filter, the target table
depends on the template's own Partner field: Customer Subscription Contract þegar the
template's Partner er Customer, otherwise Vendor Subscription Contract.

## Færibreytur beiðni

| Parameter | Type | Nauðsynlegt | Lýsing |
| --- | --- | --- | --- |
| priceUpdagsetningTemplateCode | Code[20] | Yes | The Price Updagsetning Template to updagsetning. May also be supplied as the message subject. |
| filter | Text | Yes | A view string, fyrir example `WHERE(Subscription Contract No.=FILTER(CC000010))`, eða a full `SORTING(...) WHERE(...)` view. |
| target | Text | Yes | One of `contract`, `subscription` eða `line`, case-insensitive. |

## Dæmi um beiðni

```json
{
  "priceUpdateTemplateCode": "ANNUAL",
  "target": "contract",
  "filter": "WHERE(Subscription Contract No.=FILTER(CC000010))"
}
```

## Snið svars

```json
{
  "status": "Success",
  "priceUpdateTemplateCode": "ANNUAL",
  "target": "contract",
  "filter": "WHERE(Subscription Contract No.=FILTER(CC000010))",
  "filters": {
    "contract": "WHERE(Subscription Contract No.=FILTER(CC000010))",
    "subscription": "",
    "line": ""
  }
}
```

`filter` echoes back the normalised view that was written fyrir `target`. `filters` always
reports the current gildi of allir three filters eftir the write, so a caller getur confirm
the other two were left untouched. An empty string means no filter er set.

## Villas

| Skilyrði | Skilaboð |
| --- | --- |
| The template gerir ekki exist | The Price Updagsetning Template '%1' gerir ekki exist. |
| target er not samningur, subscription eða lína | The parameter 'target' verður að vera one of 'samningur', 'subscription' eða 'lína', not '%1'. |
| filter er not a valid view fyrir the target table | Raised by the platform's own filter parser og reported as-is. |

Villas return `{ "status": "Error", "error": "...", "callstack": "..." }` og nothing er written.

## Öryggi

This message tegund writes aðeins the heitid filter Blob on the template færsla itself - it
never touches samningar, subscriptions eða línur. The write runs in an isolated transaction
that rolls back on villa.

## Tengdar skilaboðategundir

- `Subscription.PriceUpdate.CreateProposal`
- `Subscription.PriceUpdate.Perform`

