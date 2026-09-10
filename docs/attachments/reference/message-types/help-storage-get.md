---
id: help-storage-get
title: "Help.Storage.Get"
sidebar_label: "Help.Storage.Get"
sidebar_position: 1
description: "Request and response contract for the Help.Storage.Get Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


This connector exposes the Business Central **External File Storage** facade as Bifrost message types, giving read/write access to cloud storage (Azure Blob, Azure File Share, SharePoint, and any other registered External File Storage connector) from Business Central and from external callers.

Message types are **outbound** (read/query) or **inbound** (write); all exchange JSON (`Content-Type: text/json`). Invoke any of them with the `call_message_type` tool, passing `type` = the message type name and `data` = its parameters.

## Release information

- **Release:** Initial release
- **Version:** 28.0.11.0
- **Supported locale(s):** en-US, is-IS
- **Supported runtime:** Business Central 28 / runtime 17.0

## Getting started

Recommended order for an automated caller:

1. Call `Storage.Account.List` to discover the `storageCode` values you may use. Do not guess a code.
2. Request the per-type help (`get_message_type_help`) for the operation you intend to call to confirm its exact parameters and its **Next steps**.
3. Call the operation with a chosen `storageCode` and the operation's parameters.
4. Inspect `status` first: on `Error`, read `error` and correct the request before retrying; on `Success`, read `data`.

## Agent workflows

Every per-type help document ends with a **Next steps** section naming the exact follow-up message type and the field to carry forward, so you can chain calls without guessing. The common journeys:

**Upload a large file to external storage** (too big for a single `Storage.File.Create`):
1. `Storage.Upload.Begin` with `storageCode` + `fileName` \u2192 returns `uploadId`, `path`, `chunkSizeHint`.
2. `Storage.Upload.Append` once per chunk \u2014 read at most `chunkSizeHint` RAW bytes, base64-encode that slice on its own, send with `uploadId` and `sequence` = 1, 2, 3, ...
3. `Storage.Upload.Commit` with `uploadId` \u2192 writes the file and returns the final `path` and `contentLength`.

**Upload a large file directly to a record** (no external storage needed):
1. `Storage.Upload.Begin` with just `fileName` (omit `storageCode`) \u2192 creates a buffer-only session.
2. `Storage.Upload.Append` once per chunk (same as above).
3. `Storage.Upload.CommitToRecord` with `uploadId` + record address (`tableId`/`no` or `recordSystemId`) \u2192 assembles chunks and stores in the database.
   - Default target is `DocumentAttachment` (any master record, sales document, posted document).
   - Set `target` = `IncomingDocument` to create an incoming document instead.

**Attach an uploaded file to an incoming document:**
4. `Storage.Attachment.CreateLinked` with the `storageCode` + `path` from commit → creates (or reuses) an incoming document, returns `incomingDocumentEntryNo`.
5. `Incoming.Document.Get` with that entry no as `subject` → confirms the attachment; its content is served transparently from storage.

**Attach a file to any master record** (customer, vendor, fixed asset, G/L account, bank account, ...):
- Inline: `Storage.Attachment.CreateForRecord` with `tableId`/`tableName` + `no`/`recordSystemId` + `content` (base64) + `fileName`.
- From storage (born offloaded): same call but pass `storageCode` + `path` instead of `content`. The file stays in storage and is served on demand.
- Copy from existing attachment: same call but pass `sourceTarget` + `sourceSystemId` instead of `content`. Server-side copy, nothing crosses the wire.
- Each storage path can only be linked to one attachment; use a separate upload per attachment.

**Offload an existing BC attachment** then bring it back: `Storage.Attachment.Offload` → `Storage.Attachment.Restore`. Works for both `DocumentAttachment` and `IncomingDocument` targets.

### Chunking rules (precise)

- A chunk is at most `chunkSizeHint` **raw** bytes (currently 49152, about 48 KB).
- Base64-encode each chunk **independently**; never base64 the whole file and slice the resulting text — the chunk boundaries would not decode.
- `sequence` is 1-based and must be contiguous with no gaps by commit; re-sending a sequence replaces that chunk (retries are safe).
- Pass `declaredSize` (total bytes) at Begin so commit verifies nothing was lost.
- A session is private to the caller and is pruned automatically if never committed.

## Routing

Every request carries a **`storageCode`** that selects a row in **`Bifrost Storage Setup`**. Each row binds the code to a registered Business Central file account (a connector plus an account) and an optional **`Base Path`** prefix that is prepended to every path. The connector apps own authentication and secrets — this connector never stores credentials.

Discover the configured codes with `Storage.Account.List`. The `path`, `sourcePath`, and `targetPath` values are relative to the connection's base path and use forward slashes (for example `dir/sub/file.txt`).

## Response envelope

Every message type returns the same envelope:

- Success — `{ "status": "Success", "data": { ... } }`
- Failure — `{ "status": "Error", "error": "<message>" }`

File content is carried as base64 in `contentBase64`. Existence checks return `{ "path": ..., "exists": true|false }`.

## Message types

### Discovery

| Message type | Required parameters | Description |
|---|---|---|
| `Help.Storage.Get` | _none_ | Returns this Markdown overview. |
| `Storage.Account.List` | _none_ | Lists the configured storage connections (codes and connectors; no secrets). |

