---
id: help-storage-get
title: "Help.Storage.Get"
sidebar_label: "Help.Storage.Get"
sidebar_position: 1
description: "Request and response contract for the Help.Storage.Get Bifröst message type."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálparkóðaeiningu skilaboðategundarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálparkóðaeiningunni í forritinu, ekki þessari skrá.
:::


This connector exposes the Business Central **External File Storage** facade as Bifrost message tegunds, giving read/write access to cloud storage (Azure Blob, Azure File Share, SharePoint, og any other registered External File Storage connector) úr Business Central og úr external callers.

Skilaboð tegunds eru **outbound** (read/query) eða **inbound** (write); allir exchange JSON (`Content-Type: text/json`). Kalla any of them með the `call_message_type` tool, passing `type` = the message tegund heiti og `data` = its parameters.

## Release information

- **Release:** Initial release
- **Version:** 28.0.11.0
- **Supported locale(s):** en-US, is-IS
- **Supported runtime:** Business Central 28 / runtime 17.0

## Getting started

Recommended order fyrir an automated caller:

1. Kallaðu á `Storage.Account.List` to discover the `storageCode` gildi you may use. Ekki guess a kóði.
2. Beiðni the per-tegund help (`get_message_type_help`) fyrir the operation you intend to call to confirm its exact parameters og its **Next steps**.
3. Kallaðu á the operation með a chosen `storageCode` og the operation's parameters.
4. Inspect `status` first: on `Error`, read `error` og correct the request áður en retrying; on `Success`, read `data`.

## Agent workflows

Every per-tegund help skjal ends með a **Next steps** section naming the exact follow-up message tegund og the field to carry forward, so you getur chain calls án guessing. The common journeys:

**Upload a large skrá to external storage** (too big fyrir a single `Storage.File.Create`):
1. `Storage.Upload.Begin` með `storageCode` + `fileName` \u2192 returns `uploadId`, `path`, `chunkSizeHint`.
2. `Storage.Upload.Append` once per chunk \u2014 read at most `chunkSizeHint` RAW bytes, base64-enkóði that slice on its own, send með `uploadId` og `sequence` = 1, 2, 3, ...
3. `Storage.Upload.Commit` með `uploadId` \u2192 writes the skrá og returns the final `path` og `contentLength`.

**Upload a large skrá directly to a færsla** (no external storage needed):
1. `Storage.Upload.Begin` með just `fileName` (omit `storageCode`) \u2192 creates a buffer-only session.
2. `Storage.Upload.Append` once per chunk (same as above).
3. `Storage.Upload.CommitToRecord` með `uploadId` + færsla address (`tableId`/`no` eða `recordSystemId`) \u2192 assembles chunks og stores in the database.
   - Default target er `DocumentAttachment` (any master færsla, sales skjal, posted skjal).
   - Stilltu `target` = `IncomingDocument` to create an incoming skjal instead.

**Attach an uploaded skrá to an incoming skjal:**
4. `Storage.Attachment.CreateLinked` með the `storageCode` + `path` úr commit → creates (or reuses) an incoming skjal, returns `incomingDocumentEntryNo`.
5. `Incoming.Document.Get` með that entry no as `subject` → confirms the attachment; its innihald er served transparently úr storage.

**Attach a skrá to any master færsla** (viðskiptavinur, vendor, fixed asset, G/L account, bank account, ...):
- Inlína: `Storage.Attachment.CreateForRecord` með `tableId`/`tableName` + `no`/`recordSystemId` + `content` (base64) + `fileName`.
- From storage (born offloaded): same call but pass `storageCode` + `path` instead of `content`. The skrá stays in storage og er served on demand.
- Copy úr existing attachment: same call but pass `sourceTarget` + `sourceSystemId` instead of `content`. Server-side copy, nothing crosses the wire.
- Each storage slóð getur aðeins be linked to one attachment; use a separate upload per attachment.

