---
id: help-license-purchase-write
title: "Help.License.Purchase.Write"
sidebar_label: "Help.License.Purchase.Write"
sidebar_position: 59
description: "Request and response contract for the Help.License.Purchase.Write Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


Writes license documents to Cosmos DB using the same WriteLicenseDocument call
as the install trial seed.

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
{ "status": "Success", "written": 2, "documents": [ { "id": "...", ... } ] }
```

