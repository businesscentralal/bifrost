---
id: iceland-currency-get
title: "Iceland.Currency.Get"
sidebar_label: "Iceland.Currency.Get"
sidebar_position: 19
description: "Request and response contract for the Iceland.Currency.Get Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


Downloads the published **ISO 4217** currency list and returns it as JSON.

**Direction:** Outbound  
**Content-Type:** text/json

## Use when
- You need the official list of ISO 4217 currency codes (alphabetic + numeric).
- You need each currency's minor-unit (decimal places) count.
- You want to validate or seed BC Currency codes against the published standard.

## Request
No request parameters. Send an empty object:
```json
{}
```

## Response
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

## Field notes
| Field | Notes |
|---|---|
| `alphabeticCode` | Three-letter ISO 4217 code (e.g. `ISK`, `EUR`, `USD`). |
| `numericCode` | Three-digit ISO 4217 numeric code as text (preserves leading zeros). |
| `minorUnits` | Number of decimal places, or `false` when the standard lists none (e.g. precious metals). |
| `countries` | All countries/territories the standard publishes for this currency. |

## AI/Agent playbook
1. Treat this endpoint as the source of truth for ISO metadata, not for market rates.
2. Match `alphabeticCode` to BC Currency `Code`.
3. Use this result to update symbols and descriptive metadata only.
4. Keep exchange-rate calculations on `Iceland.CurrencyRates.Get` data.
5. Skip LCY code when applying metadata sync if LCY is protected in your workflow.

## Errors
- `Could not download the ISO 4217 currency list: ...` — the endpoint was unreachable or returned a non-success status.
- `The currency list endpoint returned no currencies.` — the document parsed but contained no currency entries.

## Configuration
If the outbound call is blocked, enable **Allow HttpClient Requests** for the extension in Extension Management.

