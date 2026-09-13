---
id: changelog-field-restore
title: "ChangeLog.Field.Restore"
sidebar_label: "ChangeLog.Field.Restore"
sidebar_position: 5
description: "Beiðni- og svarsamningur fyrir ChangeLog.Field.Restore Bifröst skilaboðategund."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálparkóða skilaboðategundarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálparkóðanum í forritinu, ekki þessari skrá.
:::


## Yfirlit
Restores a single Reitur Gildi úr BC Change Log færsla með writing the færsla's `Old Value` back via `FieldRef.Validate`. aðeins `Modification` færslur eru restorable. The skrifa goes through the Bifrost change-log skrifa guard, Reitur/tafla skrifa takmarkanir, og Reitur-takmörkun Athugar. The actual skrifa runs inside an isolated `Codeunit.Run` fyrir clean Villa handling.

## Stefna
Innkomandi

## Response Content Gerð
`text/json`

## Idempotency
ekki endurtekningarþolið. ef the current Reitur Gildi already equals the Gildi til restore, the call fails með `ValueAlreadyMatchesErr`.

## Modes
Provide **one** of:
- **Mode 1 — með færsla**: `entryNo` (tafla/Reitur/færsla eru derived úr the Change Log færsla)
- **Mode 2 — point-in-time**: `tableId`/`tableName` + `fieldNo`/`fieldName` + `recordSystemId` + `restoreToDateTime` (restores úr the latest Modification færsla at eða áður en that timestamp)

## Beiðnibreytur
| Reitur | Gerð | áskilið | Lýsing |
|-------|------|----------|-------------|
| entryNo | BigInteger | Mode 1 | Change Log færsla No. til restore úr |
| tableId / tableNumber / tableName | Int eða Text | Mode 2 | Identifies the tafla |
| fieldNo / fieldName | Int eða Text | Mode 2 | Identifies the Reitur |
| recordSystemId | GUID | Mode 2 | SystemId of the færsla |
| restoreToDateTime | DateTime | Mode 2 | Point-in-time anchor |

## Request Examples
Mode 1:
```json
{ "type": "ChangeLog.Field.Restore", "data": { "entryNo": 42 } }
```
Mode 2:
```json
{
  "type": "ChangeLog.Field.Restore",
  "data": {
    "tableId": 18, "fieldNo": 2,
    "recordSystemId": "a1b2c3d4-...",
    "restoreToDateTime": "2024-06-09T12:00:00Z"
  }
}
```

## Uppbygging svars
```json
{
  "status": "Success",
  "tableNo": 18, "tableName": "Customer",
  "recordSystemId": "a1b2c3d4-...",
  "fieldNo": 2, "fieldName": "Name",
  "previousValue": "Acme Inc.",
  "restoredValue": "Acme",
  "fromEntryNo": 42,
  "entryDateTime": "2024-06-09T09:00:00Z"
}
```

## Villur
| Condition | Villa message |
|-----------|---------------|
| vantar áskilið params | `Provide either entryNo (Mode 1) or tableName + recordSystemId + fieldNo + restoreToDateTime (Mode 2).` |
| recordSystemId vantar in Mode 2 | `recordSystemId is required for point-in-time restore.` |
| færsla fannst ekki | `Change log entry {entryNo} not found.` |
| No færsla fyrir dagsetning | `No change log entry found for the specified record, field, and date.` |
| ekki a Modification færsla | `Only Modification entries can be restored.` |
| Reitur skrifa-restricted | `Field {fieldNo} in table {tableId} is write-restricted.` |
| tafla skrifa-restricted | `Table {tableId} ({tableName}) is restricted from write operations.` |
| Reitur ekki writable | `Field {fieldNo} is not a writable field.` |
| færsla fannst ekki | `Record with SystemId {systemId} in table {tableName} not found.` |
| No-op | `Field {fieldName} already has the value {currentValue} — nothing to restore.` |
| Blocked með skrifa guard | `Field {fieldNo} in table {tableId} is not allowed by the change log write guard.` |
| Gildi conversion Mistókst | `Cannot convert value to field type.` |

## Tengdar skilaboðategundir
- `ChangeLog.Field.Enabled`
- `ChangeLog.Field.History`
- `ChangeLog.Records.Delta`

