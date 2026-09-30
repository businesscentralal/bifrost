---
id: dataexchange-entry-get
title: "DataExchange.Entry.Get"
sidebar_label: "DataExchange.Entry.Get"
sidebar_position: 3
description: "Request and response contract for the DataExchange.Entry.Get Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs-from-source.mjs`. Edit the help codeunit in the app, not this file.
:::


Returns one Data Exch. entry. Fields are paged. File content is included only when asked and only up to 1 MB.

## Metadata
- **Direction:** Outbound
- **Content-Type:** text/json
- **Invoke:** call the `call_message_type` tool with `type` = `DataExchange.Entry.Get` and the parameters below as the `data` object.
- **Routing:** Address the entry by `entryNo` from `DataExchange.Entry.List`.

## Parameters

| Parameter | Required | Type | Description |
|---|---|---|---|
| `entryNo` | **Yes** | integer | Data Exch. entry number. |
| `includeFields` | No | boolean | Include the paged `fields` array. Defaults to true. |
| `includeFileContent` | No | boolean | Include `contentBase64`. Defaults to false. Refused when the file is above 1 MB. |
| `skip` | No | integer | Field rows to skip when `includeFields` is true. Defaults to 0. Negative is an error. |
| `take` | No | integer | Field page size. Defaults to 100 when omitted or 0. Negative is an error. Clamped to 1000. |

## Request example
```json
{ "entryNo": 20, "includeFields": true, "skip": 0, "take": 50 }
```

## Response
Success:
```json
{ "status": "Success", "data": ... }
```

`data` fields:

| Field | Type | Description |
|---|---|---|
| `entryNo` | integer | The entry. The list fields (`dataExchDefCode`, `fileName`, `createdAt`, `hasFileContent`, `fieldCount`, `incomingEntryNo`, `relatedRecord`) are included beside it. |
| `fields` | array | Present when `includeFields` is true. Each item is `lineNo`, `columnNo`, `columnName`, `value`, `dataExchLineDefCode`. |
| `contentBase64` | string | Present only when `includeFileContent` is true and the file is at most 1 MB. |
| `contentLength` | integer | Byte length, present together with `contentBase64`. |

Failure (the framework wraps any raised error):
```json
{ "status": "Error", "error": "<message>" }
```
Always branch on `status` before reading `data`.

## Common errors

| Error | Resolution |
|---|---|
| Missing or unknown entryNo | Pass an `entryNo` from `DataExchange.Entry.List`. |
| File content above 1 MB | Omit `includeFileContent`. The call returns an error and no content. |

## Notes
## Pagination Limits
`skip` defaults to 0 and rejects negative values. `take` defaults to 100 when omitted or zero, rejects negative values, and is clamped to the hard maximum of 1000.


## Next steps
- To choose another entry → call `DataExchange.Entry.List`.

---
Data Exchange overview: request help for `Help.DataExchange.Get`.

## Errors and warnings
Errors and warnings follow the shared shape - see [Errors and warnings](/foundation/reference/errors/).

