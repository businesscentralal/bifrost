---
id: help-implementation-get
title: "Help.Implementation.Get"
sidebar_label: "Help.Implementation.Get"
sidebar_position: 54
description: "Request and response contract for the Help.Implementation.Get Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


## Overview
Returns the runtime help markdown document for any message type. Pass the message type name (e.g. `Help.Tables.Get`) in the Bifrost `subject`. The implementation looks up the enum value and calls `GetMessageHelpAsMarkdownDocument` on the matching implementation codeunit.

## Direction
Outbound

## Response Content Type
`text/markdown`

## Request Parameters
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| subject | Text | Yes | Message type name, e.g. `Help.Tables.Get` |

## Request Example
```json
{ "type": "Help.Implementation.Get", "subject": "Help.Tables.Get" }
```

## Response Shape
Raw markdown text (no JSON envelope). The exact markdown returned by the target implementation help codeunit.

## Errors
| Condition | Error message |
|-----------|---------------|
| subject is empty | `Subject field must contain the message type name (e.g., "Help.Tables.Get")` |
| subject not a known enum value | `Message type "{name}" is not valid or not found.` |

## Related Message Types
- `Help.MessageTypes.Get`

