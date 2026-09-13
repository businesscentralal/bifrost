---
id: islandsbanki-currencyrates-get
title: "Islandsbanki.CurrencyRates.Get"
sidebar_label: "Islandsbanki.CurrencyRates.Get"
sidebar_position: 43
description: "Beiðni- og svarsamningur fyrir Islandsbanki.CurrencyRates.Sækja Bifrastar-skilaboðagerð."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálpar-codeunit skilaboðagerðarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálpar-codeunitinu í forritinu, ekki þessari skrá.
:::


Sækir Islandsbanki currency exchange rates (SaekjaGengi) fyrir a given date.

**Stefna:** Outbound  
**Efnisgerð:** text/json

## Notað þegar
- You need Islandsbanki currency rates fyrir a specific business date.
- You need til distinguish general, note (cash), og customs rates.
- You want the bank Svar as JSON without writing directly til BC currency exchange rate tables.

## Beiðni
```json
{
  "rateDate": "2026-06-08",            // (required) ISO date YYYY-MM-DD
  "currencyType": "GeneralRate"         // (optional) GeneralRate | NoteRate | CustomsRate | CustomsBuySell (default: GeneralRate)
}
```

## Reitur notes
| Reitur | Notes |
|---|---|
| `rateDate` | nauðsynlegt ISO date. Notaðu the date the viðskiptavinur wants til value eða post against. |
| `currencyType` | valfrjálst. `GeneralRate` (ALMENNT_GENGI), `NoteRate` (SEDLAGENGI), `CustomsRate` (TOLLGENGI), `CustomsBuySell` (TOLLGENGI_KAUP_SALA). Defaults til `GeneralRate`. |

## Svar
```json
{
  "status": "Success",
  "rateDate": "2026-06-08",
  "currencyType": "GeneralRate",
  "count": 35,
  "rates": [
    {
      "currencyCode": "USD",
      "currencyName": "Bandarikjadalur",
      "currencyType": "GeneralRate",
      "sellingRate": 137.42,
      "buyingRate": 136.18,
      "fixingRate": 136.80
    }
  ]
}
```

### Svar Reitur notes
- `sellingRate` (Solugengi), `buyingRate` (Kaupgengi) og `fixingRate` (Fundargengi) carry the bank's native precision.
- `currencyName` er the Icelandic currency Heiti (HeitiMyntar).

## Errors
- `Missing required 'rateDate'` - the `rateDate` property er missing eða not a valid ISO date.
- `'currencyType' must be one of ...` - the `currencyType` value er unknown.
- `Islandsbanki returned no currency rates ...` - no rates exist fyrir the supplied date.

## Troubleshooting - outbound HTTP blocked
Ef a Kallaðu á fails með `The outbound HTTP call to Islandsbanki was blocked ...`, enable **Allow HttpClient Requests** fyrir the extension in Extension Management, og allow `https://ws.isb.is` Ef your environment uses an Endapunktur allowlist.


