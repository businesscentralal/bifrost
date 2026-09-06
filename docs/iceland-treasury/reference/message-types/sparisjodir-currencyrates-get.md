---
id: sparisjodir-currencyrates-get
title: "Sparisjodir.CurrencyRates.Get"
sidebar_label: "Sparisjodir.CurrencyRates.Get"
sidebar_position: 155
description: "Request and response contract for the Sparisjodir.CurrencyRates.Get Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


Retrieves Sparisjóður currency exchange rates for a given date.

**Direction:** Outbound  
**Content-Type:** text/json

## Use when
- You need Spar currency rates for a specific business date.
- You need to distinguish normal exchange rates, note rates, and customs rates.
- You want the bank response as JSON without writing directly to BC currency exchange rate tables.

## Request
```json
{
  "rateDate": "2026-06-08",            // (required) ISO date YYYY-MM-DD
  "currencyType": "ExchangeRate"        // (optional) NoteRate | ExchangeRate | CustomsRate (default: ExchangeRate)
}
```

## Field notes
| Field | Notes |
|---|---|
| `rateDate` | Required ISO date. Use the date the customer wants to value or post against. |
| `currencyType` | Optional. Defaults to `ExchangeRate`; use `CustomsRate` only when the customs rate is required. |

## Response
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
- `Missing required 'rateDate'` - the `rateDate` property is missing or not a valid ISO date.
- `'currencyType' must be one of: NoteRate, ExchangeRate, CustomsRate` - the `currencyType` value is unknown.
- `Sparisjóður returned no currency rates ...` - no rates exist for the supplied date.

## Troubleshooting - outbound HTTP blocked
If a call fails with `The outbound HTTP call to Sparisjóður was blocked by the Business Central environment...`, verify permission to change `Allow HttpClient Requests` and then enable it in Extension Management.

### Check permission before changing the setting
- Verify you have permission to update table **NAV App Setting** (AppID = 0FB9B76C-D2BE-462D-B026-D490D0724164) and to manage extension settings.
- If you do not have permission, ask a BC administrator to perform the change.

### Steps to resolve
1. Open **Extension Management** in Business Central.
2. Find **Bifrost Spar Banki** and open **Extension Settings**.
3. Turn on **Allow HttpClient Requests**.
4. If your environment uses an endpoint allowlist, allow `https://<bank>-iobs.heimabanki.is`.

## Workflow: Download rates and update BC Currency Exchange Rate table

This is the recommended two-step workflow for keeping BC exchange rates current using Sparisjóður rates.

### Step 1 — Fetch rates from Spar
```json
// Call Sparisjodir.CurrencyRates.Get
{
  "rateDate": "2026-06-12",
  "currencyType": "ExchangeRate"
}
```

### Step 2 — Write rates to Currency Exchange Rate table
Use `Data.Records.Set` (or the `set_records` MCP tool) to upsert into `Currency Exchange Rate`.

**Primary key:** `CurrencyCode` + `StartingDate`

**Field mapping from Spar response to BC:**
| Spar field | BC field | Notes |
|---|---|---|
| `currencyCode` | `CurrencyCode` | Must exist in the BC Currency table. |
| (request `rateDate`) | `StartingDate` | The date the rate applies from. |
| mid-rate¹ × 100 | `RelationalExch_RateAmount` | ISK per 100 units of foreign currency. |
| mid-rate¹ × 100 | `RelationalAdjmtExchRateAmt` | Same as relational rate (used for adjustment). |
| — | `ExchangeRateAmount` | Always `100`. |
| — | `AdjustmentExch_RateAmount` | Always `100`. |
| — | `FixExchangeRateAmount` | `"Currency"` (standard BC convention). |

¹ Mid-rate = average of `sellingRate` and `buyingRate`. Multiply by 100 for the relational amount.

Using `ExchangeRateAmount = 100` for all currencies preserves more decimal places in the conversion and matches the existing BC convention for this company.

### Example set_records call
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
- Only currencies that already exist in the BC **Currency** table can have exchange rates. Skip any Spar currency not set up in BC.
- The operation is idempotent: re-sending the same date+currency updates the existing row.
- Spar typically publishes rates on business days. Weekends and holidays return no rates.