### Files

| Message type | Required parameters | Description |
|---|---|---|
| `Storage.File.Exists` | `storageCode`, `path` | Reports whether a file exists. |
| `Storage.File.Get` | `storageCode`, `path` | Downloads a file as base64. |
| `Storage.File.Create` | `storageCode`, `path`, `contentBase64` | Uploads a file (overwrites where supported). |
| `Storage.File.Delete` | `storageCode`, `path` | Deletes a file. |
| `Storage.File.Copy` | `storageCode`, `sourcePath`, `targetPath` | Copies a file. |
| `Storage.File.Move` | `storageCode`, `sourcePath`, `targetPath` | Moves (renames) a file. |
| `Storage.File.List` | `storageCode`, `path` | Lists the files in a directory. |

### Directories

| Message type | Required parameters | Description |
|---|---|---|
| `Storage.Directory.Exists` | `storageCode`, `path` | Reports whether a directory exists. |
| `Storage.Directory.Create` | `storageCode`, `path` | Creates a directory. |
| `Storage.Directory.Delete` | `storageCode`, `path` | Deletes a directory. |
| `Storage.Directory.List` | `storageCode`, `path` | Lists the subdirectories of a directory. |

### Attachments

Move a Business Central attachment's file out to storage and back. While offloaded, the file is removed from the database but stays transparently available to existing processes.

| Message type | Required parameters | Description |
|---|---|---|
| `Storage.Attachment.Offload` | `target`, `systemId`, `storageCode` | Moves an attachment's file to storage and clears it from the database. |
| `Storage.Attachment.Restore` | `target`, `systemId` | Brings an offloaded attachment's file back into the database and deletes the remote copy. |
| `Storage.Attachment.CreateLinked` | `storageCode`, `path`, `fileName` | Attaches a file already in storage to a new or existing incoming document, served transparently from storage. |
| `Storage.Attachment.CreateForRecord` | `tableId`/`tableName`, `no`/`recordSystemId`, content source | Creates a document attachment on any record (customer, vendor, fixed asset, G/L account, ...) from inline base64, from storage, or by copying an existing attachment. |

`target` is `IncomingDocument` or `DocumentAttachment`; `systemId` is the SystemId of the attachment record. `Storage.Attachment.Offload` also accepts an optional `folderPath` (one or more subfolders) that chooses where the file is stored; the file name is appended automatically. Omitting it for an incoming document yields a navigable default — `bifrost-attachments/incoming-documents/{year}/{entry no.}/{file name}` — so the blob traces back to its document.

`Storage.Attachment.CreateForRecord` addresses the host record with `tableId`/`tableName` plus `no` or `recordSystemId`. It accepts three content sources — inline base64, a file in storage, or a copy from an existing attachment — but exactly one per call. Tables with a single Code primary key (Customer, Vendor, Fixed Asset, G/L Account, Bank Account, ...) can be addressed by `no`; all others use `recordSystemId`.

### Chunked uploads

Deliver a large file as a sequence of small chunks when it is too big for a single `Storage.File.Create` call or a single inline `content` parameter. Begin a session, append the file in pieces (about 48 KB of raw bytes each, base64-encoded), then commit — either to external storage or directly to a record attachment.

| Message type | Required parameters | Description |
|---|---|---|
| `Storage.Upload.Begin` | `fileName` (+ optional `storageCode`) | Opens a session and returns an `uploadId`. Omit `storageCode` for a buffer-only session. |
| `Storage.Upload.Append` | `uploadId`, `sequence`, `contentBase64` | Appends one chunk (re-sending a sequence replaces it). |
| `Storage.Upload.Commit` | `uploadId` | Assembles the chunks and writes the file to external storage (requires `storageCode` on the session). |
| `Storage.Upload.CommitToRecord` | `uploadId`, record address | Assembles the chunks and attaches directly to a record without external storage. |
| `Storage.Upload.Abort` | `uploadId` | Discards the session without writing. |
| `Storage.Upload.Status` | `uploadId` | Reports progress and state. |

Each upload session is private to the user that created it, so concurrent callers never see one another's in-flight chunks. Sessions left uncommitted are pruned automatically by a retention policy.

Request the per-type help document for any message type to get its full parameter table, request and response examples, and common errors.

## Connector notes

- **Accounts are registered in Business Central.** Configure connectors and accounts through the standard File Account setup; this connector references them by id and never stores credentials.
- **Directory semantics depend on the connector.** Object stores such as Azure Blob have no native directories — some connectors emulate them with zero-byte placeholder markers, others treat a folder as existing only once it contains a file. Use `Storage.Directory.Exists` to confirm rather than assuming.
- **Create overwrites.** `Storage.File.Create` replaces an existing file on connectors that support overwrite.
- **Paths can be case-sensitive** on cloud back ends — match the stored casing exactly.
- **Offloaded attachments stay transparent.** After `Storage.Attachment.Offload`, processes that read the file through the standard accessors keep working; the content is fetched from storage on demand. If the storage connection is unavailable the read fails rather than returning an empty file.

## Initial release boundaries

- Help documents are authored for machine-readable call guidance and deterministic request chaining.
- The connector intentionally routes through configured External File Storage accounts and does not manage credentials.
- Message contracts follow the common Bifrost response envelope with `status` and either `data` or `error`.

