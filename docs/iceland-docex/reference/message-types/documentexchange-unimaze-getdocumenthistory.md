---
id: documentexchange-unimaze-getdocumenthistory
title: "DocumentExchange.Unimaze.GetDocumentHistory"
sidebar_label: "DocumentExchange.Unimaze.GetDocumentHistory"
sidebar_position: 57
description: "Request and response contract for the DocumentExchange.Unimaze.GetDocumentHistory Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


Returns the activity log (dagbók) for a document.

## Request
| Field | Type | Required |
|-------|------|----------|
| messageId | string | **Yes** |

## Response
Paged envelope: `{ count, hasMore, items[] }`.

### Item fields
| Field | Type | Description |
|-------|------|-------------|
| logtime | datetime | When the event occurred (UTC) |
| username | string | User who triggered the event |
| module | string | System module (e.g. SubmitTransaction) |
| event | string | Event type (e.g. SubmitTransaction, StatusChange) |
| logtext | string | Additional details (nullable) |

## Typed Access (Unified Buffer)
The response items map
onto `DocEx Status Buffer ori` records with unified field names.

## Typical events
- SubmitTransaction: Document was submitted to the system
- StatusChange: Status was updated (e.g. marked as delivered)

