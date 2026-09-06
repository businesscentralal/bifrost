---
id: iceland-penaltyinterest-get
title: "Iceland.PenaltyInterest.Get"
sidebar_label: "Iceland.PenaltyInterest.Get"
sidebar_position: 48
description: "Request and response contract for the Iceland.PenaltyInterest.Get Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


Retrieves the statutory Icelandic penalty / default interest rate from the
public XML data feed (Seðlabanki Íslands feed group "Dráttarvextir"). This is
the late-payment interest rate applied to overdue monetary claims in Icelandic
krónur, as determined by the Central Bank.

**Direction:** Outbound  
**Content-Type:** text/json

## Use when
- You need the current dráttarvextir rate to compute late-payment interest on overdue invoices.
- You need the rate that applied on a specific date, or its history over a span.

## Request
```json
{
  "date": "2026-06-01",     // (optional) ISO date YYYY-MM-DD. Omit to get the latest published value.
  "dateTo": "2026-06-01"    // (optional) ISO date; end of an inclusive span (default: same as "date")
}
```

## Field notes
| Field | Notes |
|---|---|
| `date` | Optional ISO date. **Omit it to get the latest published value.** The rate changes only when the Central Bank revises it; an arbitrary date may have no entry. |
| `dateTo` | Optional. When supplied with `date`, the response returns one row per published change in the span. |

## AI/Agent playbook
1. For "what is the current penalty interest rate?", call with **no body** (or `{}`).
2. The feed publishes a single series (`seriesId` 22, "Dráttarvextir").
3. `percent` is the annual penalty interest rate (e.g. `15.5` means 15.5% per annum).
4. To find the rate effective on a past date when no exact entry exists, query a span ending on that date and take the latest row.
Capability boundary: this endpoint only reads public data; it does not write to BC.

## Series (stable seriesId)
| seriesId | name | Meaning | Unit |
|---|---|---|---|
| 22 | Dráttarvextir | Statutory default interest on monetary claims (ISK). | Percent (annual) |

## Response
```json
{
  "status": "Success",
  "mode": "Latest",
  "count": 1,
  "rates": [
    {
      "seriesId": 22,
      "name": "Dráttarvextir",
      "description": "Peningakröfur, dráttarvextir, íslenskar krónur.",
      "rateDate": "2026-06-01",
      "percent": 15.5
    }
  ]
}
```

### Response field notes
- `mode` is `Latest` when no date was supplied, otherwise `Range` (with `dateFrom`/`dateTo`).
- `seriesId` is the feed's stable numeric series id; use it as the join key.
- `name` and `description` are the Icelandic texts exactly as published by Seðlabanki.
- `percent` is the annual penalty interest rate.

## Errors
- `'date' and 'dateTo' must be ISO dates ...` - a supplied date is not a valid ISO date.
- `Seðlabanki returned no penalty interest rate ...` - no value for the supplied date; retry without a date for the latest value, or query a span.

## Troubleshooting - outbound HTTP blocked
If a call fails with `The outbound HTTP call to Seðlabanki was blocked ...`:
1. Open **Extension Management** in Business Central.
2. Find **Bifrost Iceland** and open **Extension Settings**.
3. Turn on **Allow HttpClient Requests**.
4. If your environment uses an endpoint allowlist, allow `https://sedlabanki.is`.

