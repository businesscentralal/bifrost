---
id: documentexchange-advania-getdocumenthistory
title: "DocumentExchange.Advania.GetDocumentHistory"
sidebar_label: "DocumentExchange.Advania.GetDocumentHistory"
sidebar_position: 8
description: "Beiðni- og svarsamningur fyrir DocumentExchange.Advania.GetDocumentHistory Bifrastar-skilaboðagerð."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálpar-codeunit skilaboðagerðarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálpar-codeunitinu í forritinu, ekki þessari skrá.
:::


Skilar activity log (dagbók) fyrir a skjal.

## Beiðni
| Reitur | Gerð | nauðsynlegt |
|-------|------|----------|
| messageId | string | **Yes** |

## Svar
Paged envelope: `{ count, hasMore, items[] }`.

### Item fields
| Reitur | Gerð | Lýsing |
|-------|------|-------------|
| logtime | datetime | Þegar the event occurred (UTC) |
| username | string | User who triggered the event |
| module | string | System module (e.g. SubmitTransaction) |
| event | string | Event Gerð (e.g. SubmitTransaction, StatusChange) |
| logtext | string | Additional details (nullable) |

## Typed Access (Unified Buffer)
Svarið items map
onto `DocEx Status Buffer ori` færslur með unified Reitur names.

## Typical events
- SubmitTransaction: skjal was submitted til the system
- StatusChange: Status was updated (e.g. marked as delivered)


