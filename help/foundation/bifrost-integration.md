---
id: bifrost-integration
title: "Bifrost Integration"
sidebar_label: "Integration"
sidebar_position: 8
---

The **Bifrost Integration** page is an operational event log. It records the source system, Business Central table, and timestamp for each bifrost integration activity. Use this page to monitor, review, and manage integration events — for example, to identify which external system wrote to which table at a given time, or to mark incorrectly created records as reversed.

Access this page from **Bifrost Setup → Messages → Bifrost Integration**.

## Fields

| Field | Description |
| --- | --- |
| **Source** | Identifies the external system or application that triggered the bifrost. This is typically a URI or a descriptive identifier such as `https://erp.example.com` or `WMS`. This field is required and cannot be blank. |
| **Table Id** | The ID of the Business Central table involved in the integration event. For example, `18` for the Customer table or `37` for the Sales Line table. |
| **Table Name** | The resolved name of the table, automatically calculated from the Table ID. This field is read-only and is shown for convenience when browsing the log. |
| **Date & Time** | The date and time when the integration event occurred. This field is required and forms part of the unique record identifier together with **Source** and **Table Id**. |
| **Reversed** | Marks the record as reversed. Use this flag to indicate that the integration event was logged by mistake or has been corrected. Reversed records remain in the log for audit purposes and are not automatically deleted. |

## Common Tasks

### Reviewing Integration Activity

Open the page to see all integration events sorted by their primary key (Source, Table ID, Date & Time). Use the **Table Name** column to quickly identify which Business Central table was involved without needing to look up table IDs manually.

### Marking Records as Reversed

If an integration event was logged incorrectly, select the record and check the **Reversed** field. This flags the record without deleting it, preserving the full audit trail.

### Filtering by Source or Table

Use standard Business Central filters to narrow the list. For example:

-   Filter on **Source** to see events from a specific external system.
-   Filter on **Table Id** to see events related to a specific table (e.g., `18` for customers).
-   Filter on **Date & Time** to restrict the view to a specific period.
-   Filter on **Reversed = No** to exclude already-reversed records.

## API Access

Integration records can be read and written programmatically via the Bifrost message types:

-   **Data.Records.Get** — retrieve integration log entries as JSON
-   **Data.Records.Set** — insert or update integration log entries
-   **CSV.Records.Get** — export the full log as a CSV file for Open Mirroring pipelines

## Retention Policy

Old integration records can be automatically removed using Business Central's retention policy framework. Navigate to **Administration → Data Management → Retention Policy** to configure a cleanup schedule for the _Bifrost Integration_ table.

## Tips

-   The primary key is **Source + Table Id + Date & Time**. Each combination must be unique.
-   The **Table Name** column is a calculated field — it is blank when the Table Id is 0 or unset.
-   Use the **Reversed** field to keep your active log clean without permanently deleting historical records.
