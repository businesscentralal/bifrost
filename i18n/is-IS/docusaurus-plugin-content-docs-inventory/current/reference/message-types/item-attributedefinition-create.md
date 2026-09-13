---
id: item-attributedefinition-create
title: "Item.AttributeDefinition.Create"
sidebar_label: "Item.AttributeDefinition.Create"
sidebar_position: 4
description: "Request and response contract for the Item.AttributeDefinition.Create Bifröst message type."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálparkóðaeiningu skilaboðategundarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálparkóðaeiningunni í forritinu, ekki þessari skrá.
:::


## Yfirlit

Býr til an vara eigind definition (and optional option gildi) independently of any vara. Duplicate heitis return a structured Villa.

**Direction:** Inn á við  
**Gagnategund:** `text/json`

## Dæmi um beiðni

```json
{ "type": "Item.AttributeDefinition.Create", "data": { "name": "Finish", "type": "Option", "optionValues": ["Matte", "Gloss"] } }
```

## Snið svars

```json
{ "status": "Success", "attributeId": 2, "attributeName": "Finish", "type": "Option", "createdValues": [ { "valueId": 6, "value": "Matte" } ] }
```

## Tengdar skilaboðategundir

- `Item.Attribute.Create`
- `Item.Attribute.Get`
