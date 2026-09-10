---
id: attachments-setup
title: "Bifröst Attachments Setup"
sidebar_label: "Attachments Setup"
sidebar_position: 5
---

**Bifröst Attachments Setup** is the single setup page of the storage module. Everything the extension needs an administrator to configure is reachable from here, and the page is opened from the **Apps** group on the Bifröst **Setup** page.

## Storage connections

The page shows the configured storage connections. Each row binds a short `Code` — the value a Bifröst request passes as `storageCode` — to a registered Business Central file account. Choose a row to open the [storage connection card](/help/attachments/storage-card/) and edit or test that connection.

Credentials stay in the Business Central connector apps. This extension stores only a reference to a file account, never a key or a token.

## Actions

| Action | Description |
| --- | --- |
| **Storage Setup Wizard** | Runs the standard File Account Wizard to register a new file storage account (Azure Blob Storage, Azure File Share, SharePoint). |
| **Storage Setup** | Opens the standard File Accounts list, where registered accounts are maintained. |
| **Bifrost Storage Setup** | Opens the full [Bifrost Storage Setup](/help/attachments/storage-setup/) list of storage connections. |
| **Purge Upload Sessions** | Deletes abandoned chunked upload sessions and their chunks. Sessions that were never committed or aborted leave data behind; this action removes it. |

## Setup notification

Every storage backend is reached over HTTP. When **Allow HttpClient Requests** is not enabled for the extension, the page raises a notification with two actions: **Run Setup Wizard**, which opens the assisted setup, and **Open Extension Settings**, which goes straight to the setting.

## Getting started

1.  Install a Business Central file storage connector app and configure a file account in it.
2.  Open **Bifröst Setup**, then choose **Bifrost Attachments Setup** in the **Apps** group.
3.  Clear the HTTP client notification if it appears.
4.  Add a storage connection binding a short code to the file account.
5.  Test the connection from the [storage connection card](/help/attachments/storage-card/).
6.  Send Bifröst messages with `"storageCode": "YOUR-CODE"` in the request payload.
