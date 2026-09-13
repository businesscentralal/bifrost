---
id: documentexchange-advania-inboxsince
title: "DocumentExchange.Advania.InboxSince"
sidebar_label: "DocumentExchange.Advania.InboxSince"
sidebar_position: 25
description: "Beiðni- og svarsamningur fyrir DocumentExchange.Advania.InboxSince Bifrastar-skilaboðagerð."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálpar-codeunit skilaboðagerðarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálpar-codeunitinu í forritinu, ekki þessari skrá.
:::


Lists received skjöl since a timestamp. Notaðu fyrir incremental polling — more efficient than GetUnread fyrir high-volume endpoints.

## Beiðni
| Reitur | Gerð | nauðsynlegt | Lýsing |
|-------|------|----------|-------------|
| endpointId | string | No | Receiver Endapunktur (kennitala). Defaults til fyrirtæki Information Registration No. |
| since | string | **Yes** | Timestamp in DDMMYYHHMI format (e.g. "0107261030" = 01 Jul 2026 10:30) |
| skip | integer | No | Offset (default 0) |
| take | integer | No | Limit (default 100, max 500) |

## Svar
Paged envelope með items[]. Each item includes `datetime_stamp` — Notaðu the last one as `since` in the next poll.

## Verkflæði: Incremental Polling
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
DDMMYYHHMI — day(2) + month(2) + year(2) + hour(2) + minute(2). Dæmi: "3006261742" = 30 Jun 2026 17:42.
This value comes frá Svarið og er passed back as the `since` parameter in the next Kallaðu á.


