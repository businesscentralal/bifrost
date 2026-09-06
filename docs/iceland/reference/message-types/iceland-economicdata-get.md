---
id: iceland-economicdata-get
title: "Iceland.EconomicData.Get"
sidebar_label: "Iceland.EconomicData.Get"
sidebar_position: 27
description: "Request and response contract for the Iceland.EconomicData.Get Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


Retrieves the Icelandic macroeconomic and financial dataset from the public XML
data feed (Seðlabanki Íslands feed group "Efnahags- og fjárhagsgögn"). This is
the IMF **SDDS** (Special Data Dissemination Standard) dataset: money supply,
balance of payments, international reserves and investment position, government
finance, population, and selected interest/price indicators.

**Direction:** Outbound  
**Content-Type:** text/json

## Use when
- You need official Icelandic macro indicators (M1/M2/M3, current account, reserves, GDP-side aggregates, government revenue/expenditure).
- You need a specific SDDS series as of a date, or its history over a span.

## Important: this is a large dataset
A single response can contain **200+ series**. There is no server-side filter — the
full set is returned. Filter client-side by `seriesId` or by matching the SDDS
code in `name`. Heading/category nodes that carry no data are not returned.

## Request
```json
{
  "date": "2026-04-01",     // (optional) ISO date YYYY-MM-DD. Omit to get the latest published values.
  "dateTo": "2026-04-01"    // (optional) ISO date; end of an inclusive span (default: same as "date")
}
```

## Field notes
| Field | Notes |
|---|---|
| `date` | Optional ISO date. **Omit it to get the latest published value of each series.** Series have different frequencies (monthly/quarterly/annual), so the latest dates differ per series. |
| `dateTo` | Optional. When supplied with `date`, returns one row per series *per published period* in the span. |

## AI/Agent playbook
1. Prefer `Latest` mode (no body) and then filter the returned array by `seriesId` or `name`.
2. The `name` is the SDDS code, e.g. `NSDP.FNS.ABMOAG.M1X.ISK.IS.N.M`. **The unit is embedded in the code**, not in a separate field:
   - `.ISK.` segment → value is in thousand krónur (þ.kr).
   - `.USD.` segment → value is in USD.
   - `%%%` segment → value is a percentage.
   - final segment `.M`/`.Q`/`.A` → monthly / quarterly / annual frequency.
3. `value` carries the feed's native magnitude (e.g. money supply is in thousand krónur).
4. A value of `-1` is the feed's sentinel for "not applicable / not disseminated", not a real measurement.
5. `description` is empty for this feed; rely on the SDDS code in `name`.
Capability boundary: this endpoint only reads public data; it does not write to BC.

## Example series (stable seriesId)
| seriesId | name (SDDS code) | Meaning |
|---|---|---|
| 81 | NSDP.FNS.ABMOAG.M1X.ISK.IS.N.M | Money supply M1 (þ.kr, monthly). |
| 3285 | NSDP.FNS.ABMOAG.M2X.ISK.IS.N.M | Money supply M2 (þ.kr, monthly). |
| 82 | NSDP.FNS.ABMOAG.M3X.ISK.IS.N.M | Money supply M3 (þ.kr, monthly). |
| 111 | NSDP.POP.POPULAT.XXX.XXX.IS.N.A | Population (count, annual). |
| 127 | NSDP.FNS.IRREPO.XXX.%%%.IS.N.M | Repo (policy) rate (%, monthly). |
| 130 | NSDP.EXS.BPINRE.XXX.USD.IS.N.M | International reserves (USD, monthly). |

Hundreds more series cover balance of payments, investment position, and government finance; read `seriesId`/`name` from the response.

## Response
```json
{
  "status": "Success",
  "mode": "Latest",
  "count": 180,
  "series": [
    {
      "seriesId": 81,
      "name": "NSDP.FNS.ABMOAG.M1X.ISK.IS.N.M",
      "description": "",
      "date": "2026-03-01",
      "value": 698699.15
    }
  ]
}
```

### Response field notes
- `mode` is `Latest` when no date was supplied, otherwise `Range` (with `dateFrom`/`dateTo`).
- `seriesId` is the feed's stable numeric series id; use it as the join key.
- `name` is the SDDS code; the unit and frequency are encoded in it (see playbook).
- `value` is the feed's native value; `-1` is a "not applicable" sentinel.

## Errors
- `'date' and 'dateTo' must be ISO dates ...` - a supplied date is not a valid ISO date.
- `Seðlabanki returned no economic data ...` - no values for the supplied date; retry without a date for the latest values, or widen the span.

## Troubleshooting - outbound HTTP blocked
If a call fails with `The outbound HTTP call to Seðlabanki was blocked ...`:
1. Open **Extension Management** in Business Central.
2. Find **Bifrost Iceland** and open **Extension Settings**.
3. Turn on **Allow HttpClient Requests**.
4. If your environment uses an endpoint allowlist, allow `https://sedlabanki.is`.

