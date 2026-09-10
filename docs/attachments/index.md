---
id: index
title: "Bifröst Attachments"
sidebar_label: "Overview"
sidebar_position: 1
slug: /
description: "Azure Blob Storage, Azure File Share and SharePoint exposed as Bifröst message types for Business Central file operations."
---

Bifröst Attachments connects Business Central to cloud storage. It builds on Bifröst Foundation and exposes the standard Business Central External File Storage connectors — Azure Blob Storage, Azure File Share and SharePoint — as message types, so an external caller, an MCP client or a Business Central process can read and write files through the same queue, task and data pattern used by the rest of Bifröst.

## What it does

- **File operations** — list, download, upload, copy, move, delete and check the existence of files in any configured storage connection.
- **Directory operations** — list, create, delete and check the existence of directories.
- **Chunked uploads** — deliver a large file as a sequence of small base64 chunks with session management (begin, append, commit, abort, status), which sidesteps the per-request payload limit.
- **Attachment offloading** — move the content of a Document Attachment or Incoming Document Attachment out of the database into storage, and restore it on demand. Offloaded content still opens normally in the Business Central client.
- **Attachment creation** — attach a file that is already in storage to an incoming document, or create a Document Attachment on any record from base64, from storage, or by copying an existing attachment.
- **Storage connections** — each connection binds a short code to a registered Business Central file account, with an optional base path prepended to every path used through it.
- **No secrets in this app** — credentials belong to the Business Central connector apps; Attachments only references a registered file account by id.
- **Self-documenting contract** — `Help.Storage.Get` returns a Markdown catalogue of the module, and every message type answers its own per-type help.

## How it works

1. Install a Business Central file storage connector app — Azure Blob Storage, Azure File Share or SharePoint — and register a file account in it.
2. Enable HTTP client requests for the extension; the assisted setup *Set up Bifrost Storage* walks through this.
3. Create a storage connection on **Bifrost Storage Setup**, binding a code to the file account, and confirm it with **Test Connection**.
4. External systems send Bifröst messages carrying that `storageCode` to target the connection.
5. All operations route through the standard Business Central External File Storage facade.

## Message types

| Domain | Message types |
| --- | --- |
| Discovery | `Help.Storage.Get`, `Storage.Account.List` |
| Files | `Storage.File.List`, `Storage.File.Get`, `Storage.File.Create`, `Storage.File.Delete`, `Storage.File.Copy`, `Storage.File.Move`, `Storage.File.Exists` |
| Directories | `Storage.Directory.List`, `Storage.Directory.Create`, `Storage.Directory.Delete`, `Storage.Directory.Exists` |
| Attachments | `Storage.Attachment.Offload`, `Storage.Attachment.Restore`, `Storage.Attachment.CreateLinked`, `Storage.Attachment.CreateForRecord` |
| Upload | `Storage.Upload.Begin`, `Storage.Upload.Append`, `Storage.Upload.Commit`, `Storage.Upload.Abort`, `Storage.Upload.Status`, `Storage.Upload.CommitToRecord` |

## Requirements

- Microsoft Dynamics 365 Business Central 28.0 or later, Essentials or Premium.
- Bifröst Foundation, available separately on AppSource.
- At least one Business Central file storage connector app installed and configured, for example the Azure Blob Storage Connector by Microsoft, with a registered file account.

## Where to go next

- [In-product help](/help/attachments/)
- [Message type reference](./reference/message-types/) — the request and response contract for every type, generated from the app itself
- [AppSource user scenarios](./user-scenarios)
- [Partner Center listing](./listing)
- [Build on Bifröst](/extensibility/)
