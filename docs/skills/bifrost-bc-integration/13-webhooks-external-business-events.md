---
id: 13-webhooks-external-business-events
title: "13. Webhooks (External Business Events)"
sidebar_label: "13. Webhooks (External Business Events)"
sidebar_position: 15
---

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

---
