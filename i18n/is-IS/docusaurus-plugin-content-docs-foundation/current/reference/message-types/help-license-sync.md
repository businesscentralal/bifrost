---
id: help-license-sync
title: "Help.License.Sync"
sidebar_label: "Help.License.Sync"
sidebar_position: 62
description: "Beiðni- og svarsamningur fyrir Help.License.Sync Bifröst skilaboðategund."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálparkóða skilaboðategundarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálparkóðanum í forritinu, ekki þessari skrá.
:::


## Yfirlit
Þvingar samstillingu **notkunar** strax fyrir núverandi fyrirtæki. Hún tilkynnir
gjaldskyldan skilaboðafjölda hvers liðins dags (eftir potti) til leyfisþjónustunnar,
endurnýjar vistaðar eftirstöðvar fyrir Notanda- og Forritsskráningarpottana og
núllstillir tilkynntu skilaboðin.

Notaðu þetta þegar:
- Viðbótarleyfi voru nýlega keypt og þú vilt að nýjar eftirstöðvar endurspeglist strax
  (í stað þess að bíða eftir næstu daglegu samstillingu).
- Þú vilt ýta nýjustu notkuninni til leyfisþjónustunnar núna.

Sama samstilling keyrir sjálfkrafa einu sinni á dag, kveikt af fyrstu gjaldfæru
skilaboðum dagsins.

## Stefna
Út

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
