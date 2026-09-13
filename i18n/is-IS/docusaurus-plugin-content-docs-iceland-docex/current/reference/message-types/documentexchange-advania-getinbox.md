---
id: documentexchange-advania-getinbox
title: "DocumentExchange.Advania.GetInbox"
sidebar_label: "DocumentExchange.Advania.GetInbox"
sidebar_position: 15
description: "Beiðni- og svarsamningur fyrir DocumentExchange.Advania.GetInbox Bifrastar-skilaboðagerð."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálpar-codeunit skilaboðagerðarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálpar-codeunitinu í forritinu, ekki þessari skrá.
:::


Lists Allt received skjöl fyrir a receiver Endapunktur. Includes both read og unread
skjöl (Allt statuses). Notaðu GetUnread fyrir pending-Aðeins skjöl.

## Beiðni

### Advania
| Reitur | Gerð | nauðsynlegt | Lýsing |
|-------|------|----------|-------------|
| endpointId | string | **Yes** | Receiver Endapunktur ID (kennitala) |
| year | integer | **Yes** | Year (e.g. 2025) |
| month | integer | No | Month 1–12; omit fyrir fulla year |
| skip | integer | No | Offset (default 0) |
| take | integer | No | Limit (default 100) |

### Unimaze
| Reitur | Gerð | nauðsynlegt | Lýsing |
|-------|------|----------|-------------|
| skip | integer | No | Offset (default 0) |
| take | integer | No | Limit (default 100) |

Unimaze Skilar Allt inbound messages without date filtering.

## Svar
Paged envelope: `{ skip, take, count, hasMore, items[] }`.
Item fields eru identical til GetUnread (uuid, from_ean, document_id, amounts, dates, etc.).

## Typed Access (Unified Buffer)
Svarið items map onto
`DocEx Inbox Buffer ori` færslur með unified Reitur names across Allt partners.

## Tips
- Notaðu GetUnread fyrir pending-Aðeins skjöl (more efficient).
- Advania: Add month parameter fyrir high-volume endpoints til reduce Svar size.
- Unimaze: Svar er not date-filtered — Notaðu skip/take fyrir pagination.


