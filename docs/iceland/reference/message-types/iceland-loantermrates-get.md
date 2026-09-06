---
id: iceland-loantermrates-get
title: "Iceland.LoanTermRates.Get"
sidebar_label: "Iceland.LoanTermRates.Get"
sidebar_position: 37
description: "Request and response contract for the Iceland.LoanTermRates.Get Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


Retrieves Icelandic fixed loan-term interest rates from the public XML data
feed (Seðlabanki Íslands feed group "Fastir lánstímavextir"). These are the
estimated par yields (FLVR) and annuity / single-payment (eingreiðslu) rates for
indexed (verðtryggt) and non-indexed (óverðtryggt) loans at 3, 5, and 10 year terms.

**Direction:** Outbound  
**Content-Type:** text/json

## Use when
- You need benchmark fixed-term mortgage/loan yields for pricing or valuation.
- You need to compare indexed vs non-indexed term rates at 3/5/10 years.

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
| `date` | Optional ISO date. **Omit it to get the latest published value of each series.** |
| `dateTo` | Optional. When supplied with `date`, returns one row per series *per published date* in the span. |

## AI/Agent playbook
1. For the current term structure, call with **no body** (or `{}`).
2. Match a series by its stable numeric `seriesId`; the term and type are in the `name`.
3. `percent` is the annual yield (e.g. `7.69` means 7.69%).
4. `name` encodes type + indexation + term: `Par-vextir % (FLVR)` = par yield, `Eingreiðsluvextir %` = annuity/single-payment; `verðtryggt` = indexed, `óverðtryggt` = non-indexed; trailing `3`/`5`/`10` = years.
5. The feed provides no `description`; rely on `name`.
Capability boundary: this endpoint only reads public data; it does not write to BC.

## Key series (stable seriesId)
| seriesId | name | Meaning |
|---|---|---|
| 30101 | Par-vextir % (FLVR) óverðtryggt, 3 | Non-indexed par yield, 3 yr. |
| 30103 | Par-vextir % (FLVR) óverðtryggt, 10 | Non-indexed par yield, 10 yr. |
| 30104 | Par-vextir % (FLVR) verðtryggt, 3 | Indexed par yield, 3 yr. |
| 30106 | Par-vextir % (FLVR) verðtryggt, 10 | Indexed par yield, 10 yr. |
| 30110 | Eingreiðsluvextir % óverðtryggt, 3 | Non-indexed annuity rate, 3 yr. |
| 30107 | Eingreiðsluvextir % verðtryggt, 3 | Indexed annuity rate, 3 yr. |

Series ids 30101-30112 cover the full 3/5/10-year grid; read `seriesId`/`name` from the response.

## Response
```json
{
  "status": "Success",
  "mode": "Latest",
  "count": 1,
  "rates": [
    {
      "seriesId": 30101,
      "name": "Par-vextir % (FLVR) óverðtryggt, 3",
      "description": "",
      "rateDate": "2026-06-19",
      "percent": 7.69
    }
  ]
}
```

### Response field notes
- `mode` is `Latest` when no date was supplied, otherwise `Range` (with `dateFrom`/`dateTo`).
- `seriesId` is the feed's stable numeric series id; use it as the join key.
- `name` is the Icelandic series label; `description` is empty for this feed.
- `percent` is the annual yield.

## Errors
- `'date' and 'dateTo' must be ISO dates ...` - a supplied date is not a valid ISO date.
- `Seðlabanki returned no loan-term rates ...` - no values for the supplied date; retry without a date for the latest values, or pick a published date.

## Troubleshooting - outbound HTTP blocked
If a call fails with `The outbound HTTP call to Seðlabanki was blocked ...`:
1. Open **Extension Management** in Business Central.
2. Find **Bifrost Iceland** and open **Extension Settings**.
3. Turn on **Allow HttpClient Requests**.
4. If your environment uses an endpoint allowlist, allow `https://sedlabanki.is`.

