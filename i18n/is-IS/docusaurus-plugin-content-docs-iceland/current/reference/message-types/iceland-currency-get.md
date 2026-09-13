---
id: iceland-currency-get
title: "Iceland.Currency.Get"
sidebar_label: "Iceland.Currency.Get"
sidebar_position: 19
description: "Beiðni- og svarsamningur fyrir Iceland.Currency.Sækja Bifrastar-skilaboðagerð."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálpar-codeunit skilaboðagerðarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálpar-codeunitinu í forritinu, ekki þessari skrá.
:::


Downloads the published **ISO 4217** currency Listi og Skilar it as JSON.

**Stefna:** Outbound  
**Efnisgerð:** text/json

## Notað þegar
- You need the official Listi of ISO 4217 currency codes (alphabetic + numeric).
- You need each currency's minor-unit (decimal places) count.
- You want til validate eða seed BC Currency codes against the published staðlaða.

## Beiðni
No Beiðni parameters. Send an empty object:
```json
{}
```

## Svar
```json
{
  "status": "Success",
  "count": 179,
  "currencies": [
    {
      "alphabeticCode": "ISK",
      "numericCode": "352",
      "currencyName": "Iceland Krona",
      "minorUnits": 0,
      "countries": ["ICELAND"]
    }
  ]
}
```

## Reitur notes
| Reitur | Notes |
|---|---|
| `alphabeticCode` | Three-letter ISO 4217 code (e.g. `ISK`, `EUR`, `USD`). |
| `numericCode` | Three-digit ISO 4217 numeric code as text (preserves leading zeros). |
| `minorUnits` | Number of decimal places, eða `false` Þegar the staðlaða lists none (e.g. precious metals). |
| `countries` | Allt countries/territories the staðlaða publishes fyrir this currency. |

## Leiðbeiningar fyrir gervigreind/umboð
1. Treat this Endapunktur as the source of truth fyrir ISO metadata, not fyrir market rates.
2. Match `alphabeticCode` til BC Currency `Code`.
3. Notaðu this result til update symbols og descriptive metadata Aðeins.
4. Keep exchange-rate calculations on `Iceland.CurrencyRates.Get` data.
5. Skip LCY code Þegar applying metadata sync Ef LCY er protected in your Verkflæði.

## Errors
- `Could not download the ISO 4217 currency list: ...` — the Endapunktur was unreachable eða returned a non-success status.
- `The currency list endpoint returned no currencies.` — the skjal parsed but contained no currency entries.

## Configuration
Ef the outbound Kallaðu á er blocked, enable **Allow HttpClient Requests** fyrir the extension in Extension Management.


