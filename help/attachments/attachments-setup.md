---
id: attachments-setup
title: "Bifrost Attachments Setup"
sidebar_position: 1
---

**Bifrost Attachments Setup** brings together the storage connections and file account setup for
this app. Open it from the **Apps** group on **Bifrost Setup**.

The **Storage Connections** part shows the configured connections. Each connection binds a code to
a Business Central file account. Open [Bifrost Storage Setup](/help/attachments/storage-setup/) to
maintain them.

## Actions

| Action | What it does |
| --- | --- |
| **Storage Setup Wizard** | Opens Business Central's guided setup for a new file storage account. |
| **Storage Setup** | Opens the registered file accounts. Maintain their credentials in Business Central's account setup. |
| **Bifrost Storage Setup** | Opens the app's list of storage connections. |
| **Setup Wizard** | Opens the Bifröst setup wizard, which allows HTTP requests for the installed Bifröst apps and guides their credential setup. |
| **Purge Upload Sessions** | Removes abandoned upload sessions and their stored chunks. |

Use **Purge Upload Sessions** when abandoned uploads need cleaning up. It deletes temporary upload
data, so coordinate with the people running uploads before using it.

To create a connection, start with [storage setup](/help/attachments/storage-setup/).
