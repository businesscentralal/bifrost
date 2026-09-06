---
id: field-translation-set
title: "Field.Translation.Set"
sidebar_label: "Field.Translation.Set"
sidebar_position: 33
description: "Request and response contract for the Field.Translation.Set Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


## Overview

Writes or deletes a BC system translation for a single field on a single record in a specific language. Wraps codeunit `3711 "Translation"`.

## Direction

Inbound (write).

## Response Content Type

`text/json`

## Idempotency

Replaces any existing translation for the (record, field, language) tuple. Sending the same payload repeatedly is safe.

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
| `lcid` | int | yes | Windows Language Identifier. |
| `value` | text | no | Translation text (max 2048 chars). Omit or send empty string to delete. |

## Request Example

```json
{
  "tableId": 18,
  "systemId": "11111111-2222-3333-4444-555555555555",
  "fieldId": 2,
  "lcid": 1030,
  "value": "Viðskiptavinur"
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
| `systemId` | GUID | Echo of record SystemId. |
| `fieldId` | int | Echo of requested field number. |
| `lcid` | int | Echo of requested language identifier. |
| `value` | text | The translation that was written (empty string when deleted). |

## Errors

- `Request must specify systemId or id parameter (record SystemId as GUID).`
- `Request must specify fieldId or fieldNo parameter.`
- `Request must specify lcid parameter (language identifier).`
- Standard table-resolution errors when subject/`tableId` cannot be resolved.
- Record-open errors when SystemId is not found in the target table.

## Notes

- A blank or omitted `value` removes the translation row for the (record, field, language) tuple.
- `value` is truncated at 2048 characters before being passed to `Translation.Set`.

## Related Message Types

- `Field.Translation.Get`
- `Field.Translations.Get`

