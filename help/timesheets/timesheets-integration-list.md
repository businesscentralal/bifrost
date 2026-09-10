---
id: timesheets-integration-list
title: "Timesheets Integration"
sidebar_label: "Integration Links"
sidebar_position: 3
---

The **Timesheets Integration** page lists the links between Business Central records and Clockify objects — which Business Central customer is which Clockify client, which project is which Clockify project, which Work Type is which Clockify tag, and so on. The connector reads these links when it synchronises time entries, so a Clockify entry can be resolved to the right Business Central job, resource and work type.

The page is an administrative view and cannot be edited. Links are created and maintained by integrators through the Bifröst `Data.Records.Get` and `Data.Records.Set` message types, not from this page. It is reached from the **Integration Links** action on [Timesheets Setup](/help/timesheets/timesheets-setup/).

## Fields

| Field | Description |
| --- | --- |
| Entry No. | The entry number of the integration link. |
| BC Table No. | The Business Central table the linked record belongs to. |
| BC Code | The human-readable key of the Business Central record. |
| BC SystemId | The SystemId of the linked Business Central record. Hidden by default; add it with **Personalise** when you need the exact record identity. |
| Clockify Type | The kind of Clockify object the record is linked to. |
| Clockify Name | The display name of the linked Clockify object. |
| Clockify Id | The identifier of the linked Clockify object. |
| Clockify Workspace Id | The Clockify workspace the object lives in. Hidden by default. |
| Reversed | Whether the link has been broken. |
| Reversed At | When the link was reversed. |

## How links are retired

A link is never deleted outright. When it is broken it is marked **Reversed** and stamped with **Reversed At**, so the history of what was once connected to what survives. A retention policy purges reversed rows about a month later.

That is why the list can contain more than one row for the same Business Central record: the active link is the one that is not reversed.
