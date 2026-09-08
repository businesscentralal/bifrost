---
id: bifrost-hnitbjorg
title: "Hnitbjörg message types"
sidebar_label: "Hnitbjörg message types"
sidebar_position: 8
description: "Message types added to the Bifröst API by Bifrost Hnitbjorg. Azure Blob Storage, Azure File Share and SharePoint exposed as Bifröst message types for Business Central file operations. Load alongside bifrost-bc-integration, which carries the API itself; this skill is the index of…"
---

Azure Blob Storage, Azure File Share and SharePoint exposed as Bifröst message types for Business Central file operations.

---

## When to load this skill

Load it together with the core skill when:

- a file has to be read from or written to Azure Blob Storage, an Azure File Share or SharePoint through Business Central;
- a document attachment has to be offloaded out of the database into storage, or restored from it.

It does not describe the API itself. The envelope, the endpoints, the error order, pagination and `tableView` are in [bifrost-bc-integration](./bifrost-bc-integration/index.md) and are not repeated here.

---

## Hard rules

- A large file goes up in chunks, not in one payload. Use the chunked upload session (begin, append, commit, abort) rather than fighting the per-request limit.
- Hnitbjörg holds no credentials of its own. It references a Business Central file account registered by a connector app; if the account is missing, the fix is in Business Central, not in the call.
- Offloading changes where content lives, not what it is. An offloaded attachment still opens normally in the client — do not "restore" one just to read it.
- Call `Help.MessageTypes.Get` against the environment before you use one of these types. An app that is not installed contributes nothing to the catalogue, and the failure looks like a typo.
- Read the page for a message type before calling it. The pages below are generated from the app’s own help codeunits, so they are the contract, not a summary of it.
- Keep calls serial, prefix test data with `BIFT-`, and never delete existing master data.

---

## Reference pages

**Reference base:** `../../hnitbjorg/reference/` — every path below is relative to it.

Append `message-types/<page>/` for a message type, or `<page>/` for the pages in the last table.
From the deployed site the same paths resolve against this file’s own URL.

### `Storage.*` (22)

| Message type | Page |
| --- | --- |
| `Storage.Account.List` | `message-types/storage-account-list/` |
| `Storage.Attachment.CreateForRecord` | `message-types/storage-attachment-createforrecord/` |
| `Storage.Attachment.CreateLinked` | `message-types/storage-attachment-createlinked/` |
| `Storage.Attachment.Offload` | `message-types/storage-attachment-offload/` |
| `Storage.Attachment.Restore` | `message-types/storage-attachment-restore/` |
| `Storage.Directory.Create` | `message-types/storage-directory-create/` |
| `Storage.Directory.Delete` | `message-types/storage-directory-delete/` |
| `Storage.Directory.Exists` | `message-types/storage-directory-exists/` |
| `Storage.Directory.List` | `message-types/storage-directory-list/` |
| `Storage.File.Copy` | `message-types/storage-file-copy/` |
| `Storage.File.Create` | `message-types/storage-file-create/` |
| `Storage.File.Delete` | `message-types/storage-file-delete/` |
| `Storage.File.Exists` | `message-types/storage-file-exists/` |
| `Storage.File.Get` | `message-types/storage-file-get/` |
| `Storage.File.List` | `message-types/storage-file-list/` |
| `Storage.File.Move` | `message-types/storage-file-move/` |
| `Storage.Upload.Abort` | `message-types/storage-upload-abort/` |
| `Storage.Upload.Append` | `message-types/storage-upload-append/` |
| `Storage.Upload.Begin` | `message-types/storage-upload-begin/` |
| `Storage.Upload.Commit` | `message-types/storage-upload-commit/` |
| `Storage.Upload.CommitToRecord` | `message-types/storage-upload-committorecord/` |
| `Storage.Upload.Status` | `message-types/storage-upload-status/` |

### `Help.*` (1)

| Message type | Page |
| --- | --- |
| `Help.Storage.Get` | `message-types/help-storage-get/` |

---

## Related skills

- [bifrost-bc-integration](./bifrost-bc-integration/index.md) — the API itself. Always load this one.
- [bifrost-foundation](./bifrost-foundation.md) — Bifrost Foundation
- [bifrost-iceland](./bifrost-iceland.md) — Bifrost Iceland
- [bifrost-iceland-treasury](./bifrost-iceland-treasury.md) — Bifrost Iceland Treasury
- [bifrost-iceland-docex](./bifrost-iceland-docex.md) — Bifrost Iceland DocEx
- [bifrost-bragi](./bifrost-bragi.md) — Bifrost Bragi
- [bifrost-nornir](./bifrost-nornir.md) — Bifrost Nornir
- [bifrost-clockify](./bifrost-clockify.md) — Bifrost Clockify
- [bifrost-subscription-billing](./bifrost-subscription-billing.md) — Bifrost Subscription Billing
## Loading this skill

An agent loads the skill file itself: [SKILL.md](pathname:///skills/bifrost-hnitbjorg/SKILL.md).
It is an index: what the app adds, when to load it, and the path of every reference page.

<details>
<summary>The description an agent matches this skill against</summary>

Message types added to the Bifröst API by Bifrost Hnitbjorg. Azure Blob Storage, Azure File Share and SharePoint exposed as Bifröst message types for Business Central file operations. Load alongside bifrost-bc-integration, which carries the API itself; this skill is the index of what Hnitbjörg adds — 23 message types across 2 families (Storage.*, Help.*).

</details>
