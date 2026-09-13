---
id: item-attribute-update
title: "Item.Attribute.Update"
sidebar_label: "Item.Attribute.Update"
sidebar_position: 3
description: "Request and response contract for the Item.Attribute.Update Bifröst message type."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálparkóðaeiningu skilaboðategundarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálparkóðaeiningunni í forritinu, ekki þessari skrá.
:::


## Yfirlit

Changes an existing vara↔eigind mapping gildi og returns before/after. Mapping verður already exist — otherwise use `Item.Attribute.Create`.

**Direction:** Inn á við  
**Gagnategund:** `text/json`

## Dæmi um beiðni

```json
{ "type": "Item.Attribute.Update", "subject": "1000", "data": { "attributes": [ { "name": "Color", "value": "Red" } ] } }
```

## Snið svars

```json
{ "status": "Success", "itemNo": "1000", "results": [ { "attributeName": "Color", "before": "Blue", "after": "Red", "attributeId": 1, "valueId": 5 } ] }
```

## Tengdar skilaboðategundir

- `Item.Attribute.Create`
- `Item.Attribute.Get`
