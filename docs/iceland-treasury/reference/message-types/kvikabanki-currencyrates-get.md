---
id: kvikabanki-currencyrates-get
title: "Kvikabanki.CurrencyRates.Get"
sidebar_label: "Kvikabanki.CurrencyRates.Get"
sidebar_position: 67
description: "Request and response contract for the Kvikabanki.CurrencyRates.Get Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


Reads Kvika banki currency rates of a given type for a date.

**Direction:** Outbound  
**Content-Type:** text/json

## Request
```json
{
  "currencyType": "NoteRate",   // NoteRate | ExchangeRate | CustomsRate
  "date":         "2026-01-01"  // required (ISO)
}
```

## Response
Returns `status`, `currencyType`, `date`, `returned`, a `rates` array (`currencyCode`, `sellingRate`, `buyingRate`, `customsRate`, `timeStamp`), and `logEntryNo`.

## Errors
- `'currencyType' must be one of: NoteRate, ExchangeRate, CustomsRate`
- `'date' (ISO YYYY-MM-DD) is required`

