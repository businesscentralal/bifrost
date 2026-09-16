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


Skrifar leyfisfærslur til leyfisþjónustunnar með sama ferli og prufusáðningin við uppsetningu.
Ætlað fyrir prófunar- og útvegunaratvik.

## Shorthand — both pools, trial-* ids
```json
{ "quantity": 5000 }
```

## Explicit entries
```json
{
  "entries": [
    { "licenseType": "User",             "quantity": 5000 },
    { "licenseType": "App Registration", "quantity": 5000 }
  ]
}
```
"id" is optional in each entry; defaults to trial-user/trial-app stable ids.

## Response
```json
{ "status": "Success", "written": 2, "documents": [ { "id": "...", "...": "..." } ] }
```
