# Webhooks

Both directions of the webhook story: `Webhook.Inbound.Receive` for events pushed into Business Central and fanned out to subscribers, and the external business events Business Central raises when a Bifröst message completes or fails.

[← back to SKILL.md](../SKILL.md) · originally sections 7.11, 13 of the single-file skill.

---
### 7.11 WEBHOOK INBOUND OPERATIONS

The inbound side of webhooks: external systems push events into BC through the Bifrost website,
which forwards them as Bifrost tasks. Subscriber extensions handle the domain logic.

This is the **inbound counterpart** to the outbound External Business Events documented in §13.

#### `Webhook.Inbound.Receive` — receive a forwarded webhook and fan out to subscribers

Direction: **Inbound** (external system → BC)

The Bifrost website receives a webhook at `/api/webhook?companyId={guid}`, validates the
`X-Webhook-Secret` header, allowlists forwardable HTTP headers, and POSTs a Bifrost task
to BC with `type: "Webhook.Inbound.Receive"`.

**Envelope mapping:**

| Envelope field | Used for |
|---|---|
| `source` | Source system identifier, e.g. `"scale/v23"`. Defaults to `"webhook/inbound"` when empty. Propagated to the integration event as `EventSource`. |
| `subject` | Event type, e.g. `"shipment.confirmed"`. Falls back to `data.eventType` when empty. Propagated as `EventType`. |
| `data` | JSON object with shape `{ eventType, source, headers, body }`. |

**data field shape:**

| Field | Type | Description |
|---|---|---|
| `eventType` | string | Mirrors envelope `subject`. |
| `source` | string | Mirrors envelope `source`. |
| `headers` | object | Allowlisted HTTP headers (lowercase keys). |
| `body` | object \| array \| null | Original webhook request body, parsed as JSON. |

**Request:**

```json
{
  "specversion": "1.0",
  "type": "Webhook.Inbound.Receive",
  "source": "scale/v23",
  "subject": "shipment.confirmed",
  "data": {
    "eventType": "shipment.confirmed",
    "source": "scale/v23",
    "headers": {
      "x-webhook-id": "evt_01HX9F2G7B",
      "x-webhook-source": "scale/v23"
    },
    "body": {
      "shipmentNo": "S-2026-00042",
      "orderNo": "SO-105988",
      "confirmedAt": "2026-05-27T09:14:22Z"
    }
  }
}
```

**Response:**

```json
{
  "status": "Success",
  "acknowledged": true,
  "handled": true
}
```

| Field | Description |
|---|---|
| `status` | `"Success"` when the event dispatched. `"Error"` if a subscriber raised. |
| `acknowledged` | Always `true` — confirms BC consumed the message. |
| `handled` | `true` when at least one subscriber set `Handled := true`. `false` means no subscriber claimed the event. |

**Subscriber pattern (AL):**

Subscriber extensions hook into `Codeunit::"Webhook Inbound Events"` and filter by source:

```al
[EventSubscriber(ObjectType::Codeunit, Codeunit::"Webhook Inbound Events",
    'OnWebhookReceived', '', false, false)]
local procedure HandleScaleWebhook(
    EventSource: Text; EventType: Text;
    HeadersJson: Text; BodyJson: Text; var Handled: Boolean)
var
    Body: JsonObject;
begin
    if not EventSource.StartsWith('scale/') then
        exit;
    if BodyJson <> 'null' then
        Body.ReadFrom(BodyJson);
    case EventType of
        'shipment.confirmed': ProcessShipmentConfirmed(Body);
        'receipt.confirmed':  ProcessReceiptConfirmed(Body);
        else
            exit;
    end;
    Handled := true;
end;
```

**Notes:**

- A response of `acknowledged: true, handled: false` is a useful diagnostic during integration
  testing — confirms the webhook reached BC but no domain handler matched.
- Header keys are lowercased by the receiver. Always look up headers in lowercase.
- Webhooks may be delivered more than once. Track an event ID from headers (`x-webhook-id`)
  or the body and skip duplicates inside your subscriber.
- If a subscriber raises, the error propagates through `ExecuteBifrostTask` and the task
  is recorded as failed. Wrap risky logic in `if Codeunit.Run(...)` to isolate failures.
- Authentication, header allowlisting, and secret rotation are configured on the Bifrost
  website, not in BC.

**Related:** `Help.MessageTypes.Get`, `Help.Implementation.Get`. For outbound webhooks BC raises
to external subscribers (`BifrostMessageCompleted`, `BifrostMessageFailed`), see §13.

---

## 13. Webhooks (External Business Events)

> **Outbound direction.** This section covers webhooks BC raises **out** to external subscribers.
> For the **inbound** direction (external systems pushing events **into** BC), see §7.11
> (`Webhook.Inbound.Receive`).

BC raises two native external events:

| Event | Raised when |
|---|---|
| `BifrostMessageCompleted` | Message processes successfully |
| `BifrostMessageFailed` | Message processing fails |

Subscribe via BC's Event Subscriptions page. Webhook payload (minimal by design):

```json
{
  "MessageId": "a8f5f167-8f2c-4a42-9b3e-5c6c7d8e9f0a",
  "MessageType": "Customer.CreditLimit.Get",
  "ResponseContentLink": "/api/origo/bifrost/v1.0/responses(a8f5f167-…)/data",
  "Timestamp": "2026-03-08T14:30:22Z"
}
```

After receiving the webhook, GET `ResponseContentLink` (with Bearer token) to retrieve the full result.