**Offload an existing BC attachment** then bring it back: `Storage.Attachment.Offload` → `Storage.Attachment.Restore`. Works fyrir both `DocumentAttachment` og `IncomingDocument` targets.

### Chunking rules (precise)

- A chunk er at most `chunkSizeHint` **raw** bytes (currently 49152, about 48 KB).
- Base64-enkóði hver chunk **independently**; never base64 the whole skrá og slice the niðurstaðaing text — the chunk boundaries would not dekóði.
- `sequence` er 1-based og verður að vera contiguous með no gaps by commit; re-sending a sequence replaces that chunk (retries eru safe).
- Sendu `declaredSize` (total bytes) at Begin so commit verifies nothing was lost.
- A session er private to the caller og er pruned automatically ef never committed.

## Routing

Every request carries a **`storageCode`** that velur a row in **`Bifrost Storage Setup`**. Each row binds the kóði to a registered Business Central skrá account (a connector plus an account) og an optional **`Base Path`** prefix that er prepended to every slóð. The connector apps own authentication og secrets — this connector never stores credentials.

Discover the stillt kóðis með `Storage.Account.List`. The `path`, `sourcePath`, og `targetPath` gildi eru relative to the tenging's base slóð og use forward slashes (for example `dir/sub/file.txt`).

## Svar envelope

Every message tegund returns the same envelope:

- Tókst — `{ "status": "Success", "data": { ... } }`
- Mistókst — `{ "status": "Error", "error": "<message>" }`

File innihald er carried as base64 in `contentBase64`. Existence checks return `{ "path": ..., "exists": true|false }`.

## Skilaboð tegunds

### Discovery

| Skilaboð tegund | Nauðsynlegt parameters | Lýsing |
|---|---|---|
| `Help.Storage.Get` | _none_ | Skilar this Markdown overview. |
| `Storage.Account.List` | _none_ | Lists the stillt storage tengingar (kóðis og connectors; no secrets). |

### Files

| Skilaboð tegund | Nauðsynlegt parameters | Lýsing |
|---|---|---|
| `Storage.File.Exists` | `storageCode`, `path` | Reports whether a skrá er til. |
| `Storage.File.Get` | `storageCode`, `path` | Sækir a skrá as base64. |
| `Storage.File.Create` | `storageCode`, `path`, `contentBase64` | Hleður upp a skrá (overwrites þar sem supported). |
| `Storage.File.Delete` | `storageCode`, `path` | Eyðir a skrá. |
| `Storage.File.Copy` | `storageCode`, `sourcePath`, `targetPath` | Afritar a skrá. |
| `Storage.File.Move` | `storageCode`, `sourcePath`, `targetPath` | Flytur (reheitis) a skrá. |
| `Storage.File.List` | `storageCode`, `path` | Lists the skrár in a mappa. |

### Directories

| Skilaboð tegund | Nauðsynlegt parameters | Lýsing |
|---|---|---|
| `Storage.Directory.Exists` | `storageCode`, `path` | Reports whether a mappa er til. |
| `Storage.Directory.Create` | `storageCode`, `path` | Býr til a mappa. |
| `Storage.Directory.Delete` | `storageCode`, `path` | Eyðir a mappa. |
| `Storage.Directory.List` | `storageCode`, `path` | Lists the subdirectories of a mappa. |

### Attachments

Move a Business Central attachment's skrá out to storage og back. While offloaded, the skrá er removed úr the database but stays transparently available to existing processes.

| Skilaboð tegund | Nauðsynlegt parameters | Lýsing |
|---|---|---|
| `Storage.Attachment.Offload` | `target`, `systemId`, `storageCode` | Flytur an attachment's skrá to storage og clears it úr the database. |
| `Storage.Attachment.Restore` | `target`, `systemId` | Brings an offloaded attachment's skrá back í the database og deletes the remote copy. |
| `Storage.Attachment.CreateLinked` | `storageCode`, `path`, `fileName` | Attaches a skrá already in storage to a new eða existing incoming skjal, served transparently úr storage. |
| `Storage.Attachment.CreateForRecord` | `tableId`/`tableName`, `no`/`recordSystemId`, innihald source | Býr til a skjal attachment on any færsla (viðskiptavinur, vendor, fixed asset, G/L account, ...) úr inlína base64, úr storage, eða by copying an existing attachment. |

