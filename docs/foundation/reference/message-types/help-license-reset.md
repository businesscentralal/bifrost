---
id: help-license-reset
title: "Help.License.Reset"
sidebar_label: "Help.License.Reset"
sidebar_position: 60
description: "Request and response contract for the Help.License.Reset Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


Deletes every Cosmos document (account + license + usage) for the current tenant and
clears the locally cached remaining-quota values and sync markers so the next
Help.License.Sync starts from a clean slate.

## Full reset (default)
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

