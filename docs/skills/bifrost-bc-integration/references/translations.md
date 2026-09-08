---
id: translations
title: "Record and field translations"
sidebar_label: "Record and field translations"
sidebar_position: 21
description: "Translations that belong to data rather than to the user interface: reading and writing a single record field translation, reading all translations of a record, and how a language is identified by LCID. For captions and labels of the interface itself see…"
---

Translations that belong to data rather than to the user interface: reading and writing a single record field translation, reading all translations of a record, and how a language is identified by LCID. For captions and labels of the interface itself see [ui-translations.md](./ui-translations.md).

[← back to SKILL.md](../index.md) · originally sections 7.2 (Field.Translation.*), 14 of the single-file skill.

---

#### `Field.Translation.Get` — Read a single translation for a record field

Direction: **Outbound**. Uses BC codeunit 3711 "Translation" to retrieve the stored
system translation for one field on one record in a specific language.

```json
{
  "specversion": "1.0",
  "type": "Field.Translation.Get",
  "source": "MyApp v1.0",
  "subject": "Item",
  "data": "{\"systemId\":\"12345678-1234-1234-1234-123456789012\",\"fieldId\":3,\"lcid\":1030}"
}
```

| Parameter | Required | Type | Description |
|---|---|---|---|
| `tableName` / `tableNumber` / `subject` | Yes | string / integer | Target table |
| `systemId` / `id` | Yes | GUID | Record SystemId (without braces) |
| `fieldId` / `fieldNo` | Yes | integer | Target field number |
| `lcid` | Yes | integer | Windows Language ID (in request JSON `data`, not envelope) |

Response:
```json
{
  "status": "Success",
  "tableId": 27,
  "systemId": "12345678-1234-1234-1234-123456789012",
  "fieldId": 3,
  "lcid": 1030,
  "value": "Skrivebord i trae"
}
```

Errors: `"Request must specify systemId or id parameter"` · `"Request must specify fieldId or fieldNo parameter"` · `"Request must specify lcid parameter"`.

#### `Field.Translation.Set` — Write or delete a translation for a record field

Direction: **Inbound**. Uses BC codeunit 3711 "Translation" to set (or delete) the
system translation for one field on one record in a specific language.

```json
{
  "specversion": "1.0",
  "type": "Field.Translation.Set",
  "source": "MyApp v1.0",
  "subject": "Item",
  "data": "{\"systemId\":\"12345678-1234-1234-1234-123456789012\",\"fieldId\":3,\"lcid\":1036,\"value\":\"Description en français\"}"
}
```

| Parameter | Required | Type | Description |
|---|---|---|---|
| `tableName` / `tableNumber` / `subject` | Yes | string / integer | Target table |
| `systemId` / `id` | Yes | GUID | Record SystemId (without braces) |
| `fieldId` / `fieldNo` | Yes | integer | Target field number |
| `lcid` | Yes | integer | Windows Language ID (in request JSON `data`) |
| `value` | No | string | Translation text (max 2048 chars). Blank or omitted = delete. |

Response (same shape as Get):
```json
{
  "status": "Success",
  "tableId": 27,
  "systemId": "12345678-1234-1234-1234-123456789012",
  "fieldId": 3,
  "lcid": 1036,
  "value": "Description en français"
}
```

#### `Field.Translations.Get` — Read all translations for a record (plural)

Direction: **Outbound**. Retrieves translations for **all fields** (or a specific field)
on a record, optionally filtered by language. Returns an array.

```json
{
  "specversion": "1.0",
  "type": "Field.Translations.Get",
  "source": "MyApp v1.0",
  "subject": "Item",
  "data": "{\"systemId\":\"12345678-1234-1234-1234-123456789012\"}"
}
```

| Parameter | Required | Type | Description |
|---|---|---|---|
| `tableName` / `tableNumber` / `subject` | Yes | string / integer | Target table |
| `systemId` / `id` | Yes | GUID | Record SystemId (without braces) |
| `fieldId` / `fieldNo` | No | integer | Specific field (omit or 0 = all fields) |
| `lcid` | No | integer | Language filter (omit = all languages) |

Response:
```json
{
  "status": "Success",
  "tableId": 27,
  "systemId": "12345678-1234-1234-1234-123456789012",
  "translationCount": 4,
  "translations": [
    { "fieldId": 3, "languageId": 1030, "value": "Skrivebord i trae" },
    { "fieldId": 3, "languageId": 1036, "value": "Bureau en bois" },
    { "fieldId": 3, "languageId": 1039, "value": "Viðarskrifborð" },
    { "fieldId": 100, "languageId": 1030, "value": "Kontormøbel" }
  ]
}
```

When `fieldId` is specified, the response includes a `fieldId` top-level field. When `lcid` is specified, the response includes a `lcid` top-level field. Both are omitted when filtering was not requested.

---

## 14. Language Support (LCID)

Set `lcid` at the message envelope level (not inside `data`) to receive captions in a specific language.

| LCID | Language |
|---|---|
| 1033 | English (US) |
| 1039 | Icelandic |
| 1030 | Danish |
| 1031 | German |
| 1036 | French |
| 1034 | Spanish |
| 1043 | Dutch |
| 1053 | Swedish |
| 1044 | Norwegian (Bokmål) |

If omitted, uses the Default Language Code from Bifrost Setup.
