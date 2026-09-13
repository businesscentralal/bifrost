---
id: help-license-reset
title: "Help.License.Reset"
sidebar_label: "Help.License.Reset"
sidebar_position: 60
description: "Beiðni- og svarsamningur fyrir Help.License.Reset Bifröst skilaboðategund."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálparkóða skilaboðategundarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálparkóðanum í forritinu, ekki þessari skrá.
:::


Deletes every Cosmos skjal (account + license + usage) fyrir the current tenant og
clears the locally cached remaining-quota values og sync markers so the next
Help.License.Sync starts úr a clean slate.

## Full reset (Sjálfgefið)
```json
{}
```

## Fine-grained
```json
{
  "cosmos": true,
  "cache":  true,
  "dryRun": false
}
```

## Response
```json
{
  "status": "Success",
  "tenantIdHash": "...",
  "dryRun": false,
  "cosmos": { "deleted": 17, "byType": { "account": 1, "license": 2, "usage": 14 } },
  "cache":  { "userRemainingCleared": true, "appRemainingCleared": true, "lastSyncCleared": true, "scheduledCleared": true },
  "documents": [ { "id": "...", "docType": "..." } ]
```

