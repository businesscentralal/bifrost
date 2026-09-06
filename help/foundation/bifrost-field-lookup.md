---
id: bifrost-field-lookup
title: "Select Field"
sidebar_label: "Select Field"
sidebar_position: 7
---

The **Select Field** lookup page lets you browse and pick a field from a Business Central table. It is used when adding field access restrictions on the [Bifrost Field Accesses](/help/foundation/bifrost-field-accesses/) page – after selecting a table, use this lookup to choose the exact field to restrict.

## Columns

| Column | Description |
| --- | --- |
| **No.** | The internal field number used by Business Central to identify the field in the table. |
| **Field Name** | The internal programmatic name of the field as defined in the table object. |
| **Field Caption** | The display caption of the field as it appears in the Business Central user interface. |
| **Type** | The data type of the field (for example: Text, Integer, Decimal, Boolean, Date, Code). |
| **Class** | The field class: _Normal_ (stored), _FlowField_ (calculated), or _FlowFilter_ (filter parameter for FlowFields). |

## Usage

Select the row for the field you want to restrict and choose **OK**. The field number is written back to the **Field No.** column in the restrictions list, and the **Field Name** is populated automatically.
