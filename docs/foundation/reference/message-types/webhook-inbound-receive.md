---
id: webhook-inbound-receive
title: "Webhook.Inbound.Receive"
sidebar_label: "Webhook.Inbound.Receive"
sidebar_position: 154
description: "Request and response contract for the Webhook.Inbound.Receive Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


## Overview
Receives a webhook envelope from an external system and dispatches an integration event so AL subscribers can react. The implementation never inspects the payload — handling is up to subscribers.

**Direction**: Inbound · **Content-Type**: `text/json`

## Routing
Subscribers receive two routing strings:

- **EventSource**: envelope `source`. Defaults to `"webhook/inbound"` when empty.
- **EventType**: envelope `subject`. Falls back to `data.eventType` when `subject` is empty.

## Request `data` Shape

| Property | Type | Default | Description |
|---|---|---|---|
| `eventType` | string | — | Optional fallback for EventType when `subject` is empty. |
| `source` | string | — | Optional fallback for EventSource (not currently consulted; routing reads envelope `source`). |
| `headers` | object | `{}` | HTTP headers from the inbound request. Serialised to a string and passed to subscribers. |
| `body` | any (object, array, string, number, bool, null) | `null` | Raw webhook payload. Serialised to a string and passed to subscribers. |

## Request Example
```json
{
  "source": "github",
  "subject": "issues.opened",
  "data": {
    "headers": { "X-GitHub-Delivery": "abc-123" },
    "body":    { "action": "opened", "issue": { "number": 42 } }
  }
}
```

## Response Shape

| Property | Type | Description |
|---|---|---|
| `status` | string | Always `"Success"` (subscriber errors surface as platform errors with callstack). |
| `acknowledged` | boolean | Always `true`. The event was dispatched. |
| `handled` | boolean | `true` if at least one subscriber set `Handled := true`; otherwise `false`. |

```json
{ "status": "Success", "acknowledged": true, "handled": false }
```

## Integration Event
Subscribe to handle webhooks:

```al
[EventSubscriber(ObjectType::Codeunit, Codeunit::"Webhook Inbound Events ori", 'OnWebhookReceived', '', false, false)]
local procedure OnWebhookReceived(EventSource: Text; EventType: Text; HeadersJson: Text; BodyJson: Text; var Handled: Boolean)
begin
    // Filter on EventSource / EventType, parse BodyJson, then set Handled := true.
end;
```

## Errors
The implementation throws no errors of its own. Any error raised inside a subscriber propagates and surfaces as a platform error with callstack.

## Related Message Types
- `Help.MessageTypes.Get`
- `Help.Implementation.Get`

