---
id: field-translations-get
title: "Field.Translations.Get"
sidebar_label: "Field.Translations.Get"
sidebar_position: 34
description: "Request and response contract for the Field.Translations.Get Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


## Overview

Returns all stored BC system translations for a record. Optionally filtered to a single field and/or a single language. Wraps codeunit `3711 "Translation".GetTranslations`.

## Direction

Outbound (read-only).

## Response Content Type

`text/json`

## Identifier Resolution

- Table: resolved via standard subject/`tableId`/`tableName` resolution.
- Record: resolved by SystemId (GUID) supplied as `systemId` or `id`.
- Field (optional): `fieldId` or `fieldNo`; omit or pass `0` for all fields.
- Language (optional): `lcid` Windows Language Identifier; omit for all languages.

## Request Parameters

| Field | Type | Required | Notes |
|---|---|---|---|
| `tableId` / `tableName` | int / text | yes | Target table (also accepted via subject). |
| `systemId` / `id` | GUID | yes | Record SystemId. |
| `fieldId` / `fieldNo` | int | no | Restrict to a single field. `0` or absent returns all fields. |
| `lcid` | int | no | Restrict to a single language. Absent returns all languages. |

## Request Example

```json
{
  "tableId": 18,
  "systemId": "11111111-2222-3333-4444-555555555555"
}
```

## Response Shape (success)

```json
{
  "status": "Success",
  "tableId": 18,
  "systemId": "11111111-2222-3333-4444-555555555555",
  "fieldId": 2,
  "lcid": 1030,
  "translationCount": 2,
  "translations": [
    { "fieldId": 2, "languageId": 1030, "value": "Viðskiptavinur" },
    { "fieldId": 3, "languageId": 1030, "value": "Nafn 2" }
  ]
}
```

## Result Fields

| Field | Type | Description |
|---|---|---|
| `status` | text | `Success` or `Error`. |
| `tableId` | int | Echo of resolved table id. |
| `systemId` | GUID | Echo of record SystemId. |
| `fieldId` | int | Echoed only when the request filtered by field. |
| `lcid` | int | Echoed only when the request filtered by language. |
| `translationCount` | int | Number of entries in `translations`. |
| `translations[]` | array | One entry per stored translation. |
| `translations[].fieldId` | int | Field number. |
| `translations[].languageId` | int | Windows Language Identifier. |
| `translations[].value` | text | Translation text. |

## Errors

- `Request must specify systemId or id parameter (record SystemId as GUID).`
- Standard table-resolution errors when subject/`tableId` cannot be resolved.
- Record-open errors when SystemId is not found in the target table.

## Notes

- `translations` is empty when no translation rows exist for the record under the active filters.
- Use `Field.Translation.Get` for a single (field, language) lookup or `Field.Translation.Set` to write.

## Related Message Types

- `Field.Translation.Get`
- `Field.Translation.Set`

