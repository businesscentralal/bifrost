---
id: help-messagetypes-get
title: "Help.MessageTypes.Get"
sidebar_label: "Help.MessageTypes.Get"
sidebar_position: 64
description: "Request and response contract for the Help.MessageTypes.Get Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


## Overview
Returns every value of the `Bifrost Message Type` enum together with its filter table number, description, and direction. Use this to discover what message types are available in the current deployment, including extensions that have added their own values.

## Direction
Outbound

## Response Content Type
`text/json`

## Request Parameters
| Parameter | Location | Type | Required | Description |
|-----------|----------|------|----------|-------------|
| subject | Bifrost field | Text | No | When set, returns only the message type matching this name. Omit to return all. |
| onlyEnabled | data (JSON body) | Boolean | No | When `true`, returns only message types enabled for the current user. Default: `false`. |

## Request Examples

**All message types:**
```json
{ "type": "Help.MessageTypes.Get" }
```

**Single message type by name:**
```json
{ "type": "Help.MessageTypes.Get", "subject": "Data.Records.Get" }
```

**Only enabled types:**
```json
{ "type": "Help.MessageTypes.Get", "data": { "onlyEnabled": true } }
```

## Response Shape
```json
{
  "status": "Success",
  "result": [
    {
      "name": "Help.Tables.Get",
      "isEnabled": true,
      "filterTableNo": 0,
      "description": "Returns a list of all available tables in the database with their ID and name.",
      "messageDirection": "Outbound"
    }
  ]
}
```

## Result Fields
| Field | Type | Description |
|-------|------|-------------|
| name | Text | Enum value name, used as the message `type` (e.g. `Help.Tables.Get`) |
| isEnabled | Boolean | `true` if the current user has permission to use this message type |
| filterTableNo | Integer | 0 when generic, otherwise the BC table the message type operates on |
| description | Text | Short description from the implementation codeunit |
| messageDirection | Text | `Inbound` (write) or `Outbound` (read) |

## Related Message Types
- `Help.Implementation.Get`
- `Help.Tables.Get`

