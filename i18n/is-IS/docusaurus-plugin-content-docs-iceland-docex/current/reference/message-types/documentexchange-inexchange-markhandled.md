---
id: documentexchange-inexchange-markhandled
title: "DocumentExchange.InExchange.MarkHandled"
sidebar_label: "DocumentExchange.InExchange.MarkHandled"
sidebar_position: 46
description: "Beiðni- og svarsamningur fyrir DocumentExchange.InExchange.MarkHandled Bifrastar-skilaboðagerð."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálpar-codeunit skilaboðagerðarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálpar-codeunitinu í forritinu, ekki þessari skrá.
:::


Marks eina eða fleiri InExchange skjöl as handled/delivered.

## Beiðni
| Reitur | Gerð | nauðsynlegt | Lýsing |
|-------|------|----------|-------------|
| documentId | string | Yes* | stakan skjal ID til mark handled |
| documentIds | array | Yes* | Array of skjal IDs til mark handled |

*Gefðu upp either documentId eða documentIds.

## Svar
Confirmation of handled status update.


