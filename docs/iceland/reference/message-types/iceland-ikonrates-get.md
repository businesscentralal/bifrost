---
id: iceland-ikonrates-get
title: "Iceland.IkonRates.Get"
sidebar_label: "Iceland.IkonRates.Get"
sidebar_position: 31
description: "Request and response contract for the Iceland.IkonRates.Get Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


Retrieves the IKON reference interest rates from the public XML data feed
(Seðlabanki Íslands feed group "IKON"). The feed publishes two daily fixings:
IKON rate A (first publication, ~11:01) and IKON rate B (second publication, ~13:01).

**Direction:** Outbound  
**Content-Type:** text/json

## Use when
- You need the IKON reference rate fixing for a business date, or its history over a span.

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
| `date` | Optional ISO date. **Omit it to get the latest published value of each fixing.** |
| `dateTo` | Optional. When supplied with `date`, returns one row per fixing *per business day* in the span. |

## AI/Agent playbook
1. For the current value, call with **no body** (or `{}`).
2. There are two series: `seriesId` 31010 = IKON A (first/earlier fixing), 31011 = IKON B (second/later fixing).
3. Prefer IKON B when you need the final daily value; A is the earlier intraday publication.
4. `percent` is the annual rate; check `rateDate`, as A and B can carry different latest dates.
Capability boundary: this endpoint only reads public data; it does not write to BC.

## Series (stable seriesId)
| seriesId | name | Meaning |
|---|---|---|
| 31010 | IKON vextir A | First publication (~11:01). |
| 31011 | IKON vextir B | Second publication (~13:01). |

## Response
```json
{
  "status": "Success",
  "mode": "Latest",
  "count": 2,
  "rates": [
    {
      "seriesId": 31010,
      "name": "IKON vextir A",
      "description": "IKON vextir A, fyrri birting kl 11:01",
      "rateDate": "2026-06-19",
      "percent": 7.409
    }
  ]
}
```

### Response field notes
- `mode` is `Latest` when no date was supplied, otherwise `Range` (with `dateFrom`/`dateTo`).
- `seriesId` is the feed's stable numeric series id; use it as the join key.
- `name` and `description` are the Icelandic texts exactly as published by Seðlabanki.
- `percent` is the annual IKON rate.

## Errors
- `'date' and 'dateTo' must be ISO dates ...` - a supplied date is not a valid ISO date.
- `Seðlabanki returned no IKON rates ...` - no values for the supplied date; retry without a date for the latest values, or pick a business date.

## Troubleshooting - outbound HTTP blocked
If a call fails with `The outbound HTTP call to Seðlabanki was blocked ...`:
1. Open **Extension Management** in Business Central.
2. Find **Bifrost Iceland** and open **Extension Settings**.
3. Turn on **Allow HttpClient Requests**.
4. If your environment uses an endpoint allowlist, allow `https://sedlabanki.is`.

