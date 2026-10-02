---
id: attachments-setup
title: "Bifröst Attachments Setup"
sidebar_label: "Attachments Setup"
sidebar_position: 5
---

**Bifröst Attachments Setup** is the single setup page of the storage module. Everything the extension needs an administrator to configure is reachable from here, and the page is opened from the **Apps** group on the Bifröst **Setup** page.

## Storage connections

The page shows the configured storage connections. Each row binds a short `Code`, which requests use to choose the connection, to a registered Business Central file account. Choose a row to open the [storage connection card](/help/attachments/storage-card/) and edit or test that connection.

Credentials stay in the Business Central connector apps. This extension stores only a reference to a file account, never a key or a token.

## Actions

| Action | Description |
| --- | --- |
| **Storage Setup Wizard** | Runs the standard File Account Wizard to register a new file storage account (Azure Blob Storage, Azure File Share, SharePoint). |
| **Storage Setup** | Opens the standard File Accounts list, where registered accounts are maintained. |
| **Bifrost Storage Setup** | Opens the full [Bifrost Storage Setup](/help/attachments/storage-setup/) list of storage connections. |
| **Purge Upload Sessions** | Deletes abandoned chunked upload sessions and their chunks. Sessions that were never committed or aborted leave data behind; this action removes it. |

## Outbound HTTP

Every storage backend is reached over HTTP, so the extension needs outbound HTTP client requests. The Bifröst setup wizard turns them on for every installed Bifröst app at once. Until they are on, the **Bifröst Setup** page shows a notification with the action **Start setup wizard**, and any request that reads or writes files through a storage connection fails with an error saying that HTTP client requests are not enabled for the extension.

## Getting started

1.  Install a Business Central file storage connector app and configure a file account in it.
2.  Open **Bifröst Setup**. If it shows the HTTP notification, choose **Start setup wizard** and complete the wizard first.
3.  Choose **Bifrost Attachments Setup** in the **Apps** group.
4.  Add a storage connection binding a short code to the file account.
5.  Test the connection from the [storage connection card](/help/attachments/storage-card/).
6.  Name the connection by its code in the requests that read or write files.
