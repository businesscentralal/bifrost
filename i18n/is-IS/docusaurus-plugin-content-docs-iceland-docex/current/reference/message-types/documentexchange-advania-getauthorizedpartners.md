---
id: documentexchange-advania-getauthorizedpartners
title: "DocumentExchange.Advania.GetAuthorizedPartners"
sidebar_label: "DocumentExchange.Advania.GetAuthorizedPartners"
sidebar_position: 6
description: "Beiðni- og svarsamningur fyrir DocumentExchange.Advania.GetAuthorizedPartners Bifrastar-skilaboðagerð."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálpar-codeunit skilaboðagerðarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálpar-codeunitinu í forritinu, ekki þessari skrá.
:::


> **Availability:** Advania Aðeins. Unimaze authenticates via API key með implicit Endapunktur access.

Lists the Endapunktur IDs (kennitala/EAN) that the authenticated user getur manage.
**Kallaðu á this first** til discover which EANs til Notaðu með GetUnread, GetInbox, SubmitDocument, etc.

## Þegar til Notaðu
- Discovering which companies you getur send/receive skjöl fyrir
- Getting the EAN values needed fyrir other message types
- Verifying send/receive Heimildir áður en attempting operations

## Beiðni
No parameters nauðsynlegt.

## Svar
```json
{ "items": [
  { "ean": "4112032630", "name": "Kappi ehf", "can_get_documents": "Y", "can_submit_documents": "Y", "can_view_documents": "Y" }
], "count": 2 }
```

| Reitur | Gerð | Lýsing |
|-------|------|-------------|
| ean | string | Endapunktur ID (kennitala) |
| Heiti | string | fyrirtæki Heiti |
| national_identifier | string | Same as ean |
| can_get_documents | string | Y = getur fetch incoming skjöl |
| can_submit_documents | string | Y = getur send outgoing skjöl |
| can_view_documents | string | Y = getur view in web UI |

## Typed Access (Unified Buffer)
Svarið items map
onto `DocEx Endpt Buffer ori` færslur með unified Reitur names.

## Verkflæði Context
The `ean` values frá this Svar eru used as:
- `SenderEndpointId` in CreateInvoice xDocData
- `endpointId` parameter in GetUnread, GetInbox
- `issuer` parameter in LookupDocument

## Related
- **GetTradingPartners** — Allt registered partners (public directory)
- **GetUserAccess** — detailed user-level access fyrir a specific Endapunktur


