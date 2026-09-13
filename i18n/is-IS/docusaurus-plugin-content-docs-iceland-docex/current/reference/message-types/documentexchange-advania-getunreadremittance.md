---
id: documentexchange-advania-getunreadremittance
title: "DocumentExchange.Advania.GetUnreadRemittance"
sidebar_label: "DocumentExchange.Advania.GetUnreadRemittance"
sidebar_position: 22
description: "Beiðni- og svarsamningur fyrir DocumentExchange.Advania.GetUnreadRemittance Bifrastar-skilaboðagerð."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálpar-codeunit skilaboðagerðarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálpar-codeunitinu í forritinu, ekki þessari skrá.
:::


Lists unread remittance advice skjöl. RemittanceAdvice skjöl notify you of viðskiptavinur greiðslur.

## Beiðni
| Reitur | Gerð | nauðsynlegt | Lýsing |
|-------|------|----------|-------------|
| endpointId | string | No | Filter til specific Endapunktur (kennitala) |
| skip | integer | No | Offset (default 0) |
| take | integer | No | Limit (default 100, max 500) |

## Svar
Paged envelope með items[]. Same as GetUnread but Aðeins RemittanceAdvice skjöl. Extra fields:
| Reitur | Gerð | Lýsing |
|-------|------|-------------|
| remittance_document_reference | string | The invoice number this greiðsla relates til |
| rdr2 | string | Secondary greiðsla reference |

## Verkflæði: greiðsla Matching
```
1. DocumentExchange.Advania.GetUnreadRemittance { "endpointId": "5801120800" }
2. For each item: match remittance_document_reference to your posted invoice
3. Mark payment applied in BC
4. DocumentExchange.Advania.UpdateStatus { "messageId": "<uuid>", "status": 3 }
```


