---
id: dataexchange-definition-get
title: "DataExchange.Definition.Get"
sidebar_label: "DataExchange.Definition.Get"
sidebar_position: 1
description: "Request and response contract for the DataExchange.Definition.Get Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs-from-source.mjs`. Edit the help codeunit in the app, not this file.
:::


Returns one Data Exchange definition, including line definitions, column definitions and field mappings, ordered by their keys.

## Metadata
- **Direction:** Outbound
- **Content-Type:** text/json
- **Invoke:** call the `call_message_type` tool with `type` = `DataExchange.Definition.Get` and the parameters below as the `data` object.
- **Routing:** Address the definition by `code` from `DataExchange.Definition.List`.

## Parameters

| Parameter | Required | Type | Description |
|---|---|---|---|
| `code` | **Yes** | string | Data Exch. Def code. |

## Request example
```json
{ "code": "SEPA CAMT" }
```

## Response
Success:
```json
{ "status": "Success", "data": ... }
```

`data` fields:

| Field | Type | Description |
|---|---|---|
| `code` | string | Definition code. The other list fields (`name`, `type`, `fileType`, codeunit and XMLport names, counts, `usedByDataExchangeTypes`) are included beside it. |
| `lineDefs` | array | `code`, `name`, `columnCount`, `dataLineTag`, `namespace`, ordered by line code. |
| `columnDefs` | array | `lineDef`, `columnNo`, `name`, `dataType`, `dataFormat`, `dataFormattingCulture`, `path`, `negativeSign`, `constant`, ordered by line code then column number. |
| `mappings` | array | `lineDef`, `tableId`, `tableName`, `mappingCodeunit`, `preMappingCodeunit`, `postMappingCodeunit`, `dataExchNoFieldId`, `useAsIntermediateTable`, and `fieldMappings` (`columnNo`, `fieldId`, `fieldName`, `optional`, `multiplier`, `overwriteValue`, `transformationRule`). |

Failure (the framework wraps any raised error):
```json
{ "status": "Error", "error": "<message>" }
```
Always branch on `status` before reading `data`.

## Common errors

| Error | Resolution |
|---|---|
| Missing code | Pass `code`. |
| Unknown code | Call `DataExchange.Definition.List` and use a returned `code`. |

## Next steps
- To list definitions again → call `DataExchange.Definition.List`.

---
Data Exchange overview: request help for `Help.DataExchange.Get`.

## Errors and warnings
Errors and warnings follow the shared shape - see [Errors and warnings](/foundation/reference/errors/).

