---
id: iceland-interestrates-get
title: "Iceland.InterestRates.Get"
sidebar_label: "Iceland.InterestRates.Get"
sidebar_position: 33
description: "Request and response contract for the Iceland.InterestRates.Get Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


Retrieves Central Bank of Iceland (Seðlabanki Íslands) interest rates from the
public XML data feed (group "Vextir Seðlabankans"). Covers the policy rate
(meginvextir) and the deposit/lending facility, current-account, reserve, and
historical rate series.

**Direction:** Outbound  
**Content-Type:** text/json

## Use when
- You need the current Icelandic central-bank policy rate or facility rates.
- You need a rate as of a specific business date, or a history over a span.
- You want the rates as JSON without writing to any BC table.

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
| `date` | Optional ISO date. **Omit it to get the most recently published value of every series** — recommended, because interest rates change only on policy decisions and an arbitrary date often has no entry. |
| `dateTo` | Optional. When supplied with `date`, the response returns one row per series *per published date* in the span. |

## AI/Agent playbook
1. For "what is the current policy rate?", call with **no body** (or `{}`) to get latest values, then read the series named `Meginvextir`.
2. For a value as of a date, pass `date`; for a history, pass `date` + `dateTo`.
3. Match a series by its stable numeric `seriesId` (preferred) rather than the Icelandic `name`, which may be reworded.
4. `percent` is the annual interest rate in percent (e.g. `7.75` means 7.75%).
5. Some series are historical and stopped updating years ago; in `Latest` mode they still return their last published value.
Capability boundary: this endpoint only reads public data; it does not write to BC.

## Key series (stable seriesId)
| seriesId | name | Meaning |
|---|---|---|
| 17923 | Meginvextir | Current key policy rate. |
| 55 | Vextir á 7 daga veðlánum | 7-day collateralised lending rate. |
| 75 | Vextir á 7 daga bundnum innlánum | 7-day term deposit rate. |
| 24 | Vextir á daglánum | Overnight lending rate. |
| 28 | Vextir á viðskiptareikningum | Current-account (deposit) rate. |
| 3459 | Vextir á bindiskyldar innstæður | Reserve-requirement deposit rate. |

The list is not exhaustive and may change; always read `seriesId`, `name`, and `description` from the response.

## Response
```json
{
  "status": "Success",
  "mode": "Latest",
  "count": 2,
  "rates": [
    {
      "seriesId": 17923,
      "name": "Meginvextir",
      "description": "Útgefnir meginvextir Seðlabanka Íslands á hverjum tíma.",
      "rateDate": "2026-06-22",
      "percent": 7.75
    }
  ]
}
```

### Response field notes
- `mode` is `Latest` when no date was supplied, otherwise `Range` (with `dateFrom`/`dateTo`).
- `seriesId` is the feed's stable numeric series id; use it as the join key.
- `name` and `description` are the Icelandic texts exactly as published by Seðlabanki.
- `percent` is an annual percentage rate.

## Errors
- `'date' and 'dateTo' must be ISO dates ...` - a supplied date is not a valid ISO date.
- `Seðlabanki returned no interest rates ...` - no values for the supplied date; retry without a date for the latest values, or pick a published date.

## Troubleshooting - outbound HTTP blocked
If a call fails with `The outbound HTTP call to Seðlabanki was blocked ...`:
1. Open **Extension Management** in Business Central.
2. Find **Bifrost Iceland** and open **Extension Settings**.
3. Turn on **Allow HttpClient Requests**.
4. If your environment uses an endpoint allowlist, allow `https://sedlabanki.is`.

