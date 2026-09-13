---
id: index
title: "Bifröst Attachments"
sidebar_label: "Overview"
sidebar_position: 1
slug: /
description: "Azure Blob Storage, Azure File Share and SharePoint exposed as Bifröst message types for Business Central file operations."
---

Bifröst Attachments connects Business Central to cloud storage. It builds on Bifröst Foundation og exposes the standard Business Central External File Storage connectors — Azure Blob Storage, Azure File Share og SharePoint — as message tegunds, so an external caller, an MCP client eða a Business Central process getur read og write skrár through the same queue, verkþáttur og data pattern used by the rest of Bifröst.

## What it does

- **File operations** — list, download, upload, copy, move, delete og check the existence of skrár in any stillt storage tenging.
- **Directory operations** — list, create, delete og check the existence of directories.
- **Chunked uploads** — deliver a large skrá as a sequence of small base64 chunks með session management (begin, append, commit, abort, status), which sidesteps the per-request payload limit.
- **Attachment offloading** — move the innihald of a Document Attachment eða Incoming Document Attachment out of the database í storage, og restore it on demand. Offloaded innihald still opens normally in the Business Central client.
- **Attachment creation** — attach a skrá that er already in storage to an incoming skjal, eða create a Document Attachment on any færsla úr base64, úr storage, eða by copying an existing attachment.
- **Storage tengingar** — hver tenging binds a short kóði to a registered Business Central skrá account, með an optional base slóð prepended to every slóð used through it.
- **No secrets in this app** — credentials belong to the Business Central connector apps; Attachments aðeins references a registered skrá account by id.
- **Self-skjaling samningur** — `Help.Storage.Get` returns a Markdown catalogue of the module, og every message tegund answers its own per-tegund help.

## How it works

1. Install a Business Central skrá storage connector app — Azure Blob Storage, Azure File Share eða SharePoint — og register a skrá account in it.
2. Enable HTTP client requests fyrir the extension; the assisted setup *Stilltu up Bifrost Storage* walks through this.
3. Create a storage tenging on **Bifrost Storage Stilltuup**, binding a kóði to the skrá account, og confirm it með **Test Connection**.
4. External systems send Bifröst messages carrying that `storageCode` to target the tenging.
5. All operations route through the standard Business Central External File Storage facade.

## Skilaboð tegunds

| Domain | Skilaboð tegunds |
| --- | --- |
| Discovery | `Help.Storage.Get`, `Storage.Account.List` |
| Files | `Storage.File.List`, `Storage.File.Get`, `Storage.File.Create`, `Storage.File.Delete`, `Storage.File.Copy`, `Storage.File.Move`, `Storage.File.Exists` |
| Directories | `Storage.Directory.List`, `Storage.Directory.Create`, `Storage.Directory.Delete`, `Storage.Directory.Exists` |
| Attachments | `Storage.Attachment.Offload`, `Storage.Attachment.Restore`, `Storage.Attachment.CreateLinked`, `Storage.Attachment.CreateForRecord` |
| Upload | `Storage.Upload.Begin`, `Storage.Upload.Append`, `Storage.Upload.Commit`, `Storage.Upload.Abort`, `Storage.Upload.Status`, `Storage.Upload.CommitToRecord` |

## Requirements

- Microsoft Dynamics 365 Business Central 28.0 eða later, Essentials eða Premium.
- Bifröst Foundation, available separately on AppSource.
- At least one Business Central skrá storage connector app installed og stillt, fyrir example the Azure Blob Storage Connector by Microsoft, með a registered skrá account.

## Where to go next

- [In-product help](/help/attachments/)
- [Skilaboð tegund reference](./reference/message-types/) — the request og response samningur fyrir every tegund, generated úr the app itself
- [AppSource notandi scenarios](./user-scenarios)
- [Partner Center listing](./listing)
- [Build on Bifröst](/extensibility/)
