---
id: storage-setup
title: "Bifrost Storage Setup"
sidebar_label: "Storage Setup"
sidebar_position: 4
---

The **Bifrost Storage Setup** page lists all configured storage connections. Each row binds a short `Code` — the value a Bifröst request passes as `storageCode` — to a Business Central external file storage account.

The same page is reached from the **Storage** group on the Bifröst **Setup** page, alongside the standard File Account Wizard and File Accounts list.

## Fields

| Field | Description |
| --- | --- |
| Code | The code that Bifröst requests use to select this storage connection (for example `AZURE-MAIN`). |
| Description | A human-readable description of the storage connection. |
| Connector | The type of BC file storage connector (Azure Blob Storage, Azure File Share, or SharePoint). |
| File Account Name | The name of the registered file account bound to this connection. |
| Base Path | Optional root path prepended to all file operations on this connection. Leave blank to address the account root. |
| Enabled | Whether this connection accepts Bifröst requests. Disabled connections return an error. |

## Actions

To edit a connection or test connectivity, choose a row to open the [storage connection card](/help/hnitbjorg/storage-card/).

## Setup wizard

Before the first request can reach cloud storage, HTTP client requests must be enabled for this extension. The **Set up Bifrost Storage** assisted setup walks through that step and verifies the result. It is listed under Assisted Setup in the Extensions group.
