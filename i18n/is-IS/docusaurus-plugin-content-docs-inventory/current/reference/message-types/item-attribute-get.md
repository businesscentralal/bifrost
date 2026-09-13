---
id: item-attribute-get
title: "Item.Attribute.Get"
sidebar_label: "Item.Attribute.Get"
sidebar_position: 1
description: "Request and response contract for the Item.Attribute.Get Bifröst message type."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálparkóðaeiningu skilaboðategundarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálparkóðaeiningunni í forritinu, ekki þessari skrá.
:::


## Yfirlit

Skilar eigind definitions og assigned gildi fyrir one eða more vörur án multi-table `Data.Records.Get` joins.

**Direction:** Út á við (read-only)  
**Gagnategund:** `text/json`

## Identifier Úrlausn Order

1. `subject` — GUID = `Item.SystemId`, otherwise `Item.No.`
2. `data.itemNo`
3. `data.itemId` / `data.id` / `data.systemId` / `data.recordSystemId`
4. `data.tableView`

## Færibreytur beiðni

| Parameter | Type | Nauðsynlegt | Notes |
|---|---|---|---|
| `includeUnassigned` | boolean | No | Default false. When true, listar defined eiginleikar með empty gildi. |
| `attributeNames` | string[] | No | Filter by eigind heiti. |
| `attributeIds` | integer[] | No | Filter by eigind id. |

## Dæmi um beiðni

```json
{ "type": "Item.Attribute.Get", "subject": "1000", "data": { "attributeNames": ["Color"] } }
```

## Snið svars

```json
{ "status": "Success", "items": [ { "itemNo": "1000", "itemSystemId": "...", "attributes": [ { "attributeId": 1, "attributeName": "Color", "type": "Option", "unitOfMeasure": "", "valueId": 3, "value": "Blue", "numericValue": null, "dateValue": null } ] } ] }
```

## Villas

| Villa | Cause |
|---|---|
| `No items found matching the specified criteria.` | Empty resolved vara set. |

## Tengdar skilaboðategundir

- `Item.Attribute.Create`
- `Item.Attribute.Update`
- `Item.AttributeDefinition.Create`
