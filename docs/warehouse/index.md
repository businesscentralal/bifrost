---
id: index
title: "Bifröst Warehouse"
sidebar_label: "Overview"
sidebar_position: 1
slug: /
description: "Read bin content and open warehouse activities through dedicated Bifröst message types."
---

Bifröst Warehouse is a read-only feature app on Bifröst Foundation. It gives external systems and agents dedicated message types for inspecting bin content and open warehouse activities before they create or register warehouse work.

## Message types

| Message type | Direction | Purpose |
| --- | --- | --- |
| `Warehouse.BinContent.Get` | Outbound | Read bin content by item, location, bin, and variant. Supports table views and paging. |
| `Warehouse.Activity.Get` | Outbound | Read open picks, put-aways, and movements, with optional activity-line details. |

Both types return a `Success` response for list queries with no matches. `noOfRecords` reports the unpaged count; `skip` and `take` control the returned page.

### Warehouse.BinContent.Get

All filters are optional and can be combined. `tableView` accepts a Business Central table-view filter for fields not covered by the convenience filters.

```json
{
  "itemNo": "1000",
  "locationCode": "WHITE",
  "binCode": "B-01-01",
  "variantCode": "",
  "skip": 0,
  "take": 50
}
```

Each result includes the location, bin, item, variant, unit of measure, quantity, dedicated/fixed flags, zone, and bin type.

### Warehouse.Activity.Get

The type and header filters are optional and combine with `whseDocumentNo`, which matches an activity when one of its lines refers to that warehouse document. The supported `activityType` values are `Put-away`, `Pick`, and `Movement`. Only open activities are returned; registered activities and history are outside this app's current scope.

```json
{
  "activityType": "Pick",
  "whseDocumentNo": "WHSHIP-0004",
  "locationCode": "WHITE",
  "assignedUserId": "",
  "includeLines": true,
  "skip": 0,
  "take": 20
}
```

Use `no` or `systemId` to look up an activity. A supplied identifier that does not match an open activity returns a structured `Error`. `includeLines` defaults to `false`; when enabled, each header includes its warehouse activity lines and source document references.

## Requirements

- Microsoft Dynamics 365 Business Central 28.0 or later.
- Bifröst Foundation 28.0.0.0 or later.
- Assign the caller a Foundation permission set. Warehouse extends `BIFROST Read ori` and `BIFROST Full ori` with its message execution permissions.

## Where to go next

- [In-product help](/help/warehouse/)
- [Build on Bifröst](/extensibility/)