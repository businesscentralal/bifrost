---
id: item-attribute-create
title: "Item.Attribute.Create"
sidebar_label: "Item.Attribute.Create"
sidebar_position: 2
description: "Request and response contract for the Item.Attribute.Create Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


## Overview

Assigns attribute values to an item. Idempotent when the mapping already has the same value (`changed: false`). A different existing value returns a structured Error unless `overwrite: true`.

**Direction:** Inbound  
**Content-Type:** `text/json`

## Request Example

```json
{ "type": "Item.Attribute.Create", "subject": "1000", "data": { "attributes": [ { "name": "Color", "type": "Option", "value": "Blue", "createValueIfMissing": true } ] } }
```

## Response Shape

```json
{ "status": "Success", "itemNo": "1000", "results": [ { "attributeName": "Color", "value": "Blue", "changed": true, "attributeId": 1, "valueId": 3 } ] }
```

## Errors

| Error | Cause |
|---|---|
| mapping conflict | Mapping exists with a different value and `overwrite` is not true. |
| blocked item | Item is Blocked and `allowBlocked` is not true. |

## Related Message Types

- `Item.Attribute.Get`
- `Item.Attribute.Update`
- `Item.AttributeDefinition.Create`
