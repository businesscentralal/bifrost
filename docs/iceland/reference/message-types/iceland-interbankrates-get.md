---
id: iceland-interbankrates-get
title: "Iceland.InterbankRates.Get"
sidebar_label: "Iceland.InterbankRates.Get"
sidebar_position: 32
description: "Request and response contract for the Iceland.InterbankRates.Get Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


Retrieves the Icelandic interbank money-market interest rates from the public
XML data feed (Seðlabanki Íslands feed group "Vextir á millibankamarkaði með
krónur"). These are the REIBID (bid) and REIBOR (offer) rates quoted between
banks for ISK deposits across maturities from overnight to 12 months.

**Direction:** Outbound  
**Content-Type:** text/json

## Use when
- You need REIBOR/REIBID reference rates for floating-rate loan pricing or treasury work.
- You need a specific tenor (for example REIBOR 3M) as of a date, or a history over a span.

## Request
```json
{
  "date": "2026-06-22",     // (optional) ISO date YYYY-MM-DD. Omit to get the latest published values.
  "dateTo": "2026-06-22"    // (optional) ISO date; end of an inclusive span (default: same as "date")
}
```

## Field notes
| Field | Notes |
|---|---|
| `date` | Optional ISO date. **Omit it to get the latest published value of each tenor.** Quoted on business days only. |
| `dateTo` | Optional. When supplied with `date`, returns one row per tenor *per business day* in the span. |

## AI/Agent playbook
1. For the current curve, call with **no body** (or `{}`) and read all tenors.
2. Match a tenor by its stable numeric `seriesId` (the `name`, for example `REIBOR, 3 M`, is human-readable but the id is the safe key).
3. `percent` is the annual rate (e.g. `8.113` means 8.113%).
4. Some long-tenor series (9 M, 12 M) are legacy and stopped updating; in `Latest` mode they still return their last published value with an old date — check `rateDate`.
Capability boundary: this endpoint only reads public data; it does not write to BC.

## Key series (stable seriesId)
| seriesId | name | Meaning |
|---|---|---|
| 12 | REIBOR, O/N | Overnight offer rate. |
| 13 | REIBOR, 1 M | 1-month offer rate. |
| 15 | REIBOR, 3 M | 3-month offer rate (common floating-rate base). |
| 16 | REIBOR, 6 M | 6-month offer rate. |
| 3 | REIBID, O/N | Overnight bid rate. |
| 6 | REIBID, 3 M | 3-month bid rate. |

REIBID = bid (what banks pay), REIBOR = offer (what banks charge). Tenor codes: O/N overnight, T/N tomorrow-next, S/W one week, T/W two weeks, then 1/2/3/6/9/12 M. The list may change; read `seriesId`/`name` from the response.

## Response
```json
{
  "status": "Success",
  "mode": "Latest",
  "count": 2,
  "rates": [
    {
      "seriesId": 15,
      "name": "REIBOR, 3 M",
      "description": "Millibankamarkaður, vextir, REIBOR, 3 mánaða, Ísland, króna.",
      "rateDate": "2026-06-22",
      "percent": 8.113
    }
  ]
}
```

### Response field notes
- `mode` is `Latest` when no date was supplied, otherwise `Range` (with `dateFrom`/`dateTo`).
- `seriesId` is the feed's stable numeric series id; use it as the join key.
- `name` and `description` are the Icelandic texts exactly as published by Seðlabanki.
- `percent` is the annual interbank rate.

## Errors
- `'date' and 'dateTo' must be ISO dates ...` - a supplied date is not a valid ISO date.
- `Seðlabanki returned no interbank rates ...` - no values for the supplied date; retry without a date for the latest values, or pick a business date.

## Troubleshooting - outbound HTTP blocked
If a call fails with `The outbound HTTP call to Seðlabanki was blocked ...`:
1. Open **Extension Management** in Business Central.
2. Find **Bifrost Iceland** and open **Extension Settings**.
3. Turn on **Allow HttpClient Requests**.
4. If your environment uses an endpoint allowlist, allow `https://sedlabanki.is`.

