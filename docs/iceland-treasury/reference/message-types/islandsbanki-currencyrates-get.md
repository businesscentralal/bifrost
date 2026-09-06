---
id: islandsbanki-currencyrates-get
title: "Islandsbanki.CurrencyRates.Get"
sidebar_label: "Islandsbanki.CurrencyRates.Get"
sidebar_position: 43
description: "Request and response contract for the Islandsbanki.CurrencyRates.Get Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


Retrieves Islandsbanki currency exchange rates (SaekjaGengi) for a given date.

**Direction:** Outbound  
**Content-Type:** text/json

## Use when
- You need Islandsbanki currency rates for a specific business date.
- You need to distinguish general, note (cash), and customs rates.
- You want the bank response as JSON without writing directly to BC currency exchange rate tables.

## Request
```json
{
  "rateDate": "2026-06-08",            // (required) ISO date YYYY-MM-DD
  "currencyType": "GeneralRate"         // (optional) GeneralRate | NoteRate | CustomsRate | CustomsBuySell (default: GeneralRate)
}
```

## Field notes
| Field | Notes |
|---|---|
| `rateDate` | Required ISO date. Use the date the customer wants to value or post against. |
| `currencyType` | Optional. `GeneralRate` (ALMENNT_GENGI), `NoteRate` (SEDLAGENGI), `CustomsRate` (TOLLGENGI), `CustomsBuySell` (TOLLGENGI_KAUP_SALA). Defaults to `GeneralRate`. |

## Response
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

### Response field notes
- `sellingRate` (Solugengi), `buyingRate` (Kaupgengi) and `fixingRate` (Fundargengi) carry the bank's native precision.
- `currencyName` is the Icelandic currency name (HeitiMyntar).

## Errors
- `Missing required 'rateDate'` - the `rateDate` property is missing or not a valid ISO date.
- `'currencyType' must be one of ...` - the `currencyType` value is unknown.
- `Islandsbanki returned no currency rates ...` - no rates exist for the supplied date.

## Troubleshooting - outbound HTTP blocked
If a call fails with `The outbound HTTP call to Islandsbanki was blocked ...`, enable **Allow HttpClient Requests** for the extension in Extension Management, and allow `https://ws.isb.is` if your environment uses an endpoint allowlist.

