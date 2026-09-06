---
id: documentexchange-advania-getattachments
title: "DocumentExchange.Advania.GetAttachments"
sidebar_label: "DocumentExchange.Advania.GetAttachments"
sidebar_position: 5
description: "Request and response contract for the DocumentExchange.Advania.GetAttachments Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


> **Availability:** Advania only. On Unimaze, attachments are embedded in the UBL XML.

Lists all attachments in a document (external links and BASE64 embedded).

## Request
| Field | Type | Required |
|-------|------|----------|
| messageId | string | **Yes** |

## Response
Paged envelope: `{ count, hasMore, items[] }`.

### Item fields
| Field | Type | Description |
|-------|------|-------------|
| uuid | string | Parent document UUID |
| id | string | Attachment identifier |
| document_type | string | MIME type description (nullable) |
| filename | string | Original filename (nullable) |
| mimecode | string | MIME code e.g. application/pdf (nullable) |
| binary_object | string | BASE64-encoded content (nullable, can be large) |
| uri | string | External link URL (nullable) |

## Note
Many invoices have no real attachments — items may appear with null fields.

