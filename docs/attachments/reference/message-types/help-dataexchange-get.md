---
id: help-dataexchange-get
title: "Help.DataExchange.Get"
sidebar_label: "Help.DataExchange.Get"
sidebar_position: 6
description: "Request and response contract for the Help.DataExchange.Get Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs-from-source.mjs`. Edit the help codeunit in the app, not this file.
:::


Read-only view of Business Central Data Exchange definitions, incoming-document types and processed entries. Nothing is uploaded or written.

Message types are outbound and exchange JSON. Invoke one with `call_message_type`, `type` = the message type name and `data` = its parameters.

## Pipeline

A definition (`Data Exch. Def`) describes a file: its type (import or export), file type, the reading/writing codeunit or XMLport, line definitions, column definitions and field mappings onto a target table.

An incoming-document purpose is a `Data Exchange Type`: a code that points at one definition. The feedback, validation and data-handling codeunits live on that definition and are returned with the type.

A processed file is a `Data Exch.` entry (the audit row: file name, definition, optional file content) plus `Data Exch. Field` rows (one parsed value per line and column).

## Phases

| Phase | What it adds | Status in this release |
|---|---|---|
| 0 Discovery | `Help.DataExchange.Get`, `DataExchange.Definition.List`/`Get`, `DataExchange.Type.List`, `DataExchange.Entry.List`/`Get` | Available |
| 2 Incoming documents | upload to an incoming document with a Data Exchange Type | Not in this release |
| 1 Generic import | `DataExchange.Import.Run`, `Storage.Upload.CommitToDataExchange`, process and delete | Not in this release |
| 3 Export | `DataExchange.Export.Run` | Not in this release |
| 4 Definition management | import and export a definition as XML | Not in this release |

## Decision tree

- Need to see which definitions exist before uploading anything → `DataExchange.Definition.List`.
- Need the columns and field mappings a definition expects → `DataExchange.Definition.Get` with that `code`.
- Need the incoming-document types and which definition each one uses → `DataExchange.Type.List`. An empty company returns `count` 0.
- Need processed files → `DataExchange.Entry.List`, then `DataExchange.Entry.Get` for one `entryNo`.
- Need to write a `Data Exch.` row → do not use `Data.Records.Set`. That write is blocked. The dedicated writers (`DataExchange.Import.Run` / `Storage.Upload.CommitToDataExchange`) arrive in a later phase.

## Chaining

1. `DataExchange.Definition.List` → read `code` (and `usedByDataExchangeTypes`).
2. `DataExchange.Definition.Get` with that `code` → read `lineDefs`, `columnDefs` and `mappings` before building a file.
3. `DataExchange.Type.List` → read `code` and `dataExchDefCode` when the caller is choosing an incoming-document type.
4. `DataExchange.Entry.List` → read `entryNo`.
5. `DataExchange.Entry.Get` with that `entryNo` → read `fields`. Pass `includeFileContent` true only when the file is at most 1 MB.

## Response envelope

- Success — `{ "status": "Success", "data": { ... } }`
- Failure — `{ "status": "Error", "error": "<message>" }`

Lists return `count` and a named array (`definitions`, `types` or `entries`). Entry list and entry field pages also return `skip` and `take`.

