---
id: iceland-consumerpriceindex-get
title: "Iceland.ConsumerPriceIndex.Get"
sidebar_label: "Iceland.ConsumerPriceIndex.Get"
sidebar_position: 18
description: "Request and response contract for the Iceland.ConsumerPriceIndex.Get Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


Retrieves the Icelandic consumer price index (Seðlabanki Íslands feed group
"Vísitala neysluverðs") from the public XML data feed. The feed publishes the
index as monthly values: the index level (base 1988=100) and the 12-month
change in percent (the headline inflation rate).

**Direction:** Outbound  
**Content-Type:** text/json

## Use when
- You need the CPI index level for indexation (verðtrygging) of index-linked amounts.
- You need the current Icelandic inflation rate (12-month change).
- You need a monthly history of either series over a span.

## Request
```json
{
  "date": "2026-05-01",     // (optional) ISO date YYYY-MM-DD. Omit to get the latest published values.
  "dateTo": "2026-05-01"    // (optional) ISO date; end of an inclusive span (default: same as "date")
}
```

## Field notes
| Field | Notes |
|---|---|
| `date` | Optional ISO date. **Omit it to get the latest published value of each series.** The CPI is published monthly; values are dated to the first of the month. |
| `dateTo` | Optional. When supplied with `date`, the response returns one row per series *per published month* in the span. |

## AI/Agent playbook
1. For "what is the current CPI / inflation?", call with **no body** (or `{}`).
2. Distinguish the two series by `seriesId`: `1` is the index level, `2` is the 12-month change (%).
3. For verðtrygging, use the index level (`seriesId` 1); for an inflation headline, use the 12-month change (`seriesId` 2).
4. Values are dated to the first of the month (for example `2026-05-01` is the May 2026 figure).
5. Read `value` together with `description` to know the unit (index points vs percent).
Capability boundary: this endpoint only reads public data; it does not write to BC.

## Series (stable seriesId)
| seriesId | name | Meaning | Unit |
|---|---|---|---|
| 1 | Vísitala neysluverðs frá 1988 (1988=100) | CPI index level, base 1988=100. | Index points |
| 2 | Vísitala neysluverðs | CPI 12-month change (inflation rate). | Percent |

## Response
```json
{
  "status": "Success",
  "mode": "Latest",
  "count": 2,
  "series": [
    {
      "seriesId": 1,
      "name": "Vísitala neysluverðs frá 1988 (1988=100)",
      "description": "Vísitala neysluverðs",
      "date": "2026-05-01",
      "value": 684.3
    },
    {
      "seriesId": 2,
      "name": "Vísitala neysluverðs",
      "description": "Vísitala neysluverðs, 12 mánaða breyting, %.",
      "date": "2026-05-01",
      "value": 5.1
    }
  ]
}
```

### Response field notes
- `mode` is `Latest` when no date was supplied, otherwise `Range` (with `dateFrom`/`dateTo`).
- `seriesId` is the feed's stable numeric series id; use it as the join key.
- `name` and `description` are the Icelandic texts exactly as published by Seðlabanki.
- `value` is the index level (`seriesId` 1) or the 12-month change in percent (`seriesId` 2).

## Errors
- `'date' and 'dateTo' must be ISO dates ...` - a supplied date is not a valid ISO date.
- `Seðlabanki returned no consumer price index values ...` - no values for the supplied date; retry without a date for the latest values, or pick a published month (first of month).

## Troubleshooting - outbound HTTP blocked
If a call fails with `The outbound HTTP call to Seðlabanki was blocked ...`:
1. Open **Extension Management** in Business Central.
2. Find **Bifrost Iceland** and open **Extension Settings**.
3. Turn on **Allow HttpClient Requests**.
4. If your environment uses an endpoint allowlist, allow `https://sedlabanki.is`.

