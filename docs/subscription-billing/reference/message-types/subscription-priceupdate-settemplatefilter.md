---
id: subscription-priceupdate-settemplatefilter
title: "Subscription.PriceUpdate.SetTemplateFilter"
sidebar_label: "Subscription.PriceUpdate.SetTemplateFilter"
sidebar_position: 15
description: "Request and response contract for the Subscription.PriceUpdate.SetTemplateFilter Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


## Overview

Writes one of the three view filters stored on a Price Update Template (table 8003):
the Subscription Contract filter, the Subscription filter, or the Subscription Line filter.
Each is kept as a Blob holding a standard Business Central view string. The supplied
filter is normalised through a RecordRef on the matching table before it is stored, so it
is saved in the platform's own canonical syntax - the same text the "Contract Price
Update" page would store from the filter editor. For the contract filter, the target table
depends on the template's own Partner field: Customer Subscription Contract when the
template's Partner is Customer, otherwise Vendor Subscription Contract.

## Request Parameters

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| priceUpdateTemplateCode | Code[20] | Yes | The Price Update Template to update. May also be supplied as the message subject. |
| filter | Text | Yes | A view string, for example `WHERE(Subscription Contract No.=FILTER(CC000010))`, or a full `SORTING(...) WHERE(...)` view. |
| target | Text | Yes | One of `contract`, `subscription` or `line`, case-insensitive. |

## Request Example

```json
{
  "priceUpdateTemplateCode": "ANNUAL",
  "target": "contract",
  "filter": "WHERE(Subscription Contract No.=FILTER(CC000010))"
}
```

## Response Shape

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

`filter` echoes back the normalised view that was written for `target`. `filters` always
reports the current value of all three filters after the write, so a caller can confirm
the other two were left untouched. An empty string means no filter is set.

## Errors

| Condition | Message |
| --- | --- |
| The template does not exist | The Price Update Template '%1' does not exist. |
| target is not contract, subscription or line | The parameter 'target' must be one of 'contract', 'subscription' or 'line', not '%1'. |
| filter is not a valid view for the target table | Raised by the platform's own filter parser and reported as-is. |

Errors return `{ "status": "Error", "error": "...", "callstack": "..." }` and nothing is written.

## Safety

This message type writes only the named filter Blob on the template record itself - it
never touches contracts, subscriptions or lines. The write runs in an isolated transaction
that rolls back on error.

## Related Message Types

- `Subscription.PriceUpdate.CreateProposal`
- `Subscription.PriceUpdate.Perform`

