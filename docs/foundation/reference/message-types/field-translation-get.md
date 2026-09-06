---
id: field-translation-get
title: "Field.Translation.Get"
sidebar_label: "Field.Translation.Get"
sidebar_position: 32
description: "Request and response contract for the Field.Translation.Get Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


## Overview

Returns the stored BC system translation for a single field on a single record in a specific language. Wraps codeunit `3711 "Translation"`.

## Direction

Outbound (read-only).

## Response Content Type

`text/json`

## Identifier Resolution

- Table: resolved via standard subject/`tableId`/`tableName` resolution.
- Record: resolved by SystemId (GUID) supplied as `systemId` or `id`.
- Field: resolved by `fieldId` or `fieldNo`.
- Language: resolved by `lcid` (Windows Language Identifier integer).

## Request Parameters

| Field | Type | Required | Notes |
|---|---|---|---|
| `tableId` / `tableName` | int / text | yes | Target table (also accepted via subject). |
| `systemId` / `id` | GUID | yes | Record SystemId. |
| `fieldId` / `fieldNo` | int | yes | Field number. |
| `lcid` | int | yes | Windows Language Identifier (e.g. `1030` is-IS, `1033` en-US). |

## Request Example

```json
{
  "tableId": 18,
  "systemId": "11111111-2222-3333-4444-555555555555",
  "fieldId": 2,
  "lcid": 1030
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
  "value": "Viðskiptavinur"
}
```

## Result Fields

| Field | Type | Description |
|---|---|---|
| `status` | text | `Success` or `Error`. |
| `tableId` | int | Echo of resolved table id. |
| `systemId` | GUID | Echo of record SystemId (format without braces). |
| `fieldId` | int | Echo of requested field number. |
| `lcid` | int | Echo of requested language identifier. |
| `value` | text | The translation, or empty string when no translation is stored. |

## Errors

- `Request must specify systemId or id parameter (record SystemId as GUID).`
- `Request must specify fieldId or fieldNo parameter.`
- `Request must specify lcid parameter (language identifier).`
- Standard table-resolution errors when subject/`tableId` cannot be resolved.
- Record-open errors when SystemId is not found in the target table.

## Notes

- An empty `value` means no translation row exists for the (record, field, language) tuple; the source-language caption is unaffected.
- Use `Field.Translation.Set` to write a translation, or `Field.Translations.Get` to retrieve multiple in one call.

## Related Message Types

- `Field.Translation.Set`
- `Field.Translations.Get`

