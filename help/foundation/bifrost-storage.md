---
id: bifrost-storage
title: "Bifrost Storage"
sidebar_label: "Storage"
sidebar_position: 23
---

The **Bifrost Storage** page displays blob content that has been stored by the Bifrost extension. Each record holds a binary (BLOB) payload associated with a specific source system and identified by a unique GUID. You can upload new content and download existing content directly from this page.

Access this page from **Bifrost Setup → Messages → Bifrost Storage**.

## Fields

| Field | Description |
| --- | --- |
| **Source** | Identifies the external system or application that submitted the stored content. This is typically the same identifier used in the associated Bifrost message (e.g., `https://erp.example.com`). |
| **Id** | A unique GUID that identifies this storage record. External systems use this ID to reference the stored content when sending bifrost messages. |
| **Data Size** | Shows the size of the stored blob in bytes. This field is read-only and is updated automatically when content is imported. |

## Actions

| Action | Description |
| --- | --- |
| **Import** | Opens a file picker so you can upload a file from your computer. The file content is stored in the **Data** field of the selected record. If you have not yet created a record, create one first and then use Import to attach content. |
| **Export** | Downloads the stored blob content to your computer. Use this action to inspect or redistribute content that was uploaded by an external system. |

## Common Tasks

### Uploading Content

1.  Create a new record by entering a **Source** identifier.
2.  Note or copy the generated **Id** (GUID).
3.  Choose **Import** and select the file to upload.
4.  The **Data Size** column updates to reflect the uploaded content.
5.  Provide the **Id** to the external system so it can reference this content in future bifrost messages.

### Downloading Content

1.  Select the record that contains the content you want to retrieve.
2.  Choose **Export**.
3.  Save the file to your preferred location.

## Tips

-   Each storage record is identified by its GUID **Id**. Make sure external systems store this ID so they can reference the correct content later.
-   The **Data Size** field shows `0` (blank) when no content has been imported yet.
-   Use the **Source** field to group storage records by the system that submitted them, making it easier to filter and manage records across multiple integrations.
