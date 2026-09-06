---
id: index
title: "Bifröst Hnitbjörg — Help"
sidebar_label: "Bifröst Hnitbjörg — Help"
sidebar_position: 1
slug: /
---

**Bifröst Hnitbjörg** is the storage module of the Bifröst platform, a Business Central extension by Origo. It exposes the standard Business Central external file storage connectors (Azure Blob Storage, Azure File Share and SharePoint) as Bifröst message types, so external systems get direct read and write access to cloud storage through the Bifröst API.

The module adds file, directory, attachment and chunked upload operations to the Bifröst message catalogue. Each operation is addressed by a `storageCode` that maps to a configured storage connection. Credentials stay in the Business Central connector apps — this extension stores only a reference to a registered file account.

## Pages

| Page | Description |
| --- | --- |
| [Bifrost Storage Setup](/help/hnitbjorg/storage-setup/) | List of configured storage connections. Each row binds a storage code to a BC file account. |
| [Bifrost Storage Connection](/help/hnitbjorg/storage-card/) | Card for editing a single storage connection — connector, file account, base path, and test. |
| [Select File Account](/help/hnitbjorg/storage-account-lookup/) | Lookup of the file accounts registered for the chosen connector. |

## Message Types

| Message Type | Description |
| --- | --- |
| Help.Storage.Get | Returns a Markdown overview of the storage module and all its message types. |
| Storage.Account.List | Lists configured storage connections (codes and connectors; no secrets). |
| Storage.File.List | Lists the files in a directory. |
| Storage.File.Get | Downloads a file as base64. |
| Storage.File.Create | Uploads one small base64 file to storage. |
| Storage.File.Delete | Deletes a file. |
| Storage.File.Copy | Copies a file to a new path. |
| Storage.File.Move | Moves a file to a new path. |
| Storage.File.Exists | Checks whether a file exists. |
| Storage.Directory.List | Lists the directories in a path. |
| Storage.Directory.Create | Creates a directory. |
| Storage.Directory.Delete | Deletes a directory. |
| Storage.Directory.Exists | Checks whether a directory exists. |
| Storage.Attachment.Offload | Offloads an attachment file to storage and clears it from the database. |
| Storage.Attachment.Restore | Restores an offloaded attachment from storage back into the database. |
| Storage.Attachment.CreateLinked | Attaches a file already in storage to a new or existing incoming document. |
| Storage.Attachment.CreateForRecord | Creates a document attachment on any record from base64, from storage, or by copying an existing attachment. |
| Storage.Upload.Begin | Opens a chunked upload session for large files. |
| Storage.Upload.Append | Appends one base64 chunk to an open upload session. |
| Storage.Upload.Commit | Assembles the chunks and writes the file to storage. |
| Storage.Upload.Abort | Discards an upload session without writing to storage. |
| Storage.Upload.Status | Reports the progress and state of an upload session. |
| Storage.Upload.CommitToRecord | Assembles the chunks and attaches the file directly to a record, without external storage. |

Send `Help.Storage.Get` for the full Markdown catalogue, or ask any single message type for its own help document to see its exact request parameters, response fields and error cases.

## Getting Started

1.  Install a BC file storage connector app (Azure Blob Storage, Azure File Share, or SharePoint).
2.  Configure a file account in the connector's setup.
3.  Run the **Set up Bifrost Storage** assisted setup to enable HTTP client requests for this extension.
4.  Open [Bifrost Storage Setup](/help/hnitbjorg/storage-setup/) and create a connection binding a code to that account.
5.  Use the **Test Connection** action on the [storage connection card](/help/hnitbjorg/storage-card/) to verify connectivity.
6.  Send Bifröst messages with `"storageCode": "YOUR-CODE"` in the request payload.
