---
id: bifrost-delete-setup
title: "Bifrost Delete Setup"
sidebar_label: "Bifrost Delete Setup"
sidebar_position: 5
---

The **Bifrost Delete Setup** page controls which Business Central tables have their deleted records captured to the [Bifrost Delete Log](/help/foundation/bifrost-delete-log/). Each row maps a table to the delete-logging feature and optionally stores a full JSON snapshot of the record at the moment of deletion.

## Fields

| Field | Description |
| --- | --- |
| **Table Id** | The ID of the Business Central table whose deleted records should be logged. This field is mandatory. |
| **Table Name** | The name of the Business Central table (read-only, derived from the Table Id). |
| **Store Record** | When enabled, a full JSON representation of the record is saved to the delete log entry at the time of deletion. Useful for auditing but increases storage usage. |

## Tips

-   Only add tables that you actively need to audit for deletions. Each tracked table adds overhead to the delete trigger.
-   Enable **Store Record** when you need to know what data the record contained, not just that it was deleted.
-   The JSON data stored can be exported from the [Delete Log](/help/foundation/bifrost-delete-log/) page using the **Export JSON** action.
