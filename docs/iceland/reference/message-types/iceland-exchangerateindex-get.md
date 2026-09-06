---
id: iceland-exchangerateindex-get
title: "Iceland.ExchangeRateIndex.Get"
sidebar_label: "Iceland.ExchangeRateIndex.Get"
sidebar_position: 28
description: "Request and response contract for the Iceland.ExchangeRateIndex.Get Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


Retrieves Central Bank of Iceland (Seðlabanki Íslands) exchange-rate indices
from the public XML data feed (group "Gengisvísitölur SÍ"). These are
trade-weighted indices of the Icelandic króna against a basket of currencies.

**Direction:** Outbound  
**Content-Type:** text/json

## Use when
- You need the trade-weighted ISK exchange-rate index (gengisvísitala).
- You need the index as of a business date, or a history over a span.
- You want the values as JSON without writing to any BC table.

## Request
```json
{
  "date": "2026-06-19",     // (optional) ISO date YYYY-MM-DD. Omit to get the latest published values.
  "dateTo": "2026-06-19"    // (optional) ISO date; end of an inclusive span (default: same as "date")
}
```

## Field notes
| Field | Notes |
|---|---|
| `date` | Optional ISO date. **Omit it to get the most recent published values** of every index series. |
| `dateTo` | Optional. When supplied with `date`, the response returns one row per series *per published date* in the span. |

## AI/Agent playbook
1. For "what is the current ISK index?", call with **no body** (or `{}`) for the latest values.
2. The series differ by weighting basket (read `description`): víð/þröng vöruskiptavog (broad/narrow trade weights) and viðskiptavog (commerce weights).
3. Match a series by its stable numeric `seriesId` rather than `name` (several series share the name "Vísitala meðalgengis"; the basket is in `description`).
4. `value` is the index level (index points), not a percentage.
5. A rising index means a weaker króna (more ISK per unit of the basket).
Capability boundary: this endpoint only reads public data; it does not write to BC.

## Index series (stable seriesId)
| seriesId | name | description (basket) |
|---|---|---|
| 4114 | Vísitala meðalgengis | Vöruskiptavog víð (broad trade weights) |
| 4115 | Vísitala meðalgengis | Vöruskiptavog þröng (narrow trade weights) |
| 4116 | Vísitala meðalgengis | Viðskiptavog víð (broad commerce weights) |
| 4117 | Vísitala meðalgengis | Viðskiptavog þröng (narrow commerce weights) |
| 4118 | Gengisvísitala | Viðskiptavog þröng * (headline exchange-rate index) |

The list may change; always read `seriesId`, `name`, and `description` from the response.

## Response
```json
{
  "status": "Success",
  "mode": "Latest",
  "count": 1,
  "indices": [
    {
      "seriesId": 4118,
      "name": "Gengisvísitala",
      "description": "Viðskiptavog þröng *",
      "indexDate": "2026-06-19",
      "value": 186.38
    }
  ]
}
```

### Response field notes
- `mode` is `Latest` when no date was supplied, otherwise `Range` (with `dateFrom`/`dateTo`).
- `seriesId` is the feed's stable numeric series id; use it as the join key.
- `name` and `description` are the Icelandic texts exactly as published by Seðlabanki.
- `value` is the index level in index points.

## Errors
- `'date' and 'dateTo' must be ISO dates ...` - a supplied date is not a valid ISO date.
- `Seðlabanki returned no exchange-rate indices ...` - no values for the supplied date; retry without a date for the latest values, or pick a published date.

## Troubleshooting - outbound HTTP blocked
If a call fails with `The outbound HTTP call to Seðlabanki was blocked ...`:
1. Open **Extension Management** in Business Central.
2. Find **Bifrost Iceland** and open **Extension Settings**.
3. Turn on **Allow HttpClient Requests**.
4. If your environment uses an endpoint allowlist, allow `https://sedlabanki.is`.

