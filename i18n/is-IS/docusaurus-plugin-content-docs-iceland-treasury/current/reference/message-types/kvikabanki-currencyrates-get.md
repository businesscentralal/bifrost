---
id: kvikabanki-currencyrates-get
title: "Kvikabanki.CurrencyRates.Get"
sidebar_label: "Kvikabanki.CurrencyRates.Get"
sidebar_position: 67
description: "Beiðni- og svarsamningur fyrir Kvikabanki.CurrencyRates.Sækja Bifrastar-skilaboðagerð."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálpar-codeunit skilaboðagerðarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálpar-codeunitinu í forritinu, ekki þessari skrá.
:::


Reads Kvika banki currency rates of a given Gerð fyrir a date.

**Stefna:** Outbound  
**Efnisgerð:** text/json

## Beiðni
```json
{
  "currencyType": "NoteRate",   // NoteRate | ExchangeRate | CustomsRate
  "date":         "2026-01-01"  // required (ISO)
}
```

## Svar
Skilar `status`, `currencyType`, `date`, `returned`, a `rates` array (`currencyCode`, `sellingRate`, `buyingRate`, `customsRate`, `timeStamp`), og `logEntryNo`.

## Errors
- `'currencyType' must be one of: NoteRate, ExchangeRate, CustomsRate`
- `'date' (ISO YYYY-MM-DD) is required`


