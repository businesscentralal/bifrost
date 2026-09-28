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
| onlyEnabled | data (JSON body) | Boolean | No | When `true`, returns only message types enabled for the current user. Default: `false`. `true` or `false`; any other value is an error. |
| includeKeywords | data (JSON body) | Boolean | No | When `true`, each row with keywords includes a `keywords` array in the caller's language. Pass `lcid` (e.g. `1039` for Icelandic, `1033` for English) to choose that language; without it the session language is used. Default: `false`, and the response is unchanged. Combines with `onlyEnabled`. `true` or `false`; any other value is an error. |

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
| keywords | Array of Text | Present only when `includeKeywords` is `true` and the type has keywords. Search terms in the caller's language. Never returned by `list_message_types`. |

## Availability
By default, this endpoint returns all enum values, including message types that are installed but not currently callable. Check `isEnabled` before invoking a type, or pass `onlyEnabled = true` in the request data to hide disabled types. Some Bifrost licensing and billing metadata types are production-only and intentionally return `isEnabled = false` in SaaS sandbox/dev environments.

## Related Message Types
- `Help.Implementation.Get`
- `Help.Tables.Get`

## Errors and warnings
Errors and warnings follow the shared shape - see [Errors and warnings](/foundation/reference/errors/).

