---
id: item-attribute-create
title: "Item.Attribute.Create"
sidebar_label: "Item.Attribute.Create"
sidebar_position: 2
description: "Request and response contract for the Item.Attribute.Create Bifröst message type."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálparkóðaeiningu skilaboðategundarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálparkóðaeiningunni í forritinu, ekki þessari skrá.
:::


## Yfirlit

Assigns eigind gildi to an vara. Idempotent þegar the mapping already has the same gildi (`changed: false`). A different existing gildi returns a structured Villa unless `overwrite: true`.

**Direction:** Inn á við  
**Gagnategund:** `text/json`

## Dæmi um beiðni

```json
{ "type": "Item.Attribute.Create", "subject": "1000", "data": { "attributes": [ { "name": "Color", "type": "Option", "value": "Blue", "createValueIfMissing": true } ] } }
```

## Snið svars

```json
{ "status": "Success", "itemNo": "1000", "results": [ { "attributeName": "Color", "value": "Blue", "changed": true, "attributeId": 1, "valueId": 3 } ] }
```

## Villas

| Villa | Cause |
|---|---|
| mapping conflict | Mapping er til með a different gildi og `overwrite` er not true. |
| blocked vara | Item er Blocked og `allowBlocked` er not true. |

## Tengdar skilaboðategundir

- `Item.Attribute.Get`
- `Item.Attribute.Update`
- `Item.AttributeDefinition.Create`
