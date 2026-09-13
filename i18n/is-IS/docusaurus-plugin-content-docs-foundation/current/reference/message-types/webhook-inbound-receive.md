---
id: webhook-inbound-receive
title: "Webhook.Inbound.Receive"
sidebar_label: "Webhook.Inbound.Receive"
sidebar_position: 154
description: "Beiðni- og svarsamningur fyrir Webhook.Inbound.Receive Bifröst skilaboðategund."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálparkóða skilaboðategundarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálparkóðanum í forritinu, ekki þessari skrá.
:::


## Yfirlit
Receives a webhook envelope úr an external system og dispatches an integration event so AL subscribers getur react. The implementation never inspects the payload — handling er up til subscribers.

**Stefna**: Innkomandi · **Efnisgerð**: `text/json`

## Routing
Subscribers receive two routing strings:

- **EventSource**: envelope `source`. Defaults til `"webhook/inbound"` þegar empty.
- **EventType**: envelope `subject`. Falls back til `data.eventType` þegar `subject` er empty.

## Request `data` Shape

| Property | Gerð | Sjálfgefið | Lýsing |
|---|---|---|---|
| `eventType` | strengur | — | valfrjálst fallback fyrir EventType þegar `subject` er empty. |
| `source` | strengur | — | valfrjálst fallback fyrir EventSource (ekki currently consulted; routing Les envelope `source`). |
| `headers` | hlutur | `{}` | HTTP headers úr the Innkomandi request. Serialised til a strengur og passed til subscribers. |
| `body` | hvaða (hlutur, fylki, strengur, númer, bool, null) | `null` | Raw webhook payload. Serialised til a strengur og passed til subscribers. |

## Dæmi um beiðni
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

## Uppbygging svars

| Property | Gerð | Lýsing |
|---|---|---|
| `status` | strengur | Always `"Success"` (subscriber Villur surface as platform Villur með callstack). |
| `acknowledged` | sanngildi | Always `true`. The event was dispatched. |
| `handled` | sanngildi | `true` ef at least one subscriber set `Handled := true`; otherwise `false`. |

```json
{ "status": "Success", "acknowledged": true, "handled": false }
```

## Integration Event
Subscribe til handle webhooks:

```al
[EventSubscriber(ObjectType::Codeunit, Codeunit::"Webhook Inbound Events ori", 'OnWebhookReceived', '', false, false)]
local procedure OnWebhookReceived(EventSource: Text; EventType: Text; HeadersJson: Text; BodyJson: Text; var Handled: Boolean)
begin
    // Filter on EventSource / EventType, parse BodyJson, then set Handled := true.
end;
```

## Villur
The implementation throws no Villur of its own. hvaða Villa raised inside a subscriber propagates og surfaces as a platform Villa með callstack.

## Tengdar skilaboðategundir
- `Help.MessageTypes.Get`
- `Help.Implementation.Get`

