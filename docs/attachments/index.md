---
id: index
title: "Bifröst Attachments"
sidebar_label: "Overview"
sidebar_position: 1
slug: /
description: "Azure Blob Storage, Azure File Share and SharePoint exposed as Bifröst message types for Business Central file operations."
---

# Bifröst Attachments

**Keep your Business Central files in cloud storage, and reach them from any process.** Read,
write and attach files in Azure Blob Storage, Azure File Share or SharePoint, and move attachments
out of the database without losing them.

Other systems, assistants and Business Central processes all use the same storage connections, set
up once by an administrator.

*An additional app on [Bifröst Foundation](/foundation/). New to Bifröst? Start with
[How Bifröst works](/documentation/how-it-works/).*

## What you can do

- **Make the database smaller.** Move the content of a document attachment or an incoming
  document attachment out to storage, and bring it back when needed. Offloaded files still open
  normally in Business Central.
- **Work with files and folders.** List, download, upload, copy, move and delete files, and
  create, list and delete folders, in any storage connection you have set up.
- **Attach a stored file to a record.** Attach a file already in storage to an incoming document,
  or add a document attachment to any record, such as a customer, vendor, fixed asset or document,
  without uploading it again. Incoming documents can then be handled as usual in
  [Bifröst Foundation](/foundation/).
- **Send large files.** A file too large for one request can be sent in pieces and put together
  in storage, or attached straight to a record.
- **Look up your Data Exchange setup.** Read Data Exchange definitions, Data Exchange types and
  processed entries. This is read-only: nothing is uploaded or changed.
- **Choose your storage.** Azure Blob Storage, Azure File Share or SharePoint, through the
  standard Business Central connector apps.

## Get it

Install **Bifrost Attachments** next to Bifröst Foundation, from AppSource or through your
partner. It needs Business Central 28.0 or later, Essentials or Premium, and at least one Business
Central file storage connector app, for example the Azure Blob Storage Connector by Microsoft.

## Set it up

| Step | What | Who |
|---|---|---|
| 1 | Install a file storage connector app (Azure Blob Storage, Azure File Share or SharePoint) and register a file account in it, for example with the **File Account Wizard**. | Business Central administrator |
| 2 | Allow HTTP client requests for the extension. The assisted setup **Set up Bifrost Attachments** walks you through it. | Business Central administrator |
| 3 | On **Bifrost Setup**, open **Bifrost Attachments Setup** in the **Apps** group and add a storage connection: a short code, the connector, the file account and, if you want, a base path. Choose **Test Connection**. | Business Central administrator |
| 4 | Give the people and services that use storage the **`BIFROST Attach ori`** permission set (and `BIFROST DataExch ori` for data exchange). | Business Central administrator |
| 5 | Send requests that name the storage connection by its code. | Whoever builds the integration |

The step-by-step guides are in the in-product help:
[Attachments setup](/help/attachments/attachments-setup/),
[Bifrost Storage Setup](/help/attachments/storage-setup/),
[Storage connection](/help/attachments/storage-card/) and
[Select File Account](/help/attachments/storage-account-lookup/).

## Good to know

- **It acts as you.** Every call runs with your own Business Central permissions and is logged on
  **Bifrost Messages**.
- **No credentials in this app.** Keys and tokens stay in the Business Central connector apps.
  Bifröst Attachments stores only the file account id and name.
- **No permission, no access.** A user without `BIFROST Attach ori` gets a permission error,
  and no data is shown or changed.
- **A disabled storage connection** rejects every request until it is enabled again.
- **Unfinished large uploads leave data behind.** Uploads that were never completed or cancelled
  can be cleared with **Purge Upload Sessions** on Bifrost Attachments Setup.

## Capabilities and reference

Capabilities: **`Storage`** and **`DataExchange`**.

What each message type does, in plain words: [Capabilities](./capabilities).

For developers: every operation goes through the standard Business Central External File Storage
connectors, and file content travels as base64, in chunks for large files.

- [Message type reference](./reference/message-types/): the contract of every type, generated from the app itself
- [AppSource listing text](./listing)
- [AppSource validation scenarios](./user-scenarios)
- [Build on Bifröst](/extensibility/)
- Permission sets: `BIFROST Attach ori` (storage) and `BIFROST DataExch ori` (data exchange).
