---
id: arionbanki-currencyrates-get
title: "Arionbanki.CurrencyRates.Get"
sidebar_label: "Arionbanki.CurrencyRates.Get"
sidebar_position: 18
description: "Request and response contract for the Arionbanki.CurrencyRates.Get Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


Retrieves Arion banki currency exchange rates for a given date.

**Direction:** Outbound  
**Content-Type:** text/json

## Use when
- You need Arion currency rates for a specific business date.
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
- `Arion banki returned no currency rates ...` - no rates exist for the supplied date.

## Troubleshooting - outbound HTTP blocked
If a call fails with `The outbound HTTP call to Arion banki was blocked by the Business Central environment...`, this is a security control, not a bug. Do not enable `Allow HttpClient Requests` or add outbound allowlist entries based on this help text. Contact your Business Central administrator or Origo support so they can verify the correct outbound endpoint and apply the change through the normal extension/security review process.

## Workflow: Download rates and update BC Currency Exchange Rate table

This is the recommended two-step workflow for keeping BC exchange rates current using Arion banki rates.

### Step 1 — Fetch rates from Arion
```json
// Call Arionbanki.CurrencyRates.Get
{
  "rateDate": "2026-06-12",
  "currencyType": "ExchangeRate"
}
```

### Step 2 — Write rates to Currency Exchange Rate table
Use `Data.Records.Set` (or the `set_records` MCP tool) to upsert into `Currency Exchange Rate`.

**Primary key:** `CurrencyCode` + `StartingDate`

**Field mapping from Arion response to BC:**
| Arion field | BC field | Notes |
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
- Only currencies that already exist in the BC **Currency** table can have exchange rates. Skip any Arion currency not set up in BC.
- The operation is idempotent: re-sending the same date+currency updates the existing row.
- Arion typically publishes rates on business days. Weekends and holidays return no rates.

