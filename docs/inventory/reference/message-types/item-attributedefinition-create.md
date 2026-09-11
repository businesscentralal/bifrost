---
id: item-attributedefinition-create
title: "Item.AttributeDefinition.Create"
sidebar_label: "Item.AttributeDefinition.Create"
sidebar_position: 4
description: "Request and response contract for the Item.AttributeDefinition.Create Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


## Overview

Creates an item attribute definition (and optional option values) independently of any item. Duplicate names return a structured Error.

**Direction:** Inbound  
**Content-Type:** `text/json`

## Request Example

```json
{ "type": "Item.AttributeDefinition.Create", "data": { "name": "Finish", "type": "Option", "optionValues": ["Matte", "Gloss"] } }
```

## Response Shape

```json
{ "status": "Success", "attributeId": 2, "attributeName": "Finish", "type": "Option", "createdValues": [ { "valueId": 6, "value": "Matte" } ] }
```

## Related Message Types

- `Item.Attribute.Create`
- `Item.Attribute.Get`
