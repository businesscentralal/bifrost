---
id: sparisjodir-currencyrates-get
title: "Sparisjodir.CurrencyRates.Get"
sidebar_label: "Sparisjodir.CurrencyRates.Get"
sidebar_position: 155
description: "Beiðni- og svarsamningur fyrir Sparisjodir.CurrencyRates.Sækja Bifrastar-skilaboðagerð."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálpar-codeunit skilaboðagerðarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálpar-codeunitinu í forritinu, ekki þessari skrá.
:::


Sækir Sparisjóður currency exchange rates fyrir a given date.

**Stefna:** Outbound  
**Efnisgerð:** text/json

## Notað þegar
- You need Spar currency rates fyrir a specific business date.
- You need til distinguish normal exchange rates, note rates, og customs rates.
- You want the bank Svar as JSON without writing directly til BC currency exchange rate tables.

## Beiðni
```json
{
  "rateDate": "2026-06-08",            // (required) ISO date YYYY-MM-DD
  "currencyType": "ExchangeRate"        // (optional) NoteRate | ExchangeRate | CustomsRate (default: ExchangeRate)
}
```

## Reitur notes
| Reitur | Notes |
|---|---|
| `rateDate` | nauðsynlegt ISO date. Notaðu the date the viðskiptavinur wants til value eða post against. |
| `currencyType` | valfrjálst. Defaults til `ExchangeRate`; Notaðu `CustomsRate` Aðeins Þegar the customs rate er nauðsynlegt. |

## Svar
```json
{
  "status": "Success",
  "rateDate": "2026-06-08",
  "currencyType": "ExchangeRate",
  "count": 35,
  "rates": [
    {
      "currencyCode": "USD",
      "currencyType": "ExchangeRate",
      "sellingRate": 137.42,
      "buyingRate": 136.18,
      "customsRate": 0,
      "timeStamp": "2026-06-08T09:15:00.000Z"
    }
  ]
}
```

## Errors
- `Missing required 'rateDate'` - the `rateDate` property er missing eða not a valid ISO date.
- `'currencyType' must be one of: NoteRate, ExchangeRate, CustomsRate` - the `currencyType` value er unknown.
- `Sparisjóður returned no currency rates ...` - no rates exist fyrir the supplied date.

## Troubleshooting - outbound HTTP blocked
Ef a Kallaðu á fails með `The outbound HTTP call to Sparisjóður was blocked by the Business Central environment...`, verify permission til change `Allow HttpClient Requests` og then enable it in Extension Management.

### Check permission áður en changing the setting
- Verify you have permission til update table **NAV App Setting** (AppID = 0FB9B76C-D2BE-462D-B026-D490D0724164) og til manage extension settings.
- Ef you do not have permission, ask a BC administrator til perform the change.

### Steps til resolve
1. Open **Extension Management** in Business Central.
2. Find **Bifrost Spar Banki** og open **Extension Settings**.
3. Turn on **Allow HttpClient Requests**.
4. Ef your environment uses an Endapunktur allowlist, allow `https://<bank>-iobs.heimabanki.is`.

## Verkflæði: Download rates og update BC Currency Exchange Rate table

This er the recommended two-step Verkflæði fyrir keeping BC exchange rates current using Sparisjóður rates.

### Step 1 — Fetch rates frá Spar
```json
// Call Sparisjodir.CurrencyRates.Get
{
  "rateDate": "2026-06-12",
  "currencyType": "ExchangeRate"
}
```

### Step 2 — Write rates til Currency Exchange Rate table
Notaðu `Data.Records.Set` (eða the `set_records` MCP tool) til upsert í `Currency Exchange Rate`.

**Primary key:** `CurrencyCode` + `StartingDate`

**Reitur mapping frá Spar Svar til BC:**
| Spar Reitur | BC Reitur | Notes |
|---|---|---|
| `currencyCode` | `CurrencyCode` | verður að exist in the BC Currency table. |
| (Beiðni `rateDate`) | `StartingDate` | The date the rate applies frá. |
| mid-rate¹ × 100 | `RelationalExch_RateAmount` | ISK per 100 units of foreign currency. |
| mid-rate¹ × 100 | `RelationalAdjmtExchRateAmt` | Same as relational rate (used fyrir adjustment). |
| — | `ExchangeRateAmount` | Always `100`. |
| — | `AdjustmentExch_RateAmount` | Always `100`. |
| — | `FixExchangeRateAmount` | `"Currency"` (staðlaða BC convention). |

¹ Mid-rate = average of `sellingRate` og `buyingRate`. Multiply by 100 fyrir the relational amount.

Using `ExchangeRateAmount = 100` fyrir Allt currencies preserves more decimal places in the conversion og matches the existing BC convention fyrir this fyrirtæki.

### Dæmi set_records Kallaðu á
```json
{
  "table": "Currency Exchange Rate",
  "data": [
    {
      "primaryKey": { "CurrencyCode": "USD", "StartingDate": "2026-06-12" },
      "fields": {
        "ExchangeRateAmount": 100,
        "AdjustmentExch_RateAmount": 100,
        "RelationalExch_RateAmount": 12457.5,
        "RelationalAdjmtExchRateAmt": 12457.5,
        "FixExchangeRateAmount": "Currency"
      }
    },
    {
      "primaryKey": { "CurrencyCode": "EUR", "StartingDate": "2026-06-12" },
      "fields": {
        "ExchangeRateAmount": 100,
        "AdjustmentExch_RateAmount": 100,
        "RelationalExch_RateAmount": 14420,
        "RelationalAdjmtExchRateAmt": 14420,
        "FixExchangeRateAmount": "Currency"
      }
    }
  ]
}
```

### Notes
- Aðeins currencies that already exist in the BC **Currency** table getur have exchange rates. Skip any Spar currency not set up in BC.
- The operation er idempotent: re-sending the same date+currency Uppfærir the existing row.
- Spar typically publishes rates on business days. Weekends og holidays return no rates.


