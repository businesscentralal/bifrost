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


Clears licensing records (account, license, and usage entries) for the current tenant at the
licensing service and clears the locally cached remaining-quota values and sync markers so the
next `Help.License.Sync` starts from a clean slate. Intended for test and support scenarios.

## Full reset (default)
```json
{}
```

## Fine-grained

Optional flags select whether remote licensing records and/or the local cache are cleared, and
whether to run as a dry run (report what would be cleared without applying changes):

```json
{
  "cache": true,
  "dryRun": false
}
```

## Response
```json
{
  "status": "Success",
  "tenantIdHash": "...",
  "dryRun": false,
  "cache":  { "userRemainingCleared": true, "appRemainingCleared": true, "lastSyncCleared": true, "scheduledCleared": true },
  "documents": [ { "id": "...", "docType": "..." } ]
}
```
