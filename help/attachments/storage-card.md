---
id: storage-card
title: "Bifrost Storage Connection"
sidebar_label: "Storage Connection"
sidebar_position: 3
---

The **Bifrost Storage Connection** card configures a single storage connection. It binds a `storageCode` to a specific Business Central file account and connector, with an optional base path for all operations.

## General

| Field | Description |
| --- | --- |
| Code | The unique code that Bifröst requests use to address this connection. |
| Description | A human-readable description of the storage connection. |
| Enabled | Whether this connection is active. Disabled connections reject all requests. |

## Backend

| Field | Description |
| --- | --- |
| Storage Type | How storage actions are carried out. The default routes through the BC External File Storage facade. |
| Connector | The BC file storage connector type (Azure Blob Storage, Azure File Share, or SharePoint). Changing it clears the selected file account. |
| File Account Name | The registered file account to use. Choose **Select File Account** to pick from available accounts. |
| Base Path | An optional root path prepended to all file and directory paths in Bifröst requests. |

## Actions

| Action | Description |
| --- | --- |
| [Select File Account](/help/attachments/storage-account-lookup/) | Opens a lookup of file accounts registered for the chosen connector. |
| Test Connection | Verifies that the configured storage backend can be reached. Shows a success or failure message. |
