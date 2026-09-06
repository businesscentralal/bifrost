---
id: documentexchange-advania-inboxsince
title: "DocumentExchange.Advania.InboxSince"
sidebar_label: "DocumentExchange.Advania.InboxSince"
sidebar_position: 25
description: "Request and response contract for the DocumentExchange.Advania.InboxSince Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


Lists received documents since a timestamp. Use for incremental polling — more efficient than GetUnread for high-volume endpoints.

## Request
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| endpointId | string | No | Receiver endpoint (kennitala). Defaults to Company Information Registration No. |
| since | string | **Yes** | Timestamp in DDMMYYHHMI format (e.g. "0107261030" = 01 Jul 2026 10:30) |
| skip | integer | No | Offset (default 0) |
| take | integer | No | Limit (default 100, max 500) |

## Response
Paged envelope with items[]. Each item includes `datetime_stamp` — use the last one as `since` in the next poll.

## Workflow: Incremental Polling
```
1. First call: DocumentExchange.Advania.InboxSince { "endpointId": "5801120800", "since": "0101260000" }
   → Gets all documents since Jan 1 2026
   → Save the last item's datetime_stamp (e.g. "3006261742")
2. Next poll: DocumentExchange.Advania.InboxSince { "endpointId": "5801120800", "since": "3006261742" }
   → Gets only NEW documents since last poll
3. Process each document:
   DocumentExchange.Advania.GetDocument { "messageId": "<uuid>", "createIncomingDocument": true }
   DocumentExchange.Advania.UpdateStatus { "messageId": "<uuid>", "status": 3 }
```

## datetime_stamp format
DDMMYYHHMI — day(2) + month(2) + year(2) + hour(2) + minute(2). Example: "3006261742" = 30 Jun 2026 17:42.
This value comes FROM the response and is passed back as the `since` parameter in the next call.

