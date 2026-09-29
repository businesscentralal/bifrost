---
id: dataexchange-entry-list
title: "DataExchange.Entry.List"
sidebar_label: "DataExchange.Entry.List"
sidebar_position: 4
description: "Request and response contract for the DataExchange.Entry.List Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs-from-source.mjs`. Edit the help codeunit in the app, not this file.
:::


Lists processed Data Exch. entries. Pagination uses Foundation skip/take rules.

## Metadata
- **Direction:** Outbound
- **Content-Type:** text/json
- **Invoke:** call the `call_message_type` tool with `type` = `DataExchange.Entry.List` and the parameters below as the `data` object.
- **Routing:** Filter by definition code and created-at range. Page with `skip` and `take`.

## Parameters

| Parameter | Required | Type | Description |
|---|---|---|---|
| `dataExchDefCode` | No | string | Only entries for this Data Exch. Def code. |
| `dateFrom` | No | string | Inclusive start, invariant date `YYYY-MM-DD` or datetime. |
| `dateTo` | No | string | Inclusive end. A date with no time covers that whole day. |
| `skip` | No | integer | Records to skip. Defaults to 0. Negative is an error. |
| `take` | No | integer | Page size. Defaults to 100 when omitted or 0. Negative is an error. Clamped to 1000. |

## Request example
```json
{ "dataExchDefCode": "SEPA CAMT", "take": 20 }
```

## Response
Success:
```json
{ "status": "Success", "data": ... }
```

`data` fields:

| Field | Type | Description |
|---|---|---|
| `count` | integer | Entries matching the filter, before paging. |
| `skip` | integer | Applied skip. |
| `take` | integer | Applied take. |
| `entries` | array | `entryNo`, `dataExchDefCode`, `dataExchLineDefCode`, `fileName`, `createdAt`, `hasFileContent`, `fieldCount`, `incomingEntryNo` (0 when not linked), `relatedRecord`. |

Failure (the framework wraps any raised error):
```json
{ "status": "Error", "error": "<message>" }
```
Always branch on `status` before reading `data`.

## Common errors

| Error | Resolution |
|---|---|
| Negative skip or take | Pass skip >= 0 and take >= 0. |

## Notes
## Pagination Limits
`skip` defaults to 0 and rejects negative values. `take` defaults to 100 when omitted or zero, rejects negative values, and is clamped to the hard maximum of 1000.


## Next steps
- To read fields for one entry → call `DataExchange.Entry.Get` (pass the returned `entryNo`).

---
Data Exchange overview: request help for `Help.DataExchange.Get`.

## Errors and warnings
Errors and warnings follow the shared shape - see [Errors and warnings](/foundation/reference/errors/).

