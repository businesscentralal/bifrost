---
id: documentexchange-advania-getsent
title: "DocumentExchange.Advania.GetSent"
sidebar_label: "DocumentExchange.Advania.GetSent"
sidebar_position: 17
description: "Request and response contract for the DocumentExchange.Advania.GetSent Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


Lists all sent documents for an endpoint by year and optional month. Use to track outbox history.

## Request
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| endpointId | string | No | Sender endpoint (kennitala). Defaults to Company Information Registration No. |
| year | string | No | Year filter (default: current year) |
| month | string | No | Month filter 1-12 (omit for full year) |
| skip | integer | No | Offset (default 0) |
| take | integer | No | Limit (default 100, max 500) |

## Response
Paged envelope: `{ skip, take, count, hasMore, items[] }`. Same item structure as GetInbox/GetUnread.

## Workflow: Outbox Audit
```
1. DocumentExchange.Advania.GetAuthorizedPartners → get your endpointId
2. DocumentExchange.Advania.GetSent { "endpointId": "5801120800", "year": "2026", "month": "7" }
   → Returns all documents you sent in July 2026
3. For any item with status_id != 3 (not delivered):
   DocumentExchange.Advania.GetDocumentInfo { "messageId": "<uuid>" }
   → Check detailed delivery status and history
```

## Key status_id values in sent items
| status_id | Meaning |
|-----------|---------|
| 1 | Not yet delivered to recipient |
| 3 | Delivered successfully |
| 4 | Delivery error |
| 992 | Rejected by Peppol |

