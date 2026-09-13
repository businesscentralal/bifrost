---
id: help-nextlineno-get
title: "Help.NextLineNo.Get"
sidebar_label: "Help.NextLineNo.Get"
sidebar_position: 66
description: "Beiðni- og svarsamningur fyrir Help.NextLineNo.Get Bifröst skilaboðategund."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálparkóða skilaboðategundarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálparkóðanum í forritinu, ekki þessari skrá.
:::


## Yfirlit
Skilar the next available `Line No.` fyrir a tafla whose síðasta primary-key Reitur er an heiltala (Sales Line, Gen. dagbók Line, Job dagbók Line, etc.). Resolves the parent færsla either með an `id` (SystemId) eða með supplying the parent primary key fields, then finds the highest fyrirliggjandi line númer og adds the increment.

## Stefna
Útgående

## Response Content Gerð
`text/json`

## Identifier Resolution
1. tafla: `tableName` / `tableNumber` / `tableNo` / `tableId` in request JSON, eða `subject` (áskilið)
2. Parent færsla: `id` in request JSON (takes precedence) **eða** `primaryKey` hlutur whose keys match parent PK Reitur JSON names

## Beiðnibreytur
| Reitur | Gerð | áskilið | Lýsing |
|-------|------|----------|-------------|
| tableName / tableNumber / tableNo / tableId | Text eða heiltala | Yes (via JSON eða subject) | Target line tafla |
| id | GUID | One of `id` eða `primaryKey` | SystemId of hvaða fyrirliggjandi line under the parent |
| primaryKey | hlutur | One of `id` eða `primaryKey` | Parent PK fields keyed með JSON Reitur Heiti (e.g. `DocumentType`, `DocumentNo_`) |
| increment | heiltala | No | Step added til the síðasta line númer, Sjálfgefið 10000, verður að be > 0 |

## Request Examples
Mode A (primaryKey):
```json
{
  "type": "Help.NextLineNo.Get",
  "subject": "Sales Line",
  "data": {
    "primaryKey": { "DocumentType": "Order", "DocumentNo_": "SO-1023" }
  }
}
```
Mode B (id of hvaða fyrirliggjandi line):
```json
{
  "type": "Help.NextLineNo.Get",
  "subject": "Sales Line",
  "data": { "id": "a1b2c3d4-...", "increment": 1000 }
}
```

## Uppbygging svars
`primaryKey` should echo the parent PK fields og adds the resolved line númer Reitur með the next Gildi.
```json
{
  "status": "Success",
  "primaryKey": { "DocumentType": "Order", "DocumentNo_": "SO-1023", "LineNo_": 50000 }
}
```

> ⚠️ **Known behavior — parent fannst ekki:** þegar the parent skjal does ekki exist (no lines match the filter), `LineNo_` er correctly returned as `increment` (Sjálfgefið 10000). However, the other `primaryKey` fields in Svarið reflect BC Sjálfgefið Reitur values — e.g. the fyrsta enum ordinal fyrir Option fields (such as `"DocumentType": "Quote"`) og an empty strengur fyrir Code/Text — rather than the values you supplied. **Always nota your input `primaryKey` values as the canonical parent key, ekki the echoed response values.** This er a known implementation limitation.


## Villur
| Condition | Villa message |
|-----------|---------------|
| síðasta PK Reitur er ekki heiltala | `The last primary key field of table '{table}' ({field}) is not an Integer field.` |
| Less than 2 PK fields | `Table '{table}' must have at least two primary key fields.` |
| Neither `primaryKey` nor `id` supplied | `Either 'primaryKey' or 'id' must be provided.` |
| vantar áskilið PK Reitur in `primaryKey` | `Missing value for primary key field '{field}'.` |
| SystemId fannst ekki | `Record with SystemId '{guid}' not found in table '{table}'.` |
| `increment` &lt;= 0 | `Increment must be greater than zero.` |
| No lesa heimild | `You do not have read permission on table '{table}'.` |
| Unknown enum Gildi in PK | `Invalid value '{value}' for enum field '{field}'.` |

## Tengdar skilaboðategundir
- `Data.Records.Set`
- `Help.Fields.Get`

