---
id: documentexchange-advania-getstatuses
title: "DocumentExchange.Advania.GetStatuses"
sidebar_label: "DocumentExchange.Advania.GetStatuses"
sidebar_position: 19
description: "Beiðni- og svarsamningur fyrir DocumentExchange.Advania.GetStatuses Bifrastar-skilaboðagerð."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálpar-codeunit skilaboðagerðarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálpar-codeunitinu í forritinu, ekki þessari skrá.
:::


> **Availability:** Advania Aðeins. Unimaze uses a fixed set (delivered/failed/imported/pending).

Lists Allt available skjal exchange statuses. Notaðu this til understand status codes
returned by StatusSync, GetDocumentInfo, GetUnread, og other message types.

## Þegar til Notaðu
- Looking up what a status_id means
- Determining which statuses getur be set by receivers (UpdateStatus)
- Building status displays eða mappings in BC

## Beiðni
No parameters nauðsynlegt.

## Svar
```json
{ "items": [{ "status_id": 1, "status": "ssUnDeliverd", "description": "Ósóttur", "receiver_can_use": "Y" }], "count": 21 }
```

| Reitur | Gerð | Lýsing |
|-------|------|-------------|
| status_id | integer | Numeric ID (Notaðu in UpdateStatus, returned by StatusSync) |
| status | string | Code Heiti (e.g. ssUnDeliverd, ssDeliverd, ssApproved) |
| Lýsing | string | Icelandic Lýsing |
| receiver_can_use | string | Y = receivers getur set this via UpdateStatus, N = system-Aðeins |

## Key Status Groups
| Category | IDs | Meaning |
|----------|-----|---------|
| Undelivered | 1, 11, 28, 30, 31, 200 | skjal not yet received by recipient |
| Delivered | 2, 3, 10, 13, 14, 90 | Recipient has received the skjal |
| Approval | 20, 21, 22, 23 | Receiver Verkflæði: in process / approved / denied / paid |
| Error | 4, 5, 6, 7, 992 | Delivery failed, rejected, eða cancelled |

## Related Message Types
- **StatusSync** — polls exchange og maps status_id til BC Reitur 711
- **UpdateStatus** — sets status on received skjöl (Aðeins receiver_can_use=Y statuses)


