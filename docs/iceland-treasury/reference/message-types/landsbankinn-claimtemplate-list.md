---
id: landsbankinn-claimtemplate-list
title: "Landsbankinn.ClaimTemplate.List"
sidebar_label: "Landsbankinn.ClaimTemplate.List"
sidebar_position: 108
description: "Request and response contract for the Landsbankinn.ClaimTemplate.List Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


Lists claim templates (kröfusniðmát) at Landsbankinn.

API reference: https://developers.landsbankinn.is/docs/documentation-external-claimtemplates/1/routes/ClaimTemplates/get

## Request
```json
{
  "claimantNationalId": "6306251060",  // optional — filter by claimant
  "status": "active",                  // optional: active, deleted
  "type": "primaryCollection",         // optional: primaryCollection, secondaryCollection, optionalCollection
  "skip": 0,                           // optional — records to skip (default 0)
  "take": 50                           // optional — max records to return (default 10000)
}
```

All parameters optional. Returns active templates by default.
`skip`/`take` are mapped to the API's `page`/`perPage` pagination.

## Response
```json
{
  "data": [ { "id": "884", "name": "Reikningar", "type": "primaryCollection", ... } ],
  "page": 1,
  "perPage": 50,
  "totalItems": 3,
  "logEntryNo": 123
}
```

