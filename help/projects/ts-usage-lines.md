---
id: ts-usage-lines
title: "Time Sheet Usage Lines"
sidebar_position: 4
---

**Time Sheet Usage Lines** lists the items and resources that people have recorded as used on their time
sheets, such as parts taken from a van or kilometres driven, and how far each line has come: from
recorded, through approval, to a journal and posting. It is for the approvers and the back office who
follow usage up, and it is read-only.

Usage lines are recorded, submitted, approved, rejected, moved to journals and reversed from an assistant
or an integration, with Business Central's own checks. This page shows the result.

Search for **Time Sheet Usage Lines** in Business Central to open it.

![Time Sheet Usage Lines](/img/projects/en-us/ts-usage-lines.png)

## How a usage line moves

| Status | Meaning |
| --- | --- |
| **Open** | Recorded by the owner of the time sheet, not yet submitted. |
| **Submitted** | Sent for approval by the owner of the time sheet. |
| **Approved** | Approved by the approver named on the time sheet. |
| **Rejected** | Rejected by the approver, with an optional comment. The owner can submit it again. |
| **Transferred** | Moved to a journal line: item usage to an item journal, resource usage to a resource journal, and usage on a time sheet line with a project to a project journal. Nothing is posted by the transfer. If the journal line is deleted, the usage line returns to **Approved**. |
| **Posted** | The journal line was posted in Business Central. A posted line can be reversed once, which marks it **Reversed** and can create a journal line with the opposite quantity. |

## Fields

| Field | What it shows |
| --- | --- |
| **Entry No.** | The number of the usage line. |
| **Time Sheet No.** | The time sheet the usage belongs to. |
| **Time Sheet Line No.** | The time sheet line the usage is linked to. |
| **Resource No.** | The resource that recorded the usage, the owner's resource on the time sheet. |
| **Type** | **Item** or **Resource**. |
| **No.** | The item or resource number. |
| **Date** | The date of the usage, within the period of the time sheet. |
| **Quantity** | The quantity used. |
| **Unit of Measure Code** | The unit of measure. |
| **Location Code** | The location the item was taken from, for example the technician's van. |
| **Bin Code** | The bin the item was taken from. |
| **Lot No.** | The lot number of the item used. |
| **Serial No.** | The serial number of the item used. |
| **Description** | A description of the usage. |
| **Status** | Where the line stands, as in the table above. |
| **Reversed** | Selected when the posted usage has been reversed. |
| **Approved By** | Who approved the usage. |
| **Journal Template Name** | The journal template the usage was transferred to. |
| **Journal Batch Name** | The journal batch the usage was transferred to. |
| **Journal Line No.** | The journal line number. |

The page has no actions of its own.

## Good to know

- **Owners submit, approvers decide.** Only the owner of the time sheet can submit its usage lines, and
  only the approver named on the time sheet can approve or reject them, never the owner.
- **Posting happens in the journal.** A transfer creates journal lines only. Post them from the journal in
  Business Central, the same way as any other journal line; the location, bin and lot or serial number go
  with the line.
- **Kilometres from a visit** are recorded as an open usage line for the **Mileage Resource No.** on
  [Projects Setup](/help/projects/projects/). They are not submitted until the technician submits them.
- **Permissions.** Approvers and the back office need `PROJ USAGE ori` together with `BIFROST Full ori`;
  `BIFROST Read ori` with `PROJ USAGE ori` is enough to view. Field technicians record and submit their
  own usage with `PROJ FIELD TECH ori` and `BIFROST Read ori`.
- **Changed only through the operations.** An assistant cannot change the status, the time sheet link or
  the approval of a usage line through Bifröst's general data operations.

More about the app: [Bifröst Projects](/projects/). Parts from a technician's van:
[Technician Setup](/help/projects/technician-setup/).
