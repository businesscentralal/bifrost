---
id: documentexchange-advania-getstatuses
title: "DocumentExchange.Advania.GetStatuses"
sidebar_label: "DocumentExchange.Advania.GetStatuses"
sidebar_position: 19
description: "Request and response contract for the DocumentExchange.Advania.GetStatuses Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


> **Availability:** Advania only. Unimaze uses a fixed set (delivered/failed/imported/pending).

Lists all available document exchange statuses. Use this to understand status codes
returned by StatusSync, GetDocumentInfo, GetUnread, and other message types.

## When to Use
- Looking up what a status_id means
- Determining which statuses can be set by receivers (UpdateStatus)
- Building status displays or mappings in BC

## Request
No parameters required.

## Response
```json
{ "items": [{ "status_id": 1, "status": "ssUnDeliverd", "description": "Ósóttur", "receiver_can_use": "Y" }], "count": 21 }
```

| Field | Type | Description |
|-------|------|-------------|
| status_id | integer | Numeric ID (use in UpdateStatus, returned by StatusSync) |
| status | string | Code name (e.g. ssUnDeliverd, ssDeliverd, ssApproved) |
| description | string | Icelandic description |
| receiver_can_use | string | Y = receivers can set this via UpdateStatus, N = system-only |

## Key Status Groups
| Category | IDs | Meaning |
|----------|-----|---------|
| Undelivered | 1, 11, 28, 30, 31, 200 | Document not yet received by recipient |
| Delivered | 2, 3, 10, 13, 14, 90 | Recipient has received the document |
| Approval | 20, 21, 22, 23 | Receiver workflow: in process / approved / denied / paid |
| Error | 4, 5, 6, 7, 992 | Delivery failed, rejected, or cancelled |

## Related Message Types
- **StatusSync** — polls exchange and maps status_id to BC field 711
- **UpdateStatus** — sets status on received documents (only receiver_can_use=Y statuses)

