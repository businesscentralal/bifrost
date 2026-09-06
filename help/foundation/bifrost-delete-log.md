---
id: bifrost-delete-log
title: "Bifrost Delete Log"
sidebar_label: "Bifrost Delete Log"
sidebar_position: 4
---

The **Bifrost Delete Log** is a read-only audit log that records every deletion from tables tracked in the [Bifrost Delete Setup](/help/foundation/bifrost-delete-setup/). Each entry identifies the table, the deleted record's SystemId, the time of deletion, and the user who performed it.

## Fields

| Field | Description |
| --- | --- |
| **Entry No.** | Sequential entry number assigned automatically when the deletion is logged. |
| **Table Id** | The ID of the table from which the record was deleted. |
| **Table Name** | The name of the table from which the record was deleted. |
| **Record System Id** | The SystemId (GUID) of the deleted record. External systems can use this to identify which record was removed. |
| **Deleted At** | The date and time when the record was deleted. |
| **User ID** | The ID of the user who deleted the record. |

## Actions

| Action | Description |
| --- | --- |
| **Export JSON** | Downloads the JSON snapshot stored for the selected entry. Only enabled when the entry contains stored record data (configured via **Store Record** in the [Delete Setup](/help/foundation/bifrost-delete-setup/)). |

## Tips

-   This page is read-only. Records are inserted automatically by the delete-logging triggers and cannot be edited or removed from the UI.
-   The **Record System Id** can be matched against the `Data.DeletedRecordIds.Get` message type to confirm deletions from external systems.
-   JSON data is only available when **Store Record** is enabled on the corresponding table in [Delete Setup](/help/foundation/bifrost-delete-setup/).
