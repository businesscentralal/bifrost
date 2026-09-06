---
id: documentexchange-advania-getunreadremittance
title: "DocumentExchange.Advania.GetUnreadRemittance"
sidebar_label: "DocumentExchange.Advania.GetUnreadRemittance"
sidebar_position: 22
description: "Request and response contract for the DocumentExchange.Advania.GetUnreadRemittance Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


Lists unread remittance advice documents. RemittanceAdvice documents notify you of customer payments.

## Request
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| endpointId | string | No | Filter to specific endpoint (kennitala) |
| skip | integer | No | Offset (default 0) |
| take | integer | No | Limit (default 100, max 500) |

## Response
Paged envelope with items[]. Same as GetUnread but only RemittanceAdvice documents. Extra fields:
| Field | Type | Description |
|-------|------|-------------|
| remittance_document_reference | string | The invoice number this payment relates to |
| rdr2 | string | Secondary payment reference |

## Workflow: Payment Matching
```
1. DocumentExchange.Advania.GetUnreadRemittance { "endpointId": "5801120800" }
2. For each item: match remittance_document_reference to your posted invoice
3. Mark payment applied in BC
4. DocumentExchange.Advania.UpdateStatus { "messageId": "<uuid>", "status": 3 }
```

