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
Forces an immediate **usage sync** fyrir the current company. It reports hver completed day's chargeable message counts (per pool) til Cosmos, refreshes the cached remaining quota fyrir the User og App Registration pools, og Endurstillir the reported messages.

nota this þegar:
- Additional licenses were just purchased og you want the ný remaining quota reflected immediately (instead of waiting fyrir the next daily sync).
- You want til push the latest usage til the licensing service now.

The sama sync runs automatically once per day, triggered með the fyrsta chargeable message of the day.

## Stefna
Útgående

## Response Content Gerð
`text/json`

## heimild Requirements
No special licensing heimildir eru áskilið.

## Beiðnibreytur
None. The sync always operates on Kallandinn's own tenant og company context.

## Dæmi um beiðni
```json
{ "type": "Help.License.Sync" }
```

## Tókst Uppbygging svars
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

### Svarreitir
| Reitur | Gerð | Lýsing |
|-------|------|-------------|
| status | Text | `Success` þegar the sync completed, `Error` otherwise. |
| result.tenantIdHash | Text | Hashed tenant identifier (include þegar requesting a license). |
| result.companyIdHash | Text | Hashed company identifier notað þegar reporting usage. |
| result.user / result.appRegistration | hlutur | Per-pool `remaining` (null þegar unknown) og `valid` flag. |

## Villa Uppbygging svars
```json
{
  "status": "Error",
  "error": "License refresh failed: ..."
}
```

## Behavior
- **Per company.** Usage er reported per hashed company under the hashed tenant.
- **endurtekningarþolið.** Usage skjöl have stable ids, so repeated calls do ekki double-count.
- **Synchronous.** Skilar eftir the sync attempt; the result reflects the refreshed remaining quota.

## Tengdar skilaboðategundir
- `Help.Bifrost.Get` — Skilar the sama license status án forcing a sync.
- `Help.WhoAmI.Get` — check current user identity og heimildir.

