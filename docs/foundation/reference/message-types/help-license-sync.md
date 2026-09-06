---
id: help-license-sync
title: "Help.License.Sync"
sidebar_label: "Help.License.Sync"
sidebar_position: 62
description: "Request and response contract for the Help.License.Sync Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


## Overview
Forces an immediate **usage sync** for the current company. It reports each completed day's chargeable message counts (per pool) to Cosmos, refreshes the cached remaining quota for the User and App Registration pools, and resets the reported messages.

Use this when:
- Additional licenses were just purchased and you want the new remaining quota reflected immediately (instead of waiting for the next daily sync).
- You want to push the latest usage to the licensing service now.

The same sync runs automatically once per day, triggered by the first chargeable message of the day.

## Direction
Outbound

## Response Content Type
`text/json`

## Permission Requirements
No special licensing permissions are required.

## Request Parameters
None. The sync always operates on the caller's own tenant and company context.

## Request Example
```json
{ "type": "Help.License.Sync" }
```

## Success Response Shape
```json
{
  "status": "Success",
  "result": {
    "tenantIdHash": "…", "companyIdHash": "…", "companyName": "…",
    "user": { "remaining": 820, "valid": true },
    "appRegistration": { "remaining": 1140, "valid": true }
  }
}
```

### Response Fields
| Field | Type | Description |
|-------|------|-------------|
| status | Text | `Success` when the sync completed, `Error` otherwise. |
| result.tenantIdHash | Text | Hashed tenant identifier (include when requesting a license). |
| result.companyIdHash | Text | Hashed company identifier used when reporting usage. |
| result.user / result.appRegistration | Object | Per-pool `remaining` (null when unknown) and `valid` flag. |

## Error Response Shape
```json
{
  "status": "Error",
  "error": "License refresh failed: ..."
}
```

## Behavior
- **Per company.** Usage is reported per hashed company under the hashed tenant.
- **Idempotent.** Usage documents have stable ids, so repeated calls do not double-count.
- **Synchronous.** Returns after the sync attempt; the result reflects the refreshed remaining quota.

## Related Message Types
- `Help.Bifrost.Get` — returns the same license status without forcing a sync.
- `Help.WhoAmI.Get` — check current user identity and permissions.

