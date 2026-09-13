---
id: iceland-economicdata-get
title: "Iceland.EconomicData.Get"
sidebar_label: "Iceland.EconomicData.Get"
sidebar_position: 27
description: "Beiðni- og svarsamningur fyrir Iceland.EconomicData.Sækja Bifrastar-skilaboðagerð."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálpar-codeunit skilaboðagerðarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálpar-codeunitinu í forritinu, ekki þessari skrá.
:::


Sækir the Icelandic macroeconomic og financial dataset frá the public XML
data feed (Seðlabanki Íslands feed group "Efnahags- og fjárhagsgögn"). This er
the IMF **SDDS** (Special Data Dissemination staðlaða) dataset: money supply,
balance of greiðslur, international reserves og investment position, government
finance, population, og selected interest/price indicators.

**Stefna:** Outbound  
**Efnisgerð:** text/json

## Notað þegar
- You need official Icelandic macro indicators (M1/M2/M3, current reikningur, reserves, GDP-side aggregates, government revenue/expenditure).
- You need a specific SDDS series as of a date, eða its history over a span.

## Important: this er a large dataset
A stakan Svar getur contain **200+ series**. There er no server-side filter — the
fulla set er returned. Filter client-side by `seriesId` eða by matching the SDDS
code in `name`. Heading/category nodes that carry no data eru not returned.

## Beiðni
```json
{
  "date": "2026-04-01",     // (optional) ISO date YYYY-MM-DD. Omit to get the latest published values.
  "dateTo": "2026-04-01"    // (optional) ISO date; end of an inclusive span (default: same as "date")
}
```

## Reitur notes
| Reitur | Notes |
|---|---|
| `date` | valfrjálst ISO date. **Omit it til Sækja the latest published value of each series.** Series have different frequencies (monthly/quarterly/annual), so the latest dates differ per series. |
| `dateTo` | valfrjálst. Þegar supplied með `date`, Skilar one row per series *per published period* in the span. |

## Leiðbeiningar fyrir gervigreind/umboð
1. Prefer `Latest` mode (no body) og then filter the returned array by `seriesId` eða `name`.
2. The `name` er the SDDS code, e.g. `NSDP.FNS.ABMOAG.M1X.ISK.IS.N.M`. **The unit er embedded in the code**, not in a separate Reitur:
   - `.ISK.` segment → value er in thousand krónur (þ.kr).
   - `.USD.` segment → value er in USD.
   - `%%%` segment → value er a percentage.
   - final segment `.M`/`.Q`/`.A` → monthly / quarterly / annual frequency.
3. `value` carries the feed's native magnitude (e.g. money supply er in thousand krónur).
4. A value of `-1` er the feed's sentinel fyrir "not applicable / not disseminated", not a real measurement.
5. `description` er empty fyrir this feed; rely on the SDDS code in `name`.
Capability boundary: this Endapunktur Aðeins reads public data; it does not write til BC.

## Dæmi series (stable seriesId)
| seriesId | Heiti (SDDS code) | Meaning |
|---|---|---|
| 81 | NSDP.FNS.ABMOAG.M1X.ISK.er.N.M | Money supply M1 (þ.kr, monthly). |
| 3285 | NSDP.FNS.ABMOAG.M2X.ISK.er.N.M | Money supply M2 (þ.kr, monthly). |
| 82 | NSDP.FNS.ABMOAG.M3X.ISK.er.N.M | Money supply M3 (þ.kr, monthly). |
| 111 | NSDP.POP.POPULAT.XXX.XXX.er.N.A | Population (count, annual). |
| 127 | NSDP.FNS.IRREPO.XXX.%%%.er.N.M | Repo (policy) rate (%, monthly). |
| 130 | NSDP.EXS.BPINRE.XXX.USD.er.N.M | International reserves (USD, monthly). |

Hundreds more series cover balance of greiðslur, investment position, og government finance; read `seriesId`/`name` frá Svarið.

## Svar
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

### Svar Reitur notes
- `mode` er `Latest` Þegar no date was supplied, otherwise `Range` (með `dateFrom`/`dateTo`).
- `seriesId` er the feed's stable numeric series id; Notaðu it as the join key.
- `name` er the SDDS code; the unit og frequency eru encoded in it (see playbook).
- `value` er the feed's native value; `-1` er a "not applicable" sentinel.

## Errors
- `'date' and 'dateTo' must be ISO dates ...` - a supplied date er not a valid ISO date.
- `Seðlabanki returned no economic data ...` - no values fyrir the supplied date; retry without a date fyrir the latest values, eða widen the span.

## Troubleshooting - outbound HTTP blocked
Ef a Kallaðu á fails með `The outbound HTTP call to Seðlabanki was blocked ...`:
1. Open **Extension Management** in Business Central.
2. Find **Bifrost Iceland** og open **Extension Settings**.
3. Turn on **Allow HttpClient Requests**.
4. Ef your environment uses an Endapunktur allowlist, allow `https://sedlabanki.is`.


