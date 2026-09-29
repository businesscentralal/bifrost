---
id: dataexchange-type-list
title: "DataExchange.Type.List"
sidebar_label: "DataExchange.Type.List"
sidebar_position: 5
description: "Request and response contract for the DataExchange.Type.List Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs-from-source.mjs`. Edit the help codeunit in the app, not this file.
:::


Lists Data Exchange Type rows. A company with none returns count 0 and an empty array.

## Metadata
- **Direction:** Outbound
- **Content-Type:** text/json
- **Invoke:** call the `call_message_type` tool with `type` = `DataExchange.Type.List` and the parameters below as the `data` object.
- **Routing:** No request parameters.

## Request example
```json
{ }
```

## Response
Success:
```json
{ "status": "Success", "data": ... }
```

`data` fields:

| Field | Type | Description |
|---|---|---|
| `count` | integer | Number of Data Exchange Type rows. Zero when the company has none. |
| `types` | array | `code`, `description`, `dataExchDefCode`, `userFeedbackCodeunit`, `validationCodeunit`, `dataHandlingCodeunit`, and `type`. The three codeunit names and `type` are read from the linked Data Exch. Def. |

Failure (the framework wraps any raised error):
```json
{ "status": "Error", "error": "<message>" }
```
Always branch on `status` before reading `data`.

## Next steps
- To read the definition a type points at → call `DataExchange.Definition.Get` (pass `dataExchDefCode` as `code`).

---
Data Exchange overview: request help for `Help.DataExchange.Get`.

## Errors and warnings
Errors and warnings follow the shared shape - see [Errors and warnings](/foundation/reference/errors/).

