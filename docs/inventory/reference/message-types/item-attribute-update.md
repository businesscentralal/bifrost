---
id: item-attribute-update
title: "Item.Attribute.Update"
sidebar_label: "Item.Attribute.Update"
sidebar_position: 3
description: "Request and response contract for the Item.Attribute.Update Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


## Overview

Changes an existing item↔attribute mapping value and returns before/after. Mapping must already exist — otherwise use `Item.Attribute.Create`.

**Direction:** Inbound  
**Content-Type:** `text/json`

## Request Example

```json
{ "type": "Item.Attribute.Update", "subject": "1000", "data": { "attributes": [ { "name": "Color", "value": "Red" } ] } }
```

## Response Shape

```json
{ "status": "Success", "itemNo": "1000", "results": [ { "attributeName": "Color", "before": "Blue", "after": "Red", "attributeId": 1, "valueId": 5 } ] }
```

## Related Message Types

- `Item.Attribute.Create`
- `Item.Attribute.Get`