`target` er `IncomingDocument` eða `DocumentAttachment`; `systemId` er the SystemId of the attachment færsla. `Storage.Attachment.Offload` also accepts an optional `folderPath` (one eða more submöppur) that chooses þar sem the skrá er stored; the skrá heiti er appended automatically. Sleppiðting it fyrir an incoming skjal yields a navigable sjálfgefið — `bifrost-attachments/incoming-documents/{year}/{entry no.}/{file name}` — so the blob traces back to its skjal.

`Storage.Attachment.CreateForRecord` addresses the host færsla með `tableId`/`tableName` plus `no` eða `recordSystemId`. It accepts three innihald sources — inlína base64, a skrá in storage, eða a copy úr an existing attachment — but exactly one per call. Tables með a single Code primary key (Customer, Vendor, Fixed Asset, G/L Account, Bank Account, ...) getur be addressed by `no`; allir others use `recordSystemId`.

### Chunked uploads

Deliver a large skrá as a sequence of small chunks þegar it er too big fyrir a single `Storage.File.Create` call eða a single inlína `content` parameter. Begin a session, append the skrá in pieces (about 48 KB of raw bytes each, base64-enkóðid), then commit — either to external storage eða directly to a færsla attachment.

| Skilaboð tegund | Nauðsynlegt parameters | Lýsing |
|---|---|---|
| `Storage.Upload.Begin` | `fileName` (+ optional `storageCode`) | Opens a session og returns an `uploadId`. Sleppið `storageCode` fyrir a buffer-only session. |
| `Storage.Upload.Append` | `uploadId`, `sequence`, `contentBase64` | Appends one chunk (re-sending a sequence replaces it). |
| `Storage.Upload.Commit` | `uploadId` | Assembles the chunks og writes the skrá to external storage (requires `storageCode` on the session). |
| `Storage.Upload.CommitToRecord` | `uploadId`, færsla address | Assembles the chunks og attaches directly to a færsla án external storage. |
| `Storage.Upload.Abort` | `uploadId` | Discards the session án writing. |
| `Storage.Upload.Status` | `uploadId` | Reports progress og state. |

Each upload session er private to the notandi that created it, so concurrent callers never see one another's in-flight chunks. Sessions left uncommitted eru pruned automatically by a retention policy.

Beiðni the per-tegund help skjal fyrir any message tegund to get its full parameter table, request og response examples, og common villur.

## Connector notes

- **Accounts eru registered in Business Central.** Configure connectors og accounts through the standard File Account setup; this connector references them by id og never stores credentials.
- **Directory semantics depend on the connector.** Object stores such as Azure Blob have no native directories — some connectors emulate them með zero-byte placeholder markers, others treat a mappa as existing aðeins once it inniheldur a skrá. Notaðu `Storage.Directory.Exists` to confirm rather than assuming.
- **Create overwrites.** `Storage.File.Create` replaces an existing skrá on connectors that support overwrite.
- **Paths getur be case-sensitive** on cloud back ends — match the stored casing exactly.
- **Offloaded attachments stay transparent.** After `Storage.Attachment.Offload`, processes that read the skrá through the standard accessors keep working; the innihald er fetched úr storage on demand. Ef the storage tenging er unavailable the read fails rather than returning an empty skrá.

## Initial release boundaries

- Help skjöl eru authored fyrir machine-readable call guidance og deterministic request chaining.
- The connector intentionally routes through stillt External File Storage accounts og gerir ekki manage credentials.
- Skilaboð samningar follow the common Bifrost response envelope með `status` og either `data` eða `error`.

