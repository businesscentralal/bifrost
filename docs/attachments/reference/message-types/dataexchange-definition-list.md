---
id: dataexchange-definition-list
title: "DataExchange.Definition.List"
sidebar_label: "DataExchange.Definition.List"
sidebar_position: 2
description: "Request and response contract for the DataExchange.Definition.List Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs-from-source.mjs`. Edit the help codeunit in the app, not this file.
:::


Lists Data Exchange definitions and the Data Exchange Type codes that reference each one.

## Metadata
- **Direction:** Outbound
- **Content-Type:** text/json
- **Invoke:** call the `call_message_type` tool with `type` = `DataExchange.Definition.List` and the parameters below as the `data` object.
- **Routing:** No `storageCode`. Optional filters narrow the definition list.

## Parameters

| Parameter | Required | Type | Description |
|---|---|---|---|
| `type` | No | string | Definition type enum name, for example `Generic Import` or `Payment Export`. Omit to return every definition. |
| `direction` | No | string | `Import` or `Export`. A definition matches when its type name contains that word. |

## Request example
```json
{ "direction": "Import" }
```

## Response
Success:
```json
{ "status": "Success", "data": ... }
```

`data` fields:

| Field | Type | Description |
|---|---|---|
| `count` | integer | Number of definitions after filters. |
| `definitions` | array | Rows with `code`, `name`, `type`, `fileType`, `readingWritingCodeunit`, `readingWritingXmlPort`, `extDataHandlingCodeunit`, `lineDefCount`, `mappingCount`, `usedByDataExchangeTypes`. |

Failure (the framework wraps any raised error):
```json
{ "status": "Error", "error": "<message>" }
```
Always branch on `status` before reading `data`.

## Common errors

| Error | Resolution |
|---|---|
| Unknown type name | Pass a Data Exch. Def type enum name, or omit `type`. |
| direction is not Import or Export | Omit `direction` or pass exactly one of those two words. |

## Next steps
- To read columns and field mappings → call `DataExchange.Definition.Get` (pass the returned `code`).
- To see which incoming-document type uses a definition → call `DataExchange.Type.List` (compare `dataExchDefCode` with `code`).

---
Data Exchange overview: request help for `Help.DataExchange.Get`.

## Errors and warnings
Errors and warnings follow the shared shape - see [Errors and warnings](/foundation/reference/errors/).

