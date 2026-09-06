---
id: iceland-sms-status
title: "Iceland.SMS.Status"
sidebar_label: "Iceland.SMS.Status"
sidebar_position: 59
description: "Request and response contract for the Iceland.SMS.Status Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


Queries delivery status for a previously sent SMS.
Poll this after calling `Iceland.SMS.Send` with `deliveryReport: true`.

**Direction:** Outbound  
**Content-Type:** text/json  
**Authentication:** Síminn magnSMS API credentials — configure via **Bifrost Iceland Setup**.

## Use when
- Confirming delivery of a transactional notification (order confirmation, alert).
- Determining whether to retry a failed send.
- Cleaning up recipient lists (remove UNDELIVERABLE numbers).
- Only meaningful if `deliveryReport: true` was passed to `Iceland.SMS.Send`.

## Request

- **Subject** (required): The `messageId` returned by `Iceland.SMS.Send`.
- **Body**: Not used. Leave empty or pass `{}`.

## Response

| Field | Description |
|-------|-------------|
| `messageId` | The queried message ID |
| `deliveryStatus` | Current delivery state (see below) |
| `errorCode` | Carrier error code (0 = no error) |
| `timestamp` | UTC timestamp of the status event |

## Delivery Status Values

| Status | Meaning | Action |
|--------|---------|--------|
| ACCEPTED | Received by carrier, pending delivery | Poll again later |
| DELIVERED | Successfully delivered to handset | Final — success |
| EXPIRED | Carrier retries exhausted (device off/unreachable) | Final — consider retry |
| UNDELIVERABLE | Invalid number, disconnected, or landline | Final — remove from list |
| REJECTED | Blocked by carrier (content/spam filter) | Final — review content |

## AI/Agent playbook
1. Only call this if `deliveryReport: true` was set during the send — otherwise status will not be available.
2. ACCEPTED is a transient state — poll again after 30–60 seconds.
3. DELIVERED, EXPIRED, UNDELIVERABLE, and REJECTED are terminal states — stop polling.
4. On UNDELIVERABLE: remove the number from the send list (likely landline or disconnected).
5. On REJECTED: review the message content — carrier spam or content filter triggered.
6. Typical delivery time: &lt;30 seconds for online devices.
Capability boundary: read-only status check; no message is modified or re-sent.

## Notes

- Status is available only if `deliveryReport: true` was set on send.
- UNDELIVERABLE for 4xx/5xx prefixes means landline (cannot receive SMS).
- Iceland carriers: Síminn, Nova, Sýn. Number portability is automatic.
- Errors: `Subject is required. Provide the messageId from Iceland.SMS.Send.` — subject missing.

