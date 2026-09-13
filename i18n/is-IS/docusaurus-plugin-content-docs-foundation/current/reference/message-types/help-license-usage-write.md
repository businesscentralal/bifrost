---
id: help-license-usage-write
title: "Help.License.Usage.Write"
sidebar_label: "Help.License.Usage.Write"
sidebar_position: 63
description: "Beiðni- og svarsamningur fyrir Help.License.Usage.Write Bifröst skilaboðategund."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálparkóða skilaboðategundarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálparkóðanum í forritinu, ekki þessari skrá.
:::


Writes usage skjöl til the Cosmos DB license collection using the sama skjal
id formula og WriteUsageDocument call as the production daily sync.

## Explicit færslur
```json
{
  "entries": [
    { "date": "2026-06-01", "licenseType": "User", "quantity": 4213 },
    { "date": "2026-06-01", "licenseType": "App Registration", "quantity": 831 }
  ]
}
```

## Random data generation
```json
{ "days": 14, "maxQuantity": 8000 }
```
Writes one færsla per pool per day fyrir the síðasta `days` days (Sjálfgefið 7),
random quantity 1–`maxQuantity` (Sjálfgefið 5000).

## Response
```json
{ "status": "Success", "written": 14, "documents": [ { "id": "...", ... } ] }
```

