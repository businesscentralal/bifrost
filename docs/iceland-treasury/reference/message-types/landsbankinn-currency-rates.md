---
id: landsbankinn-currency-rates
title: "Landsbankinn.Currency.Rates"
sidebar_label: "Landsbankinn.Currency.Rates"
sidebar_position: 111
description: "Request and response contract for the Landsbankinn.Currency.Rates Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


Retrieves exchange rates from the Landsbankinn REST Currencies API.
Uses General Ledger Setup LCY Code as the quote currency.
No OAuth token required — only the API key.

**Direction:** Outbound
**API:** General Data (no authentication)
**Endpoint:** `GET /Currencies/{LCY}/Rates`

## Request
```json
{
  "date": "2026-07-22"   // optional — ISO date; omit for latest rates
}
```

## Response
```json
{
  "quoteCurrency": "ISK",
  "date": "2026-07-22",
  "count": 35,
  "rates": [
    { "baseCurrency": "USD", "buy": 136.5, "sell": 138.0, "mid": 137.25, "date": "..." }
  ],
  "logEntryNo": 123
}
```

## AI/Agent playbook
This is the only currency-rates message type in Bifrost Iceland Treasury (REST-based; there is no separate SOAP rates type).
The quote currency is automatically resolved from General Ledger Setup LCY Code.
Omit `date` to get the latest published rates.

