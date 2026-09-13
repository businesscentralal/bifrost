---
id: changelog-field-enabled
title: "ChangeLog.Field.Enabled"
sidebar_label: "ChangeLog.Field.Enabled"
sidebar_position: 3
description: "Beiðni- og svarsamningur fyrir ChangeLog.Field.Enabled Bifröst skilaboðategund."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálparkóða skilaboðategundarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálparkóðanum í forritinu, ekki þessari skrá.
:::


## Yfirlit
Reports whether a specific tafla Reitur er covered með the BC Change Log Setup, og whether the Bifrost change-log skrifa guard would allow restoring it.

## Stefna
Útgående

## Response Content Gerð
`text/json`

## Beiðnibreytur
| Reitur | Gerð | áskilið | Lýsing |
|-------|------|----------|-------------|
| tableId / tableNumber / tableName | Int eða Text | Yes | Identifies the tafla |
| fieldNo / fieldName | Int eða Text | Yes | Identifies the Reitur |

## Dæmi um beiðni
```json
{
  "type": "ChangeLog.Field.Enabled",
  "data": { "tableId": 18, "fieldNo": 2 }
}
```

## Uppbygging svars
```json
{
  "status": "Success",
  "changeLogEnabled": true,
  "changelogWriteGuardEnabled": true,
  "tableNo": 18, "tableName": "Customer",
  "fieldNo": 2, "fieldName": "Name",
  "fieldCovered": true,
  "fieldWriteGuardBypassed": false
}
```

## Result Fields
| Reitur | Gerð | Lýsing |
|-------|------|-------------|
| changeLogEnabled | sanngildi | BC global Change Log Activated flag |
| changelogWriteGuardEnabled | sanngildi | Bifrost change-log skrifa guard er enabled |
| fieldCovered | sanngildi | Reitur er tracked með Change Log Setup (Insert/Modify/Delete) |
| fieldWriteGuardBypassed | sanngildi | The skrifa guard would allow writes til this Reitur |

## Villur
| Condition | Villa message |
|-----------|---------------|
| Unsupported Reitur Gerð | `Field type is not supported for change log tracking.` |

## Tengdar skilaboðategundir
- `ChangeLog.Field.History`
- `ChangeLog.Field.Restore`
- `ChangeLog.Records.Delta`

