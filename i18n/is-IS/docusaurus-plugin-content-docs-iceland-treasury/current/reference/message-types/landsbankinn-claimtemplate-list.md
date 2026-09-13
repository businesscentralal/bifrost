---
id: landsbankinn-claimtemplate-list
title: "Landsbankinn.ClaimTemplate.List"
sidebar_label: "Landsbankinn.ClaimTemplate.List"
sidebar_position: 108
description: "Beiðni- og svarsamningur fyrir Landsbankinn.ClaimTemplate.Listi Bifrastar-skilaboðagerð."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálpar-codeunit skilaboðagerðarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálpar-codeunitinu í forritinu, ekki þessari skrá.
:::


Lists claim templates (kröfusniðmát) at Landsbankinn.

API reference: https://developers.landsbankinn.er/docs/documentation-external-claimtemplates/1/routes/ClaimTemplates/Sækja

## Beiðni
```json
{
  "claimantNationalId": "6306251060",  // optional — filter by claimant
  "status": "active",                  // optional: active, deleted
  "type": "primaryCollection",         // optional: primaryCollection, secondaryCollection, optionalCollection
  "skip": 0,                           // optional — records to skip (default 0)
  "take": 50                           // optional — max records to return (default 10000)
}
```

Allt parameters valfrjálst. Skilar active templates by default.
`skip`/`take` eru mapped til the API's `page`/`perPage` pagination.

## Svar
```json
{
  "data": [ { "id": "884", "name": "Reikningar", "type": "primaryCollection", ... } ],
  "page": 1,
  "perPage": 50,
  "totalItems": 3,
  "logEntryNo": 123
}
```


