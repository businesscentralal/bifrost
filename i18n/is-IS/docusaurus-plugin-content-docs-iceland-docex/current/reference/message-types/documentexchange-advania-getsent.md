---
id: documentexchange-advania-getsent
title: "DocumentExchange.Advania.GetSent"
sidebar_label: "DocumentExchange.Advania.GetSent"
sidebar_position: 17
description: "Beiðni- og svarsamningur fyrir DocumentExchange.Advania.GetSent Bifrastar-skilaboðagerð."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálpar-codeunit skilaboðagerðarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálpar-codeunitinu í forritinu, ekki þessari skrá.
:::


Lists Allt sent skjöl fyrir an Endapunktur by year og valfrjálst month. Notaðu til track outbox history.

## Beiðni
| Reitur | Gerð | nauðsynlegt | Lýsing |
|-------|------|----------|-------------|
| endpointId | string | No | Sender Endapunktur (kennitala). Defaults til fyrirtæki Information Registration No. |
| year | string | No | Year filter (default: current year) |
| month | string | No | Month filter 1-12 (omit fyrir fulla year) |
| skip | integer | No | Offset (default 0) |
| take | integer | No | Limit (default 100, max 500) |

## Svar
Paged envelope: `{ skip, take, count, hasMore, items[] }`. Same item structure as GetInbox/GetUnread.

## Verkflæði: Outbox Audit
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
| 1 | Not yet delivered til recipient |
| 3 | Delivered með góðum árangri |
| 4 | Delivery error |
| 992 | Rejected by Peppol |


