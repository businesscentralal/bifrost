---
id: documentexchange-unimaze-getinbox
title: "DocumentExchange.Unimaze.GetInbox"
sidebar_label: "DocumentExchange.Unimaze.GetInbox"
sidebar_position: 62
description: "Request and response contract for the DocumentExchange.Unimaze.GetInbox Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


Lists all received documents for a receiver endpoint. Includes both read and unread
documents (all statuses). Use GetUnread for pending-only documents.

## Request

### Advania
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| endpointId | string | **Yes** | Receiver endpoint ID (kennitala) |
| year | integer | **Yes** | Year (e.g. 2025) |
| month | integer | No | Month 1–12; omit for full year |
| skip | integer | No | Offset (default 0) |
| take | integer | No | Limit (default 100) |

### Unimaze
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| skip | integer | No | Offset (default 0) |
| take | integer | No | Limit (default 100) |

Unimaze returns all inbound messages without date filtering.

## Response
Paged envelope: `{ skip, take, count, hasMore, items[] }`.
Item fields are identical to GetUnread (uuid, from_ean, document_id, amounts, dates, etc.).

## Typed Access (Unified Buffer)
The response items map onto
`DocEx Inbox Buffer ori` records with unified field names across all partners.

## Tips
- Use GetUnread for pending-only documents (more efficient).
- Advania: Add month parameter for high-volume endpoints to reduce response size.
- Unimaze: Response is not date-filtered — use skip/take for pagination.

