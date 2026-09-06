---
id: documentexchange-advania-getauthorizedpartners
title: "DocumentExchange.Advania.GetAuthorizedPartners"
sidebar_label: "DocumentExchange.Advania.GetAuthorizedPartners"
sidebar_position: 6
description: "Request and response contract for the DocumentExchange.Advania.GetAuthorizedPartners Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


> **Availability:** Advania only. Unimaze authenticates via API key with implicit endpoint access.

Lists the endpoint IDs (kennitala/EAN) that the authenticated user can manage.
**Call this first** to discover which EANs to use with GetUnread, GetInbox, SubmitDocument, etc.

## When to Use
- Discovering which companies you can send/receive documents for
- Getting the EAN values needed for other message types
- Verifying send/receive permissions before attempting operations

## Request
No parameters required.

## Response
```json
{ "items": [
  { "ean": "4112032630", "name": "Kappi ehf", "can_get_documents": "Y", "can_submit_documents": "Y", "can_view_documents": "Y" }
], "count": 2 }
```

| Field | Type | Description |
|-------|------|-------------|
| ean | string | Endpoint ID (kennitala) |
| name | string | Company name |
| national_identifier | string | Same as ean |
| can_get_documents | string | Y = can fetch incoming documents |
| can_submit_documents | string | Y = can send outgoing documents |
| can_view_documents | string | Y = can view in web UI |

## Typed Access (Unified Buffer)
The response items map
onto `DocEx Endpt Buffer ori` records with unified field names.

## Workflow Context
The `ean` values from this response are used as:
- `SenderEndpointId` in CreateInvoice xDocData
- `endpointId` parameter in GetUnread, GetInbox
- `issuer` parameter in LookupDocument

## Related
- **GetTradingPartners** — all registered partners (public directory)
- **GetUserAccess** — detailed user-level access for a specific endpoint

