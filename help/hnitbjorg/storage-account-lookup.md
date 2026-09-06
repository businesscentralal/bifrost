---
id: storage-account-lookup
title: "Select File Account"
sidebar_label: "Select File Account"
sidebar_position: 2
---

**Select File Account** is a modal lookup that lists the Business Central file accounts registered for the connector chosen on a [Bifrost Storage Connection](/help/hnitbjorg/storage-card/) card. Choosing an account binds the storage connection to it, so every Bifröst request that uses this connection's `storageCode` reads and writes through that account.

Open it with the **Select File Account** action on the storage connection card. The list is empty until at least one file account has been registered in the connector's own setup — for example in the Azure Blob Storage Connector or the SharePoint Connector app. Use the standard **File Account Wizard**, reachable from the **Storage** group on the Bifröst Setup page, to register one.

## Fields

| Field | Description |
| --- | --- |
| Name | The display name of the registered file account, as given when it was set up in the connector app. |
| Account Id | The identifier of the file account. This is what the storage connection stores; no credentials are copied. |

## Notes

-   Only accounts belonging to the connector selected on the card are listed. Changing the connector clears the current selection.
-   The account's credentials stay in the connector app. This extension stores only the account id and name.
-   After choosing an account, run **Test Connection** on the card to confirm the backend is reachable.
