---
id: item-attribute-get
title: "Item.Attribute.Get"
sidebar_label: "Item.Attribute.Get"
sidebar_position: 1
description: "Request and response contract for the Item.Attribute.Get Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


## Overview

Returns attribute definitions and assigned values for one or more items without multi-table `Data.Records.Get` joins.

**Direction:** Outbound (read-only)  
**Content-Type:** `text/json`

## Identifier Resolution Order

1. `subject` — GUID = `Item.SystemId`, otherwise `Item.No.`
2. `data.itemNo`
3. `data.itemId` / `data.id` / `data.systemId` / `data.recordSystemId`
4. `data.tableView`

## Request Parameters

| Parameter | Type | Required | Notes |
|---|---|---|---|
| `includeUnassigned` | boolean | No | Default false. When true, lists defined attributes with empty values. |
| `attributeNames` | string[] | No | Filter by attribute name. |
| `attributeIds` | integer[] | No | Filter by attribute id. |

## Request Example

```json
{ "type": "Item.Attribute.Get", "subject": "1000", "data": { "attributeNames": ["Color"] } }
```

## Response Shape

```json
{ "status": "Success", "items": [ { "itemNo": "1000", "itemSystemId": "...", "attributes": [ { "attributeId": 1, "attributeName": "Color", "type": "Option", "unitOfMeasure": "", "valueId": 3, "value": "Blue", "numericValue": null, "dateValue": null } ] } ] }
```

## Errors

| Error | Cause |
|---|---|
| `No items found matching the specified criteria.` | Empty resolved item set. |

## Related Message Types

- `Item.Attribute.Create`
- `Item.Attribute.Update`
- `Item.AttributeDefinition.Create`
