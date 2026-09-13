---
id: help-license-purchase-write
title: "Help.License.Purchase.Write"
sidebar_label: "Help.License.Purchase.Write"
sidebar_position: 59
description: "Beiðni- og svarsamningur fyrir Help.License.Purchase.Write Bifröst skilaboðategund."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálparkóða skilaboðategundarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálparkóðanum í forritinu, ekki þessari skrá.
:::


Writes license skjöl til Cosmos DB using the sama WriteLicenseDocument call
as the install trial seed.

## Shorthand — both pools, trial-* ids
```json
{ "quantity": 5000 }
```

## Explicit færslur
```json
{
  "entries": [
    { "licenseType": "User",             "quantity": 5000 },
    { "licenseType": "App Registration", "quantity": 5000 }
  ]
}
```
"id" er valfrjálst in hver færsla; defaults til trial-user/trial-app stable ids.

## Response
```json
{ "status": "Success", "written": 2, "documents": [ { "id": "...", ... } ] }
```

